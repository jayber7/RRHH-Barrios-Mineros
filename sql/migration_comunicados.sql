-- Fase 6: Comunicados/Memorándums
-- Extiende el módulo de correspondencia existente

-- B1: Agregar tipo "Comunicado" al catálogo
INSERT INTO cat_tipos_correspondencia (codigo, nombre)
VALUES ('COM', 'Comunicado')
ON CONFLICT (codigo) DO NOTHING;

-- B3: Tabla de distribución para comunicados
CREATE TABLE IF NOT EXISTS comunicados_distribucion (
    id SERIAL PRIMARY KEY,
    comunicado_id INT REFERENCES correspondencia(id) ON DELETE CASCADE,
    personal_id INT REFERENCES personal(id) ON DELETE CASCADE,
    leido BOOLEAN DEFAULT false,
    fecha_lectura TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (comunicado_id, personal_id)
);

CREATE INDEX IF NOT EXISTS idx_comunicados_distribucion_comunicado ON comunicados_distribucion(comunicado_id);
CREATE INDEX IF NOT EXISTS idx_comunicados_distribucion_personal ON comunicados_distribucion(personal_id);
