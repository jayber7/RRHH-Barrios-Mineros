const db = require('../config/db');
const DashboardService = require('../services/dashboardService');
const ConfiguracionService = require('../services/configuracionService');

class DashboardController {
  static async getStats(req, res) {
    try {
      const mes = req.query.mes || (await ConfiguracionService.get('dashboard_mes_default', 4));
      const anio = req.query.anio || (await ConfiguracionService.get('dashboard_anio_default', 2026));
      const unidad = req.query.unidad || '';
      const data = await DashboardService.getStats(parseInt(mes), parseInt(anio), unidad);
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener estadísticas del dashboard' });
    }
  }

  static async getDetalleDiario(req, res) {
    try {
      const { personal_id, fecha } = req.query;
      if (!personal_id || !fecha) {
        return res.status(400).json({ error: 'personal_id y fecha requeridos' });
      }

      const ventanaAntes = await ConfiguracionService.get('ventana_detalle_diario_antes_h', 12);
      const ventanaDespues = await ConfiguracionService.get('ventana_detalle_diario_despues_h', 36);

      const { rows: logs } = await db.query(`
        SELECT id, timestamp, verificacion_tipo, device_ip
        FROM biometrico_logs_raw
        WHERE biometrico_id::text = (SELECT biometrico_id::text FROM personal WHERE id = $1)
          AND timestamp >= $2::date - interval '1 hour' * $3
          AND timestamp < $2::date + interval '1 hour' * $4
        ORDER BY timestamp ASC
      `, [personal_id, fecha, ventanaAntes, ventanaDespues]);

      const { rows: turno } = await db.query(`
        SELECT tp.*, ta.fecha_inicio, ta.fecha_fin
        FROM turnos_asignados ta
        JOIN turnos_plantilla tp ON ta.turno_plantilla_id = tp.id
        WHERE ta.personal_id = $1 AND ta.fecha_inicio <= $2
          AND (ta.fecha_fin IS NULL OR ta.fecha_fin >= $2)
        ORDER BY ta.fecha_inicio DESC LIMIT 1
      `, [personal_id, fecha]);

      const fechaObj = new Date(fecha);
      const diaSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'][fechaObj.getDay()];
      const horario = turno[0] ? {
        entrada: turno[0][`${diaSemana}_entrada`],
        salida: turno[0][`${diaSemana}_salida`],
        nocturno: turno[0][`nocturno_${diaSemana}`] || false,
      } : null;

      const { rows: personal } = await db.query(`
        SELECT p.id, p.ci, p.primer_nombre, p.apellido_paterno, p.apellido_materno,
               vl.cargo_actual, vl.identificador_laboral, vl.unidad_servicio
        FROM personal p
        LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id
        WHERE p.id = $1 LIMIT 1
      `, [personal_id]);

      const { rows: diario } = await db.query(`
        SELECT ad.*, j.tipo as justificacion_tipo, j.motivo_detalle,
               cm.detalle as motivo_justificacion
        FROM asistencia_diaria ad
        JOIN asistencia_mensual am ON am.id = ad.asistencia_id
        LEFT JOIN justificaciones j ON ad.justificacion_id = j.id
        LEFT JOIN cat_motivos_justificacion cm ON j.motivo_id = cm.id
        WHERE am.personal_id = $1 AND am.mes = $2 AND am.anio = $3 AND ad.dia = $4
      `, [personal_id, fechaObj.getMonth() + 1, fechaObj.getFullYear(), fechaObj.getDate()]);

      res.json({
        personal: personal[0] || null,
        horario,
        logs,
        diario: diario[0] || null,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener detalle diario' });
    }
  }

  static async getBiometricoStats(req, res) {
    try {
      const data = await DashboardService.getBiometricoStats();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener estadísticas biométricas' });
    }
  }
}

module.exports = DashboardController;
