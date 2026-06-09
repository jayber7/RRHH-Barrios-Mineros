import { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, Download, X, Calendar, Clock, Users,
  AlertTriangle
} from 'lucide-react';
import { API_BASE_URL, authFetch } from '../config/api';

const TIPO_TURNO = {
  manana:   { label: 'Mañana',   abbr: 'M',  bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-200',  dot: 'bg-blue-500' },
  tarde:    { label: 'Tarde',    abbr: 'T',  bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
  nocturno: { label: 'Noche',    abbr: 'N',  bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
  libre:    { label: 'Libre',    abbr: 'L',  bg: 'bg-emerald-100',text: 'text-emerald-700',border: 'border-emerald-200',dot: 'bg-emerald-500' },
  completo: { label: 'Completo', abbr: 'C',  bg: 'bg-cyan-100',   text: 'text-cyan-700',   border: 'border-cyan-200',   dot: 'bg-cyan-500' },
};

const DIAS = ['lunes','martes','miercoles','jueves','viernes','sabado','domingo'];
const DIAS_LABEL = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function getTipoTurno(row, diaSem) {
  if (!row[`${diaSem}_habilitado`]) return 'libre';
  if (row[`nocturno_${diaSem}`]) return 'nocturno';
  const entrada = row[`${diaSem}_entrada`];
  if (!entrada) return 'libre';
  const h = parseInt(entrada.toString().split(':')[0]);
  if (h < 13) return 'manana';
  if (h < 19) return 'tarde';
  return 'completo';
}

function formatTime(t) {
  if (!t) return '--:--';
  return t.toString().slice(0, 5);
}

function generateICS(data, mes, anio, plantillas) {
  const lines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//RRHH Barrios Mineros//ES','CALSCALE:GREGORIAN'];
  data.forEach(row => {
    const inicio = new Date(row.fecha_inicio);
    const fin = row.fecha_fin ? new Date(row.fecha_fin) : new Date(row.fecha_inicio);
    const diaSem = DIAS[inicio.getDay() === 0 ? 6 : inicio.getDay() - 1];
    const tt = getTipoTurno(row, diaSem);
    const turnoLabel = TIPO_TURNO[tt]?.label || 'Turno';
    for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
      const ds = DIAS[d.getDay() === 0 ? 6 : d.getDay() - 1];
      const ttl = getTipoTurno(row, ds);
      const tLabel = TIPO_TURNO[ttl]?.label || 'Turno';
      const ymd = d.toISOString().split('T')[0].replace(/-/g, '');
      const next = new Date(d); next.setDate(next.getDate() + 1);
      const ymdNext = next.toISOString().split('T')[0].replace(/-/g, '');
      const entrada = formatTime(row[`${ds}_entrada`]);
      const salida = formatTime(row[`${ds}_salida`]);
      lines.push('BEGIN:VEVENT');
      lines.push(`DTSTART;VALUE=DATE:${ymd}`);
      lines.push(`DTEND;VALUE=DATE:${ymdNext}`);
      lines.push(`SUMMARY:${tLabel} - ${row.primer_nombre} ${row.apellido_paterno}`);
      lines.push(`DESCRIPTION:${entrada} - ${salida}\\n${row.unidad_servicio || ''}`);
      lines.push('END:VEVENT');
    }
  });
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export default function TurnoCalendario({ plantillas }) {
  const now = new Date();
  const [mes, setMes] = useState(now.getMonth() + 1);
  const [anio, setAnio] = useState(now.getFullYear());
  const [servicio, setServicio] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [diaModal, setDiaModal] = useState(null);
  const [diaPersonal, setDiaPersonal] = useState([]);
  const [diaLoading, setDiaLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ mes, anio });
      if (servicio) params.set('servicio', servicio);
      const res = await authFetch(`${API_BASE_URL}/api/turnos/calendario?${params}`);
      const d = await res.json();
      setData(Array.isArray(d) ? d : []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [mes, anio, servicio]);

  const diasDelMes = new Date(anio, mes, 0).getDate();
  const primerDia = new Date(anio, mes - 1, 1).getDay();
  const hoy = new Date();

  const mesAnterior = () => { if (mes === 1) { setMes(12); setAnio(a => a - 1); } else setMes(m => m - 1); };
  const mesSiguiente = () => { if (mes === 12) { setMes(1); setAnio(a => a + 1); } else setMes(m => m + 1); };
  const irHoy = () => { setMes(now.getMonth() + 1); setAnio(now.getFullYear()); };

  const groupedByPersona = {};
  data.forEach(item => {
    const key = `${item.personal_id}`;
    if (!groupedByPersona[key]) {
      groupedByPersona[key] = { ...item, turnos: [] };
    }
    groupedByPersona[key].turnos.push(item);
  });

  function getTurnoForDay(person, dia) {
    const fecha = `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    const turno = person.turnos.find(t => {
      const inicio = t.fecha_inicio.slice(0, 10);
      const fin = t.fecha_fin ? t.fecha_fin.slice(0, 10) : inicio;
      return fecha >= inicio && fecha <= fin;
    });
    if (!turno) return null;
    const fechaObj = new Date(fecha);
    const diaSem = DIAS[fechaObj.getDay() === 0 ? 6 : fechaObj.getDay() - 1];
    const tipo = getTipoTurno(turno, diaSem);
    return { ...turno, tipo, diaSem, fecha };
  }

  const openDiaModal = async (dia) => {
    setDiaModal(dia);
    setDiaLoading(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/api/turnos/calendario/dia?mes=${mes}&anio=${anio}&dia=${dia}`);
      const d = await res.json();
      setDiaPersonal(Array.isArray(d) ? d : []);
    } catch (e) { setDiaPersonal([]); }
    setDiaLoading(false);
  };

  const handleDragStart = (e, personalId, dia) => {
    setDraggedItem({ personalId, dia });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${personalId}:${dia}`);
  };

  const handleDrop = async (e, targetDia) => {
    e.preventDefault();
    if (!draggedItem) return;
    const { personalId, dia: sourceDia } = draggedItem;
    if (sourceDia === targetDia) { setDraggedItem(null); return; }

    const person = groupedByPersona[personalId];
    if (!person) { setDraggedItem(null); return; }
    const sourceTurno = getTurnoForDay(person, sourceDia);
    if (!sourceTurno || sourceTurno.fecha_fin) { setDraggedItem(null); return; }

    const newFecha = `${anio}-${String(mes).padStart(2, '0')}-${String(targetDia).padStart(2, '0')}`;
    try {
      const res = await authFetch(`${API_BASE_URL}/api/turnos/asignados/${sourceTurno.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fecha_inicio: newFecha, fecha_fin: newFecha }),
      });
      if (res.ok) fetchData();
    } catch (e) { console.error(e); }
    setDraggedItem(null);
  };

  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };

  const exportICS = () => {
    const ics = generateICS(data, mes, anio, plantillas);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `turnos_${MESES[mes-1]}_${anio}.ics`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <button onClick={mesAnterior} className="p-2 hover:bg-slate-100 rounded-xl"><ChevronLeft size={20} /></button>
            <button onClick={irHoy}
              className="text-xs font-bold px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors mr-1"
            >Hoy</button>
            <h2 className="text-xl font-bold text-slate-700 min-w-[180px]">
              {MESES[mes-1]} {anio}
            </h2>
            <button onClick={mesSiguiente} className="p-2 hover:bg-slate-100 rounded-xl"><ChevronRight size={20} /></button>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <input type="text" placeholder="Filtrar servicio..." value={servicio}
              onChange={e => setServicio(e.target.value)}
              className="px-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-44" />
            <button onClick={exportICS}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors"
            ><Download size={15} /> ICS</button>
          </div>
        </div>

        <div className="flex gap-3 mb-5 flex-wrap text-xs">
          {Object.entries(TIPO_TURNO).map(([k, v]) => (
            <span key={k} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${v.bg} ${v.text} ${v.border} font-bold`}>
              <span className={`w-2 h-2 rounded-full ${v.dot}`} />
              {v.label}
            </span>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-400">Cargando calendario...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="px-3 py-2.5 text-left font-bold text-slate-500 uppercase sticky left-0 bg-white z-10 min-w-[140px]">Personal</th>
                  <th className="px-3 py-2.5 text-left font-bold text-slate-500 uppercase">Servicio</th>
                  <th className="px-3 py-2.5 text-center font-bold text-slate-500 uppercase min-w-[60px]">Turno</th>
                  {Array.from({ length: diasDelMes }, (_, i) => {
                    const d = new Date(anio, mes - 1, i + 1);
                    const esFinde = d.getDay() === 0 || d.getDay() === 6;
                    const esHoy = d.toDateString() === hoy.toDateString();
                    return (
                      <th key={i} className={`px-1.5 py-2 text-center text-[10px] font-bold min-w-[28px] ${
                        esHoy ? 'text-blue-600 bg-blue-50' : esFinde ? 'text-rose-400' : 'text-slate-500'
                      }`}>
                        {i + 1}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {Object.values(groupedByPersona).length === 0 ? (
                  <tr>
                    <td colSpan={3 + diasDelMes} className="text-center py-16 text-slate-300">
                      <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                      No hay turnos asignados para este mes
                    </td>
                  </tr>
                ) : (
                  Object.values(groupedByPersona).map(p => (
                    <tr key={p.personal_id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors group">
                      <td className="px-3 py-2 font-medium text-slate-700 sticky left-0 bg-white group-hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                            {p.primer_nombre?.[0]}{p.apellido_paterno?.[0]}
                          </div>
                          <span className="truncate">{p.primer_nombre} {p.apellido_paterno}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-slate-400 truncate max-w-[120px]">{p.unidad_servicio || '--'}</td>
                      <td className="px-3 py-2 text-center">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold">{p.turno_codigo}</span>
                      </td>
                      {Array.from({ length: diasDelMes }, (_, i) => {
                        const dia = i + 1;
                        const turnoDia = getTurnoForDay(p, dia);
                        const fechaObj = new Date(anio, mes - 1, dia);
                        const esHoy = fechaObj.toDateString() === hoy.toDateString();
                        const esFinde = fechaObj.getDay() === 0 || fechaObj.getDay() === 6;
                        const tt = turnoDia ? (TIPO_TURNO[turnoDia.tipo] || null) : null;
                        const isDragging = draggedItem?.personalId === p.personal_id && draggedItem?.dia === dia;

                        return (
                          <td key={i}
                            className={`px-1.5 py-2 text-center align-middle cursor-pointer select-none border-b border-slate-50 ${
                              isDragging ? 'opacity-40' : ''
                            }`}
                            onClick={() => { if (turnoDia) openDiaModal(dia); }}
                            draggable={!!turnoDia && !turnoDia.fecha_fin}
                            onDragStart={(e) => handleDragStart(e, p.personal_id, dia)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, dia)}
                          >
                            {tt ? (
                              <div className={`w-full h-8 rounded-lg flex items-center justify-center ${tt.bg} ${tt.text} font-bold text-[11px] border ${tt.border} transition-all hover:scale-105`}
                                title={`${tt.label}\n${formatTime(turnoDia[`${turnoDia.diaSem}_entrada`])} - ${formatTime(turnoDia[`${turnoDia.diaSem}_salida`])}`}
                              >
                                {tt.abbr}
                              </div>
                            ) : (
                              <span className={`text-slate-200 ${esFinde ? 'text-rose-200' : ''}`}>·</span>
                            )}
                            {esHoy && !tt && (
                              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {diaModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDiaModal(null)}>
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-100 max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Calendar size={20} /></div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{diaModal} de {MESES[mes-1]} {anio}</h3>
                  <p className="text-xs text-slate-400">
                    {['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'][new Date(anio, mes-1, diaModal).getDay()]}
                  </p>
                </div>
              </div>
              <button onClick={() => setDiaModal(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"><X size={18} /></button>
            </div>
            <div className="p-6">
              {diaLoading ? (
                <div className="text-center py-8 text-slate-400">Cargando...</div>
              ) : diaPersonal.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Users size={32} className="mx-auto mb-3 opacity-30" />
                  Sin personal asignado este día
                </div>
              ) : (
                <div className="space-y-2">
                  {diaPersonal.map((emp, i) => {
                    const diaSem = DIAS[new Date(anio, mes-1, diaModal).getDay() === 0 ? 6 : new Date(anio, mes-1, diaModal).getDay() - 1];
                    const tt = getTipoTurno(emp, diaSem);
                    const tStyle = TIPO_TURNO[tt] || null;
                    return (
                      <div key={emp.id || i}
                        className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${tStyle?.bg || 'bg-slate-200'} ${tStyle?.text || 'text-slate-500'}`}>
                          {emp.primer_nombre?.[0]}{emp.apellido_paterno?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-700">{emp.primer_nombre} {emp.apellido_paterno}</p>
                          <p className="text-xs text-slate-400 truncate">{emp.unidad_servicio || ''} {emp.cargo_actual ? `· ${emp.cargo_actual}` : ''}</p>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          {tStyle && (
                            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${tStyle.bg} ${tStyle.text}`}>
                              <span className={`w-2 h-2 rounded-full ${tStyle.dot}`} />
                              {tStyle.label}
                            </span>
                          )}
                          <span className="text-xs font-mono text-slate-500">
                            {formatTime(emp.entrada)} - {formatTime(emp.salida)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
