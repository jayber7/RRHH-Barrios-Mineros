const express = require('express');
const router = express.Router();
const JustificacionesController = require('../controllers/justificacionesController');

router.get('/', JustificacionesController.getJustificaciones);
router.get('/:id', JustificacionesController.getJustificacion);
router.post('/', JustificacionesController.createJustificacion);
router.put('/:id', JustificacionesController.updateJustificacion);
router.delete('/:id', JustificacionesController.deleteJustificacion);

module.exports = router;
