const db = require('../config/db');

class DashboardController {
  static async getStats(req, res) {
    try {
      // 1. Totales Generales
      const totalPersonal = await db.query('SELECT COUNT(*) FROM personal');
      
      // 2. Distribución por Tipo de Personal (Usando COALESCE para evitar vacíos)
      const tipoDistribucion = await db.query(`
        SELECT COALESCE(tp.nombre_tipo, 'SIN ASIGNAR') as label, COUNT(*) as value 
        FROM vinculos_laborales vl
        LEFT JOIN cat_tipos_personal tp ON vl.tipo_personal_id = tp.id
        GROUP BY tp.nombre_tipo
      `);

      // 3. Distribución por Fuente de Financiamiento
      const fuentesDistribucion = await db.query(`
        SELECT COALESCE(ff.nombre_fuente, 'SIN ASIGNAR') as label, COUNT(*) as value 
        FROM vinculos_laborales vl
        LEFT JOIN cat_fuentes_financiamiento ff ON vl.fuente_financiamiento_id = ff.id
        GROUP BY ff.nombre_fuente
      `);

      // 4. Resumen de Asistencia Mes Actual (Basado en el último mes cargado)
      const asistenciaResumen = await db.query(`
        SELECT 
          SUM(total_horas) as total_horas_mes,
          SUM(total_atrasos_min) as total_atrasos_mes,
          tipo_planilla
        FROM asistencia_mensual
        WHERE mes = 4 AND anio = 2026 -- Hardcoded por ahora para el test, idealmente dinámico
        GROUP BY tipo_planilla
      `);

      // 5. Top Atrasos
      const topAtrasos = await db.query(`
        SELECT p.primer_nombre, p.apellido_paterno, am.total_atrasos_min, am.tipo_planilla
        FROM asistencia_mensual am
        JOIN personal p ON am.personal_id = p.id
        WHERE am.total_atrasos_min > 0
        ORDER BY am.total_atrasos_min DESC
        LIMIT 5
      `);

      res.json({
        totales: {
            personal: parseInt(totalPersonal.rows[0].count),
            atrasos: asistenciaResumen.rows.reduce((acc, curr) => acc + curr.total_atrasos_mes, 0),
            horas: asistenciaResumen.rows.reduce((acc, curr) => acc + curr.total_horas_mes, 0)
        },
        tipoDistribucion: tipoDistribucion.rows,
        fuentesDistribucion: fuentesDistribucion.rows,
        topAtrasos: topAtrasos.rows
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener estadísticas del dashboard' });
    }
  }
}

module.exports = DashboardController;
