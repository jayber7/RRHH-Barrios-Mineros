## Why

Se necesita un reporte de atrasos por empleado que contemple el tipo de contrato. La regla de negocio actual usa una tolerancia única (`tolerancia_atraso_default = 5` min), pero la institución requiere tolerancias **distintas por tipo de contrato** (ej. ÍTEM perdona 8 min). El reporte debe recalcular los minutos de retraso con la tolerancia del tipo de contrato del empleado y mostrar los días con retraso para fundamentar sanciones.

## What Changes

1. **Configuración**: nueva clave `tolerancia_atraso_por_tipo_contrato` (tipo `json`) en `configuracion_sistema`, editable en el panel Configuración → Asistencia. Mapea nombre de tipo de contrato → minutos de tolerancia. Ej.: `{"ITEM": 8, "CONTRATO": 5, "CONSULTORIA": 0, "RESIDENTE": 5}`. Fallback: si un tipo no está en el mapa, usar `tolerancia_atraso_default`.
2. **Backend**: nuevo `ReporteContratoService.generarPDF({ ids, desde, hasta })` que, por empleado, obtiene su tipo de contrato (`vinculos_laborales` + `cat_tipos_personal`), resuelve la tolerancia, y por cada día del rango recalcula los minutos de retraso usando el turno del día y los logs biométricos (misma lógica de `calcularEstadoDiario` pero con la tolerancia del tipo). **No escribe en la DB**. Salida PDF (pdfMake, mismo formato de cabecera/estilo que `ReporteEventosService`).
3. **Ruta**: `POST /api/reportes/asistencia/contrato` con body `{ ids, desde, hasta }`, reusa el patrón de `/reportes/eventos`.
4. **Frontend**: en `BiometricoPage` → `AttendanceTab`, un botón "Exportar Reporte por Tipo de Contrato" junto al de Eventos que usa los `selectedIds` + rango.

## Capabilities

### New Capabilities
- `reporte-atrasos-tipo-contrato`: reporte PDF de atrasos por empleado según tolerancia de su tipo de contrato

### Modified Capabilities

## Impact

- `backend/src/services/calculoAsistenciaService.js` o un helper compartido — lógica de recalcular atraso con tolerancia parametrizada
- `backend/src/services/reporteContratoService.js` (nuevo)
- `backend/src/controllers/reporteController.js` — handler `generarReporteContrato`
- `backend/src/routes/reporteRoutes.js` — `POST /asistencia/contrato`
- `frontend/src/pages/BiometricoPage.jsx` — botón de exportación en AttendanceTab
- `frontend/src/pages/ConfiguracionPage.jsx` — edición de la config JSON de tolerancias
- Tabla `configuracion_sistema` — clave nueva (insert)
