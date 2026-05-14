# Hoja de Ruta (Roadmap)

## Fase Actual: Módulos de Operación Diaria
- [x] **Módulo Biométrico (Captura Cruda):**
    - [x] Instalación de `node-zklib`.
    - [x] Creación de tablas `biometrico_config` y `biometrico_logs_raw`.
    - [x] Implementación de `BiometricoService` para descarga de marcaciones.
    - [x] Interfaz de usuario para configuración y monitoreo de logs.
- [ ] **Módulo de Turnos y Guardias:**
    - [ ] Diseño de tablas `turnos` y `roles_turno`.
    - [ ] Creación de roles de turno.
    - [ ] Asignación de personal a servicios específicos.
- [ ] **Gestión de Vacaciones:**
    - [ ] Cálculo automático de días ganados por antigüedad.
    - [ ] Formulario de solicitud y aprobación.
- [ ] **Permisos y Bajas:**
    - [ ] Registro de bajas médicas y permisos particulares.
    - [ ] Impacto automático en el consolidado de asistencia.

## Fase Futura: Documentación y Salida
- [ ] **Certificaciones y Memorándums:** Generación automática de PDFs.
- [ ] **Módulo de Reemplazos:** Gestión de personal externo para cubrir acefalías temporales.
