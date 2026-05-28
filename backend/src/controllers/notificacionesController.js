const NotificacionesService = require('../services/notificacionesService');

class NotificacionesController {
  static async listar(req, res) {
    try {
      const { solo_no_leidas, tipo, limit } = req.query;
      const rows = await NotificacionesService.listar(req.usuario.id, {
        soloNoLeidas: solo_no_leidas === 'true',
        tipo,
        limit: limit ? parseInt(limit) : null
      });
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async contarNoLeidas(req, res) {
    try {
      const total = await NotificacionesService.contarNoLeidas(req.usuario.id);
      res.json({ total });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async crear(req, res) {
    try {
      const { usuario_id, personal_id, titulo, mensaje, tipo, link } = req.body;
      if (!titulo) return res.status(400).json({ error: 'Título requerido' });
      const result = await NotificacionesService.crear({
        usuario_id: usuario_id || req.usuario.id,
        personal_id, titulo, mensaje, tipo: tipo || 'INFO', link
      });
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async marcarLeida(req, res) {
    try {
      const result = await NotificacionesService.marcarLeida(
        parseInt(req.params.id), req.usuario.id
      );
      if (!result) return res.status(404).json({ error: 'Notificación no encontrada' });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async marcarTodasLeidas(req, res) {
    try {
      const result = await NotificacionesService.marcarTodasLeidas(req.usuario.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async eliminar(req, res) {
    try {
      const ok = await NotificacionesService.eliminar(parseInt(req.params.id), req.usuario.id);
      if (!ok) return res.status(404).json({ error: 'Notificación no encontrada' });
      res.json({ mensaje: 'Notificación eliminada' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getResumen(req, res) {
    try {
      const resumen = await NotificacionesService.getResumen(req.usuario.id);
      res.json(resumen);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = NotificacionesController;
