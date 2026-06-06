import React, { useState, useEffect, useRef } from 'react';
import { Plus, Calendar, Users, Clock, Search, Pencil, Trash2, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import TurnoPlantillaForm from '../components/TurnoPlantillaForm';
import TurnoAsignacionForm from '../components/TurnoAsignacionForm';
import TurnoCalendario from '../components/TurnoCalendario';

const TABS = [
  { id: 'plantillas', label: 'Plantillas de Turno', icon: <Clock size={16} /> },
  { id: 'asignaciones', label: 'Asignaciones', icon: <Users size={16} /> },
  { id: 'calendario', label: 'Calendario', icon: <Calendar size={16} /> },
];

const TurnosPage = () => {
  const [activeTab, setActiveTab] = useState('plantillas');
  const [plantillas, setPlantillas] = useState([]);
  const [asignados, setAsignados] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 50, totalPages: 0 });
  const [personal, setPersonal] = useState([]);
  const [years, setYears] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showAsignacion, setShowAsignacion] = useState(false);
  const [filtroBuscar, setFiltroBuscar] = useState('');
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString());
  const [page, setPage] = useState(1);
  const [clonando, setClonando] = useState(false);
  const plantillaScrollRef = useRef(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = plantillaScrollRef.current;
    if (el) setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  const scrollRight = () => {
    const el = plantillaScrollRef.current;
    if (el) el.scrollBy({ left: 400, behavior: 'smooth' });
  };

  const fetchPlantillas = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/turnos/plantilla`);
      const data = await res.json();
      setPlantillas(data);
      setTimeout(checkScroll, 50);
    } catch (e) { console.error(e); }
  };

  const fetchYears = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/turnos/years`);
      const data = await res.json();
      setYears(data);
      if (data.length > 0) setYearFilter(data[0].toString());
    } catch (e) { console.error(e); }
  };

  const fetchAsignados = async () => {
    try {
      const params = new URLSearchParams();
      if (yearFilter) params.set('year', yearFilter);
      if (filtroBuscar) params.set('q', filtroBuscar);
      params.set('page', page.toString());
      params.set('limit', '50');
      const res = await fetch(`${API_BASE_URL}/api/turnos/asignados?${params}`);
      const data = await res.json();
      if (data.data) {
        setAsignados(data.data);
        setPagination(data.pagination);
      } else {
        setAsignados(data);
      }
    } catch (e) { console.error(e); }
  };

  const fetchPersonal = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/personal?limit=1000`);
      const data = await res.json();
      setPersonal(data.data || data || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchPlantillas(); fetchPersonal(); fetchYears(); }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === 'asignaciones') {
        setPage(1);
        fetchAsignados();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [activeTab, yearFilter, filtroBuscar]);

  useEffect(() => {
    if (activeTab === 'asignaciones') fetchAsignados();
  }, [page]);

  const handleDeletePlantilla = async (id) => {
    if (!window.confirm('¿Eliminar plantilla?')) return;
    try {
      await fetch(`${API_BASE_URL}/api/turnos/plantilla/${id}`, { method: 'DELETE' });
      fetchPlantillas();
    } catch (e) { alert('Error al eliminar'); }
  };

  const handleDeleteAsignado = async (id) => {
    if (!window.confirm('¿Eliminar asignación?')) return;
    try {
      await fetch(`${API_BASE_URL}/api/turnos/asignados/${id}`, { method: 'DELETE' });
      fetchAsignados();
    } catch (e) { alert('Error al eliminar'); }
  };

  const handleClone = async () => {
    const desde = parseInt(yearFilter) - 1;
    const hasta = parseInt(yearFilter);
    if (!window.confirm(`Copiar asignaciones de ${desde} a ${hasta}?`)) return;
    setClonando(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/turnos/clonar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ desde, hasta }),
      });
      const data = await res.json();
      alert(data.message);
      fetchAsignados();
      fetchYears();
    } catch (e) { alert('Error al clonar'); }
    setClonando(false);
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Gestión de Turnos</h1>
          <p className="text-slate-500 mt-1">Administración de plantillas y asignaciones de horarios</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 w-fit">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setShowForm(false); setShowAsignacion(false); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >{tab.icon}{tab.label}</button>
        ))}
      </div>

      {activeTab === 'plantillas' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button onClick={() => { setShowForm(true); setEditing(null); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all bg-blue-600 text-white hover:bg-blue-700"
            ><Plus size={18} /> Nueva Plantilla</button>
          </div>

          {showForm && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
                <TurnoPlantillaForm
                  plantilla={editing}
                  onSave={() => { setShowForm(false); setEditing(null); fetchPlantillas(); }}
                  onCancel={() => { setShowForm(false); setEditing(null); }}
                />
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
            {canScrollRight && (
              <div className="absolute right-1 top-3 z-30">
                <button type="button" onClick={scrollRight}
                  className="w-9 h-9 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full shadow-lg flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer">
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
            <div ref={plantillaScrollRef} onScroll={checkScroll} className="overflow-x-auto">
              <table className="w-full text-left min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 sticky top-0 z-20">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase sticky left-0 bg-slate-50/50 z-30">Código</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Nombre</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Asign.</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Lunes</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Martes</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Miércoles</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Jueves</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Viernes</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Sábado</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Domingo</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Tol.</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {plantillas.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-3 font-bold text-slate-700 sticky left-0 bg-white z-10">{p.codigo}</td>
                    <td className="px-6 py-3 text-slate-500 text-sm">{p.nombre || '--'}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        p.total_asignaciones === 0 ? 'bg-slate-100 text-slate-400' :
                        p.total_asignaciones <= 10 ? 'bg-blue-50 text-blue-600' :
                        'bg-emerald-50 text-emerald-600'
                      }`}>
                        {p.total_asignaciones || 0}
                      </span>
                    </td>
                    {['lunes','martes','miercoles','jueves','viernes','sabado','domingo'].map(d => {
                      const entrada = p[`${d}_entrada`];
                      const salida = p[`${d}_salida`];
                      const habilitado = p[`${d}_habilitado`];
                      if (!habilitado) return <td key={d} className="px-6 py-3 text-center text-slate-300 text-xs">--</td>;
                      const entradaStr = entrada ? entrada.slice(0,5) : '--';
                      const salidaStr = salida ? salida.slice(0,5) : '--';
                      return (
                        <td key={d} className="px-6 py-3 text-center">
                          <span className="text-xs font-bold text-slate-700">{entradaStr} - {salidaStr}</span>
                        </td>
                      );
                    })}
                    <td className="px-6 py-3 text-center text-sm text-slate-500">{p.tolerancia_atraso} min</td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditing(p); setShowForm(true); }}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={16} /></button>
                        <button onClick={() => handleDeletePlantilla(p.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'asignaciones' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
              <Calendar size={16} className="text-slate-400" />
              <select value={yearFilter} onChange={e => { setYearFilter(e.target.value); setPage(1); }}
                className="font-bold text-slate-700 bg-transparent outline-none text-sm cursor-pointer py-1"
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Buscar por nombre, CI o ID..."
                value={filtroBuscar} onChange={e => setFiltroBuscar(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              />
            </div>
            <span className="text-sm text-slate-500 font-medium ml-auto">
              {pagination.total} registros
            </span>
            <button onClick={handleClone} disabled={clonando || years.length < 2}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all disabled:opacity-50"
            ><Copy size={16} /> {clonando ? 'Clonando...' : `Copiar ${parseInt(yearFilter)-1}`}</button>
            <button onClick={() => setShowAsignacion(!showAsignacion)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                showAsignacion ? 'bg-slate-200 text-slate-700' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            ><Plus size={16} /> {showAsignacion ? 'Cancelar' : 'Asignar'}</button>
          </div>

          {showAsignacion && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <TurnoAsignacionForm
                plantillas={plantillas}
                personal={personal}
                onSave={() => { setShowAsignacion(false); fetchAsignados(); }}
                onCancel={() => setShowAsignacion(false)}
              />
            </div>
          )}

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Personal</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Turno</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Fecha Inicio</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Fecha Fin</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {asignados.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-700">{a.primer_nombre} {a.apellido_paterno}</div>
                      <div className="text-xs text-slate-400">CI: {a.ci}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">{a.turno_codigo}</span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-slate-700">{new Date(a.fecha_inicio).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-center text-sm text-slate-500">{a.fecha_fin ? new Date(a.fecha_fin).toLocaleDateString() : '--'}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDeleteAsignado(a.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30"
              ><ChevronLeft size={18} /></button>
              <span className="text-sm font-bold text-slate-500">
                Pág. {page} de {pagination.totalPages}
              </span>
              <button onClick={() => setPage(Math.min(pagination.totalPages, page + 1))} disabled={page >= pagination.totalPages}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30"
              ><ChevronRight size={18} /></button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'calendario' && (
        <TurnoCalendario plantillas={plantillas} />
      )}
    </div>
  );
};

export default TurnosPage;
