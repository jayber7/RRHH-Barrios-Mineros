const db = require('../config/db');
const TurnosService = require('./turnosService');

class ValidacionesService {
  static async marcasSinPersonal(fechaInicio, fechaFin) {
    const { rows } = await db.query(`
      SELECT l.id, l.biometrico_id, l.timestamp, l.device_ip
      FROM biometrico_logs_raw l
      LEFT JOIN personal p ON l.biometrico_id = p.biometrico_id
      WHERE p.id IS NULL
        AND l.timestamp >= $1::date
        AND l.timestamp < $2::date + interval '1 day'
      ORDER BY l.timestamp DESC
    `, [fechaInicio, fechaFin]);
    return rows;
  }

  static async marcasDuplicadas(fechaInicio, fechaFin) {
    const { rows } = await db.query(`
      SELECT l1.id AS id1, l2.id AS id2,
             l1.biometrico_id, l1.timestamp AS t1, l2.timestamp AS t2,
             p.primer_nombre, p.apellido_paterno,
             EXTRACT(EPOCH FROM (l2.timestamp - l1.timestamp)) / 60 AS diff_minutos
      FROM biometrico_logs_raw l1
      JOIN biometrico_logs_raw l2 ON l1.biometrico_id = l2.biometrico_id
        AND l2.timestamp > l1.timestamp
        AND l2.timestamp <= l1.timestamp + interval '5 minutes'
      LEFT JOIN personal p ON l1.biometrico_id = p.biometrico_id
      WHERE l1.timestamp >= $1::date
        AND l1.timestamp < $2::date + interval '1 day'
      ORDER BY l1.timestamp DESC
    `, [fechaInicio, fechaFin]);
    return rows;
  }

  static async marcasFueraDeHorario(fechaInicio, fechaFin) {
    const { rows: logs } = await db.query(`
      SELECT l.id, l.biometrico_id, l.timestamp,
             p.id AS personal_id, p.primer_nombre, p.apellido_paterno
      FROM biometrico_logs_raw l
      JOIN personal p ON l.biometrico_id = p.biometrico_id
      WHERE l.timestamp >= $1::date
        AND l.timestamp < $2::date + interval '1 day'
      ORDER BY l.timestamp ASC
    `, [fechaInicio, fechaFin]);

    const resultados = [];
    for (const log of logs) {
      const fecha = log.timestamp.toISOString().split('T')[0];
      const turno = await TurnosService.getTurnoEmpleado(log.personal_id, fecha);
      if (!turno) continue;

      const diaSemana = new Date(fecha).getDay();
      const diasMap = { 1: 'lunes', 2: 'martes', 3: 'miercoles', 4: 'jueves', 5: 'viernes', 6: 'sabado', 0: 'domingo' };
      const diaCol = diasMap[diaSemana];
      const habilitadoKey = `${diaCol}_habilitado`;

      if (!turno[habilitadoKey]) {
        resultados.push({ ...log, tipo: 'DIA_NO_HABIL', detalle: 'Día no hábil en el turno' });
        continue;
      }

      const entradaKey = `${diaCol}_entrada`;
      const salidaKey = `${diaCol}_salida`;
      const entrada = turno[entradaKey];
      const salida = turno[salidaKey];

      if (!entrada) continue;

      const noche = turno[`nocturno_${diaCol}`] === true || (entrada >= salida && salida);
      const logMin = log.timestamp.getHours() * 60 + log.timestamp.getMinutes();
      const entradaMin = entrada.split(':').reduce((h, m) => parseInt(h) * 60 + parseInt(m));

      if (noche) {
        const salidaMin = salida ? salida.split(':').reduce((h, m) => parseInt(h) * 60 + parseInt(m)) : entradaMin + 480;
        const logMinAdjusted = log.timestamp.getHours() < 12 ? logMin + 1440 : logMin;
        const entradaAdjusted = entradaMin < 720 ? entradaMin + 1440 : entradaMin;
        const salidaAdjusted = salidaMin < 720 && salidaMin > 0 ? salidaMin + 1440 : salidaMin;

        const diffEntrada = Math.abs(logMinAdjusted - entradaAdjusted);
        const diffSalida = Math.abs(logMinAdjusted - salidaAdjusted);

        if (diffEntrada > 120 && diffSalida > 120) {
          resultados.push({ ...log, tipo: 'FUERA_HORARIO', detalle: `Turno noche ${entrada}-${salida}, marca a las ${log.timestamp.toTimeString().slice(0,5)}` });
        }
      } else {
        const salidaMin = salida ? salida.split(':').reduce((h, m) => parseInt(h) * 60 + parseInt(m)) : entradaMin + 480;
        const diffEntrada = Math.abs(logMin - entradaMin);
        const diffSalida = Math.abs(logMin - salidaMin);

        if (diffEntrada > 120 && diffSalida > 120) {
          resultados.push({ ...log, tipo: 'FUERA_HORARIO', detalle: `Turno ${entrada}-${salida}, marca a las ${log.timestamp.toTimeString().slice(0,5)}` });
        }
      }
    }

    return resultados;
  }

