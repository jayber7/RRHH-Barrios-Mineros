const ConfiguracionService = require('../services/configuracionService');

class ConfiguracionController {
  static async getAll(req, res) {
    try {
      const config = await ConfiguracionService.getAll();
      res.json(config);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener configuración' });
    }
  }

  static async update(req, res) {
    try {
      const { clave, valor } = req.body;
      if (!clave) return res.status(400).json({ error: 'clave requerida' });
      const result = await ConfiguracionService.update(clave, valor);
      if (!result) return res.status(404).json({ error: 'Clave no encontrada o no editable' });
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar configuración' });
    }
  }

  static async getTiposPermiso(req, res) {
    try {
      const tipos = await ConfiguracionService.getTiposPermiso();
      res.json(tipos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener tipos de permiso' });
    }
  }

  static async createTipoPermiso(req, res) {
    try {
      const tipo = await ConfiguracionService.createTipoPermiso(req.body);
      res.status(201).json(tipo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear tipo de permiso' });
    }
  }

  static async updateTipoPermiso(req, res) {
    try {
      const tipo = await ConfiguracionService.updateTipoPermiso(parseInt(req.params.id), req.body);
      if (!tipo) return res.status(404).json({ error: 'Tipo de permiso no encontrado' });
      res.json(tipo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar tipo de permiso' });
    }
  }

  static async deleteTipoPermiso(req, res) {
    try {
      const ok = await ConfiguracionService.deleteTipoPermiso(parseInt(req.params.id));
      if (!ok) return res.status(404).json({ error: 'Tipo de permiso no encontrado' });
      res.json({ mensaje: 'Tipo de permiso eliminado' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar tipo de permiso' });
    }
  }
}

module.exports = ConfiguracionController;
