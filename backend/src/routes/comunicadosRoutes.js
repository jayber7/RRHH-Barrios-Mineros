const express = require('express');
const router = express.Router();
const ComunicadosController = require('../controllers/comunicadosController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/destinatarios', ComunicadosController.getDestinatarios);
router.get('/', ComunicadosController.getAll);
router.get('/:id', ComunicadosController.getById);
router.get('/:id/pdf', ComunicadosController.generarPDF);
router.post('/', checkRole('ADMIN', 'SECRETARIO', 'JEFE_RRHH'), ComunicadosController.create);
router.put('/:id/leer', ComunicadosController.marcarLeido);

module.exports = router;