  static async diasSinMarcacion(fechaInicio, fechaFin) {
    const { rows } = await db.query(`
      SELECT p.id AS personal_id, p.primer_nombre, p.apellido_paterno,
             ta.turno_plantilla_id, ta.fecha_inicio, ta.fecha_fin,
             tp.codigo AS turno_codigo
      FROM turnos_asignados ta
      JOIN personal p ON ta.personal_id = p.id
      JOIN turnos_plantilla tp ON ta.turno_plantilla_id = tp.id
      WHERE ta.fecha_inicio <= $2::date
        AND (ta.fecha_fin IS NULL OR ta.fecha_fin >= $1::date)
      ORDER BY p.apellido_paterno, ta.fecha_inicio
    `, [fechaInicio, fechaFin]);

    const faltantes = [];
    for (const emp of rows) {
      const inicio = new Date(Math.max(new Date(fechaInicio).getTime(), emp.fecha_inicio.getTime()));
      const fin = new Date(Math.min(new Date(fechaFin).getTime(), emp.fecha_fin ? emp.fecha_fin.getTime() : Infinity));

      const diasMap = { 1: 'lunes', 2: 'martes', 3: 'miercoles', 4: 'jueves', 5: 'viernes', 6: 'sabado', 0: 'domingo' };

      const { rows: turno } = await db.query('SELECT * FROM turnos_plantilla WHERE id = $1', [emp.turno_plantilla_id]);
      if (turno.length === 0) continue;
      const t = turno[0];

      for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
        const diaSemana = d.getDay();
        const diaCol = diasMap[diaSemana];
        if (!t[`${diaCol}_habilitado`]) continue;
        if (!t[`${diaCol}_entrada`]) continue;

        const fechaStr = d.toISOString().split('T')[0];
        const { rows: logCount } = await db.query(`
          SELECT COUNT(*) AS cnt FROM biometrico_logs_raw
          WHERE biometrico_id::text = (SELECT biometrico_id::text FROM personal WHERE id = $1)
            AND timestamp >= $2::date + interval '6 hours'
            AND timestamp < $2::date + interval '30 hours'
        `, [emp.personal_id, fechaStr]);

        if (parseInt(logCount[0].cnt) === 0) {
          faltantes.push({
            personal_id: emp.personal_id,
            primer_nombre: emp.primer_nombre,
            apellido_paterno: emp.apellido_paterno,
            fecha: fechaStr,
            turno_codigo: emp.turno_codigo
          });
        }
      }
    }

    return faltantes;
  }

  static async tresOMasMarcas(fechaInicio, fechaFin) {
    const { rows } = await db.query(`
      SELECT l.biometrico_id, l.timestamp::date AS fecha,
             p.primer_nombre, p.apellido_paterno,
             COUNT(*) AS total_marcas
      FROM biometrico_logs_raw l
      LEFT JOIN personal p ON l.biometrico_id = p.biometrico_id
      WHERE l.timestamp >= $1::date
        AND l.timestamp < $2::date + interval '1 day'
      GROUP BY l.biometrico_id, l.timestamp::date, p.primer_nombre, p.apellido_paterno
      HAVING COUNT(*) >= 3
      ORDER BY l.timestamp::date DESC, COUNT(*) DESC
    `, [fechaInicio, fechaFin]);
    return rows;
  }

  static async ejecutarTodas(fechaInicio, fechaFin) {
    const [sinPersonal, duplicadas, fueraHorario, sinMarcacion, tresMas] = await Promise.all([
      this.marcasSinPersonal(fechaInicio, fechaFin),
      this.marcasDuplicadas(fechaInicio, fechaFin),
      this.marcasFueraDeHorario(fechaInicio, fechaFin),
      this.diasSinMarcacion(fechaInicio, fechaFin),
      this.tresOMasMarcas(fechaInicio, fechaFin),
    ]);

    return {
      sin_personal: sinPersonal,
      duplicadas: duplicadas,
      fuera_horario: fueraHorario,
      sin_marcacion: sinMarcacion,
      tres_o_mas: tresMas,
      resumen: {
        sin_personal: sinPersonal.length,
        duplicadas: duplicadas.length,
        fuera_horario: fueraHorario.length,
        sin_marcacion: sinMarcacion.length,
        tres_o_mas: tresMas.length,
        total: sinPersonal.length + duplicadas.length + fueraHorario.length + sinMarcacion.length + tresMas.length
      }
    };
  }

  static async ejecutarPorEmpleado(personalId, fechaInicio, fechaFin) {
    const { rows: personal } = await db.query('SELECT id, primer_nombre, apellido_paterno, biometrico_id FROM personal WHERE id = $1', [personalId]);
    if (personal.length === 0) return {};

    const emp = personal[0];
    const { rows: logs } = await db.query(`
      SELECT * FROM biometrico_logs_raw
      WHERE biometrico_id::text = $1::text
        AND timestamp >= $2::date
        AND timestamp < $3::date + interval '1 day'
      ORDER BY timestamp ASC
    `, [emp.biometrico_id, fechaInicio, fechaFin]);

    const sinMarcacion = await this.diasSinMarcacion(fechaInicio, fechaFin);
    const empSinMarcacion = sinMarcacion.filter(s => s.personal_id === personalId);

    return {
      personal: emp,
      logs,
      sin_marcacion: empSinMarcacion,
      total_logs: logs.length,
      total_sin_marcacion: empSinMarcacion.length
    };
  }
}

module.exports = ValidacionesService;
