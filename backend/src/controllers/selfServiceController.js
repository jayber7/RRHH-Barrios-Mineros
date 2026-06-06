const SelfServiceService = require('../services/selfServiceService');
const JustificacionesService = require('../services/justificacionesService');

class SelfServiceController {
  static async getResumen(req, res) {
    try {
      const personalId = req.usuario.personal_id;
      if (!personalId) {
        return res.status(400).json({ error: 'Usuario sin vinculación con personal' });
      }
      const data = await SelfServiceService.getResumen(personalId);
      res.json(data);
    } catch (error) {
      console.error('Error al obtener resumen:', error);
      res.status(500).json({ error: 'Error al obtener resumen' });
    }
  }

  static async getMarcaciones(req, res) {
    try {
      const personalId = req.usuario.personal_id;
      if (!personalId) {
        return res.status(400).json({ error: 'Usuario sin vinculación con personal' });
      }
      const limit = parseInt(req.query.limit) || 50;
      const data = await SelfServiceService.getMarcaciones(personalId, limit);
      res.json(data);
    } catch (error) {
      console.error('Error al obtener marcaciones:', error);
      res.status(500).json({ error: 'Error al obtener marcaciones' });
    }
  }

  static async createJustificacion(req, res) {
    try {
      const personalId = req.usuario.personal_id;
      if (!personalId) {
        return res.status(400).json({ error: 'Usuario sin vinculación con personal' });
      }
      const data = { ...req.body, personal_id: personalId };
      const justificacion = await JustificacionesService.create(data);
      res.status(201).json(justificacion);
    } catch (error) {
      console.error('Error al crear justificación:', error);
      res.status(500).json({ error: 'Error al crear justificación' });
    }
  }

  static async marcarWeb(req, res) {
    try {
      const personalId = req.usuario.personal_id;
      if (!personalId) {
        return res.status(400).json({ error: 'Usuario sin vinculación con personal' });
      }
      const { latitud, longitud, device_info, justificacion } = req.body;
      const result = await SelfServiceService.marcarWeb(personalId, { latitud, longitud, device_info, justificacion });
      res.status(201).json(result);
    } catch (error) {
      console.error('Error al marcar web:', error);
      res.status(500).json({ error: error.message || 'Error al registrar marcación web' });
    }
  }
}

module.exports = SelfServiceController;
