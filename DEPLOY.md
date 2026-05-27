# Plan de Migración a Render

## 1. Migración de Base de Datos

### 1.1 Exportar BD local (con todos los datos migrados)

```bash
# Dump completo (schema + data, ~50-100 MB comprimido)
pg_dump -h /var/run/postgresql -U hitdev -d rrhh_barrios_mineros \
  --no-owner --no-acl -Fc > rrhh_dump_20260527.dump

# Alternativa: dump en SQL plano
pg_dump -h /var/run/postgresql -U hitdev -d rrhh_barrios_mineros \
  --no-owner --no-acl > rrhh_dump_20260527.sql
```

### 1.2 Crear BD en Render

1. Desde el Dashboard de Render: **New → PostgreSQL**
2. Plan: Starter ($7/mo) — suficiente para ~300 empleados
3. Anotar los valores de:
   - `RENDER_DATABASE_URL` (internal connection string)
   - `RENDER_DATABASE_URL_EXTERNAL` (external, para pg_restore)

### 1.3 Importar datos en Render

```bash
# Desde la máquina local, conectar al host externo de Render
pg_restore -h <EXTERNAL_HOST> -U <RENDER_USER> -d <RENDER_DB> \
  --no-owner --no-acl -Fc rrhh_dump_20260527.dump

# O si usaste SQL plano:
psql -h <EXTERNAL_HOST> -U <RENDER_USER> -d <RENDER_DB> < rrhh_dump_20260527.sql
```

**Nota:** El dump incluye todas las tablas, secuencias, índices, constraints y datos migrados:
- 267 personal, 4,400+ asistencia_mensual, 133,000+ asistencia_diaria
- 108,989 biometrico_logs_raw, 23,851 turnos_asignados, 1,676 justificaciones

### 1.4 Verificar la importación

```bash
psql -h <EXTERNAL_HOST> -U <RENDER_USER> -d <RENDER_DB> -c "
SELECT 'personal', COUNT(*) FROM personal
UNION ALL SELECT 'asistencia_mensual', COUNT(*) FROM asistencia_mensual
UNION ALL SELECT 'asistencia_diaria', COUNT(*) FROM asistencia_diaria
UNION ALL SELECT 'biometrico_logs_raw', COUNT(*) FROM biometrico_logs_raw
UNION ALL SELECT 'turnos_plantilla', COUNT(*) FROM turnos_plantilla
UNION ALL SELECT 'turnos_asignados', COUNT(*) FROM turnos_asignados
UNION ALL SELECT 'justificaciones', COUNT(*) FROM justificaciones;
"
```

## 2. Configurar Backend en Render

### 2.1 Crear Web Service

1. **New → Web Service** → conectar repo de GitHub
2. Configuración:

| Campo | Valor |
|-------|-------|
| **Name** | `rrhh-barrios-mineros-api` |
| **Root Directory** | `backend/` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Starter ($7/mo) |

3. Variables de Entorno (`Environment Variables`):

```env
NODE_ENV=production
PORT=3001
DB_USER=<RENDER_DB_USER>
DB_PASSWORD=<RENDER_DB_PASSWORD>
DB_HOST=<RENDER_DB_HOSTNAME>
DB_PORT=5432
DB_NAME=<RENDER_DB_NAME>
JWT_SECRET=<GENERATE_A_STRONG_SECRET>
JWT_EXPIRES_IN=8h
```

### 2.2 Health Check

Render monitorea automáticamente el endpoint `/`. Asegurarse de que el backend tenga una ruta raíz que responda 200.

## 3. Configurar Frontend en Render

### 3.1 Crear Static Site

1. **New → Static Site** → mismo repo
2. Configuración:

| Campo | Valor |
|-------|-------|
| **Name** | `rrhh-barrios-mineros` |
| **Root Directory** | `frontend/` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

3. Variable de Entorno:

```env
VITE_API_BASE_URL=https://rrhh-barrios-mineros-api.onrender.com
```

## 4. POST-Migración: Verificación

### Checklist

- [ ] Login funciona (admin/admin)
- [ ] Listado de personal carga correctamente
- [ ] Asistencias: filtros por mes/año/tipo funcionan
- [ ] Asistencias: "Calcular Estados" procesa sin errores
- [ ] Turnos: plantillas, asignaciones, calendario
- [ ] Justificaciones: listado y creación
- [ ] Dashboard: KPIs cargan

### Comandos de verificación rápida

```bash
# Probar API
curl -X POST https://rrhh-barrios-mineros-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'

# Probar listado de personal (con token)
TOKEN="<token_del_login>"
curl -H "Authorization: Bearer $TOKEN" \
  https://rrhh-barrios-mineros-api.onrender.com/api/personal?limit=5
```

## 5. Rollback (si es necesario)

Si algo sale mal:

1. **Revertir Web Service:** Render mantiene el último deploy exitoso → "Deploy → Last Successful Deploy"
2. **Revertir BD:** No hay snapshot automático en Render Starter. Para rollback manual:
   ```bash
   # Desde el dump local, restaurar solo tablas específicas
   pg_restore -h <RENDER_HOST> -U <RENDER_USER> -d <RENDER_DB> \
     --clean --if-exists -t personal -t asistencia_mensual rrhh_dump.dump
   ```

## Notas Importantes

- **Conexión a BD:** Render PostgreSQL usa SSL. El backend `db.js` ya lo maneja con `rejectUnauthorized: false` cuando `DB_HOST` no es socket.
- **Horario:** El servidor Render usa UTC. Bolivia es UTC-4. Considerar esto en la configuración de fechas/horas.
- **Biométrico ZKTeco:** El sync de marcaciones requiere que el servidor pueda alcanzar el dispositivo ZKTeco en la red local del hospital. En Render (cloud externo), esto **no es posible**. Alternativas:
  - Mantener un agente local que sincronice marcaciones a la BD en Render
  - O mantener la BD local para el módulo biométrico
- **Archivos estáticos:** Las imágenes de empleados y archivos Excel no se migran automáticamente. Usar almacenamiento externo (Cloudinary/S3) para producción.
