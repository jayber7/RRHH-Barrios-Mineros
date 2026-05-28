const cron = require('node-cron');
const db = require('../config/db');
const CalculoAsistenciaService = require('../services/calculoAsistenciaService');

function startCalculoDiarioJob() {
  cron.schedule('0 6 * * *', async () => {
    console.log('[CRON] Iniciando cálculo diario de asistencia...');
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const mes = yesterday.getMonth() + 1;
      const anio = yesterday.getFullYear();
      const dia = yesterday.getDate();

      const { rows: empleados } = await db.query(`
        SELECT DISTINCT p.id FROM personal p
        JOIN biometrico_logs_raw br ON br.biometrico_id::text = p.biometrico_id
        WHERE EXTRACT(YEAR FROM br.timestamp) = $1
          AND EXTRACT(MONTH FROM br.timestamp) = $2
          AND EXTRACT(DAY FROM br.timestamp) = $3
      `, [anio, mes, dia]);

      let procesados = 0;
      for (const emp of empleados) {
        try {
          await CalculoAsistenciaService.procesarMes(emp.id, mes, anio);
          procesados++;
        } catch (err) {
          console.error(`[CRON] Error calculando empleado #${emp.id}:`, err.message);
        }
      }

      console.log(`[CRON] Cálculo diario completado: ${procesados}/${empleados.length} empleados (${dia}/${mes}/${anio})`);
    } catch (error) {
      console.error('[CRON] Error en cálculo diario:', error.message);
    }
  });

  console.log('[CRON] Job de cálculo diario programado (06:00)');
}

module.exports = { startCalculoDiarioJob };
