const initSqlJs = require('sql.js');
const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config({ path: __dirname + '/../.env' });

const ZK_DB_PATH = '/media/hitdev/DatosLinux/RRHH-Barrios-Mineros/Statefolder/Biometrico/ZKTimeNet.db';
const DEPT_CONTRATO = 35;

// Turno mapping based on punch time analysis
const TURNOS = {
  morning: { id: 57, label: '08:00-14:00' },  // Morning 6h shift
  afternoon: { id: 17, label: '14:00-20:00' }, // Afternoon 6h shift
  long: { id: 76, label: '08:00-20:00' },      // 12h shift
  night: { id: 77, label: '20:00-08:00' },     // Night 12h shift
};

async function main() {
  // 1. Load ZKTimeNet
  const SQL = await initSqlJs();
  const buffer = fs.readFileSync(ZK_DB_PATH);
  const zk = new SQL.Database(buffer);

  // Get CONTRATO employees
  const empRes = zk.exec(`SELECT id, emp_pin FROM hr_employee WHERE emp_dept = ${DEPT_CONTRATO}`);
  const zkEmployees = empRes[0].values;
  const zkIds = zkEmployees.map(r => r[0]);

  // Analyze punch patterns per employee to determine shift type
  const punchAnalysis = zk.exec(`
    SELECT emp_id,
      COUNT(*) as total,
      SUM(CASE WHEN CAST(strftime('%H', punch_time) AS INTEGER) < 12 THEN 1 ELSE 0 END) as morning_punches,
      SUM(CASE WHEN CAST(strftime('%H', punch_time) AS INTEGER) >= 12 AND CAST(strftime('%H', punch_time) AS INTEGER) < 18 THEN 1 ELSE 0 END) as afternoon_punches,
      SUM(CASE WHEN CAST(strftime('%H', punch_time) AS INTEGER) >= 18 THEN 1 ELSE 0 END) as evening_punches,
      MIN(CAST(strftime('%H', punch_time) AS INTEGER)) as earliest_hour,
      MAX(CAST(strftime('%H', punch_time) AS INTEGER)) as latest_hour
    FROM att_punches
    WHERE emp_id IN (${zkIds.join(',')})
      AND punch_time >= '2025-05-01' AND punch_time < '2025-06-01'
    GROUP BY emp_id
  `);

  // Build emp_id → turno_id mapping
  const turnoMap = {};
  if (punchAnalysis.length > 0) {
    punchAnalysis[0].values.forEach(r => {
      const [emp_id, total, morning, afternoon, evening, earliest, latest] = r;
      let turnoId;

      // Determine shift based on punch time patterns
      const morningPct = morning / total;
      const afternoonPct = afternoon / total;
      const eveningPct = evening / total;

      if (eveningPct > 0.5) {
        turnoId = TURNOS.night.id;           // Mostly evening/night
      } else if (morningPct > 0.6 && earliest <= 9) {
        turnoId = TURNOS.morning.id;          // Mostly morning
      } else if (afternoonPct > 0.5) {
        turnoId = TURNOS.afternoon.id;        // Mostly afternoon
      } else if (latest >= 18 && morningPct > 0.3) {
        turnoId = TURNOS.long.id;             // Mixed long day
      } else {
        turnoId = TURNOS.morning.id;          // Default to morning
      }

      turnoMap[emp_id] = { turnoId, morningPct, afternoonPct, eveningPct, earliest, latest, total };
    });
  }

  console.log('=== DISTRIBUCIÓN DE TURNOS ASIGNADOS ===');
  const counts = { [TURNOS.morning.id]: 0, [TURNOS.afternoon.id]: 0, [TURNOS.long.id]: 0, [TURNOS.night.id]: 0 };
  Object.values(turnoMap).forEach(t => counts[t.turnoId]++);
  Object.entries(counts).forEach(([tid, cnt]) => {
    const label = Object.values(TURNOS).find(t => t.id == tid)?.label || '?';
    console.log(`  Turno ${tid} (${label}): ${cnt} empleados`);
  });

  // Build emp_pin → turno mapping (for ZK emp_id)
  const empPinMap = {};
  zkEmployees.forEach(r => { empPinMap[r[0]] = r[1]; });

  // 2. Connect to PostgreSQL
  const pool = new Pool({
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || '/var/run/postgresql',
    port: process.env.DB_PORT,
  });

  const client = await pool.connect();
  try {
    // Get CONTRATO employees in PG with their biometrico_id
    const pgEmp = await client.query(`
      SELECT p.id, p.biometrico_id, p.primer_nombre || ' ' || p.apellido_paterno as nombre
      FROM personal p
      JOIN contratos c ON c.personal_id = p.id
      WHERE c.fecha_inicio >= '2026-01-01' AND c.fecha_inicio < '2027-01-01'
      ORDER BY p.id
    `);

    let assigned = 0;
    let skipped = 0;
    let noData = 0;

    for (const e of pgEmp.rows) {
      // Find ZK emp_id by biometrico_id (emp_pin)
      const zkEmpId = zkEmployees.find(r => r[1] == e.biometrico_id)?.[0];
      if (!zkEmpId) { noData++; continue; }

      const analysis = turnoMap[zkEmpId];
      if (!analysis) { noData++; continue; }

      // Check if they already have a turno for May 2025
      const existing = await client.query(`
        SELECT id FROM turnos_asignados
        WHERE personal_id = $1
          AND fecha_inicio <= '2025-05-31' AND (fecha_fin IS NULL OR fecha_fin >= '2025-05-01')
        LIMIT 1
      `, [e.id]);

      if (existing.rows.length > 0) { skipped++; continue; }

      // Assign the detected turno for the whole month
      await client.query(`
        INSERT INTO turnos_asignados (personal_id, turno_plantilla_id, fecha_inicio, fecha_fin)
        VALUES ($1, $2, '2025-05-01', '2025-05-31')
      `, [e.id, analysis.turnoId]);
      assigned++;
    }

    console.log(`\nResultado:`);
    console.log(`  Turnos asignados: ${assigned}`);
    console.log(`  Ya existían: ${skipped}`);
    console.log(`  Sin datos biométricos: ${noData}`);
    console.log(`  Total: ${pgEmp.rows.length}`);

  } catch (err) {
    console.error('Error:', err);
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
