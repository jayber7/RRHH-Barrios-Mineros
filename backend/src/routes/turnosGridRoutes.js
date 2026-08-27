const express = require('express');
const router = express.Router();
const TurnosGridController = require('../controllers/turnosGridController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { checkJefeServicio, checkLecturaGrid } = require('../middleware/turnosGridAuth');

router.use(authMiddleware);

// ==================== SERVICIOS ====================
router.get('/servicios', checkPermission('turnos-grid.ver'), TurnosGridController.getServicios);
router.get('/servicios/:id', checkPermission('turnos-grid.ver'), TurnosGridController.getServicio);
router.post('/servicios', checkPermission('turnos-grid.gestionar'), TurnosGridController.createServicio);
router.put('/servicios/:id', checkPermission('turnos-grid.gestionar'), TurnosGridController.updateServicio);

// ==================== GRILLA MENSUAL ====================
router.post('/servicios/:servicioId/generar-grilla', checkJefeServicio, TurnosGridController.generarGrilla);
router.get('/servicios/:servicioId/grilla', checkLecturaGrid, TurnosGridController.getGrilla);

// ==================== PERSONAL DISPONIBLE ====================
router.get('/servicios/:servicioId/personal-disponible', checkLecturaGrid, TurnosGridController.getPersonalDisponible);

// ==================== ASIGNACIONES ====================
router.post('/asignaciones', checkJefeServicio, TurnosGridController.createAsignacion);
router.put('/asignaciones/:id', checkJefeServicio, TurnosGridController.updateAsignacion);
router.delete('/asignaciones/:id', checkJefeServicio, TurnosGridController.deleteAsignacion);
router.post('/servicios/:servicioId/asignaciones/batch', checkJefeServicio, TurnosGridController.batchSave);

// ==================== CARGA HORARIA ====================
router.get('/servicios/:servicioId/carga-horaria', checkLecturaGrid, TurnosGridController.getCargaHoraria);

// ==================== CUOTAS ====================
router.post('/cuotas/recalcular', checkJefeServicio, TurnosGridController.recalcularCuotas);
router.post('/cuotas/manual', checkJefeServicio, TurnosGridController.setCuotaManual);
router.get('/servicios/:servicioId/cuotas', checkLecturaGrid, TurnosGridController.getCuotasServicio);

// ==================== AUDITORÍA ====================
router.get('/servicios/:servicioId/auditoria', checkLecturaGrid, TurnosGridController.getAuditoria);
router.get('/personal/:personalId/auditoria', checkLecturaGrid, TurnosGridController.getAuditoriaPersonal);

// ==================== VALIDACIONES ====================
router.get('/validar-solapamiento', checkLecturaGrid, TurnosGridController.validarSolapamiento);
router.get('/cupo/:grid_mensual_id', checkLecturaGrid, TurnosGridController.getCupoDisponible);

// Helper para checkPermission inline
function checkPermission(codigo) {
  return async (req, res, next) => {
    if (!req.usuario) return res.status(401).json({ error: 'No autenticado' });
    const ConfiguracionService = require('../services/configuracionService');
    const adminRole = await ConfiguracionService.get('seguridad_rol_admin', 'ADMIN');
    if (req.usuario.roles.includes(adminRole)) return next();
    if (!req.usuario.permisos.includes(codigo)) {
      return res.status(403).json({ error: 'No tienes permisos para esta acción' });
    }
    next();
  };
}

module.exports = router;