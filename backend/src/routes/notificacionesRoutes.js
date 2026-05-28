const express = require('express');
const router = express.Router();
const NotificacionesController = require('../controllers/notificacionesController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', NotificacionesController.listar);
router.get('/no-leidas', NotificacionesController.contarNoLeidas);
router.get('/resumen', NotificacionesController.getResumen);
router.post('/', NotificacionesController.crear);
router.put('/leer-todas', NotificacionesController.marcarTodasLeidas);
router.put('/:id/leer', NotificacionesController.marcarLeida);
router.delete('/:id', NotificacionesController.eliminar);

module.exports = router;
