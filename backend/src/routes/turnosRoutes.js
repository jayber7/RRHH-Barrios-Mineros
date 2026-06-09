const express = require('express');
const router = express.Router();
const TurnosController = require('../controllers/turnosController');
const { authMiddleware, checkPermission } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/plantilla', checkPermission('turnos.ver'), TurnosController.getPlantillas);
router.get('/plantilla/:id', checkPermission('turnos.ver'), TurnosController.getPlantilla);
router.post('/plantilla', checkPermission('turnos.gestionar'), TurnosController.createPlantilla);
router.put('/plantilla/:id', checkPermission('turnos.gestionar'), TurnosController.updatePlantilla);
router.delete('/plantilla/:id', checkPermission('turnos.gestionar'), TurnosController.deletePlantilla);

router.get('/asignados', checkPermission('turnos.ver'), TurnosController.getAsignados);
router.get('/asignados/:id', checkPermission('turnos.ver'), TurnosController.getAsignado);
router.post('/asignados', checkPermission('turnos.gestionar'), TurnosController.createAsignado);
router.put('/asignados/:id', checkPermission('turnos.gestionar'), TurnosController.updateAsignado);
router.delete('/asignados/:id', checkPermission('turnos.gestionar'), TurnosController.deleteAsignado);
router.delete('/asignados', checkPermission('turnos.gestionar'), TurnosController.deleteAsignadosByPersonal);

router.get('/empleado/:personalId', checkPermission('turnos.ver'), TurnosController.getTurnoEmpleado);
router.get('/calendario', checkPermission('turnos.ver'), TurnosController.getCalendario);
router.get('/calendario/dia', checkPermission('turnos.ver'), TurnosController.getCalendarioDia);
router.get('/personal-sin-turno', checkPermission('turnos.ver'), TurnosController.getPersonalSinTurno);
router.get('/years', checkPermission('turnos.ver'), TurnosController.getYears);
router.post('/clonar', checkPermission('turnos.gestionar'), TurnosController.cloneAsignaciones);

module.exports = router;
