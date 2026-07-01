const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const API_URL = process.env.RENDER_API_URL || 'https://rrhh-barrios-mineros-api.onrender.com';
const TOKEN = process.env.RENDER_TOKEN || '';

async function main() {
  const rutaSQLite = process.env.ZKTIMENET_DB_PATH;
  if (!rutaSQLite) {
    console.error('ERROR: ZKTIMENET_DB_PATH no está definido en .env');
    process.exit(1);
  }

  const Database = require('better-sqlite3');
  const sqlite = new Database(rutaSQLite, { readonly: true });

  try {
    // 1. Exportar empleados
    console.log('Leyendo empleados de ZKTimeNet.db...');
    const empleados = sqlite.prepare(`
      SELECT e.*, d.dept_name
      FROM hr_employee e
      LEFT JOIN hr_department d ON e.emp_dept = d.id
      ORDER BY e.emp_pin
    `).all();
    console.log(`  → ${empleados.length} empleados encontrados`);

    // 2. Exportar marcaciones
    console.log('Leyendo marcaciones de ZKTimeNet.db...');
    const marcaciones = sqlite.prepare(`
      SELECT p.*, e.emp_pin
      FROM att_punches p
      JOIN hr_employee e ON p.emp_id = e.id
      ORDER BY p.punch_time ASC
    `).all();
    console.log(`  → ${marcaciones.length} marcaciones encontradas`);

    // 3. Enviar a Render
    const headers = { 'Content-Type': 'application/json' };
    if (TOKEN) headers['Authorization'] = `Bearer ${TOKEN}`;

    console.log(`\nEnviando ${empleados.length} empleados a ${API_URL}...`);
    const empRes = await fetch(`${API_URL}/api/biometrico/importar-empleados`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ empleados: empleados.map(e => ({
        emp_pin: String(e.emp_pin),
        emp_code: e.emp_code,
        emp_ssn: e.emp_ssn,
        primer_nombre: (e.emp_firstname || '').trim(),
        apellidos: (e.emp_lastname || '').trim(),
        emp_dept_id: e.emp_dept,
        dept_name: e.dept_name,
        emp_active: e.emp_active ?? 1,
        emp_hiredate: e.emp_hiredate,
        emp_birthday: e.emp_birthday,
        emp_phone: e.emp_phone,
        emp_title: e.emp_title,
        emp_gender: e.emp_gender,
        emp_cardNumber: e.emp_cardNumber,
        emp_email: e.emp_email
      })) })
    });
    const empResult = await empRes.json();
    console.log('  Respuesta:', empResult);

    console.log(`\nEnviando ${marcaciones.length} marcaciones a ${API_URL}...`);
    const CHUNK = 5000;
    let totalImportados = 0;

    for (let i = 0; i < marcaciones.length; i += CHUNK) {
      const chunk = marcaciones.slice(i, i + CHUNK);
      const marRes = await fetch(`${API_URL}/api/biometrico/importar-marcaciones`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ marcaciones: chunk.map(m => ({
          biometrico_id: String(m.emp_pin),
          timestamp: m.punch_time,
          verificacion_tipo: m.workcode ?? 0,
          estado_asistencia: m.workstate ?? 0,
          device_ip: 'REMOTE_IMPORT',
          origen: 'REMOTE'
        })) })
      });
      const marResult = await marRes.json();
      totalImportados += marResult.importados || 0;
      console.log(`  Lote ${i / CHUNK + 1}/${Math.ceil(marcaciones.length / CHUNK)}: ${marResult.importados || 0} importados`);
    }

    console.log(`\n✅ Sincronización completada`);
    console.log(`  Empleados: ${empResult.insertados || 0} insertados, ${empResult.actualizados || 0} actualizados`);
    console.log(`  Marcaciones: ${totalImportados} importadas`);
  } finally {
    sqlite.close();
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
