import React, { useState, useEffect } from 'react';
import {
  Plane, Plus, Search, CheckCircle2, XCircle, Clock,
  AlertCircle, Calendar, User, FileText, Trash2, Ban
} from 'lucide-react';
import { API_BASE_URL, authFetch } from '../config/api';

const ESTADOS = {
  PENDIENTE: { label: 'Pendiente', class: 'bg-amber-50 text-amber-600' },
  APROBADO: { label: 'Aprobado', class: 'bg-emerald-50 text-emerald-600' },
  RECHAZADO: { label: 'Rechazado', class: 'bg-rose-50 text-rose-600' },
  GOZADO: { label: 'Gozado', class: 'bg-blue-50 text-blue-600' },
  ANULADO: { label: 'Anulado', class: 'bg-slate-50 text-slate-400' },
};

const VacacionesPage = () => {
  const [vacaciones, setVacaciones] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [personalList, setPersonalList] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [saldo, setSaldo] = useState(null);
  const [selectedPersonal, setSelectedPersonal] = useState('');

  const [form, setForm] = useState({
    personal_id: '',
    fecha_inicio: '',
    fecha_fin: '',
    dias_solicitados: '',
    observaciones: ''
  });

  useEffect(() => {
    fetchVacaciones();
    fetchResumen();
    fetchPersonal();
  }, [filtroEstado]);

  useEffect(() => {
    if (form.personal_id) {
      authFetch(`${API_BASE_URL}/api/vacaciones/saldo/${form.personal_id}`)
        .then(r => r.json())
        .then(setSaldo)
        .catch(() => setSaldo(null));
    }
  }, [form.personal_id]);

  useEffect(() => {
    if (form.fecha_inicio && form.fecha_fin) {
      const inicio = new Date(form.fecha_inicio);
      const fin = new Date(form.fecha_fin);
      if (fin >= inicio) {
        const diff = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)) + 1;
        setForm(prev => ({ ...prev, dias_solicitados: String(diff) }));
      }
    }
  }, [form.fecha_inicio, form.fecha_fin]);

  const fetchVacaciones = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/api/vacaciones`;
      if (filtroEstado) url += `?estado=${filtroEstado}`;
      const res = await authFetch(url);
      if (res.ok) setVacaciones(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchResumen = async () => {
    try {
      const res = await authFetch(`${API_BASE_URL}/api/vacaciones/resumen`);
      if (res.ok) setResumen(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchPersonal = async () => {
    try {
      const res = await authFetch(`${API_BASE_URL}/api/personal?limit=300`);
      if (res.ok) {
        const json = await res.json();
        setPersonalList(json.data || json || []);
      }
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch(`${API_BASE_URL}/api/vacaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, personal_id: parseInt(form.personal_id) })
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error);
        return;
      }
      setShowForm(false);
      setForm({ personal_id: '', fecha_inicio: '', fecha_fin: '', dias_solicitados: '', observaciones: '' });
      fetchVacaciones();
      fetchResumen();
    } catch (e) {
      alert('Error al crear solicitud');
    }
  };

  const cambiarEstado = async (id, estado) => {
    try {
      const res = await authFetch(`${API_BASE_URL}/api/vacaciones/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado })
      });
      if (res.ok) {
        fetchVacaciones();
        fetchResumen();
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Vacaciones</h1>
          <p className="text-slate-500 mt-1">Solicitud y gestión de vacaciones del personal</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all"
        >
          <Plus size={20} />
          Nueva Solicitud
        </button>
      </div>

      {resumen && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <ResumenCard label="Total Solicitudes" value={resumen.total} color="blue" />
          <ResumenCard label="Pendientes" value={resumen.pendientes} color="amber" />
          <ResumenCard label="Aprobadas" value={resumen.aprobadas} color="emerald" />
          <ResumenCard label="Gozadas" value={resumen.gozadas} color="blue" />
          <ResumenCard label="Días Aprobados" value={resumen.dias_aprobados} color="purple" />
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Nueva Solicitud de Vacaciones</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Empleado</label>
                <select
                  value={form.personal_id}
                  onChange={e => setForm({ ...form, personal_id: e.target.value })}
                  required
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  {personalList.map(p => (
                    <option key={p.id} value={p.id}>{p.apellido_paterno} {p.primer_nombre}</option>
                  ))}
                </select>
                {saldo !== null && (
                  <p className={`text-xs mt-1 font-bold ${saldo.disponible > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    Saldo disponible: {saldo.disponible} días
                  </p>
                )}
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
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Días</label>
                <input type="number" value={form.dias_solicitados} readOnly
                  className="w-full mt-1 px-4 py-3 bg-slate-100 border-none rounded-2xl text-slate-500" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Observaciones</label>
              <textarea value={form.observaciones}
                onChange={e => setForm({ ...form, observaciones: e.target.value })}
                className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500" rows={2} />
            </div>
            <div className="flex gap-3">
              <button type="submit"
                className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all">
                Solicitar Vacación
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
        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
          <Search size={18} className="text-slate-400" />
          <select
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value)}
            className="px-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="APROBADO">Aprobados</option>
            <option value="RECHAZADO">Rechazados</option>
            <option value="GOZADO">Gozados</option>
            <option value="ANULADO">Anulados</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Empleado</th>
                <th className="px-6 py-4">Desde</th>
                <th className="px-6 py-4">Hasta</th>
                <th className="px-6 py-4">Días</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Aprobador</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="7" className="px-6 py-20 text-center text-slate-300">Cargando...</td></tr>
              ) : vacaciones.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-20 text-center text-slate-300">
                  <Plane size={48} className="mx-auto mb-4 opacity-20" />
                  No hay solicitudes de vacaciones
                </td></tr>
              ) : vacaciones.map(v => {
                const est = ESTADOS[v.estado] || ESTADOS.PENDIENTE;
                return (
                  <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-700">{v.apellido_paterno} {v.primer_nombre}</div>
                      <div className="text-xs text-slate-400">CI: {v.ci}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {new Date(v.fecha_inicio).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {new Date(v.fecha_fin).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-700">{v.dias_solicitados}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${est.class}`}>
                        {est.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {v.aprobador_nombre || <span className="text-slate-300 italic">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {v.estado === 'PENDIENTE' && (
                          <>
                            <button onClick={() => cambiarEstado(v.id, 'APROBADO')}
                              className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors" title="Aprobar">
                              <CheckCircle2 size={16} />
                            </button>
                            <button onClick={() => cambiarEstado(v.id, 'RECHAZADO')}
                              className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors" title="Rechazar">
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        {v.estado === 'APROBADO' && (
                          <button onClick={() => cambiarEstado(v.id, 'GOZADO')}
                            className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors" title="Marcar como gozado">
                            <Calendar size={16} />
                          </button>
                        )}
                        {(v.estado === 'PENDIENTE' || v.estado === 'APROBADO') && (
                          <button onClick={() => cambiarEstado(v.id, 'ANULADO')}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors" title="Anular">
                            <Ban size={16} />
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
    rose: 'bg-rose-50 border-rose-100 text-rose-600',
  };
  return (
    <div className={`rounded-3xl border p-6 text-center ${colors[color] || colors.blue}`}>
      <p className="text-3xl font-black">{value}</p>
      <p className="text-sm font-bold mt-1">{label}</p>
    </div>
  );
};

export default VacacionesPage;
