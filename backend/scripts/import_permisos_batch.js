const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const db = new Pool({
  host: '/var/run/postgresql',
  user: 'hitdev',
  database: 'rrhh_barrios_mineros',
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

async function main() {
  const { rows: personal } = await db.query(
    'SELECT id, biometrico_id FROM personal WHERE biometrico_id IS NOT NULL'
  );
  const personalMap = new Map();
  personal.forEach(p => personalMap.set(String(p.biometrico_id), p.id));

  const csv = fs.readFileSync(
    path.join(__dirname, '..', '..', 'Statefolder', 'Asis', 'export', 'csv', 'TablaVacaciones.csv'),
    'utf-8'
  );
  const lines = csv.trim().split('\n');

  const { rows: existing } = await db.query(
    'SELECT personal_id, fecha_inicio, fecha_fin FROM permisos_laborales'
  );
  const existingSet = new Set(existing.map(r => r.personal_id + '|' + r.fecha_inicio + '|' + r.fecha_fin));

  let inserted = 0, skipped = 0;

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim().replace(/^"/, '').replace(/"$/, ''));
    const bid = cols[2];
    if (!personalMap.has(bid)) { skipped++; continue; }
    const personalId = personalMap.get(bid);

    const fechaIni = cols[0]?.substring(0, 10);
    const fechaFin = cols[1]?.substring(0, 10);
    if (!fechaIni || !fechaFin) { skipped++; continue; }

    const key = personalId + '|' + fechaIni + '|' + fechaFin;
    if (existingSet.has(key)) { skipped++; continue; }

    const start = new Date(fechaIni);
    const end = new Date(fechaFin);
    if (isNaN(start) || isNaN(end)) { skipped++; continue; }
    const dias = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);

    const desc = cols[4] || '';
    const upper = desc.toUpperCase().replace(/:$/, '').trim();
    let tipo = 'OTRO';
    for (const [k, v] of Object.entries(TIPO_MAP)) {
      if (upper.startsWith(k)) { tipo = v; break; }
    }
    if (upper.startsWith('COMISION')) tipo = 'COMISION';
    if (upper.startsWith('REUNI')) tipo = 'REUNION';
    if (upper.startsWith('A CUENTA')) tipo = 'A_CUENTA_VAC';

    const motivoParts = desc.split(':');
    const motivo = motivoParts.length > 1 ? motivoParts.slice(1).join(':').trim() : desc;

    try {
      await db.query(
        `INSERT INTO permisos_laborales (personal_id, tipo, fecha_inicio, fecha_fin, dias, motivo, descripcion_original, estado, origen)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'APROBADO', 'ASIS')`,
        [personalId, tipo, fechaIni, fechaFin, dias, motivo || null, desc || null]
      );
      inserted++;
    } catch (e) {
      skipped++;
    }

    if (inserted % 500 === 0 && inserted > 0) {
      console.log('Progress: inserted', inserted);
    }
  }

  console.log('Done! Inserted:', inserted, 'Skipped (existing/no mapping):', skipped);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
