import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Users, Clock, AlertTriangle, TrendingUp,
  ArrowUpRight, ArrowDownRight, Briefcase, Moon,
  Search, X, Download, Cpu, Activity
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import html2canvas from 'html2canvas';
import { useAuth } from '../context/AuthContext';

const ESTADO_COLORS = { 1: '#10b981', 2: '#f59e0b', 3: '#3b82f6', 4: '#ef4444', 5: '#8b5cf6', 6: '#f97316', 7: '#e11d48', 8: '#94a3b8', 9: '#64748b' };
const ESTADO_LABELS = { 1: 'Normal', 2: 'Atraso', 3: 'Justificado', 4: 'Falta', 5: 'Nocturno', 6: 'Sobretiempo', 7: 'Sal. Adelantada', 8: 'Incompleta', 9: 'Sin Marcación' };
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const RADAR_COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#10b981'];

function formatDistancia(ts) {
  const seg = Math.floor((Date.now() - ts.getTime()) / 1000);
  if (seg < 60) return 'Ahora';
  const min = Math.floor(seg / 60);
  if (min < 60) return `Hace ${min} min`;
  const hor = Math.floor(min / 60);
  if (hor < 24) return `Hace ${hor}h ${min % 60}m`;
  const dia = Math.floor(hor / 24);
  return `Hace ${dia}d`;
}

