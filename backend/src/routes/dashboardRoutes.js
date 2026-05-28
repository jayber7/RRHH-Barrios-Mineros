const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/stats', DashboardController.getStats);
router.get('/detalle-diario', DashboardController.getDetalleDiario);

module.exports = router;
