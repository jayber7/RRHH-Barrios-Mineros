const express = require('express');
const router = express.Router();
const SancionesController = require('../controllers/sancionesController');

router.get('/atrasos', SancionesController.getSancionesAtrasos);
router.post('/atrasos', SancionesController.createSancionAtraso);
router.put('/atrasos/:id', SancionesController.updateSancionAtraso);
router.delete('/atrasos/:id', SancionesController.deleteSancionAtraso);

router.get('/faltas', SancionesController.getSancionesFaltas);
router.post('/faltas', SancionesController.createSancionFalta);
router.put('/faltas/:id', SancionesController.updateSancionFalta);
router.delete('/faltas/:id', SancionesController.deleteSancionFalta);

router.get('/motivos', SancionesController.getMotivos);

module.exports = router;
