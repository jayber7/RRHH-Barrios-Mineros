const UsuarioModel = require('../src/models/usuarioModel');
const db = require('../src/config/db');
require('dotenv').config();

async function main() {
  console.log('=== Crear usuarios para todos los empleados ===\n');

  try {
    // 1. Obtener todos los personal con biometrico_id
    const { rows: empleados } = await db.query(`
      SELECT id, primer_nombre, apellido_paterno, apellido_materno, ci, biometrico_id
      FROM personal
      WHERE biometrico_id IS NOT NULL
        AND ci IS NOT NULL
        AND ci ~ '^\\d+$'
      ORDER BY id
    `);
    console.log(`Empleados con biometrico_id: ${empleados.length}\n`);

    // 2. Obtener usuarios existentes para evitar duplicados
    const { rows: existing } = await db.query(
      'SELECT personal_id, username FROM usuarios WHERE personal_id IS NOT NULL'
    );
    const existingPersonalIds = new Set(existing.map(r => r.personal_id));
    const existingUsernames = new Set(existing.map(r => r.username));
    console.log(`Usuarios existentes: ${existing.length}\n`);

    // 3. Crear usuarios faltantes
    let creados = 0;
    let saltados = 0;

    for (const emp of empleados) {
      const nombre = `${emp.primer_nombre || ''} ${emp.apellido_paterno || ''} ${emp.apellido_materno || ''}`.trim();

      if (existingPersonalIds.has(emp.id)) {
        console.log(`  - ${nombre} (CI=${emp.ci}) → ya tiene usuario`);
        saltados++;
        continue;
      }

      if (existingUsernames.has(emp.ci)) {
        console.log(`  ! ${nombre} (CI=${emp.ci}) → username ya existe (otro personal)`);
        saltados++;
        continue;
      }

      try {
        const user = await UsuarioModel.createFromPersonal(emp.id, emp.ci);
        console.log(`  ✓ ${nombre} → usuario=${emp.ci} pass=${emp.ci}`);
        creados++;
      } catch (err) {
        console.error(`  ✗ ${nombre} → Error: ${err.message}`);
      }
    }

    console.log(`\nCreados: ${creados}`);
    console.log(`Saltados: ${saltados}`);
    console.log('\n=== Completado ===');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

main();
