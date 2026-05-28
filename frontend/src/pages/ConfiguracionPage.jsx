import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Save, Plus, Trash2, Settings, Clock, FileBadge,
  Sliders, Sun, AlertTriangle, RefreshCw, Users
} from 'lucide-react';

const TABS = [
  { id: 'asistencia', label: 'Asistencia', icon: <Clock size={18} /> },
  { id: 'permisos', label: 'Tipos de Permiso', icon: <FileBadge size={18} /> },
  { id: 'general', label: 'General', icon: <Settings size={18} /> },
];

export default function ConfiguracionPage() {
  const { authAxios, usuario } = useAuth();
  const api = authAxios();
  const [activeTab, setActiveTab] = useState('asistencia');
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
      setTimeout(() => setSaved(false), 3000);
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

  const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";
  const cardClass = "bg-white rounded-xl border border-slate-200 shadow-sm";

  if (loading) return <div className="p-8 text-slate-400">Cargando...</div>;

  if (!usuario?.roles?.includes('ADMIN')) {
    return <div className="p-8 text-center"><h2 className="text-xl font-bold text-red-600">Acceso Denegado</h2></div>;
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            <Settings size={28} className="text-slate-600" /> Configuración del Sistema
          </h1>
          <p className="text-slate-500 mt-1">Parámetros generales, tolerancias y tipos de permiso</p>
        </div>
        <button onClick={handleSaveAll} disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
          <Save size={16} />
          {saving ? 'Guardando...' : 'Guardar Todo'}
        </button>
      </div>

      {saved && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <Sliders size={16} /> Configuración guardada correctamente
        </div>
      )}

      <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-slate-200 shadow-sm w-fit">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'asistencia' && (
        <div className="space-y-6">
          <div className={cardClass + " p-6"}>
            <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Clock size={18} /> Tolerancias
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['tolerancia_atraso_default', 'tolerancia_falta_default', 'salida_adelantada_default',
                'puntualidad_default', 'max_extra_default', 'dias_laborales_mes',
                'umbral_maximo_atraso_horas', 'umbral_fuera_horario_min', 'ventana_marcas_duplicadas_min',
                'duracion_turno_default_min'].map(clave => {
                const item = config.find(c => c.clave === clave);
                if (!item) return null;
                return (
                  <div key={clave}>
                    <label className={labelClass}>{item.descripcion || clave}</label>
                    <input type="number" value={getVal(clave)}
                      onChange={e => handleChange(clave, e.target.value)}
                      className={inputClass} min={0} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className={cardClass + " p-6"}>
            <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Sun size={18} /> Ventanas de Búsqueda (horas)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['ventana_busqueda_diurna_h', 'ventana_busqueda_nocturna_h',
                'ventana_detalle_diario_antes_h', 'ventana_detalle_diario_despues_h',
                'ventana_reporte_biometrico_h', 'ventana_sin_marcacion_inicio_h',
                'ventana_sin_marcacion_fin_h'].map(clave => {
                const item = config.find(c => c.clave === clave);
                if (!item) return null;
                return (
                  <div key={clave}>
                    <label className={labelClass}>{item.descripcion || clave}</label>
                    <input type="number" value={getVal(clave)}
                      onChange={e => handleChange(clave, e.target.value)}
                      className={inputClass} min={0} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'permisos' && (
        <div className={cardClass + " p-6"}>
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Tipos de Permiso / Licencia</h2>

          <div className="flex gap-2 mb-6 flex-wrap">
            <input type="text" value={nuevoTipo.nombre}
              onChange={e => setNuevoTipo(f => ({ ...f, nombre: e.target.value }))}
              placeholder="Nombre del tipo..." className="flex-1 min-w-[200px] px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" value={nuevoTipo.descripcion}
              onChange={e => setNuevoTipo(f => ({ ...f, descripcion: e.target.value }))}
              placeholder="Descripción..." className="flex-1 min-w-[200px] px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="color" value={nuevoTipo.color}
              onChange={e => setNuevoTipo(f => ({ ...f, color: e.target.value }))}
              className="w-10 h-10 p-1 border border-slate-300 rounded-lg cursor-pointer" />
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={nuevoTipo.requiere_documento}
                onChange={e => setNuevoTipo(f => ({ ...f, requiere_documento: e.target.checked }))} />
              Requiere doc.
            </label>
            <button onClick={handleAddTipo}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1">
              <Plus size={16} /> Agregar
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="pb-3 font-semibold">Código</th>
                  <th className="pb-3 font-semibold">Nombre</th>
                  <th className="pb-3 font-semibold">Descripción</th>
                  <th className="pb-3 font-semibold">Color</th>
                  <th className="pb-3 font-semibold">Requiere Doc.</th>
                  <th className="pb-3 font-semibold">Activo</th>
                  <th className="pb-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {tiposPermiso.map(t => (
                  <tr key={t.id} className="border-b border-slate-100">
                    <td className="py-3 pr-3">
                      <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">{t.codigo}</span>
                    </td>
                    <td className="py-3 pr-3">
                      <input type="text" value={t.nombre}
                        onChange={e => handleUpdateTipo(t.id, 'nombre', e.target.value)}
                        className="w-full px-2 py-1 border border-slate-200 rounded text-sm" />
                    </td>
                    <td className="py-3 pr-3">
                      <input type="text" value={t.descripcion || ''}
                        onChange={e => handleUpdateTipo(t.id, 'descripcion', e.target.value)}
                        className="w-full px-2 py-1 border border-slate-200 rounded text-sm" />
                    </td>
                    <td className="py-3 pr-3">
                      <input type="color" value={t.color || '#6B7280'}
                        onChange={e => handleUpdateTipo(t.id, 'color', e.target.value)}
                        className="w-10 h-8 p-0.5 border border-slate-300 rounded cursor-pointer" />
                    </td>
                    <td className="py-3 pr-3">
                      <input type="checkbox" checked={t.requiere_documento}
                        onChange={e => handleUpdateTipo(t.id, 'requiere_documento', e.target.checked)} />
                    </td>
                    <td className="py-3 pr-3">
                      <input type="checkbox" checked={t.activo}
                        onChange={e => handleUpdateTipo(t.id, 'activo', e.target.checked)} />
                    </td>
                    <td className="py-3">
                      <button onClick={() => handleDeleteTipo(t.id)}
                        className="text-red-400 hover:text-red-600 p-1">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {tiposPermiso.length === 0 && (
                  <tr><td colSpan={7} className="py-8 text-center text-slate-400">No hay tipos de permiso registrados</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'general' && (
        <div className={cardClass + " p-6"}>
          <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Settings size={18} /> Parámetros Generales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['dashboard_mes_default', 'dashboard_anio_default',
              'cron_calculo_diario_horario', 'cron_estado_horario',
              'origen_permiso_default'].map(clave => {
              const item = config.find(c => c.clave === clave);
              if (!item) return null;
              const isNumber = item.tipo === 'integer';
              return (
                <div key={clave}>
                  <label className={labelClass}>{item.descripcion || clave}</label>
                  <input type={isNumber ? 'number' : 'text'} value={getVal(clave)}
                    onChange={e => handleChange(clave, e.target.value)}
                    className={inputClass + ' font-mono'} />
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-400 mt-4">Los cambios en horarios cron requieren reinicio del servidor.</p>
        </div>
      )}
    </div>
  );
}
