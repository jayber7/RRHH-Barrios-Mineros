const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { authMiddleware, checkPermission } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', checkPermission('usuarios.ver'), usuarioController.getAll);
router.post('/', checkPermission('usuarios.gestionar'), usuarioController.createUser);
router.get('/roles', checkPermission('usuarios.ver'), usuarioController.getRoles);
router.get('/permisos', checkPermission('usuarios.ver'), usuarioController.getPermisos);
router.put('/:id/roles', checkPermission('usuarios.gestionar'), usuarioController.updateRoles);
router.put('/:id/toggle-activo', checkPermission('usuarios.gestionar'), usuarioController.toggleActivo);
router.post('/:id/reset-password', checkPermission('usuarios.gestionar'), usuarioController.resetPassword);

router.post('/bulk-assign-role', checkPermission('usuarios.gestionar'), usuarioController.bulkAssignRole);
router.post('/bulk-remove-role', checkPermission('usuarios.gestionar'), usuarioController.bulkRemoveRole);

module.exports = router;
