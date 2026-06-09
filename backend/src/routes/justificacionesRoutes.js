const express = require('express');
const router = express.Router();
const JustificacionesController = require('../controllers/justificacionesController');
const { authMiddleware, checkPermission } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', checkPermission('justificaciones.ver'), JustificacionesController.getJustificaciones);
router.get('/:id', checkPermission('justificaciones.ver'), JustificacionesController.getJustificacion);
router.post('/', checkPermission('justificaciones.gestionar'), JustificacionesController.createJustificacion);
router.put('/:id', checkPermission('justificaciones.gestionar'), JustificacionesController.updateJustificacion);
router.delete('/:id', checkPermission('justificaciones.gestionar'), JustificacionesController.deleteJustificacion);

module.exports = router;
