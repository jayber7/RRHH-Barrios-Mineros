# Hoja de Ruta (Roadmap)

## Fase 1: Migración desde ASIS — COMPLETADA ✅
- [x] **Extracción de ASIS (Access → CSV):** 35 tablas exportadas desde FTecSys.mdb
- [x] **Reconciliación de Personal:**
    - [x] Cruce de 3 fuentes: ASIS (114), DB (243), ENTREGADO CARPETAS (95)
    - [x] Inserción de 17 CONSULTOR + 7 PLANTA faltantes, corrección de 4 CI
- [x] **Importación de Turnos:**
    - [x] 87 plantillas desde `horariosBuenos.csv`
    - [x] 23,851 asignaciones desde `horariosAsignados.csv` (2023–2026)
- [x] **Importación de Marcaciones Biométricas:**
    - [x] 108,989 transacciones desde `Transactions.csv` (Oct 2022 – May 2026)
- [x] **Importación de Justificaciones:**
    - [x] 1,676 registros desde `justificacionesNuevas.csv`
- [x] **Cálculo de Asistencias:**
    - [x] Generación de registros mensuales y diarios
    - [x] Cálculo de estados (Normal, Atraso, Incompleta, Sin Marcación, etc.) basado en turno + marcaciones + tolerancias
    - [x] Años calculados: 2024, 2025, 2026 (Ene–May)

## Fase 2: Módulos de Operación Diaria — COMPLETADA ✅
- [x] **Módulo Biométrico (Captura Cruda):**
    - [x] Instalación de `node-zklib`
    - [x] Tablas `biometrico_config` y `biometrico_logs_raw`
    - [x] `BiometricoService` para descarga de marcaciones
    - [x] UI para configuración y monitoreo de logs
- [x] **Módulo de Turnos:**
    - [x] Tabla `turnos_plantilla` con horarios multisede
    - [x] Tabla `turnos_asignados` con período de vigencia
    - [x] CRUD completo + calendario visual
    - [x] Paginación + filtro por año
    - [x] Clonación de asignaciones entre gestiones
- [x] **Dashboard de Asistencia:**
    - [x] KPIs avanzados (distribución de estados, nocturnos, tendencia mensual)
    - [x] Gráficos (donut, barras, área)
    - [x] Ranking de atrasos interactivo
    - [x] Detalle diario con logs biométricos
- [x] **Reportes Excel:**
    - [x] Reporte mensual estilo ASIS (106 hojas)
    - [x] Planilla consolidada (31 columnas diarias)
    - [x] Ranking de atrasos
    - [x] Sanciones con multas
- [x] **Validación de Marcaciones:**
    - [x] Importación manual JSON/CSV con deduplicación
    - [x] 5 reglas de validación: sin personal, duplicadas, fuera de horario, sin marcación, 3+ marcas

## Fase 3: Gestión de Personal — EN PROGRESS
- [x] **Gestión de Vacaciones:**
    - [x] Tabla `vacaciones` con estados (PENDIENTE, APROBADO, RECHAZADO, GOZADO, ANULADO)
    - [x] CRUD completo con control de saldo (15 días anuales)
    - [x] API REST con filtros por estado/empleado/fechas
    - [x] Frontend con tabla, formulario, cards de resumen
- [x] **Permisos y Licencias:**
    - [x] Tabla `permisos_laborales` con tipos (VACACION, BAJA_MEDICA, COMISION, PERMISO, etc.)
    - [x] Catálogo `cat_tipos_permisos` con 21 tipos
    - [x] Importación de 2,909 registros desde ASIS (TablaVacaciones.csv)
    - [x] CRUD completo con aprobación/rechazo/finalización
    - [x] API REST con filtros por tipo/estado/fechas
    - [x] Frontend con cards de resumen, stats por tipo, tabla y formulario
- [x] **Certificaciones:**
    - [x] Tabla `certificados` con estados (GENERADO, ENTREGADO, ANULADO)
    - [x] Generación de PDFs con pdf-lib (Trabajo, Ingresos, Antigüedad, Asistencia)
    - [x] Numeración automática tipo CERT-2026-XXXX
    - [x] API REST con descarga directa de PDF
    - [x] Frontend con cards, tabla y generación con descarga automática
- [x] **Notificaciones:**
    - [x] Tabla `notificaciones` con 4 tipos (INFO, SUCCESS, WARNING, ALERT)
    - [x] API REST con listar, contar, marcar leída, marcar todas, eliminar
    - [x] Badge en sidebar con contador de no leídas + dropdown de últimas 5
    - [x] Página dedicada con resumen y lista completa
    - [x] Eventos automáticos desde vacaciones (cambio estado) y permisos (cambio estado)

## Fase 4: Infraestructura y Despliegue
- [ ] **Migración a Render:**
    - [ ] Dump de BD local → importar en Render PostgreSQL
    - [ ] Configurar backend como Web Service
    - [ ] Configurar frontend como Static Site
    - [ ] Variables de entorno y secrets
    - [ ] Pruebas de conexión y funcionalidad
- [ ] **CI/CD:** Pipeline básico con GitHub Actions

## Fase 5: Documentación y Salidas
- [ ] **Comunicados/Memorándums:** Integración con correspondencia
- [ ] **Módulo de Reemplazos:** Gestión de personal externo para cubrir acefalías temporales
