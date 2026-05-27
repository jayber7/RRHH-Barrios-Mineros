# RRHH Barrios Mineros

Sistema de gestión de Recursos Humanos para el **Hospital de Segundo Nivel "Barrios Mineros"** de Oruro, Bolivia.

## Descripción

Aplicación web full-stack para modernizar y automatizar la gestión de empleados del hospital, abarcando personal **PLANTA** (ministerial + residentes) y **CONSULTOR**. Centraliza información migrada desde el legado ASIS (Access/CSV), planillas Excel, y proporciona dashboard estratégico, control de asistencia biométrico, gestión de turnos, justificaciones y bloqueos por atrasos.

## Stack Tecnológico

- **Backend:** Node.js + Express
- **Frontend:** React + Vite + Tailwind CSS v4
- **Base de datos:** PostgreSQL (vía socket local, con plan de migración a Render)
- **Biométrico:** Integración con dispositivos ZKTeco (protocolo TCP/UDP via `node-zklib`)
- **ETL:** Python (importación de legado ASIS desde CSV/Excel)
- **Gráficos:** Recharts

## Requisitos

- Node.js 18+
- PostgreSQL 14+
- Python 3.8+ (solo para scripts ETL)

## Instalación

### Backend

```bash
cd backend
cp .env.example .env   # editar credenciales de base de datos
npm install
npm run seed           # poblar base de datos con datos iniciales
npm run dev            # iniciar servidor (puerto 3001)
```

### Frontend

```bash
cd frontend
npm install
npm run dev            # iniciar servidor de desarrollo (puerto 5173)
```

### Scripts Python (ETL)

```bash
pip install -r requirements.txt
python sql/import_asis_attendance.py --all   # importar marcaciones y justificaciones
```

## Estructura del Proyecto

```
├── backend/              # API REST (Express)
│   ├── src/
│   │   ├── controllers/  # Manejo de peticiones HTTP
│   │   ├── routes/       # Definición de endpoints
│   │   ├── services/     # Lógica de negocio
│   │   └── config/       # Conexión a DB y variables de entorno
│   └── scripts/          # Scripts de cálculo masivo
├── frontend/             # Aplicación React (Vite)
│   └── src/
│       ├── components/   # Componentes reutilizables
│       └── pages/        # Vistas principales
├── sql/                  # Migraciones y scripts SQL
│   ├── init.sql          # Esquema base
│   ├── migration_turnos_asistencia.sql
│   ├── migrate_entregado_asis.sql
│   ├── import_transactions.sql
│   └── import_asis_attendance.py
├── Statefolder/          # Archivos fuente ASIS/Excel (ignorado por git)
└── *.md                  # Documentación del proyecto
```

## Funcionalidades

- **Gestión de Personal:** CRUD completo con filtros, exportación, vinculos laborales
- **Control de Asistencia:** Importación desde Excel, cálculo automático de estados (Normal, Atraso, Incompleta, Sin Marcación, etc.) basado en marcaciones biométricas vs turno asignado + tolerancias
- **Turnos y Horarios:** Plantillas de turno multisemana, asignación masiva por período, clonación entre gestiones, calendario visual
- **Dashboard Estratégico:** KPIs, gráficos de atrasos por servicio/unidad
- **Biométrico:** Sincronización con ZKTeco, captura de marcaciones en tiempo real
- **Bloqueos y Sanciones:** Cálculo de sanciones por atrasos recurrentes
- **Justificaciones:** Registro de permisos, licencias médicas, comisiones
- **Autenticación:** JWT con seed inicial (admin/admin)

## Base de Datos — Estado Actual

| Esquema | Tablas principales | Registros |
|---------|-------------------|-----------|
| Personal | `personal`, `vinculos_laborales`, `contratos`, `cat_unidades_servicio` | 267 empleados |
| Asistencia | `asistencia_mensual`, `asistencia_diaria`, `justificaciones`, `auditoria_asistencia` | ~4,400 mensuales + ~134K diarios |
| Turnos | `turnos_plantilla`, `turnos_asignados` | 87 plantillas, 23,851 asignaciones |
| Biométrico | `biometrico_logs_raw`, `biometrico_config` | 108,989 marcaciones |
| Catálogos | `cat_motivos_justificacion`, `cat_unidades_servicio`, `sanciones_atrasos`, `sanciones_faltas` | — |

## Migración desde ASIS (Legado)

Datos migrados desde el sistema ASIS (Microsoft Access `FTecSys.mdb`):

- ✅ **114 empleados** con `biometrico_id` desde `FTUserInfo.TU_sID`
- ✅ **87 plantillas** de turno desde `horariosBuenos.csv`
- ✅ **23,851 asignaciones** de turno desde `horariosAsignados.csv` (2023–2026)
- ✅ **108,989 marcaciones** desde `Transactions.csv` (Oct 2022 – May 2026)
- ✅ **1,676 justificaciones** desde `justificacionesNuevas.csv`
- ✅ **17 registros CONSULTOR** desde `ENTREGADO CARPETAS.xlsx`
- ✅ Estados de asistencia calculados para 2024–2026 basados en turno + marcaciones + tolerancias
