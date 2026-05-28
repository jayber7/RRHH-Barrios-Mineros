-- Fase 5: Configuración/Parametrización del Sistema
-- Tabla genérica clave-valor para parámetros configurables

CREATE TABLE IF NOT EXISTS configuracion_sistema (
    clave VARCHAR(50) PRIMARY KEY,
    valor TEXT NOT NULL,
    tipo VARCHAR(20) NOT NULL DEFAULT 'string',
    descripcion TEXT,
    categoria VARCHAR(30) NOT NULL DEFAULT 'general',
    editable BOOLEAN DEFAULT true,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Seed data: valores actuales del sistema como defaults
-- ============================================================

INSERT INTO configuracion_sistema (clave, valor, tipo, descripcion, categoria) VALUES

-- Asistencia: Tolerancias
('tolerancia_atraso_default', '5', 'integer', 'Tolerancia de atraso en minutos (default para turnos nuevos)', 'asistencia'),
('tolerancia_falta_default', '60', 'integer', 'Tolerancia para contar como falta en minutos', 'asistencia'),
('salida_adelantada_default', '0', 'integer', 'Salida adelantada permitida en minutos', 'asistencia'),
('puntualidad_default', '60', 'integer', 'Umbral de puntualidad en minutos', 'asistencia'),
('max_extra_default', '180', 'integer', 'Máximo de horas extra en minutos', 'asistencia'),

-- Asistencia: Ventanas de búsqueda
('ventana_busqueda_diurna_h', '6', 'integer', 'Horas antes del turno para buscar marcas diurnas', 'asistencia'),
('ventana_busqueda_nocturna_h', '12', 'integer', 'Horas antes del turno para buscar marcas nocturnas', 'asistencia'),
('ventana_detalle_diario_antes_h', '12', 'integer', 'Horas antes para ventana de detalle diario', 'asistencia'),
('ventana_detalle_diario_despues_h', '36', 'integer', 'Horas después para ventana de detalle diario', 'asistencia'),
('ventana_reporte_biometrico_h', '12', 'integer', 'Ventana de búsqueda biométrica en reportes', 'asistencia'),
('ventana_sin_marcacion_inicio_h', '6', 'integer', 'Hora de inicio ventana para detectar días sin marcación', 'asistencia'),
('ventana_sin_marcacion_fin_h', '30', 'integer', 'Hora de fin ventana para detectar días sin marcación', 'asistencia'),

-- Asistencia: Umbrales
('umbral_maximo_atraso_horas', '4', 'integer', 'Máximo de horas de atraso antes de ignorar marcación', 'asistencia'),
('umbral_fuera_horario_min', '120', 'integer', 'Minutos de diferencia para considerar marca fuera de horario', 'asistencia'),
('ventana_marcas_duplicadas_min', '5', 'integer', 'Ventana en minutos para detectar marcas duplicadas', 'asistencia'),
('duracion_turno_default_min', '480', 'integer', 'Duración default del turno en minutos (8h)', 'asistencia'),
('limite_ajuste_nocturno_min', '720', 'integer', 'Límite en minutos (12:00) para ajuste nocturno', 'asistencia'),

-- Asistencia: Generales
('dias_laborales_mes', '30', 'integer', 'Divisor para cálculo de salario diario', 'asistencia'),
('dashboard_mes_default', '4', 'integer', 'Mes por defecto en el dashboard', 'general'),
('dashboard_anio_default', '2026', 'integer', 'Año por defecto en el dashboard', 'general'),

-- Permisos
('origen_permiso_default', 'MANUAL', 'string', 'Origen por defecto para permisos nuevos', 'permisos'),
('estados_permiso_validos', '["APROBADO","RECHAZADO","FINALIZADO"]', 'json', 'Estados válidos para permisos laborales', 'permisos'),

-- Cron
('cron_calculo_diario_horario', '0 6 * * *', 'string', 'Horario cron para cálculo diario de asistencia', 'general'),
('cron_estado_horario', '0 1 * * *', 'string', 'Horario cron para actualización de estado contratos', 'general')

ON CONFLICT (clave) DO NOTHING;

-- ============================================================
-- Extender cat_tipos_permisos con columnas de Fase 5
-- ============================================================
ALTER TABLE cat_tipos_permisos ADD COLUMN IF NOT EXISTS descripcion TEXT DEFAULT '';
ALTER TABLE cat_tipos_permisos ADD COLUMN IF NOT EXISTS requiere_documento BOOLEAN DEFAULT false;
ALTER TABLE cat_tipos_permisos ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#6B7280';
ALTER TABLE cat_tipos_permisos ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;
