const db = require('../config/db');

class JustificacionesService {
  static async getAll(filtros = {}) {
    let query = `
      SELECT j.*, p.ci, p.primer_nombre, p.apellido_paterno, p.apellido_materno,
             cm.detalle as motivo_detalle_txt
      FROM justificaciones j
      JOIN personal p ON j.personal_id = p.id
      LEFT JOIN cat_motivos_justificacion cm ON j.motivo_id = cm.id
      WHERE 1=1
    `;
    const params = [];

    if (filtros.personal_id) { params.push(filtros.personal_id); query += ` AND j.personal_id = $${params.length}`; }
    if (filtros.fecha_desde) { params.push(filtros.fecha_desde); query += ` AND j.fecha >= $${params.length}`; }
    if (filtros.fecha_hasta) { params.push(filtros.fecha_hasta); query += ` AND j.fecha <= $${params.length}`; }
    if (filtros.tipo) { params.push(filtros.tipo); query += ` AND j.tipo = $${params.length}`; }
    if (filtros.motivo_id) { params.push(filtros.motivo_id); query += ` AND j.motivo_id = $${params.length}`; }

    query += ' ORDER BY j.fecha DESC, p.apellido_paterno ASC';
    const { rows } = await db.query(query, params);
    return rows;
  }

  static async getById(id) {
    const { rows } = await db.query(`
      SELECT j.*, p.ci, p.primer_nombre, p.apellido_paterno, p.apellido_materno,
             cm.detalle as motivo_detalle_txt
      FROM justificaciones j
      JOIN personal p ON j.personal_id = p.id
      LEFT JOIN cat_motivos_justificacion cm ON j.motivo_id = cm.id
      WHERE j.id = $1
    `, [id]);
    return rows[0] || null;
  }

  static async create(data) {
    const { rows } = await db.query(`
      INSERT INTO justificaciones (personal_id, fecha, tipo, hora_justificada, motivo_id, motivo_detalle, justificante)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `, [data.personal_id, data.fecha, data.tipo, data.hora_justificada || null,
        data.motivo_id || null, data.motivo_detalle || null, data.justificante || null]);

    await db.query(`
      UPDATE asistencia_diaria SET estado = 3, justificacion_id = $1
      WHERE asistencia_id IN (
        SELECT id FROM asistencia_mensual WHERE personal_id = $2
      ) AND dia = EXTRACT(DAY FROM $3::DATE)::INT
    `, [rows[0].id, data.personal_id, data.fecha]);

    return rows[0];
  }

  static async update(id, data) {
    const fields = [];
    const params = [];
    let idx = 1;

    const cols = ['personal_id', 'fecha', 'tipo', 'hora_justificada', 'motivo_id', 'motivo_detalle', 'justificante'];
    for (const col of cols) {
      if (data[col] !== undefined) {
        fields.push(`${col} = $${idx++}`);
        params.push(data[col]);
      }
    }

    if (fields.length === 0) return this.getById(id);

    fields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);
    const { rows } = await db.query(
      `UPDATE justificaciones SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      params
    );
    return rows[0] || null;
  }

  static async delete(id) {
    await db.query(`
      UPDATE asistencia_diaria SET estado = 1, justificacion_id = NULL
      WHERE justificacion_id = $1
    `, [id]);
    const { rowCount } = await db.query('DELETE FROM justificaciones WHERE id = $1', [id]);
    return rowCount > 0;
  }

  static async getMotivos() {
    const { rows } = await db.query('SELECT * FROM cat_motivos_justificacion ORDER BY id');
    return rows;
  }
}

module.exports = JustificacionesService;
