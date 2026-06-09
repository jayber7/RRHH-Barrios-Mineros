const express = require('express');
const router = express.Router();
const multer = require('multer');
const AsistenciaController = require('../controllers/asistenciaController');
const { authMiddleware, checkPermission } = require('../middleware/authMiddleware');

router.use(authMiddleware);

const upload = multer({ storage: multer.memoryStorage() });

router.post('/import', checkPermission('asistencia.gestionar'), upload.single('archivo'), AsistenciaController.importAsistencia);
router.get('/', checkPermission('asistencia.ver'), AsistenciaController.getAsistencias);
router.get('/detalle/:id', checkPermission('asistencia.ver'), AsistenciaController.getDetalle);
router.put('/diario/:id/estado', checkPermission('asistencia.gestionar'), AsistenciaController.updateEstadoDiario);
router.post('/calcular', checkPermission('asistencia.gestionar'), AsistenciaController.calcularMes);
router.post('/calcular-todos', checkPermission('asistencia.gestionar'), AsistenciaController.calcularTodos);
router.get('/sancion', checkPermission('asistencia.ver'), AsistenciaController.getSancionPersonal);
router.delete('/:id', checkPermission('asistencia.gestionar'), AsistenciaController.deleteAsistencia);

module.exports = router;
