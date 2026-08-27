const db = require('../config/db');

class TurnosGridService {
  // ==================== SERVICIOS ====================
  static async getServicios(activo = true) {
    let query = 'SELECT * FROM turnos_grid_servicios';
    const params = [];
    if (activo !== undefined) {
      params.push(activo);
      query += ' WHERE activo = $1';
    }
    query += ' ORDER BY unidad_servicio';
    const { rows } = await db.query(query, params);
    return rows;
  }

  static async getServicioById(id) {
    const { rows } = await db.query('SELECT * FROM turnos_grid_servicios WHERE id = $1', [id]);
    return rows[0] || null;
  }

  static async createServicio(data) {
    const { rows } = await db.query(`
      INSERT INTO turnos_grid_servicios (unidad_servicio, franjas_por_dia, horas_requeridas_mes, color_identificacion, activo)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [data.unidad_servicio, JSON.stringify(data.franjas_por_dia || {}), JSON.stringify(data.horas_requeridas_mes || {}), data.color_identificacion || '#3B82F6', data.activo !== false]);
    return rows[0];
  }

  static async updateServicio(id, data) {
    const fields = [];
    const params = [];
    let idx = 1;

    const cols = ['unidad_servicio', 'franjas_por_dia', 'horas_requeridas_mes', 'color_identificacion', 'activo'];
    for (const col of cols) {
      if (data[col] !== undefined) {
        fields.push(`${col} = $${idx++}`);
        params.push(col.endsWith('_dia') || col.endsWith('_mes') ? JSON.stringify(data[col]) : data[col]);
      }
    }
    if (fields.length === 0) return this.getServicioById(id);

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);
    const { rows } = await db.query(
      `UPDATE turnos_grid_servicios SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      params
    );
    return rows[0] || null;
  }

  // ==================== GRILLA MENSUAL ====================
  static async generarGrillaMensual(servicioId, anio, mes) {
    await db.query('SELECT generar_grilla_mensual($1, $2, $3)', [servicioId, anio, mes]);
    return this.getGrillaMensual(servicioId, anio, mes);
  }

  static async getGrillaMensual(servicioId, anio, mes) {
    const { rows } = await db.query(`
      SELECT gm.*, 
             json_agg(
               json_build_object(
                 'id', ga.id,
                 'personal_id', ga.personal_id,
                 'franja_inicio_override', ga.franja_inicio_override,
                 'franja_fin_override', ga.franja_fin_override,
                 'creado_en', ga.creado_en,
                 'personal', json_build_object(
                   'id', p.id,
                   'ci', p.ci,
                   'primer_nombre', p.primer_nombre,
                   'apellido_paterno', p.apellido_paterno,
                   'apellido_materno', p.apellido_materno
                 )
               )
             ) FILTER (WHERE ga.id IS NOT NULL) as asignaciones
      FROM turnos_grid_mensual gm
      LEFT JOIN turnos_grid_asignaciones ga ON gm.id = ga.grid_mensual_id
      LEFT JOIN personal p ON ga.personal_id = p.id
      WHERE gm.servicio_id = $1 AND gm.anio = $2 AND gm.mes = $3
      GROUP BY gm.id
      ORDER BY gm.dia, gm.franja_inicio
    `, [servicioId, anio, mes]);
    return rows;
  }

  static async getGrillaConAsignaciones(servicioId, anio, mes) {
    // Versión optimizada para frontend: agrupa por día
    const grilla = await this.getGrillaMensual(servicioId, anio, mes);
    
    const dias = {};
    for (const cell of grilla) {
      if (!dias[cell.dia]) {
        dias[cell.dia] = { dia: cell.dia, franjas: [] };
      }
      dias[cell.dia].franjas.push({
        id: cell.id,
        franja_inicio: cell.franja_inicio,
        franja_fin: cell.franja_fin,
        tipo_franja: cell.tipo_franja,
        cupo_maximo: cell.cupo_maximo,
        horas_franja: parseFloat(cell.horas_franja),
        es_festivo: cell.es_festivo,
        notas: cell.notas,
        asignaciones: cell.asignaciones || []
      });
    }
    
    return Object.values(dias).sort((a, b) => a.dia - b.dia);
  }

