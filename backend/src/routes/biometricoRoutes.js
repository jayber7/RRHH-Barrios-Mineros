const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const BiometricoController = require('../controllers/biometricoController');
const { authMiddleware, checkPermission } = require('../middleware/authMiddleware');

router.use(authMiddleware);

const tmpDir = path.join('/tmp', 'biometrico_uploads');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, tmpDir),
    filename: (req, file, cb) => cb(null, `zktimeten_${Date.now()}.db`)
  }),
  limits: { fileSize: 300 * 1024 * 1024 }
});

router.get('/config', checkPermission('biometrico.ver'), BiometricoController.getConfig);
router.post('/config', checkPermission('biometrico.gestionar'), BiometricoController.updateConfig);
router.post('/sync-logs', checkPermission('biometrico.gestionar'), BiometricoController.syncLogs);
router.get('/users', checkPermission('biometrico.ver'), BiometricoController.getUsers);
router.get('/raw-logs', checkPermission('biometrico.ver'), BiometricoController.getRawLogs);

router.post('/importar-empleados', checkPermission('biometrico.gestionar'), BiometricoController.importarEmpleados);
router.post('/importar-marcaciones', checkPermission('biometrico.gestionar'), BiometricoController.importarMarcaciones);
router.post('/importar-zktimeten', checkPermission('biometrico.gestionar'), upload.single('archivo'), BiometricoController.importarZkTimeten);
router.get('/stats-importacion', checkPermission('biometrico.ver'), BiometricoController.getStatsImportacion);

router.get('/departamentos', checkPermission('biometrico.ver'), BiometricoController.getDepartamentos);

router.get('/sugerencias', checkPermission('biometrico.ver'), BiometricoController.getSugerencias);
router.get('/no-vinculados', checkPermission('biometrico.ver'), BiometricoController.getNoVinculados);
router.get('/vinculados', checkPermission('biometrico.ver'), BiometricoController.getVinculados);
router.post('/vincular', checkPermission('biometrico.gestionar'), BiometricoController.vincular);
router.post('/desvincular', checkPermission('biometrico.gestionar'), BiometricoController.desvincular);
router.post('/vincular-por-ci', checkPermission('biometrico.gestionar'), BiometricoController.vincularPorCI);
router.post('/vincular-multiples', checkPermission('biometrico.gestionar'), BiometricoController.vincularMultiples);
router.get('/personal-sin-biometrico', checkPermission('biometrico.ver'), BiometricoController.getPersonalSinBiometrico);
router.get('/resumen-mapeo', checkPermission('biometrico.ver'), BiometricoController.getResumenMapeo);

router.get('/asistencia-mensual', checkPermission('biometrico.ver'), BiometricoController.getAsistenciaMensual);
router.get('/asistencia-personas', checkPermission('biometrico.ver'), BiometricoController.getPersonasConAsistencia);
router.get('/marcaciones/:personalId', checkPermission('biometrico.ver'), BiometricoController.getMarcacionesPorDia);
router.get('/personas-por-rango', checkPermission('biometrico.ver'), BiometricoController.getPersonasPorRango);
router.get('/marcaciones-por-rango/:personalId', checkPermission('biometrico.ver'), BiometricoController.getMarcacionesPorRango);
router.get('/datos-impresion/:personalId', checkPermission('biometrico.ver'), BiometricoController.getDatosImpresion);

router.get('/turnos', checkPermission('biometrico.ver'), BiometricoController.getTurnos);
router.post('/turnos/asignar', checkPermission('biometrico.gestionar'), BiometricoController.asignarTurno);
router.post('/turnos/eliminar', checkPermission('biometrico.gestionar'), BiometricoController.eliminarTurno);
router.get('/turnos/verificar/:personalId', checkPermission('biometrico.ver'), BiometricoController.verificarAsistenciaTurno);
router.get('/turnos/personal-sin-turno', checkPermission('biometrico.ver'), BiometricoController.getPersonalSinTurno);
router.get('/turnos/personal-con-turno', checkPermission('biometrico.ver'), BiometricoController.getPersonalConTurno);

module.exports = router;
