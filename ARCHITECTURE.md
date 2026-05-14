# Arquitectura del Sistema

## Stack Tecnológico
- **Backend:** Node.js + Express (Arquitectura por capas).
- **Frontend:** React + Vite + Tailwind CSS v4.
- **Base de Datos:** PostgreSQL (Relacional, normalizada).
- **Integraciones:** Notion API (REST), XLSX (Procesamiento), ZKTeco (Protocolo TCP/UDP via node-zklib).
- **Gráficos:** Recharts.

## Estructura del Proyecto
### Backend (`/backend/src`)
- `/controllers`: Lógica de manejo de peticiones (ej. `asistenciaController.js`, `biometricoController.js`).
- `/models`: Definición de consultas y operaciones de datos.
- `/routes`: Definición de endpoints API.
- `/services`: Lógica de negocio pesada (ej. `biometricoService.js` para socket TCP con equipo).
- `/config`: Configuración de DB y variables de entorno.

### Frontend (`/frontend/src`)
- `/pages`: Vistas principales (Dashboard, Asistencias, Personal).
- `/components`: Elementos reutilizables (Formularios, Modales de resultados).

## Convenciones de Desarrollo
- **Detección Dinámica:** Los servicios de importación deben buscar encabezados por palabras clave (ej. "C.I.", "PATERNO") en las primeras 20 filas para tolerar cambios en los Excel de origen.
- **Upsert:** Las importaciones masivas deben usar lógica de "Insertar o Actualizar" (ON CONFLICT en Postgres) para evitar duplicados.
- **UI Moderna:** Uso estricto de Tailwind CSS v4 y Lucide-React para iconos.
- **Normalización de CI:** Siempre limpiar C.I. de caracteres especiales o decimales antes de procesar.