  // ==================== PERSONAL DISPONIBLE ====================
  static async getPersonalDisponible(servicioId, anio, mes, filtros = {}) {
    const params = [servicioId];
    const where = ['gs.id = $1'];
    let idx = 2;

    if (filtros.fuente_financiamiento_id) {
      params.push(filtros.fuente_financiamiento_id);
      where.push(`vl.fuente_financiamiento_id = $${idx++}`);
    }
    if (filtros.tipo_personal_id) {
      params.push(filtros.tipo_personal_id);
      where.push(`vl.tipo_personal_id = $${idx++}`);
    }
    if (filtros.q) {
      params.push(`%${filtros.q}%`);
      where.push(`(
        p.primer_nombre ILIKE $${idx} OR
        p.apellido_paterno ILIKE $${idx} OR
        p.ci ILIKE $${idx}
      )`);
      idx++;
    }

    // Obtener personal del servicio con sus cuotas y carga actual
    const { rows } = await db.query(`
      SELECT 
        p.id, p.ci, p.primer_nombre, p.segundo_nombre, p.apellido_paterno, p.apellido_materno,
        vl.fuente_financiamiento_id, cff.nombre_fuente as fuente_financiamiento,
        vl.tipo_personal_id, ctp.nombre_tipo as tipo_personal,
        vl.cargo_actual, vl.unidad_servicio,
        -- Cuotas
        COALESCE(SUM(tgc.horas_obligatorias), 0) as horas_obligatorias,
        -- Carga actual en este servicio/mes
        COALESCE(tgcr.horas_asignadas, 0) as horas_asignadas,
        COALESCE(tgcr.estado, 'SIN_ASIGNAR') as estado_carga
      FROM personal p
      JOIN vinculos_laborales vl ON p.id = vl.personal_id
      JOIN turnos_grid_servicios gs ON gs.unidad_servicio = vl.unidad_servicio
      LEFT JOIN cat_fuentes_financiamiento cff ON vl.fuente_financiamiento_id = cff.id
      LEFT JOIN cat_tipos_personal ctp ON vl.tipo_personal_id = ctp.id
      LEFT JOIN turnos_grid_cuotas tgc 
        ON tgc.personal_id = p.id AND tgc.anio = $${idx} AND tgc.mes = $${idx+1}
      LEFT JOIN turnos_grid_carga_resumen tgcr
        ON tgcr.personal_id = p.id AND tgcr.anio = $${idx} AND tgcr.mes = $${idx+1} AND tgcr.servicio_id = gs.id
      WHERE ${where.join(' AND ')}
        AND vl.fecha_fin IS NULL
        AND p.activo = true
        AND gs.id = $1
      GROUP BY p.id, vl.fuente_financiamiento_id, cff.nombre_fuente, vl.tipo_personal_id, ctp.nombre_tipo, 
               vl.cargo_actual, vl.unidad_servicio, tgcr.horas_asignadas, tgcr.estado
      ORDER BY p.apellido_paterno, p.primer_nombre
    `, [...params, anio, mes]);

    return rows.map(r => ({
      ...r,
      nombre_completo: [r.primer_nombre, r.segundo_nombre, r.apellido_paterno, r.apellido_materno].filter(Boolean).join(' '),
      horas_obligatorias: parseFloat(r.horas_obligatorias) || 0,
      horas_asignadas: parseFloat(r.horas_asignadas) || 0,
      diferencia: (parseFloat(r.horas_asignadas) || 0) - (parseFloat(r.horas_obligatorias) || 0)
    }));
  }

  // ==================== ASIGNACIONES ====================
  static async createAsignacion(data, usuarioId) {
    const { rows } = await db.query(`
      INSERT INTO turnos_grid_asignaciones (grid_mensual_id, personal_id, franja_inicio_override, franja_fin_override, creado_por)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [data.grid_mensual_id, data.personal_id, data.franja_inicio_override || null, data.franja_fin_override || null, usuarioId]);
    return rows[0];
  }

  static async updateAsignacion(id, data, usuarioId) {
    const fields = [];
    const params = [];
    let idx = 1;

    if (data.grid_mensual_id !== undefined) { fields.push(`grid_mensual_id = $${idx++}`); params.push(data.grid_mensual_id); }
    if (data.personal_id !== undefined) { fields.push(`personal_id = $${idx++}`); params.push(data.personal_id); }
    if (data.franja_inicio_override !== undefined) { fields.push(`franja_inicio_override = $${idx++}`); params.push(data.franja_inicio_override); }
    if (data.franja_fin_override !== undefined) { fields.push(`franja_fin_override = $${idx++}`); params.push(data.franja_fin_override); }

    if (fields.length === 0) return this.getAsignacionById(id);

    fields.push(`actualizado_por = $${idx++}, actualizado_en = CURRENT_TIMESTAMP`);
    params.push(usuarioId);
    params.push(id);

    const { rows } = await db.query(
      `UPDATE turnos_grid_asignaciones SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      params
    );
    return rows[0] || null;
  }

