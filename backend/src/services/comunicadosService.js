const db = require('../config/db');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

class ComunicadosService {
  static async getAll(filters = {}) {
    let query = `
      SELECT c.*,
             tc.nombre as tipo_nombre,
             cc.nombre as clasificacion_nombre,
             CONCAT(p_rec.primer_nombre, ' ', p_rec.apellido_paterno) as recepcion_nombre,
             CONCAT(p_rem.primer_nombre, ' ', p_rem.apellido_paterno) as remitente_nombre,
             COALESCE(
               (SELECT jsonb_agg(jsonb_build_object('id', e.id, 'nombre', e.nombre, 'color', e.color))
                FROM correspondencia_etiquetas ce
                JOIN cat_etiquetas e ON ce.etiqueta_id = e.id
                WHERE ce.correspondencia_id = c.id),
               '[]'::jsonb
             ) as etiquetas,
             COALESCE(
               (SELECT jsonb_agg(jsonb_build_object('id', cd.id, 'personal_id', cd.personal_id,
                 'nombre', CONCAT(p.primer_nombre, ' ', p.apellido_paterno),
                 'leido', cd.leido, 'fecha_lectura', cd.fecha_lectura))
                FROM comunicados_distribucion cd
                LEFT JOIN personal p ON cd.personal_id = p.id
                WHERE cd.comunicado_id = c.id),
               '[]'::jsonb
             ) as distribucion,
             COUNT(*) OVER() as total_count
      FROM correspondencia c
      JOIN cat_tipos_correspondencia tc ON c.tipo_id = tc.id
      LEFT JOIN cat_clasificaciones cc ON c.clasificacion_id = cc.id
      LEFT JOIN usuarios u_rec ON c.usuario_recepcion_id = u_rec.id
      LEFT JOIN personal p_rec ON u_rec.personal_id = p_rec.id
      LEFT JOIN usuarios u_rem ON c.remitente_interno_id = u_rem.id
      LEFT JOIN personal p_rem ON u_rem.personal_id = p_rem.id
      WHERE tc.codigo = 'COM'
    `;
    const params = [];

    if (filters.estado) {
      params.push(filters.estado);
      query += ` AND c.estado = $${params.length}`;
    }
    if (filters.busqueda) {
      params.push(`%${filters.busqueda}%`);
      query += ` AND (c.referencia ILIKE $${params.length} OR CAST(c.hr_correlativo AS TEXT) ILIKE $${params.length})`;
    }
    if (filters.desde) {
      params.push(filters.desde);
      query += ` AND c.fecha_recepcion >= $${params.length}::date`;
    }
    if (filters.hasta) {
      params.push(filters.hasta);
      query += ` AND c.fecha_recepcion < $${params.length}::date + interval '1 day'`;
    }

    query += ' ORDER BY c.fecha_recepcion DESC';

    if (filters.limit) {
      params.push(filters.limit);
      query += ` LIMIT $${params.length}`;
      if (filters.offset !== undefined) {
        params.push(filters.offset);
        query += ` OFFSET $${params.length}`;
      }
    }

    const { rows } = await db.query(query, params);
    return rows;
  }

  static async create(data, usuarioId) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      const hr = await client.query('SELECT next_hr($1) as hr', [data.gestion || 2026]);
      const hrCorrelativo = hr.rows[0].hr;

      const { rows } = await client.query(`
        INSERT INTO correspondencia (
          hr_correlativo, gestion, cite, tipo_id, clasificacion_id,
          remitente_interno_id, referencia, pdf_original,
          fecha_documento, usuario_recepcion_id, observaciones, estado
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        RETURNING *
      `, [
        hrCorrelativo, data.gestion || 2026, data.cite || null,
        data.tipo_id, data.clasificacion_id || null,
        usuarioId, data.referencia, data.pdf_original || null,
        data.fecha_documento, usuarioId, data.observaciones || null,
        data.estado || 'recibido',
      ]);

      const comunicadoId = rows[0].id;

      if (data.destinatarios && data.destinatarios.length > 0) {
        for (const pid of data.destinatarios) {
          await client.query(
            'INSERT INTO comunicados_distribucion (comunicado_id, personal_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [comunicadoId, pid]
          );
        }
      }

      if (data.etiquetas && data.etiquetas.length > 0) {
        for (const etiquetaId of data.etiquetas) {
          await client.query(
            'INSERT INTO correspondencia_etiquetas (correspondencia_id, etiqueta_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [comunicadoId, etiquetaId]
          );
        }
      }

