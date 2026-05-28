const express = require('express');
const router = express.Router();
const ConfiguracionController = require('../controllers/configuracionController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', ConfiguracionController.getAll);
router.put('/', checkRole(['ADMIN']), ConfiguracionController.update);
router.get('/tipos-permiso', ConfiguracionController.getTiposPermiso);
router.post('/tipos-permiso', checkRole(['ADMIN']), ConfiguracionController.createTipoPermiso);
router.put('/tipos-permiso/:id', checkRole(['ADMIN']), ConfiguracionController.updateTipoPermiso);
router.delete('/tipos-permiso/:id', checkRole(['ADMIN']), ConfiguracionController.deleteTipoPermiso);

module.exports = router;
