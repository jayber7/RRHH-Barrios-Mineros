# RRHH Barrios Mineros

Sistema de gestión de Recursos Humanos para el **Hospital de Segundo Nivel "Barrios Mineros"** de Oruro, Bolivia.

## Descripción

Aplicación web full-stack para modernizar y automatizar la gestión de más de 240 empleados del hospital, abarcando personal ministerial, residentes y contratados. Centraliza información de planillas Excel, proporciona un dashboard estratégico y gestiona control de asistencia, turnos, vacaciones y licencias.

## Stack Tecnológico

- **Backend:** Node.js + Express
- **Frontend:** React + Vite + Tailwind CSS v4
- **Base de datos:** PostgreSQL
- **Biométrico:** Integración con dispositivos ZKTeco
- **ETL:** Python (extracción de datos desde Excel)

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
python extract_ministeriales_postgres.py
```

## Estructura del Proyecto

```
├── backend/          # API REST (Express)
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── models/
│   └── tests/
├── frontend/         # Aplicación React
│   └── src/
│       ├── components/
│       └── pages/
├── sql/              # Esquema de base de datos
├── Statefolder/      # Archivos Excel de entrada (ignorado por git)
├── *.py              # Scripts ETL en Python
└── *.js              # Scripts de utilidad
```

## Funcionalidades

- Gestión de personal (CRUD)
- Control de asistencia con importación desde Excel
- Dashboard estratégico con gráficos
- Integración con dispositivos biométricos ZKTeco
- Sincronización con Notion
- Programación de tareas nocturnas automáticas
