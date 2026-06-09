const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
const { authMiddleware, checkPermission } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/cite', checkPermission('config.ver'), configController.getCiteConfig);
router.put('/cite', checkPermission('config.editar'), configController.updateCiteConfig);

router.get('/etiquetas', checkPermission('config.ver'), configController.getEtiquetas);
router.post('/etiquetas', checkPermission('config.editar'), configController.createEtiqueta);
router.delete('/etiquetas/:id', checkPermission('config.editar'), configController.deleteEtiqueta);

module.exports = router;
