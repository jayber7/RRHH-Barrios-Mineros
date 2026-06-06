const express = require('express');
const router = express.Router();
const TurnosController = require('../controllers/turnosController');

router.get('/plantilla', TurnosController.getPlantillas);
router.get('/plantilla/:id', TurnosController.getPlantilla);
router.post('/plantilla', TurnosController.createPlantilla);
router.put('/plantilla/:id', TurnosController.updatePlantilla);
router.delete('/plantilla/:id', TurnosController.deletePlantilla);

router.get('/asignados', TurnosController.getAsignados);
router.get('/asignados/:id', TurnosController.getAsignado);
router.post('/asignados', TurnosController.createAsignado);
router.put('/asignados/:id', TurnosController.updateAsignado);
router.delete('/asignados/:id', TurnosController.deleteAsignado);
router.delete('/asignados', TurnosController.deleteAsignadosByPersonal);

router.get('/empleado/:personalId', TurnosController.getTurnoEmpleado);
router.get('/calendario', TurnosController.getCalendario);
router.get('/calendario/dia', TurnosController.getCalendarioDia);
router.get('/personal-sin-turno', TurnosController.getPersonalSinTurno);
router.get('/years', TurnosController.getYears);
router.post('/clonar', TurnosController.cloneAsignaciones);

module.exports = router;
