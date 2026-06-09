import React, { useState, useEffect } from 'react';
import { 
  Cpu, Settings, RefreshCw, Database, 
  Upload, AlertTriangle, CheckCircle2,
  Clock, Activity, Download, Search,
  ArrowRight, X, FileText
} from 'lucide-react';
import { API_BASE_URL, authFetch } from '../config/api';

const TABS = [
  { id: 'dispositivo', label: 'Dispositivo', icon: Settings },
  { id: 'importar', label: 'Importar', icon: Upload },
  { id: 'validaciones', label: 'Validaciones', icon: AlertTriangle },
  { id: 'logs', label: 'Marcaciones', icon: Activity },
];

const BiometricoPage = () => {
  const [activeTab, setActiveTab] = useState('dispositivo');
  const [config, setConfig] = useState({ ip_address: '', port: 4370, comms_key: '0' });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchConfig();
    fetchLogs();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await authFetch(`${API_BASE_URL}/api/biometrico/config`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.ip_address) setConfig(data);
      }
    } catch (e) {
      console.error('Error fetching config:', e);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await authFetch(`${API_BASE_URL}/api/biometrico/raw-logs`);
      if (res.ok) {
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []);
      } else {
        setLogs([]);
      }
    } catch (e) {
      console.error('Error fetching logs:', e);
      setLogs([]);
    }
  };

  const handleUpdateConfig = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/api/biometrico/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) setStatus({ type: 'success', text: 'Configuración guardada' });
    } catch (e) {
      setStatus({ type: 'error', text: 'Error al conectar con el servidor' });
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setLoading(true);
    setStatus({ type: 'info', text: 'Conectando con el equipo y extrayendo logs...' });
    try {
      const res = await authFetch(`${API_BASE_URL}/api/biometrico/sync-logs`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', text: `Sincronización completa. Recibidos: ${data.totalRecibidos}, Nuevos: ${data.nuevosGuardados}` });
        fetchLogs();
      } else {
        throw new Error(data.error);
      }
    } catch (e) {
      setStatus({ type: 'error', text: e.message });
    } finally {
      setLoading(false);
    }
  };

  const showStatus = (type, text) => {
    setStatus({ type, text });
    setTimeout(() => setStatus(null), 5000);
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Módulo Biométrico</h1>
          <p className="text-slate-500 mt-1">Sincronización, importación y validación de marcaciones</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-slate-200">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
                activeTab === tab.id 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {status && (
        <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border ${
          status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 
          status.type === 'info' ? 'bg-blue-50 border-blue-100 text-blue-700' :
          'bg-rose-50 border-rose-100 text-rose-700'
        }`}>
          {status.type === 'success' ? <CheckCircle2 size={18} /> : status.type === 'info' ? <RefreshCw size={18} className="animate-spin" /> : <X size={18} />}
          <p className="text-sm font-medium">{status.text}</p>
        </div>
      )}

      {activeTab === 'dispositivo' && (
        <DispositivoTab config={config} setConfig={setConfig} onSave={handleUpdateConfig} onSync={handleSync} loading={loading} />
      )}

      {activeTab === 'importar' && (
        <ImportarTab showStatus={showStatus} onImported={fetchLogs} />
      )}

      {activeTab === 'validaciones' && (
        <ValidacionesTab showStatus={showStatus} />
      )}

      {activeTab === 'logs' && (
        <LogsTab logs={logs} />
      )}
    </div>
  );
};

const DispositivoTab = ({ config, setConfig, onSave, onSync, loading }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-1 space-y-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Cpu size={20} /></div>
          <h3 className="font-bold text-slate-800 text-lg">Dispositivo ZKTeco</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Dirección IP</label>
            <input 
              type="text" 
              value={config.ip_address}
              onChange={e => setConfig({...config, ip_address: e.target.value})}
              className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Ej. 192.168.1.201"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Puerto</label>
              <input 
                type="number" 
                value={config.port}
                onChange={e => setConfig({...config, port: parseInt(e.target.value)})}
                className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Comms Key</label>
              <input 
                type="text" 
                value={config.comms_key}
                onChange={e => setConfig({...config, comms_key: e.target.value})}
                className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
          <button 
            onClick={onSave}
            className="w-full py-3 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 transition-colors"
          >
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>

    <div className="lg:col-span-2">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><RefreshCw size={20} /></div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Sincronización</h3>
            <p className="text-sm text-slate-400">Extrae todas las marcaciones del equipo biométrico</p>
          </div>
        </div>
        <button 
          onClick={onSync}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all disabled:bg-slate-300 text-lg"
        >
          <RefreshCw size={22} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Sincronizando...' : 'Sincronizar Logs'}
        </button>
      </div>
    </div>
  </div>
);

const ImportarTab = ({ showStatus, onImported }) => {
  const [inputMode, setInputMode] = useState('json');
  const [jsonInput, setJsonInput] = useState('');
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);

  const sampleJson = JSON.stringify([
    { biometrico_id: 3119968, timestamp: '2026-04-15 08:00:00', verificacion_tipo: 0, estado_asistencia: 0 },
    { biometrico_id: 3119968, timestamp: '2026-04-15 12:00:00', verificacion_tipo: 0, estado_asistencia: 1 }
  ], null, 2);

  const handleImport = async () => {
    let marcas;
    if (inputMode === 'json') {
      try {
        marcas = JSON.parse(jsonInput);
        if (!Array.isArray(marcas)) throw new Error('Debe ser un array');
      } catch (e) {
        showStatus('error', `JSON inválido: ${e.message}`);
        return;
      }
    } else {
      if (!file) {
        showStatus('error', 'Selecciona un archivo CSV');
        return;
      }
      const text = await file.text();
      const lines = text.trim().split('\n');
      if (lines.length < 2) {
        showStatus('error', 'CSV vacío o sin datos');
        return;
      }
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const bioIdx = headers.indexOf('biometrico_id');
      const tsIdx = headers.indexOf('timestamp');
      if (bioIdx === -1 || tsIdx === -1) {
        showStatus('error', 'CSV debe tener columnas: biometrico_id, timestamp');
        return;
      }
      marcas = lines.slice(1).map(line => {
        const cols = line.split(',').map(c => c.trim());
        return {
          biometrico_id: parseInt(cols[bioIdx]),
          timestamp: cols[tsIdx],
          verificacion_tipo: parseInt(cols[headers.indexOf('verificacion_tipo')]) || 0,
          estado_asistencia: parseInt(cols[headers.indexOf('estado_asistencia')]) || 0,
          device_ip: cols[headers.indexOf('device_ip')] || 'CSV_IMPORT'
        };
      });
    }

    setImporting(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/api/biometrico/import-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marcas })
      });
      const data = await res.json();
      if (res.ok) {
        showStatus('success', `Importados: ${data.insertados}, Omitidos: ${data.omitidos}, Errores: ${data.errores}`);
        onImported();
      } else {
        throw new Error(data.error);
      }
    } catch (e) {
      showStatus('error', e.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-violet-50 rounded-lg text-violet-600"><Upload size={20} /></div>
          <h3 className="font-bold text-slate-800 text-lg">Importación Manual</h3>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setInputMode('json')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              inputMode === 'json' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-500'
            }`}
          >JSON</button>
          <button
            onClick={() => setInputMode('csv')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              inputMode === 'csv' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-500'
            }`}
          >CSV</button>
        </div>

        {inputMode === 'json' ? (
          <div>
            <textarea
              value={jsonInput}
              onChange={e => setJsonInput(e.target.value)}
              className="w-full h-64 px-4 py-3 bg-slate-50 border-none rounded-2xl font-mono text-sm focus:ring-2 focus:ring-violet-500 transition-all"
              placeholder={sampleJson}
            />
            <p className="text-xs text-slate-400 mt-2">
              Array de objetos con: biometrico_id, timestamp (YYYY-MM-DD HH:mm:ss), verificacion_tipo (opcional), estado_asistencia (opcional)
            </p>
          </div>
        ) : (
          <div>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center hover:border-violet-300 transition-colors">
              <input
                type="file"
                accept=".csv"
                onChange={e => setFile(e.target.files[0])}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <FileText size={40} className="mx-auto mb-4 text-slate-300" />
                <p className="font-bold text-slate-600">{file ? file.name : 'Seleccionar archivo CSV'}</p>
                <p className="text-sm text-slate-400 mt-1">Columnas requeridas: biometrico_id, timestamp</p>
              </label>
            </div>
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={importing}
          className="mt-6 w-full py-3 bg-violet-600 text-white rounded-2xl font-bold hover:bg-violet-700 transition-all disabled:bg-slate-300 flex items-center justify-center gap-2"
        >
          <Upload size={18} />
          {importing ? 'Importando...' : 'Importar Marcaciones'}
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><FileText size={20} /></div>
          <h3 className="font-bold text-slate-800 text-lg">Formato Esperado</h3>
        </div>
        <div className="bg-slate-50 rounded-2xl p-6 font-mono text-sm">
          <p className="text-slate-500 mb-2">JSON:</p>
          <pre className="text-slate-700">{sampleJson}</pre>
          <hr className="my-4 border-slate-200" />
          <p className="text-slate-500 mb-2">CSV:</p>
          <pre className="text-slate-700">
biometrico_id,timestamp,verificacion_tipo,estado_asistencia{'\n'}
3119968,2026-04-15 08:00:00,0,0{'\n'}
3119968,2026-04-15 12:00:00,0,1
          </pre>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-2xl text-sm text-blue-700">
          <strong>Nota:</strong> Los duplicados (mismo biometrico_id + timestamp) se omiten automáticamente. No se eliminan registros existentes.
        </div>
      </div>
    </div>
  );
};

const ValidacionesTab = ({ showStatus }) => {
  const [fechaInicio, setFechaInicio] = useState('2026-04-01');
  const [fechaFin, setFechaFin] = useState('2026-04-30');
  const [personalId, setPersonalId] = useState('');
  const [validando, setValidando] = useState(false);
  const [resultado, setResultado] = useState(null);

  const handleValidar = async () => {
    setValidando(true);
    try {
      let url = `${API_BASE_URL}/api/biometrico/validaciones?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
      if (personalId) url += `&personal_id=${personalId}`;
      const res = await authFetch(url);
      const data = await res.json();
      if (res.ok) {
        setResultado(data);
        showStatus('success', 'Validación completada');
      } else {
        throw new Error(data.error);
      }
    } catch (e) {
      showStatus('error', e.message);
    } finally {
      setValidando(false);
    }
  };

  const hasIncidencias = resultado && (
    (resultado.resumen && resultado.resumen.total > 0) ||
    (resultado.sin_marcacion && resultado.sin_marcacion.length > 0)
  );

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Search size={20} /></div>
          <h3 className="font-bold text-slate-800 text-lg">Validar Marcaciones</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Fecha Inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
              className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Fecha Fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={e => setFechaFin(e.target.value)}
              className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Empleado (opcional)</label>
            <input
              type="number"
              value={personalId}
              onChange={e => setPersonalId(e.target.value)}
              placeholder="ID del empleado"
              className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleValidar}
              disabled={validando}
              className="w-full py-3 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all disabled:bg-slate-300 flex items-center justify-center gap-2"
            >
              {validando ? <RefreshCw size={18} className="animate-spin" /> : <Search size={18} />}
              {validando ? 'Validando...' : 'Validar'}
            </button>
          </div>
        </div>
      </div>

      {resultado && resultado.resumen && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <ResumenCard label="Sin Personal" value={resultado.resumen.sin_personal} color="rose" />
          <ResumenCard label="Duplicadas" value={resultado.resumen.duplicadas} color="amber" />
          <ResumenCard label="Fuera Horario" value={resultado.resumen.fuera_horario} color="orange" />
          <ResumenCard label="Sin Marcación" value={resultado.resumen.sin_marcacion} color="blue" />
          <ResumenCard label="3+ Marcas" value={resultado.resumen.tres_o_mas} color="purple" />
        </div>
      )}

      {resultado && resultado.resumen && resultado.resumen.sin_personal > 0 && (
        <DetalleSection title="Marcas sin Personal Vinculado" data={resultado.sin_personal} columns={['biometrico_id', 'timestamp', 'device_ip']} />
      )}
      {resultado && resultado.resumen && resultado.resumen.duplicadas > 0 && (
        <DetalleSection title="Marcas Duplicadas (5 min)" data={resultado.duplicadas} columns={['biometrico_id', 't1', 't2', 'diff_minutos', 'primer_nombre', 'apellido_paterno']} />
      )}
      {resultado && resultado.resumen && resultado.resumen.fuera_horario > 0 && (
        <DetalleSection title="Marcas Fuera de Horario" data={resultado.fuera_horario} columns={['biometrico_id', 'timestamp', 'primer_nombre', 'apellido_paterno', 'detalle']} />
      )}
      {resultado && resultado.resumen && resultado.resumen.sin_marcacion > 0 && (
        <DetalleSection title="Días sin Marcación" data={resultado.sin_marcacion} columns={['apellido_paterno', 'primer_nombre', 'fecha', 'turno_codigo']} />
      )}
      {resultado && resultado.resumen && resultado.resumen.tres_o_mas > 0 && (
        <DetalleSection title="3+ Marcas en un Día" data={resultado.tres_o_mas} columns={['biometrico_id', 'fecha', 'primer_nombre', 'apellido_paterno', 'total_marcas']} />
      )}

      {hasIncidencias === false && resultado && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-12 text-center">
          <CheckCircle2 size={48} className="mx-auto mb-4 text-emerald-400" />
          <h3 className="font-bold text-emerald-700 text-lg">Sin incidencias encontradas</h3>
          <p className="text-emerald-500 mt-1">Todas las marcaciones están vinculadas y dentro del horario esperado.</p>
        </div>
      )}
    </div>
  );
};

