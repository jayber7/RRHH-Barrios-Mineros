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

## Fase 2: Módulos de Operación Diaria — EN PROGRESS
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
- [ ] **Gestión de Vacaciones:**
    - [ ] Cálculo automático de días ganados por antigüedad
    - [ ] Formulario de solicitud y aprobación
- [ ] **Permisos y Bajas:**
    - [ ] Registro de bajas médicas y permisos particulares
    - [ ] Impacto automático en el consolidado de asistencia
- [ ] **Dashboard de Asistencia:**
    - [ ] Gráficos de tendencias mensuales
    - [ ] Reporte de empleados con mayor atraso
    - [ ] Filtros por unidad/servicio

## Fase 3: Infraestructura y Despliegue
- [ ] **Migración a Render:**
    - [ ] Dump de BD local → importar en Render PostgreSQL
    - [ ] Configurar backend como Web Service
    - [ ] Configurar frontend como Static Site
    - [ ] Variables de entorno y secrets
    - [ ] Pruebas de conexión y funcionalidad
- [ ] **CI/CD:** Pipeline básico con GitHub Actions

## Fase 4: Documentación y Salidas
- [ ] **Certificaciones y Memorándums:** Generación automática de PDFs
- [ ] **Módulo de Reemplazos:** Gestión de personal externo para cubrir acefalías temporales
