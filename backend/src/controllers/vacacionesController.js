const VacacionesService = require('../services/vacacionesService');

class VacacionesController {
  static async listar(req, res) {
    try {
      const { personal_id, estado, desde, hasta, limit } = req.query;
      const rows = await VacacionesService.listar({
        personal_id: personal_id ? parseInt(personal_id) : null,
        estado,
        desde,
        hasta,
        limit: limit ? parseInt(limit) : null
      });
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const vac = await VacacionesService.getById(parseInt(req.params.id));
      if (!vac) return res.status(404).json({ error: 'Vacación no encontrada' });
      res.json(vac);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSaldo(req, res) {
    try {
      const saldo = await VacacionesService.getSaldo(parseInt(req.params.personal_id));
      res.json(saldo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async crear(req, res) {
    try {
      const { personal_id, fecha_inicio, fecha_fin, dias_solicitados, observaciones } = req.body;
      if (!personal_id || !fecha_inicio || !fecha_fin) {
        return res.status(400).json({ error: 'Faltan campos requeridos: personal_id, fecha_inicio, fecha_fin' });
      }

      const saldo = await VacacionesService.getSaldo(personal_id);
      const dias = dias_solicitados || Math.ceil(Math.abs(new Date(fecha_fin) - new Date(fecha_inicio)) / (1000 * 60 * 60 * 24)) + 1;

      if (dias > saldo.disponible) {
        return res.status(400).json({
          error: `Saldo insuficiente. Disponible: ${saldo.disponible}, Solicitado: ${dias}`
        });
      }

      const result = await VacacionesService.crear(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async cambiarEstado(req, res) {
    try {
      const { estado } = req.body;
      if (!estado) return res.status(400).json({ error: 'Estado requerido' });

      const result = await VacacionesService.cambiarEstado(
        parseInt(req.params.id),
        estado,
        req.usuario?.id || null
      );

      if (!result) return res.status(404).json({ error: 'Vacación no encontrada' });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async actualizar(req, res) {
    try {
      const result = await VacacionesService.actualizar(parseInt(req.params.id), req.body);
      if (!result) return res.status(404).json({ error: 'Vacación no encontrada' });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async eliminar(req, res) {
    try {
      const ok = await VacacionesService.eliminar(parseInt(req.params.id));
      if (!ok) return res.status(404).json({ error: 'Vacación no encontrada' });
      res.json({ mensaje: 'Vacación eliminada' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getResumen(req, res) {
    try {
      const resumen = await VacacionesService.getResumen();
      res.json(resumen);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = VacacionesController;
