const db = require('../config/db');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const path = require('path');
const fs = require('fs');

const CERT_DIR = path.join(__dirname, '../../uploads/certificados');

class CertificadosService {
  static async listar(filtros = {}) {
    let sql = `
      SELECT c.*, p.primer_nombre, p.apellido_paterno, p.ci
      FROM certificados c
      JOIN personal p ON c.personal_id = p.id
      WHERE 1=1
    `;
    const params = [];
    let idx = 1;

    if (filtros.personal_id) {
      sql += ` AND c.personal_id = $${idx++}`;
      params.push(filtros.personal_id);
    }
    if (filtros.tipo) {
      sql += ` AND c.tipo = $${idx++}`;
      params.push(filtros.tipo);
    }
    if (filtros.estado) {
      sql += ` AND c.estado = $${idx++}`;
      params.push(filtros.estado);
    }
    sql += ' ORDER BY c.created_at DESC';
    if (filtros.limit) {
      sql += ` LIMIT $${idx++}`;
      params.push(filtros.limit);
    }

    const { rows } = await db.query(sql, params);
    return rows;
  }

  static async getById(id) {
    const { rows } = await db.query(`
      SELECT c.*, p.primer_nombre, p.apellido_paterno, p.ci, p.fecha_nacimiento,
             vl.cargo_actual, vl.unidad_servicio, vl.fecha_ingreso,
             ct.haber_basico, ct.fecha_inicio AS contrato_inicio, ct.fecha_fin AS contrato_fin
      FROM certificados c
      JOIN personal p ON c.personal_id = p.id
      LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id
      LEFT JOIN contratos ct ON ct.personal_id = p.id
      WHERE c.id = $1
      LIMIT 1
    `, [id]);
    return rows[0] || null;
  }

  static async getEmployeeData(personalId) {
    const { rows } = await db.query(`
      SELECT p.*, vl.cargo_actual, vl.unidad_servicio, vl.fecha_ingreso,
             ct.haber_basico, ct.fecha_inicio AS contrato_inicio, ct.fecha_fin AS contrato_fin,
             ct.nro_contrato, ct.cargo AS contrato_cargo
      FROM personal p
      LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id AND vl.id = (
        SELECT id FROM vinculos_laborales WHERE personal_id = p.id ORDER BY id DESC LIMIT 1
      )
      LEFT JOIN contratos ct ON ct.personal_id = p.id AND ct.id = (
        SELECT id FROM contratos WHERE personal_id = p.id ORDER BY id DESC LIMIT 1
      )
      WHERE p.id = $1
    `, [personalId]);
    return rows[0] || null;
  }

  static async generarNumeroCite() {
    const gestion = new Date().getFullYear();
    await db.query(`
      INSERT INTO secuencia_hr (gestion, ultimo_numero) VALUES ($1, 0)
      ON CONFLICT (gestion) DO NOTHING
    `, [gestion]);
    const { rows } = await db.query(`
      UPDATE secuencia_hr SET ultimo_numero = ultimo_numero + 1
      WHERE gestion = $1 RETURNING ultimo_numero
    `, [gestion]);
    return `CERT-${gestion}-${String(rows[0].ultimo_numero).padStart(4, '0')}`;
  }

