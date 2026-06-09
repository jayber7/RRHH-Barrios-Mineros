import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Save, Plus, Trash2, Settings, Clock, FileBadge,
  Sliders, RefreshCw, Users, CheckCircle2,
  Building2, ShieldCheck, MapPin, Plane, X
} from 'lucide-react';

const TABS = [
  { id: 'institucion', label: 'Institución', icon: <Building2 size={18} /> },
  { id: 'asistencia', label: 'Asistencia / Geocerca', icon: <Clock size={18} /> },
  { id: 'permisos', label: 'Tipos de Permiso', icon: <FileBadge size={18} /> },
  { id: 'vacaciones', label: 'Vacaciones', icon: <Plane size={18} /> },
  { id: 'seguridad', label: 'Seguridad', icon: <ShieldCheck size={18} /> },
  { id: 'sistema', label: 'Sistema', icon: <Settings size={18} /> },
];

export default function ConfiguracionPage() {
  const { authAxios, usuario, refreshConfig } = useAuth();
  const api = authAxios();
  const [activeTab, setActiveTab] = useState('institucion');
  const [config, setConfig] = useState([]);
  const [tiposPermiso, setTiposPermiso] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [nuevoTipo, setNuevoTipo] = useState({ nombre: '', descripcion: '', requiere_documento: false, color: '#6B7280' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [configRes, tiposRes] = await Promise.all([
        api.get('/api/configuracion'),
        api.get('/api/configuracion/tipos-permiso'),
      ]);
      setConfig(configRes.data);
      setTiposPermiso(tiposRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const getVal = (clave) => {
    const item = config.find(c => c.clave === clave);
    return item ? item.valor : '';
  };

  const handleChange = (clave, valor) => {
    setConfig(prev => prev.map(c => c.clave === clave ? { ...c, valor: String(valor) } : c));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      for (const c of config) {
        if (c.editable) {
          await api.put('/api/configuracion', { clave: c.clave, valor: c.valor });
        }
      }
      setSaved(true);
      await refreshConfig();
      setTimeout(() => setSaved(false), 3000);
      fetchData();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleAddTipo = async () => {
    if (!nuevoTipo.nombre.trim()) return;
    try {
      const res = await api.post('/api/configuracion/tipos-permiso', nuevoTipo);
      setTiposPermiso([...tiposPermiso, res.data]);
      setNuevoTipo({ nombre: '', descripcion: '', requiere_documento: false, color: '#6B7280' });
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleUpdateTipo = async (id, field, value) => {
    try {
      const res = await api.put(`/api/configuracion/tipos-permiso/${id}`, { [field]: value });
      setTiposPermiso(prev => prev.map(t => t.id === id ? res.data : t));
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteTipo = async (id) => {
    if (!confirm('¿Eliminar este tipo de permiso?')) return;
    try {
      await api.delete(`/api/configuracion/tipos-permiso/${id}`);
      setTiposPermiso(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  const inputClass = "w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all";
  const labelClass = "block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1";
  const cardClass = "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden";

  if (loading) return <div className="p-8 flex items-center justify-center h-64"><div className="text-slate-400 text-lg animate-pulse">Cargando configuración...</div></div>;

  const ConfigGroup = ({ title, icon, keys }) => (
    <div className={cardClass + " mb-6"}>
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
        <div className="p-1.5 bg-white rounded-lg shadow-sm text-blue-600">{icon}</div>
        <h2 className="text-sm font-bold text-slate-700">{title}</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {keys.map(clave => {
            const item = config.find(c => c.clave === clave);
            if (!item) return null;
            const isNumber = item.tipo === 'integer' || item.tipo === 'number';
            return (
              <div key={clave}>
                <label className={labelClass}>{item.descripcion || clave}</label>
                <input 
                  type={isNumber ? 'number' : 'text'} 
                  step={item.tipo === 'number' ? 'any' : '1'}
                  value={getVal(clave)}
                  onChange={e => handleChange(clave, e.target.value)}
                  className={inputClass + (item.tipo === 'string' ? '' : ' font-mono')} 
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Configuración</h1>
          <p className="text-slate-500 mt-1">Panel centralizado de parámetros del sistema</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm animate-in fade-in slide-in-from-right-4">
              <CheckCircle2 size={18} /> Cambios guardados
            </div>
          )}
          <button onClick={handleSaveAll} disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/25">
            <Save size={18} />
            {saving ? 'Guardando...' : 'Guardar Todo'}
          </button>
        </div>
      </div>

      <div className="flex gap-1 mb-8 bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm w-fit overflow-x-auto max-w-full">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === t.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'institucion' && (
        <ConfigGroup 
          title="Identidad Institucional" 
          icon={<Building2 size={18} />}
          keys={['institucion_nombre', 'institucion_nit', 'institucion_direccion', 'institucion_logo_url']}
        />
      )}

      {activeTab === 'asistencia' && (
        <div className="space-y-6">
          <ConfigGroup 
            title="Tolerancias de Asistencia" 
            icon={<Clock size={18} />}
            keys={['tolerancia_atraso_default', 'tolerancia_falta_default', 'salida_adelantada_default', 'puntualidad_default', 'max_extra_default', 'dias_laborales_mes']}
          />
          <ConfigGroup 
            title="Geolocalización (Geocerca)" 
            icon={<MapPin size={18} />}
            keys={['geofence_lat', 'geofence_lon', 'geofence_radio_m']}
          />
          <ConfigGroup 
            title="Algoritmos de Búsqueda" 
            icon={<RefreshCw size={18} />}
            keys={['ventana_busqueda_diurna_h', 'ventana_busqueda_nocturna_h', 'ventana_marcas_duplicadas_min', 'umbral_maximo_atraso_horas', 'umbral_fuera_horario_min']}
          />
        </div>
      )}

      {activeTab === 'permisos' && (
        <div className={cardClass}>
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <div className="p-1.5 bg-white rounded-lg shadow-sm text-blue-600"><FileBadge size={18} /></div>
            <h2 className="text-sm font-bold text-slate-700">Tipos de Permiso / Licencia</h2>
          </div>
          <div className="p-6">
            <div className="flex gap-3 mb-8 bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-300">
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Nombre</label>
                    <input type="text" value={nuevoTipo.nombre}
                      onChange={e => setNuevoTipo(f => ({ ...f, nombre: e.target.value }))}
                      placeholder="Ej: Vacaciones Extra" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Color Representativo</label>
                    <div className="flex gap-2">
                      <input type="color" value={nuevoTipo.color}
                        onChange={e => setNuevoTipo(f => ({ ...f, color: e.target.value }))}
                        className="w-10 h-10 p-1 bg-white border border-slate-200 rounded-lg cursor-pointer" />
                      <input type="text" value={nuevoTipo.color} readOnly className={inputClass + " font-mono"} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Descripción</label>
                  <input type="text" value={nuevoTipo.descripcion}
                    onChange={e => setNuevoTipo(f => ({ ...f, descripcion: e.target.value }))}
                    placeholder="Descripción breve..." className={inputClass} />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={nuevoTipo.requiere_documento}
                      onChange={e => setNuevoTipo(f => ({ ...f, requiere_documento: e.target.checked }))}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Requiere adjuntar documento (PDF/Imagen)</span>
                  </label>
                </div>
              </div>
              <div className="flex flex-col justify-end">
                <button onClick={handleAddTipo}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all">
                  <Plus size={18} /> Agregar Tipo
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100">
                    <th className="p-3 text-left">Código</th>
                    <th className="p-3 text-left">Nombre</th>
                    <th className="p-3 text-left">Descripción</th>
                    <th className="p-3 text-center">Color</th>
                    <th className="p-3 text-center">Doc.</th>
                    <th className="p-3 text-center">Activo</th>
                    <th className="p-3 text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  {tiposPermiso.map(t => (
                    <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-mono text-xs text-slate-400">{t.codigo}</td>
                      <td className="p-3">
                        <input type="text" value={t.nombre}
                          onChange={e => handleUpdateTipo(t.id, 'nombre', e.target.value)}
                          className="bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded px-2 py-1 w-full font-bold text-slate-700" />
                      </td>
                      <td className="p-3">
                        <input type="text" value={t.descripcion || ''}
                          onChange={e => handleUpdateTipo(t.id, 'descripcion', e.target.value)}
                          className="bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded px-2 py-1 w-full text-slate-500" />
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center">
                          <input type="color" value={t.color || '#6B7280'}
                            onChange={e => handleUpdateTipo(t.id, 'color', e.target.value)}
                            className="w-8 h-8 p-0.5 bg-white border border-slate-200 rounded-lg cursor-pointer" />
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <input type="checkbox" checked={t.requiere_documento}
                          onChange={e => handleUpdateTipo(t.id, 'requiere_documento', e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                      </td>
                      <td className="p-3 text-center">
                        <input type="checkbox" checked={t.activo}
                          onChange={e => handleUpdateTipo(t.id, 'activo', e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                      </td>
                      <td className="p-3 text-center">
                        <button onClick={() => handleDeleteTipo(t.id)}
                          className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'vacaciones' && (
        <ConfigGroup 
          title="Reglas de Vacaciones" 
          icon={<Plane size={18} />}
          keys={['vacaciones_dias_anuales']}
        />
      )}

      {activeTab === 'seguridad' && (
        <ConfigGroup 
          title="Roles y Seguridad" 
          icon={<ShieldCheck size={18} />}
          keys={['seguridad_rol_admin', 'seguridad_rol_default']}
        />
      )}

      {activeTab === 'sistema' && (
        <ConfigGroup 
          title="Parámetros del Sistema" 
          icon={<Settings size={18} />}
          keys={['dashboard_mes_default', 'dashboard_anio_default', 'cron_calculo_diario_horario', 'cron_estado_horario', 'origen_permiso_default']}
        />
      )}
    </div>
  );
}
