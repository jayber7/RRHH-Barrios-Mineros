const { Pool } = require('pg');
require('dotenv').config({ path: __dirname + '/../.env' });

const MES_ORIGEN = '2026-04';
const MESES_DESTINO = ['2026-06', '2026-07'];

async function main() {
  const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  });

  const client = await pool.connect();
  try {
    const { rows } = await client.query(`
      SELECT personal_id, turno_plantilla_id, fecha_inicio, fecha_fin
      FROM turnos_asignados
      WHERE fecha_inicio >= $1::date AND fecha_inicio <= $2::date
    `, [`${MES_ORIGEN}-01`, `${MES_ORIGEN}-30`]);

    let insertados = 0, saltados = 0;
    for (const r of rows) {
      for (const destino of MESES_DESTINO) {
        const nuevaIni = `${destino}-${r.fecha_inicio.getDate().toString().padStart(2, '0')}`;
        const nuevaFin = r.fecha_fin
          ? `${destino}-${r.fecha_fin.getDate().toString().padStart(2, '0')}`
          : null;

        const { rowCount } = await client.query(`
          INSERT INTO turnos_asignados (personal_id, turno_plantilla_id, fecha_inicio, fecha_fin)
          SELECT $1, $2, $3, $4
          WHERE NOT EXISTS (
            SELECT 1 FROM turnos_asignados t2
            WHERE t2.personal_id = $1 AND t2.fecha_inicio = $3::date
          )
        `, [r.personal_id, r.turno_plantilla_id, nuevaIni, nuevaFin]);

        if (rowCount > 0) insertados++;
        else saltados++;
      }
    }

    console.log(`Origen: ${rows.length} asignaciones de ${MES_ORIGEN}`);
    console.log(`Insertados: ${insertados}`);
    console.log(`Saltados (ya existían): ${saltados}`);
  } catch (err) {
    console.error('Error:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
