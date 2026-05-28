const db = require('../config/db');
const TurnosService = require('./turnosService');

class CalculoAsistenciaService {
  static _timeToMin(t) {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + (m || 0);
  }

  static _esNocturno(turno, diaCol, entradaMinutos, salidaMinutos) {
    const nocturnoKey = `nocturno_${diaCol}`;
    return turno[nocturnoKey] === true || (entradaMinutos >= salidaMinutos && salidaMinutos > 0);
  }

  static async calcularEstadoDiario(personalId, fecha) {
    const fechaObj = new Date(fecha);
    const diaSemana = fechaObj.getDay();
    const diasMap = { 1: 'lunes', 2: 'martes', 3: 'miercoles', 4: 'jueves', 5: 'viernes', 6: 'sabado', 0: 'domingo' };
    const diaCol = diasMap[diaSemana];

    const turno = await TurnosService.getTurnoEmpleado(personalId, fecha);
    if (!turno) return { estado: 1, minutos_atraso: 0, horas_turno: 0 };

    const habilitadoKey = `${diaCol}_habilitado`;
    if (!turno[habilitadoKey]) return { estado: 1, minutos_atraso: 0, horas_turno: 0 };

    const entradaKey = `${diaCol}_entrada`;
    const salidaKey = `${diaCol}_salida`;
    const entradaProgramada = turno[entradaKey];
    const salidaProgramada = turno[salidaKey];

    if (!entradaProgramada) return { estado: 1, minutos_atraso: 0, horas_turno: 0 };

    const entradaMinutos = this._timeToMin(entradaProgramada);
    let salidaMinutos = this._timeToMin(salidaProgramada);
    const nocturno = this._esNocturno(turno, diaCol, entradaMinutos, salidaMinutos);

    if (salidaMinutos < entradaMinutos) salidaMinutos += 1440;
    const horasTurno = Math.round((salidaMinutos - entradaMinutos) / 60 * 100) / 100;

    const offsetHoras = nocturno ? 12 : 6;
    const { rows: logs } = await db.query(`
      SELECT timestamp, verificacion_tipo FROM biometrico_logs_raw
      WHERE biometrico_id::text = (SELECT biometrico_id::text FROM personal WHERE id = $1)
        AND timestamp >= $2::date + $3::interval
        AND timestamp < $2::date + interval '1 day' + $3::interval
      ORDER BY timestamp ASC
    `, [personalId, fecha, `${offsetHoras} hours`]);

    if (logs.length === 0) return { estado: 9, minutos_atraso: 0, horas_turno: 0 };

    const primera = logs[0].timestamp;
    const ultima = logs[logs.length - 1].timestamp;

    const llegadaMinutos = primera.getHours() * 60 + primera.getMinutes();
    const tolerancia = turno.tolerancia_atraso || 5;
    let minutosAtraso = Math.max(0, llegadaMinutos - entradaMinutos - tolerancia);

    const UMBRAL_ATRASO_HORAS = 4;
    if (llegadaMinutos - entradaMinutos > UMBRAL_ATRASO_HORAS * 60) {
      minutosAtraso = 0;
    }

    if (logs.length === 1) return { estado: 8, minutos_atraso: minutosAtraso, horas_turno: 0 };

    let salidaRealMinutos = ultima.getHours() * 60 + ultima.getMinutes();
    if (nocturno && salidaRealMinutos < entradaMinutos) {
      salidaRealMinutos += 1440;
    }

    const salidaAdelantada = turno.salida_adelantada || 0;

    if (minutosAtraso > 0) {
      return { estado: 2, minutos_atraso: minutosAtraso, horas_turno: horasTurno };
    }

    if (salidaRealMinutos < salidaMinutos - salidaAdelantada) {
      return { estado: 7, minutos_atraso: 0, horas_turno: horasTurno };
    }

    if (nocturno) {
      return { estado: 5, minutos_atraso: 0, horas_turno: horasTurno };
    }

    return { estado: 1, minutos_atraso: 0, horas_turno: horasTurno };
  }

  static async procesarMes(personalId, mes, anio) {
    const diasDelMes = new Date(anio, mes, 0).getDate();
    let totalAtrasos = 0;
    let totalHoras = 0;

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
      if (resultado.estado === 1 || resultado.estado === 2 || resultado.estado === 5 || resultado.estado === 7) {
        totalHoras += resultado.horas_turno || 0;
      }
    }

    await db.query(`
      UPDATE asistencia_mensual SET total_horas = $1, total_atrasos_min = $2
      WHERE id = $3
    `, [totalHoras, totalAtrasos, amId]);

    return { personal_id: personalId, mes, anio, totalHoras, totalAtrasos };
  }

  static async procesarTodos(mes, anio) {
    const { rows: personal } = await db.query(`
      SELECT DISTINCT p.id FROM personal p
      JOIN biometrico_logs_raw br ON br.biometrico_id::text = p.biometrico_id::text
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
