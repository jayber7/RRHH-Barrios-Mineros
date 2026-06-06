const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const ZKT_DB_PATH = path.resolve(__dirname, '../../Statefolder/Biometrico/ZKTimeNet.db');

async function main() {
  console.log('=== Importar empleados faltantes + marcaciones 2026 ===\n');

  const SQL = await initSqlJs();
  const buffer = fs.readFileSync(ZKT_DB_PATH);
  const zktDb = new SQL.Database(buffer);

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
    // 1. Obtener todos los PINs de ZKTimeNet que tienen punches en 2026
    console.log('Obteniendo empleados ZKTimeNet con marcaciones en 2026...');
    const zktRows = zktDb.exec(`
      SELECT DISTINCT e.emp_pin, e.emp_firstname, e.emp_lastname, e.emp_code, e.emp_ssn
      FROM att_punches p
      JOIN hr_employee e ON p.emp_id = e.id
      WHERE strftime('%Y', p.punch_time) = '2026'
      ORDER BY e.emp_pin
    `);
    const zktCols = ['emp_pin', 'emp_firstname', 'emp_lastname', 'emp_code', 'emp_ssn'];
    const zkt2026 = zktRows[0].values.map(r => {
      const obj = {};
      zktCols.forEach((c, i) => { obj[c] = r[i]; });
      return obj;
    });
    console.log(`  ${zkt2026.length} empleados con marcaciones en 2026\n`);

    // 2. Obtener PINs ya mapeados en personal
    const mapResult = await pg.query(
      'SELECT biometrico_id FROM personal WHERE biometrico_id IS NOT NULL'
    );
    const mappedPins = new Set(mapResult.rows.map(r => r.biometrico_id));

    // 3. Identificar faltantes
    const faltantes = zkt2026.filter(e => !mappedPins.has(e.emp_pin));
    console.log(`  ${faltantes.length} empleados faltantes en personal:\n`);
    for (const e of faltantes) {
      const name = `${e.emp_firstname || ''} ${e.emp_lastname || ''}`.trim();
      console.log(`    PIN=${e.emp_pin} | ${name}`);
    }
    console.log('');

    // 4. Crear registros en personal
    console.log('Creando registros en personal...');
    let creados = 0;
    for (const emp of faltantes) {
      const nombre_completo = `${emp.emp_firstname || ''} ${emp.emp_lastname || ''}`.trim();
      const nameParts = nombre_completo.split(/\s+/);

      // Intentar separar nombre/apellido
      let primerNombre = nombre_completo;
      let apellidoPaterno = null;
      let apellidoMaterno = null;

      if (nameParts.length >= 3) {
        // Asumir: nombre, apellido_paterno, apellido_materno
        const mid = Math.ceil(nameParts.length / 2);
        const firstNameParts = nameParts.slice(0, mid);
        const lastNameParts = nameParts.slice(mid);
        primerNombre = firstNameParts.join(' ');
        if (lastNameParts.length >= 2) {
          apellidoPaterno = lastNameParts[0];
          apellidoMaterno = lastNameParts.slice(1).join(' ');
        } else {
          apellidoPaterno = lastNameParts[0];
        }
      } else if (nameParts.length === 2) {
        primerNombre = nameParts[0];
        apellidoPaterno = nameParts[1];
      }

      // Para nombres corruptos (con caracteres extraños), usar el PIN como nombre
      if (/[^\x20-\x7E]/.test(primerNombre)) {
        primerNombre = `EMP-${emp.emp_pin}`;
        apellidoPaterno = null;
        apellidoMaterno = null;
      }

      const ci = String(emp.emp_pin);
      const biometricoId = emp.emp_pin;

      try {
        await pg.query(
          `INSERT INTO personal (ci, primer_nombre, apellido_paterno, apellido_materno, biometrico_id, tipo_personal, estado)
           VALUES ($1, $2, $3, $4, $5, 'PLANTA', 'ACTIVO')
           ON CONFLICT (ci) DO UPDATE SET biometrico_id = EXCLUDED.biometrico_id`,
          [ci, primerNombre, apellidoPaterno, apellidoMaterno, biometricoId]
        );
        creados++;
        console.log(`  ✓ PIN=${emp.emp_pin} → ${primerNombre} ${apellidoPaterno || ''} ${apellidoMaterno || ''}`.trim());
      } catch (err) {
        console.error(`  ✗ PIN=${emp.emp_pin} Error: ${err.message}`);
      }
    }
    console.log(`  Creados: ${creados}\n`);

    // 5. Obtener mapeo actualizado
    const mapResult2 = await pg.query(
      'SELECT id, biometrico_id FROM personal WHERE biometrico_id IS NOT NULL'
    );
    const empMap = new Map();
    for (const row of mapResult2.rows) {
      empMap.set(row.biometrico_id, row.id);
    }
    console.log(`  Total mapeados: ${empMap.size}\n`);

    // 6. Obtener TODAS las marcaciones de 2026 de ZKTimeNet
    console.log('Extrayendo marcaciones de 2026...');
    const punchRows = zktDb.exec(`
      SELECT e.emp_pin, p.punch_time, p.workstate, t.terminal_tcpip
      FROM att_punches p
      JOIN hr_employee e ON p.emp_id = e.id
      LEFT JOIN att_terminal t ON p.terminal_id = t.id
      WHERE strftime('%Y', p.punch_time) = '2026'
      ORDER BY e.emp_pin, p.punch_time
    `);
    zktDb.close();

    const punchCols = ['emp_pin', 'punch_time', 'workstate', 'terminal_tcpip'];
    const allPunches = punchRows[0].values.map(r => {
      const obj = {};
      punchCols.forEach((c, i) => { obj[c] = r[i]; });
      return obj;
    });
    console.log(`  ${allPunches.length} marcaciones totales en 2026\n`);

    // 7. Filtrar solo mapeados y preparar inserción
    const mapeados = [];
    const sinMapeo = [];
    const empPinsSinMapeo = new Set();

    for (const p of allPunches) {
      if (empMap.has(p.emp_pin)) {
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

    console.log(`  Mapeados para insertar: ${mapeados.length}`);
    console.log(`  Sin mapeo: ${sinMapeo.length} (${empPinsSinMapeo.size} empleados)\n`);

    // 8. Eliminar datos existentes de 2026
    console.log('Limpiando registros existentes de 2026...');
    const delResult = await pg.query(
      `DELETE FROM biometrico_logs_raw 
       WHERE EXTRACT(YEAR FROM timestamp) = 2026`
    );
    console.log(`  ${delResult.rowCount} eliminados\n`);

    // 9. Insertar en lotes
    console.log('Insertando marcaciones...');
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
        console.error(`  Error lote ${Math.floor(i/BATCH_SIZE)+1}: ${err.message}`);
      }
    }

    console.log(`\n  Insertados: ${insertados}`);
    console.log(`  Errores: ${errores}\n`);

    // 10. Verificar
    const verify = await pg.query(
      `SELECT COUNT(*) as count FROM biometrico_logs_raw 
       WHERE EXTRACT(YEAR FROM timestamp) = 2026`
    );
    const mayVerify = await pg.query(
      `SELECT COUNT(*) as count FROM biometrico_logs_raw 
       WHERE EXTRACT(YEAR FROM timestamp) = 2026 
         AND EXTRACT(MONTH FROM timestamp) = 5`
    );
    console.log(`Registros en 2026: ${verify.rows[0].count}`);
    console.log(`Registros en Mayo 2026: ${mayVerify.rows[0].count}`);
    console.log('\n=== Completado ===');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pg.end();
  }
}

main();
