const db = require('../config/db');

class TurnosGridCuotaService {
  // ==================== CÁLCULO DE CUOTAS ====================
  static async calcularCuotasDesdeVinculos(anio, mes) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      // Obtener personal con vínculo laboral activo
      const { rows: personal } = await client.query(`
        SELECT p.id as personal_id, vl.fuente_financiamiento_id, vl.tipo_personal_id,
               vl.carga_horaria, cff.nombre_fuente, ctp.nombre_tipo
        FROM personal p
        JOIN vinculos_laborales vl ON p.id = vl.personal_id
        LEFT JOIN cat_fuentes_financiamiento cff ON vl.fuente_financiamiento_id = cff.id
        LEFT JOIN cat_tipos_personal ctp ON vl.tipo_personal_id = ctp.id
        WHERE vl.fecha_fin IS NULL
          AND p.activo = true
      `);

      let procesados = 0;
      for (const p of personal) {
        let horas = 160; // default mensual
        if (p.carga_horaria) {
          const match = p.carga_horaria.match(/(\d+)/);
          if (match) horas = parseInt(match[1]);
          if (p.carga_horaria.toLowerCase().includes('semanal') || p.carga_horaria.toLowerCase().includes('semana')) {
            horas = Math.round(horas * 4.33);
          }
        }

        await client.query(`
          INSERT INTO turnos_grid_cuotas (personal_id, anio, mes, horas_obligatorias, fuente_financiamiento_id, tipo_contrato_id, origen)
          VALUES ($1, $2, $3, $4, $5, $6, 'AUTO')
          ON CONFLICT (personal_id, anio, mes, fuente_financiamiento_id, tipo_contrato_id) DO UPDATE SET
            horas_obligatorias = EXCLUDED.horas_obligatorias,
            updated_at = CURRENT_TIMESTAMP
        `, [p.personal_id, anio, mes, horas, p.fuente_financiamiento_id, p.tipo_personal_id]);

        procesados++;
      }

      await client.query('COMMIT');
      return { procesados, anio, mes };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  static async recalcularCuotasMes(anio, mes) {
    return this.calcularCuotasDesdeVinculos(anio, mes);
  }

  static async recalcularCuotasRango(desdeAnio, desdeMes, hastaAnio, hastaMes) {
    const resultados = [];
    let anio = desdeAnio;
    let mes = desdeMes;

    while (anio < hastaAnio || (anio === hastaAnio && mes <= hastaMes)) {
      const res = await this.calcularCuotasDesdeVinculos(anio, mes);
      resultados.push(res);
      
      mes++;
      if (mes > 12) {
        mes = 1;
        anio++;
      }
    }
    return resultados;
  }

