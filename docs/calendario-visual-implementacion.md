# Calendario Visual de Turnos — Diseño de Implementación

Basado en el patrón de UKG Pro Schedule + Smart Square calendar.

---

## 1. Vista General del Componente

```
┌──────────────────────────────────────────────────────┐
│ < Junio 2026 >          [Hoy]  [Filtrar ▼]  [+Nuevo]│
├──────┬──────┬──────┬──────┬──────┬──────┬──────┤
│  Lun │  Mar │  Mié │  Jue │  Vie │  Sáb │  Dom │
├──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│      │      │      │      │   1  │   2  │   3  │
│      │      │      │      │ ██   │ ██   │ ░░   │
│      │      │      │      │Mañana│ Tarde│ Libre│
├──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│   4  │   5  │   6  │   7  │   8  │   9  │  10  │
│ ██   │ ██   │ ██   │ ██   │ ██   │ ░░   │ ░░   │
│ Noche│Mañana│Mañana│ Tarde│ Tarde│ Libre│ Libre│
├──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│  11  │  12  │  13  │  14  │  15  │  16  │  17  │
│ ░░   │ ██   │ ██   │ ██   │ ██   │ ██   │ ██   │
│ Libre│Mañana│Mañana│ Tarde│ Tarde│ Noche│ Noche│
├──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│  18  │  19  │  20  │  21  │  22  │  23  │  24  │
│ ░░   │ ██   │ ██   │ ██   │ ██   │ ██   │ ░░   │
│ Libre│Mañana│Mañana│ Tarde│ Tarde│ Noche│ Libre│
├──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│  25  │  26  │  27  │  28  │  29  │  30  │      │
│ ░░   │ ██   │ ██   │ ██   │ ██   │ ██   │      │
│ Libre│Mañana│Mañana│ Tarde│ Tarde│ Noche│      │
└──────┴──────┴──────┴──────┴──────┴──────┴──────┘
```

**Leyenda:**
```
██ Mañana  (azul #4A90D9)    07:00-15:00
██ Tarde   (naranja #F5A623)  15:00-23:00
██ Noche   (púrpura #7B2D8E)  23:00-07:00
░░ Libre   (verde #7ED321)
Vacaciones (amarillo #F8E71C)
Feriado    (rojo #D0021B)
```

---

## 2. Modal de Detalle del Día (al hacer clic en una celda)

```
┌────────────────────────────────────┐
│  Lunes 15 de Junio, 2026      [✕] │
├────────────────────────────────────┤
│                                     │
│  Turno: Mañana                      │
│  Horario: 07:00 - 15:00            │
│                                     │
│  ┌──────────────────────────┐      │
│  │ Empleados (12)           │      │
│  │ ┌────────────────────┐   │      │
│  │ │ Juan Pérez      ✅ │   │      │
│  │ │ María López     ✅ │   │      │
│  │ │ Carlos Ruiz     ✅ │   │      │
│  │ │ Ana Díaz        ⏳ │   │      │
│  │ │ ...                 │   │      │
│  │ └────────────────────┘   │      │
│  └──────────────────────────┘      │
│                                     │
│  [Editar turno]  [Asignar personal] │
│  [Ver reporte]                      │
└────────────────────────────────────┘
```

---

## 3. Vista Semana (alternativa para managers)

```
┌──────────────────────────────────────────────────────────┐
│ Semana del 15 Jun                          [Vista ▼] Mes │
├──────────┬──────────┬──────────┬──────┬──────┬──────┬──────┤
│   Mar 16 │  Mié 17  │  Jue 18  │ ... │      │      │      │
├──────────┼──────────┼──────────┼──────┼──────┼──────┼──────┤
│ 07:00    │ 07:00    │ 15:00    │      │      │      │      │
│ ┌──┐     │ ┌──┐     │ ┌──┐     │      │      │      │      │
│ │JP│     │ │JP│     │ │JP│     │      │      │      │      │
│ │ML│     │ │CR│     │ │ML│     │      │      │      │      │
│ │AD│     │ │AD│     │ │CR│     │      │      │      │      │
│ └──┘     │ └──┘     │ └──┘     │      │      │      │      │
│ Mañana   │ Mañana   │ Tarde    │      │      │      │      │
└──────────┴──────────┴──────────┴──────┴──────┴──────┴──────┘
```

Vista por defecto para managers. Cada columna = día. Filas = bandas horarias. Avatares mini del personal asignado.

---

## 4. Modal de Edición / Asignación de Turno

```
┌────────────────────────────────────┐
│  Asignar Turno                 [✕] │
├────────────────────────────────────┤
│                                     │
│  Empleado:  [Juan Pérez      ▼]    │
│  Fecha:     15/06/2026             │
│                                     │
│  Tipo de Turno:                     │
│  ○ Mañana   07:00 - 15:00          │
│  ● Tarde    15:00 - 23:00          │
│  ○ Noche    23:00 - 07:00          │
│  ○ Libre                            │
│  ○ Vacaciones                       │
│                                     │
│  Desde plantilla: [Mañana Estándar]│
│                                     │
│  Observaciones:                     │
│  [______________________________]   │
│                                     │
│  [Guardar]  [Cancelar]              │
└────────────────────────────────────┘
```

---

## 5. Integración con Base de Datos Existente

