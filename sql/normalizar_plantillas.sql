-- ============================================================
-- Normalización de Plantillas de Turno
-- ============================================================
-- 1. Merge true duplicates (reassign asignaciones)
-- 2. Rename codes to HH:MM-HH:MM format
-- 3. Deactivate plantillas with 0 asignaciones (keep ID 59)
-- ============================================================

BEGIN;

-- ============================================================
-- STEP 1: MERGE DUPLICATES
-- True duplicates = same entry time + exit time + same enabled days
-- ============================================================

-- 08:00-08:00 (24h): IDs 4, 63 → merge into 78 (150 asig)
UPDATE turnos_asignados SET turno_plantilla_id = 78
  WHERE turno_plantilla_id IN (4, 63)
  AND turno_plantilla_id != 78;

-- 09:00-12:00 L-V: IDs 64, 65 → merge into 5 (11 asig)
UPDATE turnos_asignados SET turno_plantilla_id = 5
  WHERE turno_plantilla_id IN (64, 65)
  AND turno_plantilla_id != 5;

-- 14:00-19:00 L-V: ID 14 → merge into 15 (11 asig)
UPDATE turnos_asignados SET turno_plantilla_id = 15
  WHERE turno_plantilla_id IN (14)
  AND turno_plantilla_id != 15;

-- 14:00-17:00: ID 86 → merge into 16 (43 asig)
UPDATE turnos_asignados SET turno_plantilla_id = 16
  WHERE turno_plantilla_id IN (86)
  AND turno_plantilla_id != 16;

-- 14:00-08:00: ID 72 (DOCTORA PACO) → merge into 13 (5 asig)
UPDATE turnos_asignados SET turno_plantilla_id = 13
  WHERE turno_plantilla_id IN (72)
  AND turno_plantilla_id != 13;

-- 08:00-14:00 L-V: ID 80 (vacacion L.V.) → merge into 58 (783 asig)
UPDATE turnos_asignados SET turno_plantilla_id = 58
  WHERE turno_plantilla_id IN (80)
  AND turno_plantilla_id != 58;

-- 09:00-15:00 L-V: ID 70 (administrativo) → merge into 69 (29 asig)
UPDATE turnos_asignados SET turno_plantilla_id = 69
  WHERE turno_plantilla_id IN (70)
  AND turno_plantilla_id != 69;

-- 08:00-11:00: ID 87 → merge into 47 (49 asig)
UPDATE turnos_asignados SET turno_plantilla_id = 47
  WHERE turno_plantilla_id IN (87)
  AND turno_plantilla_id != 47;

-- Deactivate merged plantillas
UPDATE turnos_plantilla SET activo = false
  WHERE id IN (4, 63, 64, 65, 14, 86, 72, 80, 70, 87);

-- ============================================================
-- STEP 2: RENAME CODES TO HH:MM-HH:MM FORMAT
-- ============================================================

