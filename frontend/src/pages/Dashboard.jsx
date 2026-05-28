import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, Clock, AlertTriangle, TrendingUp,
  ArrowUpRight, ArrowDownRight, Briefcase, Moon,
  Search, X, Calendar, Filter, BarChart3, PieChart as PieChartIcon
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';
import { API_BASE_URL } from '../config/api';

const meses = [
  { id: 1, nombre: 'Enero' }, { id: 2, nombre: 'Febrero' }, { id: 3, nombre: 'Marzo' },
  { id: 4, nombre: 'Abril' }, { id: 5, nombre: 'Mayo' }, { id: 6, nombre: 'Junio' },
  { id: 7, nombre: 'Julio' }, { id: 8, nombre: 'Agosto' }, { id: 9, nombre: 'Septiembre' },
  { id: 10, nombre: 'Octubre' }, { id: 11, nombre: 'Noviembre' }, { id: 12, nombre: 'Diciembre' }
];

const ESTADO_COLORS = { 1: '#10b981', 2: '#f59e0b', 3: '#3b82f6', 4: '#ef4444', 5: '#8b5cf6', 6: '#f97316', 7: '#e11d48', 8: '#94a3b8', 9: '#64748b' };
const ESTADO_LABELS = { 1: 'Normal', 2: 'Atraso', 3: 'Justificado', 4: 'Falta', 5: 'Nocturno', 6: 'Sobretiempo', 7: 'Sal. Adelantada', 8: 'Incompleta', 9: 'Sin Marcación' };
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316', '#e11d48'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertas, setAlertas] = useState(null);
  const [filtroMes, setFiltroMes] = useState(4);
  const [filtroAnio, setFiltroAnio] = useState(2026);
  const [detallePersonal, setDetallePersonal] = useState(null);
  const [detalleFecha, setDetalleFecha] = useState('');
  const [detalleData, setDetalleData] = useState(null);
  const [showDetalle, setShowDetalle] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/dashboard/stats?mes=${filtroMes}&anio=${filtroAnio}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setStats(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filtroMes, filtroAnio]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/personal/contratos-alertas`)
      .then(res => res.json())
      .then(data => setAlertas(data))
      .catch(() => {});
  }, []);

  const fetchDetalle = async () => {
    if (!detallePersonal || !detalleFecha) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/dashboard/detalle-diario?personal_id=${detallePersonal}&fecha=${detalleFecha}`);
      setDetalleData(await res.json());
    } catch (e) {
      alert('Error al cargar detalle');
    }
  };

  const searchPersonal = async (term) => {
    if (term.length < 2) { setSearchResults([]); return; }
    try {
      const res = await fetch(`${API_BASE_URL}/api/personal?buscar=${encodeURIComponent(term)}&limit=10`);
      const data = await res.json();
      setSearchResults(data.data || data || []);
    } catch (e) { setSearchResults([]); }
  };

  const formatDateShort = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('es-BO', { day: '2-digit', month: 'short' }) : '';

  if (loading && !stats) return <div className="p-8 flex items-center justify-center min-h-screen"><div className="text-slate-500 text-lg">Cargando dashboard...</div></div>;
  if (error) return <div className="p-8 bg-slate-50 min-h-screen"><div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700"><h3 className="font-bold">Error</h3><p className="text-sm">{error}</p></div></div>;
  if (!stats) return null;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Panel de Control</h1>
          <p className="text-slate-500 text-sm">Hospital de Segundo Nivel "Barrios Mineros"</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
            <Calendar size={16} className="text-slate-400" />
            <select value={filtroMes} onChange={e => setFiltroMes(parseInt(e.target.value))}
              className="text-sm font-bold text-slate-700 bg-transparent outline-none">
              {meses.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
            <input type="number" value={filtroAnio} onChange={e => setFiltroAnio(parseInt(e.target.value))}
              className="w-16 text-sm font-bold text-slate-700 bg-transparent outline-none" />
          </div>
          <button onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm text-sm font-bold">
            <Search size={14} /> Buscar Empleado
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <StatCard title="Personal Total" value={stats.totales.personal} icon={<Users size={18} />} color="blue" />
        <StatCard title="Horas en el Mes" value={stats.totales.horas} icon={<Clock size={18} />} color="emerald" />
        <StatCard title="Atrasos (min)" value={stats.totales.atrasos} icon={<AlertTriangle size={18} />} color="rose" />
        <StatCard title="Nocturnos" value={stats.totales.nocturnos} icon={<Moon size={18} />} color="purple" icon2={<span className="text-[10px] ml-1">{stats.totales.dias_nocturnos}d</span>} />
        <StatCard title="Sin Marcación" value={(stats.distribucionEstados?.find(e => e.estado === 9)?.total || 0)} icon={<AlertTriangle size={18} />} color="slate" />
        <StatCard title="Incompletas" value={(stats.distribucionEstados?.find(e => e.estado === 8)?.total || 0)} icon={<AlertTriangle size={18} />} color="amber" />
      </div>

      {/* Contract alerts */}
      {alertas?.stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-red-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg"><span className="text-red-600 font-black text-lg">{alertas.stats.vencidosCount}</span></div>
              <div className="text-xs text-red-500 font-medium">Contratos Vencidos</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg"><span className="text-amber-600 font-black text-lg">{alertas.stats.porVencerCount}</span></div>
              <div className="text-xs text-amber-500 font-medium">Por Vencer (30d)</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg"><span className="text-slate-600 font-black text-lg">{alertas.stats.activos}</span></div>
              <div className="text-xs text-slate-500 font-medium">Activos / {alertas.stats.inactivos} Inactivos</div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* State Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><PieChartIcon size={16} /> Distribución de Estados</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.distribucionEstados} cx="50%" cy="50%" innerRadius={50} outerRadius={85}
                  paddingAngle={3} dataKey="total" nameKey="label">
                  {stats.distribucionEstados.map((e) => (
                    <Cell key={e.estado} fill={ESTADO_COLORS[e.estado] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Unit Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><BarChart3 size={16} /> Personal por Unidad/Servicio</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.distribucionUnidades?.slice(0, 12) || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis dataKey="label" type="category" width={120} axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Trend */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><TrendingUp size={16} /> Tendencia Mensual</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={(stats.tendencia || []).map(t => ({ ...t, mesLabel: meses[t.mes - 1]?.nombre?.substring(0, 3) || t.mes }))}>
                <defs>
                  <linearGradient id="colorHoras" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                  <linearGradient id="colorAtrasos" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} /><stop offset="95%" stopColor="#f59e0b" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="mesLabel" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip />
                <Area yAxisId="left" type="monotone" dataKey="total_horas" stroke="#3b82f6" fill="url(#colorHoras)" strokeWidth={2} name="Horas" />
                <Area yAxisId="right" type="monotone" dataKey="total_atrasos" stroke="#f59e0b" fill="url(#colorAtrasos)" strokeWidth={2} name="Atrasos (min)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Atrasos & Planilla breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><AlertTriangle size={16} /> Ranking de Atrasos</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {stats.topAtrasos.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100 cursor-pointer"
                onClick={() => { setDetallePersonal(item.id); setDetalleFecha(`2026-${String(filtroMes).padStart(2, '0')}-01`); setShowDetalle(true); }}>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm shrink-0">{i + 1}</div>
                  <div className="truncate">
                    <div className="font-bold text-slate-700 text-xs truncate">{item.primer_nombre} {item.apellido_paterno}</div>
                    <div className="text-[9px] text-slate-400 font-medium truncate">{item.unidad_servicio || ''} {item.cargo_actual ? `- ${item.cargo_actual}` : ''}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-600">{item.tipo_planilla}</span>
                  <span className="text-rose-600 font-black text-sm">{item.total_atrasos_min}m</span>
                </div>
              </div>
            ))}
            {stats.topAtrasos.length === 0 && <div className="text-slate-400 text-sm text-center py-8">Sin atrasos este mes</div>}
          </div>
        </div>
      </div>

      {/* Planilla Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {stats.asistenciaPorPlanilla?.map(p => (
          <div key={p.tipo_planilla} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-1.5 rounded-lg ${p.tipo_planilla === 'RESIDENTE' ? 'bg-purple-50' : 'bg-emerald-50'}`}>
                <Briefcase size={16} className={p.tipo_planilla === 'RESIDENTE' ? 'text-purple-600' : 'text-emerald-600'} />
              </div>
              <span className="text-sm font-bold text-slate-700">{p.tipo_planilla}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-lg font-black text-slate-800">{Math.round(p.total_horas_mes || 0)}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Horas</div>
              </div>
              <div>
                <div className="text-lg font-black text-rose-600">{p.total_atrasos_mes || 0}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Min. Atraso</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Buscador Modal */}
      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => { setShowSearch(false); setSearchResults([]); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Buscar Empleado</h3>
              <button onClick={() => { setShowSearch(false); setSearchResults([]); }} className="p-1 hover:bg-slate-100 rounded-lg"><X size={18} className="text-slate-400" /></button>
            </div>
            <input type="text" placeholder="Nombre o C.I..." value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); searchPersonal(e.target.value); }}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 mb-3" autoFocus />
            <div className="max-h-60 overflow-y-auto space-y-1">
              {(Array.isArray(searchResults) ? searchResults : []).map(p => (
                <button key={p.id} onClick={() => {
                  setDetallePersonal(p.id);
                  setDetalleFecha(`2026-${String(filtroMes).padStart(2, '0')}-01`);
                  setShowDetalle(true);
                  setShowSearch(false);
                  setSearchTerm('');
                  setSearchResults([]);
                }}
                  className="w-full text-left p-3 hover:bg-blue-50 rounded-xl transition-colors flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                    {(p.primer_nombre?.[0] || '') + (p.apellido_paterno?.[0] || '')}
                  </div>
                  <div>
                    <div className="font-bold text-slate-700 text-sm">{p.primer_nombre} {p.apellido_paterno}</div>
                    <div className="text-[10px] text-slate-400">{p.ci}</div>
                  </div>
                </button>
              ))}
              {searchTerm.length >= 2 && searchResults.length === 0 && <div className="text-slate-400 text-sm text-center py-4">Sin resultados</div>}
            </div>
          </div>
        </div>
      )}

      {/* Detalle Diario Modal */}
      {showDetalle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => { setShowDetalle(false); setDetalleData(null); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="font-bold text-slate-800">Detalle Diario</h3>
              <button onClick={() => { setShowDetalle(false); setDetalleData(null); }}
                className="p-1 hover:bg-slate-100 rounded-lg"><X size={18} className="text-slate-400" /></button>
            </div>
            <div className="p-6">
              {!detalleData ? (
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Seleccionar Fecha</label>
                  <div className="flex gap-3">
                    <input type="date" value={detalleFecha}
                      onChange={e => setDetalleFecha(e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    <button onClick={fetchDetalle}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-bold">
                      <Search size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <div className="font-bold text-slate-800 text-lg">{detalleData.personal?.primer_nombre} {detalleData.personal?.apellido_paterno}</div>
                    <div className="text-xs text-slate-500">CI: {detalleData.personal?.ci} | {detalleData.personal?.cargo_actual} | {detalleData.personal?.unidad_servicio}</div>
                  </div>
                  {detalleData.horario && (
                    <div className="flex gap-4">
                      <div className="flex-1 bg-blue-50 p-3 rounded-xl text-center">
                        <div className="text-[10px] text-blue-500 font-bold uppercase">Horario</div>
                        <div className="font-bold text-blue-700">{detalleData.horario.entrada?.substring(0, 5)} - {detalleData.horario.salida?.substring(0, 5)}</div>
                        {detalleData.horario.nocturno && <span className="text-[10px] bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full font-bold">NOCTURNO</span>}
                      </div>
                      <div className="flex-1 bg-amber-50 p-3 rounded-xl text-center">
                        <div className="text-[10px] text-amber-500 font-bold uppercase">Estado BD</div>
                        <div className="font-bold text-amber-700">{ESTADO_LABELS[detalleData.diario?.estado] || '-'}</div>
                        {detalleData.diario?.minutos_atraso > 0 && <div className="text-xs text-rose-600 font-bold">{detalleData.diario.minutos_atraso} min atraso</div>}
                      </div>
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Marcaciones Biométricas</h4>
                    {detalleData.logs?.length > 0 ? (
                      <div className="space-y-1">
                        {detalleData.logs.map((log, i) => (
                          <div key={log.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${i === 0 ? 'bg-green-100 text-green-600' : i === detalleData.logs.length - 1 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                                #{i + 1}
                              </div>
                              <span className="font-bold text-slate-700">{new Date(log.timestamp).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="text-xs text-slate-400">{log.verificacion_tipo || '-'}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-slate-400 text-sm text-center py-8 bg-slate-50 rounded-xl">Sin marcas biométricas</div>
                    )}
                  </div>
                  {detalleData.diario?.justificacion_tipo && (
                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                      <div className="text-[10px] text-blue-500 font-bold uppercase">Justificación</div>
                      <div className="text-sm text-blue-700">{detalleData.diario.justificacion_tipo}: {detalleData.diario.motivo_justificacion || detalleData.diario.motivo_detalle}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, color, icon2 }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
    slate: 'bg-slate-50 text-slate-600',
  };
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${colors[color] || colors.blue}`}>{icon}</div>
        {icon2}
      </div>
      <div className="text-xl font-black text-slate-800">{value}</div>
      <div className="text-[10px] text-slate-400 font-bold uppercase">{title}</div>
    </div>
  );
};

export default Dashboard;
