const db = require('../config/db');
const ConfiguracionService = require('../services/configuracionService');

const checkJefeServicio = async (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  const adminRole = await ConfiguracionService.get('seguridad_rol_admin', 'ADMIN');
  if (req.usuario.roles.includes(adminRole)) {
    return next();
  }

  if (!req.usuario.permisos.includes('turnos-grid.gestionar')) {
    return res.status(403).json({ error: 'Permiso turnos-grid.gestionar requerido' });
  }

  const servicioId = req.body.servicio_id || req.query.servicio_id || req.params.servicioId;
  if (!servicioId) {
    return res.status(400).json({ error: 'servicio_id requerido para validar jefatura' });
  }

  const { rows } = await db.query(`
    SELECT 1 FROM vinculos_laborales vl
    JOIN personal p ON vl.personal_id = p.id
    JOIN usuarios u ON u.personal_id = p.id
    JOIN turnos_grid_servicios gs ON gs.unidad_servicio = vl.unidad_servicio
    WHERE u.id = $1 
      AND gs.id = $2
      AND (vl.cargo_actual ILIKE '%jefe%' OR vl.cargo_actual ILIKE '%director%' OR vl.cargo_actual ILIKE '%responsable%' OR vl.es_jefe = true)
      AND vl.fecha_fin IS NULL
  `, [req.usuario.id, servicioId]);

  if (rows.length === 0) {
    return res.status(403).json({ 
      error: 'Solo el Jefe de Servicio puede modificar turnos de esta unidad',
      codigo: 'NO_ES_JEFE_SERVICIO'
    });
  }

  req.servicioValidado = parseInt(servicioId);
  next();
};

const checkLecturaGrid = async (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  const adminRole = await ConfiguracionService.get('seguridad_rol_admin', 'ADMIN');
  if (req.usuario.roles.includes(adminRole)) {
    return next();
  }

  if (req.usuario.permisos.includes('turnos-grid.ver')) {
    return next();
  }

  const servicioId = req.query.servicio_id || req.params.servicioId;
  if (servicioId) {
    const { rows } = await db.query(`
      SELECT 1 FROM vinculos_laborales vl
      JOIN personal p ON vl.personal_id = p.id
      JOIN usuarios u ON u.personal_id = p.id
      JOIN turnos_grid_servicios gs ON gs.unidad_servicio = vl.unidad_servicio
      WHERE u.id = $1 AND gs.id = $2 AND vl.fecha_fin IS NULL
    `, [req.usuario.id, servicioId]);
    if (rows.length > 0) return next();
  }

  return res.status(403).json({ error: 'Sin permisos para ver este horario' });
};

module.exports = { checkJefeServicio, checkLecturaGrid };