-- Migracion completa: ENTREGADO CARPETAS + ASIS-only + CI mismatches
-- Generado automaticamente

BEGIN;

-- Fase 1: Agregar columna tipo_personal
ALTER TABLE personal ADD COLUMN IF NOT EXISTS tipo_personal VARCHAR(20) DEFAULT 'PLANTA';

-- Fase 2: Insertar 17 consultores faltantes de ENTREGADO CARPETAS
INSERT INTO personal (ci, complemento, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, fecha_nacimiento, tipo_personal)
VALUES ('7368223', '', 2, 'AJHUACHO', 'AJHUACHO', NULL, 'MIRIAM', 'ESTHER', '1996-11-13', 'CONSULTOR');
INSERT INTO personal (ci, complemento, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, fecha_nacimiento, tipo_personal)
VALUES ('5737070', '', 2, 'VARGAS', 'CANAZA', NULL, 'LIZBETH', NULL, '1987-02-20', 'CONSULTOR');
INSERT INTO personal (ci, complemento, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, fecha_nacimiento, tipo_personal)
VALUES ('7354166', '', 2, 'ZARATE', 'VEIZAN', NULL, 'ANA', NULL, '1994-02-28', 'CONSULTOR');
INSERT INTO personal (ci, complemento, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, fecha_nacimiento, tipo_personal)
VALUES ('7279022', '', 2, 'BERNABE', 'CANAVIRI', NULL, 'MARISOL', NULL, '1988-04-05', 'CONSULTOR');
INSERT INTO personal (ci, complemento, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, fecha_nacimiento, tipo_personal)
VALUES ('3547101', '', 2, 'FRANCO', 'ZAMBRANA', NULL, 'ANA', 'MARIA', '1977-08-14', 'CONSULTOR');
INSERT INTO personal (ci, complemento, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, fecha_nacimiento, tipo_personal)
VALUES ('7273262', '', 2, 'ZUBIETA', 'HUAYLLA', NULL, 'ALEJANDRA', NULL, '2003-04-17', 'CONSULTOR');
INSERT INTO personal (ci, complemento, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, fecha_nacimiento, tipo_personal)
VALUES ('7325953', '', 2, 'CHOQUE', 'YAVI', NULL, 'LISBETH', 'SELENA', '1996-08-01', 'CONSULTOR');
INSERT INTO personal (ci, complemento, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, fecha_nacimiento, tipo_personal)
VALUES ('7276169', '', 2, 'LOPEZ', 'LOPEZ', NULL, 'BELIZAIDA', NULL, '1989-08-05', 'CONSULTOR');
INSERT INTO personal (ci, complemento, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, fecha_nacimiento, tipo_personal)
VALUES ('12614630', '', 8, 'CHOQUE', 'MARCANI', NULL, 'JHAMIRA', NULL, '1997-11-08', 'CONSULTOR');
INSERT INTO personal (ci, complemento, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, fecha_nacimiento, tipo_personal)
VALUES ('7277586', '', 2, 'COLQUE', 'COPA', NULL, 'LUCY', NULL, '1989-12-16', 'CONSULTOR');
INSERT INTO personal (ci, complemento, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, fecha_nacimiento, tipo_personal)
VALUES ('7275303', '', 2, 'COLQUE', 'CHINCHE', NULL, 'MARIBEL', 'FRANCISCA', '1990-05-21', 'CONSULTOR');
INSERT INTO personal (ci, complemento, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, fecha_nacimiento, tipo_personal)
VALUES ('5741646', '', 2, 'RIOS', 'ALBORTA', NULL, 'CRISTIAN', 'GABRIEL', '1987-07-27', 'CONSULTOR');
INSERT INTO personal (ci, complemento, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, fecha_nacimiento, tipo_personal)
VALUES ('7309896', '', 2, 'MENDOZA', 'CHAMBI', NULL, 'KARINA', NULL, '1996-09-22', 'CONSULTOR');
INSERT INTO personal (ci, complemento, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, fecha_nacimiento, tipo_personal)
VALUES ('7316498', '', 2, 'VILLEGAS', 'FERNANDEZ', NULL, 'TANIA', 'JIMENA', '1995-02-14', 'CONSULTOR');
INSERT INTO personal (ci, complemento, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, fecha_nacimiento, tipo_personal)
VALUES ('12773018', '', 2, 'ROMERO', 'DIEGO', NULL, 'CARMEN', 'ROSA', '1998-07-10', 'CONSULTOR');
INSERT INTO personal (ci, complemento, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, fecha_nacimiento, tipo_personal)
VALUES ('4050944', '', 2, 'CAYOJA', 'VIRACOCHEA', NULL, 'ROSARIO', NULL, '1978-04-24', 'CONSULTOR');
INSERT INTO personal (ci, complemento, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, fecha_nacimiento, tipo_personal)
VALUES ('5723364', '', 2, 'VIDAL', 'SARAVIA', NULL, 'GUADALUPE', NULL, '1984-04-28', 'CONSULTOR');

-- Fase 3: Insertar 7 empleados ASIS-only (planta)
INSERT INTO personal (ci, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, tipo_personal)
VALUES ('2786060', 2, 'NUNEZ', 'ALCONCE', NULL, 'LUIS', 'ALBERTO', 'PLANTA');
INSERT INTO personal (ci, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, tipo_personal)
VALUES ('3115693', 2, 'BERRIOS', 'RAMOS', NULL, 'LIDIA', NULL, 'PLANTA');
INSERT INTO personal (ci, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, tipo_personal)
VALUES ('3119968', 2, 'VASQUEZ', 'CALDERON', NULL, 'MARITZA', 'PAULA', 'PLANTA');
INSERT INTO personal (ci, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, tipo_personal)
VALUES ('3532960', 2, 'CHACON', 'APAZA', NULL, 'JUAN', 'CARLOS', 'PLANTA');
INSERT INTO personal (ci, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, tipo_personal)
VALUES ('5720293', 2, 'CHOQUE', 'LAPACA', NULL, 'JANNETH', NULL, 'PLANTA');
INSERT INTO personal (ci, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, tipo_personal)
VALUES ('7330613', 2, 'ESCARZO', 'MAMANI', NULL, 'KATTY', 'JOAQUINA', 'PLANTA');
INSERT INTO personal (ci, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, tipo_personal)
VALUES ('5735729', 2, 'CHOQUE', 'JACINTO', NULL, 'RUTH', 'ROXANA', 'PLANTA');

-- Fase 4: Corregir 4 CI mismatches (ASIS CI correcto vs DB CI con errores)
UPDATE personal SET ci = '352786' WHERE ci = '3524786';
UPDATE personal SET ci = '3111381' WHERE ci = '3111381/1P';
UPDATE personal SET ci = '3713178' WHERE ci = '3713175';
UPDATE personal SET ci = '354500' WHERE ci = '3504500';

COMMIT;
