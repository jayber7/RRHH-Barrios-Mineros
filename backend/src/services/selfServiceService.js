const db = require('../config/db');
const ConfiguracionService = require('./configuracionService');

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

class SelfServiceService {
  static async getResumen(personalId) {
    const [personal, marcacionesHoy, mensual, diarioMes, justificaciones, motivos] = await Promise.all([
      db.query(`
        SELECT p.*, vl.cargo_actual, vl.unidad_servicio,
               tp.codigo as turno_codigo
        FROM personal p
        LEFT JOIN vinculos_laborales vl ON p.id = vl.personal_id
        LEFT JOIN turnos_asignados ta ON ta.personal_id = p.id
          AND ta.fecha_inicio <= CURRENT_DATE
          AND (ta.fecha_fin IS NULL OR ta.fecha_fin >= CURRENT_DATE)
        LEFT JOIN turnos_plantilla tp ON ta.turno_plantilla_id = tp.id
        WHERE p.id = $1
        ORDER BY ta.fecha_inicio DESC
        LIMIT 1
      `, [personalId]),
      db.query(`
        SELECT b.*, p.primer_nombre, p.apellido_paterno
        FROM biometrico_logs_raw b
        LEFT JOIN personal p ON b.biometrico_id::text = p.biometrico_id::text
        WHERE b.biometrico_id::text = (SELECT biometrico_id::text FROM personal WHERE id = $1)
          AND b.timestamp::date = CURRENT_DATE
        ORDER BY b.timestamp DESC
      `, [personalId]),
      db.query(`
        SELECT am.* FROM asistencia_mensual am
        WHERE am.personal_id = $1
        ORDER BY am.anio DESC, am.mes DESC LIMIT 1
      `, [personalId]),
      db.query(`
        SELECT ad.* FROM asistencia_diaria ad
        JOIN asistencia_mensual am ON ad.asistencia_id = am.id
        WHERE am.personal_id = $1
          AND am.mes = EXTRACT(MONTH FROM CURRENT_DATE)::int
          AND am.anio = EXTRACT(YEAR FROM CURRENT_DATE)::int
        ORDER BY ad.dia ASC
      `, [personalId]),
      db.query(`
        SELECT j.*, cm.detalle as motivo_detalle_txt
        FROM justificaciones j
        LEFT JOIN cat_motivos_justificacion cm ON j.motivo_id = cm.id
        WHERE j.personal_id = $1
        ORDER BY j.fecha DESC LIMIT 10
      `, [personalId]),
      db.query('SELECT * FROM cat_motivos_justificacion ORDER BY id'),
    ]);

    const hoy = new Date();
    const mesActual = hoy.getMonth() + 1;
    const anioActual = hoy.getFullYear();
    const diasDelMes = new Date(anioActual, mesActual, 0).getDate();

    const totalDias = diarioMes.rows.length;
    const asistencias = diarioMes.rows.filter(d => d.estado === 1).length;
    const atrasos = diarioMes.rows.filter(d => d.estado === 2).length;
    const faltas = diarioMes.rows.filter(d => d.estado === 4 || d.estado === 9).length;
    const justificados = diarioMes.rows.filter(d => d.estado === 3).length;
    const tasaAsistencia = totalDias > 0 ? Math.round((asistencias / totalDias) * 100) : 0;

    return {
      personal: personal.rows[0] || null,
      marcaciones_hoy: marcacionesHoy.rows,
      mensual: mensual.rows[0] || null,
      resumen_mes: {
        total_dias: totalDias,
        asistencias,
        atrasos,
        faltas,
        justificados,
        tasa_asistencia: tasaAsistencia,
      },
      justificaciones: justificaciones.rows,
      cat_motivos: motivos.rows,
    };
  }

  static async getMarcaciones(personalId, limit = 50) {
    const { rows } = await db.query(`
      SELECT b.*, p.primer_nombre, p.apellido_paterno
      FROM biometrico_logs_raw b
      LEFT JOIN personal p ON b.biometrico_id::text = p.biometrico_id::text
      WHERE b.biometrico_id::text = (SELECT biometrico_id::text FROM personal WHERE id = $1)
      ORDER BY b.timestamp DESC
      LIMIT $2
    `, [personalId, limit]);
    return rows;
  }

  static async marcarWeb(personalId, { latitud, longitud, device_info, justificacion }) {
    const { rows: personal } = await db.query('SELECT id, biometrico_id FROM personal WHERE id = $1', [personalId]);
    if (!personal[0] || !personal[0].biometrico_id) {
      throw new Error('Personal no encontrado o sin ID biométrico vinculado');
    }

    const hospitalLat = parseFloat(await ConfiguracionService.get('geocerca_lat', '-16.5'));
    const hospitalLng = parseFloat(await ConfiguracionService.get('geocerca_lng', '-68.15'));
    const radio = parseFloat(await ConfiguracionService.get('geocerca_radio', '200'));

    let distancia = null;
    let ubicacionValida = true;
    if (latitud && longitud) {
      distancia = Math.round(haversineDistance(latitud, longitud, hospitalLat, hospitalLng));
      ubicacionValida = distancia <= radio;
    }

    const { rows: marcacionesHoy } = await db.query(`
      SELECT COUNT(*) as total FROM biometrico_logs_raw
      WHERE biometrico_id::text = $1 AND timestamp::date = CURRENT_DATE
    `, [personal[0].biometrico_id.toString()]);

    const totalHoy = parseInt(marcacionesHoy[0].total);
    const estadoAsistencia = totalHoy % 2 === 0 ? 0 : 1;
    const tipoLabel = estadoAsistencia === 0 ? 'Entrada' : 'Salida';

    const deviceIp = (device_info || 'WEB_CLOCK').substring(0, 50);
    const verificacionTipo = 200;

    const { rows: inserted } = await db.query(`
      INSERT INTO biometrico_logs_raw (biometrico_id, timestamp, verificacion_tipo, estado_asistencia, device_ip)
      VALUES ($1, NOW(), $2, $3, $4)
      ON CONFLICT (biometrico_id, timestamp) DO NOTHING
      RETURNING id
    `, [personal[0].biometrico_id, verificacionTipo, estadoAsistencia, deviceIp]);

    if (inserted.length === 0) {
      throw new Error('Ya existe una marcación en este mismo instante');
    }

    return {
      id: inserted[0].id,
      tipo: tipoLabel,
      timestamp: new Date().toISOString(),
      ubicacion_valida: ubicacionValida,
      distancia_metros: distancia,
      biometrico_id: personal[0].biometrico_id,
    };
  }
}

module.exports = SelfServiceService;
