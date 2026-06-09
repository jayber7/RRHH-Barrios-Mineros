const express = require('express');
const router = express.Router();
const PermisosController = require('../controllers/permisosController');
const { authMiddleware, checkPermission } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', checkPermission('permisos.ver'), PermisosController.listar);
router.get('/resumen', checkPermission('permisos.ver'), PermisosController.getResumen);
router.get('/tipos', checkPermission('permisos.ver'), PermisosController.getTipos);
router.get('/stats', checkPermission('permisos.ver'), PermisosController.getStats);
router.get('/:id', checkPermission('permisos.ver'), PermisosController.getById);
router.post('/', checkPermission('permisos.gestionar'), PermisosController.crear);
router.put('/:id', checkPermission('permisos.gestionar'), PermisosController.actualizar);
router.put('/:id/estado', checkPermission('permisos.gestionar'), PermisosController.cambiarEstado);
router.delete('/:id', checkPermission('permisos.gestionar'), PermisosController.eliminar);

module.exports = router;