      await client.query('COMMIT');
      return await this.getById(comunicadoId);
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  static async getById(id) {
    const { rows } = await db.query(`
      SELECT c.*,
             tc.nombre as tipo_nombre, tc.codigo as tipo_codigo,
             cc.nombre as clasificacion_nombre,
             CONCAT(p_rec.primer_nombre, ' ', p_rec.apellido_paterno) as recepcion_nombre,
             CONCAT(p_rem.primer_nombre, ' ', p_rem.apellido_paterno) as remitente_nombre,
             COALESCE(
               (SELECT jsonb_agg(jsonb_build_object('id', cd.id, 'personal_id', cd.personal_id,
                 'nombre', CONCAT(p.primer_nombre, ' ', p.apellido_paterno),
                 'leido', cd.leido, 'fecha_lectura', cd.fecha_lectura))
                FROM comunicados_distribucion cd
                LEFT JOIN personal p ON cd.personal_id = p.id
                WHERE cd.comunicado_id = c.id),
               '[]'::jsonb
             ) as distribucion,
             COALESCE(
               (SELECT jsonb_agg(jsonb_build_object('id', e.id, 'nombre', e.nombre, 'color', e.color))
                FROM correspondencia_etiquetas ce
                JOIN cat_etiquetas e ON ce.etiqueta_id = e.id
                WHERE ce.correspondencia_id = c.id),
               '[]'::jsonb
             ) as etiquetas
      FROM correspondencia c
      JOIN cat_tipos_correspondencia tc ON c.tipo_id = tc.id
      LEFT JOIN cat_clasificaciones cc ON c.clasificacion_id = cc.id
      LEFT JOIN usuarios u_rec ON c.usuario_recepcion_id = u_rec.id
      LEFT JOIN personal p_rec ON u_rec.personal_id = p_rec.id
      LEFT JOIN usuarios u_rem ON c.remitente_interno_id = u_rem.id
      LEFT JOIN personal p_rem ON u_rem.personal_id = p_rem.id
      WHERE c.id = $1
    `, [id]);
    return rows[0];
  }

  static async marcarLeido(comunicadoId, personalId) {
    const { rows } = await db.query(`
      UPDATE comunicados_distribucion
      SET leido = true, fecha_lectura = NOW()
      WHERE comunicado_id = $1 AND personal_id = $2
      RETURNING *
    `, [comunicadoId, personalId]);
    return rows[0] || null;
  }

  static async getDestinatariosDisponibles() {
    const { rows } = await db.query(`
      SELECT p.id, p.ci,
             CONCAT(p.primer_nombre, ' ', p.apellido_paterno, ' ', COALESCE(p.apellido_materno, '')) as nombre_completo,
             vl.unidad_servicio, vl.cargo_actual
      FROM personal p
      LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id
      WHERE vl.id IS NOT NULL
      ORDER BY p.apellido_paterno
    `);
    return rows;
  }

  static async generarPDF(comunicado) {
    const pdfDoc = await PDFDocument.create();

    const page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();

    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const drawText = (text, x, y, size = 10, font = fontRegular, color = [0, 0, 0]) => {
      page.drawText(text, { x, y, size, font, color: rgb(color[0], color[1], color[2]) });
    };

    let y = height - 50;

    drawText('HOSPITAL BARRIOS MINEROS', 50, y, 14, fontBold, [0.2, 0.4, 0.7]);
    y -= 20;
    drawText('Sistema de Gestión de Recursos Humanos', 50, y, 9, fontRegular, [0.4, 0.4, 0.4]);

    y -= 25;
    page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color: rgb(0.7, 0.7, 0.7) });

    y -= 30;
    const titulo = comunicado.clasificacion_nombre
      ? `${comunicado.clasificacion_nombre.toUpperCase()}`
      : 'COMUNICADO';
    drawText(titulo, 50, y, 18, fontBold, [0.1, 0.1, 0.1]);
    y -= 25;
    drawText(`N° ${String(comunicado.hr_correlativo).padStart(4, '0')}/${comunicado.gestion}`, 50, y, 11, fontRegular, [0.3, 0.3, 0.3]);

    y -= 35;
    drawText(`A: ${comunicado.distribucion?.map(d => d.nombre).join(', ') || 'DESTINATARIOS'}`, 50, y, 10, fontBold);
    y -= 20;
    drawText(`DE: ${comunicado.remitente_nombre || 'DIRECCIÓN'}`, 50, y, 10, fontBold);
    y -= 20;
    drawText(`FECHA: ${new Date(comunicado.fecha_documento).toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' })}`, 50, y, 10, fontRegular);

    y -= 30;
    page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });

    y -= 25;
    drawText('REF: ' + (comunicado.referencia || ''), 50, y, 12, fontBold, [0.2, 0.2, 0.2]);

    y -= 30;
    const texto = (comunicado.observaciones || comunicado.referencia || '').split('\n');
    for (const linea of texto) {
      drawText(linea, 50, y, 10, fontRegular, [0.15, 0.15, 0.15]);
      y -= 16;
    }

    y -= 40;
    page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });

    y -= 30;
    drawText('_________________________', 50, y, 10, fontRegular);
    y -= 18;
    drawText(comunicado.remitente_nombre || 'DIRECCIÓN', 50, y, 10, fontBold);
    y -= 14;
    drawText('Firma y Sello', 50, y, 9, fontRegular, [0.4, 0.4, 0.4]);

    return await pdfDoc.save();
  }

  static async createNotificaciones(comunicado) {
    if (!comunicado.distribucion || comunicado.distribucion.length === 0) return;
    for (const dest of comunicado.distribucion) {
      await db.query(`
        INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje, referencia_id, referencia_tipo)
        SELECT u.id, 'INFO', $1, $2, $3, 'comunicado'
        FROM usuarios u
        WHERE u.personal_id = $4 AND u.activo = true
      `, [
        `Nuevo Comunicado: ${comunicado.referencia?.substring(0, 80) || 'Comunicado interno'}`,
        `Se ha publicado un nuevo comunicado. HR-${String(comunicado.hr_correlativo).padStart(4, '0')}/${comunicado.gestion}`,
        comunicado.id,
        dest.personal_id,
      ]);
    }
  }
}

module.exports = ComunicadosService;
