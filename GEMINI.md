# Historial de Sesiones

## 27 Mayo 2026 — Importación Masiva ASIS y Cálculo de Asistencias

### Logros
- **Importación de marcaciones:** 108,989 transacciones biométricas desde `Transactions.csv` (Oct 2022 – May 2026)
- **Importación de justificaciones:** 1,676 registros desde `justificacionesNuevas.csv`
- **Generación de registros mensuales/diarios:** 4,402 `asistencia_mensual` + 133,734 `asistencia_diaria`
- **Cálculo de estados de asistencia:** 2024, 2025, 2026 (Ene–May)

### Cambios en el código
- `calculoAsistenciaService.js`: `procesarMes` crea registros si no existen; `procesarTodos` filtrado
- `sql/import_asis_attendance.py`, `sql/generate_monthly_asistencia.sql`
- `backend/scripts/run_calculo_masivo.js`

## 27 Mayo 2026 — Reportes Excel, Dashboard, Correcciones Nocturnas

### Logros
- **Corrección nocturna:** Ventana 36h para turnos nocturnos, estado=5. 229 días / 55 empleados detectados
- **Fase 1 - Reportes:** 4 reportes Excel (mensual, planilla, atrasos, sanciones) + endpoints + UI
- **Fase 2 - Dashboard:** KPIs, donut de estados, tendencia mensual, ranking atrasos, detalle diario
- **Reparación sanciones:** Consulta `contratos.haber_basico` en vez de `vl.haber`

### Archivos creados
- `reporteAsistenciaService.js`, `dashboardService.js`, `calculoDiarioJob.js`
- `Dashboard.jsx`, `ReportesPage.jsx`, `reporteRoutes.js`, `dashboardRoutes.js`

## 27 Mayo 2026 — Fase 3 (Validaciones) + Fase 4 (Vacaciones)

### Logros
- **Fase 3 - Validaciones:** 5 reglas (sin personal, duplicadas, fuera horario, sin marcación, 3+ marcas)
- **Fase 3 - Importación manual:** Endpoint JSON/CSV con deduplicación + recalcular post-import
- **Fase 3 - UI:** BiometricoPage rediseñado con 4 tabs
- **Fase 4 - Vacaciones:** Tabla, CRUD, saldo 15 días, aprobación/rechazo, frontend completo

### Archivos nuevos
- `backend/src/services/validacionesService.js`
- `backend/src/services/vacacionesService.js`
- `backend/src/controllers/vacacionesController.js`
- `backend/src/routes/vacacionesRoutes.js`
- `frontend/src/pages/VacacionesPage.jsx`

### Archivos modificados
- `backend/src/controllers/biometricoController.js` — +3 endpoints
- `backend/src/routes/biometricoRoutes.js` — +3 rutas
- `backend/src/index.js` — +vacacionesRoutes
- `frontend/src/App.jsx` — ruta real /vacaciones
- `frontend/src/pages/BiometricoPage.jsx` — rediseño completo

### Documentación
- `TODO.md`, `ARCHITECTURE.md`, `PROJECT_CONTEXT.md`, `SESSION_SUMMARY.md`, `GEMINI.md` actualizados

### Pendiente
- Permisos/Licencias, Certificados (PDF), Notificaciones

## Archivos de documentación actualizados
- `README.md`, `TODO.md`, `PROJECT_CONTEXT.md`, `ARCHITECTURE.md`, `DEPLOY.md`, `SESSION_SUMMARY.md`, `GEMINI.md`

### Pendiente
- Vacaciones, Dashboard, Sanciones UI, Certificados, Notificaciones
- Migrar a Render
