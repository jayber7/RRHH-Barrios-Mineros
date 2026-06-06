const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const ZKT_DB_PATH = path.resolve(__dirname, '../../Statefolder/Biometrico/ZKTimeNet.db');

async function main() {
  console.log('=== Migración ZKTimeNet → PostgreSQL (Mayo 2026) ===\n');

  // 1. Cargar SQLite
  const SQL = await initSqlJs();
  const buffer = fs.readFileSync(ZKT_DB_PATH);
  const zktDb = new SQL.Database(buffer);

  // 2. Conectar PostgreSQL
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
  const pg = new Pool(poolConfig);

  try {
    // 3. Obtener mapeo de empleados desde PostgreSQL
    console.log('Obteniendo mapeo de empleados...');
    const mapResult = await pg.query(
      'SELECT id, biometrico_id FROM personal WHERE biometrico_id IS NOT NULL'
    );
    const empMap = new Map();
    for (const row of mapResult.rows) {
      empMap.set(row.biometrico_id, row.id);
    }
    console.log(`  ${empMap.size} empleados mapeados\n`);

    // 4. Obtener punches de Mayo 2026 desde ZKTimeNet
    console.log('Extrayendo punches de Mayo 2026 desde ZKTimeNet.db...');
    const query = `
      SELECT e.emp_pin, p.punch_time, p.workstate, t.terminal_tcpip
      FROM att_punches p
      JOIN hr_employee e ON p.emp_id = e.id
      LEFT JOIN att_terminal t ON p.terminal_id = t.id
      WHERE strftime('%Y-%m', p.punch_time) = '2026-05'
      ORDER BY e.emp_pin, p.punch_time
    `;
    const stmt = zktDb.run(query);
    const rows = zktDb.exec(query);
    zktDb.close();

    const punches = [];
    const columns = ['emp_pin', 'punch_time', 'workstate', 'terminal_tcpip'];
    for (const row of rows[0].values) {
      const obj = {};
      columns.forEach((col, i) => { obj[col] = row[i]; });
      punches.push(obj);
    }
    console.log(`  ${punches.length} punches encontrados\n`);

    // 5. Preparar datos para inserción
    const mapeados = [];
    const sinMapeo = [];
    const empPinsSinMapeo = new Set();

    for (const p of punches) {
      const personalId = empMap.get(p.emp_pin);
      if (personalId) {
        mapeados.push({
          biometrico_id: p.emp_pin,
          timestamp: p.punch_time,
          estado_asistencia: p.workstate,
          verificacion_tipo: 1,
          device_ip: p.terminal_tcpip || '192.168.0.101',
        });
      } else {
        sinMapeo.push(p.emp_pin);
        empPinsSinMapeo.add(p.emp_pin);
      }
    }

    console.log(`  Mapeados: ${mapeados.length}`);
    console.log(`  Sin mapeo: ${sinMapeo.length} punches (${empPinsSinMapeo.size} empleados)\n`);

    if (empPinsSinMapeo.size > 0) {
      console.log('  Empleados sin mapeo (PIN → biometrico_id):');
      const pinList = Array.from(empPinsSinMapeo).sort((a,b) => a-b);
      for (const pin of pinList) {
        const count = sinMapeo.filter(s => s === pin).length;
        console.log(`    PIN ${pin} → ${count} punches`);
      }
      console.log('');
    }

    // 6. Eliminar registros existentes de Mayo 2026
    console.log('Eliminando registros existentes de Mayo 2026...');
    const delResult = await pg.query(
      `DELETE FROM biometrico_logs_raw 
       WHERE EXTRACT(YEAR FROM timestamp) = 2026 
         AND EXTRACT(MONTH FROM timestamp) = 5`
    );
    console.log(`  ${delResult.rowCount} registros eliminados\n`);

    // 7. Insertar en lotes
    console.log('Insertando nuevos registros...');
    const BATCH_SIZE = 500;
    let insertados = 0;
    let errores = 0;

    for (let i = 0; i < mapeados.length; i += BATCH_SIZE) {
      const batch = mapeados.slice(i, i + BATCH_SIZE);
      const values = [];
      const params = [];
      let paramIdx = 1;

      for (const r of batch) {
        values.push(`($${paramIdx}, $${paramIdx+1}, $${paramIdx+2}, $${paramIdx+3}, $${paramIdx+4})`);
        params.push(r.biometrico_id, r.timestamp, r.verificacion_tipo, r.estado_asistencia, r.device_ip);
        paramIdx += 5;
      }

      const sql = `INSERT INTO biometrico_logs_raw (biometrico_id, timestamp, verificacion_tipo, estado_asistencia, device_ip) VALUES ${values.join(', ')} ON CONFLICT DO NOTHING`;

      try {
        const insResult = await pg.query(sql, params);
        insertados += insResult.rowCount;
      } catch (err) {
        errores++;
        console.error(`  Error en lote ${Math.floor(i/BATCH_SIZE)+1}: ${err.message}`);
      }

      if ((i + BATCH_SIZE) % 2000 === 0 || i + BATCH_SIZE >= mapeados.length) {
        console.log(`  Progreso: ${Math.min(i + BATCH_SIZE, mapeados.length)}/${mapeados.length} (insertados: ${insertados})`);
      }
    }

    console.log(`\n  Total insertados: ${insertados}`);
    console.log(`  Errores: ${errores}\n`);

    // 8. Verificar
    const verify = await pg.query(
      `SELECT COUNT(*) as count FROM biometrico_logs_raw 
       WHERE EXTRACT(YEAR FROM timestamp) = 2026 
         AND EXTRACT(MONTH FROM timestamp) = 5`
    );
    console.log(`Registros en biometrico_logs_raw para Mayo 2026: ${verify.rows[0].count}`);
    console.log('\n=== Migración completada ===');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pg.end();
  }
}

main();
