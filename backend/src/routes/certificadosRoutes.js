const express = require('express');
const router = express.Router();
const CertificadosController = require('../controllers/certificadosController');

router.get('/', CertificadosController.listar);
router.get('/resumen', CertificadosController.getResumen);
router.get('/:id', CertificadosController.getById);
router.get('/:id/pdf', CertificadosController.getPDF);
router.post('/generar', CertificadosController.generar);
router.put('/:id/estado', CertificadosController.cambiarEstado);

module.exports = router;
