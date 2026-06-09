const express = require('express');
const router = express.Router();
const SancionesController = require('../controllers/sancionesController');
const { authMiddleware, checkPermission } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/atrasos', checkPermission('sanciones.ver'), SancionesController.getSancionesAtrasos);
router.post('/atrasos', checkPermission('sanciones.gestionar'), SancionesController.createSancionAtraso);
router.put('/atrasos/:id', checkPermission('sanciones.gestionar'), SancionesController.updateSancionAtraso);
router.delete('/atrasos/:id', checkPermission('sanciones.gestionar'), SancionesController.deleteSancionAtraso);

router.get('/faltas', checkPermission('sanciones.ver'), SancionesController.getSancionesFaltas);
router.post('/faltas', checkPermission('sanciones.gestionar'), SancionesController.createSancionFalta);
router.put('/faltas/:id', checkPermission('sanciones.gestionar'), SancionesController.updateSancionFalta);
router.delete('/faltas/:id', checkPermission('sanciones.gestionar'), SancionesController.deleteSancionFalta);

router.get('/motivos', checkPermission('sanciones.ver'), SancionesController.getMotivos);

module.exports = router;
