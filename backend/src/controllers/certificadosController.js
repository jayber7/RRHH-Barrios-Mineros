const CertificadosService = require('../services/certificadosService');

class CertificadosController {
  static async listar(req, res) {
    try {
      const { personal_id, tipo, estado, limit } = req.query;
      const rows = await CertificadosService.listar({
        personal_id: personal_id ? parseInt(personal_id) : null,
        tipo, estado,
        limit: limit ? parseInt(limit) : null
      });
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const item = await CertificadosService.getById(parseInt(req.params.id));
      if (!item) return res.status(404).json({ error: 'Certificado no encontrado' });
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async generar(req, res) {
    try {
      const { personal_id, tipo } = req.body;
      if (!personal_id || !tipo) {
        return res.status(400).json({ error: 'Faltan campos: personal_id, tipo' });
      }
      const tiposValidos = ['TRABAJO', 'INGRESOS', 'ANTIGUEDAD', 'ASISTENCIA'];
      if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({ error: `Tipo inválido. Válidos: ${tiposValidos.join(', ')}` });
      }
      const result = await CertificadosService.generarPDF(tipo, personal_id);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPDF(req, res) {
    try {
      const pdf = await CertificadosService.getPDF(parseInt(req.params.id));
      if (!pdf) return res.status(404).json({ error: 'PDF no encontrado' });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${pdf.filename}"`);
      res.send(pdf.buffer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async cambiarEstado(req, res) {
    try {
      const { estado } = req.body;
      if (!estado) return res.status(400).json({ error: 'Estado requerido' });
      const result = await CertificadosService.cambiarEstado(parseInt(req.params.id), estado);
      if (!result) return res.status(404).json({ error: 'Certificado no encontrado' });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getResumen(req, res) {
    try {
      const resumen = await CertificadosService.getResumen();
      res.json(resumen);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = CertificadosController;
