const db = require('../config/db');

class TurnosGridAuditService {
  static async registrar(usuarioId, accion, datos) {
    const { grid_mensual_id, personal_id, datos_anteriores, datos_nuevos, ip_address, user_agent } = datos;
    
    const { rows } = await db.query(`
      INSERT INTO turnos_grid_auditoria (grid_mensual_id, personal_id, accion, datos_anteriores, datos_nuevos, usuario_id, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `, [grid_mensual_id, personal_id, accion, datos_anteriores, datos_nuevos, usuarioId, ip_address, user_agent]);
    
    return rows[0];
  }

  static async registrarBatch(usuarioId, accion, cambios, ip, userAgent) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      const resultados = [];
      
      for (const cambio of cambios) {
        const { rows } = await client.query(`
          INSERT INTO turnos_grid_auditoria (grid_mensual_id, personal_id, accion, datos_anteriores, datos_nuevos, usuario_id, ip_address, user_agent)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
        `, [
          cambio.grid_mensual_id,
          cambio.personal_id,
          cambio.accion,
          cambio.datos_anteriores || null,
          cambio.datos_nuevos || null,
          usuarioId,
          ip,
          userAgent
        ]);
        resultados.push(rows[0]);
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

  static async getHistorial(filtros = {}) {
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
    if (filtros.usuario_id) {
      params.push(filtros.usuario_id);
      where.push(`tga.usuario_id = $${idx++}`);
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
    const page = parseInt(filtros.page) || 1;
    const offset = (page - 1) * limit;
    params.push(limit, offset);

    const { rows } = await db.query(`
      SELECT tga.*, 
             p.ci, p.primer_nombre, p.segundo_nombre, p.apellido_paterno, p.apellido_materno,
             u.username as usuario_nombre,
             gs.unidad_servicio,
             gm.dia, gm.franja_inicio, gm.franja_fin, gm.tipo_franja
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
      data: rows.map(r => ({
        ...r,
        personal_nombre: [r.primer_nombre, r.segundo_nombre, r.apellido_paterno, r.apellido_materno].filter(Boolean).join(' '),
        datos_anteriores: r.datos_anteriores ? JSON.parse(r.datos_anteriores) : null,
        datos_nuevos: r.datos_nuevos ? JSON.parse(r.datos_nuevos) : null
      })),
      pagination: {
        total: parseInt(countRows[0].total),
        page,
        limit,
        totalPages: Math.ceil(parseInt(countRows[0].total) / limit)
      }
    };
  }

  static async getHistorialPersonal(personalId, anio, mes, servicioId) {
    const { rows } = await db.query(`
      SELECT tga.*, 
             u.username as usuario_nombre,
             gm.dia, gm.franja_inicio, gm.franja_fin, gm.tipo_franja
      FROM turnos_grid_auditoria tga
      LEFT JOIN usuarios u ON tga.usuario_id = u.id
      LEFT JOIN turnos_grid_mensual gm ON tga.grid_mensual_id = gm.id
      WHERE tga.personal_id = $1
        AND gm.anio = $2 AND gm.mes = $3
        ${servicioId ? 'AND gm.servicio_id = $4' : ''}
      ORDER BY tga.created_at DESC
    `, servicioId ? [personalId, anio, mes, servicioId] : [personalId, anio, mes]);

    return rows.map(r => ({
      ...r,
      datos_anteriores: r.datos_anteriores ? JSON.parse(r.datos_anteriores) : null,
      datos_nuevos: r.datos_nuevos ? JSON.parse(r.datos_nuevos) : null
    }));
  }

  static async getEstadisticas(servicioId, anio, mes) {
    const { rows } = await db.query(`
      SELECT 
        tga.accion,
        COUNT(*) as total,
        COUNT(DISTINCT tga.personal_id) as personal_afectado,
        COUNT(DISTINCT tga.usuario_id) as usuarios_activos
      FROM turnos_grid_auditoria tga
      LEFT JOIN turnos_grid_mensual gm ON tga.grid_mensual_id = gm.id
      WHERE gm.servicio_id = $1 AND gm.anio = $2 AND gm.mes = $3
      GROUP BY tga.accion
      ORDER BY total DESC
    `, [servicioId, anio, mes]);

    const { rows: topUsuarios } = await db.query(`
      SELECT u.username, COUNT(*) as cambios
      FROM turnos_grid_auditoria tga
      LEFT JOIN turnos_grid_mensual gm ON tga.grid_mensual_id = gm.id
      LEFT JOIN usuarios u ON tga.usuario_id = u.id
      WHERE gm.servicio_id = $1 AND gm.anio = $2 AND gm.mes = $3
      GROUP BY u.username
      ORDER BY cambios DESC
      LIMIT 10
    `, [servicioId, anio, mes]);

    return { porAccion: rows, topUsuarios };
  }
}

module.exports = TurnosGridAuditService;