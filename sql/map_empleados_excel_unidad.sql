-- ================================================================
-- Asignar unidad_servicio a empleados segun archivos Excel turnos
-- Generado a partir de excel_vs_db_cruce.csv
-- ================================================================
BEGIN;

-- 0. Agregar unidades faltantes al catálogo
INSERT INTO cat_unidades_servicios (nombre_unidad) VALUES ('Ecografía') ON CONFLICT (nombre_unidad) DO NOTHING;
INSERT INTO cat_unidades_servicios (nombre_unidad) VALUES ('Odontología') ON CONFLICT (nombre_unidad) DO NOTHING;

-- Actualizar vinculos_laborales existentes (sin unidad asignada previamente)

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Laboratorio')
  WHERE personal_id = 1004 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1004 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Laboratorio')
  WHERE personal_id = 1005 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1005 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Laboratorio')
  WHERE personal_id = 1008 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1008 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Ginecología')
  WHERE personal_id = 1011 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1011 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Cirugía')
  WHERE personal_id = 1023 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1023 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Cirugía')
  WHERE personal_id = 1025 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1025 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Odontología')
  WHERE personal_id = 1028 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1028 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Ginecología')
  WHERE personal_id = 1031 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1031 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Rayos X')
  WHERE personal_id = 1032 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1032 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Laboratorio')
  WHERE personal_id = 1034 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1034 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Ginecología')
  WHERE personal_id = 1036 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1036 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Odontología')
  WHERE personal_id = 1038 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1038 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Urgencias')
  WHERE personal_id = 1039 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1039 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Anestesiología')
  WHERE personal_id = 1041 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1041 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Ginecología')
  WHERE personal_id = 1044 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1044 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Odontología')
  WHERE personal_id = 1052 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1052 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Odontología')
  WHERE personal_id = 1053 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1053 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Anestesiología')
  WHERE personal_id = 1055 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1055 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Farmacia')
  WHERE personal_id = 1056 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1056 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Farmacia')
  WHERE personal_id = 1059 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1059 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Rayos X')
  WHERE personal_id = 1060 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1060 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Pediatría')
  WHERE personal_id = 1063 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1063 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Medicina Interna')
  WHERE personal_id = 1068 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1068 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Laboratorio')
  WHERE personal_id = 1070 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1070 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Ginecología')
  WHERE personal_id = 1071 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1071 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Medicina Interna')
  WHERE personal_id = 1074 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1074 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Urgencias')
  WHERE personal_id = 1075 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1075 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Medicina Interna')
  WHERE personal_id = 1077 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1077 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Fisioterapia')
  WHERE personal_id = 1082 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1082 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Cirugía')
  WHERE personal_id = 1084 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1084 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Odontología')
  WHERE personal_id = 1095 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1095 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Traumatología')
  WHERE personal_id = 1100 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1100 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Cirugía')
  WHERE personal_id = 1101 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1101 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Cirugía')
  WHERE personal_id = 1102 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1102 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Administración')
  WHERE personal_id = 1104 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1104 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Urgencias')
  WHERE personal_id = 1109 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1109 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Odontología')
  WHERE personal_id = 1111 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1111 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Cirugía')
  WHERE personal_id = 1112 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1112 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Ginecología')
  WHERE personal_id = 1113 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1113 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Cirugía')
  WHERE personal_id = 1121 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1121 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Ginecología')
  WHERE personal_id = 1122 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1122 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Cirugía')
  WHERE personal_id = 1124 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1124 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Urgencias')
  WHERE personal_id = 1127 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1127 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Cardiología')
  WHERE personal_id = 1132 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1132 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Anestesiología')
  WHERE personal_id = 1135 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1135 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Urgencias')
  WHERE personal_id = 1137 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1137 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Ginecología')
  WHERE personal_id = 1141 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1141 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Medicina Interna')
  WHERE personal_id = 1142 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1142 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Cirugía')
  WHERE personal_id = 1154 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1154 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Pediatría')
  WHERE personal_id = 1155 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1155 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Pediatría')
  WHERE personal_id = 1159 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1159 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Ecografía')
  WHERE personal_id = 1160 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1160 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Anestesiología')
  WHERE personal_id = 1161 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1161 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Urgencias')
  WHERE personal_id = 1163 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1163 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Fisioterapia')
  WHERE personal_id = 1172 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1172 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Anestesiología')
  WHERE personal_id = 1174 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1174 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Cirugía')
  WHERE personal_id = 1180 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1180 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Pediatría')
  WHERE personal_id = 1194 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1194 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

