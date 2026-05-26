const ReporteService = require('../services/reporteService');
const db = require('../config/db');

const getInventarioPersonal = async (req, res) => {
  try {
    const { estado, fuente_id, tipo_id, unidad_id } = req.query;
    const buffer = await ReporteService.generarInventarioPersonal({
      estado, fuente_id: fuente_id ? parseInt(fuente_id) : null,
      tipo_id: tipo_id ? parseInt(tipo_id) : null,
      unidad_id: unidad_id ? parseInt(unidad_id) : null
    });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=inventario_personal_hbm_${new Date().toISOString().split('T')[0]}.xlsx`);
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getContratosPorVencer = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const buffer = await ReporteService.generarContratosPorVencer(parseInt(days));
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=contratos_por_vencer_${new Date().toISOString().split('T')[0]}.xlsx`);
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReportesConfig = async (req, res) => {
  try {
    const { rows: fuentes } = await db.query('SELECT id, nombre_fuente FROM cat_fuentes_financiamiento ORDER BY nombre_fuente');
    const { rows: tipos } = await db.query('SELECT id, nombre_tipo FROM cat_tipos_personal ORDER BY nombre_tipo');
    const { rows: unidades } = await db.query('SELECT id, nombre_unidad FROM cat_unidades_servicios ORDER BY nombre_unidad');
    
    res.json({ fuentes, tipos, unidades });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getInventarioPersonal,
  getContratosPorVencer,
  getReportesConfig
};
