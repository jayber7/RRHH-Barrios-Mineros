const db = require('../config/db');
const ConfiguracionService = require('./configuracionService');

class DashboardService {
  static async getStats(mes, anio, unidad) {
    const targetMes = mes || (await ConfiguracionService.get('dashboard_mes_default', 4));
    const targetAnio = anio || (await ConfiguracionService.get('dashboard_anio_default', 2026));

    const unidadWhere = unidad
      ? unidad === 'SIN ASIGNAR'
        ? "AND (vl.unidad_servicio IS NULL OR vl.unidad_servicio = 'SIN ASIGNAR')"
        : `AND vl.unidad_servicio = '${unidad.replace(/'/g, "''")}'`
      : '';
    const joinVl = unidad
      ? 'LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id'
      : '';

    // Common unit filter for queries that already have vl alias via LEFT JOIN
    // (uses LEFT JOIN so WHERE clause on vl works correctly)
    const leftJoinVl = 'LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id';


    const [totalPersonal, tipoDist, asistenciaRes, topAtrasos,
           distEstados, distUnidades, tendencia, nocturnos, ausentismo,
           topFaltas, comparativo, radarUnidad] = await Promise.all([
      db.query(`
        SELECT COUNT(*) FROM personal p
        ${joinVl}
        WHERE 1=1 ${unidadWhere}
      `),
      db.query(`
        SELECT COALESCE(tp.nombre_tipo, 'SIN ASIGNAR') as label, COUNT(*) as value
        FROM vinculos_laborales vl
        LEFT JOIN cat_tipos_personal tp ON vl.tipo_personal_id = tp.id
        WHERE 1=1 ${unidadWhere}
        GROUP BY tp.nombre_tipo ORDER BY value DESC
      `),
      db.query(`
        SELECT SUM(total_horas) as total_horas_mes,
               SUM(total_atrasos_min) as total_atrasos_mes,
               tipo_planilla
        FROM asistencia_mensual am
        JOIN personal p ON am.personal_id = p.id
        ${unidad ? 'LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id' : ''}
        WHERE mes = $1 AND anio = $2 ${unidadWhere}
        GROUP BY tipo_planilla
      `, [targetMes, targetAnio]),
      db.query(`
        SELECT p.id, p.ci, p.primer_nombre, p.apellido_paterno, p.apellido_materno,
               am.total_atrasos_min, am.total_horas, am.tipo_planilla,
               vl.cargo_actual, vl.unidad_servicio
        FROM asistencia_mensual am
        JOIN personal p ON am.personal_id = p.id
        LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id
        WHERE am.mes = $1 AND am.anio = $2 AND am.total_atrasos_min > 0 ${unidadWhere}
        ORDER BY am.total_atrasos_min DESC
        LIMIT 10
      `, [targetMes, targetAnio]),
      db.query(`
        SELECT ad.estado, COUNT(*) as total
        FROM asistencia_diaria ad
        JOIN asistencia_mensual am ON ad.asistencia_id = am.id
        JOIN personal p ON am.personal_id = p.id
        ${unidad ? 'LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id' : ''}
        WHERE am.mes = $1 AND anio = $2 ${unidadWhere}
        GROUP BY ad.estado ORDER BY ad.estado
      `, [targetMes, targetAnio]),
      db.query(`
        SELECT COALESCE(vl.unidad_servicio, 'SIN ASIGNAR') as label,
               COUNT(DISTINCT vl.personal_id) as value
        FROM vinculos_laborales vl
        JOIN personal p ON p.id = vl.personal_id
        WHERE 1=1 ${unidadWhere}
        GROUP BY vl.unidad_servicio ORDER BY value DESC
      `),
      db.query(`
        SELECT mes, anio,
               ROUND(SUM(total_horas)::numeric, 0) as total_horas,
               SUM(total_atrasos_min) as total_atrasos
        FROM asistencia_mensual am
        JOIN personal p ON am.personal_id = p.id
        ${unidad ? 'LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id' : ''}
        WHERE anio = $1 AND mes BETWEEN 1 AND 12
        ${unidadWhere}
        GROUP BY mes, anio ORDER BY anio, mes
      `, [targetAnio]),
      db.query(`
        SELECT COUNT(DISTINCT am.personal_id) as empleados_nocturnos,
               COUNT(*) as dias_nocturnos
        FROM asistencia_diaria ad
        JOIN asistencia_mensual am ON ad.asistencia_id = am.id
        JOIN personal p ON am.personal_id = p.id
        ${unidad ? 'LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id' : ''}
        WHERE am.mes = $1 AND am.anio = $2 AND ad.estado = 5
        ${unidadWhere}
      `, [targetMes, targetAnio]),
      db.query(`
        SELECT
          COUNT(*) FILTER (WHERE ad.estado = 4 OR ad.estado = 9) as ausencias,
          COUNT(*) as total_dias
        FROM asistencia_diaria ad
        JOIN asistencia_mensual am ON ad.asistencia_id = am.id
        JOIN personal p ON am.personal_id = p.id
        ${unidad ? 'LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id' : ''}
        WHERE am.mes = $1 AND am.anio = $2
        ${unidadWhere}
      `, [targetMes, targetAnio]),
      db.query(`
        SELECT p.id, p.ci, p.primer_nombre, p.apellido_paterno, p.apellido_materno,
               COUNT(*) FILTER (WHERE ad.estado = 4 OR ad.estado = 9) as total_faltas,
               vl.unidad_servicio
        FROM asistencia_diaria ad
        JOIN asistencia_mensual am ON ad.asistencia_id = am.id
        JOIN personal p ON am.personal_id = p.id
        LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id
        WHERE am.mes = $1 AND am.anio = $2 ${unidadWhere}
        GROUP BY p.id, vl.unidad_servicio
        HAVING COUNT(*) FILTER (WHERE ad.estado = 4 OR ad.estado = 9) > 0
        ORDER BY total_faltas DESC
        LIMIT 10
      `, [targetMes, targetAnio]),
      db.query(`
        SELECT
          (SELECT ROUND(SUM(am2.total_horas)::numeric, 0)
           FROM asistencia_mensual am2
           JOIN personal p2 ON am2.personal_id = p2.id
           ${unidad ? 'LEFT JOIN vinculos_laborales vl2 ON vl2.personal_id = p2.id' : ''}
           WHERE am2.mes = $1 AND am2.anio = $2 ${unidadWhere.replace(/vl\./g, 'vl2.')}) as horas_actual,
          (SELECT ROUND(SUM(am2.total_horas)::numeric, 0)
           FROM asistencia_mensual am2
           JOIN personal p2 ON am2.personal_id = p2.id
           ${unidad ? 'LEFT JOIN vinculos_laborales vl2 ON vl2.personal_id = p2.id' : ''}
           WHERE am2.mes = $1 - 1 AND am2.anio = $2 ${unidadWhere.replace(/vl\./g, 'vl2.')}) as horas_anterior,
          (SELECT SUM(am2.total_atrasos_min)
           FROM asistencia_mensual am2
           JOIN personal p2 ON am2.personal_id = p2.id
           ${unidad ? 'LEFT JOIN vinculos_laborales vl2 ON vl2.personal_id = p2.id' : ''}
           WHERE am2.mes = $1 AND am2.anio = $2 ${unidadWhere.replace(/vl\./g, 'vl2.')}) as atrasos_actual,
          (SELECT SUM(am2.total_atrasos_min)
           FROM asistencia_mensual am2
           JOIN personal p2 ON am2.personal_id = p2.id
           ${unidad ? 'LEFT JOIN vinculos_laborales vl2 ON vl2.personal_id = p2.id' : ''}
           WHERE am2.mes = $1 - 1 AND am2.anio = $2 ${unidadWhere.replace(/vl\./g, 'vl2.')}) as atrasos_anterior,
          (SELECT COUNT(*)
           FROM asistencia_diaria ad2
           JOIN asistencia_mensual am2 ON ad2.asistencia_id = am2.id
           JOIN personal p2 ON am2.personal_id = p2.id
           ${unidad ? 'LEFT JOIN vinculos_laborales vl2 ON vl2.personal_id = p2.id' : ''}
           WHERE am2.mes = $1 AND am2.anio = $2 AND (ad2.estado = 4 OR ad2.estado = 9)
           ${unidadWhere.replace(/vl\./g, 'vl2.')}) as faltas_actual,
          (SELECT COUNT(*)
           FROM asistencia_diaria ad2
           JOIN asistencia_mensual am2 ON ad2.asistencia_id = am2.id
           JOIN personal p2 ON am2.personal_id = p2.id
           ${unidad ? 'LEFT JOIN vinculos_laborales vl2 ON vl2.personal_id = p2.id' : ''}
           WHERE am2.mes = $1 - 1 AND am2.anio = $2 AND (ad2.estado = 4 OR ad2.estado = 9)
           ${unidadWhere.replace(/vl\./g, 'vl2.')}) as faltas_anterior
      `, [targetMes, targetAnio]),
      db.query(`
        SELECT COALESCE(vl.unidad_servicio, 'SIN ASIGNAR') as unidad,
               COUNT(*) FILTER (WHERE ad.estado = 2) as atrasos,
               COUNT(*) FILTER (WHERE ad.estado = 4 OR ad.estado = 9) as faltas,
               COUNT(*) FILTER (WHERE ad.estado = 5) as nocturnos,
               COUNT(*) FILTER (WHERE ad.estado = 7) as salida_adelantada,
               COUNT(*) FILTER (WHERE ad.estado = 8) as incompletas
        FROM asistencia_diaria ad
        JOIN asistencia_mensual am ON ad.asistencia_id = am.id
        JOIN personal p ON am.personal_id = p.id
        LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id
        WHERE am.mes = $1 AND am.anio = $2 ${unidadWhere}
        GROUP BY vl.unidad_servicio
        ORDER BY unidad
      `, [targetMes, targetAnio]),
    ]);

    const horasTotal = asistenciaRes.rows.reduce((a, r) => a + (r.total_horas_mes || 0), 0);
    const atrasosTotal = asistenciaRes.rows.reduce((a, r) => a + (r.total_atrasos_mes || 0), 0);
    const ausentismoRow = ausentismo.rows[0] || {};
    const tasaAusentismo = ausentismoRow.total_dias > 0
      ? Math.round((ausentismoRow.ausencias / ausentismoRow.total_dias) * 10000) / 100
      : 0;

    const comp = comparativo.rows[0] || {};
    const calcVar = (act, ant) => {
      if (!ant || ant === 0) return { valor: act || 0, variacion: 0, tipo: 'neutro' };
      const v = Math.round(((act || 0) - ant) / ant * 100);
      return { valor: act || 0, variacion: Math.abs(v), tipo: v > 0 ? 'subio' : v < 0 ? 'bajo' : 'neutro' };
    };

    const estadosMap = { 1:'Normal', 2:'Atraso', 3:'Justificado', 4:'Falta',
                         5:'Nocturno', 6:'Sobretiempo', 7:'Sal. Adelantada',
                         8:'Incompleta', 9:'Sin Marcación' };

    return {
      totales: {
        personal: parseInt(totalPersonal.rows[0].count),
        atrasos: parseInt(atrasosTotal),
        horas: parseFloat(horasTotal.toFixed(0)),
        nocturnos: nocturnos.rows[0]?.empleados_nocturnos || 0,
        dias_nocturnos: nocturnos.rows[0]?.dias_nocturnos || 0,
        tasa_ausentismo: tasaAusentismo,
      },
      comparativo: {
        horas: calcVar(comp.horas_actual, comp.horas_anterior),
        atrasos: calcVar(comp.atrasos_actual, comp.atrasos_anterior),
        faltas: calcVar(comp.faltas_actual, comp.faltas_anterior),
      },
      tipoDistribucion: tipoDist.rows,
      distribucionEstados: distEstados.rows.map(r => ({
        estado: r.estado,
        label: estadosMap[r.estado] || `Estado ${r.estado}`,
        total: parseInt(r.total),
      })),
      distribucionUnidades: distUnidades.rows.map(r => ({
        label: r.label,
        value: parseInt(r.value),
      })),
      topAtrasos: topAtrasos.rows.map(r => ({
        ...r,
        nombre_completo: [r.primer_nombre, r.apellido_paterno, r.apellido_materno].filter(Boolean).join(' '),
      })),
      topFaltas: topFaltas.rows.map(r => ({
        ...r,
        nombre_completo: [r.primer_nombre, r.apellido_paterno, r.apellido_materno].filter(Boolean).join(' '),
      })),
      tendencia: tendencia.rows.map(r => ({
        ...r,
        total_horas: r.total_horas ? parseFloat(r.total_horas) : 0,
        total_atrasos: parseInt(r.total_atrasos || 0),
      })),
      asistenciaPorPlanilla: asistenciaRes.rows,
      radarUnidad: radarUnidad.rows.map(r => ({
        unidad: r.unidad,
        atrasos: parseInt(r.atrasos),
        faltas: parseInt(r.faltas),
        nocturnos: parseInt(r.nocturnos),
        salida_adelantada: parseInt(r.salida_adelantada),
        incompletas: parseInt(r.incompletas),
      })),
    };
  }

