const express = require('express');
const router = express.Router();
const SelfServiceController = require('../controllers/selfServiceController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/resumen', SelfServiceController.getResumen);
router.get('/marcaciones', SelfServiceController.getMarcaciones);
router.post('/justificar', SelfServiceController.createJustificacion);
router.post('/marcar', SelfServiceController.marcarWeb);

module.exports = router;