  // ==================== GESTIÓN MANUAL DE CUOTAS ====================
  static async setCuotaManual(personalId, anio, mes, horasObligatorias, fuenteFinanciamientoId, tipoContratoId, observaciones) {
    const { rows } = await db.query(`
      INSERT INTO turnos_grid_cuotas (personal_id, anio, mes, horas_obligatorias, fuente_financiamiento_id, tipo_contrato_id, origen, observaciones)
      VALUES ($1, $2, $3, $4, $5, $6, 'MANUAL', $7)
      ON CONFLICT (personal_id, anio, mes, fuente_financiamiento_id, tipo_contrato_id) DO UPDATE SET
        horas_obligatorias = EXCLUDED.horas_obligatorias,
        origen = 'MANUAL',
        observaciones = EXCLUDED.observaciones,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [personalId, anio, mes, horasObligatorias, fuenteFinanciamientoId, tipoContratoId, observaciones || null]);
    return rows[0];
  }

  static async getCuotasPersonal(personalId, anio, mes) {
    const { rows } = await db.query(`
      SELECT tgc.*, cff.nombre_fuente, ctp.nombre_tipo
      FROM turnos_grid_cuotas tgc
      LEFT JOIN cat_fuentes_financiamiento cff ON tgc.fuente_financiamiento_id = cff.id
      LEFT JOIN cat_tipos_personal ctp ON tgc.tipo_contrato_id = ctp.id
      WHERE tgc.personal_id = $1 AND tgc.anio = $2 AND tgc.mes = $3
      ORDER BY cff.nombre_fuente, ctp.nombre_tipo
    `, [personalId, anio, mes]);
    return rows;
  }

  static async getCuotasServicio(servicioId, anio, mes) {
    const { rows } = await db.query(`
      SELECT tgc.*, p.ci, p.primer_nombre, p.apellido_paterno, p.apellido_materno,
             cff.nombre_fuente, ctp.nombre_tipo
      FROM turnos_grid_cuotas tgc
      JOIN personal p ON tgc.personal_id = p.id
      JOIN vinculos_laborales vl ON p.id = vl.personal_id
      JOIN turnos_grid_servicios gs ON gs.unidad_servicio = vl.unidad_servicio
      LEFT JOIN cat_fuentes_financiamiento cff ON tgc.fuente_financiamiento_id = cff.id
      LEFT JOIN cat_tipos_personal ctp ON tgc.tipo_contrato_id = ctp.id
      WHERE gs.id = $1 AND tgc.anio = $2 AND tgc.mes = $3
        AND vl.fecha_fin IS NULL
      ORDER BY p.apellido_paterno, p.primer_nombre
    `, [servicioId, anio, mes]);
    return rows;
  }

  // ==================== SINCRONIZACIÓN CON CARGA RESUMEN ====================
  static async sincronizarCargaResumen(servicioId, anio, mes) {
    // El trigger ya actualiza automáticamente, pero esto fuerza recálculo completo
    await db.query(`
      INSERT INTO turnos_grid_carga_resumen (personal_id, anio, mes, servicio_id, horas_asignadas, horas_obligatorias)
      SELECT 
        ga.personal_id,
        gm.anio,
        gm.mes,
        gm.servicio_id,
        COALESCE(SUM(
          gm.horas_franja * 
          CASE 
            WHEN ga.franja_inicio_override IS NOT NULL AND ga.franja_fin_override IS NOT NULL THEN
              CASE 
                WHEN ga.franja_fin_override > ga.franja_inicio_override THEN EXTRACT(EPOCH FROM (ga.franja_fin_override - ga.franja_inicio_override))/3600
                ELSE EXTRACT(EPOCH FROM (ga.franja_fin_override - ga.franja_inicio_override + INTERVAL '24 hours'))/3600
              END
            ELSE 1
          END
        ), 0) as horas_asignadas,
        COALESCE(SUM(tgc.horas_obligatorias), 0) as horas_obligatorias
      FROM turnos_grid_asignaciones ga
      JOIN turnos_grid_mensual gm ON ga.grid_mensual_id = gm.id
      LEFT JOIN turnos_grid_cuotas tgc 
        ON tgc.personal_id = ga.personal_id AND tgc.anio = gm.anio AND tgc.mes = gm.mes
      WHERE gm.servicio_id = $1 AND gm.anio = $2 AND gm.mes = $3
      GROUP BY ga.personal_id, gm.anio, gm.mes, gm.servicio_id
      ON CONFLICT (personal_id, anio, mes, servicio_id) DO UPDATE SET
        horas_asignadas = EXCLUDED.horas_asignadas,
        horas_obligatorias = EXCLUDED.horas_obligatorias,
        updated_at = CURRENT_TIMESTAMP
    `, [servicioId, anio, mes]);
  }

  static async getResumenPorFuente(servicioId, anio, mes) {
    const { rows } = await db.query(`
      SELECT 
        cff.nombre_fuente as fuente_financiamiento,
        ctp.nombre_tipo as tipo_personal,
        COUNT(DISTINCT p.id) as total_personal,
        COALESCE(SUM(tgcr.horas_asignadas), 0) as horas_asignadas,
        COALESCE(SUM(tgcr.horas_obligatorias), 0) as horas_obligatorias,
        COUNT(DISTINCT CASE WHEN tgcr.estado = 'CUMPLIDO' THEN p.id END) as cumplen,
        COUNT(DISTINCT CASE WHEN tgcr.estado = 'PARCIAL' THEN p.id END) as parciales,
        COUNT(DISTINCT CASE WHEN tgcr.estado = 'SIN_ASIGNAR' THEN p.id END) as sin_asignar
      FROM personal p
      JOIN vinculos_laborales vl ON p.id = vl.personal_id
      JOIN turnos_grid_servicios gs ON gs.unidad_servicio = vl.unidad_servicio
      LEFT JOIN cat_fuentes_financiamiento cff ON vl.fuente_financiamiento_id = cff.id
      LEFT JOIN cat_tipos_personal ctp ON vl.tipo_personal_id = ctp.id
      LEFT JOIN turnos_grid_carga_resumen tgcr 
        ON tgcr.personal_id = p.id AND tgcr.anio = $2 AND tgcr.mes = $3 AND tgcr.servicio_id = gs.id
      WHERE vl.fecha_fin IS NULL
        AND p.activo = true
        AND gs.id = $1
      GROUP BY cff.nombre_fuente, ctp.nombre_tipo
      ORDER BY cff.nombre_fuente, ctp.nombre_tipo
    `, [servicioId, anio, mes]);

    return rows.map(r => ({
      ...r,
      horas_asignadas: parseFloat(r.horas_asignadas) || 0,
      horas_obligatorias: parseFloat(r.horas_obligatorias) || 0,
      porcentaje: r.horas_obligatorias > 0 ? ((parseFloat(r.horas_asignadas) / parseFloat(r.horas_obligatorias)) * 100).toFixed(1) : 0
    }));
  }
}

module.exports = TurnosGridCuotaService;