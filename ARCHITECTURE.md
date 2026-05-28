# Arquitectura del Sistema

## Stack Tecnológico
- **Backend:** Node.js + Express (Arquitectura por capas: Routes → Controllers → Services → DB)
- **Frontend:** React + Vite + Tailwind CSS v4 + Recharts + Lucide-React
- **Base de Datos:** PostgreSQL (Relacional, normalizada)
- **Integraciones:** ZKTeco (TCP/UDP via `node-zklib`), XLSX (procesamiento Excel)
- **Autenticación:** JWT (jsonwebtoken + bcrypt)

## Estructura del Proyecto

### Backend (`/backend/src/`)
```
src/
├── config/
│   └── db.js                  # Pool de conexiones PostgreSQL (socket local)
├── controllers/               # Manejo de peticiones HTTP
│   ├── asistenciaController.js
│   ├── authController.js
│   ├── biometricoController.js # + import-logs, validaciones, recalcular
│   ├── dashboardController.js
│   ├── personalController.js
│   ├── sancionesController.js
│   ├── turnosController.js
│   ├── justificacionesController.js
│   ├── reporteController.js
│   ├── vacacionesController.js
│   └── ...
├── routes/                    # Definición de endpoints REST
│   ├── vacacionesRoutes.js
│   └── ...
├── services/                  # Lógica de negocio
│   ├── calculoAsistenciaService.js  # Motor de cálculo de estados
│   ├── biometricoService.js          # Comunicación ZKTeco
│   ├── validacionesService.js        # 5 reglas de validación
│   ├── vacacionesService.js           # CRUD + saldo vacaciones
│   ├── dashboardService.js
│   ├── reporteAsistenciaService.js
│   ├── turnosService.js
│   ├── justificacionesService.js
│   ├── sancionesService.js
│   └── ...
├── cron/                      # Tareas programadas
│   ├── estadoJob.js           # Diario 01:00 — baja contratos vencidos
│   └── calculoDiarioJob.js    # Diario 06:00 — recalcula día anterior
└── middlewares/
    └── auth.js                # Verificación JWT
```

### Frontend (`/frontend/src/`)
```
src/
├── pages/                     # Vistas principales
│   ├── Dashboard.jsx
│   ├── PersonalPage.jsx
│   ├── AsistenciasPage.jsx
│   ├── TurnosPage.jsx
│   ├── BiometricoPage.jsx     # 4 tabs: Dispositivo, Importar, Validaciones, Marcaciones
│   ├── VacacionesPage.jsx     # Solicitud, aprobación, saldo
│   ├── ReportesPage.jsx
│   ├── CorrespondenciaPage.jsx / CorrespondenciaForm.jsx / CorrespondenciaDetail.jsx
│   ├── BandejaPage.jsx
│   ├── ConfiguracionPage.jsx
│   └── LoginPage.jsx
├── components/                # Componentes reutilizables
│   ├── Sidebar.jsx
│   ├── ProtectedRoute.jsx
│   ├── JustificacionModal.jsx
│   ├── SancionesConfig.jsx
│   ├── TurnoCalendario.jsx / TurnoAsignacionForm.jsx / TurnoPlantillaForm.jsx
│   ├── PersonalForm.jsx / ImportResultsModal.jsx / HistorialModal.jsx
│   ├── AsistenciaImport.jsx / ColumnSelector.jsx
│   └── ...
├── config/
│   └── api.js                 # URL base de la API
└── App.jsx                    # Router principal
```

## Base de Datos — Esquemas

### Módulo Personal
- `personal` (id, ci, nombres, apellidos, biometrico_id, tipo_personal, activo)
- `vinculos_laborales` (personal_id, unidad_servicio, cargo_actual, tipo_contrato, ...)
- `contratos` (personal_id, fecha_inicio, fecha_fin, haber_basico, ...)
- `cat_unidades_servicio`, `cat_profesiones`, `cat_expediciones`

### Módulo Asistencia
- `asistencia_mensual` (personal_id, mes, anio, tipo_planilla, total_horas, total_atrasos_min)
- `asistencia_diaria` (asistencia_id, dia, valor, estado [1-9], minutos_atraso, justificacion_id)
- `justificaciones` (personal_id, fecha, tipo, hora_justificada, motivo_id)
- `cat_motivos_justificacion` (7 tipos: Permiso General, Licencia Médica, etc.)
- `auditoria_asistencia`