UPDATE vinculos_laborales SET unidad_servicio_id = (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Medicina Interna')
  WHERE personal_id = 1264 AND unidad_servicio_id IS NULL
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1264 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

-- Crear vinculos_laborales para empleados que aun no tienen

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1004, 'Laboratorio', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Laboratorio')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1004)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1004 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1005, 'Laboratorio', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Laboratorio')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1005)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1005 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1008, 'Laboratorio', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Laboratorio')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1008)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1008 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1011, 'Ginecología', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Ginecología')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1011)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1011 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1023, 'Cirugía', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Cirugía')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1023)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1023 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1025, 'Cirugía', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Cirugía')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1025)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1025 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1028, 'Odontología', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Odontología')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1028)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1028 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1031, 'Ginecología', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Ginecología')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1031)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1031 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1032, 'Rayos X', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Rayos X')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1032)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1032 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1034, 'Laboratorio', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Laboratorio')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1034)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1034 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1036, 'Ginecología', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Ginecología')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1036)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1036 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1038, 'Odontología', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Odontología')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1038)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1038 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1039, 'Urgencias', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Urgencias')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1039)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1039 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1041, 'Anestesiología', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Anestesiología')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1041)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1041 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1044, 'Ginecología', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Ginecología')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1044)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1044 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1052, 'Odontología', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Odontología')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1052)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1052 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1053, 'Odontología', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Odontología')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1053)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1053 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1055, 'Anestesiología', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Anestesiología')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1055)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1055 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1056, 'Farmacia', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Farmacia')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1056)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1056 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1059, 'Farmacia', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Farmacia')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1059)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1059 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1060, 'Rayos X', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Rayos X')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1060)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1060 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1063, 'Pediatría', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Pediatría')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1063)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1063 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1068, 'Medicina Interna', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Medicina Interna')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1068)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1068 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1070, 'Laboratorio', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Laboratorio')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1070)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1070 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1071, 'Ginecología', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Ginecología')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1071)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1071 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1074, 'Medicina Interna', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Medicina Interna')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1074)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1074 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1075, 'Urgencias', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Urgencias')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1075)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1075 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1077, 'Medicina Interna', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Medicina Interna')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1077)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1077 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1082, 'Fisioterapia', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Fisioterapia')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1082)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1082 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1084, 'Cirugía', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Cirugía')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1084)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1084 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1095, 'Odontología', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Odontología')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1095)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1095 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1100, 'Traumatología', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Traumatología')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1100)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1100 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1101, 'Cirugía', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Cirugía')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1101)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1101 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1102, 'Cirugía', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Cirugía')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1102)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1102 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1104, 'Administración', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Administración')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1104)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1104 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1109, 'Urgencias', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Urgencias')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1109)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1109 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1111, 'Odontología', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Odontología')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1111)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1111 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1112, 'Cirugía', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Cirugía')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1112)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1112 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1113, 'Ginecología', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Ginecología')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1113)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1113 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1121, 'Cirugía', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Cirugía')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1121)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1121 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1122, 'Ginecología', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Ginecología')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1122)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1122 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1124, 'Cirugía', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Cirugía')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1124)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1124 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1127, 'Urgencias', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Urgencias')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1127)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1127 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1132, 'Cardiología', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Cardiología')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1132)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1132 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1135, 'Anestesiología', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Anestesiología')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1135)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1135 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1137, 'Urgencias', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Urgencias')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1137)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1137 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1141, 'Ginecología', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Ginecología')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1141)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1141 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1142, 'Medicina Interna', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Medicina Interna')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1142)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1142 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1154, 'Cirugía', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Cirugía')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1154)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1154 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1155, 'Pediatría', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Pediatría')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1155)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1155 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1159, 'Pediatría', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Pediatría')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1159)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1159 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1160, 'Ecografía', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Ecografía')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1160)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1160 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1161, 'Anestesiología', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Anestesiología')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1161)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1161 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1163, 'Urgencias', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Urgencias')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1163)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1163 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1172, 'Fisioterapia', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Fisioterapia')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1172)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1172 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1174, 'Anestesiología', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Anestesiología')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1174)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1174 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1180, 'Cirugía', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Cirugía')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1180)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1180 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1194, 'Pediatría', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Pediatría')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1194)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1194 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

INSERT INTO vinculos_laborales (personal_id, unidad_servicio, unidad_servicio_id)
  SELECT 1264, 'Medicina Interna', (SELECT id FROM cat_unidades_servicios WHERE nombre_unidad = 'Medicina Interna')
  WHERE NOT EXISTS (SELECT 1 FROM vinculos_laborales vl WHERE vl.personal_id = 1264)
  AND EXISTS (SELECT 1 FROM turnos_asignados ta WHERE ta.personal_id = 1264 AND ta.fecha_inicio >= '2026-04-01' AND ta.fecha_inicio < '2026-05-01');

-- ================================================================
-- 4. Estandarizar texto unidad_servicio con nombres canónicos
-- ================================================================
UPDATE vinculos_laborales vl 
SET unidad_servicio = cus.nombre_unidad
FROM cat_unidades_servicios cus
WHERE vl.unidad_servicio_id = cus.id
AND (vl.unidad_servicio IS NULL OR vl.unidad_servicio = '' OR vl.unidad_servicio = 'SIN ASIGNAR');

UPDATE vinculos_laborales vl 
SET unidad_servicio = cus.nombre_unidad
FROM cat_unidades_servicios cus
WHERE vl.unidad_servicio_id = cus.id
AND vl.unidad_servicio IS DISTINCT FROM cus.nombre_unidad;

COMMIT;
