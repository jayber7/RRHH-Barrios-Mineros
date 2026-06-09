const express = require('express');
const router = express.Router();
const ConfiguracionController = require('../controllers/configuracionController');
const { authMiddleware, checkPermission } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', ConfiguracionController.getAll);
router.put('/', checkPermission('config.editar'), ConfiguracionController.update);
router.get('/tipos-permiso', checkPermission('config.ver'), ConfiguracionController.getTiposPermiso);
router.post('/tipos-permiso', checkPermission('config.editar'), ConfiguracionController.createTipoPermiso);
router.put('/tipos-permiso/:id', checkPermission('config.editar'), ConfiguracionController.updateTipoPermiso);
router.delete('/tipos-permiso/:id', checkPermission('config.editar'), ConfiguracionController.deleteTipoPermiso);

module.exports = router;