  static async deleteAsignacion(id) {
    const { rowCount } = await db.query('DELETE FROM turnos_grid_asignaciones WHERE id = $1', [id]);
    return rowCount > 0;
  }

  static async getAsignacionById(id) {
    const { rows } = await db.query(`
      SELECT ga.*, gm.servicio_id, gm.anio, gm.mes, gm.dia, gm.franja_inicio, gm.franja_fin, gm.tipo_franja, gm.horas_franja
      FROM turnos_grid_asignaciones ga
      JOIN turnos_grid_mensual gm ON ga.grid_mensual_id = gm.id
      WHERE ga.id = $1
    `, [id]);
    return rows[0] || null;
  }

  // ==================== BATCH SAVE ====================
  static async batchSave(servicioId, anio, mes, cambios, usuarioId, ip, userAgent) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      // Setear variables de sesión para triggers de auditoría
      await client.query(`SET LOCAL app.current_user_id = $1`, [usuarioId]);
      await client.query(`SET LOCAL app.current_user_ip = $1`, [ip || 'unknown']);
      await client.query(`SET LOCAL app.current_user_agent = $1`, [userAgent || 'unknown']);

      const resultados = { creados: 0, actualizados: 0, eliminados: 0, errores: [] };

      for (const cambio of cambios) {
        try {
          switch (cambio.accion) {
            case 'CREATE':
              await client.query(`
                INSERT INTO turnos_grid_asignaciones (grid_mensual_id, personal_id, franja_inicio_override, franja_fin_override, creado_por)
                VALUES ($1, $2, $3, $4, $5)
              `, [cambio.grid_mensual_id, cambio.personal_id, cambio.franja_inicio_override || null, cambio.franja_fin_override || null, usuarioId]);
              resultados.creados++;
              break;

            case 'MOVE':
            case 'UPDATE':
              if (cambio.asignacion_id) {
                const sets = [];
                const vals = [];
                let i = 1;
                if (cambio.grid_mensual_id !== undefined) { sets.push(`grid_mensual_id = $${i++}`); vals.push(cambio.grid_mensual_id); }
                if (cambio.personal_id !== undefined) { sets.push(`personal_id = $${i++}`); vals.push(cambio.personal_id); }
                if (cambio.franja_inicio_override !== undefined) { sets.push(`franja_inicio_override = $${i++}`); vals.push(cambio.franja_inicio_override); }
                if (cambio.franja_fin_override !== undefined) { sets.push(`franja_fin_override = $${i++}`); vals.push(cambio.franja_fin_override); }
                if (sets.length > 0) {
                  sets.push(`actualizado_por = $${i++}, actualizado_en = CURRENT_TIMESTAMP`);
                  vals.push(usuarioId);
                  vals.push(cambio.asignacion_id);
                  await client.query(`UPDATE turnos_grid_asignaciones SET ${sets.join(', ')} WHERE id = $${i}`, vals);
                  resultados.actualizados++;
                }
              }
              break;

            case 'DELETE':
              if (cambio.asignacion_id) {
                await client.query('DELETE FROM turnos_grid_asignaciones WHERE id = $1', [cambio.asignacion_id]);
                resultados.eliminados++;
              }
              break;
          }
        } catch (e) {
          resultados.errores.push({ cambio, error: e.message });
        }
      }

