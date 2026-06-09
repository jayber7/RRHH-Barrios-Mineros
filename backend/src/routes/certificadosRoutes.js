const express = require('express');
const router = express.Router();
const CertificadosController = require('../controllers/certificadosController');
const { authMiddleware, checkPermission } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', checkPermission('certificados.ver'), CertificadosController.listar);
router.get('/resumen', checkPermission('certificados.ver'), CertificadosController.getResumen);
router.get('/:id', checkPermission('certificados.ver'), CertificadosController.getById);
router.get('/:id/pdf', checkPermission('certificados.ver'), CertificadosController.getPDF);
router.post('/generar', checkPermission('certificados.gestionar'), CertificadosController.generar);
router.put('/:id/estado', checkPermission('certificados.gestionar'), CertificadosController.cambiarEstado);

module.exports = router;
