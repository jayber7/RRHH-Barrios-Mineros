# New session - 2026-08-27T03:30:18.468Z

**Session ID:** ses_fbebb451bffe5xIjFUjiOOqoRq
**Created:** 26/8/2026, 23:30:18
**Updated:** 27/8/2026, 0:23:33

---

## User

hola

---

## Assistant (Plan · DeepSeek V4 Flash Free · 20.4s)

---

## User

hola

---

## Assistant (Plan · Nemotron 3 Ultra Free · 16.2s)

_Thinking:_

The user said "hola" which is Spanish for "hello". This appears to be a greeting. Since I'm in plan mode (read-only), I should respond briefly and ask how I can help them.

¡Hola! ¿En qué puedo ayudarte hoy?

---

## User

analiza el proyecto en especial el modulo de turnos haremos cambios.

---

## Assistant (Plan · Nemotron 3 Ultra Free · 26.5s)

_Thinking:_

The user wants me to analyze the project, specifically the "turnos" (shifts) module, as they plan to make changes. I'm in plan mode, so I can only read and analyze - no edits allowed.

Let me start by exploring the project structure to understand the codebase and find the turnos module.

**Tool: glob**

**Input:**
```json
{
  "pattern": "**/*"
}
```

**Output:**
```
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\TODO.md
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\test_import_postgres.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\statements.json
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\start-project.cmd
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\README.md
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\PROJECT_CONTEXT.md
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\mcp-postgres-config.json
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\inspect_excel.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\GEMINI.md
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\sql\skills-lock.json
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\sql\run_batch_calculo.sql
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\sql\normalizar_plantillas.sql
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\sql\migration_turnos_asistencia.sql
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\sql\migration_correspondencia.sql
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\sql\migration_configuracion.sql
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\sql\migration_comunicados.sql
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\sql\migrate_render.sql
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\sql\migrate_entregado_asis_complete.py
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\sql\migrate_entregado_asis.sql
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\sql\map_empleados_excel_unidad.sql
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\sql\map_departamentos.sql
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\sql\init.sql
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\sql\import_excel_abril_2026.sql
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\sql\import_asis_attendance.py
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\sql\generate_reporte.py
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\sql\generate_monthly_asistencia.sql
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\sql\generate_inserts.py
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\sql\create_table_contratos.sql
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\sql\.agents\skills\neon-postgres\SKILL.md
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\uploads\certificados\2026\CERT-2026-0002.pdf
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\uploads\certificados\2026\CERT-2026-0001.pdf
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\sql\.agents\skills\neon\SKILL.md
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\test_real_import.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\SESSION_SUMMARY.md
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\rrhh_dump_20260701.dump
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\rrhh_dump_20260608.sql
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\render_dump.sql
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\vite.config.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\vercel.json
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\tests\personal.test.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\assets\fonts\LiberationSans-Regular.ttf
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\assets\fonts\LiberationSans-Bold.ttf
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\.env.example
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\.env
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\ARCHITECTURE.md
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\.gitignore
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\utils\seed.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\pages\VacacionesPage.jsx
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\pages\TurnosPage.jsx
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\pages\SelfServicePage.jsx
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\pages\ReportesPage.jsx
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\pages\PersonalPage.jsx
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\pages\PermisosPage.jsx
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\pages\NotificacionesPage.jsx
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\pages\LoginPage.jsx
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\pages\Dashboard.jsx
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\pages\CorrespondenciaPage.jsx
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\pages\CorrespondenciaForm.jsx
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\pages\CorrespondenciaDetail.jsx
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\pages\ConfiguracionPage.jsx
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\pages\ComunicadosPage.jsx
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\pages\CertificadosPage.jsx
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\pages\BiometricoPage.jsx
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\pages\BandejaPage.jsx
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\pages\AsistenciasPage.jsx
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\pages\AdminRolesPage.jsx
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\main.jsx
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\index.css
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\context\AuthContext.jsx
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\validacionesService.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\vacacionesService.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\turnosService.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\selfServiceService.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\sancionesService.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\reporteService.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\reporteEventosService.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\reporteAsistenciaService.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\permisosService.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\pdfService.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\notificacionesService.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\justificacionesService.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\importService.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\excelService.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\dashboardService.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\configuracionService.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\comunicadosService.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\certificadosService.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\calculoAsistenciaService.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\biometricoTurnoService.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\biometricoService.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\biometricoMappingService.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\biometricoImportService.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\biometricoAsistenciaService.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\asistenciaService.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\config\api.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\controllers\vacacionesController.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\controllers\usuarioController.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\controllers\turnosController.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\controllers\selfServiceController.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\controllers\sancionesController.js

(Results are truncated: showing first 100 results. Consider using a more specific path or pattern.)
```

---

## Assistant (Plan · Nemotron 3 Ultra Free · 9.0s)

_Thinking:_

Let me explore the project structure more specifically for the turnos module - both frontend and backend

**Tool: read**

**Input:**
```json
{
  "filePath": "D:\\Vercel Barrios mineros\\RRHH-Barrios-Mineros\\backend\\src\\services\\turnosService.js"
}
```

**Output:**
```
<path>D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\turnosService.js</path>
<type>file</type>
<content>
1: const db = require('../config/db');
2: const ConfiguracionService = require('./configuracionService');
3: 
4: class TurnosService {
5:   static async getAllPlantillas(activo) {
6:     let query = 'SELECT tp.*, (SELECT COUNT(*) FROM turnos_asignados WHERE turno_plantilla_id = tp.id) as total_asignaciones FROM turnos_plantilla tp';
7:     const params = [];
8:     if (activo !== undefined) {
9:       params.push(activo === 'true');
10:       query += ` WHERE tp.activo = $${params.length}`;
11:     }
12:     query += ' ORDER BY total_asignaciones DESC, tp.codigo ASC';
13:     const { rows } = await db.query(query, params);
14:     return rows;
15:   }
16: 
17:   static async getPlantillaById(id) {
18:     const { rows } = await db.query('SELECT * FROM turnos_plantilla WHERE id = $1', [id]);
19:     return rows[0] || null;
20:   }
21: 
22:   static async createPlantilla(data) {
23:     const defaults = {
24:       tolerancia_atraso: await ConfiguracionService.get('tolerancia_atraso_default', 5),
25:       tolerancia_falta: await ConfiguracionService.get('tolerancia_falta_default', 60),
26:       salida_adelantada: await ConfiguracionService.get('salida_adelantada_default', 0),
27:       puntualidad: await ConfiguracionService.get('puntualidad_default', 60),
28:       max_extra: await ConfiguracionService.get('max_extra_default', 180),
29:     };
30:     const { rows } = await db.query(`
31:       INSERT INTO turnos_plantilla (
32:         codigo, nombre,
33:         lunes_entrada, lunes_salida, martes_entrada, martes_salida,
34:         miercoles_entrada, miercoles_salida, jueves_entrada, jueves_salida,
35:         viernes_entrada, viernes_salida, sabado_entrada, sabado_salida,
36:         domingo_entrada, domingo_salida,
37:         lunes_habilitado, martes_habilitado, miercoles_habilitado,
38:         jueves_habilitado, viernes_habilitado, sabado_habilitado, domingo_habilitado,
39:         nocturno_lunes, nocturno_martes, nocturno_miercoles, nocturno_jueves,
40:         nocturno_viernes, nocturno_sabado, nocturno_domingo,
41:         tolerancia_atraso, tolerancia_falta, salida_adelantada, puntualidad, max_extra,
42:         prioridad
43:       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36)
44:       RETURNING *
45:     `, [
46:       data.codigo, data.nombre,
47:       data.lunes_entrada, data.lunes_salida,
48:       data.martes_entrada, data.martes_salida,
49:       data.miercoles_entrada, data.miercoles_salida,
50:       data.jueves_entrada, data.jueves_salida,
51:       data.viernes_entrada, data.viernes_salida,
52:       data.sabado_entrada, data.sabado_salida,
53:       data.domingo_entrada, data.domingo_salida,
54:       data.lunes_habilitado, data.martes_habilitado, data.miercoles_habilitado,
55:       data.jueves_habilitado, data.viernes_habilitado, data.sabado_habilitado, data.domingo_habilitado,
56:       data.nocturno_lunes, data.nocturno_martes, data.nocturno_miercoles, data.nocturno_jueves,
57:       data.nocturno_viernes, data.nocturno_sabado, data.nocturno_domingo,
58:       data.tolerancia_atraso || defaults.tolerancia_atraso,
59:       data.tolerancia_falta || defaults.tolerancia_falta,
60:       data.salida_adelantada || defaults.salida_adelantada,
61:       data.puntualidad || defaults.puntualidad,
62:       data.max_extra || defaults.max_extra,
63:       data.prioridad || 'Normal'
64:     ]);
65:     return rows[0];
66:   }
67: 
68:   static async updatePlantilla(id, data) {
69:     const fields = [];
70:     const params = [];
71:     let idx = 1;
72: 
73:     const cols = [
74:       'codigo','nombre','lunes_entrada','lunes_salida','martes_entrada','martes_salida',
75:       'miercoles_entrada','miercoles_salida','jueves_entrada','jueves_salida',
76:       'viernes_entrada','viernes_salida','sabado_entrada','sabado_salida',
77:       'domingo_entrada','domingo_salida',
78:       'lunes_habilitado','martes_habilitado','miercoles_habilitado',
79:       'jueves_habilitado','viernes_habilitado','sabado_habilitado','domingo_habilitado',
80:       'nocturno_lunes','nocturno_martes','nocturno_miercoles','nocturno_jueves',
81:       'nocturno_viernes','nocturno_sabado','nocturno_domingo',
82:       'tolerancia_atraso','tolerancia_falta','salida_adelantada','puntualidad','max_extra','prioridad','activo'
83:     ];
84: 
85:     for (const col of cols) {
86:       if (data[col] !== undefined) {
87:         fields.push(`${col} = $${idx++}`);
88:         params.push(data[col]);
89:       }
90:     }
91: 
92:     if (fields.length === 0) return this.getPlantillaById(id);
93: 
94:     fields.push(`updated_at = CURRENT_TIMESTAMP`);
95:     params.push(id);
96:     const { rows } = await db.query(
97:       `UPDATE turnos_plantilla SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
98:       params
99:     );
100:     return rows[0] || null;
101:   }
102: 
103:   static async deletePlantilla(id) {
104:     const { rowCount } = await db.query('DELETE FROM turnos_plantilla WHERE id = $1', [id]);
105:     return rowCount > 0;
106:   }
107: 
108:   static async getAllAsignados(filtros = {}) {
109:     const params = [];
110:     const where = ['1=1'];
111: 
112:     if (filtros.q) {
113:       params.push(`%${filtros.q}%`);
114:       where.push(`(
115:         p.primer_nombre ILIKE $${params.length} OR
116:         p.apellido_paterno ILIKE $${params.length} OR
117:         p.apellido_materno ILIKE $${params.length} OR
118:         p.ci ILIKE $${params.length} OR
119:         CAST(p.id AS TEXT) ILIKE $${params.length}
120:       )`);
121:     }
122:     if (filtros.fecha) {
123:       params.push(filtros.fecha);
124:       where.push(`ta.fecha_inicio <= $${params.length} AND (ta.fecha_fin IS NULL OR ta.fecha_fin >= $${params.length})`);
125:     }
126:     if (filtros.fecha_desde) {
127:       params.push(filtros.fecha_desde);
128:       where.push(`ta.fecha_inicio >= $${params.length}`);
129:     }
130:     if (filtros.fecha_hasta) {
131:       params.push(filtros.fecha_hasta);
132:       where.push(`(ta.fecha_fin IS NULL OR ta.fecha_fin <= $${params.length})`);
133:     }
134:     if (filtros.turno_plantilla_id) {
135:       params.push(filtros.turno_plantilla_id);
136:       where.push(`ta.turno_plantilla_id = $${params.length}`);
137:     }
138:     if (filtros.year) {
139:       params.push(`${filtros.year}-01-01`);
140:       params.push(`${filtros.year}-12-31`);
141:       where.push(`ta.fecha_inicio BETWEEN $${params.length - 1} AND $${params.length}`);
142:     }
143: 
144:     const baseQuery = `
145:       SELECT ta.*, p.ci, p.primer_nombre, p.apellido_paterno, p.apellido_materno,
146:              tp.codigo as turno_codigo, tp.nombre as turno_nombre
147:       FROM turnos_asignados ta
148:       JOIN personal p ON ta.personal_id = p.id
149:       JOIN turnos_plantilla tp ON ta.turno_plantilla_id = tp.id
150:       WHERE ${where.join(' AND ')}
151:     `;
152: 
153:     const countQuery = `SELECT COUNT(*) as total FROM (${baseQuery}) sub`;
154: 
155:     let query = baseQuery + ' ORDER BY ta.fecha_inicio DESC, p.apellido_paterno ASC';
156: 
157:     const page = parseInt(filtros.page) || 1;
158:     const limit = parseInt(filtros.limit) || 50;
159:     const offset = (page - 1) * limit;
160:     query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
161:     params.push(limit, offset);
162: 
163:     const { rows } = await db.query(query, params);
164:     const { rows: countRows } = await db.query(countQuery, params.slice(0, -2));
165: 
166:     return {
167:       data: rows,
168:       pagination: {
169:         total: parseInt(countRows[0].total),
170:         page,
171:         limit,
172:         totalPages: Math.ceil(parseInt(countRows[0].total) / limit),
173:       },
174:     };
175:   }
176: 
177:   static async getYearsAsignados() {
178:     const { rows } = await db.query(`
179:       SELECT DISTINCT EXTRACT(YEAR FROM fecha_inicio)::int as year
180:       FROM turnos_asignados ORDER BY year DESC
181:     `);
182:     return rows.map(r => r.year);
183:   }
184: 
185:   static async cloneAsignaciones(desdeYear, hastaYear) {
186:     const desde = `${desdeYear}-01-01`;
187:     const hasta = `${desdeYear}-12-31`;
188:     const nuevoDesde = `${hastaYear}-01-01`;
189:     const nuevoHasta = `${hastaYear}-12-31`;
190: 
191:     const { rows } = await db.query(`
192:       INSERT INTO turnos_asignados (personal_id, turno_plantilla_id, fecha_inicio, fecha_fin)
193:       SELECT DISTINCT ta.personal_id, ta.turno_plantilla_id,
194:              (ta.fecha_inicio + interval '1 year' * $4)::date as fecha_inicio,
195:              (ta.fecha_fin + interval '1 year' * $4)::date as fecha_fin
196:       FROM turnos_asignados ta
197:       WHERE ta.fecha_inicio BETWEEN $1 AND $2
198:         AND NOT EXISTS (
199:           SELECT 1 FROM turnos_asignados ta2
200:           WHERE ta2.personal_id = ta.personal_id
201:             AND ta2.turno_plantilla_id = ta.turno_plantilla_id
202:             AND ta2.fecha_inicio = (ta.fecha_inicio + interval '1 year' * $4)::date
203:         )
204:       ON CONFLICT DO NOTHING
205:       RETURNING id
206:     `, [desde, hasta, null, hastaYear - desdeYear]);
207: 
208:     return rows.length;
209:   }
210: 
211:   static async getAsignadoById(id) {
212:     const { rows } = await db.query(`
213:       SELECT ta.*, p.ci, p.primer_nombre, p.apellido_paterno, p.apellido_materno,
214:              tp.codigo as turno_codigo, tp.nombre as turno_nombre
215:       FROM turnos_asignados ta
216:       JOIN personal p ON ta.personal_id = p.id
217:       JOIN turnos_plantilla tp ON ta.turno_plantilla_id = tp.id
218:       WHERE ta.id = $1
219:     `, [id]);
220:     return rows[0] || null;
221:   }
222: 
223:   static async createAsignado(data) {
224:     const overlap = await db.query(`
225:       SELECT id FROM turnos_asignados
226:       WHERE personal_id = $1 AND fecha_inicio = $2
227:     `, [data.personal_id, data.fecha_inicio]);
228: 
229:     const { rows } = await db.query(`
230:       INSERT INTO turnos_asignados (personal_id, turno_plantilla_id, fecha_inicio, fecha_fin)
231:       VALUES ($1, $2, $3, $4) RETURNING *
232:     `, [data.personal_id, data.turno_plantilla_id, data.fecha_inicio, data.fecha_fin || null]);
233:     return rows[0];
234:   }
235: 
236:   static async updateAsignado(id, data) {
237:     const fields = [];
238:     const params = [];
239:     let idx = 1;
240: 
241:     if (data.personal_id !== undefined) { fields.push(`personal_id = $${idx++}`); params.push(data.personal_id); }
242:     if (data.turno_plantilla_id !== undefined) { fields.push(`turno_plantilla_id = $${idx++}`); params.push(data.turno_plantilla_id); }
243:     if (data.fecha_inicio !== undefined) { fields.push(`fecha_inicio = $${idx++}`); params.push(data.fecha_inicio); }
244:     if (data.fecha_fin !== undefined) { fields.push(`fecha_fin = $${idx++}`); params.push(data.fecha_fin); }
245: 
246:     if (fields.length === 0) return this.getAsignadoById(id);
247: 
248:     params.push(id);
249:     const { rows } = await db.query(
250:       `UPDATE turnos_asignados SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
251:       params
252:     );
253:     return rows[0] || null;
254:   }
255: 
256:   static async deleteAsignado(id) {
257:     const { rowCount } = await db.query('DELETE FROM turnos_asignados WHERE id = $1', [id]);
258:     return rowCount > 0;
259:   }
260: 
261:   static async deleteAsignadosByPersonal(personalId) {
262:     const { rowCount } = await db.query('DELETE FROM turnos_asignados WHERE personal_id = $1', [personalId]);
263:     return rowCount;
264:   }
265: 
266:   static async getTurnoEmpleado(personalId, fecha) {
267:     const { rows } = await db.query(`
268:       SELECT tp.*, ta.fecha_inicio, ta.fecha_fin
269:       FROM turnos_asignados ta
270:       JOIN turnos_plantilla tp ON ta.turno_plantilla_id = tp.id
271:       WHERE ta.personal_id = $1
272:         AND ta.fecha_inicio <= $2
273:         AND (ta.fecha_fin IS NULL OR ta.fecha_fin >= $2)
274:       ORDER BY ta.fecha_inicio DESC
275:       LIMIT 1
276:     `, [personalId, fecha]);
277:     return rows[0] || null;
278:   }
279: 
280:   static async getCalendario(mes, anio, servicio) {
281:     let query = `
282:       SELECT ta.*, p.ci, p.primer_nombre, p.apellido_paterno, p.apellido_materno,
283:              tp.id as plantilla_id, tp.codigo as turno_codigo, tp.nombre as turno_nombre,
284:              tp.lunes_entrada, tp.lunes_salida, tp.martes_entrada, tp.martes_salida,
285:              tp.miercoles_entrada, tp.miercoles_salida, tp.jueves_entrada, tp.jueves_salida,
286:              tp.viernes_entrada, tp.viernes_salida, tp.sabado_entrada, tp.sabado_salida,
287:              tp.domingo_entrada, tp.domingo_salida,
288:              tp.lunes_habilitado, tp.martes_habilitado, tp.miercoles_habilitado,
289:              tp.jueves_habilitado, tp.viernes_habilitado, tp.sabado_habilitado, tp.domingo_habilitado,
290:              tp.nocturno_lunes, tp.nocturno_martes, tp.nocturno_miercoles, tp.nocturno_jueves,
291:              tp.nocturno_viernes, tp.nocturno_sabado, tp.nocturno_domingo,
292:              vl.unidad_servicio
293:       FROM turnos_asignados ta
294:       JOIN personal p ON ta.personal_id = p.id
295:       JOIN turnos_plantilla tp ON ta.turno_plantilla_id = tp.id
296:       LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id
297:       WHERE (ta.fecha_inicio BETWEEN $1 AND $2 OR ta.fecha_fin BETWEEN $1 AND $2
298:              OR (ta.fecha_inicio <= $1 AND (ta.fecha_fin IS NULL OR ta.fecha_fin >= $2)))
299:     `;
300:     const ultimoDia = new Date(anio, mes, 0).getDate();
301:     const params = [`${anio}-${String(mes).padStart(2, '0')}-01`, `${anio}-${String(mes).padStart(2, '0')}-${String(ultimoDia).padStart(2, '0')}`];
302: 
303:     if (servicio) {
304:       params.push(`%${servicio}%`);
305:       query += ` AND vl.unidad_servicio ILIKE $${params.length}`;
306:     }
307: 
308:     query += ' ORDER BY vl.unidad_servicio, p.apellido_paterno, ta.fecha_inicio';
309:     const { rows } = await db.query(query, params);
310:     return rows;
311:   }
312: 
313:   static async getCalendarioDia(mes, anio, dia) {
314:     const fecha = `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
315:     const diaSem = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'][new Date(fecha).getDay()];
316:     const { rows } = await db.query(`
317:       SELECT ta.*, p.ci, p.primer_nombre, p.apellido_paterno, p.apellido_materno,
318:              tp.codigo as turno_codigo, tp.nombre as turno_nombre,
319:              tp.${diaSem}_entrada as entrada, tp.${diaSem}_salida as salida,
320:              tp.nocturno_${diaSem} as nocturno, tp.${diaSem}_habilitado as habilitado,
321:              vl.unidad_servicio, vl.cargo_actual
322:       FROM turnos_asignados ta
323:       JOIN personal p ON ta.personal_id = p.id
324:       JOIN turnos_plantilla tp ON ta.turno_plantilla_id = tp.id
325:       LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id
326:       WHERE ta.fecha_inicio <= $1 AND (ta.fecha_fin IS NULL OR ta.fecha_fin >= $1)
327:       ORDER BY vl.unidad_servicio, p.apellido_paterno
328:     `, [fecha]);
329:     return rows;
330:   }
331: 
332:   static async getPersonalSinTurno() {
333:     const { rows } = await db.query(`
334:       SELECT p.id, p.ci, p.primer_nombre, p.apellido_paterno, p.apellido_materno,
335:              vl.unidad_servicio, vl.cargo_actual
336:       FROM personal p
337:       LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id
338:       WHERE p.id NOT IN (SELECT DISTINCT personal_id FROM turnos_asignados)
339:       ORDER BY p.apellido_paterno
340:     `);
341:     return rows;
342:   }
343: }
344: 
345: module.exports = TurnosService;

