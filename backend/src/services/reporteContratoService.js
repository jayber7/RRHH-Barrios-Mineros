const db = require('../config/db');
const pdfMake = require('./pdfMakeSetup');
const ConfiguracionService = require('./configuracionService');
const CalculoAsistenciaService = require('./calculoAsistenciaService');
const TurnosService = require('./turnosService');

const ESTADO_LABELS = {
  1: 'Normal', 2: 'Atraso', 3: 'Justificado', 4: 'Falta',
  5: 'Nocturno', 6: 'Sobretiempo', 7: 'Sal. Adelantada', 8: 'Incompleta', 9: 'Sin Marcación',
};

const formatter = new Intl.DateTimeFormat('es-BO', {
  timeZone: 'America/La_Paz', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
});

function formatFechaHora(ts) {
  const p = Object.fromEntries(formatter.formatToParts(new Date(ts)).map(x => [x.type, x.value]));
  return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`;
}

function nombreCompleto(p) {
  return [p.primer_nombre, p.segundo_nombre, p.apellido_paterno, p.apellido_materno]
    .filter(Boolean).join(' ').toUpperCase();
}

class ReporteContratoService {
  static async _getTipoContrato(personalId) {
    const { rows } = await db.query(`
      SELECT tp.nombre_tipo as tipo_contrato
      FROM vinculos_laborales vl
      LEFT JOIN cat_tipos_personal tp ON tp.id = vl.tipo_personal_id
      WHERE vl.personal_id = $1
      LIMIT 1
    `, [personalId]);
    return rows[0]?.tipo_contrato || 'SIN DEFINIR';
  }

  static async _getTolerancia(tipoContrato) {
    const mapa = await ConfiguracionService.get('tolerancia_atraso_por_tipo_contrato', null);
    if (mapa && typeof mapa === 'object') {
      const norm = (s) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
      const key = norm(tipoContrato);
      const found = Object.entries(mapa).find(([k]) => norm(k) === key);
      if (found && Number.isFinite(Number(found[1]))) return Number(found[1]);
    }
    return await ConfiguracionService.get('tolerancia_atraso_default', 5);
  }

  static async _getBiometriaDia(personalId, fecha) {
    const { rows } = await db.query(`
      SELECT to_char(MIN(timestamp AT TIME ZONE 'America/La_Paz'), 'HH24:MI') as primera,
             to_char(MAX(timestamp AT TIME ZONE 'America/La_Paz'), 'HH24:MI') as ultima,
             COUNT(*) as n
      FROM biometrico_logs_raw
      WHERE biometrico_id = (SELECT biometrico_id FROM personal WHERE id = $1)
        AND timestamp >= $2::date AT TIME ZONE 'America/La_Paz' - interval '12 hours'
        AND timestamp < ($2::date AT TIME ZONE 'America/La_Paz') + interval '1 day' + interval '12 hours'
    `, [personalId, fecha]);
    return rows[0];
  }

  static async _getDatosEmpleado(personalId, desde, hasta) {
    const { rows } = await db.query(`
      SELECT id, ci, complemento, primer_nombre, apellido_paterno, apellido_materno, biometrico_id
      FROM personal WHERE id = $1
    `, [personalId]);
    if (rows.length === 0) return null;

    const tipoContrato = await this._getTipoContrato(personalId);
    const tolerancia = await this._getTolerancia(tipoContrato);

    const filas = [];
    let totalAtrasos = 0, diasAtraso = 0, faltas = 0;

    const d = new Date(`${desde}T00:00:00`);
    const fin = new Date(`${hasta}T00:00:00`);
    for (; d <= fin; d.setDate(d.getDate() + 1)) {
      const fecha = d.toISOString().split('T')[0];
      const estado = await CalculoAsistenciaService.calcularEstadoDiario(personalId, fecha, tolerancia);
      const bio = await this._getBiometriaDia(personalId, fecha);
      const turno = await TurnosService.getTurnoEmpleado(personalId, fecha);

      const diaSemana = d.getDay();
      const diasMap = { 1: 'lunes', 2: 'martes', 3: 'miercoles', 4: 'jueves', 5: 'viernes', 6: 'sabado', 0: 'domingo' };
      const diaCol = diasMap[diaSemana];

      const atraso = estado.minutos_atraso || 0;
      totalAtrasos += atraso;
      if (atraso > 0) diasAtraso++;
      if (estado.estado === 4 || estado.estado === 9) faltas++;

      filas.push({
        fecha,
        entrada: turno ? turno[`${diaCol}_entrada`] || '--' : '--',
        salida: turno ? turno[`${diaCol}_salida`] || '--' : '--',
        marca_entrada: bio?.primera || '--',
        marca_salida: bio?.ultima || '--',
        atraso: atraso > 0 ? atraso : '--',
        estado: ESTADO_LABELS[estado.estado] || estado.estado,
      });
    }

    return {
      personal: rows[0],
      tipoContrato,
      tolerancia,
      filas,
      totalAtrasos,
      diasAtraso,
      faltas,
    };
  }

  static async generarPDF({ ids, desde, hasta }) {
    const tablas = [];
    let primera = true;

    for (const id of ids) {
      const data = await this._getDatosEmpleado(id, desde, hasta);
      if (!data) continue;

      const body = [];
      if (primera) {
        body.push([
          { text: 'Fecha', style: 'celda', bold: true },
          { text: 'Entrada', style: 'celda', bold: true },
          { text: 'Salida', style: 'celda', bold: true },
          { text: 'Marca Ent.', style: 'celda', bold: true },
          { text: 'Marca Sal.', style: 'celda', bold: true },
          { text: 'Atraso (min)', style: 'celda', bold: true },
          { text: 'Estado', style: 'celda', bold: true },
        ]);
      }

      for (const f of data.filas) {
        body.push([
          { text: f.fecha, style: 'celda' },
          { text: f.entrada, style: 'celda' },
          { text: f.salida, style: 'celda' },
          { text: f.marca_entrada, style: 'celda' },
          { text: f.marca_salida, style: 'celda' },
          { text: String(f.atraso), style: 'celda', alignment: 'right' },
          { text: f.estado, style: 'celda' },
        ]);
      }

      body.push([
        { text: 'TOTALES', colSpan: 6, style: 'celda', bold: true },
        {}, {}, {}, {}, {},
        { text: String(data.totalAtrasos), style: 'celda', bold: true, alignment: 'right' },
      ]);

      tablas.push({
        table: {
          widths: [64, 50, 50, 54, 54, 62, '*'],
          body: [
            [{ text: `${data.personal.ci} ${data.personal.complemento || ''}  ${nombreCompleto(data.personal)}  ·  ${data.personal.biometrico_id ?? ''}`, colSpan: 7, style: 'nombre' }, {}, {}, {}, {}, {}, {}],
            [{ text: `Tipo de Contrato: ${data.tipoContrato}   |   Tolerancia: ${data.tolerancia} min`, colSpan: 7, style: 'celda' }, {}, {}, {}, {}, {}, {}],
            [{ text: `Días con atraso: ${data.diasAtraso}   |   Faltas: ${data.faltas}`, colSpan: 7, style: 'celda' }, {}, {}, {}, {}, {}, {}],
            ...body,
          ]
        },
        layout: {
          hLineWidth: () => 0.75, vLineWidth: () => 0.75,
          hLineColor: () => '#000000', vLineColor: () => '#000000',
          paddingLeft: () => 3, paddingRight: () => 3,
          paddingTop: () => 3.2, paddingBottom: () => 3.2
        },
        pageBreak: primera ? undefined : 'before',
      });

      primera = false;
    }

    const anchoPagina = 595.28;

    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [36, 85.5, 36, 50],
      defaultStyle: { font: 'LiberationSans' },
      header: {
        margin: [0, 46.2, 0, 0],
        stack: [
          { text: 'Reporte de Eventos Retrasos y faltas por Contrato', style: 'titulo', alignment: 'center' },
          { canvas: [{ type: 'line', x1: 36, y1: 0, x2: anchoPagina - 36, y2: 0, lineWidth: 1.56, lineColor: '#000000' }], margin: [0, 11.3, 0, 0] }
        ]
      },
      content: tablas,
      footer: (currentPage, pageCount) => ({
        columns: [
          { text: `Página: ${currentPage} / ${pageCount}`, style: 'pieIzquierdo' },
          { text: `Fecha / Hora: ${formatFechaHora(new Date())}`, style: 'pieDerecho' }
        ]
      }),
      styles: {
        titulo: { fontSize: 18, bold: true, color: '#000000' },
        nombre: { fontSize: 9.72, bold: true, color: '#000000' },
        celda: { fontSize: 9.72, color: '#000000' },
        pieIzquierdo: { fontSize: 9.72, alignment: 'left', margin: [0, 1, 0, 0] },
        pieDerecho: { fontSize: 8.28, bold: true, alignment: 'right', margin: [0, 1, 0, 0] }
      }
    };

    if (!tablas.length) {
      docDefinition.content.push({
        text: 'Sin registros en el rango seleccionado', fontSize: 9.72, alignment: 'center', margin: [0, 24, 0, 0]
      });
    }

    const doc = pdfMake.createPdf(docDefinition);
    return doc.getBuffer();
  }
}

module.exports = ReporteContratoService;
