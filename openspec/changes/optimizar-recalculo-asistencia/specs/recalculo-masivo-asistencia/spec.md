## ADDED Requirements

### Requirement: Filtrar empleados con turno activo en el recálculo masivo

El recálculo masivo SHALL procesar únicamente empleados que tengan al menos un turno asignado que cubra algún día del mes/ año indicado. Los empleados sin turno no se procesan (no generan horas).

#### Scenario: Empleado sin turno en el mes
- **WHEN** se lanza `calcular-todos` para un mes/anio
- **THEN** los empleados sin `turnos_asignados` que cubra el período no se incluyen en el job (no cuentan en `total`)

#### Scenario: Empleado con turno vigente
- **WHEN** se lanza `calcular-todos` para un mes/anio
- **THEN** el empleado con turno (fecha_inicio <= fin del mes Y (fecha_fin es NULL o >= inicio del mes)) se incluye en el job

### Requirement: Procesamiento paralelo acotado

El job SHALL procesar varios empleados de forma concurrente (límite configurado, p.ej. 6) en lugar de uno a la vez, sin cambiar el contrato del endpoint ni el polling de estado.

#### Scenario: Concurrencia acotada
- **WHEN** el job corre
- **THEN** procesa hasta N empleados en paralelo y `procesados/total` en `asistencia_jobs` se actualiza correctamente hasta completarse

#### Scenario: Error en un empleado
- **WHEN** el cálculo de un empleado falla
- **THEN** el error no aborta el resto del job y el job termina en `completado` (o se registra en detalle)
