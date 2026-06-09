const express = require('express');
const router = express.Router();
const personalController = require('../controllers/personalController');
const { authMiddleware, checkPermission } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', checkPermission('personal.ver'), personalController.getAllPersonal);
router.post('/', checkPermission('personal.gestionar'), personalController.createPersonal);
router.put('/:id', checkPermission('personal.gestionar'), personalController.updatePersonal);
router.get('/:id/historial', checkPermission('personal.ver'), personalController.getHistorial);
router.get('/export', checkPermission('personal.ver'), personalController.exportPersonal);
router.post('/import', checkPermission('personal.gestionar'), personalController.upload.single('file'), personalController.importPersonal);
router.get('/catalogos', checkPermission('personal.ver'), personalController.getCatalogos);
router.get('/contratos-alertas', checkPermission('personal.ver'), personalController.getContratosPorVencer);
router.post('/auto-inactivar', checkPermission('personal.gestionar'), personalController.autoInactivarVencidos);

module.exports = router;
