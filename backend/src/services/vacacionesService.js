const db = require('../config/db');
const NotificacionesService = require('./notificacionesService');

class VacacionesService {
  static async listar(filtros = {}) {
    let sql = `
      SELECT v.*, p.primer_nombre, p.apellido_paterno, p.ci,
             CONCAT(ap.primer_nombre, ' ', ap.apellido_paterno) AS aprobador_nombre
      FROM vacaciones v
      JOIN personal p ON v.personal_id = p.id
      LEFT JOIN usuarios u ON v.aprobado_por = u.id
      LEFT JOIN personal ap ON u.personal_id = ap.id
      WHERE 1=1
    `;
    const params = [];
    let idx = 1;

    if (filtros.personal_id) {
      sql += ` AND v.personal_id = $${idx++}`;
      params.push(filtros.personal_id);
    }
    if (filtros.estado) {
      sql += ` AND v.estado = $${idx++}`;
      params.push(filtros.estado);
    }
    if (filtros.desde) {
      sql += ` AND v.fecha_inicio >= $${idx++}`;
      params.push(filtros.desde);
    }
    if (filtros.hasta) {
      sql += ` AND v.fecha_fin <= $${idx++}`;
      params.push(filtros.hasta);
    }

    sql += ' ORDER BY v.created_at DESC';

    if (filtros.limit) {
      sql += ` LIMIT $${idx++}`;
      params.push(filtros.limit);
    }

    const { rows } = await db.query(sql, params);
    return rows;
  }

  static async getById(id) {
    const { rows } = await db.query(`
      SELECT v.*, p.primer_nombre, p.apellido_paterno, p.ci,
             CONCAT(ap.primer_nombre, ' ', ap.apellido_paterno) AS aprobador_nombre
      FROM vacaciones v
      JOIN personal p ON v.personal_id = p.id
      LEFT JOIN usuarios u ON v.aprobado_por = u.id
      LEFT JOIN personal ap ON u.personal_id = ap.id
      WHERE v.id = $1
    `, [id]);
    return rows[0] || null;
  }

  static async getSaldo(personalId) {
    const { rows: usado } = await db.query(`
      SELECT COALESCE(SUM(dias_solicitados), 0) AS usado
      FROM vacaciones
      WHERE personal_id = $1 AND estado IN ('APROBADO', 'GOZADO')
    `, [personalId]);

    const totalDias = 15;
    return {
      personal_id: personalId,
      total_anual: totalDias,
      usado: parseInt(usado[0].usado),
      disponible: Math.max(0, totalDias - parseInt(usado[0].usado))
    };
  }

