const db = require('../config/db');
const ConfiguracionService = require('./configuracionService');

class TurnosService {
  static async getAllPlantillas(activo) {
    let query = 'SELECT tp.*, (SELECT COUNT(*) FROM turnos_asignados WHERE turno_plantilla_id = tp.id) as total_asignaciones FROM turnos_plantilla tp';
    const params = [];
    if (activo !== undefined) {
      params.push(activo === 'true');
      query += ` WHERE tp.activo = $${params.length}`;
    }
    query += ' ORDER BY total_asignaciones DESC, tp.codigo ASC';
    const { rows } = await db.query(query, params);
    return rows;
  }

  static async getPlantillaById(id) {
    const { rows } = await db.query('SELECT * FROM turnos_plantilla WHERE id = $1', [id]);
    return rows[0] || null;
  }

  static async createPlantilla(data) {
    const defaults = {
      tolerancia_atraso: await ConfiguracionService.get('tolerancia_atraso_default', 5),
      tolerancia_falta: await ConfiguracionService.get('tolerancia_falta_default', 60),
      salida_adelantada: await ConfiguracionService.get('salida_adelantada_default', 0),
      puntualidad: await ConfiguracionService.get('puntualidad_default', 60),
      max_extra: await ConfiguracionService.get('max_extra_default', 180),
    };
    const { rows } = await db.query(`
      INSERT INTO turnos_plantilla (
        codigo, nombre,
        lunes_entrada, lunes_salida, martes_entrada, martes_salida,
        miercoles_entrada, miercoles_salida, jueves_entrada, jueves_salida,
        viernes_entrada, viernes_salida, sabado_entrada, sabado_salida,
        domingo_entrada, domingo_salida,
        lunes_habilitado, martes_habilitado, miercoles_habilitado,
        jueves_habilitado, viernes_habilitado, sabado_habilitado, domingo_habilitado,
        nocturno_lunes, nocturno_martes, nocturno_miercoles, nocturno_jueves,
        nocturno_viernes, nocturno_sabado, nocturno_domingo,
        tolerancia_atraso, tolerancia_falta, salida_adelantada, puntualidad, max_extra,
        prioridad
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36)
      RETURNING *
    `, [
      data.codigo, data.nombre,
      data.lunes_entrada, data.lunes_salida,
      data.martes_entrada, data.martes_salida,
      data.miercoles_entrada, data.miercoles_salida,
      data.jueves_entrada, data.jueves_salida,
      data.viernes_entrada, data.viernes_salida,
      data.sabado_entrada, data.sabado_salida,
      data.domingo_entrada, data.domingo_salida,
      data.lunes_habilitado, data.martes_habilitado, data.miercoles_habilitado,
      data.jueves_habilitado, data.viernes_habilitado, data.sabado_habilitado, data.domingo_habilitado,
      data.nocturno_lunes, data.nocturno_martes, data.nocturno_miercoles, data.nocturno_jueves,
      data.nocturno_viernes, data.nocturno_sabado, data.nocturno_domingo,
      data.tolerancia_atraso || defaults.tolerancia_atraso,
      data.tolerancia_falta || defaults.tolerancia_falta,
      data.salida_adelantada || defaults.salida_adelantada,
      data.puntualidad || defaults.puntualidad,
      data.max_extra || defaults.max_extra,
      data.prioridad || 'Normal'
    ]);
    return rows[0];
  }

