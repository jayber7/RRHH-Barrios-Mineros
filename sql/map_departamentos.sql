-- ============================================================
-- Mapear unidad_servicio (texto legacy) → cat_unidades_servicios
-- ============================================================
BEGIN;

-- 1. Agregar departamentos faltantes
INSERT INTO cat_unidades_servicios (nombre_unidad) VALUES
  ('Anestesiología'),
  ('Fisioterapia'),
  ('Hemodiálisis'),
  ('Portería')
ON CONFLICT (nombre_unidad) DO NOTHING;

-- 2. Actualizar FK con el mapeo
UPDATE vinculos_laborales vl SET unidad_servicio_id = cus.id
FROM cat_unidades_servicios cus
WHERE
  vl.unidad_servicio_id IS NULL
  AND vl.unidad_servicio IS NOT NULL
  AND vl.unidad_servicio != ''
  AND (
    (vl.unidad_servicio = 'SERVICIO DE MEDICINA INTERNA' AND cus.nombre_unidad = 'Medicina Interna')
    OR (vl.unidad_servicio = 'SERVICIO DE PEDIATRIA' AND cus.nombre_unidad = 'Pediatría')
    OR (vl.unidad_servicio = 'SERVICIO DE GINECOLOGIA' AND cus.nombre_unidad = 'Ginecología')
    OR (vl.unidad_servicio = 'SERVICIO DE CIRUGIA GENERAL' AND cus.nombre_unidad = 'Cirugía')
    OR (vl.unidad_servicio = 'SERVICIO DE TRAUMATOLOGIA' AND cus.nombre_unidad = 'Traumatología')
    OR (vl.unidad_servicio = 'SERVICIO DE NEONATOLOGIA' AND cus.nombre_unidad = 'Neonatología')
    OR (vl.unidad_servicio = 'SERVICIO DE EMERGENCIAS ' AND cus.nombre_unidad = 'Urgencias')
    OR (vl.unidad_servicio = 'SERVICIO DE COCINA' AND cus.nombre_unidad = 'Cocina')
    OR (vl.unidad_servicio = 'SERVICIO DE LAVANDERIA' AND cus.nombre_unidad = 'Lavandería')
    OR (vl.unidad_servicio = 'SERVICIO DE LIMPIEZA' AND cus.nombre_unidad = 'Limpieza')
    OR (vl.unidad_servicio = 'SERVICIO DE NUTRICION' AND cus.nombre_unidad = 'Nutrición')
    -- Mapeo a departamentos existentes
    OR (vl.unidad_servicio = 'AUXILIAR DE OFICINA' AND cus.nombre_unidad = 'Administración')
    OR (vl.unidad_servicio = 'SERVICIO DE ESTADISTICA' AND cus.nombre_unidad = 'Administración')
    OR (vl.unidad_servicio = 'SERVICIO DE SISTEMAS' AND cus.nombre_unidad = 'Administración')
    OR (vl.unidad_servicio = 'SERVICIO DE AMBULANCIA' AND cus.nombre_unidad = 'Urgencias')
    OR (vl.unidad_servicio = 'SERVICIO DE MATERNIDAD ' AND cus.nombre_unidad = 'Ginecología')
    OR (vl.unidad_servicio = 'SERVICIO DE QUIROFANO Y CENTRAL DE ESTERILIZACION' AND cus.nombre_unidad = 'Cirugía')
    OR (vl.unidad_servicio = 'SERVICIO DE TERAPIA INTERMEDIA' AND cus.nombre_unidad = 'Cuidados Intensivos')
    OR (vl.unidad_servicio = 'SERVICIO DE PLANCHADO' AND cus.nombre_unidad = 'Lavandería')
    OR (vl.unidad_servicio = 'SERVICIO DE ATENCION TEMPRANA' AND cus.nombre_unidad = 'Consulta Externa')
    OR (vl.unidad_servicio = 'SERVICIO UNIDAD DE HEMODIALISIS ' AND cus.nombre_unidad = 'Hemodiálisis')
    OR (vl.unidad_servicio = 'SERVICIO DE ANESTESIOLOGIA' AND cus.nombre_unidad = 'Anestesiología')
    OR (vl.unidad_servicio = 'SERVICIO DE FISIOTERAPIA' AND cus.nombre_unidad = 'Fisioterapia')
    OR (vl.unidad_servicio = 'SERVICIO DE PORTERIA' AND cus.nombre_unidad = 'Portería')
  );

COMMIT;
