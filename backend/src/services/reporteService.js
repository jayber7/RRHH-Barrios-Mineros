const ExcelJS = require('exceljs');
const db = require('../config/db');

class ReporteService {
  static async generarInventarioPersonal(filters = {}) {
    const { rows: personal } = await db.query(`
      SELECT 
        p.ci, p.complemento, e.sigla as expedicion,
        p.apellido_paterno, p.apellido_materno, p.apellido_casada,
        p.primer_nombre, p.segundo_nombre, p.tercer_nombre,
        p.fecha_nacimiento, prof.nombre_profesion, p.telefono,
        p.estado, p.fecha_baja,
        vl.identificador_laboral, vl.cargo_actual, vl.cargo_planilla,
        vl.cargo_escala, vl.nro_resumen_ejecutivo,
        vl.unidad_servicio, vl.carga_horaria,
        vl.fecha_ingreso, vl.fecha_fin_contrato, vl.fecha_institucionalizacion,
        vl.observaciones,
        ff.nombre_fuente, tp.nombre_tipo as tipo_personal,
        est.nombre_establecimiento
      FROM personal p
      LEFT JOIN cat_expediciones e ON p.exp_id = e.id
      LEFT JOIN cat_profesiones prof ON p.profesion_id = prof.id
      LEFT JOIN vinculos_laborales vl ON p.id = vl.personal_id
      LEFT JOIN cat_fuentes_financiamiento ff ON vl.fuente_financiamiento_id = ff.id
      LEFT JOIN cat_tipos_personal tp ON vl.tipo_personal_id = tp.id
      LEFT JOIN establecimientos est ON vl.establecimiento_id = est.id
      WHERE 1=1
        ${filters.estado && filters.estado !== 'TODOS' ? `AND p.estado = '${filters.estado}'` : ''}
        ${filters.fuente_id ? `AND vl.fuente_financiamiento_id = ${filters.fuente_id}` : ''}
        ${filters.tipo_id ? `AND vl.tipo_personal_id = ${filters.tipo_id}` : ''}
        ${filters.unidad_id ? `AND vl.unidad_servicio_id = ${filters.unidad_id}` : ''}
      ORDER BY p.apellido_paterno, p.primer_nombre
    `);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventario Personal HBM');

    worksheet.columns = [
      { header: 'N° C.I.', key: 'ci', width: 12 },
      { header: 'COMPLEMENTO', key: 'complemento', width: 10 },
      { header: 'EXP', key: 'expedicion', width: 6 },
      { header: 'APELLIDO PATERNO', key: 'apellido_paterno', width: 20 },
      { header: 'APELLIDO MATERNO', key: 'apellido_materno', width: 20 },
      { header: 'APELLIDO DE CASADA', key: 'apellido_casada', width: 18 },
      { header: '1ER. NOMBRE', key: 'primer_nombre', width: 18 },
      { header: '2DO. NOMBRE', key: 'segundo_nombre', width: 18 },
      { header: '3ER. NOMBRE', key: 'tercer_nombre', width: 18 },
      { header: 'FECHA DE NACIMIENTO', key: 'fecha_nacimiento', width: 16 },
      { header: 'PROFESION', key: 'nombre_profesion', width: 25 },
      { header: 'TELEFONO', key: 'telefono', width: 14 },
      { header: 'ESTADO', key: 'estado', width: 10 },
      { header: 'N° ITEM / CONTRATO', key: 'identificador_laboral', width: 16 },
      { header: 'FUENTE DE FINANCIAMIENTO', key: 'nombre_fuente', width: 20 },
      { header: 'TIPO PERSONAL', key: 'tipo_personal', width: 14 },
      { header: 'CARGO ACTUAL', key: 'cargo_actual', width: 30 },
      { header: 'CARGO SEGÚN PLANILLA', key: 'cargo_planilla', width: 30 },
      { header: 'CARGO SEGÚN ESCALA', key: 'cargo_escala', width: 25 },
      { header: 'N° RESUMEN EJECUTIVO', key: 'nro_resumen_ejecutivo', width: 20 },
      { header: 'UNIDAD O SERVICIO', key: 'unidad_servicio', width: 30 },
      { header: 'CARGA HORARIA', key: 'carga_horaria', width: 14 },
      { header: 'FECHA DE INGRESO', key: 'fecha_ingreso', width: 16 },
      { header: 'FECHA FIN CONTRATO', key: 'fecha_fin_contrato', width: 18 },
      { header: 'FECHA INSTITUCIONALIZACION', key: 'fecha_institucionalizacion', width: 22 },
      { header: 'OBSERVACIONES', key: 'observaciones', width: 30 },
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFF' }, size: 10 };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2563EB' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = {
        top: { style: 'thin' }, bottom: { style: 'thin' },
        left: { style: 'thin' }, right: { style: 'thin' }
      };
    });
    headerRow.height = 30;

