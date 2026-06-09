const express = require('express');
const router = express.Router();
const ReporteController = require('../controllers/reporteController');
const { authMiddleware, checkPermission } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/inventario', checkPermission('reportes.ver'), ReporteController.getInventarioPersonal);
router.get('/contratos-vencer', checkPermission('reportes.ver'), ReporteController.getContratosPorVencer);
router.get('/config', checkPermission('reportes.ver'), ReporteController.getReportesConfig);

router.get('/asistencia/mensual', checkPermission('reportes.ver'), ReporteController.getReporteMensual);
router.get('/asistencia/planilla', checkPermission('reportes.ver'), ReporteController.getPlanillaConsolidada);
router.get('/asistencia/atrasos', checkPermission('reportes.ver'), ReporteController.getReporteAtrasos);
router.get('/asistencia/sanciones', checkPermission('reportes.ver'), ReporteController.getReporteSanciones);
router.get('/plantillas-por-departamento', checkPermission('reportes.ver'), ReporteController.getPlantillasPorDepartamento);

module.exports = router;