(End of file - total 345 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "D:\\Vercel Barrios mineros\\RRHH-Barrios-Mineros\\backend\\src\\controllers\\turnosController.js"
}
```

**Output:**
```
<path>D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\controllers\turnosController.js</path>
<type>file</type>
<content>
1: const TurnosService = require('../services/turnosService');
2: 
3: class TurnosController {
4:   static async getPlantillas(req, res) {
5:     try {
6:       const plantillas = await TurnosService.getAllPlantillas(req.query.activo);
7:       res.json(plantillas);
8:     } catch (error) {
9:       console.error('Error al obtener plantillas:', error);
10:       res.status(500).json({ error: 'Error al obtener plantillas de turno' });
11:     }
12:   }
13: 
14:   static async getPlantilla(req, res) {
15:     try {
16:       const plantilla = await TurnosService.getPlantillaById(req.params.id);
17:       if (!plantilla) return res.status(404).json({ error: 'Plantilla no encontrada' });
18:       res.json(plantilla);
19:     } catch (error) {
20:       res.status(500).json({ error: 'Error al obtener plantilla' });
21:     }
22:   }
23: 
24:   static async createPlantilla(req, res) {
25:     try {
26:       const plantilla = await TurnosService.createPlantilla(req.body);
27:       res.status(201).json(plantilla);
28:     } catch (error) {
29:       console.error('Error al crear plantilla:', error);
30:       if (error.code === '23505') return res.status(400).json({ error: 'El código ya existe' });
31:       res.status(500).json({ error: 'Error al crear plantilla' });
32:     }
33:   }
34: 
35:   static async updatePlantilla(req, res) {
36:     try {
37:       const plantilla = await TurnosService.updatePlantilla(req.params.id, req.body);
38:       if (!plantilla) return res.status(404).json({ error: 'Plantilla no encontrada' });
39:       res.json(plantilla);
40:     } catch (error) {
41:       if (error.code === '23505') return res.status(400).json({ error: 'El código ya existe' });
42:       res.status(500).json({ error: 'Error al actualizar plantilla' });
43:     }
44:   }
45: 
46:   static async deletePlantilla(req, res) {
47:     try {
48:       const deleted = await TurnosService.deletePlantilla(req.params.id);
49:       if (!deleted) return res.status(404).json({ error: 'Plantilla no encontrada' });
50:       res.json({ message: 'Plantilla eliminada correctamente' });
51:     } catch (error) {
52:       res.status(500).json({ error: 'Error al eliminar plantilla' });
53:     }
54:   }
55: 
56:   static async getAsignados(req, res) {
57:     try {
58:       const asignados = await TurnosService.getAllAsignados(req.query);
59:       res.json(asignados);
60:     } catch (error) {
61:       console.error('Error al obtener asignaciones:', error);
62:       res.status(500).json({ error: 'Error al obtener asignaciones de turno' });
63:     }
64:   }
65: 
66:   static async getAsignado(req, res) {
67:     try {
68:       const asignado = await TurnosService.getAsignadoById(req.params.id);
69:       if (!asignado) return res.status(404).json({ error: 'Asignación no encontrada' });
70:       res.json(asignado);
71:     } catch (error) {
72:       res.status(500).json({ error: 'Error al obtener asignación' });
73:     }
74:   }
75: 
76:   static async createAsignado(req, res) {
77:     try {
78:       const asignado = await TurnosService.createAsignado(req.body);
79:       res.status(201).json(asignado);
80:     } catch (error) {
81:       console.error('Error al crear asignación:', error);
82:       res.status(500).json({ error: 'Error al asignar turno' });
83:     }
84:   }
85: 
86:   static async updateAsignado(req, res) {
87:     try {
88:       const asignado = await TurnosService.updateAsignado(req.params.id, req.body);
89:       if (!asignado) return res.status(404).json({ error: 'Asignación no encontrada' });
90:       res.json(asignado);
91:     } catch (error) {
92:       res.status(500).json({ error: 'Error al actualizar asignación' });
93:     }
94:   }
95: 
96:   static async deleteAsignado(req, res) {
97:     try {
98:       const deleted = await TurnosService.deleteAsignado(req.params.id);
99:       if (!deleted) return res.status(404).json({ error: 'Asignación no encontrada' });
100:       res.json({ message: 'Asignación eliminada correctamente' });
101:     } catch (error) {
102:       res.status(500).json({ error: 'Error al eliminar asignación' });
103:     }
104:   }
105: 
106:   static async deleteAsignadosByPersonal(req, res) {
107:     try {
108:       const { personal_id } = req.query;
109:       if (!personal_id) return res.status(400).json({ error: 'personal_id requerido' });
110:       const count = await TurnosService.deleteAsignadosByPersonal(personal_id);
111:       res.json({ message: `${count} asignaciones eliminadas` });
112:     } catch (error) {
113:       res.status(500).json({ error: 'Error al eliminar asignaciones' });
114:     }
115:   }
116: 
117:   static async getTurnoEmpleado(req, res) {
118:     try {
119:       const { personalId } = req.params;
120:       const fecha = req.query.fecha || new Date().toISOString().split('T')[0];
121:       const turno = await TurnosService.getTurnoEmpleado(personalId, fecha);
122:       res.json(turno || { message: 'Sin turno asignado' });
123:     } catch (error) {
124:       res.status(500).json({ error: 'Error al obtener turno del empleado' });
125:     }
126:   }
127: 
128:   static async getCalendario(req, res) {
129:     try {
130:       const { mes, anio, servicio } = req.query;
131:       if (!mes || !anio) return res.status(400).json({ error: 'Mes y año requeridos' });
132:       const data = await TurnosService.getCalendario(parseInt(mes), parseInt(anio), servicio);
133:       res.json(data);
134:     } catch (error) {
135:       console.error('Error al obtener calendario:', error);
136:       res.status(500).json({ error: 'Error al obtener calendario' });
137:     }
138:   }
139: 
140:   static async getCalendarioDia(req, res) {
141:     try {
142:       const { mes, anio, dia } = req.query;
143:       if (!mes || !anio || !dia) return res.status(400).json({ error: 'Mes, año y día requeridos' });
144:       const data = await TurnosService.getCalendarioDia(parseInt(mes), parseInt(anio), parseInt(dia));
145:       res.json(data);
146:     } catch (error) {
147:       console.error('Error al obtener detalle del día:', error);
148:       res.status(500).json({ error: 'Error al obtener detalle del día' });
149:     }
150:   }
151: 
152:   static async getPersonalSinTurno(req, res) {
153:     try {
154:       const personal = await TurnosService.getPersonalSinTurno();
155:       res.json(personal);
156:     } catch (error) {
157:       res.status(500).json({ error: 'Error al obtener personal sin turno' });
158:     }
159:   }
160: 
161:   static async getYears(req, res) {
162:     try {
163:       const years = await TurnosService.getYearsAsignados();
164:       res.json(years);
165:     } catch (error) {
166:       res.status(500).json({ error: 'Error al obtener años' });
167:     }
168:   }
169: 
170:   static async cloneAsignaciones(req, res) {
171:     try {
172:       const { desde, hasta } = req.body;
173:       if (!desde || !hasta) return res.status(400).json({ error: 'desde y hasta son requeridos' });
174:       const count = await TurnosService.cloneAsignaciones(parseInt(desde), parseInt(hasta));
175:       res.json({ message: `${count} asignaciones clonadas de ${desde} a ${hasta}` });
176:     } catch (error) {
177:       console.error('Error al clonar asignaciones:', error);
178:       res.status(500).json({ error: 'Error al clonar asignaciones' });
179:     }
180:   }
181: }
182: 
183: module.exports = TurnosController;

(End of file - total 183 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "D:\\Vercel Barrios mineros\\RRHH-Barrios-Mineros\\frontend\\src\\pages\\TurnosPage.jsx"
}
```

**Output:**
```
<path>D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\pages\TurnosPage.jsx</path>
<type>file</type>
<content>
1: import React, { useState, useEffect, useRef } from 'react';
2: import { Plus, Calendar, Users, Clock, Search, Pencil, Trash2, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
3: import { useAuth } from '../context/AuthContext';
4: import { API_BASE_URL, authFetch } from '../config/api';
5: import TurnoPlantillaForm from '../components/TurnoPlantillaForm';
6: import TurnoAsignacionForm from '../components/TurnoAsignacionForm';
7: import TurnoCalendario from '../components/TurnoCalendario';
8: 
9: const TABS = [
10:   { id: 'plantillas', label: 'Plantillas de Turno', icon: <Clock size={16} /> },
11:   { id: 'asignaciones', label: 'Asignaciones', icon: <Users size={16} /> },
12:   { id: 'calendario', label: 'Calendario', icon: <Calendar size={16} /> },
13: ];
14: 
15: const TurnosPage = () => {
16:   const { can } = useAuth();
17:   const [activeTab, setActiveTab] = useState('plantillas');
18:   const [plantillas, setPlantillas] = useState([]);
19:   const [asignados, setAsignados] = useState([]);
20:   const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 50, totalPages: 0 });
21:   const [personal, setPersonal] = useState([]);
22:   const [years, setYears] = useState([]);
23:   const [showForm, setShowForm] = useState(false);
24:   const [editing, setEditing] = useState(null);
25:   const [showAsignacion, setShowAsignacion] = useState(false);
26:   const [filtroBuscar, setFiltroBuscar] = useState('');
27:   const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString());
28:   const [page, setPage] = useState(1);
29:   const [clonando, setClonando] = useState(false);
30:   const plantillaScrollRef = useRef(null);
31:   const [canScrollRight, setCanScrollRight] = useState(false);
32: 
33:   const checkScroll = () => {
34:     const el = plantillaScrollRef.current;
35:     if (el) setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
36:   };
37: 
38:   const scrollRight = () => {
39:     const el = plantillaScrollRef.current;
40:     if (el) el.scrollBy({ left: 400, behavior: 'smooth' });
41:   };
42: 
43:   const fetchPlantillas = async () => {
44:     try {
45:       const res = await authFetch(`${API_BASE_URL}/api/turnos/plantilla`);
46:       const data = await res.json();
47:       setPlantillas(data);
48:       setTimeout(checkScroll, 50);
49:     } catch (e) { console.error(e); }
50:   };
51: 
52:   const fetchYears = async () => {
53:     try {
54:       const res = await authFetch(`${API_BASE_URL}/api/turnos/years`);
55:       const data = await res.json();
56:       setYears(data);
57:       if (data.length > 0) setYearFilter(data[0].toString());
58:     } catch (e) { console.error(e); }
59:   };
60: 
61:   const fetchAsignados = async () => {
62:     try {
63:       const params = new URLSearchParams();
64:       if (yearFilter) params.set('year', yearFilter);
65:       if (filtroBuscar) params.set('q', filtroBuscar);
66:       params.set('page', page.toString());
67:       params.set('limit', '50');
68:       const res = await authFetch(`${API_BASE_URL}/api/turnos/asignados?${params}`);
69:       const data = await res.json();
70:       if (data.data) {
71:         setAsignados(data.data);
72:         setPagination(data.pagination);
73:       } else {
74:         setAsignados(data);
75:       }
76:     } catch (e) { console.error(e); }
77:   };
78: 
79:   const fetchPersonal = async () => {
80:     try {
81:       const res = await authFetch(`${API_BASE_URL}/api/personal?limit=1000`);
82:       const data = await res.json();
83:       setPersonal(data.data || data || []);
84:     } catch (e) { console.error(e); }
85:   };
86: 
87:   useEffect(() => { fetchPlantillas(); fetchPersonal(); fetchYears(); }, []);
88: 
89:   useEffect(() => {
90:     const timer = setTimeout(() => {
91:       if (activeTab === 'asignaciones') {
92:         setPage(1);
93:         fetchAsignados();
94:       }
95:     }, 300);
96:     return () => clearTimeout(timer);
97:   }, [activeTab, yearFilter, filtroBuscar]);
98: 
99:   useEffect(() => {
100:     if (activeTab === 'asignaciones') fetchAsignados();
101:   }, [page]);
102: 
103:   const handleDeletePlantilla = async (id) => {
104:     if (!window.confirm('¿Eliminar plantilla?')) return;
105:     try {
106:       await authFetch(`${API_BASE_URL}/api/turnos/plantilla/${id}`, { method: 'DELETE' });
107:       fetchPlantillas();
108:     } catch (e) { alert('Error al eliminar'); }
109:   };
110: 
111:   const handleDeleteAsignado = async (id) => {
112:     if (!window.confirm('¿Eliminar asignación?')) return;
113:     try {
114:       await authFetch(`${API_BASE_URL}/api/turnos/asignados/${id}`, { method: 'DELETE' });
115:       fetchAsignados();
116:     } catch (e) { alert('Error al eliminar'); }
117:   };
118: 
119:   const handleClone = async () => {
120:     const desde = parseInt(yearFilter) - 1;
121:     const hasta = parseInt(yearFilter);
122:     if (!window.confirm(`Copiar asignaciones de ${desde} a ${hasta}?`)) return;
123:     setClonando(true);
124:     try {
125:       const res = await authFetch(`${API_BASE_URL}/api/turnos/clonar`, {
126:         method: 'POST',
127:         headers: { 'Content-Type': 'application/json' },
128:         body: JSON.stringify({ desde, hasta }),
129:       });
130:       const data = await res.json();
131:       alert(data.message);
132:       fetchAsignados();
133:       fetchYears();
134:     } catch (e) { alert('Error al clonar'); }
135:     setClonando(false);
136:   };
137: 
138:   return (
139:     <div className="p-8 bg-slate-50 min-h-screen">
140:       <div className="flex justify-between items-center mb-8">
141:         <div>
142:           <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Gestión de Turnos</h1>
143:           <p className="text-slate-500 mt-1">Administración de plantillas y asignaciones de horarios</p>
144:         </div>
145:       </div>
146: 
147:       <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 w-fit">
148:         {TABS.map(tab => (
149:           <button key={tab.id} onClick={() => { setActiveTab(tab.id); setShowForm(false); setShowAsignacion(false); }}
150:             className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
151:               activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
152:             }`}
153:           >{tab.icon}{tab.label}</button>
154:         ))}
155:       </div>
156: 
157:       {activeTab === 'plantillas' && (
158:         <div className="space-y-6">
159:           <div className="flex justify-end">
160:             {can('turnos.gestionar') && (
161:               <button onClick={() => { setShowForm(true); setEditing(null); }}
162:                 className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all bg-blue-600 text-white hover:bg-blue-700"
163:               ><Plus size={18} /> Nueva Plantilla</button>
164:             )}
165:           </div>
166: 
167:           {showForm && (
168:             <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
169:               <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
170:                 <TurnoPlantillaForm
171:                   plantilla={editing}
172:                   onSave={() => { setShowForm(false); setEditing(null); fetchPlantillas(); }}
173:                   onCancel={() => { setShowForm(false); setEditing(null); }}
174:                 />
175:               </div>
176:             </div>
177:           )}
178: 
179:           <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
180:             {canScrollRight && (
181:               <div className="absolute right-1 top-3 z-30">
182:                 <button type="button" onClick={scrollRight}
183:                   className="w-9 h-9 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full shadow-lg flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer">
184:                   <ChevronRight size={20} />
185:                 </button>
186:               </div>
187:             )}
188:             <div ref={plantillaScrollRef} onScroll={checkScroll} className="overflow-x-auto">
189:               <table className="w-full text-left min-w-[1000px]">
190:                 <thead>
191:                   <tr className="bg-slate-50/50 border-b border-slate-100 sticky top-0 z-20">
192:                     <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase sticky left-0 bg-slate-50/50 z-30">Código</th>
193:                   <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Nombre</th>
194:                   <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Asign.</th>
195:                   <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Lunes</th>
196:                   <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Martes</th>
197:                   <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Miércoles</th>
198:                   <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Jueves</th>
199:                   <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Viernes</th>
200:                   <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Sábado</th>
201:                   <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Domingo</th>
202:                   <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Tol.</th>
203:                   <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Acciones</th>
204:                 </tr>
205:               </thead>
206:               <tbody className="divide-y divide-slate-50">
207:                 {plantillas.map(p => (
208:                   <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
209:                     <td className="px-6 py-3 font-bold text-slate-700 sticky left-0 bg-white z-10">{p.codigo}</td>
210:                     <td className="px-6 py-3 text-slate-500 text-sm">{p.nombre || '--'}</td>
211:                     <td className="px-6 py-3 text-center">
212:                       <span className={`inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded-full text-[11px] font-bold ${
213:                         p.total_asignaciones === 0 ? 'bg-slate-100 text-slate-400' :
214:                         p.total_asignaciones <= 10 ? 'bg-blue-50 text-blue-600' :
215:                         'bg-emerald-50 text-emerald-600'
216:                       }`}>
217:                         {p.total_asignaciones || 0}
218:                       </span>
219:                     </td>
220:                     {['lunes','martes','miercoles','jueves','viernes','sabado','domingo'].map(d => {
221:                       const entrada = p[`${d}_entrada`];
222:                       const salida = p[`${d}_salida`];
223:                       const habilitado = p[`${d}_habilitado`];
224:                       if (!habilitado) return <td key={d} className="px-6 py-3 text-center text-slate-300 text-xs">--</td>;
225:                       const entradaStr = entrada ? entrada.slice(0,5) : '--';
226:                       const salidaStr = salida ? salida.slice(0,5) : '--';
227:                       return (
228:                         <td key={d} className="px-6 py-3 text-center">
229:                           <span className="text-xs font-bold text-slate-700">{entradaStr} - {salidaStr}</span>
230:                         </td>
231:                       );
232:                     })}
233:                     <td className="px-6 py-3 text-center text-sm text-slate-500">{p.tolerancia_atraso} min</td>
234:                     <td className="px-6 py-3 text-right">
235:                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
236:                         <button onClick={() => { setEditing(p); setShowForm(true); }}
237:                           className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={16} /></button>
238:                         <button onClick={() => handleDeletePlantilla(p.id)}
239:                           className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
240:                       </div>
241:                     </td>
242:                   </tr>
243:                 ))}
244:               </tbody>
245:             </table>
246:             </div>
247:           </div>
248:         </div>
249:       )}
250: 
251:       {activeTab === 'asignaciones' && (
252:         <div className="space-y-6">
253:           <div className="flex flex-wrap items-center gap-4">
254:             <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
255:               <Calendar size={16} className="text-slate-400" />
256:               <select value={yearFilter} onChange={e => { setYearFilter(e.target.value); setPage(1); }}
257:                 className="font-bold text-slate-700 bg-transparent outline-none text-sm cursor-pointer py-1"
258:               >
259:                 {years.map(y => <option key={y} value={y}>{y}</option>)}
260:               </select>
261:             </div>
262:             <div className="relative flex-1 max-w-xs">
263:               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
264:               <input type="text" placeholder="Buscar por nombre, CI o ID..."
265:                 value={filtroBuscar} onChange={e => setFiltroBuscar(e.target.value)}
266:                 className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
267:               />
268:             </div>
269:             <span className="text-sm text-slate-500 font-medium ml-auto">
270:               {pagination.total} registros
271:             </span>
272:             <button onClick={handleClone} disabled={clonando || years.length < 2}
273:               className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all disabled:opacity-50"
274:             ><Copy size={16} /> {clonando ? 'Clonando...' : `Copiar ${parseInt(yearFilter)-1}`}</button>
275:             <button onClick={() => setShowAsignacion(!showAsignacion)}
276:               className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
277:                 showAsignacion ? 'bg-slate-200 text-slate-700' : 'bg-blue-600 text-white hover:bg-blue-700'
278:               }`}
279:             ><Plus size={16} /> {showAsignacion ? 'Cancelar' : 'Asignar'}</button>
280:           </div>
281: 
282:           {showAsignacion && (
283:             <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
284:               <TurnoAsignacionForm
285:                 plantillas={plantillas}
286:                 personal={personal}
287:                 onSave={() => { setShowAsignacion(false); fetchAsignados(); }}
288:                 onCancel={() => setShowAsignacion(false)}
289:               />
290:             </div>
291:           )}
292: 
293:           <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
294:             <table className="w-full text-left">
295:               <thead>
296:                 <tr className="bg-slate-50/50 border-b border-slate-100">
297:                   <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Personal</th>
298:                   <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Turno</th>
299:                   <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Fecha Inicio</th>
300:                   <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Fecha Fin</th>
301:                   <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Acciones</th>
302:                 </tr>
303:               </thead>
304:               <tbody className="divide-y divide-slate-50">
305:                 {asignados.map(a => (
306:                   <tr key={a.id} className="hover:bg-slate-50/50 transition-colors group">
307:                     <td className="px-6 py-4">
308:                       <div className="font-bold text-slate-700">{a.primer_nombre} {a.apellido_paterno}</div>
309:                       <div className="text-xs text-slate-400">CI: {a.ci}</div>
310:                     </td>
311:                     <td className="px-6 py-4">
312:                       <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">{a.turno_codigo}</span>
313:                     </td>
314:                     <td className="px-6 py-4 text-center text-sm text-slate-700">{new Date(a.fecha_inicio).toLocaleDateString()}</td>
315:                     <td className="px-6 py-4 text-center text-sm text-slate-500">{a.fecha_fin ? new Date(a.fecha_fin).toLocaleDateString() : '--'}</td>
316:                     <td className="px-6 py-4 text-right">
317:                       <button onClick={() => handleDeleteAsignado(a.id)}
318:                         className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
319:                         <Trash2 size={18} />
320:                       </button>
321:                     </td>
322:                   </tr>
323:                 ))}
324:               </tbody>
325:             </table>
326:           </div>
327: 
328:           {pagination.totalPages > 1 && (
329:             <div className="flex items-center justify-center gap-3">
330:               <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}
331:                 className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30"
332:               ><ChevronLeft size={18} /></button>
333:               <span className="text-sm font-bold text-slate-500">
334:                 Pág. {page} de {pagination.totalPages}
335:               </span>
336:               <button onClick={() => setPage(Math.min(pagination.totalPages, page + 1))} disabled={page >= pagination.totalPages}
337:                 className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30"
338:               ><ChevronRight size={18} /></button>
339:             </div>
340:           )}
341:         </div>
342:       )}
343: 
344:       {activeTab === 'calendario' && (
345:         <TurnoCalendario plantillas={plantillas} />
346:       )}
347:     </div>
348:   );
349: };
350: 
351: export default TurnosPage;