const ResumenCard = ({ label, value, color }) => {
  const colors = {
    rose: 'bg-rose-50 border-rose-100 text-rose-600',
    amber: 'bg-amber-50 border-amber-100 text-amber-600',
    orange: 'bg-orange-50 border-orange-100 text-orange-600',
    blue: 'bg-blue-50 border-blue-100 text-blue-600',
    purple: 'bg-purple-50 border-purple-100 text-purple-600',
  };
  return (
    <div className={`rounded-3xl border p-6 text-center ${colors[color] || colors.blue}`}>
      <p className="text-3xl font-black">{value}</p>
      <p className="text-sm font-bold mt-1">{label}</p>
    </div>
  );
};

const DetalleSection = ({ title, data, columns }) => (
  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
    <div className="px-8 py-5 border-b border-slate-100">
      <h3 className="font-bold text-slate-800">{title} ({data.length})</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
            {columns.map(col => <th key={col} className="px-6 py-3">{col}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.slice(0, 50).map((row, i) => (
            <tr key={i} className="hover:bg-slate-50/50">
              {columns.map(col => (
                <td key={col} className="px-6 py-3 text-slate-600">
                  {row[col] instanceof Date ? row[col].toLocaleString() : String(row[col] || '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 50 && (
        <div className="px-6 py-4 text-sm text-slate-400 bg-slate-50/50">
          Mostrando 50 de {data.length} registros
        </div>
      )}
    </div>
  </div>
);

const LogsTab = ({ logs }) => (
  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
    <div className="p-8 border-b border-slate-100 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Database size={20} /></div>
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Últimas Marcaciones</h3>
          <p className="text-sm text-slate-400">Últimos 100 registros sincronizados</p>
        </div>
      </div>
      <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-500 rounded-full">RAW DATA</span>
    </div>
    
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <th className="px-8 py-4">Personal</th>
            <th className="px-8 py-4">ID Biométrico</th>
            <th className="px-8 py-4">Fecha y Hora</th>
            <th className="px-8 py-4">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {logs.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-8 py-20 text-center text-slate-300">
                <Database size={48} className="mx-auto mb-4 opacity-20" />
                Aún no hay logs sincronizados en la base de datos local.
              </td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-4 font-bold text-slate-700">
                  {log.primer_nombre ? `${log.primer_nombre} ${log.apellido_paterno}` : <span className="text-rose-400 italic">No vinculado</span>}
                </td>
                <td className="px-8 py-4">
                  <code className="bg-slate-100 px-2 py-1 rounded text-blue-600 font-mono text-sm">{log.biometrico_id}</code>
                </td>
                <td className="px-8 py-4 text-slate-500 font-medium">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-8 py-4">
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
);

export default BiometricoPage;
