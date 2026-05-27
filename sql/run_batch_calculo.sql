-- Batch calculation of daily estados for all employees with biometric data
-- per month. Much faster than the Node.js loop.

DO $$
DECLARE
    rec RECORD;
    d INT;
    dias_del_mes INT;
    v_entrada TIME;
    v_salida TIME;
    v_habilitado BOOLEAN;
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
BEGIN
    FOR rec IN SELECT DISTINCT am.id as am_id, am.personal_id, am.mes, am.anio,
                      p.biometrico_id
               FROM asistencia_mensual am
               JOIN personal p ON p.id = am.personal_id
               WHERE p.biometrico_id IS NOT NULL
                 AND am.total_horas = 0  -- Only biometric-generated records
               ORDER BY am.anio, am.mes, am.personal_id
    LOOP
        v_biometrico_id := rec.biometrico_id;
        v_am_id := rec.am_id;
        dias_del_mes := DATE_PART('days',
            DATE_TRUNC('month', MAKE_DATE(rec.anio, rec.mes, 1)) + INTERVAL '1 month' - INTERVAL '1 day');

        FOR d IN 1..dias_del_mes LOOP
            -- Find shift for this employee on this date
            SELECT tp.lunes_entrada, tp.lunes_salida, tp.lunes_habilitado,
                   tp.martes_entrada, tp.martes_salida, tp.martes_habilitado,
                   tp.miercoles_entrada, tp.miercoles_salida, tp.miercoles_habilitado,
                   tp.jueves_entrada, tp.jueves_salida, tp.jueves_habilitado,
                   tp.viernes_entrada, tp.viernes_salida, tp.viernes_habilitado,
                   tp.sabado_entrada, tp.sabado_salida, tp.sabado_habilitado,
                   tp.domingo_entrada, tp.domingo_salida, tp.domingo_habilitado,
                   tp.tolerancia_atraso, tp.salida_adelantada
            INTO v_entrada, v_salida, v_habilitado,
                 v_entrada, v_salida, v_habilitado,
                 v_entrada, v_salida, v_habilitado,
                 v_entrada, v_salida, v_habilitado,
                 v_entrada, v_salida, v_habilitado,
                 v_entrada, v_salida, v_habilitado,
                 v_entrada, v_salida, v_habilitado,
                 v_tolerancia, v_salida_adelantada
            FROM turnos_asignados ta
            JOIN turnos_plantilla tp ON ta.turno_plantilla_id = tp.id
            WHERE ta.personal_id = rec.personal_id
              AND ta.fecha_inicio <= MAKE_DATE(rec.anio, rec.mes, d)
              AND (ta.fecha_fin IS NULL OR ta.fecha_fin >= MAKE_DATE(rec.anio, rec.mes, d))
            ORDER BY ta.fecha_inicio DESC
            LIMIT 1;

            IF NOT FOUND THEN
                v_estado := 1;
                v_min_atraso := 0;
            ELSE
                -- Get day of week column
                CASE EXTRACT(DOW FROM MAKE_DATE(rec.anio, rec.mes, d))
                    WHEN 1 THEN -- lunes
                        SELECT lunes_entrada, lunes_salida, lunes_habilitado,
                               tolerancia_atraso, salida_adelantada
                        INTO v_entrada, v_salida, v_habilitado,
                             v_tolerancia, v_salida_adelantada
                        FROM turnos_plantilla tp
                        JOIN turnos_asignados ta ON ta.turno_plantilla_id = tp.id
                        WHERE ta.personal_id = rec.personal_id
                          AND ta.fecha_inicio <= MAKE_DATE(rec.anio, rec.mes, d)
                          AND (ta.fecha_fin IS NULL OR ta.fecha_fin >= MAKE_DATE(rec.anio, rec.mes, d))
                        ORDER BY ta.fecha_inicio DESC LIMIT 1;
                    WHEN 2 THEN -- martes
                        SELECT martes_entrada, martes_salida, martes_habilitado,
                               tolerancia_atraso, salida_adelantada
                        INTO v_entrada, v_salida, v_habilitado,
                             v_tolerancia, v_salida_adelantada
                        FROM turnos_plantilla tp
                        JOIN turnos_asignados ta ON ta.turno_plantilla_id = tp.id
                        WHERE ta.personal_id = rec.personal_id
                          AND ta.fecha_inicio <= MAKE_DATE(rec.anio, rec.mes, d)
                          AND (ta.fecha_fin IS NULL OR ta.fecha_fin >= MAKE_DATE(rec.anio, rec.mes, d))
                        ORDER BY ta.fecha_inicio DESC LIMIT 1;
                    WHEN 3 THEN -- miercoles
                        SELECT miercoles_entrada, miercoles_salida, miercoles_habilitado,
                               tolerancia_atraso, salida_adelantada
                        INTO v_entrada, v_salida, v_habilitado,
                             v_tolerancia, v_salida_adelantada
                        FROM turnos_plantilla tp
                        JOIN turnos_asignados ta ON ta.turno_plantilla_id = tp.id
                        WHERE ta.personal_id = rec.personal_id
                          AND ta.fecha_inicio <= MAKE_DATE(rec.anio, rec.mes, d)
                          AND (ta.fecha_fin IS NULL OR ta.fecha_fin >= MAKE_DATE(rec.anio, rec.mes, d))
                        ORDER BY ta.fecha_inicio DESC LIMIT 1;
                    WHEN 4 THEN -- jueves
                        SELECT jueves_entrada, jueves_salida, jueves_habilitado,
                               tolerancia_atraso, salida_adelantada
                        INTO v_entrada, v_salida, v_habilitado,
                             v_tolerancia, v_salida_adelantada
                        FROM turnos_plantilla tp
                        JOIN turnos_asignados ta ON ta.turno_plantilla_id = tp.id
                        WHERE ta.personal_id = rec.personal_id
                          AND ta.fecha_inicio <= MAKE_DATE(rec.anio, rec.mes, d)
                          AND (ta.fecha_fin IS NULL OR ta.fecha_fin >= MAKE_DATE(rec.anio, rec.mes, d))
                        ORDER BY ta.fecha_inicio DESC LIMIT 1;
                    WHEN 5 THEN -- viernes
                        SELECT viernes_entrada, viernes_salida, viernes_habilitado,
                               tolerancia_atraso, salida_adelantada
                        INTO v_entrada, v_salida, v_habilitado,
                             v_tolerancia, v_salida_adelantada
                        FROM turnos_plantilla tp
                        JOIN turnos_asignados ta ON ta.turno_plantilla_id = tp.id
                        WHERE ta.personal_id = rec.personal_id
                          AND ta.fecha_inicio <= MAKE_DATE(rec.anio, rec.mes, d)
                          AND (ta.fecha_fin IS NULL OR ta.fecha_fin >= MAKE_DATE(rec.anio, rec.mes, d))
                        ORDER BY ta.fecha_inicio DESC LIMIT 1;
                    WHEN 6 THEN -- sabado
                        SELECT sabado_entrada, sabado_salida, sabado_habilitado,
                               tolerancia_atraso, salida_adelantada
                        INTO v_entrada, v_salida, v_habilitado,
                             v_tolerancia, v_salida_adelantada
                        FROM turnos_plantilla tp
                        JOIN turnos_asignados ta ON ta.turno_plantilla_id = tp.id
                        WHERE ta.personal_id = rec.personal_id
                          AND ta.fecha_inicio <= MAKE_DATE(rec.anio, rec.mes, d)
                          AND (ta.fecha_fin IS NULL OR ta.fecha_fin >= MAKE_DATE(rec.anio, rec.mes, d))
                        ORDER BY ta.fecha_inicio DESC LIMIT 1;
                    WHEN 0 THEN -- domingo
                        SELECT domingo_entrada, domingo_salida, domingo_habilitado,
                               tolerancia_atraso, salida_adelantada
                        INTO v_entrada, v_salida, v_habilitado,
                             v_tolerancia, v_salida_adelantada
                        FROM turnos_plantilla tp
                        JOIN turnos_asignados ta ON ta.turno_plantilla_id = tp.id
                        WHERE ta.personal_id = rec.personal_id
                          AND ta.fecha_inicio <= MAKE_DATE(rec.anio, rec.mes, d)
                          AND (ta.fecha_fin IS NULL OR ta.fecha_fin >= MAKE_DATE(rec.anio, rec.mes, d))
                        ORDER BY ta.fecha_inicio DESC LIMIT 1;
                END CASE;

                IF NOT v_habilitado THEN
                    v_estado := 1;
                    v_min_atraso := 0;
                ELSIF v_entrada IS NULL THEN
                    v_estado := 1;
                    v_min_atraso := 0;
                ELSE
                    -- Get first and last biometric log for this day
                    SELECT MIN(b.timestamp), MAX(b.timestamp)
                    INTO v_primera, v_ultima
                    FROM biometrico_logs_raw b
                    WHERE b.biometrico_id = v_biometrico_id
                      AND b.timestamp::date = MAKE_DATE(rec.anio, rec.mes, d);

                    IF v_primera IS NULL THEN
                        v_estado := 9;
                        v_min_atraso := 0;
                    ELSE
                        v_entrada_min := EXTRACT(HOUR FROM v_entrada) * 60 + EXTRACT(MINUTE FROM v_entrada);
                        v_llegada_min := EXTRACT(HOUR FROM v_primera) * 60 + EXTRACT(MINUTE FROM v_primera);
                        v_tolerancia := COALESCE(v_tolerancia, 5);
                        v_min_atraso := GREATEST(0, v_llegada_min - v_entrada_min - v_tolerancia);

                        IF v_ultima IS NULL OR v_ultima = v_primera THEN
                            v_estado := 8;
                        ELSE
                            v_salida_min := EXTRACT(HOUR FROM v_salida) * 60 + EXTRACT(MINUTE FROM v_salida);
                            IF v_salida_min < v_entrada_min THEN
                                v_salida_min := v_salida_min + 1440;
                            END IF;
                            v_salida_real_min := EXTRACT(HOUR FROM v_ultima) * 60 + EXTRACT(MINUTE FROM v_ultima);
                            v_salida_adelantada := COALESCE(v_salida_adelantada, 0);

                            IF v_min_atraso > 0 THEN
                                v_estado := 2;
                            ELSIF v_salida_real_min < v_salida_min - v_salida_adelantada THEN
                                v_estado := 7;
                            ELSE
                                v_estado := 1;
                            END IF;
                        END IF;
                    END IF;
                END IF;
            END IF;

            UPDATE asistencia_diaria
            SET estado = v_estado, minutos_atraso = COALESCE(v_min_atraso, 0)
            WHERE asistencia_id = v_am_id AND dia = d;
        END LOOP;

        -- Update monthly totals
        UPDATE asistencia_mensual SET total_atrasos_min = (
            SELECT COALESCE(SUM(minutos_atraso), 0)
            FROM asistencia_diaria
            WHERE asistencia_id = v_am_id AND estado = 2
        ) WHERE id = v_am_id;
    END LOOP;
END $$;
