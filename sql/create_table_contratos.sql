BEGIN;

CREATE TABLE IF NOT EXISTS contratos (
    id SERIAL PRIMARY KEY,
    personal_id INTEGER REFERENCES personal(id) ON DELETE CASCADE,
    ci VARCHAR(20),
    nombre_completo VARCHAR(255),
    nacionalidad VARCHAR(50),
    fecha_nacimiento DATE,
    sexo CHAR(1),
    cargo VARCHAR(255),
    nro_contrato VARCHAR(100),
    fecha_inicio DATE,
    fecha_fin DATE,
    nro_preventivo VARCHAR(50),
    cat_programatica VARCHAR(50),
    descripcion_actividad TEXT,
    dias_pagados NUMERIC(5,1),
    haber_basico NUMERIC(10,2),
    fuente VARCHAR(50) DEFAULT 'ENTREGADO_CARPETAS',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMIT;
