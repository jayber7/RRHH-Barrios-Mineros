# Historial de Sesiones

## 27 Mayo 2026 — Importación Masiva ASIS y Cálculo de Asistencias

### Logros
- **Importación de marcaciones:** 108,989 transacciones biométricas desde `Transactions.csv` (Oct 2022 – May 2026) hacia `biometrico_logs_raw`
- **Importación de justificaciones:** 1,676 registros desde `justificacionesNuevas.csv` hacia `justificaciones`
- **Generación de registros mensuales/diarios:** 4,402 `asistencia_mensual` + 133,734 `asistencia_diaria` creados desde los logs biométricos
- **Cálculo de estados de asistencia:** Completado para 2024, 2025 y 2026 (Ene–May)

### Cambios en el código
- `backend/src/services/calculoAsistenciaService.js`: `procesarMes` ahora crea registros si no existen; `procesarTodos` filtrado por empleados con datos biométricos
- `sql/import_asis_attendance.py`: Script para importar Transactions.csv y justificacionesNuevas.csv
- `sql/generate_monthly_asistencia.sql`: Genera registros mensuales/diarios desde biometrico_logs_raw
- `backend/scripts/run_calculo_masivo.js`: Script para ejecutar cálculo por año

### Archivos de documentación actualizados
- `README.md`: Estado actual de BD, funcionalidades, migración ASIS
- `TODO.md`: Roadmap completo con fases y progreso
- `PROJECT_CONTEXT.md`: Contexto actualizado con estado por módulo
- `ARCHITECTURE.md`: Esquema de BD detallado, motor de cálculo, convenciones
- `DEPLOY.md`: Plan de migración a Render (nuevo)

### Pendiente
- Calcular 2022–2023 (ejecutar con `node backend/scripts/run_calculo_masivo.js 2022`)
- Vacaciones, Dashboard, Sanciones UI
- Migrar a Render