(End of file - total 351 lines)
</content>
```

---

## Assistant (Plan · Nemotron 3 Ultra Free · 5.4s)

_Thinking:_

Let me also read the related components and the database schema to understand the full picture

**Tool: glob**

**Input:**
```json
{
  "pattern": "frontend/src/components/Turno*.jsx"
}
```

**Output:**
```
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\components\TurnoPlantillaForm.jsx
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\components\TurnoCalendario.jsx
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\components\TurnoAsignacionForm.jsx
```

**Tool: read**

**Input:**
```json
{
  "filePath": "D:\\Vercel Barrios mineros\\RRHH-Barrios-Mineros\\sql\\migration_turnos_asistencia.sql"
}
```

**Output:**
```
<path>D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\sql\migration_turnos_asistencia.sql</path>
<type>file</type>
<content>
1: -- ============================================================
2: -- MIGRACIÓN: Módulo de Turnos + Refinamiento de Asistencia
3: -- ============================================================
4: -- Inspirado en el sistema Asis (FTecSys.mdb)
5: -- ============================================================
6: 
7: -- ============================================================
8: -- 1. TABLAS DE TURNOS
9: -- ============================================================
10: 
11: CREATE TABLE IF NOT EXISTS turnos_plantilla (
12:     id SERIAL PRIMARY KEY,
13:     codigo VARCHAR(50) NOT NULL UNIQUE,
14:     nombre VARCHAR(100),
15: 
16:     lunes_entrada TIME,
17:     lunes_salida TIME,
18:     martes_entrada TIME,
19:     martes_salida TIME,
20:     miercoles_entrada TIME,
21:     miercoles_salida TIME,
22:     jueves_entrada TIME,
23:     jueves_salida TIME,
24:     viernes_entrada TIME,
25:     viernes_salida TIME,
26:     sabado_entrada TIME,
27:     sabado_salida TIME,
28:     domingo_entrada TIME,
29:     domingo_salida TIME,
30: 
31:     lunes_habilitado BOOLEAN DEFAULT true,
32:     martes_habilitado BOOLEAN DEFAULT true,
33:     miercoles_habilitado BOOLEAN DEFAULT true,
34:     jueves_habilitado BOOLEAN DEFAULT true,
35:     viernes_habilitado BOOLEAN DEFAULT true,
36:     sabado_habilitado BOOLEAN DEFAULT true,
37:     domingo_habilitado BOOLEAN DEFAULT true,
38: 
39:     nocturno_lunes BOOLEAN DEFAULT false,
40:     nocturno_martes BOOLEAN DEFAULT false,
41:     nocturno_miercoles BOOLEAN DEFAULT false,
42:     nocturno_jueves BOOLEAN DEFAULT false,
43:     nocturno_viernes BOOLEAN DEFAULT false,
44:     nocturno_sabado BOOLEAN DEFAULT false,
45:     nocturno_domingo BOOLEAN DEFAULT false,
46: 
47:     tolerancia_atraso INT DEFAULT 5,
48:     tolerancia_falta INT DEFAULT 60,
49:     salida_adelantada INT DEFAULT 0,
50:     puntualidad INT DEFAULT 60,
51:     max_extra INT DEFAULT 180,
52:     prioridad VARCHAR(10) DEFAULT 'Normal',
53:     activo BOOLEAN DEFAULT true,
54:     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
55:     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
56: );
57: 
58: CREATE TABLE IF NOT EXISTS turnos_asignados (
59:     id SERIAL PRIMARY KEY,
60:     personal_id INT REFERENCES personal(id) ON DELETE CASCADE,
61:     turno_plantilla_id INT REFERENCES turnos_plantilla(id),
62:     fecha_inicio DATE NOT NULL,
63:     fecha_fin DATE,
64:     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
65: );
66: 
67: CREATE INDEX IF NOT EXISTS idx_turnos_asignados_personal ON turnos_asignados(personal_id);
68: CREATE INDEX IF NOT EXISTS idx_turnos_asignados_fecha ON turnos_asignados(fecha_inicio);
69: CREATE INDEX IF NOT EXISTS idx_turnos_asignados_personal_fecha ON turnos_asignados(personal_id, fecha_inicio);
70: 
71: -- ============================================================
72: -- 2. TABLAS DE REFINAMIENTO DE ASISTENCIA
73: -- ============================================================
74: 
75: CREATE TABLE IF NOT EXISTS cat_motivos_justificacion (
76:     id SERIAL PRIMARY KEY,
77:     detalle VARCHAR(100) NOT NULL
78: );
79: 
80: INSERT INTO cat_motivos_justificacion (detalle) VALUES
81:     ('Permiso General'),
82:     ('Licencia Médica'),
83:     ('Enfermedad'),
84:     ('Particular'),
85:     ('Comisión'),
86:     ('Capacitación'),
87:     ('Declaración jurada')
88: ON CONFLICT DO NOTHING;
89: 
90: CREATE TABLE IF NOT EXISTS justificaciones (
91:     id SERIAL PRIMARY KEY,
92:     personal_id INT REFERENCES personal(id),
93:     fecha DATE NOT NULL,
94:     tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('ENTRADA', 'SALIDA', 'AMBOS', 'FALTA', 'ATRASO')),
95:     hora_justificada TIME,
96:     motivo_id INT REFERENCES cat_motivos_justificacion(id),
97:     motivo_detalle TEXT,
98:     justificante VARCHAR(255),
99:     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
100:     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
101: );
102: 
103: CREATE INDEX IF NOT EXISTS idx_justificaciones_personal_fecha ON justificaciones(personal_id, fecha);
104: 
105: CREATE TABLE IF NOT EXISTS sanciones_atrasos (
106:     id SERIAL PRIMARY KEY,
107:     rango_inicial INT NOT NULL,
108:     rango_final INT NOT NULL,
109:     sancion_desc VARCHAR(250) NOT NULL,
110:     factor DECIMAL(5,2) DEFAULT 0
111: );
112: 
113: INSERT INTO sanciones_atrasos (rango_inicial, rango_final, sancion_desc, factor) VALUES
114:     (31, 60, '2 horas de haber', 0.25),
115:     (61, 90, 'Medio día de haber', 0.50),
116:     (91, 120, 'Un día de haber', 1.00),
117:     (121, 150, 'Dos días de haber', 2.00),
118:     (151, 10000, 'Dos días de haber', 2.00);
119: 
120: CREATE TABLE IF NOT EXISTS sanciones_faltas (
121:     id SERIAL PRIMARY KEY,
122:     rango_inicial INT NOT NULL,
123:     rango_final INT NOT NULL,
124:     sancion_desc VARCHAR(250) NOT NULL,
125:     factor DECIMAL(5,2) DEFAULT 0
126: );
127: 
128: INSERT INTO sanciones_faltas (rango_inicial, rango_final, sancion_desc, factor) VALUES
129:     (1, 1, '2 días de haber', 2.00),
130:     (2, 2, '4 días de haber', 4.00),
131:     (3, 3, '6 días de haber', 6.00),
132:     (4, 4, '8 días de haber', 8.00),
133:     (5, 5, '10 días de haber', 10.00),
134:     (6, 6, '12 días de haber', 12.00),
135:     (7, 7, '14 días de haber', 14.00),
136:     (8, 8, '16 días de haber', 16.00),
137:     (9, 9, '18 días de haber', 18.00),
138:     (10, 30, 'Despido', 30.00);
139: 
140: CREATE TABLE IF NOT EXISTS auditoria_asistencia (
141:     id SERIAL PRIMARY KEY,
142:     usuario_id INT REFERENCES usuarios(id),
143:     evento VARCHAR(50) NOT NULL,
144:     detalle TEXT,
145:     fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
146: );
147: 
148: CREATE INDEX IF NOT EXISTS idx_auditoria_asistencia_evento ON auditoria_asistencia(evento);
149: CREATE INDEX IF NOT EXISTS idx_auditoria_asistencia_fecha ON auditoria_asistencia(fecha);
150: 
151: -- ============================================================
152: -- 3. MODIFICACIONES A TABLAS EXISTENTES
153: -- ============================================================
154: 
155: -- Agregar columna estado a asistencia_diaria
156: -- 1=Normal, 2=Atraso, 3=Justificado, 4=Falta, 5=Nocturno,
157: -- 6=Sobretiempo, 7=SalidaAdelantada, 8=Incompleta, 9=SinMarcación
158: ALTER TABLE asistencia_diaria ADD COLUMN IF NOT EXISTS estado INT DEFAULT 1;
159: ALTER TABLE asistencia_diaria ADD COLUMN IF NOT EXISTS minutos_atraso INT DEFAULT 0;
160: ALTER TABLE asistencia_diaria ADD COLUMN IF NOT EXISTS justificacion_id INT REFERENCES justificaciones(id);

(End of file - total 160 lines)
</content>
```

---

## Assistant (Plan · Nemotron 3 Ultra Free · 55.6s)

_Thinking:_

Now let me read the frontend components related to turn

**Tool: read**

**Input:**
```json
{
  "filePath": "D:\\Vercel Barrios mineros\\RRHH-Barrios-Mineros\\frontend\\src\\components\\TurnoPlantillaForm.jsx"
}
```

**Output:**
```
<path>D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\components\TurnoPlantillaForm.jsx</path>
<type>file</type>
<content>
1: import React, { useState, useEffect } from 'react';
2: import { Save, X } from 'lucide-react';
3: import { API_BASE_URL } from '../config/api';
4: 
5: const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
6: 
7: const defaultPlantilla = {
8:   codigo: '', nombre: '',
9:   lunes_entrada: '', lunes_salida: '',
10:   martes_entrada: '', martes_salida: '',
11:   miercoles_entrada: '', miercoles_salida: '',
12:   jueves_entrada: '', jueves_salida: '',
13:   viernes_entrada: '', viernes_salida: '',
14:   sabado_entrada: '', sabado_salida: '',
15:   domingo_entrada: '', domingo_salida: '',
16:   lunes_habilitado: true, martes_habilitado: true, miercoles_habilitado: true,
17:   jueves_habilitado: true, viernes_habilitado: true, sabado_habilitado: true, domingo_habilitado: true,
18:   nocturno_lunes: false, nocturno_martes: false, nocturno_miercoles: false,
19:   nocturno_jueves: false, nocturno_viernes: false, nocturno_sabado: false, nocturno_domingo: false,
20:   tolerancia_atraso: 5, tolerancia_falta: 60, salida_adelantada: 0, puntualidad: 60, max_extra: 180, prioridad: 'Normal',
21: };
22: 
23: const TurnoPlantillaForm = ({ plantilla, onSave, onCancel }) => {
24:   const [form, setForm] = useState(defaultPlantilla);
25:   const [saving, setSaving] = useState(false);
26: 
27:   useEffect(() => {
28:     if (plantilla) {
29:       const f = {};
30:       for (const k of Object.keys(defaultPlantilla)) f[k] = plantilla[k] ?? defaultPlantilla[k];
31:       setForm(f);
32:     } else {
33:       setForm(defaultPlantilla);
34:     }
35:   }, [plantilla]);
36: 
37:   const set = (key, val) => setForm(p => ({ ...p, [key]: val }));
38: 
39:   const handleSubmit = async (e) => {
40:     e.preventDefault();
41:     setSaving(true);
42:     try {
43:       const url = plantilla
44:         ? `${API_BASE_URL}/api/turnos/plantilla/${plantilla.id}`
45:         : `${API_BASE_URL}/api/turnos/plantilla`;
46:       const method = plantilla ? 'PUT' : 'POST';
47: 
48:       const res = await fetch(url, {
49:         method,
50:         headers: { 'Content-Type': 'application/json' },
51:         body: JSON.stringify(form),
52:       });
53:       if (!res.ok) throw new Error(await res.text());
54:       onSave();
55:     } catch (err) {
56:       alert('Error al guardar: ' + err.message);
57:     } finally {
58:       setSaving(false);
59:     }
60:   };
61: 
62:   const diaLabel = { lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles', jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo' };
63: 
64:   return (
65:     <form onSubmit={handleSubmit} className="space-y-6">
66:       <div className="flex items-center justify-between">
67:         <h2 className="text-xl font-bold text-slate-800">{plantilla ? 'Editar Plantilla' : 'Nueva Plantilla de Turno'}</h2>
68:         <button type="button" onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"><X size={20} /></button>
69:       </div>
70: 
71:       <div className="grid grid-cols-2 gap-4">
72:         <div className="space-y-2">
73:           <label className="text-xs font-bold text-slate-400 uppercase">Código *</label>
74:           <input value={form.codigo} onChange={e => set('codigo', e.target.value)} required
75:             placeholder="ej: 07:17, turno 08-20"
76:             className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
77:         </div>
78:         <div className="space-y-2">
79:           <label className="text-xs font-bold text-slate-400 uppercase">Nombre</label>
80:           <input value={form.nombre || ''} onChange={e => set('nombre', e.target.value)}
81:             className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
82:         </div>
83:       </div>
84: 
85:       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
86:         {DIAS.map(d => (
87:           <div key={d} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
88:             <div className="flex items-center justify-between">
89:               <label className="text-sm font-bold text-slate-700">{diaLabel[d]}</label>
90:               <label className="flex items-center gap-2 text-xs text-slate-500">
91:                 <input type="checkbox" checked={form[`${d}_habilitado`]}
92:                   onChange={e => set(`${d}_habilitado`, e.target.checked)}
93:                   className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
94:                 Activo
95:               </label>
96:             </div>
97:             {form[`${d}_habilitado`] && (
98:               <>
99:                 <div className="grid grid-cols-2 gap-2">
100:                   <div>
101:                     <label className="text-[10px] font-bold text-slate-400 uppercase">Entrada</label>
102:                     <input type="time" value={form[`${d}_entrada`] || ''}
103:                       onChange={e => set(`${d}_entrada`, e.target.value)}
104:                       className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
105:                   </div>
106:                   <div>
107:                     <label className="text-[10px] font-bold text-slate-400 uppercase">Salida</label>
108:                     <input type="time" value={form[`${d}_salida`] || ''}
109:                       onChange={e => set(`${d}_salida`, e.target.value)}
110:                       className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
111:                   </div>
112:                 </div>
113:                 <label className="flex items-center gap-2 text-xs text-slate-500">
114:                   <input type="checkbox" checked={form[`nocturno_${d}`]}
115:                     onChange={e => set(`nocturno_${d}`, e.target.checked)}
116:                     className="rounded border-slate-300 text-purple-600 focus:ring-purple-500" />
117:                   Nocturno
118:                 </label>
119:               </>
120:             )}
121:           </div>
122:         ))}
123:       </div>
124: 
125:       <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
126:         <div className="space-y-2">
127:           <label className="text-xs font-bold text-slate-400 uppercase">Tol. Atraso (min)</label>
128:           <input type="number" value={form.tolerancia_atraso} onChange={e => set('tolerancia_atraso', parseInt(e.target.value) || 0)}
129:             className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
130:         </div>
131:         <div className="space-y-2">
132:           <label className="text-xs font-bold text-slate-400 uppercase">Tol. Falta (min)</label>
133:           <input type="number" value={form.tolerancia_falta} onChange={e => set('tolerancia_falta', parseInt(e.target.value) || 0)}
134:             className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
135:         </div>
136:         <div className="space-y-2">
137:           <label className="text-xs font-bold text-slate-400 uppercase">Salida Adelantada</label>
138:           <input type="number" value={form.salida_adelantada} onChange={e => set('salida_adelantada', parseInt(e.target.value) || 0)}
139:             className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
140:         </div>
141:         <div className="space-y-2">
142:           <label className="text-xs font-bold text-slate-400 uppercase">Puntualidad</label>
143:           <input type="number" value={form.puntualidad} onChange={e => set('puntualidad', parseInt(e.target.value) || 0)}
144:             className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
145:         </div>
146:         <div className="space-y-2">
147:           <label className="text-xs font-bold text-slate-400 uppercase">Max Extra</label>
148:           <input type="number" value={form.max_extra} onChange={e => set('max_extra', parseInt(e.target.value) || 0)}
149:             className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
150:         </div>
151:       </div>
152: 
153:       <div className="flex justify-end gap-3">
154:         <button type="button" onClick={onCancel}
155:           className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all">Cancelar</button>
156:         <button type="submit" disabled={saving}
157:           className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all">
158:           <Save size={18} /> {saving ? 'Guardando...' : (plantilla ? 'Actualizar' : 'Crear Plantilla')}
159:         </button>
160:       </div>
161:     </form>
162:   );
163: };
164: 
165: export default TurnoPlantillaForm;

(End of file - total 165 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "D:\\Vercel Barrios mineros\\RRHH-Barrios-Mineros\\frontend\\src\\components\\TurnoAsignacionForm.jsx"
}
```

**Output:**
```
<path>D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\components\TurnoAsignacionForm.jsx</path>
<type>file</type>
<content>
1: import React, { useState } from 'react';
2: import { Save, X } from 'lucide-react';
3: import { API_BASE_URL, authFetch } from '../config/api';
4: 
5: const TurnoAsignacionForm = ({ plantillas, personal, onSave, onCancel }) => {
6:   const [form, setForm] = useState({
7:     personal_id: '',
8:     turno_plantilla_id: '',
9:     fecha_inicio: new Date().toISOString().split('T')[0],
10:     fecha_fin: '',
11:   });
12:   const [saving, setSaving] = useState(false);
13:   const [sinTurno, setSinTurno] = useState([]);
14: 
15:   const loadSinTurno = async () => {
16:     try {
17:       const res = await authFetch(`${API_BASE_URL}/api/turnos/personal-sin-turno`);
18:       const data = await res.json();
19:       setSinTurno(data);
20:     } catch (e) { console.error(e); }
21:   };
22: 
23:   const set = (key, val) => setForm(p => ({ ...p, [key]: val }));
24: 
25:   const handleSubmit = async (e) => {
26:     e.preventDefault();
27:     setSaving(true);
28:     try {
29:       const res = await authFetch(`${API_BASE_URL}/api/turnos/asignados`, {
30:         method: 'POST',
31:         headers: { 'Content-Type': 'application/json' },
32:         body: JSON.stringify(form),
33:       });
34:       if (!res.ok) throw new Error(await res.text());
35:       onSave();
36:     } catch (err) {
37:       alert('Error al asignar: ' + err.message);
38:     } finally {
39:       setSaving(false);
40:     }
41:   };
42: 
43:   return (
44:     <form onSubmit={handleSubmit} className="space-y-6">
45:       <div className="flex items-center justify-between">
46:         <h2 className="text-xl font-bold text-slate-800">Asignar Turno a Personal</h2>
47:         <button type="button" onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"><X size={20} /></button>
48:       </div>
49: 
50:       <div className="grid grid-cols-2 gap-4">
51:         <div className="space-y-2">
52:           <label className="text-xs font-bold text-slate-400 uppercase">Personal *</label>
53:           <select value={form.personal_id} onChange={e => set('personal_id', e.target.value)} required
54:             className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none">
55:             <option value="">Seleccionar personal...</option>
56:             {personal.map(p => (
57:               <option key={p.id} value={p.id}>{p.primer_nombre} {p.apellido_paterno} - CI: {p.ci}</option>
58:             ))}
59:           </select>
60:           <button type="button" onClick={loadSinTurno}
61:             className="text-xs text-blue-600 hover:text-blue-800 mt-1">
62:             Mostrar personal sin turno
63:           </button>
64:           {sinTurno.length > 0 && (
65:             <div className="mt-2 max-h-32 overflow-y-auto bg-slate-50 rounded-xl p-2">
66:               <p className="text-xs font-bold text-slate-500 mb-1">Sin turno asignado ({sinTurno.length}):</p>
67:               {sinTurno.slice(0, 10).map(p => (
68:                 <button key={p.id} type="button" onClick={() => set('personal_id', p.id)}
69:                   className="block text-xs text-left w-full px-2 py-1 hover:bg-blue-50 rounded text-slate-600">
70:                   {p.primer_nombre} {p.apellido_paterno}
71:                 </button>
72:               ))}
73:             </div>
74:           )}
75:         </div>
76: 
77:         <div className="space-y-2">
78:           <label className="text-xs font-bold text-slate-400 uppercase">Plantilla de Turno *</label>
79:           <select value={form.turno_plantilla_id} onChange={e => set('turno_plantilla_id', e.target.value)} required
80:             className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none">
81:             <option value="">Seleccionar turno...</option>
82:             {plantillas.map(tp => (
83:               <option key={tp.id} value={tp.id}>{tp.codigo} - {tp.nombre || ''}</option>
84:             ))}
85:           </select>
86:         </div>
87:       </div>
88: 
89:       <div className="grid grid-cols-2 gap-4">
90:         <div className="space-y-2">
91:           <label className="text-xs font-bold text-slate-400 uppercase">Fecha Inicio *</label>
92:           <input type="date" value={form.fecha_inicio} onChange={e => set('fecha_inicio', e.target.value)} required
93:             className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
94:         </div>
95:         <div className="space-y-2">
96:           <label className="text-xs font-bold text-slate-400 uppercase">Fecha Fin (opcional)</label>
97:           <input type="date" value={form.fecha_fin} onChange={e => set('fecha_fin', e.target.value)}
98:             className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
99:         </div>
100:       </div>
101: 
102:       <div className="flex justify-end gap-3">
103:         <button type="button" onClick={onCancel}
104:           className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200">Cancelar</button>
105:         <button type="submit" disabled={saving}
106:           className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50">
107:           <Save size={18} /> {saving ? 'Guardando...' : 'Asignar Turno'}
108:         </button>
109:       </div>
110:     </form>
111:   );
112: };
113: 
114: export default TurnoAsignacionForm;

