## Why

El recálculo masivo de asistencia (`POST /api/asistencia/calcular-todos`) tarda ~80 min para un mes (~258-267 empleados). Diagnóstico hecho: cada empleado genera ~96 queries secuenciales a Neon (31 días × [turno + logs + upsert diaria] + mensual + update), todas en serie (~50-100ms de latencia de red c/u), y el job procesa TODOS los empleados con logs, aunque solo ~59 tienen turno activo (los sin turno no producen horas → trabajo desperdiciado).

## What Changes

Optimizar el job de recálculo masivo en dos frentes independientes:

1. **Filtro por turno activo**: `procesarTodos` debe calcular solo empleados con turno asignado que cubra el mes (JOIN `turnos_asignados` con solapamiento de fechas), en vez de todos los que tienen `biometrico_logs_raw` en el rango. Reduce 258 → ~59 empleados.
2. **Paralelismo acotado**: procesar N empleados concurrentemente (p.ej. 6) con `Promise.all` sobre el pool de pg existente. Con el filtro + índice ya arreglado, el total baja de ~80 min a ~2-4 min.

El progreso del job (`asistencia_jobs`) se mantiene igual (procesados/total, estado, polling del frontend no cambia).

### Ya aplicado (fuera del scope de este change)
- Fix del índice: quitado el casteo `biometrico_id::text` en la query de logs (`calculoAsistenciaService.js`) → Index Scan, 92ms → 0.05ms.

## Capabilities

### New Capabilities

### Modified Capabilities
- `recalculo-masivo-asistencia`: filtro por turnos activos + procesamiento paralelo acotado

## Impact

- `backend/src/services/calculoAsistenciaService.js` — `procesarTodos` y helpers de concurrencia
- API sin cambios de contrato (mismo endpoint, mismo polling de estado)
- La tabla `asistencia_jobs` no cambia
