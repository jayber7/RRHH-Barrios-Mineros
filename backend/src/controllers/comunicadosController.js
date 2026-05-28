const ComunicadosService = require('../services/comunicadosService');

class ComunicadosController {
  static async getAll(req, res) {
    try {
      const filters = {
        estado: req.query.estado,
        busqueda: req.query.busqueda,
        desde: req.query.desde,
        hasta: req.query.hasta,
        limit: parseInt(req.query.limit) || 50,
        offset: req.query.page ? (parseInt(req.query.page) - 1) * (parseInt(req.query.limit) || 50) : undefined,
      };
      const data = await ComunicadosService.getAll(filters);
      const total = data.length > 0 ? parseInt(data[0].total_count) : 0;
      res.json({
        data,
        pagination: {
          total,
          page: parseInt(req.query.page) || 1,
          limit: filters.limit,
          totalPages: Math.ceil(total / filters.limit),
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al listar comunicados' });
    }
  }

  static async getById(req, res) {
    try {
      const comunicado = await ComunicadosService.getById(parseInt(req.params.id));
      if (!comunicado) return res.status(404).json({ error: 'Comunicado no encontrado' });
      res.json(comunicado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener comunicado' });
    }
  }

  static async create(req, res) {
    try {
      const data = {
        ...req.body,
        gestion: parseInt(req.body.gestion) || 2026,
        fecha_documento: req.body.fecha_documento || new Date().toISOString().split('T')[0],
      };
      if (data.destinatarios && typeof data.destinatarios === 'string') {
        data.destinatarios = JSON.parse(data.destinatarios);
      }
      if (data.etiquetas && typeof data.etiquetas === 'string') {
        data.etiquetas = JSON.parse(data.etiquetas);
      }
      const comunicado = await ComunicadosService.create(data, req.usuario.id);
      await ComunicadosService.createNotificaciones(comunicado);
      res.status(201).json(comunicado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear comunicado' });
    }
  }

  static async marcarLeido(req, res) {
    try {
      const result = await ComunicadosService.marcarLeido(
        parseInt(req.params.id),
        req.usuario.personal_id
      );
      if (!result) return res.status(404).json({ error: 'Distribución no encontrada' });
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al marcar como leído' });
    }
  }

  static async getDestinatarios(req, res) {
    try {
      const destinatarios = await ComunicadosService.getDestinatariosDisponibles();
      res.json(destinatarios);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener destinatarios' });
    }
  }

  static async generarPDF(req, res) {
    try {
      const comunicado = await ComunicadosService.getById(parseInt(req.params.id));
      if (!comunicado) return res.status(404).json({ error: 'Comunicado no encontrado' });
      const pdfBytes = await ComunicadosService.generarPDF(comunicado);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=comunicado_${comunicado.hr_correlativo}_${comunicado.gestion}.pdf`);
      res.send(Buffer.from(pdfBytes));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al generar PDF' });
    }
  }
}

module.exports = ComunicadosController;