### Módulo Turnos
- `turnos_plantilla` (codigo, nombre, entrada/salida por día, tolerancias, nocturno, prioridad)
- `turnos_asignados` (personal_id, turno_plantilla_id, fecha_inicio, fecha_fin)

### Módulo Biométrico
- `biometrico_config` (ip, puerto, comms_key, último sync)
- `biometrico_logs_raw` (biometrico_id, timestamp, tipo_verificación, estado_asistencia)

### Módulo Vacaciones
- `vacaciones` (personal_id, fecha_inicio, fecha_fin, dias_solicitados, saldo_anterior, saldo_posterior, estado [PENDIENTE/APROBADO/RECHAZADO/GOZADO/ANULADO], aprobado_por, observaciones)

### Módulo Certificados
- `certificados` (personal_id, tipo [TRABAJO/INGRESOS/ANTIGUEDAD/ASISTENCIA], nro_cite, fecha_emision, contenido JSONB, archivo_pdf, estado [GENERADO/ENTREGADO/ANULADO])
- Generación automática de PDF con pdf-lib, numeración secuencial CERT-2026-XXXX

### Módulo Permisos / Licencias
- `cat_tipos_permisos` (21 tipos: VACACION, BAJA_MEDICA, COMISION, FERIADO, TOLERANCIA, etc.)
- `permisos_laborales` (personal_id, tipo, fecha_inicio, fecha_fin, dias, motivo, descripcion_original, estado [PENDIENTE/APROBADO/RECHAZADO/FINALIZADO], origen [ASIS/MANUAL], aprobado_por)
  - 2,909 registros importados desde ASIS (TablaVacaciones.csv)
  - Unique: (personal_id, fecha_inicio, fecha_fin, tipo)

### Sanciones
- `sanciones_atrasos` (rangos de minutos, sanción en días, factor)
- `sanciones_faltas` (rangos de faltas, sanción, factor)

### Módulo Notificaciones
- `notificaciones` (usuario_id, personal_id, titulo, mensaje, tipo [INFO/SUCCESS/WARNING/ALERT], link, leido)
- Badge en sidebar con polling cada 30s
- Eventos automáticos desde cambios de estado en vacaciones y permisos

### Autenticación
- `usuarios` (personal_id, username, password_hash, roles via `usuario_roles` + `roles`)
- `permisos` (RBAC, NO confundir con permisos laborales)

## Motor de Cálculo de Asistencia

El flujo de cálculo de estados diarios:

1. Para cada empleado + fecha, se obtiene el **turno asignado** (`turnos_asignados` JOIN `turnos_plantilla`)
2. Se determina el día de la semana y se obtienen **entrada/salida programada** y **tolerancias**
3. Se consultan las **marcaciones biométricas** (`biometrico_logs_raw`) para esa fecha
4. Se comparan los tiempos reales vs programados:

| Estado | Código | Condición |
|--------|--------|-----------|
| Normal | 1 | Llegó dentro de tolerancia y salió a tiempo |
| Atraso | 2 | Llegó después de la tolerancia |
| Nocturno | 5 | Turno nocturno (entrada ≥ salida) |
| Salida Adelantada | 7 | Salió antes de lo programado |
| Incompleta | 8 | Solo 1 marcación en el día |
| Sin Marcación | 9 | No tiene marcaciones ese día |

5. Se usa ventana **36h** para turnos nocturnos (12:00→siguiente 12:00)
6. Se actualiza `asistencia_diaria.estado` y `minutos_atraso`
7. Se actualiza `asistencia_mensual.total_atrasos_min`

## Convenciones de Desarrollo
- **Detección Dinámica:** Los servicios de importación deben buscar encabezados por palabras clave en las primeras 20 filas.
- **Upsert:** Las importaciones masivas usan `ON CONFLICT ... DO NOTHING/UPDATE`.
- **UI Moderna:** Tailwind CSS v4 + Lucide-React para iconos.
- **Normalización de CI:** Limpiar C.I. de caracteres especiales o decimales.
- **Paginación:** Endpoints con datos grandes (>10K filas) deben implementar paginación con `?page=&limit=`.
