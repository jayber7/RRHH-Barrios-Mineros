const BiometricoService = require('../services/biometricoService');
const ValidacionesService = require('../services/validacionesService');
const CalculoAsistenciaService = require('../services/calculoAsistenciaService');
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

  static async importLogs(req, res) {
    try {
      const { marcas } = req.body;
      if (!Array.isArray(marcas) || marcas.length === 0) {
        return res.status(400).json({ error: 'Se requiere un array "marcas" con al menos un registro' });
      }

      let insertados = 0;
      let omitidos = 0;
      let errores = 0;

      for (const m of marcas) {
        if (!m.biometrico_id || !m.timestamp) {
          errores++;
          continue;
        }
        try {
          const { rows } = await db.query(`
            INSERT INTO biometrico_logs_raw (biometrico_id, timestamp, verificacion_tipo, estado_asistencia, device_ip)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (biometrico_id, timestamp) DO NOTHING
            RETURNING id
          `, [
            m.biometrico_id,
            m.timestamp,
            m.verificacion_tipo || 0,
            m.estado_asistencia || 0,
            m.device_ip || 'IMPORTACION_MANUAL'
          ]);
          if (rows.length > 0) insertados++;
          else omitidos++;
        } catch (e) {
          errores++;
        }
      }

      res.json({
        mensaje: `Importación completada`,
        total_recibidos: marcas.length,
        insertados,
        omitidos,
        errores
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getValidaciones(req, res) {
    try {
      const { fecha_inicio, fecha_fin, personal_id } = req.query;
      if (!fecha_inicio || !fecha_fin) {
        return res.status(400).json({ error: 'Se requieren fecha_inicio y fecha_fin' });
      }

      let resultado;
      if (personal_id) {
        resultado = await ValidacionesService.ejecutarPorEmpleado(parseInt(personal_id), fecha_inicio, fecha_fin);
      } else {
        resultado = await ValidacionesService.ejecutarTodas(fecha_inicio, fecha_fin);
      }

      res.json(resultado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async recalcularAsistencia(req, res) {
    try {
      const { mes, anio, personal_id } = req.body;
      if (!mes || !anio) {
        return res.status(400).json({ error: 'Se requieren mes y anio' });
      }

      if (personal_id) {
        const resultado = await CalculoAsistenciaService.procesarMes(personal_id, mes, anio);
        return res.json({ mensaje: 'Recálculo completado', resultados: [resultado] });
      }

      const resultado = await CalculoAsistenciaService.procesarTodos(mes, anio);
      res.json({ mensaje: 'Recálculo masivo completado', ...resultado });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = BiometricoController;
