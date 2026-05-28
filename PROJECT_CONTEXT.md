# Contexto del Proyecto: RRHH Barrios Mineros

**Propósito:** Modernización y automatización de la gestión de Recursos Humanos para el Hospital de Segundo Nivel "Barrios Mineros" en Oruro, Bolivia.

**Objetivos Clave:**
- Centralizar la información de los 267 empleados (PLANTA: ministeriales + residentes, CONSULTOR).
- Automatizar la ingesta de datos desde el legado ASIS (Access) y libros Excel.
- Control de asistencia preciso basado en marcaciones biométricas ZKTeco + turnos + tolerancias.
- Proporcionar dashboard estratégico para la toma de decisiones gerenciales.

**Estado Actual (Mayo 2026):**

| Componente | Estado | Notas |
|-----------|--------|-------|
| Personal | ✅ Completo | 267 registros, 114 con biometrico_id |
| Vínculos Laborales | ✅ Completo | Cargos, unidades, servicios |
| Turnos | ✅ Completo | 87 plantillas, 23,851 asignaciones (2023-2026) |
| Asistencia | ✅ Completo | 2024-2026 calculados + motor nocturno |
| Marcaciones | ✅ Completo | 108,989 logs biométricos importados + sync ZKTeco |
| Justificaciones | ✅ Completo | 1,676 registros importados desde ASIS |
| Sanciones | ✅ Completo | Configuración + UI + multas en reportes |
| Dashboard | ✅ Completo | KPIs, gráficos, detalle diario |
| Reportes Excel | ✅ Completo | 4 reportes: mensual, planilla, atrasos, sanciones |
| Validaciones | ✅ Completo | 5 reglas + importación manual |
| Vacaciones | ✅ Completo | Tabla, CRUD, saldo, aprobación |
| Permisos/Licencias | ✅ Completo | 2,909 reg. importados ASIS, CRUD, aprobación |
| Certificados | ✅ Completo | 4 tipos, PDF automático, numeración secuencial |
| Notificaciones | ✅ Completo | Badge, dropdown, página, eventos automáticos |

**Alcance del Sistema:**
- Gestión de Personal y Vínculos Laborales (CRUD)
- Control de Asistencia Mensual con cálculo automático de estados
- Gestión de Turnos con plantillas multisede y clonación anual
- Seguimiento de Vacaciones con saldo y aprobación
- Bloqueos y Sanciones por Atrasos
- Dashboard Estratégico con KPIs y detalle diario
- Reportes Excel exportables (estilo ASIS)
- Validación automática de marcaciones biométricas
- Sincronización con equipos ZKTeco

**Datos Migrados desde ASIS (Legado):**
- Sistema original: FTecSys.mdb (Microsoft Access, 54 MB, 35 tablas)
- Exportado a CSV en `Statefolder/Asis/export/csv/`
- Importado a PostgreSQL via scripts Python + SQL
- Reconciliación contra DB existente + ENTREGADO CARPETAS.xlsx
