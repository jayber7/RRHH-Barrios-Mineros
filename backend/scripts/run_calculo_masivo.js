const CalculoAsistenciaService = require('../src/services/calculoAsistenciaService');
const db = require('../src/config/db');

const targetYear = parseInt(process.argv[2]) || 0; // optional: pass year as arg

async function main() {
  let query = `
    SELECT DISTINCT EXTRACT(YEAR FROM timestamp)::int as anio,
           EXTRACT(MONTH FROM timestamp)::int as mes
    FROM biometrico_logs_raw
  `;
  if (targetYear) {
    query += ` WHERE EXTRACT(YEAR FROM timestamp)::int = ${targetYear}`;
  }
  query += ` ORDER BY anio, mes`;

  const { rows } = await db.query(query);
  console.log(`Found ${rows.length} months to process${targetYear ? ` (year ${targetYear})` : ''}`);

  for (const r of rows) {
    console.log(`Processing ${r.mes}/${r.anio} ...`);
    const start = Date.now();
    try {
      const result = await CalculoAsistenciaService.procesarTodos(r.mes, r.anio);
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      console.log(`  ${result.totalProcesados} employees in ${elapsed}s`);
    } catch (e) {
      console.error(`  Error: ${e.message}`);
    }
  }
  console.log('Done.');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