El calendario debe integrarse con estas tablas ya existentes:

```sql
-- turnos_plantilla: definiciones de turno
SELECT * FROM turnos_plantilla;
-- id, nombre, hora_entrada, hora_salida, tolerancia, nocturno

-- turnos_asignados: asignaciones empleado ↔ turno por fecha
SELECT * FROM turnos_asignados;
-- id, personal_id, turno_plantilla_id, fecha_inicio, fecha_fin

-- personal: empleados
SELECT id, primer_nombre, apellido_paterno, biometrico_id FROM personal;
```

**Nuevas tablas sugeridas:**

```sql
CREATE TABLE calendario_eventos (
  id SERIAL PRIMARY KEY,
  personal_id INTEGER REFERENCES personal(id),
  fecha DATE NOT NULL,
  tipo_turno VARCHAR(20) CHECK (tipo_turno IN ('mañana','tarde','noche','libre','vacaciones','feriado')),
  turno_plantilla_id INTEGER REFERENCES turnos_plantilla(id),
  observaciones TEXT,
  created_by INTEGER REFERENCES usuarios(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(personal_id, fecha)
);
```

---

## 6. API Endpoints Propuestos

```
GET    /api/calendario?mes=6&anio=2026&personal_id=123
       → Lista de eventos del mes (para renderizar el grid)

GET    /api/calendario/dia?fecha=2026-06-15&departamento_id=5
       → Detalle de un día (personal asignado, ausencias)

POST   /api/calendario/asignar
       Body: { personal_id, fecha, tipo_turno, turno_plantilla_id }
       → Asigna un turno

PUT    /api/calendario/:id
       Body: { tipo_turno, turno_plantilla_id }
       → Modifica una asignación

DELETE /api/calendario/:id
       → Elimina una asignación

POST   /api/calendario/clonar
       Body: { desde_semana, hasta_semana, personal_ids[] }
       → Clona turnos de una semana a otra

GET    /api/calendario/export-ics?mes=6&anio=2026&personal_id=123
       → Exporta a formato .ics (Google Calendar / iCal)
```

---

## 7. Componentes React Sugeridos

```
src/
  components/
    calendario/
      CalendarioView.jsx        ← Componente principal (grid mensual)
      CalendarioHeader.jsx      ← Navegación de meses + controles
      CalendarioDia.jsx         ← Celda individual (día)
      CalendarioDetalle.jsx     ← Modal de detalle del día
      CalendarioAsignar.jsx     ← Modal de asignación/edición
      CalendarioLeyenda.jsx     ← Leyenda de colores
      CalendarioExportar.jsx    ← Botón exportar ICS
      useCalendario.js          ← Hook con lógica de negocio
```

---

## 8. Interacciones Clave

| Interacción | Comportamiento |
|---|---|
| **Hover sobre celda** | Tooltip con resumen: "Mañana - 5 empleados" |
| **Click en celda** | Modal con detalle del día (empleados, turnos, ausencias) |
| **Doble click en celda vacía** | Modal rápido de asignación |
| **Drag & drop de empleado a celda** | Asigna turno arrastrando desde lista lateral |
| **Click en nombre del mes** | Selector rápido de mes/año |
| **Swipe horizontal (mobile)** | Cambia de mes |
| **Click "Hoy"** | Vuelve al día actual con animación |
| **Click en empleado dentro del modal** | Timeline de sus marcaciones en ese día |

---

## 9. Paleta de Colores Propuesta

```css
:root {
  --turno-manana: #4A90D9;
  --turno-manana-bg: rgba(74, 144, 217, 0.15);
  --turno-tarde: #F5A623;
  --turno-tarde-bg: rgba(245, 166, 35, 0.15);
  --turno-noche: #7B2D8E;
  --turno-noche-bg: rgba(123, 45, 142, 0.15);
  --turno-libre: #7ED321;
  --turno-libre-bg: rgba(126, 211, 33, 0.15);
  --turno-vacaciones: #F8E71C;
  --turno-vacaciones-bg: rgba(248, 231, 28, 0.15);
  --turno-feriado: #D0021B;
  --turno-feriado-bg: rgba(208, 2, 27, 0.15);
  --hoy-border: #4A90D9;
  --hoy-bg: rgba(74, 144, 217, 0.08);
  --celda-hover: rgba(0,0,0,0.05);
}
```

---

## 10. Comportamiento Mobile

```
┌────────────────────┐
│ < Junio 2026 > [H]│  ← Header compacto
├────────────────────┤
│ LU MA MI JU VI SA │  ← Días abreviados 2 letras
│ DO                  │
├────────────────────┤
│    1   2   3   4  │
│    ██  ██  ██  ██ │
│    Mañ Tar Lib Noc│  ← Texto más pequeño
├────────────────────┤
│  5   6   7   8    │
│  ██  ██  ██  ██   │
│  Mañ Mañ Tar Tar  │
├────────────────────┤
│ ...                │
└────────────────────┘

Swipe left/right para cambiar de mes.
Pinch to zoom → vista semana.
Tap prolongado → drag & drop en versión manager.
```

---

## Referencias

- UKG Pro Schedule: https://www.ukg.com/products/workforce-management
- Smart Square calendar: https://www.symplr.com/products/smart-square
- Smart Square Go app: https://apps.apple.com/us/app/smart-square-go/id6466659922
