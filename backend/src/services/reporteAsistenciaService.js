const ExcelJS = require('exceljs');
const db = require('../config/db');

const ESTADO_LABELS = {
  1: 'Normal', 2: 'Atraso', 3: 'Justificado', 4: 'Falta',
  5: 'Nocturno', 6: 'Sobretiempo', 7: 'Sal. Adelantada', 8: 'Incompleta', 9: 'Sin Marcación',
};

class ReporteAsistenciaService {
  static async generarReporteMensualEmpleado(mes, anio, tipoPlanilla = null) {
    const empleados = await this._getEmpleadosConAsistencia(mes, anio, tipoPlanilla);
    const workbook = new ExcelJS.Workbook();

    for (const emp of empleados) {
      const biometria = await this._getBiometriaDiaria(emp.personal_id, mes, anio);
      const turnos = await this._getTurnosDiarios(emp.personal_id, mes, anio);
      const diario = await this._getAsistenciaDiaria(emp.asistencia_id);
      const sheetName = (emp.apellido_paterno || emp.primer_nombre || 'EMP').substring(0, 12).replace(/[\/\\*?\[\]]/g, '') + '_' + emp.ci;
      const hoja = workbook.addWorksheet(sheetName, { views: [{ state: 'frozen', ySplit: 7 }] }
      );

      const nombreCompleto = [emp.primer_nombre, emp.segundo_nombre, emp.apellido_paterno, emp.apellido_materno]
        .filter(Boolean).join(' ');

      this._styleHeader(hoja, [
        `REPORTE MENSUAL DE ASISTENCIA - ${mes}/${anio}`,
        `HOSPITAL DE SEGUNDO NIVEL BARRIOS MINEROS`,
        '',
        `EMPLEADO: ${nombreCompleto}`,
        `C.I.: ${emp.ci} ${emp.complemento || ''} ${emp.expedicion || ''}`,
        `CARGO: ${emp.cargo_actual || ''}  |  ITEM: ${emp.identificador_laboral || ''}  |  FUENTE: ${emp.nombre_fuente || ''}`,
        ''
      ]);

      hoja.columns = [
        { header: 'Día', key: 'dia', width: 6 },
        { header: 'Fecha', key: 'fecha', width: 12 },
        { header: 'Horario Entrada', key: 'horario_entrada', width: 18 },
        { header: 'Horario Salida', key: 'horario_salida', width: 18 },
        { header: 'Marca Entrada', key: 'marca_entrada', width: 16 },
        { header: 'Marca Salida', key: 'marca_salida', width: 16 },
        { header: 'Atraso (min)', key: 'atrasos', width: 14 },
        { header: 'Horas Trab.', key: 'horas_trabajadas', width: 12 },
        { header: 'Extra (min)', key: 'extra', width: 12 },
        { header: 'Adelanto (min)', key: 'adelanto', width: 14 },
        { header: 'Estado', key: 'estado', width: 16 },
        { header: 'Justificación', key: 'justificacion', width: 22 },
      ];

      let totalAtrasos = 0, totalHoras = 0, totalExtras = 0, totalAdelantos = 0;

      for (let dia = 1; dia <= 31; dia++) {
        const fecha = `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        const fechaDate = new Date(fecha);
        if (fechaDate.getMonth() + 1 !== mes) continue;

        const b = biometria[dia] || {};
        const t = turnos[dia] || {};
        const ad = diario[dia] || {};

        const entradaReal = this._getBiometricMark(b.min_marca, b.n_marcas, 'in');
        const salidaReal = this._getBiometricMark(b.max_marca, b.n_marcas, 'out', t.horario_entrada, t.horario_salida);
        const atrasos = ad.minutos_atraso || 0;
        const horasTrab = this._calcularHoras(entradaReal, salidaReal, t.horario_entrada, t.horario_salida);
        const extra = this._calcularExtras(entradaReal, salidaReal, t.horario_entrada, t.horario_salida);
        const adelanto = this._calcularAdelanto(entradaReal, salidaReal, t.horario_salida);

        totalAtrasos += atrasos;
        totalHoras += horasTrab;
        totalExtras += extra;
        totalAdelantos += adelanto;

        hoja.addRow({
          dia,
          fecha: `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${anio}`,
          horario_entrada: t.horario_entrada || '--',
          horario_salida: t.horario_salida || '--',
          marca_entrada: entradaReal || '--',
          marca_salida: salidaReal || '--',
          atrasos: atrasos || '--',
          horas_trabajadas: horasTrab > 0 ? horasTrab.toFixed(2) : '--',
          extra: extra > 0 ? extra : '--',
          adelanto: adelanto > 0 ? adelanto : '--',
          estado: ESTADO_LABELS[ad.estado] || '--',
          justificacion: ad.motivo_justificacion || (ad.justificacion_tipo ? ad.justificacion_tipo : ''),
        });
      }

      hoja.addRow({});
      const totalRow = hoja.addRow({
        dia: '',
        fecha: 'TOTALES',
        atrasos: totalAtrasos,
        horas_trabajadas: totalHoras.toFixed(2),
        extra: totalExtras,
        adelanto: totalAdelantos,
      });
      totalRow.eachCell(c => { c.font = { bold: true, size: 11 }; });

      this._styleTable(hoja, 8, 7 + 31);
    }

    return await workbook.xlsx.writeBuffer();
  }

  static async generarPlanillaConsolidada(mes, anio, tipoPlanilla = null) {
    const empleados = await this._getEmpleadosConAsistencia(mes, anio, tipoPlanilla);
    const workbook = new ExcelJS.Workbook();
    const hoja = workbook.addWorksheet('Planilla ' + (tipoPlanilla || 'TODOS'));

    hoja.getRow(1).values = [
      `PLANILLA CONSOLIDADA DE ASISTENCIA - ${mes}/${anio}`,
      ...Array(8).fill(''),
      `HOSPITAL BARRIOS MINEROS`,
    ];
    hoja.mergeCells('A1:I1');
    hoja.getRow(1).font = { bold: true, size: 14 };
    hoja.getRow(1).alignment = { horizontal: 'center' };

    const columns = [
      { header: '#', key: 'nro', width: 4 },
      { header: 'C.I.', key: 'ci', width: 14 },
      { header: 'EMPLEADO', key: 'nombre', width: 30 },
      { header: 'CARGO', key: 'cargo', width: 22 },
      { header: 'ITEM', key: 'item', width: 14 },
      { header: 'FUENTE', key: 'fuente', width: 14 },
      { header: 'PLANILLA', key: 'planilla', width: 12 },
      { header: 'TOTAL HORAS', key: 'total_horas', width: 12 },
      { header: 'TOTAL ATRASOS', key: 'total_atrasos', width: 14 },
    ];

    for (let d = 1; d <= 31; d++) {
      columns.push({ header: String(d), key: `d${d}`, width: 5 });
    }

    hoja.columns = columns;

    const headerRow = hoja.getRow(2);
    headerRow.eachCell(c => {
      c.font = { bold: true, color: { argb: 'FFFFFF' }, size: 9 };
      c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2563EB' } };
      c.alignment = { vertical: 'middle', horizontal: 'center' };
      c.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    });
    headerRow.height = 20;

    let nro = 0;
    for (const emp of empleados) {
      nro++;
      const diario = await this._getAsistenciaDiaria(emp.asistencia_id);
      const nombreCompleto = [emp.primer_nombre, emp.segundo_nombre, emp.apellido_paterno, emp.apellido_materno]
        .filter(Boolean).join(' ');

      const rowData = {
        nro, ci: emp.ci,
        nombre: nombreCompleto,
        cargo: emp.cargo_actual || '',
        item: emp.identificador_laboral || '',
        fuente: emp.nombre_fuente || '',
        planilla: emp.tipo_planilla || '',
        total_horas: emp.total_horas || 0,
        total_atrasos: emp.total_atrasos_min || 0,
      };

      for (let d = 1; d <= 31; d++) {
        const ad = diario[d];
        if (ad) {
          let val = '';
          if (ad.estado === 1) val = 'P';
          else if (ad.estado === 2) val = `A${ad.minutos_atraso > 0 ? ad.minutos_atraso : ''}`;
          else if (ad.estado === 3) val = 'J';
          else if (ad.estado === 4) val = 'F';
          else if (ad.estado === 5) val = 'N';
          else if (ad.estado === 7) val = 'SA';
          else if (ad.estado === 8) val = 'I';
          else if (ad.estado === 9) val = 'SM';
          else val = String(ad.estado);
          rowData[`d${d}`] = val;
        } else {
          rowData[`d${d}`] = '';
        }
      }

      hoja.addRow(rowData);
    }

    this._styleTable(hoja, 2, 2 + empleados.length);
    return await workbook.xlsx.writeBuffer();
  }

  static async generarReporteAtrasos(mes, anio, topN = 50, tipoPlanilla = null) {
    const params = [mes, anio];
    let tipoFilter = '';
    if (tipoPlanilla) {
      tipoFilter = ' AND am.tipo_planilla = $3';
      params.push(tipoPlanilla);
    }

    const { rows: atrasos } = await db.query(`
      SELECT 
        p.id as personal_id, p.ci, p.complemento, e.sigla as expedicion,
        p.primer_nombre, p.segundo_nombre, p.apellido_paterno, p.apellido_materno,
        vl.cargo_actual, vl.identificador_laboral, ff.nombre_fuente,
        vl.unidad_servicio, tp.nombre_tipo as tipo_personal,
        am.tipo_planilla,
        am.total_horas, am.total_atrasos_min,
        COUNT(ad.id) FILTER (WHERE ad.estado = 2) as dias_con_atraso,
        COUNT(ad.id) FILTER (WHERE ad.estado = 4 OR ad.estado = 9) as dias_falta,
        COUNT(ad.id) FILTER (WHERE ad.estado = 7) as dias_salida_adelantada,
        COUNT(ad.id) FILTER (WHERE ad.estado = 8) as dias_incompleta
      FROM asistencia_mensual am
      JOIN personal p ON am.personal_id = p.id
      LEFT JOIN cat_expediciones e ON p.exp_id = e.id
      LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id
      LEFT JOIN cat_fuentes_financiamiento ff ON vl.fuente_financiamiento_id = ff.id
      LEFT JOIN cat_tipos_personal tp ON vl.tipo_personal_id = tp.id
      LEFT JOIN asistencia_diaria ad ON ad.asistencia_id = am.id
      WHERE am.mes = $1 AND am.anio = $2 ${tipoFilter}
      GROUP BY p.id, e.sigla, vl.cargo_actual, vl.identificador_laboral, ff.nombre_fuente,
               vl.unidad_servicio, tp.nombre_tipo, am.tipo_planilla, am.total_horas, am.total_atrasos_min
      ORDER BY am.total_atrasos_min DESC
      LIMIT ${parseInt(topN)}
    `, params);

    const workbook = new ExcelJS.Workbook();
    const hoja = workbook.addWorksheet('Atrasos');

    hoja.getRow(1).values = [`REPORTE DE ATRASOS - ${mes}/${anio} - Top ${topN}`];
    hoja.mergeCells('A1:L1');
    hoja.getRow(1).font = { bold: true, size: 14 };
    hoja.getRow(1).alignment = { horizontal: 'center' };

    hoja.columns = [
      { header: '#', key: 'nro', width: 4 },
      { header: 'C.I.', key: 'ci', width: 14 },
      { header: 'EMPLEADO', key: 'nombre', width: 30 },
      { header: 'CARGO', key: 'cargo', width: 22 },
      { header: 'ITEM', key: 'item', width: 14 },
      { header: 'FUENTE', key: 'fuente', width: 14 },
      { header: 'UNIDAD/SERVICIO', key: 'unidad', width: 20 },
      { header: 'TIPO', key: 'tipo', width: 14 },
      { header: 'TOTAL ATRASOS (min)', key: 'total_atrasos', width: 18 },
      { header: 'DÍAS C/ATRASO', key: 'dias_atraso', width: 16 },
      { header: 'FALTAS', key: 'faltas', width: 10 },
      { header: 'SAL.ADEL.', key: 'sal_adel', width: 10 },
    ];

    const headerRow = hoja.getRow(2);
    headerRow.eachCell(c => {
      c.font = { bold: true, color: { argb: 'FFFFFF' }, size: 9 };
      c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F59E0B' } };
      c.alignment = { vertical: 'middle', horizontal: 'center' };
      c.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    });
    headerRow.height = 20;

    atrasos.forEach((a, i) => {
      const nombre = [a.primer_nombre, a.segundo_nombre, a.apellido_paterno, a.apellido_materno]
        .filter(Boolean).join(' ');
      hoja.addRow({
        nro: i + 1, ci: `${a.ci} ${a.complemento || ''} ${a.expedicion || ''}`,
        nombre, cargo: a.cargo_actual || '', item: a.identificador_laboral || '',
        fuente: a.nombre_fuente || '', unidad: a.unidad_servicio || '',
        tipo: a.tipo_planilla || '',
        total_atrasos: a.total_atrasos_min,
        dias_atraso: a.dias_con_atraso,
        faltas: a.dias_falta,
        sal_adel: a.dias_salida_adelantada,
      });
    });

    this._styleTable(hoja, 2, 2 + atrasos.length);
    return await workbook.xlsx.writeBuffer();
  }

  static async generarReporteSanciones(mes, anio, tipoPlanilla = null) {
    const { rows: empleados } = await db.query(`
      SELECT 
        am.id as asistencia_id, p.id as personal_id, p.ci, p.complemento, e.sigla as expedicion,
        p.primer_nombre, p.segundo_nombre, p.apellido_paterno, p.apellido_materno,
        vl.cargo_actual, vl.identificador_laboral, ff.nombre_fuente,
        vl.unidad_servicio, am.tipo_planilla, am.total_horas, am.total_atrasos_min,
        COALESCE(ads.total_faltas, 0) as total_faltas,
        c.haber_basico
      FROM asistencia_mensual am
      JOIN personal p ON am.personal_id = p.id
      LEFT JOIN cat_expediciones e ON p.exp_id = e.id
      LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id
      LEFT JOIN cat_fuentes_financiamiento ff ON vl.fuente_financiamiento_id = ff.id
      LEFT JOIN LATERAL (
        SELECT haber_basico FROM contratos
        WHERE personal_id = p.id
        ORDER BY fecha_inicio DESC NULLS LAST
        LIMIT 1
      ) c ON true
      LEFT JOIN (
        SELECT asistencia_id,
               COUNT(*) FILTER (WHERE estado = 4 OR estado = 9) as total_faltas
        FROM asistencia_diaria GROUP BY asistencia_id
      ) ads ON ads.asistencia_id = am.id
      WHERE am.mes = $1 AND am.anio = $2
      ${tipoPlanilla ? 'AND am.tipo_planilla = $3' : ''}
      ORDER BY am.total_atrasos_min DESC
    `, tipoPlanilla ? [mes, anio, tipoPlanilla] : [mes, anio]);

    const { rows: sancAtrasos } = await db.query('SELECT * FROM sanciones_atrasos ORDER BY rango_inicial');
    const { rows: sancFaltas } = await db.query('SELECT * FROM sanciones_faltas ORDER BY rango_inicial');

    const workbook = new ExcelJS.Workbook();
    const hoja = workbook.addWorksheet('Sanciones');

    hoja.getRow(1).values = [`REPORTE DE SANCIONES - ${mes}/${anio}`];
    hoja.mergeCells('A1:N1');
    hoja.getRow(1).font = { bold: true, size: 14 };
    hoja.getRow(1).alignment = { horizontal: 'center' };

    hoja.columns = [
      { header: '#', key: 'nro', width: 4 },
      { header: 'C.I.', key: 'ci', width: 14 },
      { header: 'EMPLEADO', key: 'nombre', width: 28 },
      { header: 'CARGO', key: 'cargo', width: 20 },
      { header: 'ITEM', key: 'item', width: 12 },
      { header: 'HABER', key: 'haber', width: 14 },
      { header: 'TOTAL ATRASOS (min)', key: 'atrasos', width: 16 },
      { header: 'RANGO ATRASO', key: 'rango_atraso', width: 16 },
      { header: 'MULTA ATRASO', key: 'multa_atraso', width: 14 },
      { header: 'FALTAS (días)', key: 'faltas', width: 14 },
      { header: 'RANGO FALTA', key: 'rango_falta', width: 16 },
      { header: 'MULTA FALTA', key: 'multa_falta', width: 14 },
      { header: 'MULTA TOTAL', key: 'multa_total', width: 14 },
    ];

    const headerRow = hoja.getRow(2);
    headerRow.eachCell(c => {
      c.font = { bold: true, color: { argb: 'FFFFFF' }, size: 9 };
      c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DC2626' } };
      c.alignment = { vertical: 'middle', horizontal: 'center' };
      c.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    });
    headerRow.height = 20;

    empleados.forEach((emp, i) => {
      const nombre = [emp.primer_nombre, emp.segundo_nombre, emp.apellido_paterno, emp.apellido_materno]
        .filter(Boolean).join(' ');
      const diario = emp.haber_basico ? emp.haber_basico / 30 : 0;
      const sancionA = this._aplicarSancion(emp.total_atrasos_min || 0, sancAtrasos);
      const sancionF = this._aplicarSancion(emp.total_faltas || 0, sancFaltas);
      const multaA = sancionA ? (diario * parseFloat(sancionA.factor)) : 0;
      const multaF = sancionF ? (diario * parseFloat(sancionF.factor)) : 0;

      hoja.addRow({
        nro: i + 1,
        ci: `${emp.ci} ${emp.complemento || ''} ${emp.expedicion || ''}`,
        nombre, cargo: emp.cargo_actual || '', item: emp.identificador_laboral || '',
        haber: emp.haber_basico || 0,
        atrasos: emp.total_atrasos_min || 0,
        rango_atraso: sancionA ? sancionA.sancion_desc : 'Sin sanción',
        multa_atraso: multaA,
        faltas: emp.total_faltas || 0,
        rango_falta: sancionF ? sancionF.sancion_desc : 'Sin sanción',
        multa_falta: multaF,
        multa_total: multaA + multaF,
      });
    });

    this._styleTable(hoja, 2, 2 + empleados.length);
    return await workbook.xlsx.writeBuffer();
  }

  static async _getEmpleadosConAsistencia(mes, anio, tipoPlanilla) {
    let query = `
      SELECT am.id as asistencia_id, p.id as personal_id, p.ci, p.complemento, e.sigla as expedicion,
             p.primer_nombre, p.segundo_nombre, p.apellido_paterno, p.apellido_materno,
             vl.cargo_actual, vl.identificador_laboral, ff.nombre_fuente,
             vl.unidad_servicio, am.tipo_planilla, am.total_horas, am.total_atrasos_min
      FROM asistencia_mensual am
      JOIN personal p ON am.personal_id = p.id
      LEFT JOIN cat_expediciones e ON p.exp_id = e.id
      LEFT JOIN vinculos_laborales vl ON vl.personal_id = p.id
      LEFT JOIN cat_fuentes_financiamiento ff ON vl.fuente_financiamiento_id = ff.id
      WHERE am.mes = $1 AND am.anio = $2
    `;
    const params = [mes, anio];
    if (tipoPlanilla) {
      query += ' AND am.tipo_planilla = $3';
      params.push(tipoPlanilla);
    }
    query += ' ORDER BY p.apellido_paterno, p.primer_nombre';
    const { rows } = await db.query(query, params);
    return rows;
  }

  static async _getBiometriaDiaria(personalId, mes, anio) {
    const { rows } = await db.query(`
      SELECT EXTRACT(DAY FROM blr.timestamp)::int as dia,
             count(*) as n_marcas,
             to_char(MIN(blr.timestamp), 'HH24:MI') as min_marca,
             to_char(MAX(blr.timestamp), 'HH24:MI') as max_marca
      FROM biometrico_logs_raw blr
      JOIN personal p ON p.biometrico_id::text = blr.biometrico_id::text
      WHERE p.id = $1
        AND blr.timestamp >= make_date($2, $3, 1) - interval '12 hours'
        AND blr.timestamp < make_date($2, $3, 1) + interval '1 month' + interval '12 hours'
      GROUP BY EXTRACT(DAY FROM blr.timestamp)
    `, [personalId, anio, mes]);

    const porDia = {};
    for (const r of rows) porDia[r.dia] = r;
    return porDia;
  }

  static async _getTurnosDiarios(personalId, mes, anio) {
    const { rows } = await db.query(`
      SELECT ta.fecha_inicio, ta.fecha_fin, tp.*
      FROM turnos_asignados ta
      JOIN turnos_plantilla tp ON tp.id = ta.turno_plantilla_id
      WHERE ta.personal_id = $1
        AND ta.fecha_inicio <= make_date($2, $3, 1) + interval '1 month'
        AND (ta.fecha_fin IS NULL OR ta.fecha_fin >= make_date($2, $3, 1))
    `, [personalId, anio, mes]);

    const fechaInicio = new Date(anio, mes - 1, 1);
    const fechaFin = new Date(anio, mes, 0);
    const porDia = {};

    const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

    for (let d = 1; d <= fechaFin.getDate(); d++) {
      const diaSemana = diasSemana[new Date(anio, mes - 1, d).getDay()];
      const entradaCol = `${diaSemana}_entrada`;
      const salidaCol = `${diaSemana}_salida`;
      const habilitadoCol = `${diaSemana}_habilitado`;

      for (const turno of rows) {
        const inicio = new Date(turno.fecha_inicio);
        const fin = turno.fecha_fin ? new Date(turno.fecha_fin) : new Date(2099, 11, 31);
        const fechaActual = new Date(anio, mes - 1, d);

        if (fechaActual >= inicio && fechaActual <= fin) {
          if (turno[habilitadoCol] !== false) {
            const entrada = turno[entradaCol] ? turno[entradaCol].substring(0, 5) : null;
            const salida = turno[salidaCol] ? turno[salidaCol].substring(0, 5) : null;
            if (entrada) {
              porDia[d] = { horario_entrada: entrada, horario_salida: salida || '' };
              break;
            }
          }
        }
      }

      if (!porDia[d]) porDia[d] = { horario_entrada: '--', horario_salida: '--' };
    }

    return porDia;
  }

  static async _getAsistenciaDiaria(asistenciaId) {
    const { rows } = await db.query(`
      SELECT ad.dia, ad.estado, ad.minutos_atraso, ad.justificacion_id,
             cm.detalle as motivo_justificacion, j.tipo as justificacion_tipo
      FROM asistencia_diaria ad
      LEFT JOIN justificaciones j ON ad.justificacion_id = j.id
      LEFT JOIN cat_motivos_justificacion cm ON j.motivo_id = cm.id
      WHERE ad.asistencia_id = $1
    `, [asistenciaId]);

    const porDia = {};
    for (const r of rows) porDia[r.dia] = r;
    return porDia;
  }

  static _getBiometricMark(marca, nMarcas, tipo, horarioEntrada, horarioSalida) {
    if (!marca || !nMarcas) return null;
    if (tipo === 'in') return marca;
    if (nMarcas === 1) return null;
    if (horarioEntrada && horarioSalida) {
      const esNocturno = this._timeToMin(horarioEntrada) >= this._timeToMin(horarioSalida);
      if (esNocturno) return marca;
    }
    return marca;
  }

  static _calcularHoras(entrada, salida, horarioEntrada, horarioSalida) {
    if (!entrada || !salida || !horarioEntrada || !horarioSalida) return 0;
    const entMin = this._timeToMin(entrada);
    const salMin = this._timeToMin(salida);
    const progEnt = this._timeToMin(horarioEntrada);
    const progSal = this._timeToMin(horarioSalida);
    if (salMin < entMin) return (salMin + 1440 - entMin) / 60;
    return (salMin - entMin) / 60;
  }

  static _calcularExtras(entrada, salida, horarioEntrada, horarioSalida) {
    if (!entrada || !salida || !horarioEntrada || !horarioSalida) return 0;
    const salMin = this._timeToMin(salida);
    const progSal = this._timeToMin(horarioSalida);
    let extra = salMin - progSal;
    if (extra < 0) extra = 0;
    return extra;
  }

  static _calcularAdelanto(entrada, salida, horarioSalida) {
    if (!salida || !horarioSalida) return 0;
    const salMin = this._timeToMin(salida);
    const progSal = this._timeToMin(horarioSalida);
    let adelanto = progSal - salMin;
    if (adelanto < 0) adelanto = 0;
    return adelanto;
  }

  static _timeToMin(t) {
    if (!t || t === '--') return 0;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + (m || 0);
  }

  static _aplicarSancion(valor, sanciones) {
    if (!valor || !sanciones) return null;
    for (const s of sanciones) {
      if (valor >= s.rango_inicial && valor <= s.rango_final) return s;
    }
    return null;
  }

  static _styleHeader(hoja, lines) {
    lines.forEach((text, i) => {
      const row = hoja.getRow(i + 1);
      row.getCell(1).value = text;
      if (i === 0) {
        row.font = { bold: true, size: 14 };
        row.alignment = { horizontal: 'center' };
      } else if (i >= 3) {
        row.font = { bold: true, size: 10 };
      }
      row.height = 20;
    });
  }

  static _styleTable(hoja, startRow, endRow) {
    for (let r = startRow; r <= endRow; r++) {
      const row = hoja.getRow(r);
      row.eachCell((c, colNum) => {
        c.border = {
          top: { style: 'thin' }, bottom: { style: 'thin' },
          left: { style: 'thin' }, right: { style: 'thin' }
        };
        c.alignment = { vertical: 'middle', wrapText: true, horizontal: colNum === 1 ? 'center' : 'left' };
      });
      if (r === startRow) {
        row.height = 20;
      } else if (r % 2 === 0) {
        row.eachCell(c => {
          c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F8FAFC' } };
        });
      }
    }
  }
}

module.exports = ReporteAsistenciaService;