(End of file - total 114 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "D:\\Vercel Barrios mineros\\RRHH-Barrios-Mineros\\frontend\\src\\components\\TurnoCalendario.jsx"
}
```

**Output:**
```
<path>D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\frontend\src\components\TurnoCalendario.jsx</path>
<type>file</type>
<content>
1: import { useState, useEffect } from 'react';
2: import {
3:   ChevronLeft, ChevronRight, Download, X, Calendar, Clock, Users,
4:   AlertTriangle
5: } from 'lucide-react';
6: import { API_BASE_URL, authFetch } from '../config/api';
7: 
8: const TIPO_TURNO = {
9:   manana:   { label: 'Mañana',   abbr: 'M',  bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-200',  dot: 'bg-blue-500' },
10:   tarde:    { label: 'Tarde',    abbr: 'T',  bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
11:   nocturno: { label: 'Noche',    abbr: 'N',  bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
12:   libre:    { label: 'Libre',    abbr: 'L',  bg: 'bg-emerald-100',text: 'text-emerald-700',border: 'border-emerald-200',dot: 'bg-emerald-500' },
13:   completo: { label: 'Completo', abbr: 'C',  bg: 'bg-cyan-100',   text: 'text-cyan-700',   border: 'border-cyan-200',   dot: 'bg-cyan-500' },
14: };
15: 
16: const DIAS = ['lunes','martes','miercoles','jueves','viernes','sabado','domingo'];
17: const DIAS_LABEL = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
18: const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
19: 
20: function getTipoTurno(row, diaSem) {
21:   if (!row[`${diaSem}_habilitado`]) return 'libre';
22:   if (row[`nocturno_${diaSem}`]) return 'nocturno';
23:   const entrada = row[`${diaSem}_entrada`];
24:   if (!entrada) return 'libre';
25:   const h = parseInt(entrada.toString().split(':')[0]);
26:   if (h < 13) return 'manana';
27:   if (h < 19) return 'tarde';
28:   return 'completo';
29: }
30: 
31: function formatTime(t) {
32:   if (!t) return '--:--';
33:   return t.toString().slice(0, 5);
34: }
35: 
36: function generateICS(data, mes, anio, plantillas) {
37:   const lines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//RRHH Barrios Mineros//ES','CALSCALE:GREGORIAN'];
38:   data.forEach(row => {
39:     const inicio = new Date(row.fecha_inicio);
40:     const fin = row.fecha_fin ? new Date(row.fecha_fin) : new Date(row.fecha_inicio);
41:     const diaSem = DIAS[inicio.getDay() === 0 ? 6 : inicio.getDay() - 1];
42:     const tt = getTipoTurno(row, diaSem);
43:     const turnoLabel = TIPO_TURNO[tt]?.label || 'Turno';
44:     for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
45:       const ds = DIAS[d.getDay() === 0 ? 6 : d.getDay() - 1];
46:       const ttl = getTipoTurno(row, ds);
47:       const tLabel = TIPO_TURNO[ttl]?.label || 'Turno';
48:       const ymd = d.toISOString().split('T')[0].replace(/-/g, '');
49:       const next = new Date(d); next.setDate(next.getDate() + 1);
50:       const ymdNext = next.toISOString().split('T')[0].replace(/-/g, '');
51:       const entrada = formatTime(row[`${ds}_entrada`]);
52:       const salida = formatTime(row[`${ds}_salida`]);
53:       lines.push('BEGIN:VEVENT');
54:       lines.push(`DTSTART;VALUE=DATE:${ymd}`);
55:       lines.push(`DTEND;VALUE=DATE:${ymdNext}`);
56:       lines.push(`SUMMARY:${tLabel} - ${row.primer_nombre} ${row.apellido_paterno}`);
57:       lines.push(`DESCRIPTION:${entrada} - ${salida}\\n${row.unidad_servicio || ''}`);
58:       lines.push('END:VEVENT');
59:     }
60:   });
61:   lines.push('END:VCALENDAR');
62:   return lines.join('\r\n');
63: }
64: 
65: export default function TurnoCalendario({ plantillas }) {
66:   const now = new Date();
67:   const [mes, setMes] = useState(now.getMonth() + 1);
68:   const [anio, setAnio] = useState(now.getFullYear());
69:   const [servicio, setServicio] = useState('');
70:   const [data, setData] = useState([]);
71:   const [loading, setLoading] = useState(false);
72:   const [diaModal, setDiaModal] = useState(null);
73:   const [diaPersonal, setDiaPersonal] = useState([]);
74:   const [diaLoading, setDiaLoading] = useState(false);
75:   const [draggedItem, setDraggedItem] = useState(null);
76: 
77:   const fetchData = async () => {
78:     setLoading(true);
79:     try {
80:       const params = new URLSearchParams({ mes, anio });
81:       if (servicio) params.set('servicio', servicio);
82:       const res = await authFetch(`${API_BASE_URL}/api/turnos/calendario?${params}`);
83:       const d = await res.json();
84:       setData(Array.isArray(d) ? d : []);
85:     } catch (e) { console.error(e); }
86:     setLoading(false);
87:   };
88: 
89:   useEffect(() => { fetchData(); }, [mes, anio, servicio]);
90: 
91:   const diasDelMes = new Date(anio, mes, 0).getDate();
92:   const primerDia = new Date(anio, mes - 1, 1).getDay();
93:   const hoy = new Date();
94: 
95:   const mesAnterior = () => { if (mes === 1) { setMes(12); setAnio(a => a - 1); } else setMes(m => m - 1); };
96:   const mesSiguiente = () => { if (mes === 12) { setMes(1); setAnio(a => a + 1); } else setMes(m => m + 1); };
97:   const irHoy = () => { setMes(now.getMonth() + 1); setAnio(now.getFullYear()); };
98: 
99:   const groupedByPersona = {};
100:   data.forEach(item => {
101:     const key = `${item.personal_id}`;
102:     if (!groupedByPersona[key]) {
103:       groupedByPersona[key] = { ...item, turnos: [] };
104:     }
105:     groupedByPersona[key].turnos.push(item);
106:   });
107: 
108:   function getTurnoForDay(person, dia) {
109:     const fecha = `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
110:     const turno = person.turnos.find(t => {
111:       const inicio = t.fecha_inicio.slice(0, 10);
112:       const fin = t.fecha_fin ? t.fecha_fin.slice(0, 10) : inicio;
113:       return fecha >= inicio && fecha <= fin;
114:     });
115:     if (!turno) return null;
116:     const fechaObj = new Date(fecha);
117:     const diaSem = DIAS[fechaObj.getDay() === 0 ? 6 : fechaObj.getDay() - 1];
118:     const tipo = getTipoTurno(turno, diaSem);
119:     return { ...turno, tipo, diaSem, fecha };
120:   }
121: 
122:   const openDiaModal = async (dia) => {
123:     setDiaModal(dia);
124:     setDiaLoading(true);
125:     try {
126:       const res = await authFetch(`${API_BASE_URL}/api/turnos/calendario/dia?mes=${mes}&anio=${anio}&dia=${dia}`);
127:       const d = await res.json();
128:       setDiaPersonal(Array.isArray(d) ? d : []);
129:     } catch (e) { setDiaPersonal([]); }
130:     setDiaLoading(false);
131:   };
132: 
133:   const handleDragStart = (e, personalId, dia) => {
134:     setDraggedItem({ personalId, dia });
135:     e.dataTransfer.effectAllowed = 'move';
136:     e.dataTransfer.setData('text/plain', `${personalId}:${dia}`);
137:   };
138: 
139:   const handleDrop = async (e, targetDia) => {
140:     e.preventDefault();
141:     if (!draggedItem) return;
142:     const { personalId, dia: sourceDia } = draggedItem;
143:     if (sourceDia === targetDia) { setDraggedItem(null); return; }
144: 
145:     const person = groupedByPersona[personalId];
146:     if (!person) { setDraggedItem(null); return; }
147:     const sourceTurno = getTurnoForDay(person, sourceDia);
148:     if (!sourceTurno || sourceTurno.fecha_fin) { setDraggedItem(null); return; }
149: 
150:     const newFecha = `${anio}-${String(mes).padStart(2, '0')}-${String(targetDia).padStart(2, '0')}`;
151:     try {
152:       const res = await authFetch(`${API_BASE_URL}/api/turnos/asignados/${sourceTurno.id}`, {
153:         method: 'PUT',
154:         headers: { 'Content-Type': 'application/json' },
155:         body: JSON.stringify({ fecha_inicio: newFecha, fecha_fin: newFecha }),
156:       });
157:       if (res.ok) fetchData();
158:     } catch (e) { console.error(e); }
159:     setDraggedItem(null);
160:   };
161: 
162:   const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
163: 
164:   const exportICS = () => {
165:     const ics = generateICS(data, mes, anio, plantillas);
166:     const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
167:     const link = document.createElement('a');
168:     link.href = URL.createObjectURL(blob);
169:     link.download = `turnos_${MESES[mes-1]}_${anio}.ics`;
170:     link.click();
171:     URL.revokeObjectURL(link.href);
172:   };
173: 
174:   return (
175:     <div className="space-y-6">
176:       <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
177:         <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
178:           <div className="flex items-center gap-4">
179:             <button onClick={mesAnterior} className="p-2 hover:bg-slate-100 rounded-xl"><ChevronLeft size={20} /></button>
180:             <button onClick={irHoy}
181:               className="text-xs font-bold px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors mr-1"
182:             >Hoy</button>
183:             <h2 className="text-xl font-bold text-slate-700 min-w-[180px]">
184:               {MESES[mes-1]} {anio}
185:             </h2>
186:             <button onClick={mesSiguiente} className="p-2 hover:bg-slate-100 rounded-xl"><ChevronRight size={20} /></button>
187:           </div>
188:           <div className="flex items-center gap-3 flex-wrap">
189:             <input type="text" placeholder="Filtrar servicio..." value={servicio}
190:               onChange={e => setServicio(e.target.value)}
191:               className="px-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-44" />
192:             <button onClick={exportICS}
193:               className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors"
194:             ><Download size={15} /> ICS</button>
195:           </div>
196:         </div>
197: 
198:         <div className="flex gap-3 mb-5 flex-wrap text-xs">
199:           {Object.entries(TIPO_TURNO).map(([k, v]) => (
200:             <span key={k} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${v.bg} ${v.text} ${v.border} font-bold`}>
201:               <span className={`w-2 h-2 rounded-full ${v.dot}`} />
202:               {v.label}
203:             </span>
204:           ))}
205:         </div>
206: 
207:         {loading ? (
208:           <div className="text-center py-10 text-slate-400">Cargando calendario...</div>
209:         ) : (
210:           <div className="overflow-x-auto">
211:             <table className="w-full text-xs">
212:               <thead>
213:                 <tr>
214:                   <th className="px-3 py-2.5 text-left font-bold text-slate-500 uppercase sticky left-0 bg-white z-10 min-w-[140px]">Personal</th>
215:                   <th className="px-3 py-2.5 text-left font-bold text-slate-500 uppercase">Servicio</th>
216:                   <th className="px-3 py-2.5 text-center font-bold text-slate-500 uppercase min-w-[60px]">Turno</th>
217:                   {Array.from({ length: diasDelMes }, (_, i) => {
218:                     const d = new Date(anio, mes - 1, i + 1);
219:                     const esFinde = d.getDay() === 0 || d.getDay() === 6;
220:                     const esHoy = d.toDateString() === hoy.toDateString();
221:                     return (
222:                       <th key={i} className={`px-1.5 py-2 text-center text-[10px] font-bold min-w-[28px] ${
223:                         esHoy ? 'text-blue-600 bg-blue-50' : esFinde ? 'text-rose-400' : 'text-slate-500'
224:                       }`}>
225:                         {i + 1}
226:                       </th>
227:                     );
228:                   })}
229:                 </tr>
230:               </thead>
231:               <tbody>
232:                 {Object.values(groupedByPersona).length === 0 ? (
233:                   <tr>
234:                     <td colSpan={3 + diasDelMes} className="text-center py-16 text-slate-300">
235:                       <Calendar size={48} className="mx-auto mb-4 opacity-20" />
236:                       No hay turnos asignados para este mes
237:                     </td>
238:                   </tr>
239:                 ) : (
240:                   Object.values(groupedByPersona).map(p => (
241:                     <tr key={p.personal_id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors group">
242:                       <td className="px-3 py-2 font-medium text-slate-700 sticky left-0 bg-white group-hover:bg-slate-50/50 transition-colors">
243:                         <div className="flex items-center gap-2">
244:                           <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-[10px] flex-shrink-0">
245:                             {p.primer_nombre?.[0]}{p.apellido_paterno?.[0]}
246:                           </div>
247:                           <span className="truncate">{p.primer_nombre} {p.apellido_paterno}</span>
248:                         </div>
249:                       </td>
250:                       <td className="px-3 py-2 text-slate-400 truncate max-w-[120px]">{p.unidad_servicio || '--'}</td>
251:                       <td className="px-3 py-2 text-center">
252:                         <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold">{p.turno_codigo}</span>
253:                       </td>
254:                       {Array.from({ length: diasDelMes }, (_, i) => {
255:                         const dia = i + 1;
256:                         const turnoDia = getTurnoForDay(p, dia);
257:                         const fechaObj = new Date(anio, mes - 1, dia);
258:                         const esHoy = fechaObj.toDateString() === hoy.toDateString();
259:                         const esFinde = fechaObj.getDay() === 0 || fechaObj.getDay() === 6;
260:                         const tt = turnoDia ? (TIPO_TURNO[turnoDia.tipo] || null) : null;
261:                         const isDragging = draggedItem?.personalId === p.personal_id && draggedItem?.dia === dia;
262: 
263:                         return (
264:                           <td key={i}
265:                             className={`px-1.5 py-2 text-center align-middle cursor-pointer select-none border-b border-slate-50 ${
266:                               isDragging ? 'opacity-40' : ''
267:                             }`}
268:                             onClick={() => { if (turnoDia) openDiaModal(dia); }}
269:                             draggable={!!turnoDia && !turnoDia.fecha_fin}
270:                             onDragStart={(e) => handleDragStart(e, p.personal_id, dia)}
271:                             onDragOver={handleDragOver}
272:                             onDrop={(e) => handleDrop(e, dia)}
273:                           >
274:                             {tt ? (
275:                               <div className={`w-full h-8 rounded-lg flex items-center justify-center ${tt.bg} ${tt.text} font-bold text-[11px] border ${tt.border} transition-all hover:scale-105`}
276:                                 title={`${tt.label}\n${formatTime(turnoDia[`${turnoDia.diaSem}_entrada`])} - ${formatTime(turnoDia[`${turnoDia.diaSem}_salida`])}`}
277:                               >
278:                                 {tt.abbr}
279:                               </div>
280:                             ) : (
281:                               <span className={`text-slate-200 ${esFinde ? 'text-rose-200' : ''}`}>·</span>
282:                             )}
283:                             {esHoy && !tt && (
284:                               <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full" />
285:                             )}
286:                           </td>
287:                         );
288:                       })}
289:                     </tr>
290:                   ))
291:                 )}
292:               </tbody>
293:             </table>
294:           </div>
295:         )}
296:       </div>
297: 
298:       {diaModal && (
299:         <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
300:           onClick={() => setDiaModal(null)}>
301:           <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-100 max-h-[85vh] overflow-y-auto"
302:             onClick={e => e.stopPropagation()}>
303:             <div className="p-6 border-b border-slate-100 flex items-center justify-between">
304:               <div className="flex items-center gap-3">
305:                 <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Calendar size={20} /></div>
306:                 <div>
307:                   <h3 className="text-lg font-bold text-slate-800">{diaModal} de {MESES[mes-1]} {anio}</h3>
308:                   <p className="text-xs text-slate-400">
309:                     {['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'][new Date(anio, mes-1, diaModal).getDay()]}
310:                   </p>
311:                 </div>
312:               </div>
313:               <button onClick={() => setDiaModal(null)}
314:                 className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"><X size={18} /></button>
315:             </div>
316:             <div className="p-6">
317:               {diaLoading ? (
318:                 <div className="text-center py-8 text-slate-400">Cargando...</div>
319:               ) : diaPersonal.length === 0 ? (
320:                 <div className="text-center py-8 text-slate-400">
321:                   <Users size={32} className="mx-auto mb-3 opacity-30" />
322:                   Sin personal asignado este día
323:                 </div>
324:               ) : (
325:                 <div className="space-y-2">
326:                   {diaPersonal.map((emp, i) => {
327:                     const diaSem = DIAS[new Date(anio, mes-1, diaModal).getDay() === 0 ? 6 : new Date(anio, mes-1, diaModal).getDay() - 1];
328:                     const tt = getTipoTurno(emp, diaSem);
329:                     const tStyle = TIPO_TURNO[tt] || null;
330:                     return (
331:                       <div key={emp.id || i}
332:                         className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
333:                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${tStyle?.bg || 'bg-slate-200'} ${tStyle?.text || 'text-slate-500'}`}>
334:                           {emp.primer_nombre?.[0]}{emp.apellido_paterno?.[0]}
335:                         </div>
336:                         <div className="flex-1 min-w-0">
337:                           <p className="font-bold text-slate-700">{emp.primer_nombre} {emp.apellido_paterno}</p>
338:                           <p className="text-xs text-slate-400 truncate">{emp.unidad_servicio || ''} {emp.cargo_actual ? `· ${emp.cargo_actual}` : ''}</p>
339:                         </div>
340:                         <div className="text-right flex items-center gap-2">
341:                           {tStyle && (
342:                             <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${tStyle.bg} ${tStyle.text}`}>
343:                               <span className={`w-2 h-2 rounded-full ${tStyle.dot}`} />
344:                               {tStyle.label}
345:                             </span>
346:                           )}
347:                           <span className="text-xs font-mono text-slate-500">
348:                             {formatTime(emp.entrada)} - {formatTime(emp.salida)}
349:                           </span>
350:                         </div>
351:                       </div>
352:                     );
353:                   })}
354:                 </div>
355:               )}
356:             </div>
357:           </div>
358:         </div>
359:       )}
360:     </div>
361:   );
362: }

(End of file - total 362 lines)
</content>
```

---

## Assistant (Plan · Nemotron 3 Ultra Free · 32.3s)

_Thinking:_

Let me also check the routes and API configuration to understand the full backend structure

**Tool: glob**

**Input:**
```json
{
  "pattern": "backend/src/routes/*.js"
}
```

**Output:**
```
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\routes\vacacionesRoutes.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\routes\usuarioRoutes.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\routes\turnosRoutes.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\routes\selfServiceRoutes.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\routes\sancionesRoutes.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\routes\roleRoutes.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\routes\reporteRoutes.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\routes\personalRoutes.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\routes\permisosRoutes.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\routes\notificacionesRoutes.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\routes\justificacionesRoutes.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\routes\dashboardRoutes.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\routes\correspondenciaRoutes.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\routes\configuracionRoutes.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\routes\configRoutes.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\routes\comunicadosRoutes.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\routes\certificadosRoutes.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\routes\biometricoRoutes.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\routes\authRoutes.js
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\routes\asistenciaRoutes.js
```

---

## Assistant (Plan · Nemotron 3 Ultra Free · 15.3s)

_Thinking:_

Let me read the turnos routes to understand the API endpoints

**Tool: read**

**Input:**
```json
{
  "filePath": "D:\\Vercel Barrios mineros\\RRHH-Barrios-Mineros\\backend\\src\\routes\\turnosRoutes.js"
}
```

**Output:**
```
<path>D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\routes\turnosRoutes.js</path>
<type>file</type>
<content>
1: const express = require('express');
2: const router = express.Router();
3: const TurnosController = require('../controllers/turnosController');
4: const { authMiddleware, checkPermission } = require('../middleware/authMiddleware');
5: 
6: router.use(authMiddleware);
7: 
8: router.get('/plantilla', checkPermission('turnos.ver'), TurnosController.getPlantillas);
9: router.get('/plantilla/:id', checkPermission('turnos.ver'), TurnosController.getPlantilla);
10: router.post('/plantilla', checkPermission('turnos.gestionar'), TurnosController.createPlantilla);
11: router.put('/plantilla/:id', checkPermission('turnos.gestionar'), TurnosController.updatePlantilla);
12: router.delete('/plantilla/:id', checkPermission('turnos.gestionar'), TurnosController.deletePlantilla);
13: 
14: router.get('/asignados', checkPermission('turnos.ver'), TurnosController.getAsignados);
15: router.get('/asignados/:id', checkPermission('turnos.ver'), TurnosController.getAsignado);
16: router.post('/asignados', checkPermission('turnos.gestionar'), TurnosController.createAsignado);
17: router.put('/asignados/:id', checkPermission('turnos.gestionar'), TurnosController.updateAsignado);
18: router.delete('/asignados/:id', checkPermission('turnos.gestionar'), TurnosController.deleteAsignado);
19: router.delete('/asignados', checkPermission('turnos.gestionar'), TurnosController.deleteAsignadosByPersonal);
20: 
21: router.get('/empleado/:personalId', checkPermission('turnos.ver'), TurnosController.getTurnoEmpleado);
22: router.get('/calendario', checkPermission('turnos.ver'), TurnosController.getCalendario);
23: router.get('/calendario/dia', checkPermission('turnos.ver'), TurnosController.getCalendarioDia);
24: router.get('/personal-sin-turno', checkPermission('turnos.ver'), TurnosController.getPersonalSinTurno);
25: router.get('/years', checkPermission('turnos.ver'), TurnosController.getYears);
26: router.post('/clonar', checkPermission('turnos.gestionar'), TurnosController.cloneAsignaciones);
27: 
28: module.exports = router;

(End of file - total 28 lines)
</content>
```

---

## Assistant (Plan · Nemotron 3 Ultra Free · 7.1s)

_Thinking:_

Let me also check the db config and understand how the database works

**Tool: read**

**Input:**
```json
{
  "filePath": "D:\\Vercel Barrios mineros\\RRHH-Barrios-Mineros\\backend\\src\\config\\db.js"
}
```

**Output:**
```
<path>D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\config\db.js</path>
<type>file</type>
<content>
1: const { Pool } = require('pg');
2: require('dotenv').config({ path: __dirname + '/../../.env' });
3: 
4: const poolConfig = {
5:   user: process.env.DB_USER,
6:   database: process.env.DB_NAME,
7:   host: process.env.DB_HOST || '/var/run/postgresql',
8:   port: process.env.DB_PORT,
9: };
10: if (process.env.DB_PASSWORD) poolConfig.password = process.env.DB_PASSWORD;
11: if (process.env.DB_SSL || (process.env.DB_HOST && process.env.DB_HOST !== '/var/run/postgresql')) {
12:   poolConfig.ssl = { rejectUnauthorized: false };
13: }
14: 
15: const pool = new Pool(poolConfig);
16: 
17: pool.on('connect', () => {
18:   console.log('Base de datos conectada con éxito');
19: });
20: 
21: module.exports = {
22:   query: (text, params) => pool.query(text, params),
23:   connect: () => pool.connect(),
24: };

(End of file - total 24 lines)
</content>
```

---

## Assistant (Plan · Nemotron 3 Ultra Free · 4.5s)

_Thinking:_

Now let me look at the README and project context to understand what changes might be needed

**Tool: read**

**Input:**
```json
{
  "filePath": "D:\\Vercel Barrios mineros\\RRHH-Barrios-Mineros\\README.md"
}
```

**Output:**
```
<path>D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\README.md</path>
<type>file</type>
<content>
1: # RRHH Barrios Mineros
2: 
3: Sistema de gestión de Recursos Humanos para el **Hospital de Segundo Nivel "Barrios Mineros"** de Oruro, Bolivia.
4: 
5: ## Descripción
6: 
7: Aplicación web full-stack para modernizar y automatizar la gestión de empleados del hospital, abarcando personal **PLANTA** (ministerial + residentes) y **CONSULTOR**. Centraliza información migrada desde el legado ASIS (Access/CSV), planillas Excel, y proporciona dashboard estratégico, control de asistencia biométrico, gestión de turnos, justificaciones y bloqueos por atrasos.
8: 
9: ## Stack Tecnológico
10: 
11: - **Backend:** Node.js + Express
12: - **Frontend:** React + Vite + Tailwind CSS v4
13: - **Base de datos:** PostgreSQL (vía socket local, con plan de migración a Render)
14: - **Biométrico:** Integración con dispositivos ZKTeco (protocolo TCP/UDP via `node-zklib`)
15: - **ETL:** Python (importación de legado ASIS desde CSV/Excel)
16: - **Gráficos:** Recharts
17: 
18: ## Requisitos
19: 
20: - Node.js 18+
21: - PostgreSQL 14+
22: - Python 3.8+ (solo para scripts ETL)
23: 
24: ## Instalación
25: 
26: ### Backend
27: 
28: ```bash
29: cd backend
30: cp .env.example .env   # editar credenciales de base de datos
31: npm install
32: npm run seed           # poblar base de datos con datos iniciales
33: npm run dev            # iniciar servidor (puerto 3001)
34: ```
35: 
36: ### Frontend
37: 
38: ```bash
39: cd frontend
40: npm install
41: npm run dev            # iniciar servidor de desarrollo (puerto 5173)
42: ```
43: 
44: ### Scripts Python (ETL)
45: 
46: ```bash
47: pip install -r requirements.txt
48: python sql/import_asis_attendance.py --all   # importar marcaciones y justificaciones
49: ```
50: 
51: ## Estructura del Proyecto
52: 
53: ```
54: ├── backend/              # API REST (Express)
55: │   ├── src/
56: │   │   ├── controllers/  # Manejo de peticiones HTTP
57: │   │   ├── routes/       # Definición de endpoints
58: │   │   ├── services/     # Lógica de negocio
59: │   │   └── config/       # Conexión a DB y variables de entorno
60: │   └── scripts/          # Scripts de cálculo masivo
61: ├── frontend/             # Aplicación React (Vite)
62: │   └── src/
63: │       ├── components/   # Componentes reutilizables
64: │       └── pages/        # Vistas principales
65: ├── sql/                  # Migraciones y scripts SQL
66: │   ├── init.sql          # Esquema base
67: │   ├── migration_turnos_asistencia.sql
68: │   ├── migrate_entregado_asis.sql
69: │   ├── import_transactions.sql
70: │   └── import_asis_attendance.py
71: ├── Statefolder/          # Archivos fuente ASIS/Excel (ignorado por git)
72: └── *.md                  # Documentación del proyecto
73: ```
74: 
75: ## Funcionalidades
76: 
77: - **Gestión de Personal:** CRUD completo con filtros, exportación, vinculos laborales
78: - **Control de Asistencia:** Importación desde Excel, cálculo automático de estados (Normal, Atraso, Incompleta, Sin Marcación, etc.) basado en marcaciones biométricas vs turno asignado + tolerancias
79: - **Turnos y Horarios:** Plantillas de turno multisemana, asignación masiva por período, clonación entre gestiones, calendario visual
80: - **Dashboard Estratégico:** KPIs, gráficos de atrasos por servicio/unidad, detalle diario con logs biométricos
81: - **Biométrico:** Sincronización con ZKTeco, captura de marcaciones en tiempo real, importación manual JSON/CSV
82: - **Validaciones:** 5 reglas automáticas: marcas sin personal, duplicadas, fuera de horario, días sin marcación, 3+ marcas
83: - **Reportes Excel:** Reporte mensual estilo ASIS, planilla consolidada, ranking de atrasos, sanciones con multas
84: - **Vacaciones:** Solicitud, aprobación/rechazo, control de saldo (15 días anuales)
85: - **Permisos y Licencias:** 21 tipos (comisión, baja médica, feriado, etc.), CRUD con aprobación, 2,909 registros históricos importados desde ASIS
86: - **Certificados:** Generación automática de PDF (Trabajo, Ingresos, Antigüedad, Asistencia), numeración secuencial, descarga directa
87: - **Notificaciones:** Badge en sidebar, dropdown de últimas no leídas, página dedicada, eventos automáticos desde vacaciones/permisos
88: - **Bloqueos y Sanciones:** Cálculo de sanciones por atrasos recurrentes
89: - **Turnos Nocturnos:** Detección automática con ventana 36h y estado especial (estado=5)
90: - **Justificaciones:** Registro de permisos, licencias médicas, comisiones
91: - **Autenticación:** JWT con seed inicial (admin/admin)
92: 
93: ## Base de Datos — Estado Actual
94: 
95: | Esquema | Tablas principales | Registros |
96: |---------|-------------------|-----------|
97: | Personal | `personal`, `vinculos_laborales`, `contratos`, `cat_unidades_servicio` | 267 empleados |
98: | Asistencia | `asistencia_mensual`, `asistencia_diaria`, `justificaciones`, `auditoria_asistencia` | ~4,400 mensuales + ~134K diarios |
99: | Turnos | `turnos_plantilla`, `turnos_asignados` | 87 plantillas, 23,851 asignaciones |
100: | Biométrico | `biometrico_logs_raw`, `biometrico_config` | 108,989 marcaciones |
101: | Vacaciones | `vacaciones` | CRUD con saldo y aprobación |
102: | Permisos/Licencias | `permisos_laborales`, `cat_tipos_permisos` | 2,909 registros ASIS + CRUD manual |
103: | Certificados | `certificados`, `secuencia_hr` | PDF automático, 4 tipos |
104: | Notificaciones | `notificaciones` | Badge, dropdown, eventos automáticos |
105: | Catálogos | `cat_motivos_justificacion`, `cat_unidades_servicio`, `sanciones_atrasos`, `sanciones_faltas` | — |
106: 
107: ## Migración desde ASIS (Legado)
108: 
109: Datos migrados desde el sistema ASIS (Microsoft Access `FTecSys.mdb`):
110: 
111: - ✅ **114 empleados** con `biometrico_id` desde `FTUserInfo.TU_sID`
112: - ✅ **87 plantillas** de turno desde `horariosBuenos.csv`
113: - ✅ **23,851 asignaciones** de turno desde `horariosAsignados.csv` (2023–2026)
114: - ✅ **108,989 marcaciones** desde `Transactions.csv` (Oct 2022 – May 2026)
115: - ✅ **1,676 justificaciones** desde `justificacionesNuevas.csv`
116: - ✅ **17 registros CONSULTOR** desde `ENTREGADO CARPETAS.xlsx`
117: - ✅ Estados de asistencia calculados para 2024–2026 basados en turno + marcaciones + tolerancias

