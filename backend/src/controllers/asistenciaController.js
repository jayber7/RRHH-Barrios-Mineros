const AsistenciaService = require('../services/asistenciaService');
const CalculoAsistenciaService = require('../services/calculoAsistenciaService');
const SancionesService = require('../services/sancionesService');
const db = require('../config/db');

class AsistenciaController {
  static async importAsistencia(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No se subió ningún archivo' });
      }

      const { mes, anio } = req.body;
      if (!mes || !anio) {
        return res.status(400).json({ error: 'Mes y año son requeridos' });
      }

      const results = await AsistenciaService.importAsistenciaFromExcel(
        req.file.buffer,
        parseInt(mes),
        parseInt(anio)
      );

      await db.query(`
        INSERT INTO auditoria_asistencia (evento, detalle)
        VALUES ('IMPORTACION', $1)
      `, [`Importación de ${results.success} registros exitosos, ${results.errors} errores`]);

      res.json(results);
    } catch (error) {
      console.error('Error en importAsistencia:', error);
      res.status(500).json({ error: error.message || 'Error al procesar el archivo' });
    }
  }

  static async getAsistencias(req, res) {
    try {
      const { mes, anio, buscar, tipo } = req.query;
      let query = `
        SELECT 
          am.id,
          am.personal_id,
          p.ci, 
          p.primer_nombre, 
          p.apellido_paterno, 
          p.apellido_materno,
          am.mes, 
          am.anio, 
          am.total_horas, 
          am.total_atrasos_min, 
          am.tipo_planilla,
          am.observaciones
        FROM asistencia_mensual am
        JOIN personal p ON am.personal_id = p.id
        WHERE 1=1
      `;
      const params = [];

      if (mes) {
        params.push(mes);
        query += ` AND am.mes = $${params.length}`;
      }
      if (anio) {
        params.push(anio);
        query += ` AND am.anio = $${params.length}`;
      }
      if (tipo) {
        params.push(tipo);
        query += ` AND am.tipo_planilla = $${params.length}`;
      }
      if (buscar) {
        params.push(`%${buscar}%`);
        query += ` AND (p.ci LIKE $${params.length} OR p.primer_nombre ILIKE $${params.length} OR p.apellido_paterno ILIKE $${params.length})`;
      }

      query += ` ORDER BY am.anio DESC, am.mes DESC, p.apellido_paterno ASC`;

      const { rows } = await db.query(query, params);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener asistencias' });
    }
  }

  static async deleteAsistencia(req, res) {
    try {
      const { id } = req.params;
      await db.query('DELETE FROM asistencia_mensual WHERE id = $1', [id]);

      await db.query(`
        INSERT INTO auditoria_asistencia (evento, detalle)
        VALUES ('ELIMINACION', $1)
      `, [`Registro de asistencia #${id} eliminado`]);

      res.json({ message: 'Registro eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar registro' });
    }
  }

  static async getDetalle(req, res) {
    try {
      const { id } = req.params;
      const { rows: mensual } = await db.query(`
        SELECT am.*, p.ci, p.primer_nombre, p.apellido_paterno, p.apellido_materno
        FROM asistencia_mensual am
        JOIN personal p ON am.personal_id = p.id
        WHERE am.id = $1
      `, [id]);

      if (mensual.length === 0) return res.status(404).json({ error: 'No encontrado' });

      const { rows: dias } = await db.query(`
        SELECT ad.*, cm.detalle as motivo_justificacion, j.tipo as justificacion_tipo,
               j.motivo_detalle, j.justificante
        FROM asistencia_diaria ad
        LEFT JOIN justificaciones j ON ad.justificacion_id = j.id
        LEFT JOIN cat_motivos_justificacion cm ON j.motivo_id = cm.id
        WHERE ad.asistencia_id = $1
        ORDER BY ad.dia
      `, [id]);

      res.json({ mensual: mensual[0], dias });
    } catch (error) {
      console.error('Error al obtener detalle:', error);
      res.status(500).json({ error: 'Error al obtener detalle' });
    }
  }

  static async updateEstadoDiario(req, res) {
    try {
      const { id } = req.params;
      const { estado, justificacion_id } = req.body;

      await db.query(`
        UPDATE asistencia_diaria SET estado = $1, justificacion_id = $2
        WHERE id = $3
      `, [estado, justificacion_id || null, id]);

      res.json({ message: 'Estado actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar estado' });
    }
  }

  static async calcularMes(req, res) {
    try {
      const { personal_id, mes, anio } = req.body;
      if (!personal_id || !mes || !anio) {
        return res.status(400).json({ error: 'personal_id, mes y anio requeridos' });
      }

      const resultado = await CalculoAsistenciaService.procesarMes(personal_id, mes, anio);

      await db.query(`
        INSERT INTO auditoria_asistencia (evento, detalle)
        VALUES ('CALCULO', $1)
      `, [`Cálculo manual para empleado #${personal_id} - ${mes}/${anio}`]);

      res.json(resultado);
    } catch (error) {
      console.error('Error al calcular mes:', error);
      res.status(500).json({ error: 'Error al procesar cálculo mensual' });
    }
  }

  static async calcularTodos(req, res) {
    try {
      const { mes, anio } = req.body;
      if (!mes || !anio) return res.status(400).json({ error: 'Mes y año requeridos' });

      const { rows } = await db.query(`
        INSERT INTO asistencia_jobs (mes, anio, estado) VALUES ($1, $2, 'pendiente')
        RETURNING id
      `, [parseInt(mes), parseInt(anio)]);
      const jobId = rows[0].id;

      setImmediate(async () => {
        try {
          await db.query(`UPDATE asistencia_jobs SET estado = 'ejecutando', updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [jobId]);
          await CalculoAsistenciaService.procesarTodos(parseInt(mes), parseInt(anio), async (procesados, total) => {
            await db.query(`
              UPDATE asistencia_jobs SET procesados = $1, total = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3
            `, [procesados, total, jobId]);
          });
          await db.query(`UPDATE asistencia_jobs SET estado = 'completado', procesados = total, updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [jobId]);
        } catch (error) {
          console.error('Error en job de cálculo:', error);
          await db.query(`
            UPDATE asistencia_jobs SET estado = 'error', detalle = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2
          `, [error.message, jobId]);
        }
      });

      res.status(202).json({ jobId, estado: 'pendiente' });
    } catch (error) {
      console.error('Error al iniciar cálculo masivo:', error);
      res.status(500).json({ error: 'Error al iniciar cálculo masivo' });
    }
  }

  static async getEstadoJob(req, res) {
    try {
      const { job_id } = req.query;
      if (!job_id) return res.status(400).json({ error: 'job_id requerido' });

      const { rows } = await db.query(`
        SELECT id, mes, anio, estado, procesados, total, detalle, updated_at FROM asistencia_jobs WHERE id = $1
      `, [parseInt(job_id)]);
      if (!rows[0]) return res.status(404).json({ error: 'Job no encontrado' });
      res.json(rows[0]);
    } catch (error) {
      console.error('Error al obtener estado del job:', error);
      res.status(500).json({ error: 'Error al obtener estado del job' });
    }
  }

  static async getSancionPersonal(req, res) {
    try {
      const { personal_id, mes, anio } = req.query;
      if (!personal_id || !mes || !anio) {
        return res.status(400).json({ error: 'personal_id, mes y anio requeridos' });
      }

      const resultado = await SancionesService.calcularSancionPersonal(personal_id, parseInt(mes), parseInt(anio));
      res.json(resultado);
    } catch (error) {
      console.error('Error al calcular sanción:', error);
      res.status(500).json({ error: 'Error al calcular sanción' });
    }
  }
}

module.exports = AsistenciaController;
