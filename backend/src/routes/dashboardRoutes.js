const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');
const { authMiddleware, checkPermission } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/stats', checkPermission('dashboard.ver'), DashboardController.getStats);
router.get('/biometrico', checkPermission('dashboard.ver'), DashboardController.getBiometricoStats);
router.get('/detalle-diario', checkPermission('dashboard.ver'), DashboardController.getDetalleDiario);

module.exports = router;