(End of file - total 117 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "D:\\Vercel Barrios mineros\\RRHH-Barrios-Mineros\\PROJECT_CONTEXT.md"
}
```

**Output:**
```
<path>D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\PROJECT_CONTEXT.md</path>
<type>file</type>
<content>
1: # Contexto del Proyecto: RRHH Barrios Mineros
2: 
3: **Propósito:** Modernización y automatización de la gestión de Recursos Humanos para el Hospital de Segundo Nivel "Barrios Mineros" en Oruro, Bolivia.
4: 
5: **Objetivos Clave:**
6: - Centralizar la información de los 267 empleados (PLANTA: ministeriales + residentes, CONSULTOR).
7: - Automatizar la ingesta de datos desde el legado ASIS (Access) y libros Excel.
8: - Control de asistencia preciso basado en marcaciones biométricas ZKTeco + turnos + tolerancias.
9: - Proporcionar dashboard estratégico para la toma de decisiones gerenciales.
10: 
11: **Estado Actual (Mayo 2026):**
12: 
13: | Componente | Estado | Notas |
14: |-----------|--------|-------|
15: | Personal | ✅ Completo | 267 registros, 114 con biometrico_id |
16: | Vínculos Laborales | ✅ Completo | Cargos, unidades, servicios |
17: | Turnos | ✅ Completo | 87 plantillas, 23,851 asignaciones (2023-2026) |
18: | Asistencia | ✅ Completo | 2024-2026 calculados + motor nocturno |
19: | Marcaciones | ✅ Completo | 108,989 logs biométricos importados + sync ZKTeco |
20: | Justificaciones | ✅ Completo | 1,676 registros importados desde ASIS |
21: | Sanciones | ✅ Completo | Configuración + UI + multas en reportes |
22: | Dashboard | ✅ Completo | KPIs, gráficos, detalle diario |
23: | Reportes Excel | ✅ Completo | 4 reportes: mensual, planilla, atrasos, sanciones |
24: | Validaciones | ✅ Completo | 5 reglas + importación manual |
25: | Vacaciones | ✅ Completo | Tabla, CRUD, saldo, aprobación |
26: | Permisos/Licencias | ✅ Completo | 2,909 reg. importados ASIS, CRUD, aprobación |
27: | Certificados | ✅ Completo | 4 tipos, PDF automático, numeración secuencial |
28: | Notificaciones | ✅ Completo | Badge, dropdown, página, eventos automáticos |
29: 
30: **Alcance del Sistema:**
31: - Gestión de Personal y Vínculos Laborales (CRUD)
32: - Control de Asistencia Mensual con cálculo automático de estados
33: - Gestión de Turnos con plantillas multisede y clonación anual
34: - Seguimiento de Vacaciones con saldo y aprobación
35: - Bloqueos y Sanciones por Atrasos
36: - Dashboard Estratégico con KPIs y detalle diario
37: - Reportes Excel exportables (estilo ASIS)
38: - Validación automática de marcaciones biométricas
39: - Sincronización con equipos ZKTeco
40: 
41: **Datos Migrados desde ASIS (Legado):**
42: - Sistema original: FTecSys.mdb (Microsoft Access, 54 MB, 35 tablas)
43: - Exportado a CSV en `Statefolder/Asis/export/csv/`
44: - Importado a PostgreSQL via scripts Python + SQL
45: - Reconciliación contra DB existente + ENTREGADO CARPETAS.xlsx

(End of file - total 45 lines)
</content>
```

---

## Assistant (Plan · Nemotron 3 Ultra Free · 3.6s)

_Thinking:_

Now I have a good understanding of the project structure. Let me also check the ARCHITECTURE.md for more details

**Tool: read**

**Input:**
```json
{
  "filePath": "D:\\Vercel Barrios mineros\\RRHH-Barrios-Mineros\\ARCHITECTURE.md"
}
```

**Output:**
```
<path>D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\ARCHITECTURE.md</path>
<type>file</type>
<content>
1: # Arquitectura del Sistema
2: 
3: ## Stack Tecnológico
4: - **Backend:** Node.js + Express (Arquitectura por capas: Routes → Controllers → Services → DB)
5: - **Frontend:** React + Vite + Tailwind CSS v4 + Recharts + Lucide-React
6: - **Base de Datos:** PostgreSQL (Relacional, normalizada)
7: - **Integraciones:** ZKTeco (TCP/UDP via `node-zklib`), XLSX (procesamiento Excel)
8: - **Autenticación:** JWT (jsonwebtoken + bcrypt)
9: 
10: ## Estructura del Proyecto
11: 
12: ### Backend (`/backend/src/`)
13: ```
14: src/
15: ├── config/
16: │   └── db.js                  # Pool de conexiones PostgreSQL (socket local)
17: ├── controllers/               # Manejo de peticiones HTTP
18: │   ├── asistenciaController.js
19: │   ├── authController.js
20: │   ├── biometricoController.js # + import-logs, validaciones, recalcular
21: │   ├── dashboardController.js
22: │   ├── personalController.js
23: │   ├── sancionesController.js
24: │   ├── turnosController.js
25: │   ├── justificacionesController.js
26: │   ├── reporteController.js
27: │   ├── vacacionesController.js
28: │   └── ...
29: ├── routes/                    # Definición de endpoints REST
30: │   ├── vacacionesRoutes.js
31: │   └── ...
32: ├── services/                  # Lógica de negocio
33: │   ├── calculoAsistenciaService.js  # Motor de cálculo de estados
34: │   ├── biometricoService.js          # Comunicación ZKTeco
35: │   ├── validacionesService.js        # 5 reglas de validación
36: │   ├── vacacionesService.js           # CRUD + saldo vacaciones
37: │   ├── dashboardService.js
38: │   ├── reporteAsistenciaService.js
39: │   ├── turnosService.js
40: │   ├── justificacionesService.js
41: │   ├── sancionesService.js
42: │   └── ...
43: ├── cron/                      # Tareas programadas
44: │   ├── estadoJob.js           # Diario 01:00 — baja contratos vencidos
45: │   └── calculoDiarioJob.js    # Diario 06:00 — recalcula día anterior
46: └── middlewares/
47:     └── auth.js                # Verificación JWT
48: ```
49: 
50: ### Frontend (`/frontend/src/`)
51: ```
52: src/
53: ├── pages/                     # Vistas principales
54: │   ├── Dashboard.jsx
55: │   ├── PersonalPage.jsx
56: │   ├── AsistenciasPage.jsx
57: │   ├── TurnosPage.jsx
58: │   ├── BiometricoPage.jsx     # 4 tabs: Dispositivo, Importar, Validaciones, Marcaciones
59: │   ├── VacacionesPage.jsx     # Solicitud, aprobación, saldo
60: │   ├── ReportesPage.jsx
61: │   ├── CorrespondenciaPage.jsx / CorrespondenciaForm.jsx / CorrespondenciaDetail.jsx
62: │   ├── BandejaPage.jsx
63: │   ├── ConfiguracionPage.jsx
64: │   └── LoginPage.jsx
65: ├── components/                # Componentes reutilizables
66: │   ├── Sidebar.jsx
67: │   ├── ProtectedRoute.jsx
68: │   ├── JustificacionModal.jsx
69: │   ├── SancionesConfig.jsx
70: │   ├── TurnoCalendario.jsx / TurnoAsignacionForm.jsx / TurnoPlantillaForm.jsx
71: │   ├── PersonalForm.jsx / ImportResultsModal.jsx / HistorialModal.jsx
72: │   ├── AsistenciaImport.jsx / ColumnSelector.jsx
73: │   └── ...
74: ├── config/
75: │   └── api.js                 # URL base de la API
76: └── App.jsx                    # Router principal
77: ```
78: 
79: ## Base de Datos — Esquemas
80: 
81: ### Módulo Personal
82: - `personal` (id, ci, nombres, apellidos, biometrico_id, tipo_personal, activo)
83: - `vinculos_laborales` (personal_id, unidad_servicio, cargo_actual, tipo_contrato, ...)
84: - `contratos` (personal_id, fecha_inicio, fecha_fin, haber_basico, ...)
85: - `cat_unidades_servicio`, `cat_profesiones`, `cat_expediciones`
86: 
87: ### Módulo Asistencia
88: - `asistencia_mensual` (personal_id, mes, anio, tipo_planilla, total_horas, total_atrasos_min)
89: - `asistencia_diaria` (asistencia_id, dia, valor, estado [1-9], minutos_atraso, justificacion_id)
90: - `justificaciones` (personal_id, fecha, tipo, hora_justificada, motivo_id)
91: - `cat_motivos_justificacion` (7 tipos: Permiso General, Licencia Médica, etc.)
92: - `auditoria_asistencia`
93: 
94: ### Módulo Turnos
95: - `turnos_plantilla` (codigo, nombre, entrada/salida por día, tolerancias, nocturno, prioridad)
96: - `turnos_asignados` (personal_id, turno_plantilla_id, fecha_inicio, fecha_fin)
97: 
98: ### Módulo Biométrico
99: - `biometrico_config` (ip, puerto, comms_key, último sync)
100: - `biometrico_logs_raw` (biometrico_id, timestamp, tipo_verificación, estado_asistencia)
101: 
102: ### Módulo Vacaciones
103: - `vacaciones` (personal_id, fecha_inicio, fecha_fin, dias_solicitados, saldo_anterior, saldo_posterior, estado [PENDIENTE/APROBADO/RECHAZADO/GOZADO/ANULADO], aprobado_por, observaciones)
104: 
105: ### Módulo Certificados
106: - `certificados` (personal_id, tipo [TRABAJO/INGRESOS/ANTIGUEDAD/ASISTENCIA], nro_cite, fecha_emision, contenido JSONB, archivo_pdf, estado [GENERADO/ENTREGADO/ANULADO])
107: - Generación automática de PDF con pdf-lib, numeración secuencial CERT-2026-XXXX
108: 
109: ### Módulo Permisos / Licencias
110: - `cat_tipos_permisos` (21 tipos: VACACION, BAJA_MEDICA, COMISION, FERIADO, TOLERANCIA, etc.)
111: - `permisos_laborales` (personal_id, tipo, fecha_inicio, fecha_fin, dias, motivo, descripcion_original, estado [PENDIENTE/APROBADO/RECHAZADO/FINALIZADO], origen [ASIS/MANUAL], aprobado_por)
112:   - 2,909 registros importados desde ASIS (TablaVacaciones.csv)
113:   - Unique: (personal_id, fecha_inicio, fecha_fin, tipo)
114: 
115: ### Sanciones
116: - `sanciones_atrasos` (rangos de minutos, sanción en días, factor)
117: - `sanciones_faltas` (rangos de faltas, sanción, factor)
118: 
119: ### Módulo Notificaciones
120: - `notificaciones` (usuario_id, personal_id, titulo, mensaje, tipo [INFO/SUCCESS/WARNING/ALERT], link, leido)
121: - Badge en sidebar con polling cada 30s
122: - Eventos automáticos desde cambios de estado en vacaciones y permisos
123: 
124: ### Autenticación
125: - `usuarios` (personal_id, username, password_hash, roles via `usuario_roles` + `roles`)
126: - `permisos` (RBAC, NO confundir con permisos laborales)
127: 
128: ## Motor de Cálculo de Asistencia
129: 
130: El flujo de cálculo de estados diarios:
131: 
132: 1. Para cada empleado + fecha, se obtiene el **turno asignado** (`turnos_asignados` JOIN `turnos_plantilla`)
133: 2. Se determina el día de la semana y se obtienen **entrada/salida programada** y **tolerancias**
134: 3. Se consultan las **marcaciones biométricas** (`biometrico_logs_raw`) para esa fecha
135: 4. Se comparan los tiempos reales vs programados:
136: 
137: | Estado | Código | Condición |
138: |--------|--------|-----------|
139: | Normal | 1 | Llegó dentro de tolerancia y salió a tiempo |
140: | Atraso | 2 | Llegó después de la tolerancia |
141: | Nocturno | 5 | Turno nocturno (entrada ≥ salida) |
142: | Salida Adelantada | 7 | Salió antes de lo programado |
143: | Incompleta | 8 | Solo 1 marcación en el día |
144: | Sin Marcación | 9 | No tiene marcaciones ese día |
145: 
146: 5. Se usa ventana **36h** para turnos nocturnos (12:00→siguiente 12:00)
147: 6. Se actualiza `asistencia_diaria.estado` y `minutos_atraso`
148: 7. Se actualiza `asistencia_mensual.total_atrasos_min`
149: 
150: ## Convenciones de Desarrollo
151: - **Detección Dinámica:** Los servicios de importación deben buscar encabezados por palabras clave en las primeras 20 filas.
152: - **Upsert:** Las importaciones masivas usan `ON CONFLICT ... DO NOTHING/UPDATE`.
153: - **UI Moderna:** Tailwind CSS v4 + Lucide-React para iconos.
154: - **Normalización de CI:** Limpiar C.I. de caracteres especiales o decimales.
155: - **Paginación:** Endpoints con datos grandes (>10K filas) deben implementar paginación con `?page=&limit=`.

(End of file - total 155 lines)
</content>
```

---

## Assistant (Plan · Nemotron 3 Ultra Free · 19.7s)

_Thinking:_

Now I have a comprehensive understanding of the turnos module. Let me summarize the analysis and create a plan.

The turnos module consists of:
1. **Backend**: 
   - `turnosService.js` - Business logic for turnos templates and assignments
   - `turnosController.js` - HTTP request handlers
   - `turnosRoutes.js` - REST API endpoints
   - Database tables: `turnos_plantilla`, `turnos_asignados`

2. **Frontend**:
   - `TurnosPage.jsx` - Main page with 3 tabs (plantillas, asignaciones, calendario)
   - `TurnoPlantillaForm.jsx` - Form for creating/editing turn templates
   - `TurnoAsignacionForm.jsx` - Form for assigning shifts to employees
   - `TurnoCalendario.jsx` - Visual calendar with drag-and-drop and ICS export

Key features:
- Plantillas de turno with daily schedules (entrada/salida per day), tolerances, nocturnal flags
- Asignaciones with date ranges, cloning year-to-year
- Visual calendar with monthly view, drag-and-drop to change dates
- ICS export for calendar integration

Now, the user wants to make changes to this module. Since they haven't specified what changes they want, I should ask clarifying questions to understand their requirements before creating a plan.

Let me ask about what specific changes they want to make.

Ahora tengo una comprensión completa del módulo de turnos. Aquí está el resumen:

## Resumen del Módulo de Turnos

### Backend
- **turnosService.js** (345 líneas): Lógica de negocio completa
  - CRUD plantillas (`turnos_plantilla`) con horarios por día, tolerancias, nocturnos
  - CRUD asignaciones (`turnos_asignados`) con rangos de fechas
  - Clonación anual de asignaciones
  - Calendario mensual y detalle por día
  - Consulta de personal sin turno asignado

- **turnosController.js** (183 líneas): Endpoints REST
- **turnosRoutes.js** (28 líneas): Rutas con permisos RBAC (`turnos.ver`, `turnos.gestionar`)

### Frontend
- **TurnosPage.jsx** (351 líneas): 3 pestañas (Plantillas, Asignaciones, Calendario)
- **TurnoPlantillaForm.jsx**: Formulario completo con horarios por día, checkboxes activo/nocturno, tolerancias
- **TurnoAsignacionForm.jsx**: Asignar turnos con selector de personal sin turno
- **TurnoCalendario.jsx** (362 líneas): Vista mensual visual con drag-and-drop, filtro por servicio, exportación ICS

### Base de Datos
- `turnos_plantilla`: 87 plantillas migradas desde ASIS
- `turnos_asignados`: 23,851 asignaciones (2023-2026)
- Índices optimizados para consultas por personal/fecha

---

**¿Qué cambios específicos quieres realizar?** Algunas opciones comunes:

1. **Funcionalidad nueva**: rotaciones, turnos por quincena, patrones cíclicos
2. **Mejoras UI/UX**: vista semanal, filtros avanzados, bulk operations
3. **Integración**: sincronización biométrica, validaciones de solapamiento
4. **Reportes**: exportaciones adicionales, estadísticas de cobertura
5. **Backend**: optimizaciones, nuevos endpoints, reglas de negocio

Dime qué necesitas y prepararé el plan detallado.

---

## User

El objetivo es reemplazar un sistema de turnos en Excel por un panel interactivo con funcionalidad drag-and-drop (arrastrar y soltar). A continuación, detallo los requerimientos técnicos y de negocio:

1. Interfaz de Usuario (Frontend):

Grilla Interactiva: Un panel en formato de tabla cruzada (días de la semana vs. franjas horarias), filtrable por "Servicio" (ej. Farmacia, Laboratorio). Cada servicio tiene su propia configuración de horarios.

Drag-and-Drop: Una lista lateral de personal disponible que se pueda arrastrar hacia las celdas (turnos) de la grilla.

Visualización de Carga Horaria: Una columna o sección que muestre el cálculo en tiempo real de las horas asignadas en la semana/mes frente a las horas requeridas.

2. Reglas de Negocio (Lógica y Datos):

Atributos del Personal: Cada trabajador pertenece a una "Fuente de Financiamiento" específica (TGN, GOB, Contrato GAMO, etc.).

Control de Horas: Cada trabajador tiene una cuota de horas obligatorias al mes. El sistema debe sumar automáticamente las horas según los turnos asignados y reflejar si el personal cumple, le faltan o excede sus horas mensuales.

3. Seguridad y Autorización (Backend):

Control de Accesos (RBAC): La creación, modificación o eliminación de los turnos está estrictamente restringida a los usuarios que tengan el rol de "Jefe de Servicio".

El resto del personal solo debe tener permisos de lectura (ver su propio horario).

Con base en estos requerimientos, por favor genérame lo siguiente:

El modelo de datos relacional sugerido (tablas principales y relaciones).

La estructura de componentes sugerida para el Frontend.

La lógica o pseudocódigo recomendado para calcular la carga horaria en tiempo real durante el drag-and-drop.

Una recomendación sobre cómo manejar el middleware para proteger las rutas de modificación exclusivas para los Jefes de Servicio. 

---

## Assistant (Plan · Nemotron 3 Ultra Free · 7.3s)

_Thinking:_

The user wants me to analyze the requirements for a new interactive shift scheduling system with drag-and-drop functionality. They want me to create a plan covering:

1. Relational data model
2. Frontend component structure
3. Real-time workload calculation logic
4. RBAC middleware for "Jefe de Servicio" role

This is a planning phase - I'm in read-only mode. I need to analyze the existing codebase to understand the current structure and then propose a plan that integrates with or replaces the current turnos module.

Let me first understand the current data model and structure better by looking at the existing tables and services

**Tool: read**

**Input:**
```json
{
  "filePath": "D:\\Vercel Barrios mineros\\RRHH-Barrios-Mineros\\sql\\init.sql"
}
```

**Output:**
```
<path>D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\sql\init.sql</path>
<type>file</type>
<content>
1: -- Crear base de datos (Ejecutar manualmente si no existe)
2: -- CREATE DATABASE rrhh_barrios_mineros;
3: 
4: -- Tablas de Catálogo
5: CREATE TABLE cat_expediciones (
6:     id SERIAL PRIMARY KEY,
7:     sigla VARCHAR(5) NOT NULL,
8:     nombre VARCHAR(50) NOT NULL
9: );
10: 
11: CREATE TABLE cat_profesiones (
12:     id SERIAL PRIMARY KEY,
13:     nombre_profesion VARCHAR(100) NOT NULL
14: );
15: 
16: CREATE TABLE cat_tipos_personal (
17:     id SERIAL PRIMARY KEY,
18:     nombre_tipo VARCHAR(50) NOT NULL
19: );
20: 
21: CREATE TABLE cat_fuentes_financiamiento (
22:     id SERIAL PRIMARY KEY,
23:     nombre_fuente VARCHAR(100) NOT NULL
24: );
25: 
26: CREATE TABLE cat_unidades_servicios (
27:     id SERIAL PRIMARY KEY,
28:     nombre_unidad VARCHAR(150) NOT NULL UNIQUE
29: );
30: 
31: -- Tablas Principales
32: CREATE TABLE establecimientos (
33:     id SERIAL PRIMARY KEY,
34:     nombre_establecimiento VARCHAR(150) NOT NULL,
35:     municipio VARCHAR(100) DEFAULT 'Oruro',
36:     red VARCHAR(100) DEFAULT 'Red Urbana'
37: );
38: 
39: CREATE TABLE personal (
40:     id SERIAL PRIMARY KEY,
41:     ci VARCHAR(20) NOT NULL UNIQUE,
42:     complemento VARCHAR(5),
43:     exp_id INT REFERENCES cat_expediciones(id),
44:     apellido_paterno VARCHAR(100),
45:     apellido_materno VARCHAR(100),
46:     apellido_casada VARCHAR(100),
47:     primer_nombre VARCHAR(100) NOT NULL,
48:     segundo_nombre VARCHAR(100),
49:     tercer_nombre VARCHAR(100),
50:     fecha_nacimiento DATE,
51:     profesion_id INT REFERENCES cat_profesiones(id),
52:     telefono VARCHAR(20),
53:     biometrico_id INTEGER
54: );
55: 
56: CREATE TABLE vinculos_laborales (
57:     id SERIAL PRIMARY KEY,
58:     personal_id INT REFERENCES personal(id) ON DELETE CASCADE,
59:     establecimiento_id INT REFERENCES establecimientos(id),
60:     tipo_personal_id INT REFERENCES cat_tipos_personal(id),
61:     fuente_financiamiento_id INT REFERENCES cat_fuentes_financiamiento(id),
62:     identificador_laboral VARCHAR(100),
63:     unidad_servicio VARCHAR(150),
64:     cargo_actual VARCHAR(150),
65:     cargo_planilla VARCHAR(150),
66:     cargo_escala VARCHAR(150),
67:     nro_resumen_ejecutivo VARCHAR(100),
68:     carga_horaria VARCHAR(10),
69:     fecha_ingreso DATE,
70:     fecha_institucionalizacion DATE,
71:     observaciones TEXT
72: );
73: 
74: INSERT INTO cat_fuentes_financiamiento (nombre_fuente) VALUES 
75: ('TGN'), ('HIPC'), ('MINISTERIO'), ('MUNICIPIO');
76: 
77: INSERT INTO cat_tipos_personal (nombre_tipo) VALUES 
78: ('ÍTEM'), ('CONTRATO'), ('CONSULTORÍA');
79: 
80: -- Datos iniciales sugeridos
81: INSERT INTO cat_expediciones (sigla, nombre) VALUES 
82: ('LP', 'La Paz'), ('OR', 'Oruro'), ('CB', 'Cochabamba'), 
83: ('SC', 'Santa Cruz'), ('BN', 'Beni'), ('PA', 'Pando'), 
84: ('TJ', 'Tarija'), ('PT', 'Potosí'), ('CH', 'Chuquisaca');
85: 
86: INSERT INTO establecimientos (nombre_establecimiento) VALUES ('HBM - Hospital Barrios Mineros');
87: 
88: CREATE TABLE asistencia_mensual (
89:     id SERIAL PRIMARY KEY,
90:     personal_id INT REFERENCES personal(id) ON DELETE CASCADE,
91:     mes INT NOT NULL,
92:     anio INT NOT NULL,
93:     total_horas NUMERIC(10,2) DEFAULT 0,
94:     total_atrasos_min INT DEFAULT 0,
95:     observaciones TEXT,
96:     tipo_planilla VARCHAR(20),
97:     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
98:     UNIQUE(personal_id, mes, anio, tipo_planilla)
99: );
100: 
101: CREATE TABLE asistencia_diaria (
102:     id SERIAL PRIMARY KEY,
103:     asistencia_id INT REFERENCES asistencia_mensual(id) ON DELETE CASCADE,
104:     dia INT NOT NULL,
105:     valor VARCHAR(10)
106: );
107: 
108: CREATE TABLE asistencia_rotaciones (
109:     id SERIAL PRIMARY KEY,
110:     personal_id INT REFERENCES personal(id),
111:     fecha_inicio DATE,
112:     fecha_fin DATE,
113:     rotacion_de VARCHAR(150),
114:     rotacion_a VARCHAR(150),
115:     tiempo_rotacion VARCHAR(50),
116:     observaciones TEXT
117: );
118: 
119: CREATE TABLE biometrico_config (
120:     id INTEGER PRIMARY KEY,
121:     ip_address VARCHAR(50),
122:     port INTEGER,
123:     comms_key VARCHAR(50),
124:     ultimo_sync_usuarios TIMESTAMP,
125:     ultimo_sync_logs TIMESTAMP,
126:     estado VARCHAR(20)
127: );
128: 
129: CREATE TABLE biometrico_logs_raw (
130:     id SERIAL PRIMARY KEY,
131:     biometrico_id INTEGER,
132:     timestamp TIMESTAMP,
133:     verificacion_tipo INTEGER,
134:     estado_asistencia INTEGER,
135:     device_ip VARCHAR(50),
136:     UNIQUE(biometrico_id, timestamp)
137: );
138: 
139: CREATE TABLE historial_movimientos (
140:     id SERIAL PRIMARY KEY,
141:     personal_id INT REFERENCES personal(id) ON DELETE CASCADE,
142:     tipo_movimiento VARCHAR(100),
143:     detalles_anteriores JSONB,
144:     detalles_nuevos JSONB,
145:     motivo TEXT,
146:     fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
147: );

