import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const ESTADO_COLORS = {
  1: 'bg-emerald-100 text-emerald-700',
  2: 'bg-amber-100 text-amber-700',
  3: 'bg-blue-100 text-blue-700',
  4: 'bg-red-100 text-red-700',
  5: 'bg-purple-100 text-purple-700',
  6: 'bg-orange-100 text-orange-700',
  7: 'bg-rose-100 text-rose-700',
  8: 'bg-slate-100 text-slate-500',
  9: 'bg-gray-100 text-gray-400',
};

const ESTADO_LABELS = {
  1: 'N', 2: 'A', 3: 'J', 4: 'F', 5: 'Nc',
  6: 'S', 7: 'SA', 8: 'I', 9: 'SM',
};

const TurnoCalendario = ({ plantillas }) => {
  const now = new Date();
  const [mes, setMes] = useState(now.getMonth() + 1);
  const [anio, setAnio] = useState(now.getFullYear());
  const [servicio, setServicio] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vista, setVista] = useState('resumen');

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ mes, anio });
      if (servicio) params.set('servicio', servicio);
      const res = await fetch(`${API_BASE_URL}/api/turnos/calendario?${params}`);
      const d = await res.json();
      setData(Array.isArray(d) ? d : []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [mes, anio, servicio]);

  const diasDelMes = new Date(anio, mes, 0).getDate();
  const primerDia = new Date(anio, mes - 1, 1).getDay();

  const groupedByPersona = {};
  data.forEach(item => {
    const key = `${item.personal_id}`;
    if (!groupedByPersona[key]) {
      groupedByPersona[key] = { ...item, turnos: [] };
    }
    groupedByPersona[key].turnos.push(item);
  });

  const mesAnterior = () => { if (mes === 1) { setMes(12); setAnio(a => a - 1); } else setMes(m => m - 1); };
  const mesSiguiente = () => { if (mes === 12) { setMes(1); setAnio(a => a + 1); } else setMes(m => m + 1); };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={mesAnterior} className="p-2 hover:bg-slate-100 rounded-xl"><ChevronLeft size={20} /></button>
            <h2 className="text-xl font-bold text-slate-700">
              {['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][mes-1]} {anio}
            </h2>
            <button onClick={mesSiguiente} className="p-2 hover:bg-slate-100 rounded-xl"><ChevronRight size={20} /></button>
          </div>
          <div className="flex gap-4 items-center">
            <input type="text" placeholder="Filtrar por servicio..." value={servicio}
              onChange={e => setServicio(e.target.value)}
              className="px-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <div className="flex bg-slate-100 rounded-xl p-1">
              <button onClick={() => setVista('resumen')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${vista === 'resumen' ? 'bg-white shadow-sm text-slate-700' : 'text-slate-500'}`}>Resumen</button>
              <button onClick={() => setVista('detalle')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${vista === 'detalle' ? 'bg-white shadow-sm text-slate-700' : 'text-slate-500'}`}>Detalle</button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-400">Cargando...</div>
        ) : vista === 'resumen' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left font-bold text-slate-500 uppercase sticky left-0 bg-white">Personal</th>
                  <th className="px-3 py-2 text-left font-bold text-slate-500 uppercase">Servicio</th>
                  <th className="px-3 py-2 text-left font-bold text-slate-500 uppercase">Turno</th>
                  {Array.from({ length: diasDelMes }, (_, i) => (
                    <th key={i} className={`px-2 py-2 text-center font-bold ${[0,6].includes(new Date(anio, mes-1, i+1).getDay()) ? 'text-rose-400' : 'text-slate-500'}`}>
                      {i + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.values(groupedByPersona).map(p => (
                  <tr key={p.personal_id} className="border-t border-slate-50 hover:bg-slate-50/50">
                    <td className="px-3 py-2 font-medium text-slate-700 sticky left-0 bg-white">
                      {p.primer_nombre} {p.apellido_paterno}
                    </td>
                    <td className="px-3 py-2 text-slate-400">{p.unidad_servicio || '--'}</td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold">{p.turno_codigo}</span>
                    </td>
                    {Array.from({ length: diasDelMes }, (_, i) => {
                      const dia = i + 1;
                      const turnoDia = p.turnos?.find(t => {
                        const inicio = new Date(t.fecha_inicio).getDate();
                        const fin = t.fecha_fin ? new Date(t.fecha_fin).getDate() : inicio;
                        return dia >= inicio && dia <= fin;
                      });
                      const colorClass = turnoDia ? 'bg-blue-50 text-blue-600' : 'text-slate-200';
                      return (
                        <td key={i} className={`px-2 py-2 text-center ${colorClass}`}>
                          {turnoDia ? '✓' : '·'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-3 text-xs">
              {Object.entries(ESTADO_LABELS).map(([k, v]) => (
                <span key={k} className={`px-2 py-1 rounded ${ESTADO_COLORS[k]} flex items-center gap-1`}>
                  <span className="font-bold">{v}</span>
                  <span className="opacity-70">{{
                    1:'Normal',2:'Atraso',3:'Justif.',4:'Falta',5:'Nocturno',
                    6:'Sobret.',7:'Sal.Ant.',8:'Incompl.',9:'SinMarc.'
                  }[k]}</span>
                </span>
              ))}
            </div>
            {Object.values(groupedByPersona).slice(0, 20).map(p => (
              <div key={p.personal_id} className="bg-slate-50 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs">
                    {p.primer_nombre?.[0]}{p.apellido_paterno?.[0]}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-700">{p.primer_nombre} {p.apellido_paterno}</div>
                    <div className="text-xs text-slate-400">{p.unidad_servicio || '--'} · {p.turno_codigo}</div>
                  </div>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {Array.from({ length: diasDelMes }, (_, i) => {
                    const dia = i + 1;
                    const diaSem = new Date(anio, mes-1, dia).getDay();
                    const esFinde = diaSem === 0 || diaSem === 6;
                    return (
                      <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold border ${
                        esFinde ? 'border-rose-100 bg-rose-50/30 text-rose-300' : 'border-slate-200 text-slate-300 bg-white'
                      }`}>
                        {dia}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TurnoCalendario;
