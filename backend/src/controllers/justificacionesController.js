const JustificacionesService = require('../services/justificacionesService');

class JustificacionesController {
  static async getJustificaciones(req, res) {
    try {
      const justificaciones = await JustificacionesService.getAll(req.query);
      res.json(justificaciones);
    } catch (error) {
      console.error('Error al obtener justificaciones:', error);
      res.status(500).json({ error: 'Error al obtener justificaciones' });
    }
  }

  static async getJustificacion(req, res) {
    try {
      const justificacion = await JustificacionesService.getById(req.params.id);
      if (!justificacion) return res.status(404).json({ error: 'Justificación no encontrada' });
      res.json(justificacion);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener justificación' });
    }
  }

  static async createJustificacion(req, res) {
    try {
      const justificacion = await JustificacionesService.create(req.body);
      res.status(201).json(justificacion);
    } catch (error) {
      console.error('Error al crear justificación:', error);
      res.status(500).json({ error: 'Error al crear justificación' });
    }
  }

  static async updateJustificacion(req, res) {
    try {
      const justificacion = await JustificacionesService.update(req.params.id, req.body);
      if (!justificacion) return res.status(404).json({ error: 'Justificación no encontrada' });
      res.json(justificacion);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar justificación' });
    }
  }

  static async deleteJustificacion(req, res) {
    try {
      const deleted = await JustificacionesService.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Justificación no encontrada' });
      res.json({ message: 'Justificación eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar justificación' });
    }
  }
}

module.exports = JustificacionesController;
