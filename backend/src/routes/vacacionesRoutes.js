const express = require('express');
const router = express.Router();
const VacacionesController = require('../controllers/vacacionesController');

router.get('/', VacacionesController.listar);
router.get('/resumen', VacacionesController.getResumen);
router.get('/saldo/:personal_id', VacacionesController.getSaldo);
router.get('/:id', VacacionesController.getById);
router.post('/', VacacionesController.crear);
router.put('/:id', VacacionesController.actualizar);
router.put('/:id/estado', VacacionesController.cambiarEstado);
router.delete('/:id', VacacionesController.eliminar);

module.exports = router;
