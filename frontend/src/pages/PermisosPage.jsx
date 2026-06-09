import React, { useState, useEffect } from 'react';
import {
  FileBadge, Plus, Search, CheckCircle2, XCircle,
  Clock, AlertCircle, Filter, Ban
} from 'lucide-react';
import { API_BASE_URL, authFetch } from '../config/api';

const ESTADOS = {
  PENDIENTE: { label: 'Pendiente', class: 'bg-amber-50 text-amber-600' },
  APROBADO: { label: 'Aprobado', class: 'bg-emerald-50 text-emerald-600' },
  RECHAZADO: { label: 'Rechazado', class: 'bg-rose-50 text-rose-600' },
  FINALIZADO: { label: 'Finalizado', class: 'bg-blue-50 text-blue-600' },
};

const TIPO_CLASS = {
  FERIADO: 'bg-purple-50 text-purple-600',
  VACACION: 'bg-blue-50 text-blue-600',
  A_CUENTA_VAC: 'bg-indigo-50 text-indigo-600',
  BAJA_MEDICA: 'bg-rose-50 text-rose-600',
  COMISION: 'bg-amber-50 text-amber-600',
  TOLERANCIA: 'bg-green-50 text-green-600',
  ANIVERSARIO: 'bg-pink-50 text-pink-600',
  REUNION: 'bg-cyan-50 text-cyan-600',
  LICENCIA: 'bg-orange-50 text-orange-600',
};

