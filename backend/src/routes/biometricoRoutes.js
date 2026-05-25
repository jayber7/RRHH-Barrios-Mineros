const express = require('express');
const router = express.Router();
const BiometricoController = require('../controllers/biometricoController');

router.get('/config', BiometricoController.getConfig);
router.post('/config', BiometricoController.updateConfig);
router.post('/sync-logs', BiometricoController.syncLogs);
router.get('/users', BiometricoController.getUsers);
router.get('/raw-logs', BiometricoController.getRawLogs);

module.exports = router;
