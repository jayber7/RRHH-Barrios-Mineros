const cron = require('node-cron');
const db = require('../config/db');

function startEstadoJob() {
  cron.schedule('0 1 * * *', async () => {
    console.log('[CRON] Verificando contratos vencidos...');
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { rowCount } = await db.query(`
        UPDATE personal SET estado = 'INACTIVO', fecha_baja = $1
        WHERE id IN (
          SELECT p.id FROM personal p
          JOIN vinculos_laborales vl ON p.id = vl.personal_id
          WHERE p.estado = 'ACTIVO'
            AND vl.fecha_fin_contrato IS NOT NULL
            AND vl.fecha_fin_contrato < $1
        )
      `, [today]);

      if (rowCount > 0) {
        console.log(`[CRON] ${rowCount} personal marcado como INACTIVO por contrato vencido`);
      } else {
        console.log('[CRON] No hay contratos vencidos para procesar');
      }
    } catch (error) {
      console.error('[CRON] Error al procesar contratos vencidos:', error.message);
    }
  });

  console.log('[CRON] Job de verificacion de estados programado (diario a las 01:00)');
}

module.exports = { startEstadoJob };
