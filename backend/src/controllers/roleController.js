const db = require('../config/db');

class RoleController {
  static async getAll(req, res) {
    try {
      const { rows } = await db.query(`
        SELECT r.*, COUNT(ur.usuario_id)::int as total_usuarios
        FROM roles r
        LEFT JOIN usuario_roles ur ON r.id = ur.rol_id
        GROUP BY r.id
        ORDER BY r.id
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { rows } = await db.query('SELECT * FROM roles WHERE id = $1', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Rol no encontrado' });
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const { nombre, descripcion } = req.body;
      if (!nombre) return res.status(400).json({ error: 'Nombre del rol requerido' });
      const { rows } = await db.query(
        'INSERT INTO roles (nombre, descripcion) VALUES ($1, $2) RETURNING *',
        [nombre.toUpperCase(), descripcion || '']
      );
      res.status(201).json(rows[0]);
    } catch (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'El rol ya existe' });
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { nombre, descripcion } = req.body;
      const { rows } = await db.query(
        'UPDATE roles SET nombre = COALESCE($1, nombre), descripcion = COALESCE($2, descripcion) WHERE id = $3 RETURNING *',
        [nombre ? nombre.toUpperCase() : null, descripcion, req.params.id]
      );
      if (rows.length === 0) return res.status(404).json({ error: 'Rol no encontrado' });
      res.json(rows[0]);
    } catch (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'El rol ya existe' });
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { rows } = await db.query('DELETE FROM roles WHERE id = $1 RETURNING id', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Rol no encontrado' });
      res.json({ mensaje: 'Rol eliminado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPermisos(req, res) {
    try {
      const { rows } = await db.query(`
        SELECT p.*, CASE WHEN rp.rol_id IS NOT NULL THEN true ELSE false END as asignado
        FROM permisos p
        LEFT JOIN rol_permisos rp ON p.id = rp.permiso_id AND rp.rol_id = $1
        ORDER BY p.modulo, p.codigo
      `, [req.params.id]);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updatePermisos(req, res) {
    try {
      const { permiso_ids } = req.body;
      if (!Array.isArray(permiso_ids)) {
        return res.status(400).json({ error: 'permiso_ids debe ser un array' });
      }
      const client = await db.connect();
      try {
        await client.query('BEGIN');
        await client.query('DELETE FROM rol_permisos WHERE rol_id = $1', [req.params.id]);
        for (const pid of permiso_ids) {
          await client.query(
            'INSERT INTO rol_permisos (rol_id, permiso_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [req.params.id, pid]
          );
        }
        await client.query('COMMIT');
        res.json({ mensaje: 'Permisos actualizados' });
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      } finally {
        client.release();
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllPermisos(req, res) {
    try {
      const { rows } = await db.query('SELECT * FROM permisos ORDER BY modulo, codigo');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = RoleController;
