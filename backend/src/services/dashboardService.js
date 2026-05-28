const db = require('../config/db');

class DashboardService {
  static async getStats(mes, anio) {
    const targetMes = mes || 4;
    const targetAnio = anio || 2026;

    const [totalPersonal, tipoDist, fuentesDist, asistenciaRes, topAtrasos,
           distEstados, distUnidades, tendencia, nocturnos] = await Promise.all([
      db.query('SELECT COUNT(*) FROM personal'),
      db.query(`
        SELECT COALESCE(tp.nombre_tipo, 'SIN ASIGNAR') as label, COUNT(*) as value
        FROM vinculos_laborales vl
        LEFT JOIN cat_tipos_personal tp ON vl.tipo_personal_id = tp.id
        GROUP BY tp.nombre_tipo ORDER BY value DESC
      `),
      db.query(`
        SELECT COALESCE(ff.nombre_fuente, 'SIN ASIGNAR') as label, COUNT(*) as value
        FROM vinculos_laborales vl
        LEFT JOIN cat_fuentes_financiamiento ff ON vl.fuente_financiamiento_id = ff.id
        GROUP BY ff.nombre_fuente ORDER BY value DESC
      `),
      db.query(`
        SELECT SUM(total_horas) as total_horas_mes,
               SUM(total_atrasos_min) as total_atrasos_mes,
               tipo_planilla
        FROM asistencia_mensual
        WHERE mes = $1 AND anio = $2
        GROUP BY tipo_planilla
      `, [targetMes, targetAnio]),
      db.query(`
        SELECT p.id, p.ci, p.primer_nombre, p.apellido_paterno, p.apellido_materno,
               am.total_atrasos_min, am.total_horas, am.tipo_planilla,
               vl.cargo_actual, vl.unidad_servicio
        FROM asistencia_mensual am
        JOIN personal p ON am.personal_id = p.id
        LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id
        WHERE am.mes = $1 AND am.anio = $2 AND am.total_atrasos_min > 0
        ORDER BY am.total_atrasos_min DESC
        LIMIT 10
      `, [targetMes, targetAnio]),
      db.query(`
        SELECT ad.estado, COUNT(*) as total
        FROM asistencia_diaria ad
        JOIN asistencia_mensual am ON ad.asistencia_id = am.id
        WHERE am.mes = $1 AND am.anio = $2
        GROUP BY ad.estado ORDER BY ad.estado
      `, [targetMes, targetAnio]),
      db.query(`
        SELECT COALESCE(vl.unidad_servicio, 'SIN ASIGNAR') as label,
               COUNT(DISTINCT vl.personal_id) as value
        FROM vinculos_laborales vl
        JOIN personal p ON p.id = vl.personal_id
        GROUP BY vl.unidad_servicio ORDER BY value DESC
      `),
      db.query(`
        SELECT mes, anio,
               ROUND(SUM(total_horas)::numeric, 0) as total_horas,
               SUM(total_atrasos_min) as total_atrasos
        FROM asistencia_mensual
        WHERE anio = $1 AND mes BETWEEN $2 - 5 AND $2
        GROUP BY mes, anio ORDER BY anio, mes
      `, [targetAnio, targetMes]),
      db.query(`
        SELECT COUNT(DISTINCT am.personal_id) as empleados_nocturnos,
               COUNT(*) as dias_nocturnos
        FROM asistencia_diaria ad
        JOIN asistencia_mensual am ON ad.asistencia_id = am.id
        WHERE am.mes = $1 AND am.anio = $2 AND ad.estado = 5
      `, [targetMes, targetAnio]),
    ]);

    const totalAtrasos = asistenciaRes.rows.reduce((a, r) => a + (r.total_atrasos_mes || 0), 0);
    const totalHoras = asistenciaRes.rows.reduce((a, r) => a + (r.total_horas_mes || 0), 0);

    const estadosMap = { 1:'Normal', 2:'Atraso', 3:'Justificado', 4:'Falta',
                        5:'Nocturno', 6:'Sobretiempo', 7:'Sal. Adelantada',
                        8:'Incompleta', 9:'Sin Marcación' };

    return {
      totales: {
        personal: parseInt(totalPersonal.rows[0].count),
        atrasos: parseInt(totalAtrasos),
        horas: parseFloat(totalHoras.toFixed(0)),
        nocturnos: nocturnos.rows[0]?.empleados_nocturnos || 0,
        dias_nocturnos: nocturnos.rows[0]?.dias_nocturnos || 0,
      },
      tipoDistribucion: tipoDist.rows,
      fuentesDistribucion: fuentesDist.rows,
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
      tendencia: tendencia.rows,
      asistenciaPorPlanilla: asistenciaRes.rows,
    };
  }
}

module.exports = DashboardService;
