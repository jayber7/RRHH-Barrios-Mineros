-- Generate asistencia_mensual + asistencia_diaria records from biometrico_logs_raw
-- for months that don't have them yet, then run the calculation engine.

-- Step 1: Create asistencia_mensual records for each employee + month with biometric data
INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, tipo_planilla)
SELECT DISTINCT p.id, EXTRACT(MONTH FROM br.timestamp)::int, EXTRACT(YEAR FROM br.timestamp)::int,
       0, 0,
       COALESCE(
           (SELECT CASE WHEN vl.unidad_servicio ILIKE '%RESIDENTE%' THEN 'RESIDENTE' ELSE 'MINISTERIAL' END
            FROM vinculos_laborales vl WHERE vl.personal_id = p.id LIMIT 1),
           'MINISTERIAL'
       )
FROM biometrico_logs_raw br
JOIN personal p ON p.biometrico_id = br.biometrico_id
WHERE NOT EXISTS (
    SELECT 1 FROM asistencia_mensual am
    WHERE am.personal_id = p.id
      AND am.mes = EXTRACT(MONTH FROM br.timestamp)::int
      AND am.anio = EXTRACT(YEAR FROM br.timestamp)::int
)
ON CONFLICT (personal_id, mes, anio, tipo_planilla) DO NOTHING;

-- Step 2: Create asistencia_diaria records for each day of each month
DO $$
DECLARE
    rec RECORD;
    dias_del_mes INT;
    d INT;
BEGIN
    FOR rec IN SELECT DISTINCT am.id, am.mes, am.anio
               FROM asistencia_mensual am
               WHERE am.total_horas = 0
                 AND NOT EXISTS (
                     SELECT 1 FROM asistencia_diaria ad
                     WHERE ad.asistencia_id = am.id
                 )
    LOOP
        dias_del_mes := DATE_PART('days',
            DATE_TRUNC('month', MAKE_DATE(rec.anio, rec.mes, 1)) + INTERVAL '1 month' - INTERVAL '1 day');
        FOR d IN 1..dias_del_mes LOOP
            INSERT INTO asistencia_diaria (asistencia_id, dia, valor)
            VALUES (rec.id, d, 'P')
            ON CONFLICT (asistencia_id, dia) DO NOTHING;
        END LOOP;
    END LOOP;
END $$;

-- Step 3: Clear estado/minutos_atraso for biometric-based records (will be recalculated)
UPDATE asistencia_diaria ad
SET estado = NULL, minutos_atraso = 0
FROM asistencia_mensual am
WHERE ad.asistencia_id = am.id AND am.total_horas = 0;
