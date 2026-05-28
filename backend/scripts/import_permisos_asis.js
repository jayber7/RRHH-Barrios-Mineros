const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const db = new Pool({
  host: process.env.DB_HOST || '/var/run/postgresql',
  user: process.env.DB_USER || 'hitdev',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rrhh_barrios_mineros',
});

const TIPO_MAP = {
  'VACACION': 'VACACION',
  'A CUENTA VAC': 'A_CUENTA_VAC',
  'BAJA MEDICA': 'BAJA_MEDICA',
  'COMISION': 'COMISION',
  'FERIADO': 'FERIADO',
  'TOLERANCIA': 'TOLERANCIA',
  'ANIVERSARIO': 'ANIVERSARIO',
  'LICENCIA': 'LICENCIA',
  'ASUETO': 'ASUETO',
  'VIAJE': 'VIAJE',
  'ASAMBLEA': 'ASAMBLEA',
  'REUNION': 'REUNION',
  'NO MARCADO': 'NO_MARCADO',
};

function detectTipo(desc) {
  const upper = desc.toUpperCase().replace(/:$/, '').trim();
  for (const [key, val] of Object.entries(TIPO_MAP)) {
    if (upper.startsWith(key)) return val;
  }
  if (upper.startsWith('COMISION')) return 'COMISION';
  if (upper.startsWith('REUNI')) return 'REUNION';
  if (upper.startsWith('A CUENTA')) return 'A_CUENTA_VAC';
  return 'OTRO';
}

async function main() {
  const csvPath = path.join(__dirname, '..', '..', 'Statefolder', 'Asis', 'export', 'csv', 'TablaVacaciones.csv');

  const { rows: personal } = await db.query(
    'SELECT id, biometrico_id FROM personal WHERE biometrico_id IS NOT NULL'
  );
  const personalMap = new Map();
  personal.forEach(p => personalMap.set(String(p.biometrico_id), p.id));
  console.log('Employees with biometrico_id:', personalMap.size);

  const csv = fs.readFileSync(csvPath, 'utf-8');
  const lines = csv.trim().split('\n');
  console.log('Total CSV records:', lines.length - 1);

  let inserted = 0, skipped = 0;

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    const bid = cols[2];
    if (!personalMap.has(bid)) { skipped++; continue; }
    const personalId = personalMap.get(bid);

    const fechaIni = cols[0]?.substring(0, 10);
    const fechaFin = cols[1]?.substring(0, 10);
    if (!fechaIni || !fechaFin) { skipped++; continue; }

    const start = new Date(fechaIni);
    const end = new Date(fechaFin);
    if (isNaN(start) || isNaN(end)) { skipped++; continue; }
    const dias = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);

    const desc = cols[4] || '';
    const tipo = detectTipo(desc);
    const motivoParts = desc.split(':');
    const motivo = motivoParts.length > 1 ? motivoParts.slice(1).join(':').trim() : desc;

    try {
      await db.query(`
        INSERT INTO permisos_laborales (personal_id, tipo, fecha_inicio, fecha_fin, dias, motivo, descripcion_original, estado, origen)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'APROBADO', 'ASIS')
      `, [personalId, tipo, fechaIni, fechaFin, dias, motivo || null, desc || null]);
      inserted++;
    } catch (e) {
      if (e.code !== '23505') skipped++; // skip duplicate key violations
      else inserted++;
    }
  }

  console.log('Inserted:', inserted);
  console.log('Skipped (no mapping):', skipped);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
