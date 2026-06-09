const initSqlJs = require('sql.js');
const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config({ path: __dirname + '/../.env' });

const ZK_DB_PATH = '/media/hitdev/DatosLinux/RRHH-Barrios-Mineros/Statefolder/Biometrico/ZKTimeNet.db';
const DEPT_CONTRATO = 35;
const PERIOD_START = '2025-05-01';
const PERIOD_END = '2025-06-01';
const TERMINAL_IP = '192.168.0.101';

async function main() {
  // 1. Load ZKTimeNet
  const SQL = await initSqlJs();
  const buffer = fs.readFileSync(ZK_DB_PATH);
  const zk = new SQL.Database(buffer);

  // 2. Get CONTRATO employees with their PINs
  const empRes = zk.exec(`SELECT id, emp_pin, emp_firstname, emp_lastname FROM hr_employee WHERE emp_dept = ${DEPT_CONTRATO}`);
  const zkEmployees = empRes[0].values;
  console.log(`Empleados CONTRATO en ZKTimeNet: ${zkEmployees.length}`);

  const zkIds = zkEmployees.map(r => r[0]);

  // 3. Query punches for May 2025
  const punchRes = zk.exec(`
    SELECT p.emp_id, p.punch_time, p.workcode, p.workstate
    FROM att_punches p
    WHERE p.emp_id IN (${zkIds.join(',')})
      AND p.punch_time >= '${PERIOD_START}' AND p.punch_time < '${PERIOD_END}'
    ORDER BY p.punch_time
  `);

  if (!punchRes.length || !punchRes[0].values.length) {
    console.log('No se encontraron punches para mayo 2025');
    zk.close();
    return;
  }

  const punches = punchRes[0].values;
  console.log(`Punches encontrados: ${punches.length}`);

  // 4. Map emp_id → emp_pin
  const empPinMap = {};
  zkEmployees.forEach(r => { empPinMap[r[0]] = r[1]; });

  // 5. Build records for PG
  const records = punches.map(p => ({
    biometrico_id: empPinMap[p[0]],
    timestamp: p[1],
    verificacion_tipo: p[2] || 0,
    estado_asistencia: p[3] || 0,
    device_ip: TERMINAL_IP,
  })).filter(r => r.biometrico_id != null);

  console.log(`Registros a insertar (con biometrico_id válido): ${records.length}`);

  // 6. Connect to PostgreSQL
  const poolConfig = {
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || '/var/run/postgresql',
    port: process.env.DB_PORT,
  };
  if (process.env.DB_PASSWORD) poolConfig.password = process.env.DB_PASSWORD;
  if (process.env.DB_SSL || (process.env.DB_HOST && process.env.DB_HOST !== '/var/run/postgresql')) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }

  const pool = new Pool(poolConfig);
  const client = await pool.connect();

  try {
    let inserted = 0;
    let skipped = 0;

    for (const rec of records) {
      const res = await client.query(
        `INSERT INTO biometrico_logs_raw (biometrico_id, timestamp, verificacion_tipo, estado_asistencia, device_ip)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (biometrico_id, timestamp) DO NOTHING`,
        [rec.biometrico_id, rec.timestamp, rec.verificacion_tipo, rec.estado_asistencia, rec.device_ip]
      );
      if (res.rowCount > 0) inserted++;
      else skipped++;
    }

    console.log(`\nResultado:`);
    console.log(`  Insertados: ${inserted}`);
    console.log(`  Omitidos (duplicados): ${skipped}`);
    console.log(`  Total procesados: ${records.length}`);
  } catch (err) {
    console.error('Error durante la inserción:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
    zk.close();
  }
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
