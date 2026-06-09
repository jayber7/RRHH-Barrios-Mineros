const express = require('express');
const router = express.Router();
const BiometricoController = require('../controllers/biometricoController');
const { authMiddleware, checkPermission } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/config', checkPermission('biometrico.ver'), BiometricoController.getConfig);
router.post('/config', checkPermission('biometrico.gestionar'), BiometricoController.updateConfig);
router.post('/sync-logs', checkPermission('biometrico.gestionar'), BiometricoController.syncLogs);
router.get('/users', checkPermission('biometrico.ver'), BiometricoController.getUsers);
router.get('/raw-logs', checkPermission('biometrico.ver'), BiometricoController.getRawLogs);
router.post('/import-logs', checkPermission('biometrico.gestionar'), BiometricoController.importLogs);
router.get('/validaciones', checkPermission('biometrico.ver'), BiometricoController.getValidaciones);
router.post('/recalcular', checkPermission('biometrico.gestionar'), BiometricoController.recalcularAsistencia);

module.exports = router;
