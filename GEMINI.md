# Proyecto: Sistema RRHH - Hospital Barrios Mineros (Oruro, Bolivia)

## Estado del Proyecto - 11 de Mayo, 2026

### 1. Arquitectura Implementada
- **Backend:** Node.js + Express (Arquitectura por capas: Modelos, Controladores, Rutas, Servicios).
- **Frontend:** React + Vite + Tailwind CSS v4.
- **Base de Datos:** PostgreSQL (Normalizada con tablas de catálogo).

### 2. Módulos Completados (Gestión de Personal y Vínculos)
- **Base de Datos:**
  - Tablas: `personal`, `vinculos_laborales`, `historial_movimientos`, `establecimientos` y catálogos completos.
  - Tabla `historial_movimientos` con soporte JSONB para trazabilidad de cambios.
  - Script de inicialización actualizado con fuentes (TGN, HIPC, MINISTERIO, MUNICIPIO).
- **Backend API:**
  - CRUD transaccional unificado para Personal y Vínculos Laborales.
  - Búsqueda Global Avanzada: Soporte multi-palabra para nombres/apellidos y filtro por Ítem.
  - Filtros dinámicos por múltiples fuentes de financiamiento.
  - Servicio de Exportación a Excel actualizado con 18 columnas (incluyendo datos laborales).
  - Endpoint de Historial de Movimientos por empleado.
- **Frontend UI:**
    - Formulario unificado de Personal y Vínculo Laboral con secciones estructuradas.
    - Grilla de personal con vista detallada de Cargo, Ítem y etiquetas de Fuente.
    - **Módulo de Trayectoria Laboral**: Visualización de movimientos en línea de tiempo con comparativa de cambios.

### 3. Credenciales de Base de Datos
- **DB Name:** `rrhh_barrios_mineros`
- **User:** `postgres`
- **Password:** `postgres`
- **Host:** `localhost`
- **Port:** `5432`

### 4. Pendientes
- [ ] Implementar el módulo de **Asistencias y Turnos**.
- [ ] Desarrollar la gestión de **Vacaciones y Permisos**.
- [ ] Implementar **Certificaciones y Memorándums**.
- [ ] Actualizar el servicio de **Importación de Excel** para soportar los nuevos campos de vínculos laborales.

### 5. Cómo ejecutar el proyecto
- **Backend:** `cd backend && npm run dev` (Puerto 3001)
- **Frontend:** `cd frontend && npm run dev` (Puerto 5173)
- **Tests:** `cd backend && $env:NODE_ENV='test'; npx jest`
