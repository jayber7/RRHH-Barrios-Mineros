# Resumen de Sesión — 27 Mayo 2026

## Objetivo
Importar asistencias desde el legado ASIS a la base de datos PostgreSQL, especialmente 2026.

## Resultados

### Datos importados
| Concepto | Cantidad | Período |
|----------|----------|---------|
| Marcaciones biométricas | 108,989 | Oct 2022 – May 2026 |
| Justificaciones | 1,676 | Principalmente 2025 |
| Registros mensuales | 4,402 | 45 meses |
| Registros diarios | 133,734 | 45 meses |

### Cálculo de asistencias completado
| Año | Meses | Empleados/mes | Días calculados |
|-----|-------|---------------|-----------------|
| 2024 | 12 | ~100 | 36,872 |
| 2025 | 12 | ~103 | 37,300 |
| 2026 | 5 (Ene–May) | ~105 | 15,609 |

## Archivos modificados/creados

### Código
- `backend/src/services/calculoAsistenciaService.js` — `procesarMes` crea registros si no existen; `procesarTodos` filtrado
- `sql/import_asis_attendance.py` — Script para importar Transactions.csv y justificacionesNuevas.csv
- `sql/generate_monthly_asistencia.sql` — Genera registros mensuales/diarios
- `backend/scripts/run_calculo_masivo.js` — Script de cálculo por año

### Documentación
- `README.md` — Actualizado con estado actual de BD, funcionalidades
- `TODO.md` — Roadmap completo con fases
- `PROJECT_CONTEXT.md` — Estado por módulo
- `ARCHITECTURE.md` — Esquema de BD detallado, motor de cálculo
- `DEPLOY.md` — Nuevo: plan de migración a Render
- `GEMINI.md` — Historial de sesión actualizado
- `SESSION_SUMMARY.md` — Este archivo
