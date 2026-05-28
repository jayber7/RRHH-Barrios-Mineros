const db = require('../config/db');
const NotificacionesService = require('./notificacionesService');

class PermisosService {
  static async listar(filtros = {}) {
    let sql = `
      SELECT p.*, per.primer_nombre, per.apellido_paterno, per.ci,
             CONCAT(ap.primer_nombre, ' ', ap.apellido_paterno) AS aprobador_nombre
      FROM permisos_laborales p
      JOIN personal per ON p.personal_id = per.id
      LEFT JOIN usuarios u ON p.aprobado_por = u.id
      LEFT JOIN personal ap ON u.personal_id = ap.id
      WHERE 1=1
    `;
    const params = [];
    let idx = 1;

    if (filtros.personal_id) {
      sql += ` AND p.personal_id = $${idx++}`;
      params.push(filtros.personal_id);
    }
    if (filtros.tipo) {
      sql += ` AND p.tipo = $${idx++}`;
      params.push(filtros.tipo);
    }
    if (filtros.estado) {
      sql += ` AND p.estado = $${idx++}`;
      params.push(filtros.estado);
    }
    if (filtros.origen) {
      sql += ` AND p.origen = $${idx++}`;
      params.push(filtros.origen);
    }
    if (filtros.desde) {
      sql += ` AND p.fecha_inicio >= $${idx++}`;
      params.push(filtros.desde);
    }
    if (filtros.hasta) {
      sql += ` AND p.fecha_fin <= $${idx++}`;
      params.push(filtros.hasta);
    }

    sql += ' ORDER BY p.created_at DESC';

    if (filtros.limit) {
      sql += ` LIMIT $${idx++}`;
      params.push(filtros.limit);
    }

    const { rows } = await db.query(sql, params);
    return rows;
  }

  static async getById(id) {
    const { rows } = await db.query(`
      SELECT p.*, per.primer_nombre, per.apellido_paterno, per.ci,
             CONCAT(ap.primer_nombre, ' ', ap.apellido_paterno) AS aprobador_nombre
      FROM permisos_laborales p
      JOIN personal per ON p.personal_id = per.id
      LEFT JOIN usuarios u ON p.aprobado_por = u.id
      LEFT JOIN personal ap ON u.personal_id = ap.id
      WHERE p.id = $1
    `, [id]);
    return rows[0] || null;
  }

  static async crear(data) {
    const fechaInicio = new Date(data.fecha_inicio);
    const fechaFin = new Date(data.fecha_fin);
    const dias = data.dias || Math.max(1, Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24)) + 1);

    const ins = await db.query(`
      INSERT INTO permisos_laborales (personal_id, tipo, fecha_inicio, fecha_fin, dias, motivo, estado, origen)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'MANUAL')
      RETURNING id
    `, [data.personal_id, data.tipo, data.fecha_inicio, data.fecha_fin, dias, data.motivo || null, data.estado || 'PENDIENTE']);

    return this.getById(ins.rows[0].id);
  }

  static async cambiarEstado(id, nuevoEstado, aprobadoPor) {
    const valido = ['APROBADO', 'RECHAZADO', 'FINALIZADO'];
    if (!valido.includes(nuevoEstado)) {
      throw new Error(`Estado inválido: ${nuevoEstado}`);
    }

    const old = await this.getById(id);

    await db.query(`
      UPDATE permisos_laborales SET estado = $1, aprobado_por = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [nuevoEstado, aprobadoPor, id]);

    const result = await this.getById(id);

    if (old) {
      const msgs = {
        APROBADO: `Permiso de tipo ${old.tipo} aprobado (${old.dias} días, ${new Date(old.fecha_inicio).toLocaleDateString()} - ${new Date(old.fecha_fin).toLocaleDateString()})`,
        RECHAZADO: `Permiso de tipo ${old.tipo} rechazado`,
        FINALIZADO: `Permiso de tipo ${old.tipo} finalizado`,
      };
      try {
        const { rows: userRows } = await db.query('SELECT id FROM usuarios WHERE personal_id = $1', [old.personal_id]);
        for (const u of userRows) {
          await NotificacionesService.crear({
            usuario_id: u.id,
            personal_id: old.personal_id,
            titulo: 'Permiso/Licencia',
            mensaje: msgs[nuevoEstado] || `Estado cambiado a ${nuevoEstado}`,
            tipo: nuevoEstado === 'APROBADO' || nuevoEstado === 'FINALIZADO' ? 'SUCCESS' : 'ALERT',
            link: '/permisos',
          });
        }
      } catch (e) {
        console.error('Error creating notification:', e.message);
      }
    }

    return result;
  }

  static async actualizar(id, data) {
    const campos = [];
    const params = [];
    let idx = 1;

    for (const key of ['personal_id', 'tipo', 'fecha_inicio', 'fecha_fin', 'dias', 'motivo']) {
      if (data[key] !== undefined) {
        campos.push(`${key} = $${idx++}`);
        params.push(data[key]);
      }
    }

    if (campos.length === 0) return this.getById(id);

    campos.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    await db.query(`UPDATE permisos_laborales SET ${campos.join(', ')} WHERE id = $${idx}`, params);
    return this.getById(id);
  }

  static async eliminar(id) {
    const { rows } = await db.query('DELETE FROM permisos_laborales WHERE id = $1 RETURNING id', [id]);
    return rows.length > 0;
  }

  static async getResumen() {
    const { rows } = await db.query(`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE estado = 'PENDIENTE') AS pendientes,
        COUNT(*) FILTER (WHERE estado = 'APROBADO') AS aprobadas,
        COUNT(*) FILTER (WHERE estado = 'FINALIZADO') AS finalizadas,
        COUNT(*) FILTER (WHERE EXTRACT(YEAR FROM fecha_inicio) = EXTRACT(YEAR FROM CURRENT_DATE)) AS este_anio
      FROM permisos_laborales
    `);
    return rows[0];
  }

  static async getTipos() {
    const { rows } = await db.query('SELECT * FROM cat_tipos_permisos ORDER BY nombre');
    return rows;
  }

  static async getStats() {
    const { rows } = await db.query(`
      SELECT tipo, COUNT(*) AS total, COUNT(*) FILTER (WHERE estado = 'PENDIENTE') AS pendientes
      FROM permisos_laborales
      GROUP BY tipo
      ORDER BY total DESC
    `);
    return rows;
  }
}

module.exports = PermisosService;
