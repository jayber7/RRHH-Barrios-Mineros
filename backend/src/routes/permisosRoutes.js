const express = require('express');
const router = express.Router();
const PermisosController = require('../controllers/permisosController');

router.get('/', PermisosController.listar);
router.get('/resumen', PermisosController.getResumen);
router.get('/tipos', PermisosController.getTipos);
router.get('/stats', PermisosController.getStats);
router.get('/:id', PermisosController.getById);
router.post('/', PermisosController.crear);
router.put('/:id', PermisosController.actualizar);
router.put('/:id/estado', PermisosController.cambiarEstado);
router.delete('/:id', PermisosController.eliminar);

module.exports = router;
