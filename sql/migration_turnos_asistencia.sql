-- ============================================================
-- MIGRACIÓN: Módulo de Turnos + Refinamiento de Asistencia
-- ============================================================
-- Inspirado en el sistema Asis (FTecSys.mdb)
-- ============================================================

-- ============================================================
-- 1. TABLAS DE TURNOS
-- ============================================================

CREATE TABLE IF NOT EXISTS turnos_plantilla (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(100),

    lunes_entrada TIME,
    lunes_salida TIME,
    martes_entrada TIME,
    martes_salida TIME,
    miercoles_entrada TIME,
    miercoles_salida TIME,
    jueves_entrada TIME,
    jueves_salida TIME,
    viernes_entrada TIME,
    viernes_salida TIME,
    sabado_entrada TIME,
    sabado_salida TIME,
    domingo_entrada TIME,
    domingo_salida TIME,

    lunes_habilitado BOOLEAN DEFAULT true,
    martes_habilitado BOOLEAN DEFAULT true,
    miercoles_habilitado BOOLEAN DEFAULT true,
    jueves_habilitado BOOLEAN DEFAULT true,
    viernes_habilitado BOOLEAN DEFAULT true,
    sabado_habilitado BOOLEAN DEFAULT true,
    domingo_habilitado BOOLEAN DEFAULT true,

    nocturno_lunes BOOLEAN DEFAULT false,
    nocturno_martes BOOLEAN DEFAULT false,
    nocturno_miercoles BOOLEAN DEFAULT false,
    nocturno_jueves BOOLEAN DEFAULT false,
    nocturno_viernes BOOLEAN DEFAULT false,
    nocturno_sabado BOOLEAN DEFAULT false,
    nocturno_domingo BOOLEAN DEFAULT false,

    tolerancia_atraso INT DEFAULT 5,
    tolerancia_falta INT DEFAULT 60,
    salida_adelantada INT DEFAULT 0,
    puntualidad INT DEFAULT 60,
    max_extra INT DEFAULT 180,
    prioridad VARCHAR(10) DEFAULT 'Normal',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS turnos_asignados (
    id SERIAL PRIMARY KEY,
    personal_id INT REFERENCES personal(id) ON DELETE CASCADE,
    turno_plantilla_id INT REFERENCES turnos_plantilla(id),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_turnos_asignados_personal ON turnos_asignados(personal_id);
CREATE INDEX IF NOT EXISTS idx_turnos_asignados_fecha ON turnos_asignados(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_turnos_asignados_personal_fecha ON turnos_asignados(personal_id, fecha_inicio);

-- ============================================================
-- 2. TABLAS DE REFINAMIENTO DE ASISTENCIA
-- ============================================================

CREATE TABLE IF NOT EXISTS cat_motivos_justificacion (
    id SERIAL PRIMARY KEY,
    detalle VARCHAR(100) NOT NULL
);

INSERT INTO cat_motivos_justificacion (detalle) VALUES
    ('Permiso General'),
    ('Licencia Médica'),
    ('Enfermedad'),
    ('Particular'),
    ('Comisión'),
    ('Capacitación'),
    ('Declaración jurada')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS justificaciones (
    id SERIAL PRIMARY KEY,
    personal_id INT REFERENCES personal(id),
    fecha DATE NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('ENTRADA', 'SALIDA', 'AMBOS', 'FALTA', 'ATRASO')),
    hora_justificada TIME,
    motivo_id INT REFERENCES cat_motivos_justificacion(id),
    motivo_detalle TEXT,
    justificante VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_justificaciones_personal_fecha ON justificaciones(personal_id, fecha);

CREATE TABLE IF NOT EXISTS sanciones_atrasos (
    id SERIAL PRIMARY KEY,
    rango_inicial INT NOT NULL,
    rango_final INT NOT NULL,
    sancion_desc VARCHAR(250) NOT NULL,
    factor DECIMAL(5,2) DEFAULT 0
);

INSERT INTO sanciones_atrasos (rango_inicial, rango_final, sancion_desc, factor) VALUES
    (31, 60, '2 horas de haber', 0.25),
    (61, 90, 'Medio día de haber', 0.50),
    (91, 120, 'Un día de haber', 1.00),
    (121, 150, 'Dos días de haber', 2.00),
    (151, 10000, 'Dos días de haber', 2.00);

CREATE TABLE IF NOT EXISTS sanciones_faltas (
    id SERIAL PRIMARY KEY,
    rango_inicial INT NOT NULL,
    rango_final INT NOT NULL,
    sancion_desc VARCHAR(250) NOT NULL,
    factor DECIMAL(5,2) DEFAULT 0
);

INSERT INTO sanciones_faltas (rango_inicial, rango_final, sancion_desc, factor) VALUES
    (1, 1, '2 días de haber', 2.00),
    (2, 2, '4 días de haber', 4.00),
    (3, 3, '6 días de haber', 6.00),
    (4, 4, '8 días de haber', 8.00),
    (5, 5, '10 días de haber', 10.00),
    (6, 6, '12 días de haber', 12.00),
    (7, 7, '14 días de haber', 14.00),
    (8, 8, '16 días de haber', 16.00),
    (9, 9, '18 días de haber', 18.00),
    (10, 30, 'Despido', 30.00);

CREATE TABLE IF NOT EXISTS auditoria_asistencia (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    evento VARCHAR(50) NOT NULL,
    detalle TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_auditoria_asistencia_evento ON auditoria_asistencia(evento);
CREATE INDEX IF NOT EXISTS idx_auditoria_asistencia_fecha ON auditoria_asistencia(fecha);

-- ============================================================
-- 3. MODIFICACIONES A TABLAS EXISTENTES
-- ============================================================

-- Agregar columna estado a asistencia_diaria
-- 1=Normal, 2=Atraso, 3=Justificado, 4=Falta, 5=Nocturno,
-- 6=Sobretiempo, 7=SalidaAdelantada, 8=Incompleta, 9=SinMarcación
ALTER TABLE asistencia_diaria ADD COLUMN IF NOT EXISTS estado INT DEFAULT 1;
ALTER TABLE asistencia_diaria ADD COLUMN IF NOT EXISTS minutos_atraso INT DEFAULT 0;
ALTER TABLE asistencia_diaria ADD COLUMN IF NOT EXISTS justificacion_id INT REFERENCES justificaciones(id);
