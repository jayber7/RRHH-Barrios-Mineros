-- Batch calculation of daily estados for all employees with biometric data
-- v2: Fixed night shift detection, 36h window for biometric logs
DO $$
DECLARE
    rec RECORD;
    d INT;
    dias_del_mes INT;
    v_entrada TIME;
    v_salida TIME;
    v_habilitado BOOLEAN;
    v_nocturno BOOLEAN;
    v_tolerancia INT;
    v_salida_adelantada INT;
    v_primera TIMESTAMP;
    v_ultima TIMESTAMP;
    v_llegada_min INT;
    v_entrada_min INT;
    v_salida_min INT;
    v_salida_real_min INT;
    v_min_atraso INT;
    v_estado INT;
    v_am_id INT;
    v_biometrico_id INT;
    v_total_horas DECIMAL(10,2);
    v_horas_diarias DECIMAL(10,2);
    v_entrada_min_calc INT;
    v_salida_min_calc INT;
    v_offset_hrs INT;
BEGIN
    FOR rec IN SELECT DISTINCT am.id as am_id, am.personal_id, am.mes, am.anio,
                      p.biometrico_id
               FROM asistencia_mensual am
               JOIN personal p ON p.id = am.personal_id
               WHERE p.biometrico_id IS NOT NULL
                 AND am.total_horas = 0
               ORDER BY am.anio, am.mes, am.personal_id
    LOOP
        v_biometrico_id := rec.biometrico_id;
        v_am_id := rec.am_id;
        v_total_horas := 0;
        dias_del_mes := DATE_PART('days',
            DATE_TRUNC('month', MAKE_DATE(rec.anio, rec.mes, 1)) + INTERVAL '1 month' - INTERVAL '1 day');

        FOR d IN 1..dias_del_mes LOOP
            v_nocturno := false;
            v_entrada := NULL;
            v_salida := NULL;
            v_habilitado := false;
            v_tolerancia := 5;
            v_salida_adelantada := 0;

            -- Get day of week column
            CASE EXTRACT(DOW FROM MAKE_DATE(rec.anio, rec.mes, d))
                WHEN 1 THEN -- lunes
                    SELECT tp.lunes_entrada, tp.lunes_salida, tp.lunes_habilitado,
                           COALESCE(tp.nocturno_lunes, false),
                           tp.tolerancia_atraso, tp.salida_adelantada
                    INTO v_entrada, v_salida, v_habilitado,
                         v_nocturno, v_tolerancia, v_salida_adelantada
                    FROM turnos_plantilla tp
                    JOIN turnos_asignados ta ON ta.turno_plantilla_id = tp.id
                    WHERE ta.personal_id = rec.personal_id
                      AND ta.fecha_inicio <= MAKE_DATE(rec.anio, rec.mes, d)
                      AND (ta.fecha_fin IS NULL OR ta.fecha_fin >= MAKE_DATE(rec.anio, rec.mes, d))
                    ORDER BY ta.fecha_inicio DESC LIMIT 1;
                WHEN 2 THEN -- martes
                    SELECT tp.martes_entrada, tp.martes_salida, tp.martes_habilitado,
                           COALESCE(tp.nocturno_martes, false),
                           tp.tolerancia_atraso, tp.salida_adelantada
                    INTO v_entrada, v_salida, v_habilitado,
                         v_nocturno, v_tolerancia, v_salida_adelantada
                    FROM turnos_plantilla tp
                    JOIN turnos_asignados ta ON ta.turno_plantilla_id = tp.id
                    WHERE ta.personal_id = rec.personal_id
                      AND ta.fecha_inicio <= MAKE_DATE(rec.anio, rec.mes, d)
                      AND (ta.fecha_fin IS NULL OR ta.fecha_fin >= MAKE_DATE(rec.anio, rec.mes, d))
                    ORDER BY ta.fecha_inicio DESC LIMIT 1;
                WHEN 3 THEN -- miercoles
                    SELECT tp.miercoles_entrada, tp.miercoles_salida, tp.miercoles_habilitado,
                           COALESCE(tp.nocturno_miercoles, false),
                           tp.tolerancia_atraso, tp.salida_adelantada
                    INTO v_entrada, v_salida, v_habilitado,
                         v_nocturno, v_tolerancia, v_salida_adelantada
                    FROM turnos_plantilla tp
                    JOIN turnos_asignados ta ON ta.turno_plantilla_id = tp.id
                    WHERE ta.personal_id = rec.personal_id
                      AND ta.fecha_inicio <= MAKE_DATE(rec.anio, rec.mes, d)
                      AND (ta.fecha_fin IS NULL OR ta.fecha_fin >= MAKE_DATE(rec.anio, rec.mes, d))
                    ORDER BY ta.fecha_inicio DESC LIMIT 1;
                WHEN 4 THEN -- jueves
                    SELECT tp.jueves_entrada, tp.jueves_salida, tp.jueves_habilitado,
                           COALESCE(tp.nocturno_jueves, false),
                           tp.tolerancia_atraso, tp.salida_adelantada
                    INTO v_entrada, v_salida, v_habilitado,
                         v_nocturno, v_tolerancia, v_salida_adelantada
                    FROM turnos_plantilla tp
                    JOIN turnos_asignados ta ON ta.turno_plantilla_id = tp.id
                    WHERE ta.personal_id = rec.personal_id
                      AND ta.fecha_inicio <= MAKE_DATE(rec.anio, rec.mes, d)
                      AND (ta.fecha_fin IS NULL OR ta.fecha_fin >= MAKE_DATE(rec.anio, rec.mes, d))
                    ORDER BY ta.fecha_inicio DESC LIMIT 1;
                WHEN 5 THEN -- viernes
                    SELECT tp.viernes_entrada, tp.viernes_salida, tp.viernes_habilitado,
                           COALESCE(tp.nocturno_viernes, false),
                           tp.tolerancia_atraso, tp.salida_adelantada
                    INTO v_entrada, v_salida, v_habilitado,
                         v_nocturno, v_tolerancia, v_salida_adelantada
                    FROM turnos_plantilla tp
                    JOIN turnos_asignados ta ON ta.turno_plantilla_id = tp.id
                    WHERE ta.personal_id = rec.personal_id
                      AND ta.fecha_inicio <= MAKE_DATE(rec.anio, rec.mes, d)
                      AND (ta.fecha_fin IS NULL OR ta.fecha_fin >= MAKE_DATE(rec.anio, rec.mes, d))
                    ORDER BY ta.fecha_inicio DESC LIMIT 1;
                WHEN 6 THEN -- sabado
                    SELECT tp.sabado_entrada, tp.sabado_salida, tp.sabado_habilitado,
                           COALESCE(tp.nocturno_sabado, false),
                           tp.tolerancia_atraso, tp.salida_adelantada
                    INTO v_entrada, v_salida, v_habilitado,
                         v_nocturno, v_tolerancia, v_salida_adelantada
                    FROM turnos_plantilla tp
                    JOIN turnos_asignados ta ON ta.turno_plantilla_id = tp.id
                    WHERE ta.personal_id = rec.personal_id
                      AND ta.fecha_inicio <= MAKE_DATE(rec.anio, rec.mes, d)
                      AND (ta.fecha_fin IS NULL OR ta.fecha_fin >= MAKE_DATE(rec.anio, rec.mes, d))
                    ORDER BY ta.fecha_inicio DESC LIMIT 1;
                WHEN 0 THEN -- domingo
                    SELECT tp.domingo_entrada, tp.domingo_salida, tp.domingo_habilitado,
                           COALESCE(tp.nocturno_domingo, false),
                           tp.tolerancia_atraso, tp.salida_adelantada
                    INTO v_entrada, v_salida, v_habilitado,
                         v_nocturno, v_tolerancia, v_salida_adelantada
                    FROM turnos_plantilla tp
                    JOIN turnos_asignados ta ON ta.turno_plantilla_id = tp.id
                    WHERE ta.personal_id = rec.personal_id
                      AND ta.fecha_inicio <= MAKE_DATE(rec.anio, rec.mes, d)
                      AND (ta.fecha_fin IS NULL OR ta.fecha_fin >= MAKE_DATE(rec.anio, rec.mes, d))
                    ORDER BY ta.fecha_inicio DESC LIMIT 1;
            END CASE;

            -- Auto-detect night shift if entrada >= salida
            IF v_entrada IS NOT NULL AND v_salida IS NOT NULL THEN
                v_entrada_min := EXTRACT(HOUR FROM v_entrada) * 60 + EXTRACT(MINUTE FROM v_entrada);
                v_salida_min := EXTRACT(HOUR FROM v_salida) * 60 + EXTRACT(MINUTE FROM v_salida);
                IF v_salida_min <= v_entrada_min THEN
                    v_nocturno := true;
                END IF;
                IF v_salida_min < v_entrada_min THEN
                    v_salida_min := v_salida_min + 1440;
                END IF;
            END IF;

            IF NOT v_habilitado THEN
                v_estado := 1;
                v_min_atraso := 0;
            ELSIF v_entrada IS NULL THEN
                v_estado := 1;
                v_min_atraso := 0;
            ELSE
                -- Use proper window: 6h offset for day, 12h offset for night
                v_offset_hrs := CASE WHEN v_nocturno THEN 12 ELSE 6 END;

                EXECUTE 'SELECT MIN(b.timestamp), MAX(b.timestamp)
                         FROM biometrico_logs_raw b
                         WHERE b.biometrico_id = $1
                           AND b.timestamp >= $2::date + interval ''' || v_offset_hrs || ' hours''
                           AND b.timestamp < $2::date + interval ''1 day'' + interval ''' || v_offset_hrs || ' hours'''
                INTO v_primera, v_ultima
                USING v_biometrico_id, MAKE_DATE(rec.anio, rec.mes, d);

                IF v_primera IS NULL THEN
                    v_estado := 9;
                    v_min_atraso := 0;
                ELSE
                    v_llegada_min := EXTRACT(HOUR FROM v_primera) * 60 + EXTRACT(MINUTE FROM v_primera);
                    v_entrada_min := EXTRACT(HOUR FROM v_entrada) * 60 + EXTRACT(MINUTE FROM v_entrada);
                    v_tolerancia := COALESCE(v_tolerancia, 5);
                    v_min_atraso := GREATEST(0, v_llegada_min - v_entrada_min - v_tolerancia);

                    IF v_llegada_min - v_entrada_min > 240 THEN
                        v_min_atraso := 0;
                    END IF;

                    IF v_ultima IS NULL OR v_ultima = v_primera THEN
                        v_estado := 8;
                    ELSE
                        v_salida_real_min := EXTRACT(HOUR FROM v_ultima) * 60 + EXTRACT(MINUTE FROM v_ultima);
                        IF v_nocturno AND v_salida_real_min < v_entrada_min THEN
                            v_salida_real_min := v_salida_real_min + 1440;
                        END IF;
                        v_salida_adelantada := COALESCE(v_salida_adelantada, 0);

                        IF v_min_atraso > 0 THEN
                            v_estado := 2;
                        ELSIF v_salida_real_min < v_salida_min - v_salida_adelantada THEN
                            v_estado := 7;
                        ELSIF v_nocturno THEN
                            v_estado := 5;
                        ELSE
                            v_estado := 1;
                        END IF;
                    END IF;
                END IF;
            END IF;

            -- Calculate shift hours
            v_horas_diarias := 0;
            IF v_entrada IS NOT NULL AND v_salida IS NOT NULL THEN
                v_entrada_min_calc := EXTRACT(HOUR FROM v_entrada) * 60 + EXTRACT(MINUTE FROM v_entrada);
                v_salida_min_calc := EXTRACT(HOUR FROM v_salida) * 60 + EXTRACT(MINUTE FROM v_salida);
                IF v_salida_min_calc < v_entrada_min_calc THEN
                    v_salida_min_calc := v_salida_min_calc + 1440;
                END IF;
                v_horas_diarias := ROUND((v_salida_min_calc - v_entrada_min_calc) / 60.0, 2);
            END IF;
            IF v_estado IN (1, 2, 5, 7) THEN
                v_total_horas := v_total_horas + v_horas_diarias;
            END IF;

            UPDATE asistencia_diaria
            SET estado = v_estado, minutos_atraso = COALESCE(v_min_atraso, 0)
            WHERE asistencia_id = v_am_id AND dia = d;
        END LOOP;

        UPDATE asistencia_mensual SET total_horas = v_total_horas, total_atrasos_min = (
            SELECT COALESCE(SUM(minutos_atraso), 0)
            FROM asistencia_diaria
            WHERE asistencia_id = v_am_id AND estado = 2
        ) WHERE id = v_am_id;
    END LOOP;
END $$;