  static async generarPDF(tipo, personalId) {
    const emp = await this.getEmployeeData(personalId);
    if (!emp) throw new Error('Empleado no encontrado');

    const cite = await this.generarNumeroCite();
    const fecha = new Date().toLocaleDateString('es-BO', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const fontItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

    const page = pdfDoc.addPage([612, 792]); // US Letter
    const { width, height } = page.getSize();
    const margin = 72;
    let y = height - margin;

    const drawText = (text, opts = {}) => {
      const f = opts.bold ? fontBold : opts.italic ? fontItalic : font;
      const size = opts.size || 11;
      page.drawText(text, {
        x: opts.x || margin,
        y: y,
        size,
        font: f,
        color: rgb(0, 0, 0),
        ...opts.extra || {}
      });
      if (opts.nextLine !== false) y -= (opts.lineHeight || size + 4);
    };

    // Header
    drawText('HOSPITAL DE SEGUNDO NIVEL "BARRIOS MINEROS"', { bold: true, size: 13, extra: { textAlign: 'center' } });
    drawText('ORURO - BOLIVIA', { bold: true, size: 11 });
    drawText('GERENCIA DE RECURSOS HUMANOS', { bold: true, size: 11 });
    y -= 12;

    // Line
    page.drawLine({
      start: { x: margin, y: y },
      end: { x: width - margin, y: y },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    y -= 20;

    // Cite
    drawText(`CITE: ${cite}`, { size: 10, italic: true });
    drawText(`ORURO, ${fecha}`, { size: 10, italic: true });
    y -= 20;

    // Title
    const titulos = {
      TRABAJO: 'CERTIFICADO DE TRABAJO',
      INGRESOS: 'CERTIFICADO DE INGRESOS',
      ANTIGUEDAD: 'CERTIFICADO DE ANTIGÜEDAD',
      ASISTENCIA: 'CERTIFICADO DE ASISTENCIA',
    };
    const titulo = titulos[tipo] || 'CERTIFICADO';
    drawText(titulo, { bold: true, size: 14, extra: { textAlign: 'center' } });
    y -= 24;

    const nombreCompleto = `${emp.primer_nombre || ''} ${emp.segundo_nombre || ''} ${emp.apellido_paterno || ''} ${emp.apellido_materno || ''}`.trim();
    const cargo = emp.contrato_cargo || emp.cargo_actual || 'Funcionario';
    const unidad = emp.unidad_servicio || 'Hospital Barrios Mineros';
    const ci = `${emp.ci || ''}${emp.complemento ? '-' + emp.complemento : ''}`;

    if (tipo === 'TRABAJO') {
      drawText(`La Gerencia de Recursos Humanos del Hospital de Segundo Nivel "Barrios Mineros" de Oruro,`, { size: 11 });
      drawText(``, { size: 6, lineHeight: 6 });
      drawText(`CERTIFICA QUE:`, { bold: true, size: 12 });
      drawText(``, { size: 6, lineHeight: 6 });
      drawText(`El/la Sr(a). ${nombreCompleto}, con C.I. ${ci}, es funcionario de esta institución`, { size: 11 });
      drawText(`desempeñando el cargo de ${cargo} en ${unidad}.`, { size: 11 });
      if (emp.fecha_ingreso) {
        const fi = new Date(emp.fecha_ingreso).toLocaleDateString('es-BO', { day: 'numeric', month: 'long', year: 'numeric' });
        drawText(`Con fecha de ingreso: ${fi}.`, { size: 11 });
      }
    } else if (tipo === 'INGRESOS') {
      drawText(`La Gerencia de Recursos Humanos del Hospital de Segundo Nivel "Barrios Mineros" de Oruro,`, { size: 11 });
      drawText(``, { size: 6, lineHeight: 6 });
      drawText(`CERTIFICA QUE:`, { bold: true, size: 12 });
      drawText(``, { size: 6, lineHeight: 6 });
      drawText(`El/la Sr(a). ${nombreCompleto}, con C.I. ${ci}, que desempeña el cargo de ${cargo},`, { size: 11 });
      drawText(`percibe un haber básico de Bs. ${parseFloat(emp.haber_basico || 0).toFixed(2)} mensuales.`, { size: 11 });
    } else if (tipo === 'ANTIGUEDAD') {
      drawText(`La Gerencia de Recursos Humanos del Hospital de Segundo Nivel "Barrios Mineros" de Oruro,`, { size: 11 });
      drawText(``, { size: 6, lineHeight: 6 });
      drawText(`CERTIFICA QUE:`, { bold: true, size: 12 });
      drawText(``, { size: 6, lineHeight: 6 });
      drawText(`El/la Sr(a). ${nombreCompleto}, con C.I. ${ci}, ha prestado sus servicios en esta`, { size: 11 });
      drawText(`institución desde el ${emp.fecha_ingreso ? new Date(emp.fecha_ingreso).toLocaleDateString('es-BO', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'},`, { size: 11 });
      if (emp.fecha_ingreso) {
        const anios = Math.floor((Date.now() - new Date(emp.fecha_ingreso).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        drawText(`acumulando una antigüedad de ${anios} años.`, { size: 11 });
      }
    } else if (tipo === 'ASISTENCIA') {
      drawText(`La Gerencia de Recursos Humanos del Hospital de Segundo Nivel "Barrios Mineros" de Oruro,`, { size: 11 });
      drawText(``, { size: 6, lineHeight: 6 });
      drawText(`CERTIFICA QUE:`, { bold: true, size: 12 });
      drawText(``, { size: 6, lineHeight: 6 });
      drawText(`El/la Sr(a). ${nombreCompleto}, con C.I. ${ci}, que desempeña el cargo de ${cargo},`, { size: 11 });
      drawText(`registra asistencia regular en la gestión ${new Date().getFullYear()} según los`, { size: 11 });
      drawText(`registros biométricos del sistema de control de personal.`, { size: 11 });
    }

    y -= 30;
    drawText(`Se extiende el presente certificado a solicitud del interesado para los fines`, { size: 11 });
    drawText(`que corresponda.`, { size: 11 });

    y -= 50;
    drawText('____________________________________', { size: 11, extra: { textAlign: 'center' } });
    y -= 4;
    drawText('GERENCIA DE RECURSOS HUMANOS', { bold: true, size: 11, extra: { textAlign: 'center' } });

    const pdfBytes = await pdfDoc.save();

    // Save file
    const dir = path.join(CERT_DIR, String(new Date().getFullYear()));
    fs.mkdirSync(dir, { recursive: true });
    const filename = `${cite}.pdf`;
    const filepath = path.join(dir, filename);
    fs.writeFileSync(filepath, pdfBytes);

    // Save to DB
    const ins = await db.query(`
      INSERT INTO certificados (personal_id, tipo, nro_cite, fecha_emision, contenido, archivo_pdf, estado)
      VALUES ($1, $2, $3, CURRENT_DATE, $4, $5, 'GENERADO')
      RETURNING id
    `, [personalId, tipo, cite, JSON.stringify({ nombre: nombreCompleto, ci, cargo, unidad }), filepath]);

    const { rows } = await db.query(`
      SELECT c.*, p.primer_nombre, p.apellido_paterno, p.ci
      FROM certificados c
      JOIN personal p ON c.personal_id = p.id
      WHERE c.id = $1
    `, [ins.rows[0].id]);

    return { ...rows[0], pdfBytes: pdfBytes.toString('base64') };
  }

  static async getPDF(id) {
    const { rows } = await db.query('SELECT archivo_pdf, nro_cite FROM certificados WHERE id = $1', [id]);
    if (rows.length === 0) return null;
    const cert = rows[0];
    if (!cert.archivo_pdf || !fs.existsSync(cert.archivo_pdf)) return null;
    return {
      buffer: fs.readFileSync(cert.archivo_pdf),
      filename: `${cert.nro_cite}.pdf`
    };
  }

  static async cambiarEstado(id, nuevoEstado) {
    const { rows } = await db.query(`
      UPDATE certificados SET estado = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 RETURNING *
    `, [nuevoEstado, id]);
    return rows[0] || null;
  }

  static async getResumen() {
    const { rows } = await db.query(`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE estado = 'GENERADO') AS generados,
        COUNT(*) FILTER (WHERE estado = 'ENTREGADO') AS entregados,
        COUNT(*) FILTER (WHERE estado = 'ANULADO') AS anulados
      FROM certificados
    `);
    return rows[0];
  }
}

module.exports = CertificadosService;
