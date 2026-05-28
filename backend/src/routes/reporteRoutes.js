const express = require('express');
const router = express.Router();
const ReporteController = require('../controllers/reporteController');

router.get('/inventario', ReporteController.getInventarioPersonal);
router.get('/contratos-vencer', ReporteController.getContratosPorVencer);
router.get('/config', ReporteController.getReportesConfig);

router.get('/asistencia/mensual', ReporteController.getReporteMensual);
router.get('/asistencia/planilla', ReporteController.getPlanillaConsolidada);
router.get('/asistencia/atrasos', ReporteController.getReporteAtrasos);
router.get('/asistencia/sanciones', ReporteController.getReporteSanciones);

module.exports = router;
