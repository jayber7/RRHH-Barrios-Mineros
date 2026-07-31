const path = require('path');
const fs = require('fs');
const pdfMake = require('pdfmake');
const vfs = require('pdfmake/build/vfs_fonts');
const BiometricoAsistenciaService = require('./biometricoAsistenciaService');

pdfMake.setUrlAccessPolicy(() => false);
pdfMake.setLocalAccessPolicy(() => false);

for (const [name, content] of Object.entries(vfs)) {
  pdfMake.virtualfs.writeFileSync(name, Buffer.from(content, 'base64'));
}

const FONT_DIR = path.join(__dirname, '..', '..', 'assets', 'fonts');
pdfMake.virtualfs.writeFileSync(
  'LiberationSans-Regular.ttf',
  fs.readFileSync(path.join(FONT_DIR, 'LiberationSans-Regular.ttf'))
);
pdfMake.virtualfs.writeFileSync(
  'LiberationSans-Bold.ttf',
  fs.readFileSync(path.join(FONT_DIR, 'LiberationSans-Bold.ttf'))
);

pdfMake.setFonts({
  LiberationSans: {
    normal: 'LiberationSans-Regular.ttf',
    bold: 'LiberationSans-Bold.ttf',
    italics: 'LiberationSans-Regular.ttf',
    bolditalics: 'LiberationSans-Bold.ttf'
  }
});

const fechaHoraFormatter = new Intl.DateTimeFormat('es-BO', {
  timeZone: 'America/La_Paz',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23'
});

function formatFechaHora(timestamp) {
  const parts = Object.fromEntries(
    fechaHoraFormatter.formatToParts(new Date(timestamp)).map((p) => [p.type, p.value])
  );
  return `${parts.day}/${parts.month}/${parts.year} ${parts.hour}:${parts.minute}`;
}

const ETIQUETAS_ESTADO = {
  0: 'Entrada',
  1: 'Salida',
  2: 'Salida Temporal',
  3: 'Regreso',
  4: 'Entrada Tiempo Extra',
  5: 'Salida Tiempo Extra'
};

function etiquetaEstado(estado) {
  return ETIQUETAS_ESTADO[estado] ?? 'Salida';
}

function formatNombre(personal) {
  return [personal.primer_nombre, personal.apellido_paterno]
    .filter(Boolean)
    .join(' ')
    .toUpperCase();
}

class ReporteEventosService {
  static async generarPDF({ ids, desde, hasta }) {
    const resultados = [];
    for (const id of ids) {
      const data = await BiometricoAsistenciaService.getDatosImpresion(id, desde, hasta);
      resultados.push(data);
    }

    const tablas = [];
    let primera = true;

    for (const r of resultados) {
      if (!r.marcaciones.length) continue;

      const filas = [];
      for (const m of r.marcaciones) {
        filas.push([
          { text: String(r.personal.biometrico_id ?? ''), style: 'celda' },
          { text: formatNombre(r.personal), style: 'celda' },
          { text: formatFechaHora(m.timestamp), style: 'celda' },
          { text: 'Normal', style: 'celda' },
          { text: etiquetaEstado(m.estado_asistencia), style: 'celda' }
        ]);
      }

      tablas.push({
        table: {
          widths: [73, 173, 90, 52, '*'],
          body: [
            ...(primera
              ? [[
                { text: 'ID', style: 'cabecera' },
                { text: 'Nombre', style: 'cabecera' },
                { text: 'Fecha / Hora', style: 'cabecera' },
                { text: 'Estado', style: 'cabecera' },
                { text: 'Tipo de Registro', style: 'cabecera' }
              ]]
              : []),
            ...filas
          ]
        },
        layout: {
          hLineWidth: () => 0.75,
          vLineWidth: () => 0.75,
          hLineColor: () => '#000000',
          vLineColor: () => '#000000',
          paddingLeft: () => 3,
          paddingRight: () => 3,
          paddingTop: () => 3.2,
          paddingBottom: () => 3.2
        },
        pageBreak: primera ? undefined : 'before'
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
          {
            text: 'Reporte de Eventos',
            style: 'titulo',
            alignment: 'center'
          },
          {
            canvas: [
              {
                type: 'line',
                x1: 36,
                y1: 0,
                x2: anchoPagina - 36,
                y2: 0,
                lineWidth: 1.56,
                lineColor: '#000000'
              }
            ],
            margin: [0, 11.3, 0, 0]
          }
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
        titulo: { fontSize: 20, bold: true, color: '#000000' },
        cabecera: { fontSize: 9.72, bold: true, color: '#000000' },
        celda: { fontSize: 9.72, color: '#000000' },
        pieIzquierdo: { fontSize: 9.72, alignment: 'left', margin: [0, 1, 0, 0] },
        pieDerecho: { fontSize: 8.28, bold: true, alignment: 'right', margin: [0, 1, 0, 0] }
      }
    };

    if (!tablas.length) {
      docDefinition.content.push({
        text: 'Sin registros en el rango seleccionado',
        fontSize: 9.72,
        alignment: 'center',
        margin: [0, 24, 0, 0]
      });
    }

    const doc = pdfMake.createPdf(docDefinition);
    return doc.getBuffer();
  }
}

module.exports = ReporteEventosService;
