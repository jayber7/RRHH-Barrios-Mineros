const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/roleController');
const { authMiddleware, checkPermission } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', checkPermission('roles.ver'), RoleController.getAll);
router.get('/permisos', checkPermission('roles.ver'), RoleController.getAllPermisos);
router.post('/', checkPermission('roles.gestionar'), RoleController.create);
router.get('/:id', checkPermission('roles.ver'), RoleController.getById);
router.put('/:id', checkPermission('roles.gestionar'), RoleController.update);
router.delete('/:id', checkPermission('roles.gestionar'), RoleController.delete);
router.get('/:id/permisos', checkPermission('roles.ver'), RoleController.getPermisos);
router.put('/:id/permisos', checkPermission('roles.gestionar'), RoleController.updatePermisos);

module.exports = router;