    worksheet.getRow(2).values = ['INVENTARIO PERSONAL HBM - HOSPITAL DE SEGUNDO NIVEL BARRIOS MINEROS'];
    worksheet.mergeCells('A2:Z2');
    const titleRow = worksheet.getRow(2);
    titleRow.font = { bold: true, size: 14, color: { argb: '1E293B' } };
    titleRow.alignment = { horizontal: 'center' };
    titleRow.height = 25;

    worksheet.getRow(3).values = [`Generado: ${new Date().toLocaleString('es-BO')}` + (filters.estado ? ` | Estado: ${filters.estado}` : '')];
    worksheet.mergeCells('A3:Z3');
    const subtitleRow = worksheet.getRow(3);
    subtitleRow.font = { size: 10, color: { argb: '64748B' } };
    subtitleRow.alignment = { horizontal: 'left' };

    personal.forEach(p => {
      worksheet.addRow({
        ci: p.ci,
        complemento: p.complemento || '',
        expedicion: p.expedicion || '',
        apellido_paterno: p.apellido_paterno || '',
        apellido_materno: p.apellido_materno || '',
        apellido_casada: p.apellido_casada || '',
        primer_nombre: p.primer_nombre || '',
        segundo_nombre: p.segundo_nombre || '',
        tercer_nombre: p.tercer_nombre || '',
        fecha_nacimiento: this.formatDate(p.fecha_nacimiento),
        nombre_profesion: p.nombre_profesion || '',
        telefono: p.telefono || '',
        estado: p.estado || 'ACTIVO',
        identificador_laboral: p.identificador_laboral || '',
        nombre_fuente: p.nombre_fuente || '',
        tipo_personal: p.tipo_personal || '',
        cargo_actual: p.cargo_actual || '',
        cargo_planilla: p.cargo_planilla || '',
        cargo_escala: p.cargo_escala || '',
        nro_resumen_ejecutivo: p.nro_resumen_ejecutivo || '',
        unidad_servicio: p.unidad_servicio || '',
        carga_horaria: p.carga_horaria || '',
        fecha_ingreso: this.formatDate(p.fecha_ingreso),
        fecha_fin_contrato: this.formatDate(p.fecha_fin_contrato),
        fecha_institucionalizacion: this.formatDate(p.fecha_institucionalizacion),
        observaciones: p.observaciones || ''
      });
    });

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 3) {
        row.eachCell(cell => {
          cell.border = {
            top: { style: 'thin' }, bottom: { style: 'thin' },
            left: { style: 'thin' }, right: { style: 'thin' }
          };
          cell.alignment = { vertical: 'middle', wrapText: true };
        });
        row.height = 20;
        if (rowNumber % 2 === 0) {
          row.eachCell(cell => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F8FAFC' } };
          });
        }
      }
    });

    const totalRow = worksheet.addRow([]);
    totalRow.getCell(1).value = `Total: ${personal.length} registros`;
    totalRow.getCell(1).font = { bold: true, size: 10 };
    worksheet.mergeCells(`A${totalRow.number}:Z${totalRow.number}`);

    return await workbook.xlsx.writeBuffer();
  }

  static async generarContratosPorVencer(days = 30) {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + parseInt(days));

    const { rows: porVencer } = await db.query(`
      SELECT p.ci, p.complemento, e.sigla as expedicion,
             p.primer_nombre, p.apellido_paterno, p.apellido_materno,
             p.telefono, prof.nombre_profesion,
             vl.cargo_actual, vl.unidad_servicio, vl.identificador_laboral,
             vl.fecha_fin_contrato, vl.fecha_ingreso,
             ff.nombre_fuente, tp.nombre_tipo as tipo_personal
      FROM personal p
      JOIN vinculos_laborales vl ON p.id = vl.personal_id
      LEFT JOIN cat_expediciones e ON p.exp_id = e.id
      LEFT JOIN cat_profesiones prof ON p.profesion_id = prof.id
      LEFT JOIN cat_fuentes_financiamiento ff ON vl.fuente_financiamiento_id = ff.id
      LEFT JOIN cat_tipos_personal tp ON vl.tipo_personal_id = tp.id
      WHERE p.estado = 'ACTIVO'
        AND vl.fecha_fin_contrato IS NOT NULL
        AND vl.fecha_fin_contrato <= $1
        AND vl.fecha_fin_contrato >= $2
      ORDER BY vl.fecha_fin_contrato ASC
    `, [futureDate.toISOString().split('T')[0], today.toISOString().split('T')[0]]);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Contratos por Vencer');

    worksheet.columns = [
      { header: 'N° C.I.', key: 'ci', width: 12 },
      { header: 'EXP', key: 'expedicion', width: 6 },
      { header: 'APELLIDO PATERNO', key: 'apellido_paterno', width: 20 },
      { header: 'APELLIDO MATERNO', key: 'apellido_materno', width: 20 },
      { header: '1ER. NOMBRE', key: 'primer_nombre', width: 18 },
      { header: 'PROFESION', key: 'nombre_profesion', width: 25 },
      { header: 'TELEFONO', key: 'telefono', width: 14 },
      { header: 'CARGO ACTUAL', key: 'cargo_actual', width: 30 },
      { header: 'UNIDAD O SERVICIO', key: 'unidad_servicio', width: 30 },
      { header: 'FUENTE', key: 'nombre_fuente', width: 14 },
      { header: 'TIPO', key: 'tipo_personal', width: 12 },
      { header: 'FECHA INGRESO', key: 'fecha_ingreso', width: 16 },
      { header: 'FECHA FIN CONTRATO', key: 'fecha_fin_contrato', width: 18 },
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFF' }, size: 10 };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F59E0B' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    });

    worksheet.getRow(2).values = ['CONTRATOS POR VENCER - Próximos ' + days + ' días'];
    worksheet.mergeCells('A2:M2');
    worksheet.getRow(2).font = { bold: true, size: 14 };
    worksheet.getRow(2).alignment = { horizontal: 'center' };

    porVencer.forEach(p => {
      worksheet.addRow({
        ci: p.ci, expedicion: p.expedicion || '',
        apellido_paterno: p.apellido_paterno, apellido_materno: p.apellido_materno,
        primer_nombre: p.primer_nombre, nombre_profesion: p.nombre_profesion || '',
        telefono: p.telefono || '', cargo_actual: p.cargo_actual || '',
        unidad_servicio: p.unidad_servicio || '', nombre_fuente: p.nombre_fuente || '',
        tipo_personal: p.tipo_personal || '',
        fecha_ingreso: this.formatDate(p.fecha_ingreso),
        fecha_fin_contrato: this.formatDate(p.fecha_fin_contrato)
      });
    });

    return await workbook.xlsx.writeBuffer();
  }

  static formatDate(dateVal) {
    if (!dateVal) return '';
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return dateVal;
    return d.toLocaleDateString('es-BO');
  }
}

module.exports = ReporteService;