const PermisosPage = () => {
  const [permisos, setPermisos] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [tipos, setTipos] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [personalList, setPersonalList] = useState([]);

  const [filtros, setFiltros] = useState({ tipo: '', estado: '' });
  const [form, setForm] = useState({
    personal_id: '', tipo: '', fecha_inicio: '', fecha_fin: '', dias: '', motivo: ''
  });

  useEffect(() => {
    fetchPermisos();
    fetchResumen();
    fetchTipos();
    fetchStats();
    fetchPersonal();
  }, [filtros]);

  useEffect(() => {
    if (form.fecha_inicio && form.fecha_fin) {
      const inicio = new Date(form.fecha_inicio);
      const fin = new Date(form.fecha_fin);
      if (fin >= inicio) {
        const diff = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)) + 1;
        setForm(prev => ({ ...prev, dias: String(diff) }));
      }
    }
  }, [form.fecha_inicio, form.fecha_fin]);

  const fetchPermisos = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/api/permisos?limit=100`;
      if (filtros.tipo) url += `&tipo=${filtros.tipo}`;
      if (filtros.estado) url += `&estado=${filtros.estado}`;
      const res = await authFetch(url);
      if (res.ok) setPermisos(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchResumen = async () => {
    try {
      const res = await authFetch(`${API_BASE_URL}/api/permisos/resumen`);
      if (res.ok) setResumen(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchTipos = async () => {
    try {
      const res = await authFetch(`${API_BASE_URL}/api/permisos/tipos`);
      if (res.ok) setTipos(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchStats = async () => {
    try {
      const res = await authFetch(`${API_BASE_URL}/api/permisos/stats`);
      if (res.ok) setStats(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchPersonal = async () => {
    try {
      const res = await authFetch(`${API_BASE_URL}/api/personal?limit=300`);
      if (res.ok) {
        const json = await res.json();
        setPersonalList(json.data || []);
      }
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch(`${API_BASE_URL}/api/permisos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personal_id: parseInt(form.personal_id),
          tipo: form.tipo,
          fecha_inicio: form.fecha_inicio,
          fecha_fin: form.fecha_fin,
          dias: parseInt(form.dias),
          motivo: form.motivo || null,
        })
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error);
        return;
      }
      setShowForm(false);
      setForm({ personal_id: '', tipo: '', fecha_inicio: '', fecha_fin: '', dias: '', motivo: '' });
      fetchPermisos();
      fetchResumen();
      fetchStats();
    } catch (e) {
      alert('Error al crear permiso');
    }
  };

  const cambiarEstado = async (id, estado) => {
    try {
      const res = await authFetch(`${API_BASE_URL}/api/permisos/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado })
      });
      if (res.ok) { fetchPermisos(); fetchResumen(); }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Permisos y Licencias</h1>
          <p className="text-slate-500 mt-1">Gestión de permisos, licencias, comisiones y vacaciones del personal</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all"
        >
          <Plus size={20} />
          Nuevo Permiso
        </button>
      </div>

      {resumen && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <ResumenCard label="Total" value={resumen.total} color="blue" />
          <ResumenCard label="Pendientes" value={resumen.pendientes} color="amber" />
          <ResumenCard label="Aprobados" value={resumen.aprobadas} color="emerald" />
          <ResumenCard label="Finalizados" value={resumen.finalizadas} color="purple" />
          <ResumenCard label="Este Año" value={resumen.este_anio} color="indigo" />
        </div>
      )}

      {/* Stats by type */}
      {stats.length > 0 && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-8">
          <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider">Por Tipo</h3>
          <div className="flex flex-wrap gap-2">
            {stats.map(s => (
              <span key={s.tipo} className={`px-4 py-2 rounded-2xl text-sm font-bold ${TIPO_CLASS[s.tipo] || 'bg-slate-100 text-slate-600'}`}>
                {s.tipo.replace(/_/g, ' ')}: {s.total}
                {s.pendientes > 0 && <span className="ml-1 text-amber-500">({s.pendientes} pend.)</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Nuevo Permiso / Licencia</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Empleado</label>
                <select value={form.personal_id} onChange={e => setForm({ ...form, personal_id: e.target.value })}
                  required className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500">
                  <option value="">Seleccionar...</option>
                  {personalList.map(p => (
                    <option key={p.id} value={p.id}>{p.apellido_paterno} {p.primer_nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Tipo</label>
                <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}
                  required className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500">
                  <option value="">Seleccionar...</option>
                  {tipos.map(t => (
                    <option key={t.codigo} value={t.codigo}>{t.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Fecha Inicio</label>
                <input type="date" value={form.fecha_inicio}
                  onChange={e => setForm({ ...form, fecha_inicio: e.target.value })}
                  required className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Fecha Fin</label>
                <input type="date" value={form.fecha_fin}
                  onChange={e => setForm({ ...form, fecha_fin: e.target.value })}
                  required className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Días</label>
                <input type="number" value={form.dias} readOnly
                  className="w-full mt-1 px-4 py-3 bg-slate-100 border-none rounded-2xl text-slate-500" />
              </div>
              <div className="md:col-span-3">
                <label className="text-xs font-bold text-slate-400 uppercase">Motivo</label>
                <textarea value={form.motivo}
                  onChange={e => setForm({ ...form, motivo: e.target.value })}
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500" rows={1} />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit"
                className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all">
                Registrar Permiso
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-8 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4 flex-wrap">
          <Filter size={18} className="text-slate-400" />
          <select value={filtros.tipo} onChange={e => setFiltros({ ...filtros, tipo: e.target.value })}
            className="px-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500">
            <option value="">Todos los tipos</option>
            {tipos.map(t => (
              <option key={t.codigo} value={t.codigo}>{t.nombre}</option>
            ))}
          </select>
          <select value={filtros.estado} onChange={e => setFiltros({ ...filtros, estado: e.target.value })}
            className="px-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500">
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="APROBADO">Aprobados</option>
            <option value="RECHAZADO">Rechazados</option>
            <option value="FINALIZADO">Finalizados</option>
          </select>
          <span className="text-xs text-slate-400">{permisos.length} registros</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Empleado</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Desde</th>
                <th className="px-6 py-4">Hasta</th>
                <th className="px-6 py-4">Días</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Origen</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="8" className="px-6 py-20 text-center text-slate-300">Cargando...</td></tr>
              ) : permisos.length === 0 ? (
                <tr><td colSpan="8" className="px-6 py-20 text-center text-slate-300">
                  <FileBadge size={48} className="mx-auto mb-4 opacity-20" />
                  No hay permisos registrados
                </td></tr>
              ) : permisos.map(p => {
                const est = ESTADOS[p.estado] || ESTADOS.PENDIENTE;
                const tc = TIPO_CLASS[p.tipo] || 'bg-slate-100 text-slate-600';
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-700">{p.apellido_paterno} {p.primer_nombre}</div>
                      <div className="text-xs text-slate-400">CI: {p.ci}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${tc}`}>
                        {p.tipo.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{new Date(p.fecha_inicio).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-slate-600">{new Date(p.fecha_fin).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-bold text-slate-700">{p.dias}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${est.class}`}>{est.label}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase ${p.origen === 'ASIS' ? 'text-purple-500' : 'text-blue-500'}`}>
                        {p.origen}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {p.estado === 'PENDIENTE' && p.origen === 'MANUAL' && (
                          <>
                            <button onClick={() => cambiarEstado(p.id, 'APROBADO')}
                              className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors" title="Aprobar">
                              <CheckCircle2 size={16} />
                            </button>
                            <button onClick={() => cambiarEstado(p.id, 'RECHAZADO')}
                              className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors" title="Rechazar">
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        {p.estado === 'APROBADO' && (
                          <button onClick={() => cambiarEstado(p.id, 'FINALIZADO')}
                            className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors" title="Finalizar">
                            <CheckCircle2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ResumenCard = ({ label, value, color }) => {
  const colors = {
    blue: 'bg-blue-50 border-blue-100 text-blue-600',
    amber: 'bg-amber-50 border-amber-100 text-amber-600',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-600',
    purple: 'bg-purple-50 border-purple-100 text-purple-600',
    indigo: 'bg-indigo-50 border-indigo-100 text-indigo-600',
  };
  return (
    <div className={`rounded-3xl border p-6 text-center ${colors[color] || colors.blue}`}>
      <p className="text-3xl font-black">{value}</p>
      <p className="text-sm font-bold mt-1">{label}</p>
    </div>
  );
};

export default PermisosPage;