  static async crear(data) {
    const fechaInicio = new Date(data.fecha_inicio);
    const fechaFin = new Date(data.fecha_fin);
    const diffTime = Math.abs(fechaFin - fechaInicio);
    const diasSolicitados = data.dias_solicitados || Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const saldo = await this.getSaldo(data.personal_id);

    const ins = await db.query(`
      INSERT INTO vacaciones (personal_id, fecha_inicio, fecha_fin, dias_solicitados,
                              saldo_anterior, saldo_posterior, observaciones)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, [
      data.personal_id, data.fecha_inicio, data.fecha_fin, diasSolicitados,
      saldo.disponible, Math.max(0, saldo.disponible - diasSolicitados),
      data.observaciones || null
    ]);

    const { rows } = await db.query(`
      SELECT v.*, p.primer_nombre, p.apellido_paterno, p.ci,
             CONCAT(ap.primer_nombre, ' ', ap.apellido_paterno) AS aprobador_nombre
      FROM vacaciones v
      JOIN personal p ON v.personal_id = p.id
      LEFT JOIN usuarios u ON v.aprobado_por = u.id
      LEFT JOIN personal ap ON u.personal_id = ap.id
      WHERE v.id = $1
    `, [ins.rows[0].id]);
    return rows[0];
  }

  static async cambiarEstado(id, nuevoEstado, aprobadoPor) {
    const valido = ['APROBADO', 'RECHAZADO', 'ANULADO', 'GOZADO'];
    if (!valido.includes(nuevoEstado)) {
      throw new Error(`Estado inválido: ${nuevoEstado}`);
    }

    const { rows: old } = await db.query('SELECT personal_id, dias_solicitados, fecha_inicio, fecha_fin FROM vacaciones WHERE id = $1', [id]);

    await db.query(`
      UPDATE vacaciones SET estado = $1, aprobado_por = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [nuevoEstado, aprobadoPor, id]);

    const { rows } = await db.query(`
      SELECT v.*, p.primer_nombre, p.apellido_paterno, p.ci,
             CONCAT(ap.primer_nombre, ' ', ap.apellido_paterno) AS aprobador_nombre
      FROM vacaciones v
      JOIN personal p ON v.personal_id = p.id
      LEFT JOIN usuarios u ON v.aprobado_por = u.id
      LEFT JOIN personal ap ON u.personal_id = ap.id
      WHERE v.id = $1
    `, [id]);

    if (old.length > 0 && rows.length > 0) {
      const msgs = {
        APROBADO: `Solicitud de vacaciones aprobada por ${rows[0].aprobador_nombre || 'el administrador'} (${old[0].dias_solicitados} días, ${new Date(old[0].fecha_inicio).toLocaleDateString()} - ${new Date(old[0].fecha_fin).toLocaleDateString()})`,
        RECHAZADO: `Solicitud de vacaciones rechazada`,
        ANULADO: `Solicitud de vacaciones anulada`,
        GOZADO: `Vacaciones marcadas como gozadas (${old[0].dias_solicitados} días)`,
      };
      try {
        const { rows: userRows } = await db.query('SELECT id FROM usuarios WHERE personal_id = $1', [old[0].personal_id]);
        for (const u of userRows) {
          await NotificacionesService.crear({
            usuario_id: u.id,
            personal_id: old[0].personal_id,
            titulo: 'Vacaciones',
            mensaje: msgs[nuevoEstado] || `Estado cambiado a ${nuevoEstado}`,
            tipo: nuevoEstado === 'APROBADO' || nuevoEstado === 'GOZADO' ? 'SUCCESS' : nuevoEstado === 'RECHAZADO' ? 'ALERT' : 'INFO',
            link: '/vacaciones',
          });
        }
        if (nuevoEstado === 'PENDIENTE') {
          const { rows: admins } = await db.query(`
            SELECT DISTINCT u.id FROM usuarios u
            JOIN usuario_roles ur ON u.id = ur.usuario_id
            JOIN roles r ON ur.rol_id = r.id
            WHERE r.codigo IN ('ADMIN', 'JEFE_RRHH')
          `);
          for (const a of admins) {
            await NotificacionesService.crear({
              usuario_id: a.id,
              personal_id: old[0].personal_id,
              titulo: 'Nueva solicitud de vacaciones',
              mensaje: `${rows[0].apellido_paterno} ${rows[0].primer_nombre} solicita ${old[0].dias_solicitados} días de vacaciones`,
              tipo: 'INFO',
              link: '/vacaciones',
            });
          }
        }
      } catch (e) {
        console.error('Error creating notification:', e.message);
      }
    }

    return rows[0] || null;
  }

  static async actualizar(id, data) {
    const campos = [];
    const params = [];
    let idx = 1;

    for (const [key, value] of Object.entries(data)) {
      if (['personal_id', 'fecha_inicio', 'fecha_fin', 'dias_solicitados', 'observaciones'].includes(key)) {
        campos.push(`${key} = $${idx++}`);
        params.push(value);
      }
    }

    if (campos.length === 0) return this.getById(id);

    campos.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);

    await db.query(`
      UPDATE vacaciones SET ${campos.join(', ')} WHERE id = $${idx}
    `, params);

    const { rows } = await db.query(`
      SELECT v.*, p.primer_nombre, p.apellido_paterno, p.ci,
             CONCAT(ap.primer_nombre, ' ', ap.apellido_paterno) AS aprobador_nombre
      FROM vacaciones v
      JOIN personal p ON v.personal_id = p.id
      LEFT JOIN usuarios u ON v.aprobado_por = u.id
      LEFT JOIN personal ap ON u.personal_id = ap.id
      WHERE v.id = $1
    `, [id]);
    return rows[0] || null;
  }

  static async eliminar(id) {
    const { rows } = await db.query('DELETE FROM vacaciones WHERE id = $1 RETURNING id', [id]);
    return rows.length > 0;
  }

  static async getResumen() {
    const { rows } = await db.query(`
      SELECT 
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE estado = 'PENDIENTE') AS pendientes,
        COUNT(*) FILTER (WHERE estado = 'APROBADO') AS aprobadas,
        COUNT(*) FILTER (WHERE estado = 'GOZADO') AS gozadas,
        COALESCE(SUM(dias_solicitados) FILTER (WHERE estado IN ('APROBADO','GOZADO')), 0) AS dias_aprobados
      FROM vacaciones
    `);
    return rows[0];
  }
}

module.exports = VacacionesService;
