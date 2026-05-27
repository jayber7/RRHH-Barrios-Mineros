const SancionesService = require('../services/sancionesService');

class SancionesController {
  static async getSancionesAtrasos(req, res) {
    try {
      const sanciones = await SancionesService.getSancionesAtrasos();
      res.json(sanciones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener sanciones por atrasos' });
    }
  }

  static async createSancionAtraso(req, res) {
    try {
      const sancion = await SancionesService.createSancionAtraso(req.body);
      res.status(201).json(sancion);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear sanción' });
    }
  }

  static async updateSancionAtraso(req, res) {
    try {
      const sancion = await SancionesService.updateSancionAtraso(req.params.id, req.body);
      if (!sancion) return res.status(404).json({ error: 'Sanción no encontrada' });
      res.json(sancion);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar sanción' });
    }
  }

  static async deleteSancionAtraso(req, res) {
    try {
      const deleted = await SancionesService.deleteSancionAtraso(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Sanción no encontrada' });
      res.json({ message: 'Sanción eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar sanción' });
    }
  }

  static async getSancionesFaltas(req, res) {
    try {
      const sanciones = await SancionesService.getSancionesFaltas();
      res.json(sanciones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener sanciones por faltas' });
    }
  }

  static async createSancionFalta(req, res) {
    try {
      const sancion = await SancionesService.createSancionFalta(req.body);
      res.status(201).json(sancion);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear sanción' });
    }
  }

  static async updateSancionFalta(req, res) {
    try {
      const sancion = await SancionesService.updateSancionFalta(req.params.id, req.body);
      if (!sancion) return res.status(404).json({ error: 'Sanción no encontrada' });
      res.json(sancion);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar sanción' });
    }
  }

  static async deleteSancionFalta(req, res) {
    try {
      const deleted = await SancionesService.deleteSancionFalta(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Sanción no encontrada' });
      res.json({ message: 'Sanción eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar sanción' });
    }
  }

  static async getMotivos(req, res) {
    try {
      const motivos = await SancionesService.getMotivos();
      res.json(motivos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener motivos' });
    }
  }
}

module.exports = SancionesController;
