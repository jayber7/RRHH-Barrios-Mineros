const db = require('../config/db');
const TurnosService = require('./turnosService');

class CalculoAsistenciaService {
  static async calcularEstadoDiario(personalId, fecha) {
    const diaSemana = new Date(fecha).getDay();
    const diasMap = { 1: 'lunes', 2: 'martes', 3: 'miercoles', 4: 'jueves', 5: 'viernes', 6: 'sabado', 0: 'domingo' };
    const diaCol = diasMap[diaSemana];

    const turno = await TurnosService.getTurnoEmpleado(personalId, fecha);
    if (!turno) return { estado: 1, justificacion: 'Sin turno asignado' };

    const habilitadoKey = `${diaCol}_habilitado`;
    if (!turno[habilitadoKey]) return { estado: 1, justificacion: 'Día no laborable' };

    const entradaKey = `${diaCol}_entrada`;
    const salidaKey = `${diaCol}_salida`;
    const entradaProgramada = turno[entradaKey];
    const salidaProgramada = turno[salidaKey];

    if (!entradaProgramada) return { estado: 1, justificacion: 'Sin horario definido' };

    const { rows: logs } = await db.query(`
      SELECT timestamp, verificacion_tipo FROM biometrico_logs_raw
      WHERE biometrico_id = (SELECT biometrico_id FROM personal WHERE id = $1)
        AND timestamp::date = $2::date
      ORDER BY timestamp ASC
    `, [personalId, fecha]);

    if (logs.length === 0) return { estado: 9, minutos_atraso: 0 };

    const primera = logs[0].timestamp;
    const ultima = logs[logs.length - 1].timestamp;

    const [eh, em] = entradaProgramada.split(':');
    const entradaMinutos = parseInt(eh) * 60 + parseInt(em);
    const llegadaMinutos = primera.getHours() * 60 + primera.getMinutes();
    const tolerancia = turno.tolerancia_atraso || 5;
    const minutosAtraso = Math.max(0, llegadaMinutos - entradaMinutos - tolerancia);

    if (logs.length === 1) return { estado: 8, minutos_atraso: minutosAtraso };

    const [sh, sm] = salidaProgramada.split(':');
    let salidaMinutos = parseInt(sh) * 60 + parseInt(sm);
    const salidaReal = ultima.getHours() * 60 + ultima.getMinutes();

    if (salidaMinutos < entradaMinutos) salidaMinutos += 1440;

    const salidaAdelantada = turno.salida_adelantada || 0;

    if (minutosAtraso > 0) {
      if (logs.length >= 2 && salidaReal >= salidaMinutos - salidaAdelantada) {
        return { estado: 2, minutos_atraso: minutosAtraso };
      }
      return { estado: 2, minutos_atraso: minutosAtraso };
    }

    if (salidaReal < salidaMinutos - salidaAdelantada) {
      const minutosAdelanto = salidaMinutos - salidaReal;
      return { estado: 7, minutos_atraso: 0 };
    }

    return { estado: 1, minutos_atraso: 0 };
  }

  static async procesarMes(personalId, mes, anio) {
    const diasDelMes = new Date(anio, mes, 0).getDate();
    let totalAtrasos = 0;
    let totalFaltas = 0;
    let totalNormales = 0;

    let amId = null;
    const am = await db.query(`
      SELECT id, tipo_planilla FROM asistencia_mensual
      WHERE personal_id = $1 AND mes = $2 AND anio = $3
      LIMIT 1
    `, [personalId, mes, anio]);
    amId = am.rows.length > 0 ? am.rows[0].id : null;

    if (!amId) {
      let tipo = 'MINISTERIAL';
      const { rows: vl } = await db.query(`
        SELECT unidad_servicio FROM vinculos_laborales WHERE personal_id = $1 LIMIT 1
      `, [personalId]);
      if (vl.length > 0 && vl[0].unidad_servicio &&
          vl[0].unidad_servicio.toUpperCase().includes('RESIDENTE')) {
        tipo = 'RESIDENTE';
      }
      const ins = await db.query(`
        INSERT INTO asistencia_mensual (personal_id, mes, anio, total_horas, total_atrasos_min, tipo_planilla)
        VALUES ($1, $2, $3, 0, 0, $4) RETURNING id
      `, [personalId, mes, anio, tipo]);
      amId = ins.rows[0].id;
    }

    for (let dia = 1; dia <= diasDelMes; dia++) {
      const fecha = `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      const resultado = await this.calcularEstadoDiario(personalId, fecha);

      await db.query(`
        INSERT INTO asistencia_diaria (asistencia_id, dia, valor, estado, minutos_atraso)
        VALUES ($1, $2, 'P', $3, $4)
        ON CONFLICT (asistencia_id, dia) DO UPDATE SET estado = EXCLUDED.estado, minutos_atraso = EXCLUDED.minutos_atraso
      `, [amId, dia, resultado.estado, resultado.minutos_atraso || 0]);

      if (resultado.estado === 2) totalAtrasos += resultado.minutos_atraso || 0;
      if (resultado.estado === 4 || resultado.estado === 9) totalFaltas++;
      if (resultado.estado === 1) totalNormales++;
    }

    await db.query(`
      UPDATE asistencia_mensual SET total_atrasos_min = $1
      WHERE id = $2
    `, [totalAtrasos, amId]);

    return { personal_id: personalId, mes, anio, totalAtrasos, totalFaltas, totalNormales };
  }

  static async procesarTodos(mes, anio) {
    const { rows: personal } = await db.query(`
      SELECT DISTINCT p.id FROM personal p
      JOIN biometrico_logs_raw br ON br.biometrico_id = p.biometrico_id
      WHERE EXTRACT(YEAR FROM br.timestamp) = $1 AND EXTRACT(MONTH FROM br.timestamp) = $2
    `, [anio, mes]);
    const resultados = [];

    for (const p of personal) {
      const result = await this.procesarMes(p.id, mes, anio);
      resultados.push(result);
    }

    await db.query(`
      INSERT INTO auditoria_asistencia (evento, detalle)
      VALUES ('CALCULO_MENSUAL', $1)
    `, [`Cálculo automático para ${mes}/${anio}: ${resultados.length} empleados procesados`]);

    return { mes, anio, totalProcesados: resultados.length, resultados };
  }
}

module.exports = CalculoAsistenciaService;
