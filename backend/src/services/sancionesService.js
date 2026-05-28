const db = require('../config/db');

class SancionesService {
  static async getSancionesAtrasos() {
    const { rows } = await db.query('SELECT * FROM sanciones_atrasos ORDER BY rango_inicial');
    return rows;
  }

  static async createSancionAtraso(data) {
    const { rows } = await db.query(`
      INSERT INTO sanciones_atrasos (rango_inicial, rango_final, sancion_desc, factor)
      VALUES ($1, $2, $3, $4) RETURNING *
    `, [data.rango_inicial, data.rango_final, data.sancion_desc, data.factor || 0]);
    return rows[0];
  }

  static async updateSancionAtraso(id, data) {
    const fields = [];
    const params = [];
    let idx = 1;
    for (const col of ['rango_inicial', 'rango_final', 'sancion_desc', 'factor']) {
      if (data[col] !== undefined) { fields.push(`${col} = $${idx++}`); params.push(data[col]); }
    }
    if (fields.length === 0) return null;
    params.push(id);
    const { rows } = await db.query(
      `UPDATE sanciones_atrasos SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, params
    );
    return rows[0] || null;
  }

  static async deleteSancionAtraso(id) {
    const { rowCount } = await db.query('DELETE FROM sanciones_atrasos WHERE id = $1', [id]);
    return rowCount > 0;
  }

  static async getSancionesFaltas() {
    const { rows } = await db.query('SELECT * FROM sanciones_faltas ORDER BY rango_inicial');
    return rows;
  }

  static async createSancionFalta(data) {
    const { rows } = await db.query(`
      INSERT INTO sanciones_faltas (rango_inicial, rango_final, sancion_desc, factor)
      VALUES ($1, $2, $3, $4) RETURNING *
    `, [data.rango_inicial, data.rango_final, data.sancion_desc, data.factor || 0]);
    return rows[0];
  }

  static async updateSancionFalta(id, data) {
    const fields = [];
    const params = [];
    let idx = 1;
    for (const col of ['rango_inicial', 'rango_final', 'sancion_desc', 'factor']) {
      if (data[col] !== undefined) { fields.push(`${col} = $${idx++}`); params.push(data[col]); }
    }
    if (fields.length === 0) return null;
    params.push(id);
    const { rows } = await db.query(
      `UPDATE sanciones_faltas SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, params
    );
    return rows[0] || null;
  }

  static async deleteSancionFalta(id) {
    const { rowCount } = await db.query('DELETE FROM sanciones_faltas WHERE id = $1', [id]);
    return rowCount > 0;
  }

  static async getMotivos() {
    const { rows } = await db.query('SELECT * FROM cat_motivos_justificacion ORDER BY id');
    return rows;
  }

  static async calcularSancionPersonal(personalId, mes, anio) {
    const { rows } = await db.query(`
      SELECT COALESCE(SUM(minutos_atraso), 0) as total_atrasos,
             COUNT(*) FILTER (WHERE estado = 4 OR estado = 9) as total_faltas
      FROM asistencia_diaria ad
      JOIN asistencia_mensual am ON ad.asistencia_id = am.id
      WHERE am.personal_id = $1 AND am.mes = $2 AND am.anio = $3
    `, [personalId, mes, anio]);

    const totalAtrasos = rows[0].total_atrasos;
    const totalFaltas = rows[0].total_faltas;

    const sancionAtraso = (await db.query(
      'SELECT * FROM sanciones_atrasos WHERE $1 BETWEEN rango_inicial AND rango_final LIMIT 1',
      [totalAtrasos]
    )).rows[0] || null;

    const sancionFalta = (await db.query(
      'SELECT * FROM sanciones_faltas WHERE $1 BETWEEN rango_inicial AND rango_final LIMIT 1',
      [totalFaltas]
    )).rows[0] || null;

    const haber = (await db.query(`
      SELECT haber_basico FROM contratos WHERE personal_id = $1 ORDER BY fecha_inicio DESC NULLS LAST LIMIT 1
    `, [personalId])).rows[0];

    const calcularMonto = (sancion, haberBase) => {
      if (!sancion || !haberBase) return 0;
      const diario = haberBase.haber / 30;
      return diario * parseFloat(sancion.factor);
    };

    return {
      personal_id: personalId,
      mes, anio,
      total_atrasos_min: totalAtrasos,
      total_faltas: totalFaltas,
      sancion_atraso: sancionAtraso ? {
        descripcion: sancionAtraso.sancion_desc,
        factor: parseFloat(sancionAtraso.factor),
        monto_estimado: calcularMonto(sancionAtraso, haber)
      } : null,
      sancion_falta: sancionFalta ? {
        descripcion: sancionFalta.sancion_desc,
        factor: parseFloat(sancionFalta.factor),
        monto_estimado: calcularMonto(sancionFalta, haber)
      } : null
    };
  }
}

module.exports = SancionesService;
