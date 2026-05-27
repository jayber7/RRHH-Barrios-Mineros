const express = require('express');
const router = express.Router();
const multer = require('multer');
const AsistenciaController = require('../controllers/asistenciaController');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/import', upload.single('archivo'), AsistenciaController.importAsistencia);
router.get('/', AsistenciaController.getAsistencias);
router.get('/detalle/:id', AsistenciaController.getDetalle);
router.put('/diario/:id/estado', AsistenciaController.updateEstadoDiario);
router.post('/calcular', AsistenciaController.calcularMes);
router.post('/calcular-todos', AsistenciaController.calcularTodos);
router.get('/sancion', AsistenciaController.getSancionPersonal);
router.delete('/:id', AsistenciaController.deleteAsistencia);

module.exports = router;