  static async getBiometricoStats() {
    const [marcacionesHoy, sinMarcar, config, timeline] = await Promise.all([
      db.query(`
        SELECT COUNT(*) as total FROM biometrico_logs_raw
        WHERE timestamp::date = CURRENT_DATE
      `),
      db.query(`
        SELECT COUNT(*) as total
        FROM personal p
        WHERE p.biometrico_id IS NOT NULL
          AND NOT EXISTS (
            SELECT 1 FROM biometrico_logs_raw b
            WHERE b.biometrico_id::text = p.biometrico_id::text
              AND b.timestamp::date = CURRENT_DATE
          )
      `),
      db.query('SELECT * FROM biometrico_config LIMIT 1'),
      db.query(`
        SELECT b.*, p.primer_nombre, p.apellido_paterno, p.apellido_materno
        FROM biometrico_logs_raw b
        LEFT JOIN personal p ON b.biometrico_id::text = p.biometrico_id::text
        WHERE b.timestamp::date = CURRENT_DATE
        ORDER BY b.timestamp DESC
        LIMIT 30
      `),
    ]);

    return {
      total_hoy: parseInt(marcacionesHoy.rows[0]?.total || 0),
      sin_marcar: parseInt(sinMarcar.rows[0]?.total || 0),
      dispositivo: config.rows[0] || null,
      timeline: timeline.rows.map(r => ({
        ...r,
        timestamp: r.timestamp,
      })),
    };
  }
}

module.exports = DashboardService;