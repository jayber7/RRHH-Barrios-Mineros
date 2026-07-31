## ADDED Requirements

### Requirement: Configurar tolerancias por tipo de contrato

El sistema SHALL permitir configurar los minutos de tolerancia de atraso por tipo de contrato en una clave `tolerancia_atraso_por_tipo_contrato` de `configuracion_sistema` (tipo `json`), editable desde el panel Configuración.

#### Scenario: Configurar tolerancia para ÍTEM
- **WHEN** se abre el panel Configuración → Asistencia
- **THEN** se muestra un editor de texto JSON con la clave `tolerancia_atraso_por_tipo_contrato` (ej. `{"ITEM": 8, "CONTRATO": 5}`) y permite guardarla

#### Scenario: Tipo sin tolerancia configurada
- **WHEN** el tipo de contrato de un empleado no está en el mapa configurado
- **THEN** se usa `tolerancia_atraso_default` como fallback

### Requirement: Recalcular atrasos con la tolerancia del tipo de contrato

El reporte SHALL recalcular los minutos de retraso por día para cada empleado usando la tolerancia correspondiente a su tipo de contrato, sin modificar los datos guardados en `asistencia_diaria`.

#### Scenario: Empleado con contrato ÍTEM y tolerancia 8 min
- **WHEN** el empleado llega con 6 minutos de retraso respecto a su turno
- **THEN** el reporte muestra 0 minutos de atraso (dentro de los 8 perdonables)

#### Scenario: Empleado que excede la tolerancia
- **WHEN** el empleado de tipo ÍTEM llega con 12 minutos de retraso
- **THEN** el reporte contabiliza 12 minutos de atraso ese día

#### Scenario: No alterar datos guardados
- **WHEN** se genera el reporte
- **THEN** las tablas `asistencia_diaria` y `asistencia_mensual` no se modifican

### Requirement: Generar reporte PDF con tipo de contrato, minutos y días de retraso

El reporte SHALL generar un PDF por empleado (patrón del reporte de Eventos) que muestre el tipo de contrato, el detalle diario (turno, marca, minutos de retraso), las faltas y el resumen con total de minutos, días con retraso y faltas.

#### Scenario: Empleados seleccionados con rango
- **WHEN** se invoca `POST /api/reportes/asistencia/contrato` con `{ ids, desde, hasta }`
- **THEN** se devuelve un PDF con una sección por empleado: tipo de contrato, tolerancia aplicada, tabla diaria y total de minutos/días con retraso y faltas

#### Scenario: Empleado con faltas en el rango
- **WHEN** el empleado tiene días sin marcación (estado 4 o 9) en el rango
- **THEN** esos días se contabilizan como faltas en el resumen

#### Scenario: Empleado sin turno en un día
- **WHEN** el día no tiene turno asignado
- **THEN** ese día se muestra sin minutos de atraso (marca de entrada/salida con "--")