  static async updatePlantilla(id, data) {
    const fields = [];
    const params = [];
    let idx = 1;

    const cols = [
      'codigo','nombre','lunes_entrada','lunes_salida','martes_entrada','martes_salida',
      'miercoles_entrada','miercoles_salida','jueves_entrada','jueves_salida',
      'viernes_entrada','viernes_salida','sabado_entrada','sabado_salida',
      'domingo_entrada','domingo_salida',
      'lunes_habilitado','martes_habilitado','miercoles_habilitado',
      'jueves_habilitado','viernes_habilitado','sabado_habilitado','domingo_habilitado',
      'nocturno_lunes','nocturno_martes','nocturno_miercoles','nocturno_jueves',
      'nocturno_viernes','nocturno_sabado','nocturno_domingo',
      'tolerancia_atraso','tolerancia_falta','salida_adelantada','puntualidad','max_extra','prioridad','activo'
    ];

    for (const col of cols) {
      if (data[col] !== undefined) {
        fields.push(`${col} = $${idx++}`);
        params.push(data[col]);
      }
    }

    if (fields.length === 0) return this.getPlantillaById(id);

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);
    const { rows } = await db.query(
      `UPDATE turnos_plantilla SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      params
    );
    return rows[0] || null;
  }

  static async deletePlantilla(id) {
    const { rowCount } = await db.query('DELETE FROM turnos_plantilla WHERE id = $1', [id]);
    return rowCount > 0;
  }

  static async getAllAsignados(filtros = {}) {
    const params = [];
    const where = ['1=1'];

    if (filtros.q) {
      params.push(`%${filtros.q}%`);
      where.push(`(
        p.primer_nombre ILIKE $${params.length} OR
        p.apellido_paterno ILIKE $${params.length} OR
        p.apellido_materno ILIKE $${params.length} OR
        p.ci ILIKE $${params.length} OR
        CAST(p.id AS TEXT) ILIKE $${params.length}
      )`);
    }
    if (filtros.fecha) {
      params.push(filtros.fecha);
      where.push(`ta.fecha_inicio <= $${params.length} AND (ta.fecha_fin IS NULL OR ta.fecha_fin >= $${params.length})`);
    }
    if (filtros.fecha_desde) {
      params.push(filtros.fecha_desde);
      where.push(`ta.fecha_inicio >= $${params.length}`);
    }
    if (filtros.fecha_hasta) {
      params.push(filtros.fecha_hasta);
      where.push(`(ta.fecha_fin IS NULL OR ta.fecha_fin <= $${params.length})`);
    }
    if (filtros.turno_plantilla_id) {
      params.push(filtros.turno_plantilla_id);
      where.push(`ta.turno_plantilla_id = $${params.length}`);
    }
    if (filtros.year) {
      params.push(`${filtros.year}-01-01`);
      params.push(`${filtros.year}-12-31`);
      where.push(`ta.fecha_inicio BETWEEN $${params.length - 1} AND $${params.length}`);
    }

    const baseQuery = `
      SELECT ta.*, p.ci, p.primer_nombre, p.apellido_paterno, p.apellido_materno,
             tp.codigo as turno_codigo, tp.nombre as turno_nombre
      FROM turnos_asignados ta
      JOIN personal p ON ta.personal_id = p.id
      JOIN turnos_plantilla tp ON ta.turno_plantilla_id = tp.id
      WHERE ${where.join(' AND ')}
    `;

    const countQuery = `SELECT COUNT(*) as total FROM (${baseQuery}) sub`;

    let query = baseQuery + ' ORDER BY ta.fecha_inicio DESC, p.apellido_paterno ASC';

    const page = parseInt(filtros.page) || 1;
    const limit = parseInt(filtros.limit) || 50;
    const offset = (page - 1) * limit;
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const { rows } = await db.query(query, params);
    const { rows: countRows } = await db.query(countQuery, params.slice(0, -2));

    return {
      data: rows,
      pagination: {
        total: parseInt(countRows[0].total),
        page,
        limit,
        totalPages: Math.ceil(parseInt(countRows[0].total) / limit),
      },
    };
  }

  static async getYearsAsignados() {
    const { rows } = await db.query(`
      SELECT DISTINCT EXTRACT(YEAR FROM fecha_inicio)::int as year
      FROM turnos_asignados ORDER BY year DESC
    `);
    return rows.map(r => r.year);
  }

  static async cloneAsignaciones(desdeYear, hastaYear) {
    const desde = `${desdeYear}-01-01`;
    const hasta = `${desdeYear}-12-31`;
    const nuevoDesde = `${hastaYear}-01-01`;
    const nuevoHasta = `${hastaYear}-12-31`;

    const { rows } = await db.query(`
      INSERT INTO turnos_asignados (personal_id, turno_plantilla_id, fecha_inicio, fecha_fin)
      SELECT DISTINCT ta.personal_id, ta.turno_plantilla_id,
             (ta.fecha_inicio + interval '1 year' * $4)::date as fecha_inicio,
             (ta.fecha_fin + interval '1 year' * $4)::date as fecha_fin
      FROM turnos_asignados ta
      WHERE ta.fecha_inicio BETWEEN $1 AND $2
        AND NOT EXISTS (
          SELECT 1 FROM turnos_asignados ta2
          WHERE ta2.personal_id = ta.personal_id
            AND ta2.turno_plantilla_id = ta.turno_plantilla_id
            AND ta2.fecha_inicio = (ta.fecha_inicio + interval '1 year' * $4)::date
        )
      ON CONFLICT DO NOTHING
      RETURNING id
    `, [desde, hasta, null, hastaYear - desdeYear]);

    return rows.length;
  }

  static async getAsignadoById(id) {
    const { rows } = await db.query(`
      SELECT ta.*, p.ci, p.primer_nombre, p.apellido_paterno, p.apellido_materno,
             tp.codigo as turno_codigo, tp.nombre as turno_nombre
      FROM turnos_asignados ta
      JOIN personal p ON ta.personal_id = p.id
      JOIN turnos_plantilla tp ON ta.turno_plantilla_id = tp.id
      WHERE ta.id = $1
    `, [id]);
    return rows[0] || null;
  }

  static async createAsignado(data) {
    const overlap = await db.query(`
      SELECT id FROM turnos_asignados
      WHERE personal_id = $1 AND fecha_inicio = $2
    `, [data.personal_id, data.fecha_inicio]);

    const { rows } = await db.query(`
      INSERT INTO turnos_asignados (personal_id, turno_plantilla_id, fecha_inicio, fecha_fin)
      VALUES ($1, $2, $3, $4) RETURNING *
    `, [data.personal_id, data.turno_plantilla_id, data.fecha_inicio, data.fecha_fin || null]);
    return rows[0];
  }

  static async updateAsignado(id, data) {
    const fields = [];
    const params = [];
    let idx = 1;

    if (data.personal_id !== undefined) { fields.push(`personal_id = $${idx++}`); params.push(data.personal_id); }
    if (data.turno_plantilla_id !== undefined) { fields.push(`turno_plantilla_id = $${idx++}`); params.push(data.turno_plantilla_id); }
    if (data.fecha_inicio !== undefined) { fields.push(`fecha_inicio = $${idx++}`); params.push(data.fecha_inicio); }
    if (data.fecha_fin !== undefined) { fields.push(`fecha_fin = $${idx++}`); params.push(data.fecha_fin); }

    if (fields.length === 0) return this.getAsignadoById(id);

    params.push(id);
    const { rows } = await db.query(
      `UPDATE turnos_asignados SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      params
    );
    return rows[0] || null;
  }

  static async deleteAsignado(id) {
    const { rowCount } = await db.query('DELETE FROM turnos_asignados WHERE id = $1', [id]);
    return rowCount > 0;
  }

  static async deleteAsignadosByPersonal(personalId) {
    const { rowCount } = await db.query('DELETE FROM turnos_asignados WHERE personal_id = $1', [personalId]);
    return rowCount;
  }

  static async getTurnoEmpleado(personalId, fecha) {
    const { rows } = await db.query(`
      SELECT tp.*, ta.fecha_inicio, ta.fecha_fin
      FROM turnos_asignados ta
      JOIN turnos_plantilla tp ON ta.turno_plantilla_id = tp.id
      WHERE ta.personal_id = $1
        AND ta.fecha_inicio <= $2
        AND (ta.fecha_fin IS NULL OR ta.fecha_fin >= $2)
      ORDER BY ta.fecha_inicio DESC
      LIMIT 1
    `, [personalId, fecha]);
    return rows[0] || null;
  }

  static async getCalendario(mes, anio, servicio) {
    let query = `
      SELECT ta.*, p.ci, p.primer_nombre, p.apellido_paterno, p.apellido_materno,
             tp.id as plantilla_id, tp.codigo as turno_codigo, tp.nombre as turno_nombre,
             tp.lunes_entrada, tp.lunes_salida, tp.martes_entrada, tp.martes_salida,
             tp.miercoles_entrada, tp.miercoles_salida, tp.jueves_entrada, tp.jueves_salida,
             tp.viernes_entrada, tp.viernes_salida, tp.sabado_entrada, tp.sabado_salida,
             tp.domingo_entrada, tp.domingo_salida,
             tp.lunes_habilitado, tp.martes_habilitado, tp.miercoles_habilitado,
             tp.jueves_habilitado, tp.viernes_habilitado, tp.sabado_habilitado, tp.domingo_habilitado,
             tp.nocturno_lunes, tp.nocturno_martes, tp.nocturno_miercoles, tp.nocturno_jueves,
             tp.nocturno_viernes, tp.nocturno_sabado, tp.nocturno_domingo,
             vl.unidad_servicio
      FROM turnos_asignados ta
      JOIN personal p ON ta.personal_id = p.id
      JOIN turnos_plantilla tp ON ta.turno_plantilla_id = tp.id
      LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id
      WHERE (ta.fecha_inicio BETWEEN $1 AND $2 OR ta.fecha_fin BETWEEN $1 AND $2
             OR (ta.fecha_inicio <= $1 AND (ta.fecha_fin IS NULL OR ta.fecha_fin >= $2)))
    `;
    const ultimoDia = new Date(anio, mes, 0).getDate();
    const params = [`${anio}-${String(mes).padStart(2, '0')}-01`, `${anio}-${String(mes).padStart(2, '0')}-${String(ultimoDia).padStart(2, '0')}`];

    if (servicio) {
      params.push(`%${servicio}%`);
      query += ` AND vl.unidad_servicio ILIKE $${params.length}`;
    }

    query += ' ORDER BY vl.unidad_servicio, p.apellido_paterno, ta.fecha_inicio';
    const { rows } = await db.query(query, params);
    return rows;
  }

  static async getCalendarioDia(mes, anio, dia) {
    const fecha = `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    const diaSem = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'][new Date(fecha).getDay()];
    const { rows } = await db.query(`
      SELECT ta.*, p.ci, p.primer_nombre, p.apellido_paterno, p.apellido_materno,
             tp.codigo as turno_codigo, tp.nombre as turno_nombre,
             tp.${diaSem}_entrada as entrada, tp.${diaSem}_salida as salida,
             tp.nocturno_${diaSem} as nocturno, tp.${diaSem}_habilitado as habilitado,
             vl.unidad_servicio, vl.cargo_actual
      FROM turnos_asignados ta
      JOIN personal p ON ta.personal_id = p.id
      JOIN turnos_plantilla tp ON ta.turno_plantilla_id = tp.id
      LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id
      WHERE ta.fecha_inicio <= $1 AND (ta.fecha_fin IS NULL OR ta.fecha_fin >= $1)
      ORDER BY vl.unidad_servicio, p.apellido_paterno
    `, [fecha]);
    return rows;
  }

  static async getPersonalSinTurno() {
    const { rows } = await db.query(`
      SELECT p.id, p.ci, p.primer_nombre, p.apellido_paterno, p.apellido_materno,
             vl.unidad_servicio, vl.cargo_actual
      FROM personal p
      LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id
      WHERE p.id NOT IN (SELECT DISTINCT personal_id FROM turnos_asignados)
      ORDER BY p.apellido_paterno
    `);
    return rows;
  }
}

module.exports = TurnosService;