(End of file - total 147 lines)
</content>
```

**Tool: grep**

**Input:**
```json
{
  "include": "*.js",
  "pattern": "vinculos_laborales",
  "path": "D:\\Vercel Barrios mineros\\RRHH-Barrios-Mineros\\backend"
}
```

**Output:**
```
Found 51 matches
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\test_real_import.js:
  Line 32:     const { rows: vl } = await db.query('SELECT COUNT(*) FROM vinculos_laborales');

  Line 34:     console.log(`Total en DB 'vinculos_laborales': ${vl[0].count}`);


D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\middleware\authMiddleware.js:
  Line 23:       LEFT JOIN vinculos_laborales vl ON p.id = vl.personal_id


D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\comunicadosService.js:
  Line 176:       LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id


D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\turnosService.js:
  Line 296:       LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id

  Line 325:       LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id

  Line 337:       LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id


D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\controllers\dashboardController.js:
  Line 59:         LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id


D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\selfServiceService.js:
  Line 21:         LEFT JOIN vinculos_laborales vl ON p.id = vl.personal_id


D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\certificadosService.js:
  Line 48:       LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id

  Line 62:       LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id AND vl.id = (

  Line 63:         SELECT id FROM vinculos_laborales WHERE personal_id = p.id ORDER BY id DESC LIMIT 1


D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\controllers\reporteController.js:
  Line 133:       FROM vinculos_laborales vl


D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\calculoAsistenciaService.js:
  Line 107:         SELECT unidad_servicio FROM vinculos_laborales WHERE personal_id = $1 LIMIT 1


D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\controllers\correspondenciaController.js:
  Line 159:       LEFT JOIN vinculos_laborales vl ON p.id = vl.personal_id


D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\controllers\personalController.js:
  Line 117:       FROM vinculos_laborales vl

  Line 125:       FROM vinculos_laborales vl

  Line 156:         FROM vinculos_laborales vl 


D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\reporteService.js:
  Line 23:       LEFT JOIN vinculos_laborales vl ON p.id = vl.personal_id

  Line 162:       JOIN vinculos_laborales vl ON p.id = vl.personal_id


D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\reporteAsistenciaService.js:
  Line 214:       LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id

  Line 288:       LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id

  Line 379:       LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id


D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\models\usuarioModel.js:
  Line 12:       LEFT JOIN vinculos_laborales vl ON p.id = vl.personal_id

  Line 25:       LEFT JOIN vinculos_laborales vl ON p.id = vl.personal_id

  Line 78:       LEFT JOIN vinculos_laborales vl ON p.id = vl.personal_id


D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\models\personalModel.js:
  Line 33:       LEFT JOIN vinculos_laborales vl ON p.id = vl.personal_id

  Line 138:         INSERT INTO vinculos_laborales (

  Line 211:         const { rows: oldLaboral } = await client.query('SELECT * FROM vinculos_laborales WHERE personal_id = $1', [id]);

  Line 218:         const { rowCount } = await client.query(`UPDATE vinculos_laborales SET ${setClause} WHERE personal_id = $${fields.length + 1}`, [...values, id]);

  Line 223:           await client.query(`INSERT INTO vinculos_laborales (${columns}) VALUES (${placeholders})`, [id, ...values]);


D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\models\correspondenciaModel.js:
  Line 217:       LEFT JOIN vinculos_laborales vl_de ON p_de.id = vl_de.personal_id

  Line 220:       LEFT JOIN vinculos_laborales vl_para ON p_para.id = vl_para.personal_id


D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\services\dashboardService.js:
  Line 15:       ? 'LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id'

  Line 20:     const leftJoinVl = 'LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id';

  Line 33:         FROM vinculos_laborales vl

  Line 44:         ${unidad ? 'LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id' : ''}

  Line 54:         LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id

  Line 64:         ${unidad ? 'LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id' : ''}

  Line 71:         FROM vinculos_laborales vl

  Line 82:         ${unidad ? 'LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id' : ''}

  Line 93:         ${unidad ? 'LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id' : ''}

  Line 104:         ${unidad ? 'LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id' : ''}

  Line 115:         LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id

  Line 127:            ${unidad ? 'LEFT JOIN vinculos_laborales vl2 ON vl2.personal_id = p2.id' : ''}

  Line 132:            ${unidad ? 'LEFT JOIN vinculos_laborales vl2 ON vl2.personal_id = p2.id' : ''}

  Line 137:            ${unidad ? 'LEFT JOIN vinculos_laborales vl2 ON vl2.personal_id = p2.id' : ''}

  Line 142:            ${unidad ? 'LEFT JOIN vinculos_laborales vl2 ON vl2.personal_id = p2.id' : ''}

  Line 148:            ${unidad ? 'LEFT JOIN vinculos_laborales vl2 ON vl2.personal_id = p2.id' : ''}

  Line 155:            ${unidad ? 'LEFT JOIN vinculos_laborales vl2 ON vl2.personal_id = p2.id' : ''}

  Line 169:         LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id

```

---

## Assistant (Plan · Nemotron 3 Ultra Free · 3.3s)

_Thinking:_

Now I understand the current data model better. Let me also check the auth middleware to understand the current RBAC structure

**Tool: read**

**Input:**
```json
{
  "filePath": "D:\\Vercel Barrios mineros\\RRHH-Barrios-Mineros\\backend\\src\\middleware\\authMiddleware.js"
}
```

**Output:**
```
<path>D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\middleware\authMiddleware.js</path>
<type>file</type>
<content>
1: const jwt = require('jsonwebtoken');
2: const db = require('../config/db');
3: const ConfiguracionService = require('../services/configuracionService');
4: 
5: const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
6: 
7: const authMiddleware = async (req, res, next) => {
8:   const authHeader = req.headers.authorization;
9:   if (!authHeader || !authHeader.startsWith('Bearer ')) {
10:     return res.status(401).json({ error: 'Token requerido' });
11:   }
12: 
13:   try {
14:     const token = authHeader.split(' ')[1];
15:     const decoded = jwt.verify(token, JWT_SECRET);
16:     
17:     const { rows } = await db.query(`
18:       SELECT u.id, u.username, u.personal_id, u.password_cambiado, u.activo,
19:              p.ci, p.primer_nombre, p.segundo_nombre, p.apellido_paterno, p.apellido_materno,
20:              vl.cargo_actual
21:       FROM usuarios u
22:       LEFT JOIN personal p ON u.personal_id = p.id
23:       LEFT JOIN vinculos_laborales vl ON p.id = vl.personal_id
24:       WHERE u.id = $1 AND u.activo = true
25:     `, [decoded.id]);
26: 
27:     if (rows.length === 0) {
28:       return res.status(401).json({ error: 'Usuario no encontrado o inactivo' });
29:     }
30: 
31:     const user = rows[0];
32: 
33:     const { rows: roles } = await db.query(`
34:       SELECT r.nombre FROM roles r
35:       JOIN usuario_roles ur ON r.id = ur.rol_id
36:       WHERE ur.usuario_id = $1
37:     `, [decoded.id]);
38: 
39:     const { rows: permisos } = await db.query(`
40:       SELECT DISTINCT p.codigo FROM permisos p
41:       JOIN rol_permisos rp ON p.id = rp.permiso_id
42:       JOIN usuario_roles ur ON rp.rol_id = ur.rol_id
43:       WHERE ur.usuario_id = $1
44:     `, [decoded.id]);
45: 
46:     req.usuario = {
47:       id: user.id,
48:       username: user.username,
49:       personal_id: user.personal_id,
50:       password_cambiado: user.password_cambiado,
51:       nombre_completo: [
52:         user.primer_nombre, user.segundo_nombre,
53:         user.apellido_paterno, user.apellido_materno
54:       ].filter(Boolean).join(' '),
55:       ci: user.ci,
56:       cargo: user.cargo_actual,
57:       roles: roles.map(r => r.nombre),
58:       permisos: permisos.map(p => p.codigo)
59:     };
60: 
61:     next();
62:   } catch (error) {
63:     if (error.name === 'TokenExpiredError') {
64:       return res.status(401).json({ error: 'Token expirado' });
65:     }
66:     return res.status(401).json({ error: 'Token inválido' });
67:   }
68: };
69: 
70: const checkRole = (...roles) => {
71:   return (req, res, next) => {
72:     if (!req.usuario) {
73:       return res.status(401).json({ error: 'No autenticado' });
74:     }
75:     const hasRole = roles.some(role => req.usuario.roles.includes(role));
76:     if (!hasRole) {
77:       return res.status(403).json({ error: 'No tienes permisos para esta acción' });
78:     }
79:     next();
80:   };
81: };
82: 
83: const checkPermission = (codigo) => {
84:   return async (req, res, next) => {
85:     if (!req.usuario) {
86:       return res.status(401).json({ error: 'No autenticado' });
87:     }
88:     const adminRole = await ConfiguracionService.get('seguridad_rol_admin', 'ADMIN');
89:     if (req.usuario.roles.includes(adminRole)) {
90:       return next();
91:     }
92:     if (!req.usuario.permisos.includes(codigo)) {
93:       return res.status(403).json({ error: 'No tienes permisos para esta acción' });
94:     }
95:     next();
96:   };
97: };
98: 
99: module.exports = { authMiddleware, checkRole, checkPermission };

(End of file - total 99 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "D:\\Vercel Barrios mineros\\RRHH-Barrios-Mineros\\backend\\src\\models\\usuarioModel.js"
}
```

**Output:**
```
<path>D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\models\usuarioModel.js</path>
<type>file</type>
<content>
1: const db = require('../config/db');
2: const bcrypt = require('bcryptjs');
3: 
4: class UsuarioModel {
5:   static async findByUsername(username) {
6:     const { rows } = await db.query(`
7:       SELECT u.*, p.ci, p.primer_nombre, p.segundo_nombre,
8:              p.apellido_paterno, p.apellido_materno,
9:              vl.cargo_actual
10:       FROM usuarios u
11:       LEFT JOIN personal p ON u.personal_id = p.id
12:       LEFT JOIN vinculos_laborales vl ON p.id = vl.personal_id
13:       WHERE u.username = $1
14:     `, [username]);
15:     return rows[0];
16:   }
17: 
18:   static async findById(id) {
19:     const { rows } = await db.query(`
20:       SELECT u.*, p.ci, p.primer_nombre, p.segundo_nombre,
21:              p.apellido_paterno, p.apellido_materno,
22:              vl.cargo_actual
23:       FROM usuarios u
24:       LEFT JOIN personal p ON u.personal_id = p.id
25:       LEFT JOIN vinculos_laborales vl ON p.id = vl.personal_id
26:       WHERE u.id = $1
27:     `, [id]);
28:     return rows[0];
29:   }
30: 
31:   static async createFromPersonal(personalId, ci) {
32:     const salt = await bcrypt.genSalt(10);
33:     const passwordHash = await bcrypt.hash(ci, salt);
34:     const ConfiguracionService = require('../services/configuracionService');
35: 
36:     const { rows } = await db.query(`
37:       INSERT INTO usuarios (personal_id, username, password_hash, password_cambiado)
38:       VALUES ($1, $2, $3, false)
39:       ON CONFLICT (username) 
40:       DO UPDATE SET personal_id = EXCLUDED.personal_id, activo = true
41:       RETURNING id, username, personal_id
42:     `, [personalId, ci, passwordHash]);
43: 
44:     const defaultRole = await ConfiguracionService.get('seguridad_rol_default', 'GENERAL');
45: 
46:     await db.query(`
47:       INSERT INTO usuario_roles (usuario_id, rol_id)
48:       SELECT $1, id FROM roles WHERE nombre = $2
49:       ON CONFLICT DO NOTHING
50:     `, [rows[0].id, defaultRole]);
51: 
52:     return rows[0];
53:   }
54: 
55:   static async updatePassword(id, newPassword) {
56:     const salt = await bcrypt.genSalt(10);
57:     const hash = await bcrypt.hash(newPassword, salt);
58:     const { rows } = await db.query(`
59:       UPDATE usuarios SET password_hash = $1, password_cambiado = true, updated_at = NOW()
60:       WHERE id = $2 RETURNING id
61:     `, [hash, id]);
62:     return rows[0];
63:   }
64: 
65:   static async getAll() {
66:     const { rows } = await db.query(`
67:       SELECT u.id, u.username, u.personal_id, u.email, u.activo,
68:              u.password_cambiado, u.ultimo_acceso, u.created_at,
69:              p.ci, p.primer_nombre, p.segundo_nombre,
70:              p.apellido_paterno, p.apellido_materno,
71:              vl.cargo_actual,
72:              COALESCE(
73:                array_agg(r.nombre) FILTER (WHERE r.nombre IS NOT NULL),
74:                '{}'
75:              ) as roles
76:       FROM usuarios u
77:       LEFT JOIN personal p ON u.personal_id = p.id
78:       LEFT JOIN vinculos_laborales vl ON p.id = vl.personal_id
79:       LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id
80:       LEFT JOIN roles r ON ur.rol_id = r.id
81:       GROUP BY u.id, p.ci, p.primer_nombre, p.segundo_nombre,
82:                p.apellido_paterno, p.apellido_materno, vl.cargo_actual
83:       ORDER BY u.id
84:     `);
85:     return rows;
86:   }
87: 
88:   static async updateRoles(usuarioId, roleIds) {
89:     const client = await db.connect();
90:     try {
91:       await client.query('BEGIN');
92:       await client.query('DELETE FROM usuario_roles WHERE usuario_id = $1', [usuarioId]);
93:       for (const rolId of roleIds) {
94:         await client.query(
95:           'INSERT INTO usuario_roles (usuario_id, rol_id) VALUES ($1, $2)',
96:           [usuarioId, rolId]
97:         );
98:       }
99:       await client.query('COMMIT');
100:     } catch (e) {
101:       await client.query('ROLLBACK');
102:       throw e;
103:     } finally {
104:       client.release();
105:     }
106:   }
107: 
108:   static async bulkAssignRole(userIds, roleId) {
109:     const client = await db.connect();
110:     try {
111:       await client.query('BEGIN');
112:       for (const userId of userIds) {
113:         await client.query(
114:           'INSERT INTO usuario_roles (usuario_id, rol_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
115:           [userId, roleId]
116:         );
117:       }
118:       await client.query('COMMIT');
119:     } catch (e) {
120:       await client.query('ROLLBACK');
121:       throw e;
122:     } finally {
123:       client.release();
124:     }
125:   }
126: 
127:   static async bulkRemoveRole(userIds, roleId) {
128:     await db.query(
129:       'DELETE FROM usuario_roles WHERE usuario_id = ANY($1) AND rol_id = $2',
130:       [userIds, roleId]
131:     );
132:   }
133: 
134:   static async toggleActivo(id) {
135:     const { rows } = await db.query(`
136:       UPDATE usuarios SET activo = NOT activo, updated_at = NOW()
137:       WHERE id = $1 RETURNING id, activo
138:     `, [id]);
139:     return rows[0];
140:   }
141: 
142:   static async updateLastAccess(id) {
143:     await db.query('UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = $1', [id]);
144:   }
145: }
146: 
147: module.exports = UsuarioModel;

(End of file - total 147 lines)
</content>
```

---

## Assistant (Plan · Nemotron 3 Ultra Free · 5.0s)

_Thinking:_

Now I have a good understanding of the current system. Let me also check the roles and permissions tables to understand how to implement "Jefe de Servicio" role

**Tool: grep**

**Input:**
```json
{
  "pattern": "roles|permisos",
  "include": "*.sql",
  "path": "D:\\Vercel Barrios mineros\\RRHH-Barrios-Mineros\\sql"
}
```

**Output:**
```
Found 21 matches
D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\sql\migration_correspondencia.sql:
  Line 7: CREATE TABLE IF NOT EXISTS roles (

  Line 14: CREATE TABLE IF NOT EXISTS permisos (

  Line 22: CREATE TABLE IF NOT EXISTS rol_permisos (

  Line 23:     rol_id INT REFERENCES roles(id) ON DELETE CASCADE,

  Line 24:     permiso_id INT REFERENCES permisos(id) ON DELETE CASCADE,

  Line 42: CREATE TABLE IF NOT EXISTS usuario_roles (

  Line 44:     rol_id INT REFERENCES roles(id) ON DELETE CASCADE,


D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\sql\migrate_render.sql:
  Line 65: CREATE TABLE IF NOT EXISTS roles (

  Line 72: CREATE TABLE IF NOT EXISTS permisos (

  Line 80: CREATE TABLE IF NOT EXISTS rol_permisos (

  Line 81:     rol_id INT REFERENCES roles(id) ON DELETE CASCADE,

  Line 82:     permiso_id INT REFERENCES permisos(id) ON DELETE CASCADE,

  Line 100: CREATE TABLE IF NOT EXISTS usuario_roles (

  Line 102:     rol_id INT REFERENCES roles(id) ON DELETE CASCADE,


D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\sql\migration_configuracion.sql:
  Line 49: ('origen_permiso_default', 'MANUAL', 'string', 'Origen por defecto para permisos nuevos', 'permisos'),

  Line 50: ('estados_permiso_validos', '["APROBADO","RECHAZADO","FINALIZADO"]', 'json', 'Estados válidos para permisos laborales', 'permisos'),

  Line 59: -- Extender cat_tipos_permisos con columnas de Fase 5

  Line 61: ALTER TABLE cat_tipos_permisos ADD COLUMN IF NOT EXISTS descripcion TEXT DEFAULT '';

  Line 62: ALTER TABLE cat_tipos_permisos ADD COLUMN IF NOT EXISTS requiere_documento BOOLEAN DEFAULT false;

  Line 63: ALTER TABLE cat_tipos_permisos ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#6B7280';

  Line 64: ALTER TABLE cat_tipos_permisos ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;

```

---

## Assistant (Plan · Nemotron 3 Ultra Free · 7.4s)

_Thinking:_

Now I have a good understanding of the existing system. Let me check the seed file to see how roles and permissions are set up.

**Tool: read**

**Input:**
```json
{
  "filePath": "D:\\Vercel Barrios mineros\\RRHH-Barrios-Mineros\\backend\\src\\utils\\seed.js"
}
```

**Output:**
```
<path>D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\backend\src\utils\seed.js</path>
<type>file</type>
<content>
1: const db = require('../config/db');
2: 
3: const seedData = async () => {
4:   try {
5:     // 1. Insertar Profesiones si no existen
6:     const profs = ['Médico General', 'Enfermera Licenciada', 'Auxiliar de Enfermería', 'Administrativo', 'Especialista'];
7:     for (const p of profs) {
8:       await db.query('INSERT INTO cat_profesiones (nombre_profesion) VALUES ($1) ON CONFLICT DO NOTHING', [p]);
9:     }
10: 
11:     // 2. Obtener IDs para relacionar
12:     const { rows: expediciones } = await db.query('SELECT id FROM cat_expediciones WHERE sigla = $1', ['OR']);
13:     const { rows: profesiones } = await db.query('SELECT id FROM cat_profesiones WHERE nombre_profesion = $1', ['Médico General']);
14:     
15:     if (expediciones.length > 0 && profesiones.length > 0) {
16:       const expId = expediciones[0].id;
17:       const profId = profesiones[0].id;
18: 
19:       // 3. Insertar Personal de ejemplo
20:       await db.query(`
21:         INSERT INTO personal (
22:           ci, exp_id, apellido_paterno, apellido_materno, primer_nombre, 
23:           fecha_nacimiento, profesion_id, telefono
24:         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
25:         ON CONFLICT (ci) DO NOTHING
26:       `, ['1234567', expId, 'Pérez', 'Mamani', 'Juan Carlos', '1985-05-20', profId, '70012345']);
27: 
28:       console.log('Datos de ejemplo insertados con éxito');
29:     }
30:   } catch (error) {
31:     console.error('Error al insertar datos de ejemplo:', error);
32:   }
33: };
34: 
35: seedData();

(End of file - total 35 lines)
</content>
```

---

## Assistant (Plan · Nemotron 3 Ultra Free · 5.8s)

_Thinking:_

Let me check the migration for roles and permissions to see the current structure.

**Tool: read**

**Input:**
```json
{
  "limit": 60,
  "filePath": "D:\\Vercel Barrios mineros\\RRHH-Barrios-Mineros\\sql\\migration_correspondencia.sql"
}
```

**Output:**
```
<path>D:\Vercel Barrios mineros\RRHH-Barrios-Mineros\sql\migration_correspondencia.sql</path>
<type>file</type>
<content>
1: -- ============================================================
2: -- MIGRACIÓN: Módulo de Correspondencia + Autenticación + Roles
3: -- ============================================================
4: 
5: -- 1. TABLAS DE AUTENTICACIÓN Y ROLES
6: 
7: CREATE TABLE IF NOT EXISTS roles (
8:     id SERIAL PRIMARY KEY,
9:     nombre VARCHAR(50) UNIQUE NOT NULL,
10:     descripcion VARCHAR(255),
11:     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
12: );
13: 
14: CREATE TABLE IF NOT EXISTS permisos (
15:     id SERIAL PRIMARY KEY,
16:     codigo VARCHAR(50) UNIQUE NOT NULL,
17:     descripcion VARCHAR(255),
18:     modulo VARCHAR(50) DEFAULT 'general',
19:     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
20: );
21: 
22: CREATE TABLE IF NOT EXISTS rol_permisos (
23:     rol_id INT REFERENCES roles(id) ON DELETE CASCADE,
24:     permiso_id INT REFERENCES permisos(id) ON DELETE CASCADE,
25:     PRIMARY KEY (rol_id, permiso_id)
26: );
27: 
28: CREATE TABLE IF NOT EXISTS usuarios (
29:     id SERIAL PRIMARY KEY,
30:     personal_id INT REFERENCES personal(id) ON DELETE SET NULL,
31:     username VARCHAR(50) UNIQUE NOT NULL,
32:     password_hash VARCHAR(255) NOT NULL,
33:     password_cambiado BOOLEAN DEFAULT false,
34:     google_id VARCHAR(100),
35:     email VARCHAR(100),
36:     activo BOOLEAN DEFAULT true,
37:     ultimo_acceso TIMESTAMP,
38:     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
39:     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
40: );
41: 
42: CREATE TABLE IF NOT EXISTS usuario_roles (
43:     usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
44:     rol_id INT REFERENCES roles(id) ON DELETE CASCADE,
45:     PRIMARY KEY (usuario_id, rol_id)
46: );
47: 
48: -- 2. TABLAS DE CORRESPONDENCIA
49: 
50: CREATE TABLE IF NOT EXISTS cat_tipos_correspondencia (
51:     id SERIAL PRIMARY KEY,
52:     codigo VARCHAR(10) UNIQUE NOT NULL,
53:     nombre VARCHAR(100) NOT NULL
54: );
55: 
56: CREATE TABLE IF NOT EXISTS cat_clasificaciones (
57:     id SERIAL PRIMARY KEY,
58:     codigo VARCHAR(20) UNIQUE NOT NULL,
59:     nombre VARCHAR(100) NOT NULL
60: );

(Showing lines 1-60 of 147. Use offset=61 to continue.)
</content>
```

---

## Assistant (Plan · Nemotron 3 Ultra Free · 138.4s)

_Thinking:_

Now I have a complete understanding of the system. Let me also check the current TurnosPage component to understand the current UI better, and the biometricoService to understand the time slot structure if any.

Now I'll formulate my plan. I need to address:

1. Data model - extending current turnos tables or creating new ones for the interactive grid
2. Frontend component structure
3. Real-time calculation logic
4. RBAC middleware for "Jefe de Servicio"

Let me provide a comprehensive plan.

Ahora tengo toda la información necesaria. Aquí está mi **plan detallado** para el nuevo panel interactivo de turnos con drag-and-drop:

---

## 📋 PLAN: Panel Interactivo de Turnos con Drag-and-Drop

### 1. Modelo de Datos Relacional Sugerido

**Decisión clave:** Extender las tablas actuales `turnos_plantilla` y `turnos_asignados` vs crear nuevas tablas. **Recomiendo crear tablas nuevas** para no romper el sistema actual de turnos (que ya tiene 23,851 asignaciones históricas) y permitir coexistencia.

```sql
-- ============================================================
-- NUEVAS TABLAS: Panel Interactivo de Turnos (Grid/Drag-Drop)
-- ============================================================

-- 1. Configuración de "Servicios" (Unidades) con sus horarios base
CREATE TABLE IF NOT EXISTS turnos_servicios_config (
    id SERIAL PRIMARY KEY,
    unidad_servicio VARCHAR(150) NOT NULL UNIQUE,  -- ej: 'Farmacia', 'Laboratorio'
    -- Franjas horarias por día (JSONB para flexibilidad)
    -- { "lunes": [{"inicio":"07:00","fin":"14:00","tipo":"manana"}, ...] }
    franjas_horarias JSONB NOT NULL DEFAULT '{}',
    -- Horas requeridas por mes por fuente de financiamiento
    horas_requeridas_mes JSONB DEFAULT '{}',  -- { "TGN": 160, "GOB": 144, "Contrato GAMO": 120 }
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Plantilla de grilla semanal por servicio (definición de celdas)
CREATE TABLE IF NOT EXISTS turnos_grilla_semanal (
    id SERIAL PRIMARY KEY,
    servicio_config_id INT REFERENCES turnos_servicios_config(id) ON DELETE CASCADE,
    dia_semana INT NOT NULL CHECK (dia_semana BETWEEN 0 AND 6), -- 0=Dom, 6=Sab
    franja_inicio TIME NOT NULL,
    franja_fin TIME NOT NULL,
    tipo_franja VARCHAR(20) CHECK (tipo_franja IN ('manana','tarde','noche','completo')),
    cupo_maximo INT DEFAULT 1,  -- cuántos empleados por celda
    orden INT DEFAULT 0,
    UNIQUE(servicio_config_id, dia_semana, franja_inicio, franja_fin)
);

-- 3. Asignaciones en la grilla (el estado actual del drag-and-drop)
CREATE TABLE IF NOT EXISTS turnos_grilla_asignaciones (
    id SERIAL PRIMARY KEY,
    grilla_semanal_id INT REFERENCES turnos_grilla_semanal(id) ON DELETE CASCADE,
    personal_id INT REFERENCES personal(id) ON DELETE CASCADE,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,  -- NULL = indefinido
    -- Para override de franja específica (ej. cambio puntual)
    franja_inicio_override TIME,
    franja_fin_override TIME,
    creado_por INT REFERENCES usuarios(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Cuota de horas mensuales por personal (regla de negocio)
CREATE TABLE IF NOT EXISTS turnos_cuota_horas (
    id SERIAL PRIMARY KEY,
    personal_id INT REFERENCES personal(id) ON DELETE CASCADE,
    anio INT NOT NULL,
    mes INT NOT NULL,
    horas_obligatorias DECIMAL(5,2) NOT NULL,  -- ej: 160.00
    fuente_financiamiento_id INT REFERENCES cat_fuentes_financiamiento(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(personal_id, anio, mes)
);

-- 5. Vista materializada o tabla de resumen de carga horaria (para performance)
CREATE TABLE IF NOT EXISTS turnos_carga_horaria_resumen (
    personal_id INT PRIMARY KEY REFERENCES personal(id) ON DELETE CASCADE,
    anio INT NOT NULL,
    mes INT NOT NULL,
    horas_asignadas DECIMAL(5,2) DEFAULT 0,
    horas_obligatorias DECIMAL(5,2) DEFAULT 0,
    diferencia DECIMAL(5,2) GENERATED ALWAYS AS (horas_asignadas - horas_obligatorias) STORED,
    estado VARCHAR(20) GENERATED ALWAYS AS (
        CASE 
            WHEN horas_asignadas >= horas_obligatorias THEN 'CUMPLIDO'
            WHEN horas_asignadas > 0 THEN 'PARCIAL'
            ELSE 'SIN_ASIGNAR'
        END
    ) STORED,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(personal_id, anio, mes)
);

-- Índices críticos
CREATE INDEX idx_grilla_asig_personal_fecha ON turnos_grilla_asignaciones(personal_id, fecha_inicio);
CREATE INDEX idx_grilla_asig_grilla_fecha ON turnos_grilla_asignaciones(grilla_semanal_id, fecha_inicio);
CREATE INDEX idx_carga_resumen_anio_mes ON turnos_carga_horaria_resumen(anio, mes);
```

**Relaciones clave:**
- `turnos_servicios_config` → 1:N → `turnos_grilla_semanal` (definición de celdas)
- `turnos_grilla_semanal` → 1:N → `turnos_grilla_asignaciones` (ocupación de celdas)
- `personal` → `vinculos_laborales` → `fuente_financiamiento` + `unidad_servicio` (para filtrar y calcular cuotas)
- `turnos_cuota_horas` se popula automáticamente desde `vinculos_laborales.carga_horaria` + `fuente_financiamiento`

---

### 2. Estructura de Componentes Frontend

```
frontend/src/
├── pages/
│   └── TurnosGridPage.jsx          # Nueva página principal (reemplaza TurnosPage)
├── components/
│   ├── TurnosGrid/
│   │   ├── TurnosGridContainer.jsx     # Layout principal: Sidebar + Grid + Resumen
│   │   ├── TurnosGridSidebar.jsx       # Lista de personal disponible (draggable)
│   │   ├── TurnosGridTable.jsx         # Tabla cruzada Días x Franjas (drop zone)
│   │   ├── TurnosGridCell.jsx          # Celda individual (drop target + info)
│   │   ├── TurnosGridHeader.jsx        # Selector Servicio, Mes, Año, Filtros
│   │   ├── TurnosGridResumen.jsx       # Panel derecho: Carga horaria en tiempo real
│   │   ├── TurnosGridPersonalCard.jsx  # Tarjeta arrastrable del empleado
│   │   ├── TurnosGridLegend.jsx        # Leyenda de colores/estados
│   │   └── hooks/
│   │       ├── useTurnosGrid.js        # Estado global del grid (React Query + local state)
│   │       ├── useDragDrop.js          # Lógica drag-and-drop (react-dnd o dnd-kit)
│   │       └── useCargaHoraria.js      # Cálculo tiempo real de horas
│   └── ui/
│       ├── DraggableItem.jsx           # Wrapper genérico drag
│       └── DroppableZone.jsx           # Wrapper genérico drop
```

**Flujo de datos:**
```
TurnosGridContainer
  ├── useTurnosGrid() → fetch: servicios, grilla_semanal, asignaciones, personal, cuotas
  │
  ├── TurnosGridHeader (Servicio ↓, Mes/Año, Filtro fuente financiamiento)
  │
  ├── TurnosGridSidebar (lista personal filtrado por servicio/fuente)
  │     └── PersonalCard (draggable) → muestra: nombre, CI, fuente, horas asignadas/requeridas, estado
  │
  ├── TurnosGridTable (Días x Franjas)
  │     └── TurnosGridCell (droppable)
  │           ├── Ocupada: muestra iniciales + horas de esa franja
  │           ├── Vacía: muestra "+" con cupo disponible
  │           └── Over cupo: badge warning
  │
  └── TurnosGridResumen (sticky right panel)
        ├── Total personal del servicio
        ├── Por fuente financiamiento: horas asignadas vs requeridas
        ├── Alertas: personal sin asignar, excedidos, por cumplir
        └── Botón "Guardar cambios" (batch update)
```

---

### 3. Lógica de Cálculo de Carga Horaria (Tiempo Real)

**Arquitectura:** Cálculo en frontend (inmediato) + validación en backend (al guardar)

```javascript
// hooks/useCargaHoraria.js

const FRANJA_HORAS = {
  manana: 7,    // 07:00-14:00
  tarde: 7,     // 14:00-21:00
  noche: 12,    // 21:00-07:00 (36h window)
  completo: 14  // 07:00-21:00
};

export function useCargaHoraria({ asignaciones, grillaSemanal, cuotas, mes, anio }) {
  
  // 1. Calcular horas por personal en el mes actual (basado en asignaciones visibles)
  const horasPorPersonal = useMemo(() => {
    const mapa = new Map(); // personal_id -> { total, porFuente, porDia }
    
    asignaciones.forEach(asig => {
      const grilla = grillaSemanal.find(g => g.id === asig.grilla_semanal_id);
      if (!grilla) return;
      
      const horasFranja = FRANJA_HORAS[grilla.tipo_franja] || 
                         (grilla.franja_fin - grilla.franja_inicio) / 60;
      
      // Calcular días en el mes que cubre esta asignación
      const inicio = new Date(Math.max(new Date(asig.fecha_inicio), new Date(anio, mes-1, 1)));
      const fin = asig.fecha_fin ? new Date(asig.fecha_fin) : new Date(anio, mes, 0);
      const diasEnMes = Math.max(0, Math.ceil((fin - inicio) / (1000*60*60*24)) + 1);
      
      const horasMes = horasFranja * diasEnMes;
      
      if (!mapa.has(asig.personal_id)) {
        mapa.set(asig.personal_id, { total: 0, porFuente: {}, porDia: {} });
      }
      const p = mapa.get(asig.personal_id);
      p.total += horasMes;
      // Agrupar por fuente financiamiento (viene en personal data)
    });
    
    return mapa;
  }, [asignaciones, grillaSemanal, mes, anio]);

  // 2. Comparar con cuotas obligatorias
  const estadoCarga = useMemo(() => {
    const resultado = {};
    cuotas.forEach(cuota => {
      const asignadas = horasPorPersonal.get(cuota.personal_id)?.total || 0;
      const obligatorias = cuota.horas_obligatorias;
      const diff = asignadas - obligatorias;
      
      resultado[cuota.personal_id] = {
        horasAsignadas: asignadas,
        horasObligatorias: obligatorias,
        diferencia: diff,
        porcentaje: obligatorias > 0 ? (asignadas / obligatorias * 100).toFixed(1) : 0,
        estado: diff >= 0 ? 'CUMPLIDO' : diff > -obligatorias * 0.2 ? 'CASI' : 'DEFICIT',
        alerta: diff < 0 ? `Faltan ${Math.abs(diff)}h` : diff > obligatorias * 0.1 ? 'Excede 10%' : null
      };
    });
    return resultado;
  }, [horasPorPersonal, cuotas]);

  // 3. Función para preview durante drag (simula el drop)
  const previewDrop = useCallback((personalId, targetGrillaId, fechaInicio, fechaFin) => {
    const grilla = grillaSemanal.find(g => g.id === targetGrillaId);
    if (!grilla) return null;
    
    const horasFranja = FRANJA_HORAS[grilla.tipo_franja];
    const dias = calcularDiasEnMes(fechaInicio, fechaFin, mes, anio);
    const horasNuevas = horasFranja * dias;
    
    const actual = horasPorPersonal.get(personalId)?.total || 0;
    const cuota = cuotas.find(c => c.personal_id === personalId)?.horas_obligatorias || 0;
    
    return {
      horasProyectadas: actual + horasNuevas,
      horasObligatorias: cuota,
      diferenciaProyectada: actual + horasNuevas - cuota,
      estadoProyectado: actual + horasNuevas >= cuota ? 'CUMPLIDO' : 'DEFICIT'
    };
  }, [grillaSemanal, horasPorPersonal, cuotas, mes, anio]);

  // 4. Resumen por fuente de financiamiento
  const resumenPorFuente = useMemo(() => {
    const resumen = {};
    cuotas.forEach(cuota => {
      const fuente = cuota.fuente_financiamiento_nombre || 'SIN_FUENTE';
      if (!resumen[fuente]) resumen[fuente] = { asignadas: 0, obligatorias: 0, personal: 0 };
      const h = horasPorPersonal.get(cuota.personal_id)?.total || 0;
      resumen[fuente].asignadas += h;
      resumen[fuente].obligatorias += cuota.horas_obligatorias;
      resumen[fuente].personal += 1;
    });
    return resumen;
  }, [horasPorPersonal, cuotas]);

  return { horasPorPersonal, estadoCarga, previewDrop, resumenPorFuente };
}
```

**Durante drag-and-drop:**
1. Usuario arrastra `PersonalCard` → `TurnosGridCell`
2. `onDragOver` llama a `previewDrop(personalId, grillaId, fechaInicio, fechaFin)`
3. Muestra tooltip/preview: "Juan Pérez: 152h → 168h (Cumple 160h requeridas)"
4. Al soltar (`onDrop`): actualiza estado local optimista + encola para batch save

---

### 4. Middleware RBAC para "Jefe de Servicio"

**Estrategia:** Extender el sistema actual de permisos con un nuevo permiso granular + validación de pertenencia al servicio.

```javascript
// backend/src/middleware/turnosGridAuth.js

const db = require('../config/db');
const ConfiguracionService = require('../services/configuracionService');

/**
 * Middleware: Verifica si el usuario es "Jefe de Servicio" del servicio solicitado
 * Se usa en rutas POST/PUT/DELETE de /api/turnos-grid/*
 */
const checkJefeDeServicio = async (req, res, next) => {
  if (!req.usuario) return res.status(401).json({ error: 'No autenticado' });

  // 1. Admin global pasa siempre
  const adminRole = await ConfiguracionService.get('seguridad_rol_admin', 'ADMIN');
  if (req.usuario.roles.includes(adminRole)) return next();

  // 2. Verificar permiso base 'turnos-grid.gestionar'
  if (!req.usuario.permisos.includes('turnos-grid.gestionar')) {
    return res.status(403).json({ error: 'Permiso turnos-grid.gestionar requerido' });
  }

  // 3. Obtener servicio_id del request (body, query o params)
  const servicioId = req.body.servicio_id || req.query.servicio_id || req.params.servicioId;
  if (!servicioId) {
    return res.status(400).json({ error: 'servicio_id requerido para validar jefatura' });
  }

  // 4. Verificar que el usuario es jefe de ESE servicio
  // Asumimos que en vinculos_laborales hay un campo 'es_jefe' o rol 'JEFE'
  const { rows } = await db.query(`
    SELECT 1 FROM vinculos_laborales vl
    JOIN personal p ON vl.personal_id = p.id
    JOIN usuarios u ON u.personal_id = p.id
    WHERE u.id = $1 
      AND vl.unidad_servicio = (SELECT unidad_servicio FROM turnos_servicios_config WHERE id = $2)
      AND (vl.cargo_actual ILIKE '%jefe%' OR vl.cargo_actual ILIKE '%director%' OR vl.es_jefe = true)
      AND vl.fecha_fin IS NULL
  `, [req.usuario.id, servicioId]);

  if (rows.length === 0) {
    return res.status(403).json({ 
      error: 'Solo el Jefe de Servicio puede modificar turnos de esta unidad',
      codigo: 'NO_ES_JEFE_SERVICIO'
    });
  }

  // 5. Adjuntar servicio validado al request para uso posterior
  req.servicioValidado = servicioId;
  next();
};

/**
 * Middleware: Para lectura - permite ver su propio horario o si tiene permiso
 */
const checkLecturaTurnosGrid = async (req, res, next) => {
  if (!req.usuario) return res.status(401).json({ error: 'No autenticado' });
  
  const adminRole = await ConfiguracionService.get('seguridad_rol_admin', 'ADMIN');
  if (req.usuario.roles.includes(adminRole)) return next();
  
  if (req.usuario.permisos.includes('turnos-grid.ver')) return next();
  
  // Permitir ver SU PROPIO horario (personal_id match)
  const servicioId = req.query.servicio_id || req.params.servicioId;
  if (servicioId) {
    const { rows } = await db.query(`
      SELECT 1 FROM vinculos_laborales vl
      JOIN personal p ON vl.personal_id = p.id
      JOIN usuarios u ON u.personal_id = p.id
      WHERE u.id = $1 AND vl.unidad_servicio = (
        SELECT unidad_servicio FROM turnos_servicios_config WHERE id = $2
      )
    `, [req.usuario.id, servicioId]);
    if (rows.length > 0) return next();
  }
  
  return res.status(403).json({ error: 'Sin permisos para ver este horario' });
};

module.exports = { checkJefeDeServicio, checkLecturaTurnosGrid };
```

**Rutas protegidas:**
```javascript
// backend/src/routes/turnosGridRoutes.js
router.get('/servicios', checkPermission('turnos-grid.ver'), Controller.getServicios);
router.get('/grilla/:servicioId', checkLecturaTurnosGrid, Controller.getGrilla);
router.get('/personal-disponible/:servicioId', checkLecturaTurnosGrid, Controller.getPersonalDisponible);
router.get('/carga-horaria/:servicioId', checkLecturaTurnosGrid, Controller.getCargaHoraria);

router.post('/asignaciones', checkJefeDeServicio, Controller.createAsignacion);
router.put('/asignaciones/:id', checkJefeDeServicio, Controller.updateAsignacion);
router.delete('/asignaciones/:id', checkJefeDeServicio, Controller.deleteAsignacion);
router.post('/asignaciones/batch', checkJefeDeServicio, Controller.batchSave); // Guardar todo el grid
```

**Configuración de permisos (seed):**
```sql
INSERT INTO permisos (codigo, descripcion, modulo) VALUES
('turnos-grid.ver', 'Ver panel interactivo de turnos', 'turnos'),
('turnos-grid.gestionar', 'Gestionar asignaciones en panel interactivo', 'turnos')
ON CONFLICT DO NOTHING;

-- Asignar a rol JEFE_SERVICIO (crear rol si no existe)
INSERT INTO roles (nombre, descripcion) VALUES ('JEFE_SERVICIO', 'Jefe de unidad/servicio') ON CONFLICT DO NOTHING;

INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT r.id, p.id FROM roles r, permisos p
WHERE r.nombre = 'JEFE_SERVICIO' AND p.codigo IN ('turnos-grid.ver', 'turnos-grid.gestionar')
ON CONFLICT DO NOTHING;
```

---

### 5. Preguntas de Clarificación Antes de Implementar

| Tema | Pregunta |
|------|----------|
| **Coexistencia** | ¿El nuevo panel **reemplaza** completamente a `TurnosPage` actual o **coexiste**? (Afeta migración de datos) |
| **Franjas horarias** | ¿Son **fijas por servicio** (ej. Farmacia siempre 07-14, 14-21) o **configurables por día**? |
| **Cupo por celda** | ¿Siempre **1 persona por franja** o puede haber **múltiples** (ej. 2 enfermeras en misma franja)? |
| **Ventana temporal** | ¿El grid es **semanal repetitiva** (L-D se repite) o **mensual día a día**? |
| **Fuente financiamiento** | ¿La cuota de horas viene de `vinculos_laborales.carga_horaria` (string) o tabla nueva `turnos_cuota_horas`? |
| **Validación solapamiento** | ¿Un empleado puede estar en **dos servicios a la vez**? (Actual sistema lo permite con `turnos_asignados`) |
| **Persistencia** | ¿Guardar **cada drop** (auto-save) o **batch al final** (botón "Guardar cambios")? |
| **Historial** | ¿Se requiere **auditoría** de quién movió qué y cuándo? |

---

### 6. Próximos Pasos Sugeridos

1. **Confirmar respuestas** a las preguntas arriba
2. **Crear migración SQL** con las nuevas tablas
3. **Backend**: Servicios + Controladores + Rutas + Middleware
4. **Frontend**: Componentes grid + hooks + integración React Query
5. **Testing**: Drag-drop, cálculos, permisos
6. **Migración de datos**: Popular `turnos_servicios_config` desde `cat_unidades_servicios` + `turnos_plantilla` actual

¿Quieres que profundice en algún punto específico o procedo con la implementación tras tus respuestas?

---

## User

Tema Coexistencia si, franjas por dia, cupo multiple, ventana temporal mensual dia a dia, fuente nueva tabla, validacion puede estar en dos servicios y en mas de un tipo de contrato, persistencia al final, historial si.

---

## Assistant (Plan · Nemotron 3 Ultra Free · 235.1s)

_Thinking:_

The user has provided answers to my clarifying questions. Let me summarize the key decisions:

1. **Coexistencia**: SÍ - el nuevo panel coexiste con el actual TurnosPage
2. **Franjas por día**: Configurables por día (no fijas semanalmente)
3. **Cupo múltiple**: Sí, múltiples personas por celda/franja
4. **Ventana temporal**: Mensual día a día (no semanal repetitiva)
5. **Fuente financiamiento**: Nueva tabla `turnos_cuota_horas`
6. **Validación solapamiento**: Permitido - un empleado puede estar en dos servicios y más de un tipo de contrato
7. **Persistencia**: Al final (batch save con botón "Guardar cambios")
7. **Historial**: Sí, auditoría de movimientos

Now I need to create a comprehensive implementation plan. Let me think through the architecture:

### Key Design Decisions Based on Answers:

1. **Coexistencia**: New tables, new routes, new page. Keep existing `turnos_plantilla` and `turnos_asignados` intact. The new grid is a separate planning tool.

2. **Franjas por día + Mensual día a día**: This means `turnos_grilla_semanal` becomes `turnos_grilla_mensual` or we store day-by-day configuration. Since it's monthly day-by-day, each cell is a specific date + time slot.

3. **Cupo múltiple**: `cupo_maximo` in grid config, and multiple assignments per cell.

4. **Validación solapamiento permitida**: No unique constraint on (personal_id, fecha, franja). But we should warn/alert in UI.

5. **Persistencia batch**: Frontend accumulates changes, sends all at once on "Guardar".

6. **Historial**: Audit table for every assignment change.

Let me refine the data model and create a detailed plan.

Gracias por las respuestas. Tengo claridad total. Aquí está el **Plan de Implementación Detallado**:

---

## 📐 PLAN DE IMPLEMENTACIÓN: Panel Interactivo de Turnos (Grid Mensual Día a Día)

### 1. Modelo de Datos Refinado

```sql
-- ============================================================
-- MIGRACIÓN: turnos_grid_interactivo.sql
-- ============================================================

-- 1. Configuración de Servicios (Unidades) con franjas POR DÍA
CREATE TABLE IF NOT EXISTS turnos_grid_servicios (
    id SERIAL PRIMARY KEY,
    unidad_servicio VARCHAR(150) NOT NULL UNIQUE,
    -- Franjas por día del mes: { "1": [{"inicio":"07:00","fin":"14:00","tipo":"manana","cupo":2}, ...], "2": [...] }
    franjas_por_dia JSONB NOT NULL DEFAULT '{}',
    -- Horas requeridas mensuales por fuente financiamiento
    horas_requeridas_mes JSONB DEFAULT '{}',  -- { "TGN": 160, "GOB": 144, "Contrato GAMO": 120 }
    color_identificacion VARCHAR(7) DEFAULT '#3B82F6', -- para UI
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Grilla Mensual Día a Día (instancia calculada para un mes/año)
CREATE TABLE IF NOT EXISTS turnos_grid_mensual (
    id SERIAL PRIMARY KEY,
    servicio_id INT REFERENCES turnos_grid_servicios(id) ON DELETE CASCADE,
    anio INT NOT NULL,
    mes INT NOT NULL, -- 1-12
    dia INT NOT NULL, -- 1-31
    franja_inicio TIME NOT NULL,
    franja_fin TIME NOT NULL,
    tipo_franja VARCHAR(20) CHECK (tipo_franja IN ('manana','tarde','noche','completo','personalizada')),
    cupo_maximo INT DEFAULT 1,
    horas_franja DECIMAL(4,2) GENERATED ALWAYS AS (
        CASE 
            WHEN franja_fin > franja_inicio THEN EXTRACT(EPOCH FROM (franja_fin - franja_inicio))/3600
            ELSE EXTRACT(EPOCH FROM (franja_fin - franja_inicio + INTERVAL '24 hours'))/3600
        END
    ) STORED,
    es_festivo BOOLEAN DEFAULT false,
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(servicio_id, anio, mes, dia, franja_inicio, franja_fin)
);

-- 3. Asignaciones en la Grilla (estado actual del drag-and-drop)
CREATE TABLE IF NOT EXISTS turnos_grid_asignaciones (
    id SERIAL PRIMARY KEY,
    grid_mensual_id INT REFERENCES turnos_grid_mensual(id) ON DELETE CASCADE,
    personal_id INT REFERENCES personal(id) ON DELETE CASCADE,
    -- Override opcional de horarios para esta asignación específica
    franja_inicio_override TIME,
    franja_fin_override TIME,
    -- Metadatos
    creado_por INT REFERENCES usuarios(id),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_por INT REFERENCES usuarios(id),
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Para validar solapamientos en UI (no constraint único por decisión de negocio)
    UNIQUE(grid_mensual_id, personal_id) -- una persona una vez por celda
);

-- 4. Cuota de Horas Mensuales por Personal (nueva tabla)
CREATE TABLE IF NOT EXISTS turnos_grid_cuotas (
    id SERIAL PRIMARY KEY,
    personal_id INT REFERENCES personal(id) ON DELETE CASCADE,
    anio INT NOT NULL,
    mes INT NOT NULL,
    horas_obligatorias DECIMAL(6,2) NOT NULL,
    fuente_financiamiento_id INT REFERENCES cat_fuentes_financiamiento(id),
    tipo_contrato_id INT REFERENCES cat_tipos_personal(id),
    origen VARCHAR(20) CHECK (origen IN ('AUTO','MANUAL','IMPORTADO')) DEFAULT 'AUTO',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(personal_id, anio, mes, fuente_financiamiento_id, tipo_contrato_id)
);

-- 5. Resumen de Carga Horaria (materializada para performance)
CREATE TABLE IF NOT EXISTS turnos_grid_carga_resumen (
    personal_id INT REFERENCES personal(id) ON DELETE CASCADE,
    anio INT NOT NULL,
    mes INT NOT NULL,
    servicio_id INT REFERENCES turnos_grid_servicios(id) ON DELETE CASCADE,
    horas_asignadas DECIMAL(6,2) DEFAULT 0,
    horas_obligatorias DECIMAL(6,2) DEFAULT 0,
    diferencia DECIMAL(6,2) GENERATED ALWAYS AS (horas_asignadas - horas_obligatorias) STORED,
    estado VARCHAR(20) GENERATED ALWAYS AS (
        CASE 
            WHEN horas_asignadas >= horas_obligatorias THEN 'CUMPLIDO'
            WHEN horas_asignadas > 0 THEN 'PARCIAL'
            ELSE 'SIN_ASIGNAR'
        END
    ) STORED,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (personal_id, anio, mes, servicio_id)
);

-- 6. AUDITORÍA / HISTORIAL (requerido)
CREATE TABLE IF NOT EXISTS turnos_grid_auditoria (
    id BIGSERIAL PRIMARY KEY,
    grid_mensual_id INT REFERENCES turnos_grid_mensual(id) ON DELETE SET NULL,
    personal_id INT REFERENCES personal(id) ON DELETE SET NULL,
    accion VARCHAR(20) NOT NULL CHECK (accion IN ('CREATE','UPDATE','DELETE','MOVE','BATCH')),
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    usuario_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_grid_auditoria_personal_fecha ON turnos_grid_auditoria(personal_id, created_at);
CREATE INDEX idx_grid_auditoria_grid_fecha ON turnos_grid_auditoria(grid_mensual_id, created_at);
CREATE INDEX idx_grid_auditoria_usuario_fecha ON turnos_grid_auditoria(usuario_id, created_at);

-- 7. Función para generar grilla mensual desde configuración de servicio
CREATE OR REPLACE FUNCTION generar_grilla_mensual(p_servicio_id INT, p_anio INT, p_mes INT)
RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE
    v_dias INT;
    v_dia INT;
    v_franjas JSONB;
    v_franja RECORD;
BEGIN
    -- Eliminar grilla existente para ese mes
    DELETE FROM turnos_grid_mensual WHERE servicio_id = p_servicio_id AND anio = p_anio AND mes = p_mes;
    
    -- Obtener días del mes
    v_dias := EXTRACT(DAY FROM (DATE_TRUNC('month', MAKE_DATE(p_anio, p_mes, 1)) + INTERVAL '1 month - 1 day'));
    
    -- Obtener configuración de franjas del servicio
    SELECT franjas_por_dia INTO v_franjas FROM turnos_grid_servicios WHERE id = p_servicio_id;
    
    -- Insertar día por día
    FOR v_dia IN 1..v_dias LOOP
        -- Franjas para este día (key = día de semana 0-6 o día del mes 1-31)
        -- Prioridad: día del mes específico > día de semana
        FOR v_franja IN SELECT * FROM jsonb_array_elements(
            COALESCE(v_franjas->>v_dia::text, v_franjas->>((EXTRACT(DOW FROM MAKE_DATE(p_anio, p_mes, v_dia))::int))::text, '[]')::jsonb
        ) LOOP
            INSERT INTO turnos_grid_mensual (servicio_id, anio, mes, dia, franja_inicio, franja_fin, tipo_franja, cupo_maximo, es_festivo)
            VALUES (
                p_servicio_id, p_anio, p_mes, v_dia,
                (v_franja->>'inicio')::time,
                (v_franja->>'fin')::time,
                COALESCE(v_franja->>'tipo', 'personalizada'),
                COALESCE((v_franja->>'cupo')::int, 1),
                false -- TODO: calcular festivos
            ) ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;
END $$;

-- Índices críticos
CREATE INDEX idx_grid_mensual_servicio_mes ON turnos_grid_mensual(servicio_id, anio, mes);
CREATE INDEX idx_grid_asig_personal_mes ON turnos_grid_asignaciones(personal_id) 
    INCLUDE (grid_mensual_id);
CREATE INDEX idx_grid_asig_grid ON turnos_grid_asignaciones(grid_mensual_id);
CREATE INDEX idx_grid_cuotas_personal_mes ON turnos_grid_cuotas(personal_id, anio, mes);
```

---

### 2. Arquitectura Backend

```
backend/src/
├── services/
│   ├── turnosGridService.js          # Lógica principal: grilla, asignaciones, cuotas, cálculos
│   ├── turnosGridCuotaService.js     # Cálculo/actualización de cuotas desde vinculos_laborales
│   └── turnosGridAuditService.js     # Registro de auditoría
├── controllers/
│   └── turnosGridController.js       # Endpoints REST
├── routes/
│   └── turnosGridRoutes.js           # Rutas con middleware RBAC
├── middleware/
│   └── turnosGridAuth.js             # checkJefeServicio, checkLecturaGrid
└── utils/
    └── gridGenerators.js             # Generar grilla mensual, recalcular resúmenes
```

**Endpoints Principales:**

| Método | Ruta | Permiso | Descripción |
|--------|------|---------|-------------|
| GET | `/api/turnos-grid/servicios` | `turnos-grid.ver` | Lista servicios configurados |
| GET | `/api/turnos-grid/:servicioId/grilla?mes=&anio=` | `turnos-grid.ver` (+ propio) | Grilla mensual completa con asignaciones |
| GET | `/api/turnos-grid/:servicioId/personal-disponible?mes=&anio=` | `turnos-grid.ver` | Personal del servicio con cuotas y carga actual |
| GET | `/api/turnos-grid/:servicioId/carga-horaria?mes=&anio=` | `turnos-grid.ver` | Resumen agregado por fuente financiamiento |
| POST | `/api/turnos-grid/asignaciones/batch` | `turnos-grid.gestionar` (Jefe) | **Guardar todo el grid** (array de cambios) |
| POST | `/api/turnos-grid/asignaciones` | `turnos-grid.gestionar` (Jefe) | Crear asignación individual |
| PUT | `/api/turnos-grid/asignaciones/:id` | `turnos-grid.gestionar` (Jefe) | Mover/editar asignación |
| DELETE | `/api/turnos-grid/asignaciones/:id` | `turnos-grid.gestionar` (Jefe) | Eliminar asignación |
| GET | `/api/turnos-grid/:servicioId/auditoria?personalId=&desde=&hasta=` | `turnos-grid.ver` | Historial de cambios |
| POST | `/api/turnos-grid/:servicioId/generar-grilla?mes=&anio=` | `turnos-grid.gestionar` | Generar/regenerar grilla mensual |

**Batch Save Payload:**
```json
{
  "servicioId": 5,
  "mes": 8,
  "anio": 2026,
  "cambios": [
    { "accion": "CREATE", "gridMensualId": 123, "personalId": 45, "franjaInicioOverride": "07:00" },
    { "accion": "MOVE", "asignacionId": 789, "nuevoGridMensualId": 124 },
    { "accion": "DELETE", "asignacionId": 790 }
  ]
}
```

---

### 3. Arquitectura Frontend

```
frontend/src/
├── pages/
│   └── TurnosGridPage.jsx              # Nueva página (coexiste con TurnosPage)
├── components/
│   ├── TurnosGrid/
│   │   ├── TurnosGridContainer.jsx     # Layout: Header + Sidebar + Grid + Resumen
│   │   ├── TurnosGridHeader.jsx        # Selector Servicio, Mes/Año, Filtros, Botón Guardar
│   │   ├── TurnosGridSidebar.jsx       # Lista personal draggable (agrupado por fuente)
│   │   ├── TurnosGridSidebarPersonalCard.jsx  # Tarjeta arrastrable con info horas
│   │   ├── TurnosGridTable.jsx         # Tabla Día x Franjas (scroll horizontal + vertical)
│   │   ├── TurnosGridDayColumn.jsx     # Columna de un día (header + celdas)
│   │   ├── TurnosGridCell.jsx          # Celda droppable (muestra ocupantes, cupo, horas)
│   │   ├── TurnosGridResumenPanel.jsx  # Panel derecho sticky: KPIs por fuente, alertas
│   │   ├── TurnosGridLegend.jsx        # Leyenda colores/estados
│   │   ├── TurnosGridSaveModal.jsx     # Modal confirmación guardado batch
│   │   └── hooks/
│   │       ├── useTurnosGrid.js        # Estado global, React Query, mutations
│   │       ├── useGridDragDrop.js      # dnd-kit: sensors, collisionDetection, modifiers
│   │       ├── useCargaHorariaTiempoReal.js  # Cálculo optimista durante drag
│   │       └── useGridAuditoria.js     # Fetch historial
│   └── ui/
│       ├── DraggablePersonalCard.jsx
│       └── DroppableGridCell.jsx
```

**Estado Global (useTurnosGrid):**
```javascript
// Estado principal
{
  servicioSeleccionado: null,
  mes: 8, anio: 2026,
  grilla: [],           // turnos_grid_mensual[] con asignaciones embebidas
  personalDisponible: [], // personal con cuotas, horas asignadas, fuente
  cargaResumen: {},     // resumen por fuente financiamiento
  cambiosPendientes: [], // [{accion, asignacionId?, gridMensualId, personalId, ...}]
  isDirty: false,
  loading: false,
  saving: false
}

// Acciones
- fetchGrilla(servicioId, mes, anio)
- fetchPersonalDisponible(servicioId, mes, anio)
- fetchCargaHoraria(servicioId, mes, anio)
- addCambio(cambio)           // optimista
- removeCambio(index)
- saveCambios()               // POST batch
- resetCambios()
```

---

### 4. Lógica Drag-and-Drop (dnd-kit)

```javascript
// hooks/useGridDragDrop.js
import { useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export function useGridDragDrop({ personalDisponible, grilla, onDrop }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { 
      activationConstraint: { distance: 8 },
      delay: 100
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    // active.data.current = { tipo: 'personal', personalId, horasFranja, cuota... }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;
    // Preview: calcular horas proyectadas para tooltip
    const preview = calcularPreview(active.data.current, over.id);
    setDragPreview(preview);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;
    
    const cambio = {
      accion: 'CREATE', // o 'MOVE' si active.id es asignacionId
      personalId: active.data.current.personalId,
      gridMensualId: over.data.current.gridMensualId,
      franjaInicioOverride: active.data.current.franjaInicioOverride,
      // ...
    };
    onDrop(cambio); // se agrega a cambiosPendientes
  };

  return { sensors, handleDragStart, handleDragOver, handleDragEnd };
}
```

**Cálculo Tiempo Real (useCargaHorariaTiempoReal):**
- Input: `personalDisponible` (con `horasAsignadasActual`, `horasObligatorias`), `cambiosPendientes`, `grilla` (para horas por franja)
- Output: `estadoProyectado[personalId]` = { horasProyectadas, diferencia, estado, alerta }
- Se recalcula en cada `onDragOver` y `addCambio` (memoizado)

---

### 5. Middleware RBAC (Refinado)

```javascript
// backend/src/middleware/turnosGridAuth.js
const checkJefeServicio = async (req, res, next) => {
  // 1. Admin global
  // 2. Permiso 'turnos-grid.gestionar'
  // 3. Validar que usuario es JEFE del servicio_id del request
  //    - Buscar en vinculos_laborales donde cargo_actual ILIKE '%jefe%' OR es_jefe = true
  //    - Y unidad_servicio coincide con turnos_grid_servicios.unidad_servicio
  // 4. Permitir si tiene personal_id en ese servicio (para ver su propio horario)
};

const checkLecturaGrid = async (req, res, next) => {
  // Admin | permiso 'turnos-grid.ver' | personal del servicio
};
```

**Permisos a crear:**
```sql
INSERT INTO permisos (codigo, descripcion, modulo) VALUES
('turnos-grid.ver', 'Ver panel interactivo de turnos', 'turnos'),
('turnos-grid.gestionar', 'Gestionar asignaciones en panel interactivo', 'turnos')
ON CONFLICT DO NOTHING;

INSERT INTO roles (nombre, descripcion) VALUES 
('JEFE_SERVICIO', 'Jefe de unidad/servicio - gestiona turnos de su servicio')
ON CONFLICT DO NOTHING;

INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT r.id, p.id FROM roles r, permisos p
WHERE r.nombre = 'JEFE_SERVICIO' AND p.codigo LIKE 'turnos-grid.%'
ON CONFLICT DO NOTHING;
```

---

### 6. Flujo de Datos Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
├─────────────────────────────────────────────────────────────────┤
│  TurnosGridPage                                                 │
│    └─ TurnosGridContainer (useTurnosGrid)                       │
│         ├─ Header: Servicio ▼  Mes ▼  Año ▼  [Guardar Cambios]  │
│         ├─ Sidebar: PersonalDisponible (draggable)              │
│         │    └─ PersonalCard: Nombre, CI, Fuente, 152/160h ⚠️   │
│         ├─ Grid: Día 1-31 x Franjas (droppable)                 │
│         │    └─ Cell: [Iniciales] x3  Cupo: 2/3  7h c/u         │
│         └─ ResumenPanel (sticky right):                         │
│              TGN: 1,240/1,280h (97%)  3 alertas                │
│              GOB:  890/1,008h (88%)  5 alertas                 │
│              Contrato: 450/480h (94%)  1 alerta                │
│                                                                  │
│  Drag PersonalCard → Drop Cell → addCambio() → isDirty=true     │
│  Click "Guardar Cambios" → POST /batch → audit → refresh        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND                                   │
├─────────────────────────────────────────────────────────────────┤
│  POST /api/turnos-grid/asignaciones/batch                       │
│    └─ checkJefeServicio(req.servicioId)                         │
│    └─ TurnosGridService.batchSave(cambios)                      │
│         ├─ TRANSACTION                                           │
│         ├─ Para cada cambio:                                    │
│         │    CREATE → INSERT turnos_grid_asignaciones           │
│         │    MOVE   → UPDATE grid_mensual_id                    │
│         │    DELETE → DELETE                                    │
│         │    INSERT turnos_grid_auditoria (cada cambio)         │
│         ├─ Recalcular turnos_grid_carga_resumen                 │
│         │    (horas_asignadas = SUM(franja.horas * dias_cubiertos)) │
│         └─ COMMIT                                               │
│    └─ Return { actualizados, creados, eliminados, resumen }     │
└─────────────────────────────────────────────────────────────────┘
```

---

### 7. Tareas de Implementación (Orden Sugerido)

| # | Fase | Tareas | Archivos Clave |
|---|------|--------|----------------|
| 1 | **DB** | Migración SQL completa | `sql/migration_turnos_grid.sql` |
| 2 | **Seed** | Poblar `turnos_grid_servicios` desde `cat_unidades_servicios` + `turnos_plantilla` actual | `backend/src/utils/seedGrid.js` |
| 3 | **Backend Core** | Service: grilla, asignaciones, cuotas, auditoría | `turnosGridService.js`, `turnosGridCuotaService.js` |
| 4 | **Backend API** | Controller + Routes + Middleware RBAC | `turnosGridController.js`, `turnosGridRoutes.js`, `turnosGridAuth.js` |
| 5 | **Frontend Core** | Hooks: useTurnosGrid, useGridDragDrop, useCargaHoraria | `hooks/useTurnosGrid.js`, `hooks/useGridDragDrop.js` |
| 6 | **Frontend UI** | Componentes: Container, Sidebar, Grid, Cell, ResumenPanel | `TurnosGridContainer.jsx`, `TurnosGridTable.jsx`, etc. |
| 7 | **Integración** | Página `TurnosGridPage.jsx` + routing + menú lateral | `App.jsx`, `Sidebar.jsx` |
| 8 | **Testing** | Drag-drop, cálculos, permisos, batch save, auditoría | - |
| 9 | **Docs** | README actualizado, guía de usuario | `README.md` |

---

### 8. Decisiones Técnicas Clave (para confirmar)

| Decisión | Opción Elegida | Alternativa |
|----------|----------------|-------------|
| **Librería DnD** | `dnd-kit` (moderno, accesible, TypeScript) | `react-beautiful-dnd` (legacy) |
| **Estado global** | React Query + useReducer local | Redux Toolkit / Zustand |
| **Generación grilla** | Función PL/pgSQL `generar_grilla_mensual()` | JS en backend |
| **Recálculo resumen** | Trigger PG `AFTER INSERT/UPDATE/DELETE` en asignaciones | Job cron / batch manual |
| **Validación solapamiento** | Solo warning en UI (no block) | Block en backend |
| **Festivos** | Columna `es_festivo` en grilla (manual o API externa) | Calendario boliviano hardcoded |

---

### 9. Preguntas Finales Antes de Ejecutar

1. **dnd-kit vs react-beautiful-dnd**: ¿Prefieres `dnd-kit` (recomendado, activo) o ya usan otra librería?
2. **Festivos**: ¿Tabla `cat_feriados` existente o agregamos columna `es_festivo` manual?
3. **Cuotas iniciales**: ¿Script para poblar `turnos_grid_cuotas` desde `vinculos_laborales.carga_horaria` (string) + `fuente_financiamiento_id` + `tipo_personal_id`?
4. **Menú lateral**: ¿Nuevo ítem "Turnos Grid" separado de "Turnos" actual?
5. **Rendimiento**: Grilla 31 días × ~6 franjas × ~50 personas = ~9,300 celdas. ¿Virtualización (react-window) o tabla simple?

---

¿Confirmas el plan o quieres ajustar algún punto antes de iniciar la implementación?

---

## User

1. dnd kit, 2. tabla cat_feriados, 3. si, 4. si, 5. tabla simple

---

## Assistant (Build · Nemotron 3 Ultra Free · 8.9s)

_Thinking:_

The user has confirmed all the technical decisions. Now I need to start implementing the solution. Let me create a todo list and begin with the database migration, then backend, then frontend.

Let me start by creating the SQL migration file.

**Tool: todowrite**

**Input:**
```json
{
  "todos": [
    {
      "content": "Crear migración SQL: turnos_grid_interactivo.sql con tablas, índices, función generar_grilla_mensual, triggers",
      "status": "in_progress",
      "priority": "high"
    },
    {
      "content": "Crear seed para poblar turnos_grid_servicios desde cat_unidades_servicios y turnos_plantilla",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Backend: turnosGridService.js - lógica grilla, asignaciones, cuotas, auditoría",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Backend: turnosGridCuotaService.js - cálculo cuotas desde vinculos_laborales",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Backend: turnosGridAuditService.js - registro auditoría",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Backend: turnosGridController.js - endpoints REST",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Backend: turnosGridRoutes.js + middleware turnosGridAuth.js",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Frontend: hooks useTurnosGrid, useGridDragDrop, useCargaHorariaTiempoReal",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Frontend: componentes TurnosGridContainer, Sidebar, Table, Cell, ResumenPanel",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Frontend: TurnosGridPage.jsx + routing + menú lateral",
      "status": "pending",
      "priority": "high"
    },
    {
      "content": "Testing: drag-drop, cálculos, permisos, batch save, auditoría",
      "status": "pending",
      "priority": "medium"
    }
  ]
}
```

**Output:**
```
[
  {
    "content": "Crear migración SQL: turnos_grid_interactivo.sql con tablas, índices, función generar_grilla_mensual, triggers",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "content": "Crear seed para poblar turnos_grid_servicios desde cat_unidades_servicios y turnos_plantilla",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Backend: turnosGridService.js - lógica grilla, asignaciones, cuotas, auditoría",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Backend: turnosGridCuotaService.js - cálculo cuotas desde vinculos_laborales",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Backend: turnosGridAuditService.js - registro auditoría",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Backend: turnosGridController.js - endpoints REST",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Backend: turnosGridRoutes.js + middleware turnosGridAuth.js",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Frontend: hooks useTurnosGrid, useGridDragDrop, useCargaHorariaTiempoReal",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Frontend: componentes TurnosGridContainer, Sidebar, Table, Cell, ResumenPanel",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Frontend: TurnosGridPage.jsx + routing + menú lateral",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "Testing: drag-drop, cálculos, permisos, batch save, auditoría",
    "status": "pending",
    "priority": "medium"
  }
]
```

---

## Assistant (Build · Nemotron 3 Ultra Free)

_Thinking:_

Now let me create the SQL migration file.

_Thinking:_

Now let me create the SQL migration file first

---

