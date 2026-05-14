const BiometricoService = require('../services/biometricoService');
const db = require('../config/db');

class BiometricoController {
  static async getConfig(req, res) {
    try {
      const { rows } = await db.query('SELECT * FROM biometrico_config LIMIT 1');
      res.json(rows[0] || {});
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener configuración' });
    }
  }

  static async updateConfig(req, res) {
    try {
      const { ip_address, port, comms_key } = req.body;
      const { rows } = await db.query(`
        INSERT INTO biometrico_config (id, ip_address, port, comms_key)
        VALUES (1, $1, $2, $3)
        ON CONFLICT (id) DO UPDATE SET 
            ip_address = EXCLUDED.ip_address,
            port = EXCLUDED.port,
            comms_key = EXCLUDED.comms_key
        RETURNING *
      `, [ip_address, port, comms_key]);
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar configuración' });
    }
  }

  static async syncLogs(req, res) {
    try {
      const result = await BiometricoService.syncLogs();
      res.json({ message: 'Sincronización exitosa', ...result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getUsers(req, res) {
    try {
      const users = await BiometricoService.syncUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getRawLogs(req, res) {
    try {
        const { rows } = await db.query(`
            SELECT b.*, p.primer_nombre, p.apellido_paterno
            FROM biometrico_logs_raw b
            LEFT JOIN personal p ON b.biometrico_id = p.biometrico_id
            ORDER BY b.timestamp DESC
            LIMIT 100
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener registros crudos' });
    }
  }
}

module.exports = BiometricoController;
