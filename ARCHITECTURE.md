# Arquitectura del Sistema

## Stack Tecnológico
- **Backend:** Node.js + Express (Arquitectura por capas: Routes → Controllers → Services → DB)
- **Frontend:** React + Vite + Tailwind CSS v4 + Recharts + Lucide-React
- **Base de Datos:** PostgreSQL (Relacional, normalizada)
- **Integraciones:** ZKTeco (TCP/UDP via `node-zklib`), XLSX (procesamiento Excel), Notion API (REST)
- **Autenticación:** JWT (jsonwebtoken + bcrypt)

## Estructura del Proyecto

### Backend (`/backend/src/`)
```
src/
├── config/
│   └── db.js              # Pool de conexiones PostgreSQL (socket local)
├── controllers/           # Manejo de peticiones HTTP
│   ├── asistenciaController.js
│   ├── authController.js
│   ├── biometricoController.js
│   ├── dashboardController.js
│   ├── personalController.js
│   ├── sancionesController.js
│   ├── turnosController.js
│   └── justificacionesController.js
├── routes/                # Definición de endpoints REST
│   ├── asistenciaRoutes.js
│   ├── authRoutes.js
│   ├── biometricoRoutes.js
│   ├── dashboardRoutes.js
│   ├── personalRoutes.js
│   ├── sancionesRoutes.js
│   ├── turnosRoutes.js
│   └── justificacionesRoutes.js
├── services/              # Lógica de negocio
│   ├── asistenciaService.js       # Importación Excel
│   ├── calculoAsistenciaService.js # Motor de cálculo de estados
│   ├── biometricoService.js        # Comunicación ZKTeco
│   ├── turnosService.js            # CRUD + paginación + clonación
│   ├── personalService.js
│   ├── sancionesService.js
│   └── justificacionesService.js
└── middlewares/
    └── auth.js             # Verificación JWT
```

### Frontend (`/frontend/src/`)
```
src/
├── pages/                 # Vistas principales
│   ├── Dashboard.jsx
│   ├── PersonalPage.jsx
│   ├── AsistenciasPage.jsx
│   ├── TurnosPage.jsx
│   ├── BiometricoPage.jsx
│   ├── JustificacionesPage.jsx
│   ├── LoginPage.jsx
│   └── RegisterPage.jsx
├── components/            # Componentes reutilizables
│   ├── Sidebar.jsx
│   ├── TurnoPlantillaForm.jsx
│   ├── TurnoAsignacionForm.jsx
│   ├── TurnoCalendario.jsx
│   ├── AsistenciaImport.jsx
│   ├── JustificacionModal.jsx
│   └── ImportResultsModal.jsx
├── config/
│   └── api.js             # URL base de la API
└── App.jsx                # Router principal
```

## Base de Datos — Esquemas

### Módulo Personal
- `personal` (id, ci, nombres, apellidos, biometrico_id, tipo_personal, activo)
- `vinculos_laborales` (personal_id, unidad_servicio, cargo_actual, tipo_contrato, ...)
- `contratos` (personal_id, fecha_inicio, fecha_fin, ...)
- `cat_unidades_servicio`, `cat_cargos`, `cat_profesiones`

### Módulo Asistencia
- `asistencia_mensual` (personal_id, mes, anio, tipo_planilla, total_horas, total_atrasos_min)
- `asistencia_diaria` (asistencia_id, dia, valor, estado [1-9], minutos_atraso, justificacion_id)
- `justificaciones` (personal_id, fecha, tipo, hora_justificada, motivo_id)
- `cat_motivos_justificacion`
- `auditoria_asistencia`

### Módulo Turnos
- `turnos_plantilla` (codigo, nombre, entrada/salida por día, tolerancias, nocturno, prioridad)
- `turnos_asignados` (personal_id, turno_plantilla_id, fecha_inicio, fecha_fin)
- `turnos_rotacion` (para personal residente con rotación)

### Módulo Biométrico
- `biometrico_config` (ip, puerto, último sync)
- `biometrico_logs_raw` (biometrico_id, timestamp, tipo_verificación, estado_asistencia)

### Sanciones
- `sanciones_atrasos` (rangos de minutos, sanción en días, factor)
- `sanciones_faltas` (rangos de faltas, sanción, factor)

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
| Salida Adelantada | 7 | Salió antes de lo programado |
| Incompleta | 8 | Solo 1 marcación en el día |
| Sin Marcación | 9 | No tiene marcaciones ese día |

5. Se actualiza `asistencia_diaria.estado` y `minutos_atraso`
6. Se actualiza `asistencia_mensual.total_atrasos_min`

## Migración a Render

### Base de Datos
```bash
# Exportar BD local
pg_dump -h /var/run/postgresql -U hitdev -d rrhh_barrios_mineros \
  --no-owner --no-acl -Fc > rrhh_dump.dump

# Importar en Render PostgreSQL
pg_restore -h <RENDER_HOST> -U <RENDER_USER> -d <RENDER_DB> \
  --no-owner --no-acl -Fc rrhh_dump.dump
```
Ver `DEPLOY.md` para instrucciones detalladas.

## Convenciones de Desarrollo
- **Detección Dinámica:** Los servicios de importación deben buscar encabezados por palabras clave en las primeras 20 filas.
- **Upsert:** Las importaciones masivas usan `ON CONFLICT ... DO NOTHING/UPDATE`.
- **UI Moderna:** Tailwind CSS v4 + Lucide-React para iconos.
- **Normalización de CI:** Limpiar C.I. de caracteres especiales o decimales.
- **Paginación:** Endpoints con datos grandes (>10K filas) deben implementar paginación con `?page=&limit=`.