function StatCard({ title, value, icon, color, subtitle, variacion }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center`}>{icon}</div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-black text-slate-800">{typeof value === 'number' ? value.toLocaleString() : value}</span>
        {variacion && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold mb-1 ${variacion.tipo === 'subio' ? 'text-rose-500' : variacion.tipo === 'bajo' ? 'text-emerald-500' : 'text-slate-400'}`}>
            {variacion.tipo === 'subio' ? <ArrowUpRight size={12} /> : variacion.tipo === 'bajo' ? <ArrowDownRight size={12} /> : null}
            {variacion.variacion}%
          </span>
        )}
      </div>
      {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { authAxios } = useAuth();
  const api = authAxios();
  const dashRef = useRef(null);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertas, setAlertas] = useState(null);
  const [biometricoStats, setBiometricoStats] = useState(null);
  const [filtroMes, setFiltroMes] = useState(new Date().getMonth() + 1);
  const [filtroAnio, setFiltroAnio] = useState(2026);
  const [filtroUnidad, setFiltroUnidad] = useState('');
  const [unidades, setUnidades] = useState([]);
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
      const params = new URLSearchParams({ mes: filtroMes, anio: filtroAnio });
      if (filtroUnidad) params.append('unidad', filtroUnidad);
      const res = await api.get(`/api/dashboard/stats?${params}`);
      setStats(res.data);
      if (res.data.distribucionUnidades?.length > 0) {
        setUnidades(prev => prev.length === 0 ? res.data.distribucionUnidades.map(u => u.label) : prev);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filtroMes, filtroAnio, filtroUnidad]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  useEffect(() => {
    api.get('/api/personal/contratos-alertas')
      .then(r => setAlertas(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    api.get('/api/dashboard/biometrico')
      .then(r => setBiometricoStats(r.data))
      .catch(() => {});
    const iv = setInterval(() => {
      api.get('/api/dashboard/biometrico')
        .then(r => setBiometricoStats(r.data))
        .catch(() => {});
    }, 60000);
    return () => clearInterval(iv);
  }, []);

  const searchPersonal = async (term) => {
    if (term.length < 2) { setSearchResults([]); return; }
    try {
      const res = await api.get(`/api/personal?buscar=${encodeURIComponent(term)}&limit=10`);
      setSearchResults(res.data?.data || []);
    } catch { setSearchResults([]); }
  };

  const fetchDetalle = async () => {
    if (!detallePersonal || !detalleFecha) return;
    try {
      const res = await api.get(`/api/dashboard/detalle-diario?personal_id=${detallePersonal}&fecha=${detalleFecha}`);
      setDetalleData(res.data);
    } catch { setDetalleData(null); }
  };

  const exportarPNG = () => {
    if (dashRef.current) {
      html2canvas(dashRef.current, { backgroundColor: '#f8fafc', scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = `dashboard_${MESES[filtroMes - 1]}_${filtroAnio}.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  if (loading && !stats) return <div className="p-8 flex items-center justify-center h-64"><div className="text-slate-400 text-lg">Cargando dashboard...</div></div>;
  if (error && !stats) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen" ref={dashRef}>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Dashboard Estratégico</h1>
          <p className="text-slate-500 text-sm">Resumen de indicadores de gestión</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <select value={filtroUnidad} onChange={e => setFiltroUnidad(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Todas las unidades</option>
            {unidades.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
          <select value={filtroMes} onChange={e => setFiltroMes(Number(e.target.value))}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500">
            {MESES.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
          </select>
          <select value={filtroAnio} onChange={e => setFiltroAnio(Number(e.target.value))}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500">
            {[2025, 2026, 2027].map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <button onClick={exportarPNG}
            className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-1.5">
            <Download size={15} /> Exportar
          </button>
          <button onClick={() => setShowSearch(true)}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-1.5">
            <Search size={15} /> Buscar
          </button>
        </div>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
            <StatCard title="Personal Total" value={stats.totales.personal} icon={<Users size={16} className="text-white" />} color="bg-blue-500" />
            <StatCard title="Horas en el Mes" value={stats.totales.horas} icon={<Clock size={16} className="text-white" />} color="bg-emerald-500"
              variacion={stats.comparativo?.horas} subtitle="vs mes anterior" />
            <StatCard title="Atrasos (min)" value={stats.totales.atrasos} icon={<AlertTriangle size={16} className="text-white" />} color="bg-rose-500"
              variacion={stats.comparativo?.atrasos} subtitle="vs mes anterior" />
            <StatCard title="Nocturnos" value={stats.totales.nocturnos} icon={<Moon size={16} className="text-white" />} color="bg-purple-500"
              subtitle={`${stats.totales.dias_nocturnos} días`} />
            <StatCard title="Ausentismo" value={`${stats.totales.tasa_ausentismo}%`} icon={<TrendingUp size={16} className="text-white" />} color="bg-amber-500"
              variacion={stats.comparativo?.faltas} subtitle="Faltas + SM vs total" />
            <StatCard title="Sin Marcación" value={stats.distribucionEstados?.find(e => e.estado === 9)?.total || 0}
              icon={<AlertTriangle size={16} className="text-white" />} color="bg-slate-500" />
          </div>

          {alertas && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Contratos Vencidos', value: alertas.stats.vencidosCount, color: 'border-red-400', icon: '🔴' },
                { label: 'Por Vencer (30d)', value: alertas.stats.porVencerCount, color: 'border-amber-400', icon: '🟡' },
                { label: `Activos / ${alertas.stats.inactivos} Inactivos`, value: alertas.stats.activos, color: 'border-slate-300', icon: '🟢' },
              ].map((item, i) => (
                <div key={i} className={`bg-white p-4 rounded-xl border-l-4 ${item.color} border border-slate-200 shadow-sm`}>
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="text-xl font-black text-slate-800 mt-1">{item.value}</p>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 mb-3">Distribución de Estados</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={stats.distribucionEstados} dataKey="total" nameKey="label" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {stats.distribucionEstados.map((entry) => (
                      <Cell key={entry.estado} fill={ESTADO_COLORS[entry.estado] || '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 mb-3">Personal por Unidad/Servicio</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={stats.distribucionUnidades?.slice(0, 12) || []} layout="vertical" margin={{ left: 120 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="label" width={120} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" barSize={16} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 mb-3">Tendencia Mensual</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={stats.tendencia}>
                  <defs>
                    <linearGradient id="colorHoras" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                    <linearGradient id="colorAtrasos" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mes" tickFormatter={(m) => MESES[m - 1]?.substring(0, 3) || m} tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                  <Tooltip labelFormatter={(m) => MESES[m - 1] || m} />
                  <Area yAxisId="left" type="monotone" dataKey="total_horas" stroke="#3b82f6" fill="url(#colorHoras)" strokeWidth={2} name="Horas" />
                  <Area yAxisId="right" type="monotone" dataKey="total_atrasos" stroke="#f59e0b" fill="url(#colorAtrasos)" strokeWidth={2} name="Atrasos (min)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 mb-3">Comparativo por Unidad</h3>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={stats.radarUnidad || []}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="unidad" tick={{ fontSize: 9 }} />
                  <PolarRadiusAxis tick={{ fontSize: 9 }} />
                  {['atrasos', 'faltas', 'nocturnos'].map((key, i) => (
                    <Radar key={key} name={key.charAt(0).toUpperCase() + key.slice(1)} dataKey={key} stroke={RADAR_COLORS[i]} fill={RADAR_COLORS[i]} fillOpacity={0.15} strokeWidth={2} />
                  ))}
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 mb-3">Ranking de Atrasos</h3>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {stats.topAtrasos?.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Sin atrasos este mes</p>}
                {stats.topAtrasos?.map((emp, i) => (
                  <div key={emp.id} onClick={() => { setDetallePersonal(emp.id); setDetalleFecha(''); setDetalleData(null); setShowDetalle(true); }}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${i < 3 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{emp.nombre_completo}</p>
                      <p className="text-xs text-slate-400 truncate">{emp.unidad_servicio || emp.cargo_actual}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-rose-500">{emp.total_atrasos_min}'</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${emp.tipo_planilla === 'RESIDENTE' ? 'bg-purple-100 text-purple-600' : 'bg-emerald-100 text-emerald-600'}`}>{emp.tipo_planilla}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 mb-3">Ranking de Faltas</h3>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {stats.topFaltas?.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Sin faltas este mes</p>}
                {stats.topFaltas?.map((emp, i) => (
                  <div key={emp.id} onClick={() => { setDetallePersonal(emp.id); setDetalleFecha(''); setDetalleData(null); setShowDetalle(true); }}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{emp.nombre_completo}</p>
                      <p className="text-xs text-slate-400 truncate">{emp.unidad_servicio}</p>
                    </div>
                    <p className="text-sm font-bold text-red-500">{emp.total_faltas} faltas</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {stats.asistenciaPorPlanilla?.map((p, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className={`w-10 h-10 ${p.tipo_planilla === 'RESIDENTE' ? 'bg-purple-100 text-purple-600' : 'bg-emerald-100 text-emerald-600'} rounded-xl flex items-center justify-center mb-3`}>
                  <Briefcase size={18} />
                </div>
                <p className="text-sm font-bold text-slate-700">{p.tipo_planilla || 'SIN PLANILLA'}</p>
                <p className="text-xs text-slate-400 mt-1">Total horas: <span className="font-bold text-slate-600">{Math.round(p.total_horas_mes || 0)}</span></p>
                <p className="text-xs text-slate-400">Atrasos: <span className="font-bold text-rose-500">{p.total_atrasos_mes || 0} min</span></p>
              </div>
            ))}
          </div>
        </>
      )}

      {biometricoStats && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">Resumen Biométrico</h2>
              <p className="text-slate-500 text-sm">Estado actual del dispositivo y marcaciones del día</p>
            </div>
            {biometricoStats.dispositivo?.ultimo_sync_logs && (
              <span className={`text-[11px] font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
                biometricoStats.dispositivo.estado === 'CONECTADO' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
              }`}>
                <span className={`w-2 h-2 rounded-full ${biometricoStats.dispositivo.estado === 'CONECTADO' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {biometricoStats.dispositivo.estado === 'CONECTADO' ? 'En línea' : 'Desconectado'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Marcaciones Hoy</span>
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center"><Activity size={16} className="text-white" /></div>
              </div>
              <span className="text-2xl font-black text-slate-800">{biometricoStats.total_hoy}</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Dispositivo</span>
                <div className={`w-8 h-8 ${biometricoStats.dispositivo?.estado === 'CONECTADO' ? 'bg-emerald-500' : 'bg-amber-500'} rounded-lg flex items-center justify-center`}><Cpu size={16} className="text-white" /></div>
              </div>
              <span className="text-2xl font-black text-slate-800">{biometricoStats.dispositivo?.ip_address || 'Sin config'}</span>
              <p className="text-[11px] text-slate-400 mt-0.5">{biometricoStats.dispositivo?.estado || 'DESCONECTADO'}</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Última Sync</span>
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center"><Clock size={16} className="text-white" /></div>
              </div>
              <span className="text-2xl font-black text-slate-800">
                {biometricoStats.dispositivo?.ultimo_sync_logs ? formatDistancia(new Date(biometricoStats.dispositivo.ultimo_sync_logs)) : '-'}
              </span>
              {biometricoStats.dispositivo?.ultimo_sync_logs && (
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {new Date(biometricoStats.dispositivo.ultimo_sync_logs).toLocaleTimeString()}
                </p>
              )}
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Sin Marcar Hoy</span>
                <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center"><AlertTriangle size={16} className="text-white" /></div>
              </div>
              <span className="text-2xl font-black text-slate-800">{biometricoStats.sin_marcar}</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Personal sin registro</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 mb-3">Marcaciones de Hoy</h3>
            {biometricoStats.timeline?.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {biometricoStats.timeline.map((m, i) => (
                  <div key={m.id || i} className="flex-shrink-0 bg-slate-50 p-3 rounded-xl min-w-[180px] border border-slate-100">
                    <p className="text-sm font-bold text-slate-700 truncate">
                      {m.primer_nombre ? `${m.primer_nombre} ${m.apellido_paterno || ''}` : <span className="text-rose-400 italic">Sin vinculo</span>}
                    </p>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">{new Date(m.timestamp).toLocaleString()}</p>
                    <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      m.estado_asistencia === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {m.estado_asistencia === 0 ? 'Entrada' : 'Salida/Otro'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-8">Sin marcaciones registradas hoy</p>
            )}
          </div>
        </div>
      )}

      {showSearch && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-start justify-center pt-20" onClick={() => setShowSearch(false)}>
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <Search size={18} className="text-slate-400" />
              <input autoFocus type="text" value={searchTerm} onChange={e => { setSearchTerm(e.target.value); searchPersonal(e.target.value); }}
                placeholder="Buscar empleado por nombre o CI..." className="flex-1 outline-none text-sm" />
              <button onClick={() => setShowSearch(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {searchResults.map(p => (
                <div key={p.id} onClick={() => { setDetallePersonal(p.id); setDetalleFecha(''); setDetalleData(null); setShowDetalle(true); setShowSearch(false); }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {p.primer_nombre?.[0]}{p.apellido_paterno?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">{p.primer_nombre} {p.apellido_paterno} {p.apellido_materno || ''}</p>
                    <p className="text-xs text-slate-400">CI: {p.ci}</p>
                  </div>
                </div>
              ))}
              {searchTerm.length >= 2 && searchResults.length === 0 && <p className="text-sm text-slate-400 text-center py-6">Sin resultados</p>}
            </div>
          </div>
        </div>
      )}

      {showDetalle && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowDetalle(false)}>
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Detalle Diario</h3>
              <div className="flex items-center gap-2">
                <input type="date" value={detalleFecha} onChange={e => setDetalleFecha(e.target.value)} className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm" />
                <button onClick={fetchDetalle} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Consultar</button>
                <button onClick={() => setShowDetalle(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
              </div>
            </div>
            {detalleData && (
              <div className="p-6 space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-base font-bold text-slate-800">{detalleData.personal?.primer_nombre} {detalleData.personal?.apellido_paterno}</p>
                  <p className="text-sm text-slate-500">CI: {detalleData.personal?.ci} | {detalleData.personal?.cargo_actual} | {detalleData.personal?.unidad_servicio}</p>
                </div>
                {detalleData.horario && (
                  <div className="flex gap-3">
                    <div className="flex-1 bg-slate-50 p-3 rounded-xl text-center">
                      <p className="text-xs text-slate-400">Entrada</p>
                      <p className="text-lg font-bold text-slate-700">{detalleData.horario.entrada || '-'}</p>
                    </div>
                    <div className="flex-1 bg-slate-50 p-3 rounded-xl text-center">
                      <p className="text-xs text-slate-400">Salida</p>
                      <p className="text-lg font-bold text-slate-700">{detalleData.horario.salida || '-'}</p>
                    </div>
                    {detalleData.horario.nocturno && <div className="flex-1 bg-purple-50 p-3 rounded-xl text-center"><p className="text-xs text-purple-400">Turno</p><p className="text-lg font-bold text-purple-600">Nocturno</p></div>}
                  </div>
                )}
                {detalleData.diario && (
                  <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Estado BD</p>
                      <p className="text-sm font-bold text-slate-700">{ESTADO_LABELS[detalleData.diario.estado] || 'Desconocido'}</p>
                    </div>
                    {detalleData.diario.minutos_atraso > 0 && <p className="text-sm font-bold text-rose-500">{detalleData.diario.minutos_atraso} min atraso</p>}
                  </div>
                )}
                {detalleData.logs?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Marcaciones Biométricas</p>
                    <div className="space-y-1">
                      {detalleData.logs.map((log, i) => (
                        <div key={log.id} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg">
                          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold flex items-center justify-center">{i + 1}</span>
                          <span className="text-sm font-mono">{new Date(log.timestamp).toLocaleString('es-BO')}</span>
                          <span className="text-xs text-slate-400">{log.verificacion_tipo}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {detalleData.diario?.justificacion_tipo && (
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                    <p className="text-xs font-bold text-blue-600">Justificación: {detalleData.diario.justificacion_tipo}</p>
                    <p className="text-sm text-slate-600 mt-1">{detalleData.diario.motivo_detalle || detalleData.diario.motivo_justificacion}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