      await client.query('COMMIT');
      return resultados;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  // ==================== CARGA HORARIA / RESUMEN ====================
  static async getCargaHorariaResumen(servicioId, anio, mes) {
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

  static async getAlertasCarga(servicioId, anio, mes) {
    const { rows } = await db.query(`
      SELECT p.id, p.ci, p.primer_nombre, p.apellido_paterno, p.apellido_materno,
             cff.nombre_fuente as fuente_financiamiento,
             tgcr.horas_asignadas, tgcr.horas_obligatorias, tgcr.diferencia, tgcr.estado
      FROM turnos_grid_carga_resumen tgcr
      JOIN personal p ON tgcr.personal_id = p.id
      JOIN vinculos_laborales vl ON p.id = vl.personal_id
      JOIN turnos_grid_servicios gs ON gs.unidad_servicio = vl.unidad_servicio
      LEFT JOIN cat_fuentes_financiamiento cff ON vl.fuente_financiamiento_id = cff.id
      WHERE tgcr.servicio_id = $1 AND tgcr.anio = $2 AND tgcr.mes = $3
        AND vl.fecha_fin IS NULL
        AND tgcr.estado != 'CUMPLIDO'
      ORDER BY tgcr.diferencia ASC
    `, [servicioId, anio, mes]);

    return rows.map(r => ({
      ...r,
      nombre_completo: [r.primer_nombre, r.apellido_paterno].filter(Boolean).join(' '),
      horas_asignadas: parseFloat(r.horas_asignadas) || 0,
      horas_obligatorias: parseFloat(r.horas_obligatorias) || 0,
      diferencia: parseFloat(r.diferencia) || 0,
      alerta: r.estado === 'SIN_ASIGNAR' ? 'Sin turnos asignados' : `Faltan ${Math.abs(parseFloat(r.diferencia) || 0)} horas`
    }));
  }

  // ==================== AUDITORÍA ====================
  static async getAuditoria(filtros = {}) {
    const params = [];
    const where = ['1=1'];
    let idx = 1;

    if (filtros.servicio_id) {
      params.push(filtros.servicio_id);
      where.push(`gm.servicio_id = $${idx++}`);
    }
    if (filtros.personal_id) {
      params.push(filtros.personal_id);
      where.push(`tga.personal_id = $${idx++}`);
    }
    if (filtros.desde) {
      params.push(filtros.desde);
      where.push(`tga.created_at >= $${idx++}`);
    }
    if (filtros.hasta) {
      params.push(filtros.hasta);
      where.push(`tga.created_at <= $${idx++}`);
    }
    if (filtros.accion) {
      params.push(filtros.accion);
      where.push(`tga.accion = $${idx++}`);
    }

    const limit = parseInt(filtros.limit) || 100;
    const offset = (parseInt(filtros.page) - 1) * limit || 0;
    params.push(limit, offset);

    const { rows } = await db.query(`
      SELECT tga.*, 
             p.ci, p.primer_nombre, p.apellido_paterno,
             u.username as usuario_nombre,
             gs.unidad_servicio
      FROM turnos_grid_auditoria tga
      LEFT JOIN personal p ON tga.personal_id = p.id
      LEFT JOIN usuarios u ON tga.usuario_id = u.id
      LEFT JOIN turnos_grid_mensual gm ON tga.grid_mensual_id = gm.id
      LEFT JOIN turnos_grid_servicios gs ON gm.servicio_id = gs.id
      WHERE ${where.join(' AND ')}
      ORDER BY tga.created_at DESC
      LIMIT $${idx++} OFFSET $${idx}
    `, params);

    const { rows: countRows } = await db.query(`
      SELECT COUNT(*) as total FROM turnos_grid_auditoria tga
      LEFT JOIN turnos_grid_mensual gm ON tga.grid_mensual_id = gm.id
      WHERE ${where.join(' AND ')}
    `, params.slice(0, -2));

    return {
      data: rows,
      pagination: {
        total: parseInt(countRows[0].total),
        page: parseInt(filtros.page) || 1,
        limit,
        totalPages: Math.ceil(parseInt(countRows[0].total) / limit)
      }
    };
  }

  // ==================== VALIDACIONES ====================
  static async validarSolapamiento(personalId, gridMensualId, excludeId = null) {
    const { rows } = await db.query(`
      SELECT ga.id, gm.dia, gm.franja_inicio, gm.franja_fin
      FROM turnos_grid_asignaciones ga
      JOIN turnos_grid_mensual gm ON ga.grid_mensual_id = gm.id
      WHERE ga.personal_id = $1
        AND gm.dia = (SELECT dia FROM turnos_grid_mensual WHERE id = $2)
        AND gm.servicio_id = (SELECT servicio_id FROM turnos_grid_mensual WHERE id = $2)
        AND gm.anio = (SELECT anio FROM turnos_grid_mensual WHERE id = $2)
        AND gm.mes = (SELECT mes FROM turnos_grid_mensual WHERE id = $2)
        ${excludeId ? 'AND ga.id != $3' : ''}
    `, excludeId ? [personalId, gridMensualId, excludeId] : [personalId, gridMensualId]);

    return rows; // Devuelve asignaciones que se solapan en el mismo día
  }

  static async getCupoDisponible(gridMensualId) {
    const { rows } = await db.query(`
      SELECT gm.cupo_maximo, COUNT(ga.id) as ocupados
      FROM turnos_grid_mensual gm
      LEFT JOIN turnos_grid_asignaciones ga ON gm.id = ga.grid_mensual_id
      WHERE gm.id = $1
      GROUP BY gm.cupo_maximo
    `, [gridMensualId]);

    if (rows.length === 0) return { disponible: 0, total: 0 };
    return {
      total: parseInt(rows[0].cupo_maximo),
      ocupados: parseInt(rows[0].ocupados),
      disponible: parseInt(rows[0].cupo_maximo) - parseInt(rows[0].ocupados)
    };
  }
}

module.exports = TurnosGridService;