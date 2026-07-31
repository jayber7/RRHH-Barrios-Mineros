import React, { useState, useEffect } from 'react';
import { 
  Cpu, Settings, RefreshCw, Database, 
  Link, UserCheck, AlertCircle, CheckCircle2,
  Clock, Activity, Upload, Download, Search,
  Users, UserX, ChevronRight, BarChart3,
  FileSpreadsheet, FileDown, Calendar, Filter, X, Eye
} from 'lucide-react';
import api from '../config/api';

const ETIQUETAS_ESTADO = {
  0: 'Entrada',
  1: 'Salida',
  2: 'Salida Temporal',
  3: 'Regreso',
  4: 'Entrada Tiempo Extra',
  5: 'Salida Tiempo Extra'
};

const etiquetaEstado = (estado) => ETIQUETAS_ESTADO[estado] ?? 'Salida';

const formatoNombre = (personal) =>
  [personal.primer_nombre, personal.apellido_paterno].filter(Boolean).join(' ').toUpperCase();

const formatoFechaHoraLaPaz = (timestamp) => {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('es-BO', {
      timeZone: 'America/La_Paz',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).formatToParts(new Date(timestamp)).map((x) => [x.type, x.value])
  );
  return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`;
};

const TABS = [
  { id: 'config', label: 'Configuración', icon: Settings },
  { id: 'import', label: 'Importar Datos', icon: Database },
  { id: 'mapping', label: 'Mapeo de Empleados', icon: Link },
  { id: 'attendance', label: 'Asistencia', icon: Clock },
  { id: 'turnos', label: 'Turnos', icon: Calendar },
];

const BiometricoPage = () => {
  const [activeTab, setActiveTab] = useState('config');
  const [config, setConfig] = useState({ ip_address: '', port: 4370, comms_key: '0' });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => { fetchConfig(); }, []);

  const fetchConfig = async () => {
    try {
      const res = await api.get('/api/biometrico/config');
      if (res.data && res.data.ip_address) setConfig(res.data);
    } catch (e) { console.error('Error fetching config:', e); }
  };

  const showStatus = (type, text) => {
    setStatus({ type, text });
    setTimeout(() => setStatus(null), 6000);
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Módulo Biométrico</h1>
        <p className="text-slate-500 mt-1">Gestión de equipo ZKTeco, importación de datos y mapeo de empleados</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100 inline-flex">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {status && (
        <div className={`mb-6 p-4 rounded-2xl flex items-start gap-3 border ${
          status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 
          status.type === 'info' ? 'bg-blue-50 border-blue-100 text-blue-700' :
          'bg-rose-50 border-rose-100 text-rose-700'
        }`}>
          {status.type === 'success' ? <CheckCircle2 className="mt-0.5 shrink-0" size={18} /> : <AlertCircle className="mt-0.5 shrink-0" size={18} />}
          <p className="text-sm font-medium">{status.text}</p>
        </div>
      )}

      {activeTab === 'config' && <ConfigTab config={config} setConfig={setConfig} loading={loading} setLoading={setLoading} showStatus={showStatus} logs={logs} setLogs={setLogs} />}
      {activeTab === 'import' && <ImportTab showStatus={showStatus} />}
      {activeTab === 'mapping' && <MappingTab showStatus={showStatus} />}
      {activeTab === 'attendance' && <AttendanceTab showStatus={showStatus} />}
      {activeTab === 'turnos' && <TurnosTab showStatus={showStatus} />}
    </div>
  );
};

/* ==================== CONFIG TAB ==================== */
const ConfigTab = ({ config, setConfig, loading, setLoading, showStatus, logs, setLogs }) => {
  const fetchLogs = async () => {
    try {
      const res = await api.get('/api/biometrico/raw-logs');
      setLogs(Array.isArray(res.data) ? res.data : []);
    } catch (e) { setLogs([]); }
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleUpdateConfig = async () => {
    setLoading(true);
    try {
      await api.post('/api/biometrico/config', config);
      showStatus('success', 'Configuración guardada correctamente');
    } catch (e) {
      showStatus('error', 'Error al guardar configuración');
    } finally { setLoading(false); }
  };

  const handleSync = async () => {
    setLoading(true);
    showStatus('info', 'Conectando con el equipo y extrayendo logs...');
    try {
      const res = await api.post('/api/biometrico/sync-logs');
      showStatus('success', `Sincronización completa. ${res.data.nuevosGuardados} nuevos registros`);
      fetchLogs();
    } catch (e) {
      showStatus('error', e.response?.data?.error || e.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Settings size={20} /></div>
            <h3 className="font-bold text-slate-800 text-lg">Dispositivo</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Dirección IP</label>
              <input type="text" value={config.ip_address}
                onChange={e => setConfig({...config, ip_address: e.target.value})}
                className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Ej. 192.168.1.201" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Puerto</label>
                <input type="number" value={config.port}
                  onChange={e => setConfig({...config, port: parseInt(e.target.value)})}
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Comms Key</label>
                <input type="text" value={config.comms_key}
                  onChange={e => setConfig({...config, comms_key: e.target.value})}
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
            </div>
            <button onClick={handleUpdateConfig}
              className="w-full py-3 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 transition-colors">
              Guardar Configuración
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Activity size={20} /></div>
            <h3 className="font-bold text-slate-800 text-lg">Sincronización en Vivo</h3>
          </div>
          <p className="text-sm text-slate-500 mb-6">Conecta directamente con el equipo ZKTeco para descargar las marcaciones en tiempo real.</p>
          <button onClick={handleSync} disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all disabled:bg-slate-300">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Sincronizando...' : 'Sincronizar Ahora'}
          </button>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Activity size={20} /></div>
              <h3 className="font-bold text-slate-800 text-lg">Últimas Marcaciones</h3>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-500 rounded-full">EN VIVO</span>
          </div>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-white">
                <tr className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Personal</th>
                  <th className="px-6 py-4">ID Biométrico</th>
                  <th className="px-6 py-4">Fecha y Hora</th>
                  <th className="px-6 py-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-20 text-center text-slate-300">
                      <Database size={48} className="mx-auto mb-4 opacity-20" />
                      Aún no hay logs sincronizados
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-700">
                        {log.primer_nombre
                          ? `${log.primer_nombre} ${log.apellido_paterno}`
                          : <span className="text-rose-400 italic">No vinculado</span>}
                      </td>
                      <td className="px-6 py-4">
                        <code className="bg-slate-100 px-2 py-1 rounded text-blue-600 font-mono text-sm">{log.biometrico_id}</code>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          log.estado_asistencia === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {log.estado_asistencia === 0 ? 'Entrada' : 'Salida/Otro'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==================== IMPORT TAB ==================== */
const ImportTab = ({ showStatus }) => {
  const [stats, setStats] = useState(null);
  const [importingEmp, setImportingEmp] = useState(false);
  const [importingMarc, setImportingMarc] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [rangoDesde, setRangoDesde] = useState('2021-01-01');
  const [rangoHasta, setRangoHasta] = useState('2026-12-31');
  const [archivo, setArchivo] = useState(null);
  const [subiendoZK, setSubiendoZK] = useState(false);
  const [job, setJob] = useState(null);
  const [jobPct, setJobPct] = useState(0);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await api.get('/api/biometrico/stats-importacion');
      setStats(res.data);
    } catch (e) { setStats(null); }
    finally { setLoadingStats(false); }
  };

  useEffect(() => { fetchStats(); }, []);

  const handleImportEmpleados = async () => {
    setImportingEmp(true);
    try {
      const res = await api.post('/api/biometrico/importar-empleados', {});
      showStatus('success', `Empleados importados: ${res.data.insertados} nuevos, ${res.data.actualizados} actualizados (${res.data.total} total)`);
      fetchStats();
    } catch (e) {
      showStatus('error', e.response?.data?.error || e.message);
    } finally { setImportingEmp(false); }
  };

  const handleImportMarcaciones = async () => {
    setImportingMarc(true);
    try {
      const res = await api.post('/api/biometrico/importar-marcaciones', {
        desde: rangoDesde,
        hasta: rangoHasta
      });
      showStatus('success', `Marcaciones importadas: ${res.data.importados} nuevas. Rango: ${res.data.rango?.desde || '-'} → ${res.data.rango?.hasta || '-'}`);
      fetchStats();
    } catch (e) {
      showStatus('error', e.response?.data?.error || e.message);
    } finally { setImportingMarc(false); }
  };

  const handleSubirZK = async () => {
    if (!archivo) {
      showStatus('error', 'Seleccioná el archivo ZKTimeNet.db');
      return;
    }
    setSubiendoZK(true);
    try {
      const fd = new FormData();
      fd.append('archivo', archivo);
      fd.append('desde', rangoDesde);
      fd.append('hasta', rangoHasta);
      const res = await api.post('/api/biometrico/importar-zktimeten', fd, {
        timeout: 0,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showStatus('success',
        `Importación completada. Empleados: ${res.data.empleados?.insertados ?? 0} nuevos, ${res.data.empleados?.actualizados ?? 0} actualizados. ` +
        `Marcaciones: ${res.data.marcaciones?.importados ?? 0} nuevas.`);
      setArchivo(null);
      fetchStats();
    } catch (e) {
      showStatus('error', e.response?.data?.error || e.message);
    } finally { setSubiendoZK(false); }
  };

  const handleCalcularTodos = async () => {
    const mes = parseInt(rangoHasta.slice(0, 7).split('-')[1]);
    const anio = parseInt(rangoHasta.slice(0, 4));
    try {
      const res = await api.post('/api/asistencia/calcular-todos', { mes, anio });
      setJob(res.data.jobId);
      setJobPct(0);
      showStatus('success', `Cálculo iniciado (job #${res.data.jobId}). Recargar la pestaña para ver los resultados.`);
    } catch (e) {
      showStatus('error', e.response?.data?.error || e.message);
    }
  };

  useEffect(() => {
    if (!job) return;
    const poll = setInterval(async () => {
      try {
        const res = await api.get('/api/asistencia/calcular-todos/estado', { params: { job_id: job } });
        const j = res.data;
        setJobPct(j.total > 0 ? Math.round((j.procesados / j.total) * 100) : 0);
        if (j.estado === 'completado') {
          setJob(null);
          showStatus('success', `Cálculo completado: ${j.procesados} empleados procesados (${j.mes}/${j.anio})`);
          fetchStats();
        } else if (j.estado === 'error') {
          setJob(null);
          showStatus('error', `Error en cálculo: ${j.detalle || 'desconocido'}`);
        }
      } catch (e) {
        setJob(null);
      }
    }, 3000);
    return () => clearInterval(poll);
  }, [job]);

  const jobMsg = job
    ? jobPct >= 100 ? 'Finalizando...' : `Recalculando asistencia... ${jobPct}%`
    : '';

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Empleados en ZK', value: stats?.total_empleados || 0, icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: 'Marcaciones Hist.', value: stats?.total_marcaciones_historicas || 0, icon: Database, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Marcaciones Vivo', value: stats?.total_marcaciones_vivo || 0, icon: Activity, color: 'text-purple-600 bg-purple-50' },
          { label: 'Mapeados', value: stats?.empleados_mapeados || 0, icon: Link, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Sin Mapear', value: stats?.empleados_sin_mapear || 0, icon: UserX, color: 'text-amber-600 bg-amber-50' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${item.color}`}><item.icon size={18} /></div>
              <span className="text-xs font-bold text-slate-400 uppercase">{item.label}</span>
            </div>
            <p className="text-2xl font-black text-slate-800">
              {loadingStats ? <span className="animate-pulse">...</span> : item.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Import actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Empleados */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Users size={20} /></div>
            <h3 className="font-bold text-slate-800 text-lg">Importar Empleados</h3>
          </div>
          <p className="text-sm text-slate-500 mb-6">
            Importa los 938 empleados registrados en el software ZKTimeNet (archivo ZKTimeNet.db).
            Los datos se almacenan en <code className="bg-slate-100 px-2 py-0.5 rounded text-xs">biometrico_usuarios</code> para su posterior mapeo.
          </p>
          <button onClick={handleImportEmpleados} disabled={importingEmp}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:bg-slate-300">
            <Upload size={20} className={importingEmp ? 'animate-bounce' : ''} />
            {importingEmp ? 'Importando...' : 'Importar Empleados'}
          </button>
        </div>

        {/* Subir ZKTimeNet.db */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Database size={20} /></div>
            <h3 className="font-bold text-slate-800 text-lg">Subir ZKTimeNet.db</h3>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Subí el archivo <code className="bg-slate-100 px-2 py-0.5 rounded text-xs">Sources/ZKTimeNet.db</code> del software ZKTimeNet.
            Se importan empleados y marcaciones del rango elegido (dedupe automático).
          </p>
          <div className="mb-4">
            <label className="text-xs font-bold text-slate-400 uppercase">Archivo</label>
            <input type="file" accept=".db" onChange={e => setArchivo(e.target.files?.[0] || null)}
              className="w-full mt-1 px-3 py-2.5 bg-slate-50 border-none rounded-xl text-sm file:mr-3 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-emerald-600 file:text-white file:font-bold hover:file:bg-emerald-700" />
            {archivo && <p className="text-xs text-slate-400 mt-1">{archivo.name} · {(archivo.size / 1024 / 1024).toFixed(1)} MB</p>}
          </div>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Desde</label>
              <input type="date" value={rangoDesde} onChange={e => setRangoDesde(e.target.value)}
                className="w-full mt-1 px-3 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Hasta</label>
              <input type="date" value={rangoHasta} onChange={e => setRangoHasta(e.target.value)}
                className="w-full mt-1 px-3 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
          </div>
          <button onClick={handleSubirZK} disabled={subiendoZK || importingMarc}
            className="flex items-center justify-center gap-2 w-full bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all disabled:bg-slate-300">
            <Upload size={20} className={subiendoZK ? 'animate-bounce' : ''} />
            {subiendoZK ? 'Subiendo e importando...' : 'Subir e Importar'}
          </button>
        </div>

        {/* Recalcular asistencia */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><RefreshCw size={20} /></div>
            <h3 className="font-bold text-slate-800 text-lg">Recalcular Asistencia</h3>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Recalcula las horas y atrasos de todos los empleados con marcaciones del mes indicado.
            Corre en segundo plano y podés seguir navegando.
          </p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Mes</label>
              <select value={rangoHasta.slice(0, 7)} onChange={e => { const [y, m] = e.target.value.split('-'); setRangoHasta(`${y}-${m}-${rangoHasta.slice(8)}`); }}
                className="w-full mt-1 px-3 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm">
                {[...Array(12)].map((_, i) => {
                  const m = (i + 1).toString().padStart(2, '0');
                  const y = parseInt(rangoHasta.slice(0, 4));
                  return <option key={m} value={`${y}-${m}`}>{(i + 1)} / {y}</option>;
                })}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Año</label>
              <select value={rangoHasta.slice(0, 4)} onChange={e => setRangoHasta(`${e.target.value}-${rangoHasta.slice(5, 7)}-${rangoHasta.slice(8)}`)}
                className="w-full mt-1 px-3 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm">
                {[2021, 2022, 2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <button onClick={handleCalcularTodos} disabled={!!job}
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all disabled:bg-slate-300">
            <RefreshCw size={20} className={job ? 'animate-spin' : ''} />
            {job ? 'Calculando...' : 'Recalcular todos'}
          </button>
          {job && (
            <div className="mt-4">
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                <span>{jobMsg}</span>
                <span>{jobPct}%</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${jobPct}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:col-span-2 bg-amber-50 border border-amber-100 rounded-3xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-amber-600 mt-0.5 shrink-0" size={20} />
            <div>
              <p className="font-bold text-amber-800 mb-1">¿De dónde se importan los datos?</p>
              <p className="text-sm text-amber-700">
                Los datos se leen directamente del archivo <code className="bg-amber-100 px-2 py-0.5 rounded font-mono">Sources/ZKTimeNet.db</code> (base de datos SQLite del software ZKTimeNet).
                La ruta se configura en <code className="bg-amber-100 px-2 py-0.5 rounded font-mono">backend/.env</code> con la variable <code className="bg-amber-100 px-2 py-0.5 rounded font-mono">ZKTIMENET_DB_PATH</code>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==================== MAPPING TAB ==================== */
const MappingTab = ({ showStatus }) => {
  const [sugerencias, setSugerencias] = useState([]);
  const [vinculados, setVinculados] = useState([]);
  const [noVinculados, setNoVinculados] = useState([]);
  const [personalSinBio, setPersonalSinBio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subTab, setSubTab] = useState('sugerencias');
  const [selectedPersonal, setSelectedPersonal] = useState({});
  const [selectedSugerencias, setSelectedSugerencias] = useState(new Set());
  const [vincPorCiLoading, setVincPorCiLoading] = useState(false);
  const [resumen, setResumen] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sug, vin, nov, psb, res] = await Promise.all([
        api.get('/api/biometrico/sugerencias'),
        api.get('/api/biometrico/vinculados'),
        api.get('/api/biometrico/no-vinculados'),
        api.get('/api/biometrico/personal-sin-biometrico'),
        api.get('/api/biometrico/resumen-mapeo'),
      ]);
      setSugerencias(sug.data);
      setVinculados(vin.data);
      setNoVinculados(nov.data);
      setPersonalSinBio(psb.data);
      setResumen(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleVincular = async (usuarioId, personalId) => {
    try {
      await api.post('/api/biometrico/vincular', { usuario_id: usuarioId, personal_id: personalId });
      showStatus('success', 'Vinculación exitosa');
      fetchData();
    } catch (e) {
      showStatus('error', e.response?.data?.error || e.message);
    }
  };

  const handleDesvincular = async (personalId) => {
    if (!window.confirm('¿Desvincular este empleado del biométrico?')) return;
    try {
      await api.post('/api/biometrico/desvincular', { personal_id: personalId });
      showStatus('success', 'Vinculación eliminada');
      fetchData();
    } catch (e) {
      showStatus('error', e.response?.data?.error || e.message);
    }
  };

  const handleVincularTodosPorCI = async () => {
    if (!window.confirm('¿Vincular todos los empleados que coincidan por CI?')) return;
    setVincPorCiLoading(true);
    try {
      const res = await api.post('/api/biometrico/vincular-por-ci');
      showStatus('success', `Vinculación masiva completada: ${res.data.total} empleados vinculados por CI`);
      fetchData();
    } catch (e) {
      showStatus('error', e.response?.data?.error || e.message);
    } finally { setVincPorCiLoading(false); }
  };

  const handleVincularSeleccionados = async () => {
    const lista = sugerencias
      .filter(s => selectedSugerencias.has(s.usuario_id) && s.personal_id && !s.biometrico_actual)
      .map(s => ({ usuario_id: s.usuario_id, personal_id: s.personal_id }));
    if (lista.length === 0) {
      showStatus('error', 'No hay sugerencias seleccionables para vincular');
      return;
    }
    try {
      const res = await api.post('/api/biometrico/vincular-multiples', { lista });
      showStatus('success', `${res.data.exitosos} vinculaciones exitosas${res.data.errores?.length ? `, ${res.data.errores.length} errores` : ''}`);
      setSelectedSugerencias(new Set());
      fetchData();
    } catch (e) {
      showStatus('error', e.response?.data?.error || e.message);
    }
  };

  const toggleSugerencia = (usuarioId) => {
    setSelectedSugerencias(prev => {
      const next = new Set(prev);
      if (next.has(usuarioId)) next.delete(usuarioId);
      else next.add(usuarioId);
      return next;
    });
  };

  const toggleAllSugerencias = () => {
    const disponibles = sugerencias.filter(s => s.personal_id && !s.biometrico_actual);
    if (selectedSugerencias.size === disponibles.length) {
      setSelectedSugerencias(new Set());
    } else {
      setSelectedSugerencias(new Set(disponibles.map(s => s.usuario_id)));
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-400">Cargando datos de mapeo...</div>;

  const subTabs = [
    { id: 'sugerencias', label: `Sugerencias (${sugerencias.length})` },
    { id: 'vinculados', label: `Vinculados (${vinculados.length})` },
    { id: 'no_vinculados', label: `Sin mapear (${noVinculados.length})` },
    { id: 'manual', label: 'Vinculación Manual' },
  ];

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
          <p className="text-3xl font-black text-slate-800">{resumen?.total_biometrico || 0}</p>
          <p className="text-xs font-bold text-slate-400 uppercase mt-1">Empleados en ZK</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
          <p className="text-3xl font-black text-emerald-600">{resumen?.total_vinculados || 0}</p>
          <p className="text-xs font-bold text-slate-400 uppercase mt-1">Vinculados</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
          <p className="text-3xl font-black text-amber-600">{resumen?.sin_mapear || 0}</p>
          <p className="text-xs font-bold text-slate-400 uppercase mt-1">Sin Mapear</p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-2 items-center">
        {subTabs.map(st => (
          <button key={st.id} onClick={() => setSubTab(st.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              subTab === st.id ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
            }`}>
            {st.label}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <button onClick={handleVincularTodosPorCI} disabled={vincPorCiLoading}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all disabled:bg-slate-300">
            {vincPorCiLoading ? 'Vinculando...' : 'Vincular Todos por CI'}
          </button>
          {subTab === 'sugerencias' && selectedSugerencias.size > 0 && (
            <button onClick={handleVincularSeleccionados}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all">
              Vincular Seleccionados ({selectedSugerencias.size})
            </button>
          )}
        </div>
      </div>

      {subTab === 'sugerencias' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Sugerencias de Vinculación Automática</h3>
            <p className="text-sm text-slate-500 mt-1">Coincidencias encontradas entre empleados del biométrico y del sistema por nombre.</p>
          </div>
          {sugerencias.length === 0 ? (
            <div className="p-12 text-center text-slate-400">No hay sugerencias disponibles</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-4 py-4 w-10">
                      <input type="checkbox" checked={sugerencias.filter(s => s.personal_id && !s.biometrico_actual).length > 0 && selectedSugerencias.size === sugerencias.filter(s => s.personal_id && !s.biometrico_actual).length}
                        onChange={toggleAllSugerencias}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    </th>
                    <th className="px-6 py-4">Empleado ZK</th>
                    <th className="px-6 py-4">Departamento</th>
                    <th className="px-6 py-4">→</th>
                    <th className="px-6 py-4">Empleado Sistema</th>
                    <th className="px-6 py-4">CI</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sugerencias.map((s) => (
                    <tr key={s.usuario_id + '-' + (s.personal_id || 0)} className={`hover:bg-slate-50/50 transition-colors ${selectedSugerencias.has(s.usuario_id) ? 'bg-blue-50/50' : ''}`}>
                      <td className="px-4 py-4">
                        {s.personal_id && !s.biometrico_actual && (
                          <input type="checkbox" checked={selectedSugerencias.has(s.usuario_id)}
                            onChange={() => toggleSugerencia(s.usuario_id)}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700">
                        {s.nombre_biometrico} {s.apellidos_biometrico}
                        <div className="text-xs text-slate-400 font-mono">PIN: {s.emp_pin}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{s.dept_name || '—'}</td>
                      <td className="px-6 py-4 text-slate-300"><ChevronRight size={18} /></td>
                      <td className="px-6 py-4 font-bold text-slate-700">
                        {s.personal_id ? `${s.nombre_personal} ${s.apellido_paterno} ${s.apellido_materno || ''}` : <span className="text-rose-400 italic">Sin coincidencia</span>}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-slate-500">{s.ci || '—'}</td>
                      <td className="px-6 py-4">
                        {s.biometrico_actual ? (
                          <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">Vinculado</span>
                        ) : s.personal_id ? (
                          <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-600 rounded-full">Disponible</span>
                        ) : (
                          <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-400 rounded-full">Sin match</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {s.personal_id && !s.biometrico_actual && (
                          <button onClick={() => handleVincular(s.usuario_id, s.personal_id)}
                            className="text-xs font-bold px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                            Vincular
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {subTab === 'vinculados' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Empleados Vinculados</h3>
          </div>
          {vinculados.length === 0 ? (
            <div className="p-12 text-center text-slate-400">No hay empleados vinculados</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">PIN</th>
                  <th className="px-6 py-4">Nombre ZK</th>
                  <th className="px-6 py-4">Departamento</th>
                  <th className="px-6 py-4">Nombre Sistema</th>
                  <th className="px-6 py-4">CI</th>
                  <th className="px-6 py-4">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {vinculados.map((v) => (
                  <tr key={v.usuario_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4"><code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">{v.emp_pin}</code></td>
                    <td className="px-6 py-4 font-bold text-slate-700">{v.primer_nombre} {v.apellidos}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{v.dept_name || '—'}</td>
                    <td className="px-6 py-4 font-bold text-slate-700">{v.nombre_personal} {v.apellido_paterno}</td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-500">{v.ci}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDesvincular(v.personal_id)}
                        className="text-xs font-bold px-3 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors">
                        Desvincular
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {subTab === 'no_vinculados' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Empleados del Biométrico sin Vincular</h3>
            <p className="text-sm text-slate-500 mt-1">Estos empleados existen en ZKTimeNet pero no tienen un registro correspondiente en el sistema.</p>
          </div>
          {noVinculados.length === 0 ? (
            <div className="p-12 text-center text-slate-400">Todos los empleados están vinculados</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">PIN</th>
                  <th className="px-6 py-4">Nombre</th>
                  <th className="px-6 py-4">Departamento</th>
                  <th className="px-6 py-4">Activo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {noVinculados.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4"><code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">{u.emp_pin}</code></td>
                    <td className="px-6 py-4 font-bold text-slate-700">{u.primer_nombre} {u.apellidos}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{u.dept_name || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${u.emp_active ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {u.emp_active ? 'Sí' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {subTab === 'manual' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-2">Vinculación Manual</h3>
            <p className="text-sm text-slate-500 mb-6">Selecciona un empleado del biométrico y asígnalo a un registro del sistema.</p>
            <PersonalSelector
              noVinculados={noVinculados}
              personalSinBio={personalSinBio}
              onVincular={handleVincular}
            />
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-2">¿Cómo funciona?</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">1</div>
                <span><strong>Importa</strong> los empleados desde ZKTimeNet.db (pestaña "Importar Datos")</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">2</div>
                <span>Revisa las <strong>sugerencias automáticas</strong> por coincidencia de nombre</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">3</div>
                <span><strong>Vincula</strong> con un clic o usa la vinculación manual</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">4</div>
                <span>Ve a la pestaña <strong>"Asistencia"</strong> para ver las marcaciones de los empleados vinculados</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

const PersonalSelector = ({ noVinculados, personalSinBio, onVincular }) => {
  const [selectedZK, setSelectedZK] = useState('');
  const [selectedPersonal, setSelectedPersonal] = useState('');
  const [searchZK, setSearchZK] = useState('');
  const [searchPersonal, setSearchPersonal] = useState('');

  const filteredZK = noVinculados.filter(u =>
    !searchZK || `${u.primer_nombre} ${u.apellidos} ${u.emp_pin}`.toLowerCase().includes(searchZK.toLowerCase())
  );
  const filteredPersonal = personalSinBio.filter(p =>
    !searchPersonal || `${p.primer_nombre} ${p.apellido_paterno} ${p.ci}`.toLowerCase().includes(searchPersonal.toLowerCase())
  );

  const handleSubmit = () => {
    if (selectedZK && selectedPersonal) {
      onVincular(parseInt(selectedZK), parseInt(selectedPersonal));
      setSelectedZK('');
      setSelectedPersonal('');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Empleado del Biométrico</label>
        <input type="text" placeholder="Buscar..." value={searchZK} onChange={e => setSearchZK(e.target.value)}
          className="w-full mb-2 px-3 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
        <select value={selectedZK} onChange={e => setSelectedZK(e.target.value)}
          className="w-full px-3 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500">
          <option value="">Seleccionar...</option>
          {filteredZK.map(u => (
            <option key={u.id} value={u.id}>{u.primer_nombre} {u.apellidos} (PIN: {u.emp_pin})</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Empleado del Sistema</label>
        <input type="text" placeholder="Buscar..." value={searchPersonal} onChange={e => setSearchPersonal(e.target.value)}
          className="w-full mb-2 px-3 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
        <select value={selectedPersonal} onChange={e => setSelectedPersonal(e.target.value)}
          className="w-full px-3 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500">
          <option value="">Seleccionar...</option>
          {filteredPersonal.map(p => (
            <option key={p.id} value={p.id}>{p.primer_nombre} {p.apellido_paterno} {p.apellido_materno || ''} (CI: {p.ci})</option>
          ))}
        </select>
      </div>
      <button onClick={handleSubmit} disabled={!selectedZK || !selectedPersonal}
        className="w-full py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:bg-slate-300">
        Vincular
      </button>
    </div>
  );
};

/* ==================== ATTENDANCE TAB ==================== */
const AttendanceTab = ({ showStatus }) => {
  const hoy = () => new Date().toISOString().split('T')[0];
  const inicioMes = () => {
    const d = new Date(); d.setDate(1);
    return d.toISOString().split('T')[0];
  };
  const [desde, setDesde] = useState(inicioMes);
  const [hasta, setHasta] = useState(hoy);
  const [searchQuery, setSearchQuery] = useState('');
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [marcaciones, setMarcaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [printModal, setPrintModal] = useState({ open: false, data: null, loading: false });

  const navegarMes = (dir) => {
    const [y, m] = desde.split('-').map(Number);
    const d = new Date(y, m - 1 + dir, 1);
    const ini = new Date(d.getFullYear(), d.getMonth(), 1);
    const fin = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    setDesde(ini.toISOString().split('T')[0]);
    setHasta(fin.toISOString().split('T')[0]);
  };

  const irMesActual = () => {
    const hoy = new Date();
    const ini = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    setDesde(ini.toISOString().split('T')[0]);
    setHasta(hoy.toISOString().split('T')[0]);
  };

  const fetchPersonas = async () => {
    if (!desde || !hasta) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/biometrico/personas-por-rango?desde=${desde}&hasta=${hasta}`);
      setPersonas(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPersonas(); }, [desde, hasta]);

  const handleSelectPersona = async (personalId) => {
    setSelectedPersona(personalId);
    setSelectedIds(new Set([personalId]));
    try {
      const res = await api.get(`/api/biometrico/marcaciones-por-rango/${personalId}?desde=${desde}&hasta=${hasta}`);
      setMarcaciones(res.data);
    } catch (e) { console.error(e); }
  };

  const handlePrintPreview = async (ids) => {
    setPrintModal({ open: true, data: null, loading: true });
    try {
      const results = await Promise.all(ids.map(id =>
        api.get(`/api/biometrico/datos-impresion/${id}?desde=${desde}&hasta=${hasta}`).then(r => r.data)
      ));
      setPrintModal({ open: true, data: results, loading: false });
    } catch (e) {
      showStatus('error', e.response?.data?.error || e.message);
      setPrintModal({ open: false, data: null, loading: false });
    }
  };

  const imprimirReporte = () => {
    const lista = Array.isArray(printModal.data) ? printModal.data : [printModal.data];
    if (!lista.length) return;

    const filasTabla = (d, conCabecera) => {
      const cabecera = conCabecera
        ? `<tr class="cab">
            <th>ID</th><th>Nombre</th><th>Fecha / Hora</th><th>Estado</th><th>Tipo de Registro</th>
          </tr>`
        : '';
      const filas = d.marcaciones.map((m) => `
        <tr>
          <td class="c">${d.personal.biometrico_id ?? ''}</td>
          <td>${formatoNombre(d.personal)}</td>
          <td>${formatoFechaHoraLaPaz(m.timestamp)}</td>
          <td>Normal</td>
          <td>${etiquetaEstado(m.estado_asistencia)}</td>
        </tr>`).join('');
      return `${cabecera}${filas}`;
    };

    const secciones = lista.map((d, idx) => `
      ${idx > 0 ? '<div class="page-break"></div>' : ''}
        <table>
          <colgroup>
            <col style="width:79.5pt"><col style="width:180pt"><col style="width:96.2pt"><col style="width:58.45pt"><col style="width:auto">
          </colgroup>
          ${filasTabla(d, idx === 0)}
        </table>`).join('');

    const html = `<html><head>
      <meta charset="utf-8">
      <title>Reporte de Eventos</title>
      <style>
        @page { size: A4 portrait; margin: 31mm 12mm 18mm 12mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, 'Liberation Sans', sans-serif; font-size: 9.72pt; color: #000; }
        .titulo { text-align: center; font-size: 20pt; font-weight: 700; margin-top: 8mm; }
        .sep { border: none; border-top: 1.56pt solid #000; margin: 3mm 0 4mm 0; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 0.75pt solid #000; padding: 2.4pt 4pt; }
        thead th, tr.cab th { font-weight: 700; font-size: 9.72pt; text-align: left; }
        tr { height: 18pt; }
        .c { text-align: right; }
        .page-break { page-break-before: always; height: 0; }
        .pie { position: fixed; bottom: 0; left: 0; right: 0; display: flex; justify-content: space-between; padding: 0 4mm; font-size: 8.28pt; font-weight: 700; }
        .pie .izq { font-size: 9.72pt; font-weight: 400; }
      </style>
    </head><body>
      <h1 class="titulo">Reporte de Eventos</h1>
      <hr class="sep">
      ${secciones}
      <div class="pie"><span class="izq">Página: 1 / 1</span><span>Fecha / Hora: ${formatoFechaHoraLaPaz(new Date())}</span></div>
    </body></html>`;
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 300);
  };

  const exportarPdf = async () => {
    const lista = Array.isArray(printModal.data) ? printModal.data : [printModal.data];
    if (!lista.length) return;
    const ids = lista.map(d => d.personal.id);
    try {
      const res = await api.post('/api/reportes/eventos', { ids, desde, hasta }, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_eventos_${desde}_${hasta}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showStatus('success', 'PDF generado correctamente');
    } catch (e) {
      showStatus('error', e.response?.data?.error || e.message);
    }
  };

  const generarContrato = async (ids) => {
    const res = await api.post('/api/reportes/asistencia/contrato', { ids, desde, hasta }, { responseType: 'blob' });
    return res.data;
  };

  const exportarPdfContrato = async (ids) => {
    try {
      const blob = await generarContrato(ids);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_eventos_retrasos_faltas_${desde}_${hasta}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showStatus('success', 'PDF generado correctamente');
    } catch (e) {
      showStatus('error', e.response?.data?.error || e.message);
    }
  };

  const previsualizarContrato = async (ids) => {
    try {
      const blob = await generarContrato(ids);
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (!win) showStatus('error', 'Bloqueador de popups: permite las ventanas emergentes');
    } catch (e) {
      showStatus('error', e.response?.data?.error || e.message);
    }
  };

  const toggleSeleccion = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleTodos = () => {
    if (selectedIds.size === filteredPersonas.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredPersonas.map(p => p.id)));
    }
  };

  const filteredPersonas = personas.filter(p =>
    !searchQuery ||
    `${p.primer_nombre} ${p.apellido_paterno} ${p.apellido_materno || ''} ${p.ci}`
      .toLowerCase().includes(searchQuery.toLowerCase())
  );

  const personaActual = personas.find(p => p.id === selectedPersona);

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-end">
        <div className="w-56 space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase">Buscar</label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Nombre o CI..."
              className="w-full pl-9 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="w-44 space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase">Desde</label>
          <input type="date" value={desde} onChange={e => { setDesde(e.target.value); setSelectedPersona(null); }}
            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="w-44 space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase">Hasta</label>
          <input type="date" value={hasta} onChange={e => { setHasta(e.target.value); setSelectedPersona(null); }}
            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex gap-1 items-end pb-1">
          <button onClick={() => navegarMes(-1)}
            className="px-3 py-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors text-sm font-bold">
            ◀
          </button>
          <button onClick={irMesActual}
            className="px-3 py-3 bg-slate-50 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-colors text-xs font-bold">
            Este Mes
          </button>
          <button onClick={() => navegarMes(1)}
            className="px-3 py-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors text-sm font-bold">
            ▶
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personas */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800">Personal con Asistencia</h3>
                  <p className="text-xs text-slate-400 mt-1">{filteredPersonas.length} de {personas.length} registrados</p>
                </div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 cursor-pointer select-none">
                  <input type="checkbox" checked={filteredPersonas.length > 0 && selectedIds.size === filteredPersonas.length}
                    onChange={toggleTodos}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  {selectedIds.size === filteredPersonas.length ? 'Ninguno' : 'Todos'}
                </label>
              </div>
            </div>
            <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-slate-400">Cargando...</div>
              ) : filteredPersonas.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <Clock size={32} className="mx-auto mb-2 opacity-30" />
                  {personas.length === 0 ? 'Sin datos en este rango' : 'Sin resultados'}
                </div>
              ) : (
                filteredPersonas.map(p => (
                  <div key={p.id}
                    className={`flex items-center gap-2 px-2 hover:bg-slate-50 transition-colors cursor-pointer ${
                      selectedPersona === p.id ? 'bg-blue-50' : ''
                    }`}>
                    <input type="checkbox" checked={selectedIds.has(p.id)}
                      onChange={() => toggleSeleccion(p.id)}
                      className="ml-2 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <button onClick={() => handleSelectPersona(p.id)}
                      className={`flex-1 text-left py-4 flex items-center gap-3 ${
                        selectedPersona === p.id ? 'border-l-4 border-blue-600 pl-2' : 'pl-3'
                      }`}>
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0">
                        {p.primer_nombre?.[0]}{p.apellido_paterno?.[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-slate-700 truncate">{p.primer_nombre} {p.apellido_paterno}</p>
                        <p className="text-xs text-slate-400 font-mono">CI: {p.ci}</p>
                      </div>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Marcaciones */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-800">
                    {selectedPersona ? `Marcaciones de ${personaActual?.primer_nombre || ''} ${personaActual?.apellido_paterno || ''}` : 'Selecciona un empleado'}
                  </h3>
                  {selectedPersona && (
                    <p className="text-xs text-slate-400 mt-1">{marcaciones.length} registros del {new Date(desde).toLocaleDateString()} al {new Date(hasta).toLocaleDateString()}</p>
                  )}
                </div>
                {selectedPersona && marcaciones.length > 0 && (
                  <button onClick={() => handlePrintPreview([selectedPersona])}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors">
                    <FileSpreadsheet size={16} />
                    Imprimir
                  </button>
                )}
                {selectedIds.size > 0 && (
                  <button onClick={() => handlePrintPreview([...selectedIds])}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors">
                    <FileSpreadsheet size={16} />
                    Imprimir ({selectedIds.size})
                  </button>
                )}
                {selectedIds.size > 0 && (
                  <button onClick={() => exportarPdfContrato([...selectedIds])}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-bold hover:bg-amber-700 transition-colors">
                    <FileDown size={16} />
                    Reporte por Contrato ({selectedIds.size})
                  </button>
                )}
                {selectedIds.size > 0 && (
                  <button onClick={() => previsualizarContrato([...selectedIds])}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-300 transition-colors">
                    <Eye size={16} />
                    Vista Previa ({selectedIds.size})
                  </button>
                )}
              </div>
            </div>
            {!selectedPersona ? (
              <div className="p-12 text-center text-slate-300">
                <BarChart3 size={48} className="mx-auto mb-4 opacity-20" />
                Selecciona un empleado de la lista para ver sus marcaciones
              </div>
            ) : marcaciones.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Clock size={32} className="mx-auto mb-2 opacity-30" />
                Sin marcaciones en este rango de fechas
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-white">
                    <tr className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Fecha</th>
                      <th className="px-6 py-4">Hora</th>
                      <th className="px-6 py-4">Tipo</th>
                      <th className="px-6 py-4">Origen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {marcaciones.map((m, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-700">
                          {new Date(m.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-600">
                          {new Date(m.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            m.estado_asistencia === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                            {m.estado_asistencia === 0 ? 'Entrada' : 'Salida'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            m.origen === 'HISTORICO' ? 'bg-purple-50 text-purple-600' : 'bg-sky-50 text-sky-600'
                          }`}>
                            {m.origen}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de previsualización de impresión */}
      {printModal.open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 print:relative print:inset-auto print:block print:bg-white print:p-0">
          <style>{`
            .reporte-titulo { font-family: Arial, 'Liberation Sans', sans-serif; font-size: 20pt; font-weight: 700; text-align: center; color: #000; margin: 0; }
            .reporte-sep { border: none; border-top: 1.56pt solid #000; margin: 8pt 0 10pt; }
            .reporte-tabla { width: 100%; border-collapse: collapse; font-family: Arial, 'Liberation Sans', sans-serif; font-size: 9.72pt; color: #000; }
            .reporte-tabla td { border: 0.75pt solid #000; padding: 2.4pt 4pt; height: 18pt; }
            .reporte-cab td { font-weight: 700; }
            .page-break { page-break-before: always; }
            .reporte-pie-screen { margin-top: 12pt; text-align: right; font-family: Arial, 'Liberation Sans', sans-serif; font-size: 8.28pt; font-weight: 700; color: #000; }
            .reporte-pie-print { display: none; }
            @media print {
              .print-modal-wrap { position: relative !important; inset: auto !important; display: block !important; align-items: flex-start !important; justify-content: flex-start !important; background: white !important; padding: 0 !important; }
              .print-modal-inner { box-shadow: none !important; border-radius: 0 !important; max-height: none !important; overflow: visible !important; height: auto !important; }
              .print-modal-body { overflow: visible !important; padding: 0 !important; }
              .reporte-pie-screen { display: none !important; }
              .reporte-pie-print { display: flex !important; position: fixed; bottom: 0; left: 0; right: 0; justify-content: flex-end; padding: 0 36pt 6pt; font-family: Arial, 'Liberation Sans', sans-serif; font-size: 8.28pt; font-weight: 700; color: #000; }
            }
          `}</style>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col print:shadow-none print:rounded-none print:max-h-none print:h-auto print-modal-inner">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center print:hidden">
              <h2 className="font-bold text-slate-800 text-lg">Reporte de Eventos</h2>
              <div className="flex gap-2">
                <button onClick={exportarPdf}
                  className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2">
                  <FileDown size={16} />
                  Exportar PDF
                </button>
                <button onClick={imprimirReporte}
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2">
                  <FileSpreadsheet size={16} />
                  Imprimir
                </button>
                <button onClick={() => setPrintModal({ open: false, data: null, loading: false })}
                  className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                  Cerrar
                </button>
              </div>
            </div>

            {/* Contenido imprimible */}
            <div id="print-content" className="p-8 overflow-y-auto print:p-0 print:overflow-visible print-modal-body">
              {printModal.loading ? (
                <div className="text-center py-12 text-slate-400">Cargando datos para impresión...</div>
              ) : printModal.data ? (
                <>
                  {/* Encabezado del reporte */}
                  <h1 className="reporte-titulo">Reporte de Eventos</h1>
                  <hr className="reporte-sep" />

                  {(Array.isArray(printModal.data) ? printModal.data : [printModal.data]).map((d, idx) => (
                    <div key={idx} className={idx > 0 ? 'page-break' : ''}>
                      <table className="reporte-tabla">
                        <colgroup>
                          <col style={{ width: '79.5pt' }} />
                          <col style={{ width: '180pt' }} />
                          <col style={{ width: '96.2pt' }} />
                          <col style={{ width: '58.45pt' }} />
                          <col style={{ width: 'auto' }} />
                        </colgroup>
                        <tbody>
                          {idx === 0 && (
                            <tr className="reporte-cab">
                              <td>ID</td>
                              <td>Nombre</td>
                              <td>Fecha / Hora</td>
                              <td>Estado</td>
                              <td>Tipo de Registro</td>
                            </tr>
                          )}
                          {d.marcaciones.map((m, i) => (
                            <tr key={i}>
                              <td className="reporte-id">{d.personal.biometrico_id ?? ''}</td>
                              <td>{formatoNombre(d.personal)}</td>
                              <td>{formatoFechaHoraLaPaz(m.timestamp)}</td>
                              <td>Normal</td>
                              <td>{etiquetaEstado(m.estado_asistencia)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}

                  {/* Pie */}
                  <div className="reporte-pie-screen">Fecha / Hora: {formatoFechaHoraLaPaz(new Date())}</div>
                  <div className="reporte-pie-print">Fecha / Hora: {formatoFechaHoraLaPaz(new Date())}</div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ==================== TURNOS TAB ==================== */
const TurnosTab = ({ showStatus }) => {
  const [turnos, setTurnos] = useState([]);
  const [personalSinTurno, setPersonalSinTurno] = useState([]);
  const [selectedPersonalId, setSelectedPersonalId] = useState(null);
  const [form, setForm] = useState({ personal_id: '', nombre: 'Turno', hora_entrada: '08:00', hora_salida: '14:00', tolerancia_minutos: 15 });
  const [verificacion, setVerificacion] = useState(null);
  const [loadingVerif, setLoadingVerif] = useState(false);
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [t, pst] = await Promise.all([
        api.get('/api/biometrico/turnos'),
        api.get('/api/biometrico/turnos/personal-sin-turno'),
      ]);
      setTurnos(t.data);
      setPersonalSinTurno(pst.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAsignar = async () => {
    if (!form.personal_id) { showStatus('error', 'Selecciona un empleado'); return; }
    try {
      await api.post('/api/biometrico/turnos/asignar', form);
      showStatus('success', 'Turno asignado correctamente');
      setForm({ personal_id: '', nombre: 'Turno', hora_entrada: '08:00', hora_salida: '14:00', tolerancia_minutos: 15 });
      fetchData();
      setVerificacion(null);
    } catch (e) {
      showStatus('error', e.response?.data?.error || e.message);
    }
  };

  const handleEliminar = async (personalId) => {
    if (!window.confirm('¿Eliminar turno de este empleado?')) return;
    try {
      await api.post('/api/biometrico/turnos/eliminar', { personal_id: personalId });
      showStatus('success', 'Turno eliminado');
      fetchData();
      setVerificacion(null);
      if (selectedPersonalId === personalId) setSelectedPersonalId(null);
    } catch (e) {
      showStatus('error', e.response?.data?.error || e.message);
    }
  };

  const handleVerificar = async (personalId) => {
    setSelectedPersonalId(personalId);
    setLoadingVerif(true);
    try {
      const res = await api.get(`/api/biometrico/turnos/verificar/${personalId}?mes=${mes}&anio=${anio}`);
      setVerificacion(res.data);
    } catch (e) {
      showStatus('error', e.response?.data?.error || e.message);
      setVerificacion(null);
    } finally { setLoadingVerif(false); }
  };

  const handleEditTurno = (turno) => {
    setForm({
      personal_id: turno.personal_id,
      nombre: turno.nombre,
      hora_entrada: turno.hora_entrada.slice(0, 5),
      hora_salida: turno.hora_salida.slice(0, 5),
      tolerancia_minutos: turno.tolerancia_minutos || 15,
    });
  };

  const meses = [
    { id: 1, nombre: 'Enero' }, { id: 2, nombre: 'Febrero' }, { id: 3, nombre: 'Marzo' },
    { id: 4, nombre: 'Abril' }, { id: 5, nombre: 'Mayo' }, { id: 6, nombre: 'Junio' },
    { id: 7, nombre: 'Julio' }, { id: 8, nombre: 'Agosto' }, { id: 9, nombre: 'Septiembre' },
    { id: 10, nombre: 'Octubre' }, { id: 11, nombre: 'Noviembre' }, { id: 12, nombre: 'Diciembre' }
  ];

  const estadoColor = {
    CUMPLE: 'bg-emerald-50 text-emerald-600',
    NO_CUMPLE: 'bg-rose-50 text-rose-600',
    ENTRADA_TARDIA: 'bg-amber-50 text-amber-600',
    SALIDA_TEMPRANO: 'bg-amber-50 text-amber-600',
    SIN_MARCACION: 'bg-slate-100 text-slate-400',
  };

  if (loading) return <div className="text-center py-20 text-slate-400">Cargando turnos...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de empleados con/sin turno */}
        <div className="lg:col-span-1 space-y-6">
          {/* Con turno */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Con Turno</h3>
              <p className="text-xs text-slate-400 mt-1">{turnos.length} empleados</p>
            </div>
            <div className="divide-y divide-slate-50 max-h-[300px] overflow-y-auto">
              {turnos.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm">Sin turnos asignados</div>
              ) : turnos.map(t => (
                <div key={t.id}
                  className={`px-4 py-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors ${selectedPersonalId === t.personal_id ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}
                  onClick={() => handleVerificar(t.personal_id)}>
                  <div>
                    <p className="font-bold text-sm text-slate-700">{t.primer_nombre} {t.apellido_paterno}</p>
                    <p className="text-xs text-slate-400 font-mono">{t.hora_entrada.slice(0,5)} - {t.hora_salida.slice(0,5)} | {t.nombre}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleEditTurno(t); }}
                    className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
                    Editar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sin turno */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Sin Turno</h3>
              <p className="text-xs text-slate-400 mt-1">{personalSinTurno.length} empleados</p>
            </div>
            <div className="divide-y divide-slate-50 max-h-[200px] overflow-y-auto">
              {personalSinTurno.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm">Todos tienen turno</div>
              ) : personalSinTurno.map(p => (
                <div key={p.id}
                  className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <p className="font-bold text-sm text-slate-700">{p.primer_nombre} {p.apellido_paterno}</p>
                  <button onClick={() => setForm(prev => ({ ...prev, personal_id: p.id }))}
                    className="text-xs font-bold px-3 py-1.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
                    Asignar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Formulario y verificación */}
        <div className="lg:col-span-2 space-y-6">
          {/* Formulario de asignación */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">
              {form.personal_id ? 'Editar / Asignar Turno' : 'Asignar Nuevo Turno'}
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Empleado</label>
                <select value={form.personal_id} onChange={e => setForm({...form, personal_id: e.target.value})}
                  className="w-full px-3 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                  <option value="">Seleccionar...</option>
                  {personalSinTurno.map(p => (
                    <option key={p.id} value={p.id}>{p.primer_nombre} {p.apellido_paterno}</option>
                  ))}
                  {turnos.map(t => (
                    <option key={t.personal_id} value={t.personal_id}>{t.primer_nombre} {t.apellido_paterno}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Nombre</label>
                <input type="text" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}
                  className="w-full px-3 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Entrada</label>
                <input type="time" value={form.hora_entrada} onChange={e => setForm({...form, hora_entrada: e.target.value})}
                  className="w-full px-3 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Salida</label>
                <input type="time" value={form.hora_salida} onChange={e => setForm({...form, hora_salida: e.target.value})}
                  className="w-full px-3 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <button onClick={handleAsignar}
                disabled={!form.personal_id}
                className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-slate-300">
                {form.personal_id && turnos.find(t => t.personal_id === parseInt(form.personal_id)) ? 'Actualizar' : 'Asignar'}
              </button>
            </div>
          </div>

          {/* Filtro mes/año para verificación */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-end">
            <div className="w-44 space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Mes</label>
              <select value={mes} onChange={e => { setMes(parseInt(e.target.value)); setVerificacion(null); }}
                className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm">
                {meses.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
              </select>
            </div>
            <div className="w-32 space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Año</label>
              <input type="number" value={anio} onChange={e => { setAnio(parseInt(e.target.value)); setVerificacion(null); }}
                className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            {selectedPersonalId && (
              <button onClick={() => handleVerificar(selectedPersonalId)}
                className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">
                Verificar
              </button>
            )}
          </div>

          {/* Resultado de verificación */}
          {loadingVerif && <div className="text-center py-8 text-slate-400">Verificando asistencia...</div>}

          {verificacion && !loadingVerif && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">
                  Verificación - {verificacion.turno.nombre}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Turno: {verificacion.turno.hora_entrada.slice(0,5)} a {verificacion.turno.hora_salida.slice(0,5)}
                  {' '}| Tolerancia: {verificacion.turno.tolerancia_minutos} min
                </p>
                <div className="flex gap-3 mt-2">
                  <span className="text-xs px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full font-bold">
                    Cumple: {verificacion.resumen.cumple}
                  </span>
                  <span className="text-xs px-3 py-1 bg-amber-50 text-amber-600 rounded-full font-bold">
                    Observado: {verificacion.resumen.no_cumple}
                  </span>
                  <span className="text-xs px-3 py-1 bg-slate-100 text-slate-400 rounded-full font-bold">
                    Sin marcación: {verificacion.resumen.sin_marcacion}
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-white">
                    <tr className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Día</th>
                      <th className="px-6 py-4">Fecha</th>
                      <th className="px-6 py-4">Entrada</th>
                      <th className="px-6 py-4">Salida</th>
                      <th className="px-6 py-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {verificacion.verificacion.map((v, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-3 font-bold text-slate-500">{v.dia}</td>
                        <td className="px-6 py-3 text-slate-600">{new Date(v.fecha).toLocaleDateString()}</td>
                        <td className="px-6 py-3 font-mono text-sm text-slate-600">{v.entrada || '—'}</td>
                        <td className="px-6 py-3 font-mono text-sm text-slate-600">{v.salida || '—'}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${estadoColor[v.estado] || 'bg-slate-100 text-slate-400'}`}>
                            {v.estado === 'CUMPLE' ? 'OK' :
                             v.estado === 'ENTRADA_TARDIA' ? 'Tardanza' :
                             v.estado === 'SALIDA_TEMPRANO' ? 'Sal. Temp.' :
                             v.estado === 'NO_CUMPLE' ? 'No Cumple' :
                             v.estado === 'SIN_MARCACION' ? 'Sin marca' : v.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BiometricoPage;