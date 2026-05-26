const express = require('express');
const router = express.Router();
const ReporteController = require('../controllers/reporteController');

router.get('/inventario', ReporteController.getInventarioPersonal);
router.get('/contratos-vencer', ReporteController.getContratosPorVencer);
router.get('/config', ReporteController.getReportesConfig);

module.exports = router;