UPDATE turnos_plantilla SET codigo = '08:00-21:00', nombre = 'Turno 08:00-21:00' WHERE id = 3;
UPDATE turnos_plantilla SET codigo = '09:00-12:00 L-V', nombre = 'Turno 09:00-12:00 L-V' WHERE id = 5;
UPDATE turnos_plantilla SET codigo = '09:00-22:00', nombre = 'Turno 09:00-22:00' WHERE id = 6;
UPDATE turnos_plantilla SET codigo = '11:00-14:00', nombre = 'Turno 11:00-14:00' WHERE id = 8;
UPDATE turnos_plantilla SET codigo = '13:00-19:00', nombre = 'Turno 13:00-19:00' WHERE id = 10;
UPDATE turnos_plantilla SET codigo = '13:00-19:00 L-V', nombre = 'Turno 13:00-19:00 L-V' WHERE id = 11;
UPDATE turnos_plantilla SET codigo = '14:00-08:00', nombre = 'Turno 14:00-08:00' WHERE id = 13;
UPDATE turnos_plantilla SET codigo = '14:00-19:00 L-V', nombre = 'Turno 14:00-19:00 L-V' WHERE id = 15;
UPDATE turnos_plantilla SET codigo = '14:00-17:00', nombre = 'Turno 14:00-17:00' WHERE id = 16;
UPDATE turnos_plantilla SET codigo = '14:00-20:00', nombre = 'Turno 14:00-20:00' WHERE id = 17;
UPDATE turnos_plantilla SET codigo = '14:00-20:00 L-V', nombre = 'Turno 14:00-20:00 L-V' WHERE id = 18;
UPDATE turnos_plantilla SET codigo = '15:00-20:00 L-V', nombre = 'Turno 15:00-20:00 L-V' WHERE id = 21;
UPDATE turnos_plantilla SET codigo = '17:00-20:00', nombre = 'Turno 17:00-20:00' WHERE id = 26;
UPDATE turnos_plantilla SET codigo = '19:00-07:00', nombre = 'Turno 19:00-07:00' WHERE id = 28;
UPDATE turnos_plantilla SET codigo = '20:00-07:00 L-V', nombre = 'Turno 20:00-07:00 L-V' WHERE id = 29;
UPDATE turnos_plantilla SET codigo = '20:00-11:00', nombre = 'Turno 20:00-11:00' WHERE id = 30;
UPDATE turnos_plantilla SET codigo = '20:00-14:00', nombre = 'Turno 20:00-14:00' WHERE id = 31;
UPDATE turnos_plantilla SET codigo = '20:00-02:00', nombre = 'Turno 20:00-02:00' WHERE id = 32;
UPDATE turnos_plantilla SET codigo = '21:00-07:00', nombre = 'Turno 21:00-07:00' WHERE id = 33;
UPDATE turnos_plantilla SET codigo = '06:00-18:00', nombre = 'Turno 06:00-18:00' WHERE id = 35;
UPDATE turnos_plantilla SET codigo = '07:00-18:00', nombre = 'Turno 07:00-18:00' WHERE id = 37;
UPDATE turnos_plantilla SET codigo = '07:00-19:00', nombre = 'Turno 07:00-19:00' WHERE id = 38;
UPDATE turnos_plantilla SET codigo = '07:00-13:00', nombre = 'Turno 07:00-13:00' WHERE id = 41;
UPDATE turnos_plantilla SET codigo = '07:00-13:00 L-V', nombre = 'Turno 07:00-13:00 L-V' WHERE id = 42;
UPDATE turnos_plantilla SET codigo = '07:00-15:00', nombre = 'Turno 07:00-15:00' WHERE id = 43;
UPDATE turnos_plantilla SET codigo = '07:00-16:00', nombre = 'Turno 07:00-16:00' WHERE id = 44;
UPDATE turnos_plantilla SET codigo = '07:00-19:00 S-D', nombre = 'Turno 07:00-19:00 S-D' WHERE id = 45;
UPDATE turnos_plantilla SET codigo = '08:00-11:00', nombre = 'Turno 08:00-11:00' WHERE id = 47;
UPDATE turnos_plantilla SET codigo = '08:00-11:00 L-V', nombre = 'Turno 08:00-11:00 L-V' WHERE id = 48;
UPDATE turnos_plantilla SET codigo = '08:30-14:30 L-V', nombre = 'Turno 08:30-14:30 L-V' WHERE id = 49;
UPDATE turnos_plantilla SET codigo = '08:00-12:00', nombre = 'Turno 08:00-12:00' WHERE id = 50;
UPDATE turnos_plantilla SET codigo = '08:00-13:00 L-V', nombre = 'Turno 08:00-13:00 L-V' WHERE id = 51;
UPDATE turnos_plantilla SET codigo = '08:00-18:00', nombre = 'Turno 08:00-18:00' WHERE id = 52;
UPDATE turnos_plantilla SET codigo = '08:00-19:00', nombre = 'Turno 08:00-19:00' WHERE id = 53;
UPDATE turnos_plantilla SET codigo = '08:00-13:00', nombre = 'Turno 08:00-13:00' WHERE id = 56;
UPDATE turnos_plantilla SET codigo = '08:00-14:00', nombre = 'Turno 08:00-14:00' WHERE id = 57;
UPDATE turnos_plantilla SET codigo = '08:00-14:00 L-V', nombre = 'Turno 08:00-14:00 L-V' WHERE id = 58;
UPDATE turnos_plantilla SET codigo = '08:00-16:00', nombre = 'Turno 08:00-16:00' WHERE id = 59;
UPDATE turnos_plantilla SET codigo = '08:00-17:00', nombre = 'Turno 08:00-17:00' WHERE id = 60;
UPDATE turnos_plantilla SET codigo = '08:00-22:00', nombre = 'Turno 08:00-22:00' WHERE id = 61;
UPDATE turnos_plantilla SET codigo = '09:00-12:00', nombre = 'Turno 09:00-12:00' WHERE id = 68;
UPDATE turnos_plantilla SET codigo = '09:00-15:00 L-V', nombre = 'Turno 09:00-15:00 L-V' WHERE id = 69;
UPDATE turnos_plantilla SET codigo = '08:00-08:00 (24h)', nombre = 'Turno 08:00-08:00 (24h)' WHERE id = 78;
UPDATE turnos_plantilla SET codigo = '12:00-15:00', nombre = 'Turno 12:00-15:00' WHERE id = 82;
UPDATE turnos_plantilla SET codigo = '20:00-20:00 (24h)', nombre = 'Turno 20:00-20:00 (24h)' WHERE id = 83;
UPDATE turnos_plantilla SET codigo = '07:30-19:30', nombre = 'Turno 07:30-19:30' WHERE id = 84;
UPDATE turnos_plantilla SET codigo = '07:30-13:30', nombre = 'Turno 07:30-13:30' WHERE id = 85;
UPDATE turnos_plantilla SET codigo = '08:00-20:00', nombre = 'Turno 08:00-20:00' WHERE id = 76;
UPDATE turnos_plantilla SET codigo = '20:00-08:00', nombre = 'Turno 20:00-08:00' WHERE id = 77;

-- ============================================================
-- STEP 3: DEACTIVATE PLANTILLAS WITH 0 ASIGNACIONES
-- (except ID 59 '8;16' which matches Excel)
-- ============================================================

UPDATE turnos_plantilla SET activo = false
  WHERE id IN (1, 2, 7, 9, 12, 19, 20, 22, 23, 24, 25, 27, 34, 36, 39, 40, 46, 54, 55, 62, 67, 81);

-- Keep ID 59 active — matches Excel schedule
UPDATE turnos_plantilla SET activo = true WHERE id = 59;

COMMIT;
