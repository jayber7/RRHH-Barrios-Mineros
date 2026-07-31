const Calc = require('../src/services/calculoAsistenciaService');
const db = require('../src/config/db');

async function main() {
  const mesesArg = (process.argv[2] || '6,7').split(',').map(Number);
  for (const mes of mesesArg) {
    const t = Date.now();
    const { rows } = await db.query(`
      SELECT DISTINCT personal_id FROM turnos_asignados
      WHERE fecha_inicio >= $1::date AND fecha_inicio <= $2::date
    `, [`2026-${String(mes).padStart(2, '0')}-01`, `2026-${String(mes).padStart(2, '0')}-${mes === 6 ? 30 : 31}`]);

    let done = 0;
    for (const r of rows) {
      await Calc.procesarMes(r.personal_id, mes, 2026);
      done++;
      if (done % 10 === 0) console.log(`${mes}: ${done}/${rows.length} (${((Date.now() - t) / 1000).toFixed(0)}s)`);
    }
    console.log(`${mes}/2026 done: ${rows.length} en ${((Date.now() - t) / 1000).toFixed(1)}s`);
  }
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
