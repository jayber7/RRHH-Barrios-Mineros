const db = require('../config/db');

class NotificacionesService {
  static async listar(usuarioId, filtros = {}) {
    let sql = `
      SELECT n.*, p.primer_nombre, p.apellido_paterno
      FROM notificaciones n
      LEFT JOIN personal p ON n.personal_id = p.id
      WHERE n.usuario_id = $1
    `;
    const params = [usuarioId];
    let idx = 2;

    if (filtros.soloNoLeidas) {
      sql += ` AND n.leido = FALSE`;
    }
    if (filtros.tipo) {
      sql += ` AND n.tipo = $${idx++}`;
      params.push(filtros.tipo);
    }

    sql += ' ORDER BY n.created_at DESC';

    if (filtros.limit) {
      sql += ` LIMIT $${idx++}`;
      params.push(filtros.limit);
    }

    const { rows } = await db.query(sql, params);
    return rows;
  }

  static async contarNoLeidas(usuarioId) {
    const { rows } = await db.query(
      'SELECT COUNT(*) AS total FROM notificaciones WHERE usuario_id = $1 AND leido = FALSE',
      [usuarioId]
    );
    return parseInt(rows[0].total);
  }

  static async crear(data) {
    const { rows } = await db.query(`
      INSERT INTO notificaciones (usuario_id, personal_id, titulo, mensaje, tipo, link)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      data.usuario_id,
      data.personal_id || null,
      data.titulo,
      data.mensaje || null,
      data.tipo || 'INFO',
      data.link || null
    ]);
    return rows[0];
  }

  static async crearParaTodos(data, soloAdmin = true) {
    let sql = 'SELECT id FROM usuarios WHERE activo = TRUE';
    if (soloAdmin) {
      const ConfiguracionService = require('./configuracionService');
      const adminRole = await ConfiguracionService.get('seguridad_rol_admin', 'ADMIN');
      sql += ` AND id IN (SELECT usuario_id FROM usuario_roles WHERE rol_id IN (SELECT id FROM roles WHERE nombre = '${adminRole}'))`;
    }
    const { rows: usuarios } = await db.query(sql);
    const resultados = [];
    for (const u of usuarios) {
      const notif = await this.crear({
        usuario_id: u.id,
        personal_id: data.personal_id || null,
        titulo: data.titulo,
        mensaje: data.mensaje,
        tipo: data.tipo || 'INFO',
        link: data.link || null,
      });
      resultados.push(notif);
    }
    return resultados;
  }

  static async marcarLeida(id, usuarioId) {
    const { rows } = await db.query(`
      UPDATE notificaciones SET leido = TRUE
      WHERE id = $1 AND usuario_id = $2
      RETURNING *
    `, [id, usuarioId]);
    return rows[0] || null;
  }

  static async marcarTodasLeidas(usuarioId) {
    await db.query(
      'UPDATE notificaciones SET leido = TRUE WHERE usuario_id = $1 AND leido = FALSE',
      [usuarioId]
    );
    return { success: true };
  }

  static async eliminar(id, usuarioId) {
    const { rows } = await db.query(
      'DELETE FROM notificaciones WHERE id = $1 AND usuario_id = $2 RETURNING id',
      [id, usuarioId]
    );
    return rows.length > 0;
  }

  static async getResumen(usuarioId) {
    const { rows } = await db.query(`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE leido = FALSE) AS no_leidas,
        COUNT(*) FILTER (WHERE leido = FALSE AND tipo = 'ALERT') AS alertas
      FROM notificaciones
      WHERE usuario_id = $1
    `, [usuarioId]);
    return rows[0];
  }
}

module.exports = NotificacionesService;
