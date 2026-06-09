const express = require('express');
const router = express.Router();
const ComunicadosController = require('../controllers/comunicadosController');
const { authMiddleware, checkPermission } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/destinatarios', checkPermission('comunicados.ver'), ComunicadosController.getDestinatarios);
router.get('/', checkPermission('comunicados.ver'), ComunicadosController.getAll);
router.get('/:id', checkPermission('comunicados.ver'), ComunicadosController.getById);
router.get('/:id/pdf', checkPermission('comunicados.ver'), ComunicadosController.generarPDF);
router.post('/', checkPermission('comunicados.gestionar'), ComunicadosController.create);
router.put('/:id/leer', checkPermission('comunicados.ver'), ComunicadosController.marcarLeido);

module.exports = router;
