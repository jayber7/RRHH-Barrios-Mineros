const PermisosService = require('../services/permisosService');

class PermisosController {
  static async listar(req, res) {
    try {
      const { personal_id, tipo, estado, origen, desde, hasta, limit } = req.query;
      const rows = await PermisosService.listar({
        personal_id: personal_id ? parseInt(personal_id) : null,
        tipo, estado, origen, desde, hasta,
        limit: limit ? parseInt(limit) : null
      });
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const item = await PermisosService.getById(parseInt(req.params.id));
      if (!item) return res.status(404).json({ error: 'Permiso no encontrado' });
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async crear(req, res) {
    try {
      const { personal_id, tipo, fecha_inicio, fecha_fin } = req.body;
      if (!personal_id || !tipo || !fecha_inicio || !fecha_fin) {
        return res.status(400).json({ error: 'Faltan campos requeridos: personal_id, tipo, fecha_inicio, fecha_fin' });
      }
      const result = await PermisosService.crear(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async cambiarEstado(req, res) {
    try {
      const { estado } = req.body;
      if (!estado) return res.status(400).json({ error: 'Estado requerido' });

      const result = await PermisosService.cambiarEstado(
        parseInt(req.params.id), estado, req.usuario?.id || null
      );
      if (!result) return res.status(404).json({ error: 'Permiso no encontrado' });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async actualizar(req, res) {
    try {
      const result = await PermisosService.actualizar(parseInt(req.params.id), req.body);
      if (!result) return res.status(404).json({ error: 'Permiso no encontrado' });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async eliminar(req, res) {
    try {
      const ok = await PermisosService.eliminar(parseInt(req.params.id));
      if (!ok) return res.status(404).json({ error: 'Permiso no encontrado' });
      res.json({ mensaje: 'Permiso eliminado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getResumen(req, res) {
    try {
      const resumen = await PermisosService.getResumen();
      res.json(resumen);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getTipos(req, res) {
    try {
      const tipos = await PermisosService.getTipos();
      res.json(tipos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getStats(req, res) {
    try {
      const stats = await PermisosService.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = PermisosController;
