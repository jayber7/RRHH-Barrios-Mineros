-- Migración: Nuevo rol GENERAL + permisos ampliados

-- 1. Nuevo rol
INSERT INTO roles (nombre, descripcion) VALUES
  ('GENERAL', 'Rol base por defecto para todo el personal enrolado')
ON CONFLICT (nombre) DO NOTHING;

-- 2. Nuevos permisos
INSERT INTO permisos (codigo, descripcion, modulo)
SELECT * FROM (VALUES
  ('personal.ver', 'Ver listado de personal', 'personal'),
  ('personal.gestionar', 'Crear, editar y eliminar personal', 'personal'),
  ('asistencia.ver', 'Ver registro de asistencias', 'asistencia'),
  ('asistencia.gestionar', 'Gestionar asistencias y estados', 'asistencia'),
  ('biometrico.ver', 'Ver configuración y logs biométricos', 'biometrico'),
  ('biometrico.gestionar', 'Sincronizar y gestionar biométrico', 'biometrico'),
  ('dashboard.ver', 'Ver dashboard de indicadores', 'dashboard'),
  ('turnos.ver', 'Ver plantillas y asignaciones de turnos', 'turnos'),
  ('turnos.gestionar', 'Crear, editar y eliminar turnos', 'turnos'),
  ('reportes.ver', 'Ver y generar reportes', 'reportes'),
  ('vacaciones.ver', 'Ver solicitudes de vacaciones', 'vacaciones'),
  ('vacaciones.gestionar', 'Gestionar vacaciones', 'vacaciones'),
  ('permisos.ver', 'Ver permisos laborales', 'permisos'),
  ('permisos.gestionar', 'Gestionar permisos laborales', 'permisos'),
  ('certificados.ver', 'Ver certificados', 'certificados'),
  ('certificados.gestionar', 'Generar y gestionar certificados', 'certificados'),
  ('comunicados.ver', 'Ver comunicados', 'comunicados'),
  ('comunicados.gestionar', 'Crear y gestionar comunicados', 'comunicados'),
  ('notificaciones.ver', 'Ver notificaciones', 'notificaciones'),
  ('sanciones.ver', 'Ver configuración de sanciones', 'sanciones'),
  ('sanciones.gestionar', 'Gestionar sanciones', 'sanciones'),
  ('justificaciones.ver', 'Ver justificaciones', 'justificaciones'),
  ('justificaciones.gestionar', 'Gestionar justificaciones', 'justificaciones'),
  ('roles.ver', 'Ver roles del sistema', 'roles'),
  ('roles.gestionar', 'Gestionar roles y permisos', 'roles')
) AS newp(codigo, descripcion, modulo)
WHERE NOT EXISTS (SELECT 1 FROM permisos p WHERE p.codigo = newp.codigo);

-- 3. Asignar permisos a roles (AUXILIAR)
INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT r.id, p.id FROM roles r, permisos p
WHERE r.nombre = 'AUXILIAR'
  AND p.codigo IN ('personal.ver','asistencia.ver','dashboard.ver','turnos.ver',
                   'reportes.ver','notificaciones.ver')
ON CONFLICT DO NOTHING;

-- SECRETARIO
INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT r.id, p.id FROM roles r, permisos p
WHERE r.nombre = 'SECRETARIO'
  AND p.codigo IN ('correspondencia.ver','correspondencia.crear','correspondencia.editar',
                   'correspondencia.derivar','correspondencia.responder','correspondencia.eliminar',
                   'comunicados.ver','comunicados.gestionar',
                   'dashboard.ver','notificaciones.ver')
ON CONFLICT DO NOTHING;

-- DIRECTOR
INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT r.id, p.id FROM roles r, permisos p
WHERE r.nombre = 'DIRECTOR'
  AND p.codigo IN ('dashboard.ver','reportes.ver',
                   'correspondencia.ver','correspondencia.derivar','correspondencia.responder',
                   'notificaciones.ver')
ON CONFLICT DO NOTHING;

-- JEFE_RRHH
INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT r.id, p.id FROM roles r, permisos p
WHERE r.nombre = 'JEFE_RRHH'
  AND p.codigo IN ('personal.ver','personal.gestionar',
                   'asistencia.ver','asistencia.gestionar',
                   'biometrico.ver','biometrico.gestionar',
                   'dashboard.ver',
                   'turnos.ver','turnos.gestionar',
                   'reportes.ver',
                   'vacaciones.ver','vacaciones.gestionar',
                   'permisos.ver','permisos.gestionar',
                   'certificados.ver','certificados.gestionar',
                   'justificaciones.ver','justificaciones.gestionar',
                   'sanciones.ver','sanciones.gestionar',
                   'comunicados.ver','comunicados.gestionar',
                   'usuarios.ver',
                   'notificaciones.ver')
ON CONFLICT DO NOTHING;

-- ADMIN: todos los permisos
INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT r.id, p.id FROM roles r, permisos p
WHERE r.nombre = 'ADMIN'
ON CONFLICT DO NOTHING;
