-- ============================================================
-- MIGRACIÓN: Panel Interactivo de Turnos (Grid Mensual Día a Día)
-- ============================================================

-- 1. Tabla de feriados (para marcar días festivos en la grilla)
CREATE TABLE IF NOT EXISTS cat_feriados (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    tipo VARCHAR(30) CHECK (tipo IN ('NACIONAL','DEPARTAMENTAL','LOCAL','INSTITUCIONAL')),
    recurrente_anual BOOLEAN DEFAULT false,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cat_feriados_fecha ON cat_feriados(fecha);

-- 2. Configuración de Servicios (Unidades) con franjas POR DÍA
CREATE TABLE IF NOT EXISTS turnos_grid_servicios (
    id SERIAL PRIMARY KEY,
    unidad_servicio VARCHAR(150) NOT NULL UNIQUE,
    -- Franjas por día: key puede ser día de semana (0-6) o día del mes (1-31)
    -- { "0": [{"inicio":"07:00","fin":"14:00","tipo":"manana","cupo":2}], "1": [...], "15": [...] }
    franjas_por_dia JSONB NOT NULL DEFAULT '{}',
    -- Horas requeridas mensuales por fuente financiamiento
    horas_requeridas_mes JSONB DEFAULT '{}',
    color_identificacion VARCHAR(7) DEFAULT '#3B82F6',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Grilla Mensual Día a Día (instancia calculada para un mes/año)
CREATE TABLE IF NOT EXISTS turnos_grid_mensual (
    id SERIAL PRIMARY KEY,
    servicio_id INT REFERENCES turnos_grid_servicios(id) ON DELETE CASCADE,
    anio INT NOT NULL,
    mes INT NOT NULL CHECK (mes BETWEEN 1 AND 12),
    dia INT NOT NULL CHECK (dia BETWEEN 1 AND 31),
    franja_inicio TIME NOT NULL,
    franja_fin TIME NOT NULL,
    tipo_franja VARCHAR(20) CHECK (tipo_franja IN ('manana','tarde','noche','completo','personalizada')),
    cupo_maximo INT DEFAULT 1 CHECK (cupo_maximo > 0),
    horas_franja DECIMAL(4,2) GENERATED ALWAYS AS (
        CASE 
            WHEN franja_fin > franja_inicio THEN EXTRACT(EPOCH FROM (franja_fin - franja_inicio))/3600
            ELSE EXTRACT(EPOCH FROM (franja_fin - franja_inicio + INTERVAL '24 hours'))/3600
        END
    ) STORED,
    es_festivo BOOLEAN DEFAULT false,
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(servicio_id, anio, mes, dia, franja_inicio, franja_fin)
);

CREATE INDEX IF NOT EXISTS idx_grid_mensual_servicio_mes ON turnos_grid_mensual(servicio_id, anio, mes);
CREATE INDEX IF NOT EXISTS idx_grid_mensual_dia ON turnos_grid_mensual(servicio_id, anio, mes, dia);

-- 4. Asignaciones en la Grilla (estado actual del drag-and-drop)
CREATE TABLE IF NOT EXISTS turnos_grid_asignaciones (
    id SERIAL PRIMARY KEY,
    grid_mensual_id INT REFERENCES turnos_grid_mensual(id) ON DELETE CASCADE,
    personal_id INT REFERENCES personal(id) ON DELETE CASCADE,
    -- Override opcional de horarios para esta asignación específica
    franja_inicio_override TIME,
    franja_fin_override TIME,
    -- Metadatos
    creado_por INT REFERENCES usuarios(id),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_por INT REFERENCES usuarios(id),
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(grid_mensual_id, personal_id)
);

CREATE INDEX IF NOT EXISTS idx_grid_asig_personal ON turnos_grid_asignaciones(personal_id);
CREATE INDEX IF NOT EXISTS idx_grid_asig_grid ON turnos_grid_asignaciones(grid_mensual_id);

-- 5. Cuota de Horas Mensuales por Personal
CREATE TABLE IF NOT EXISTS turnos_grid_cuotas (
    id SERIAL PRIMARY KEY,
    personal_id INT REFERENCES personal(id) ON DELETE CASCADE,
    anio INT NOT NULL,
    mes INT NOT NULL CHECK (mes BETWEEN 1 AND 12),
    horas_obligatorias DECIMAL(6,2) NOT NULL CHECK (horas_obligatorias >= 0),
    fuente_financiamiento_id INT REFERENCES cat_fuentes_financiamiento(id),
    tipo_contrato_id INT REFERENCES cat_tipos_personal(id),
    origen VARCHAR(20) CHECK (origen IN ('AUTO','MANUAL','IMPORTADO')) DEFAULT 'AUTO',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(personal_id, anio, mes, fuente_financiamiento_id, tipo_contrato_id)
);

CREATE INDEX IF NOT EXISTS idx_grid_cuotas_personal_mes ON turnos_grid_cuotas(personal_id, anio, mes);
CREATE INDEX IF NOT EXISTS idx_grid_cuotas_fuente_tipo ON turnos_grid_cuotas(fuente_financiamiento_id, tipo_contrato_id);

-- 6. Resumen de Carga Horaria (materializada para performance)
CREATE TABLE IF NOT EXISTS turnos_grid_carga_resumen (
    personal_id INT REFERENCES personal(id) ON DELETE CASCADE,
    anio INT NOT NULL,
    mes INT NOT NULL CHECK (mes BETWEEN 1 AND 12),
    servicio_id INT REFERENCES turnos_grid_servicios(id) ON DELETE CASCADE,
    horas_asignadas DECIMAL(6,2) DEFAULT 0,
    horas_obligatorias DECIMAL(6,2) DEFAULT 0,
    diferencia DECIMAL(6,2) GENERATED ALWAYS AS (horas_asignadas - horas_obligatorias) STORED,
    estado VARCHAR(20) GENERATED ALWAYS AS (
        CASE 
            WHEN horas_asignadas >= horas_obligatorias THEN 'CUMPLIDO'
            WHEN horas_asignadas > 0 THEN 'PARCIAL'
            ELSE 'SIN_ASIGNAR'
        END
    ) STORED,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (personal_id, anio, mes, servicio_id)
);

CREATE INDEX IF NOT EXISTS idx_carga_resumen_servicio_mes ON turnos_grid_carga_resumen(servicio_id, anio, mes);

-- 7. AUDITORÍA / HISTORIAL
CREATE TABLE IF NOT EXISTS turnos_grid_auditoria (
    id BIGSERIAL PRIMARY KEY,
    grid_mensual_id INT REFERENCES turnos_grid_mensual(id) ON DELETE SET NULL,
    personal_id INT REFERENCES personal(id) ON DELETE SET NULL,
    accion VARCHAR(20) NOT NULL CHECK (accion IN ('CREATE','UPDATE','DELETE','MOVE','BATCH')),
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    usuario_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_grid_auditoria_personal_fecha ON turnos_grid_auditoria(personal_id, created_at);
CREATE INDEX IF NOT EXISTS idx_grid_auditoria_grid_fecha ON turnos_grid_auditoria(grid_mensual_id, created_at);
CREATE INDEX IF NOT EXISTS idx_grid_auditoria_usuario_fecha ON turnos_grid_auditoria(usuario_id, created_at);
CREATE INDEX IF NOT EXISTS idx_grid_auditoria_accion_fecha ON turnos_grid_auditoria(accion, created_at);

-- 8. Función para generar grilla mensual desde configuración de servicio
CREATE OR REPLACE FUNCTION generar_grilla_mensual(p_servicio_id INT, p_anio INT, p_mes INT)
RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE
    v_dias INT;
    v_dia INT;
    v_franjas JSONB;
    v_franja JSONB;
    v_dia_semana INT;
    v_fecha DATE;
BEGIN
    -- Eliminar grilla existente para ese mes
    DELETE FROM turnos_grid_mensual WHERE servicio_id = p_servicio_id AND anio = p_anio AND mes = p_mes;
    
    -- Obtener días del mes
    v_dias := EXTRACT(DAY FROM (DATE_TRUNC('month', MAKE_DATE(p_anio, p_mes, 1)) + INTERVAL '1 month - 1 day'));
    
    -- Obtener configuración de franjas del servicio
    SELECT franjas_por_dia INTO v_franjas FROM turnos_grid_servicios WHERE id = p_servicio_id;
    
    IF v_franjas IS NULL THEN
        v_franjas := '{}'::jsonb;
    END IF;
    
    -- Insertar día por día
    FOR v_dia IN 1..v_dias LOOP
        v_fecha := MAKE_DATE(p_anio, p_mes, v_dia);
        v_dia_semana := EXTRACT(DOW FROM v_fecha)::int; -- 0=Dom, 6=Sab
        
        -- Franjas para este día: prioridad día del mes > día de semana
        FOR v_franja IN SELECT * FROM jsonb_array_elements(
            COALESCE(
                v_franjas->>v_dia::text,
                v_franjas->>v_dia_semana::text,
                '[]'
            )::jsonb
        ) LOOP
            INSERT INTO turnos_grid_mensual (servicio_id, anio, mes, dia, franja_inicio, franja_fin, tipo_franja, cupo_maximo, es_festivo)
            VALUES (
                p_servicio_id, p_anio, p_mes, v_dia,
                (v_franja->>'inicio')::time,
                (v_franja->>'fin')::time,
                COALESCE(v_franja->>'tipo', 'personalizada'),
                COALESCE((v_franja->>'cupo')::int, 1),
                EXISTS(SELECT 1 FROM cat_feriados WHERE fecha = v_fecha AND activo = true)
            ) ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;
END $$;

-- 9. Trigger para actualizar resumen de carga horaria automáticamente
CREATE OR REPLACE FUNCTION actualizar_carga_horaria_resumen()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    v_servicio_id INT;
    v_anio INT;
    v_mes INT;
    v_personal_id INT;
    v_horas_asignadas DECIMAL(6,2);
    v_horas_obligatorias DECIMAL(6,2);
BEGIN
    -- Obtener info de la grilla afectada
    IF TG_OP = 'DELETE' THEN
        v_personal_id := OLD.personal_id;
        SELECT gm.servicio_id, gm.anio, gm.mes
        INTO v_servicio_id, v_anio, v_mes
        FROM turnos_grid_mensual gm
        WHERE gm.id = OLD.grid_mensual_id;
    ELSE
        v_personal_id := NEW.personal_id;
        SELECT gm.servicio_id, gm.anio, gm.mes
        INTO v_servicio_id, v_anio, v_mes
        FROM turnos_grid_mensual gm
        WHERE gm.id = NEW.grid_mensual_id;
    END IF;
    
    IF v_servicio_id IS NULL THEN
        RETURN COALESCE(NEW, OLD);
    END IF;
    
    -- Calcular horas asignadas en ese mes/servicio para ese personal
    SELECT COALESCE(SUM(
        gm.horas_franja * 
        CASE 
            WHEN ga.franja_inicio_override IS NOT NULL AND ga.franja_fin_override IS NOT NULL THEN
                CASE 
                    WHEN ga.franja_fin_override > ga.franja_inicio_override THEN EXTRACT(EPOCH FROM (ga.franja_fin_override - ga.franja_inicio_override))/3600
                    ELSE EXTRACT(EPOCH FROM (ga.franja_fin_override - ga.franja_inicio_override + INTERVAL '24 hours'))/3600
                END
            ELSE 1
        END
    ), 0) INTO v_horas_asignadas
    FROM turnos_grid_asignaciones ga
    JOIN turnos_grid_mensual gm ON ga.grid_mensual_id = gm.id
    WHERE ga.personal_id = v_personal_id
      AND gm.servicio_id = v_servicio_id
      AND gm.anio = v_anio
      AND gm.mes = v_mes;
    
    -- Obtener horas obligatorias (suma de todas las fuentes/tipos para ese personal en ese mes)
    SELECT COALESCE(SUM(horas_obligatorias), 0) INTO v_horas_obligatorias
    FROM turnos_grid_cuotas
    WHERE personal_id = v_personal_id
      AND anio = v_anio
      AND mes = v_mes;
    
    -- Upsert en resumen
    INSERT INTO turnos_grid_carga_resumen (personal_id, anio, mes, servicio_id, horas_asignadas, horas_obligatorias)
    VALUES (v_personal_id, v_anio, v_mes, v_servicio_id, v_horas_asignadas, v_horas_obligatorias)
    ON CONFLICT (personal_id, anio, mes, servicio_id) DO UPDATE SET
        horas_asignadas = EXCLUDED.horas_asignadas,
        horas_obligatorias = EXCLUDED.horas_obligatorias,
        updated_at = CURRENT_TIMESTAMP;
    
    RETURN COALESCE(NEW, OLD);
END $$;

DROP TRIGGER IF EXISTS trigger_actualizar_carga_horaria ON turnos_grid_asignaciones;
CREATE TRIGGER trigger_actualizar_carga_horaria
    AFTER INSERT OR UPDATE OR DELETE ON turnos_grid_asignaciones
    FOR EACH ROW EXECUTE FUNCTION actualizar_carga_horaria_resumen();

-- 10. Trigger para auditoría automática
CREATE OR REPLACE FUNCTION auditar_cambios_grilla()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    v_usuario_id INT := current_setting('app.current_user_id', true)::int;
    v_ip INET := current_setting('app.current_user_ip', true)::inet;
    v_ua TEXT := current_setting('app.current_user_agent', true);
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO turnos_grid_auditoria (grid_mensual_id, personal_id, accion, datos_nuevos, usuario_id, ip_address, user_agent)
        VALUES (NEW.grid_mensual_id, NEW.personal_id, 'CREATE', to_jsonb(NEW), v_usuario_id, v_ip, v_ua);
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO turnos_grid_auditoria (grid_mensual_id, personal_id, accion, datos_anteriores, datos_nuevos, usuario_id, ip_address, user_agent)
        VALUES (NEW.grid_mensual_id, NEW.personal_id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), v_usuario_id, v_ip, v_ua);
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO turnos_grid_auditoria (grid_mensual_id, personal_id, accion, datos_anteriores, usuario_id, ip_address, user_agent)
        VALUES (OLD.grid_mensual_id, OLD.personal_id, 'DELETE', to_jsonb(OLD), v_usuario_id, v_ip, v_ua);
    END IF;
    RETURN COALESCE(NEW, OLD);
END $$;

DROP TRIGGER IF EXISTS trigger_auditar_grilla ON turnos_grid_asignaciones;
CREATE TRIGGER trigger_auditar_grilla
    AFTER INSERT OR UPDATE OR DELETE ON turnos_grid_asignaciones
    FOR EACH ROW EXECUTE FUNCTION auditar_cambios_grilla();

-- 11. Permisos para el nuevo módulo
INSERT INTO permisos (codigo, descripcion, modulo) VALUES
('turnos-grid.ver', 'Ver panel interactivo de turnos', 'turnos'),
('turnos-grid.gestionar', 'Gestionar asignaciones en panel interactivo', 'turnos')
ON CONFLICT (codigo) DO UPDATE SET descripcion = EXCLUDED.descripcion, modulo = EXCLUDED.modulo;

-- 12. Rol JEFE_SERVICIO
INSERT INTO roles (nombre, descripcion) VALUES 
('JEFE_SERVICIO', 'Jefe de unidad/servicio - gestiona turnos de su servicio')
ON CONFLICT (nombre) DO UPDATE SET descripcion = EXCLUDED.descripcion;

INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT r.id, p.id FROM roles r, permisos p
WHERE r.nombre = 'JEFE_SERVICIO' AND p.codigo LIKE 'turnos-grid.%'
ON CONFLICT DO NOTHING;

-- 13. Poblar cat_feriados con feriados nacionales Bolivia 2024-2026 (muestra)
INSERT INTO cat_feriados (fecha, nombre, tipo, recurrente_anual) VALUES
-- 2024
('2024-01-01', 'Año Nuevo', 'NACIONAL', true),
('2024-01-22', 'Fundación del Estado Plurinacional', 'NACIONAL', true),
('2024-02-12', 'Carnaval', 'NACIONAL', false),
('2024-02-13', 'Carnaval', 'NACIONAL', false),
('2024-03-28', 'Jueves Santo', 'NACIONAL', false),
('2024-03-29', 'Viernes Santo', 'NACIONAL', false),
('2024-05-01', 'Día del Trabajador', 'NACIONAL', true),
('2024-06-21', 'Año Nuevo Andino Amazónico', 'NACIONAL', true),
('2024-08-06', 'Día de la Patria', 'NACIONAL', true),
('2024-11-02', 'Todos Santos', 'NACIONAL', true),
('2024-12-25', 'Navidad', 'NACIONAL', true),
-- 2025
('2025-01-01', 'Año Nuevo', 'NACIONAL', true),
('2025-01-22', 'Fundación del Estado Plurinacional', 'NACIONAL', true),
('2025-03-03', 'Carnaval', 'NACIONAL', false),
('2025-03-04', 'Carnaval', 'NACIONAL', false),
('2025-04-17', 'Jueves Santo', 'NACIONAL', false),
('2025-04-18', 'Viernes Santo', 'NACIONAL', false),
('2025-05-01', 'Día del Trabajador', 'NACIONAL', true),
('2025-06-21', 'Año Nuevo Andino Amazónico', 'NACIONAL', true),
('2025-08-06', 'Día de la Patria', 'NACIONAL', true),
('2025-11-02', 'Todos Santos', 'NACIONAL', true),
('2025-12-25', 'Navidad', 'NACIONAL', true),
-- 2026
('2026-01-01', 'Año Nuevo', 'NACIONAL', true),
('2026-01-22', 'Fundación del Estado Plurinacional', 'NACIONAL', true),
('2026-02-16', 'Carnaval', 'NACIONAL', false),
('2026-02-17', 'Carnaval', 'NACIONAL', false),
('2026-04-02', 'Jueves Santo', 'NACIONAL', false),
('2026-04-03', 'Viernes Santo', 'NACIONAL', false),
('2026-05-01', 'Día del Trabajador', 'NACIONAL', true),
('2026-06-21', 'Año Nuevo Andino Amazónico', 'NACIONAL', true),
('2026-08-06', 'Día de la Patria', 'NACIONAL', true),
('2026-11-02', 'Todos Santos', 'NACIONAL', true),
('2026-12-25', 'Navidad', 'NACIONAL', true)
ON CONFLICT (fecha) DO NOTHING;