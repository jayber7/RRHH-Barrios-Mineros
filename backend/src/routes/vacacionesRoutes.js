const express = require('express');
const router = express.Router();
const VacacionesController = require('../controllers/vacacionesController');
const { authMiddleware, checkPermission } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', checkPermission('vacaciones.ver'), VacacionesController.listar);
router.get('/resumen', checkPermission('vacaciones.ver'), VacacionesController.getResumen);
router.get('/saldo/:personal_id', checkPermission('vacaciones.ver'), VacacionesController.getSaldo);
router.get('/:id', checkPermission('vacaciones.ver'), VacacionesController.getById);
router.post('/', checkPermission('vacaciones.gestionar'), VacacionesController.crear);
router.put('/:id', checkPermission('vacaciones.gestionar'), VacacionesController.actualizar);
router.put('/:id/estado', checkPermission('vacaciones.gestionar'), VacacionesController.cambiarEstado);
router.delete('/:id', checkPermission('vacaciones.gestionar'), VacacionesController.eliminar);

module.exports = router;
