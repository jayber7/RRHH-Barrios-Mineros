import { useState, useEffect } from 'react';
import {
  User, Clock, Calendar, MapPin, Shield,
  AlertTriangle, CheckCircle2, X, Send,
  ChevronDown, Activity, FileText, LogOut,
  Smartphone, Navigation
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ESTADO_LABELS = { 1:'Normal', 2:'Atraso', 3:'Justificado', 4:'Falta', 5:'Nocturno', 6:'Sobretiempo', 7:'Sal. Adelantada', 8:'Incompleta', 9:'Sin Marcación' };
const ESTADO_COLORS = { 1:'text-emerald-600 bg-emerald-50', 2:'text-amber-600 bg-amber-50', 3:'text-blue-600 bg-blue-50', 4:'text-red-600 bg-red-50', 5:'text-purple-600 bg-purple-50', 6:'text-orange-600 bg-orange-50', 7:'text-rose-600 bg-rose-50', 8:'text-slate-500 bg-slate-50', 9:'text-gray-400 bg-gray-50' };

export default function SelfServicePage() {
  const { authAxios, usuario } = useAuth();
  const api = authAxios();
  const navigate = useNavigate();

  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showJustificar, setShowJustificar] = useState(false);
  const [justForm, setJustForm] = useState({ fecha: '', tipo: 'FALTA', motivo_id: '', motivo_detalle: '' });
  const [enviando, setEnviando] = useState(false);
  const [justStatus, setJustStatus] = useState(null);
  const [showAllMarcaciones, setShowAllMarcaciones] = useState(false);
  const [allMarcaciones, setAllMarcaciones] = useState([]);
  const [cargandoMarcaciones, setCargandoMarcaciones] = useState(false);
  const [horaActual, setHoraActual] = useState(new Date());
  const [ubicacion, setUbicacion] = useState(null);
  const [errorUbicacion, setErrorUbicacion] = useState(null);
  const [marcando, setMarcando] = useState(false);
  const [marcacionStatus, setMarcacionStatus] = useState(null);
  const [showJustifRemota, setShowJustifRemota] = useState(false);
  const [justifRemotaMotivo, setJustifRemotaMotivo] = useState('');

  const fetchResumen = async () => {
    try {
      const res = await api.get('/api/self-service/resumen');
      setResumen(res.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchResumen(); }, []);

  const loadAllMarcaciones = async () => {
    setCargandoMarcaciones(true);
    try {
      const res = await api.get('/api/self-service/marcaciones?limit=200');
      setAllMarcaciones(res.data);
      setShowAllMarcaciones(true);
    } catch (e) { console.error(e); }
    setCargandoMarcaciones(false);
  };

  useEffect(() => {
    const iv = setInterval(() => setHoraActual(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const detectarUbicacion = () => {
    if (!navigator.geolocation) {
      setErrorUbicacion('Geolocalización no disponible');
      return;
    }
    setErrorUbicacion(null);
    navigator.geolocation.getCurrentPosition(
      pos => setUbicacion({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => setErrorUbicacion('Permiso de ubicación denegado'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => { detectarUbicacion(); }, []);

  const handleMarcar = async () => {
    setMarcando(true);
    setMarcacionStatus(null);
    try {
      await api.post('/api/self-service/marcar', {
        latitud: ubicacion?.lat || null,
        longitud: ubicacion?.lng || null,
        device_info: navigator.userAgent || 'WEB',
      });
      setMarcacionStatus({ type: 'success', text: 'Marcación registrada correctamente' });
      fetchResumen();
    } catch (e) {
      setMarcacionStatus({ type: 'error', text: e.response?.data?.error || 'Error al marcar' });
    }
    setMarcando(false);
  };

  const handleJustificar = async () => {
    if (!justForm.fecha || !justForm.tipo) return;
    setEnviando(true);
    setJustStatus(null);
    try {
      await api.post('/api/self-service/justificar', justForm);
      setJustStatus({ type: 'success', text: 'Justificación enviada correctamente' });
      setShowJustificar(false);
      setJustForm({ fecha: '', tipo: 'FALTA', motivo_id: '', motivo_detalle: '' });
      fetchResumen();
    } catch (e) {
      setJustStatus({ type: 'error', text: e.response?.data?.error || 'Error al enviar justificación' });
    }
    setEnviando(false);
  };

  const personal = resumen?.personal;
  const marcacionesHoy = resumen?.marcaciones_hoy || [];
  const mensual = resumen?.mensual;
  const resumenMes = resumen?.resumen_mes;
  const catMotivos = resumen?.cat_motivos || [];
  const justificaciones = resumen?.justificaciones || [];

  if (loading) return <div className="p-8 flex items-center justify-center h-64"><div className="text-slate-400 text-lg">Cargando...</div></div>;
  if (!personal) return (
    <div className="p-8 bg-slate-50 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <AlertTriangle size={48} className="mx-auto mb-4 text-amber-400" />
        <h2 className="text-xl font-bold text-slate-700">Sin vinculación con personal</h2>
        <p className="text-slate-400 mt-2">Tu usuario no está vinculado a un registro de personal. Contacta al administrador.</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Mi Perfil</h1>
        <p className="text-slate-500 text-sm">Información personal, marcaciones y justificaciones</p>
      </div>

      {justStatus && (
        <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border ${
          justStatus.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
        }`}>
          {justStatus.type === 'success' ? <CheckCircle2 size={18} /> : <X size={18} />}
          <p className="text-sm font-medium">{justStatus.text}</p>
        </div>
      )}

      {marcacionStatus && (
        <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border ${
          marcacionStatus.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
        }`}>
          {marcacionStatus.type === 'success' ? <CheckCircle2 size={18} /> : <X size={18} />}
          <p className="text-sm font-medium">{marcacionStatus.text}</p>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-3xl font-black text-slate-800 font-mono tracking-wider">
                {horaActual.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {horaActual.toLocaleDateString('es-BO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-slate-200" />
            {ubicacion ? (
              <div className="flex items-center gap-2">
                <Navigation size={16} className="text-emerald-500" />
                <span className="text-sm text-slate-600">
                  Ubicación <strong className="text-emerald-600">válida</strong>
                </span>
              </div>
            ) : errorUbicacion ? (
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-amber-500" />
                <span className="text-sm text-slate-500">{errorUbicacion}</span>
                <button onClick={detectarUbicacion} className="text-xs text-blue-600 font-medium hover:underline ml-1">
                  Reintentar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-slate-300" />
                <span className="text-sm text-slate-400">Detectando ubicación...</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 font-medium">
              {marcacionesHoy.length % 2 === 0 ? 'Próxima marcación:' : 'Última marcación:'}
            </span>
            <span className={`text-sm font-black ${marcacionesHoy.length % 2 === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {marcacionesHoy.length % 2 === 0 ? 'Entrada' : 'Salida'}
            </span>
            <button onClick={handleMarcar} disabled={marcando}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-base shadow-lg transition-all ${
                marcacionesHoy.length % 2 === 0
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              } disabled:bg-slate-300 disabled:shadow-none`}>
              <Smartphone size={20} className={marcando ? 'animate-pulse' : ''} />
              {marcando ? 'Registrando...' : marcacionesHoy.length % 2 === 0 ? 'Marcar Entrada' : 'Marcar Salida'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl font-bold">
                {personal.primer_nombre?.[0]}{personal.apellido_paterno?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-slate-800 text-lg truncate">{personal.primer_nombre} {personal.apellido_paterno}</h2>
                <p className="text-sm text-slate-400 truncate">{personal.cargo_actual || 'Sin cargo'}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <FileText size={16} className="text-slate-400 flex-shrink-0" />
                <span className="text-slate-600">CI: <strong>{personal.ci}</strong></span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <MapPin size={16} className="text-slate-400 flex-shrink-0" />
                <span className="text-slate-600 truncate">{personal.unidad_servicio || 'Sin servicio'}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Shield size={16} className="text-slate-400 flex-shrink-0" />
                <span className="text-slate-600">{personal.tipo_planilla || 'Sin planilla'}</span>
              </div>
              {personal.turno_codigo && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  <Calendar size={16} className="text-blue-400 flex-shrink-0" />
                  <span className="text-blue-600">Turno: <strong>{personal.turno_codigo}</strong></span>
                </div>
              )}
              {personal.biometrico_id && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <User size={16} className="text-slate-400 flex-shrink-0" />
                  <span className="text-slate-600">ID Biométrico: <strong>{personal.biometrico_id}</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Marcaciones Hoy</p>
              <p className="text-2xl font-black text-slate-800">{marcacionesHoy.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Asistencia Mes</p>
              <p className="text-2xl font-black text-slate-800">{resumenMes?.tasa_asistencia || 0}%</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{resumenMes?.asistencias || 0}/{resumenMes?.total_dias || 0} días</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Atrasos</p>
              <p className={`text-2xl font-black ${resumenMes?.atrasos > 0 ? 'text-amber-500' : 'text-slate-800'}`}>{resumenMes?.atrasos || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Horas</p>
              <p className="text-2xl font-black text-slate-800">{mensual?.total_horas ? Math.round(mensual.total_horas) : '-'}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-700">Marcaciones de Hoy</h3>
              {marcacionesHoy.length > 0 && (
                <span className="text-xs text-slate-400">
                  {new Date(marcacionesHoy[0].timestamp).toLocaleDateString()}
                </span>
              )}
            </div>
            {marcacionesHoy.length > 0 ? (
              <div className="space-y-1.5">
                {marcacionesHoy.map((m, i) => (
                  <div key={m.id || i} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      m.estado_asistencia === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {m.estado_asistencia === 0 ? 'E' : 'S'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-700">
                        {m.estado_asistencia === 0 ? 'Entrada' : 'Salida'}
                      </p>
                      <p className="text-xs text-slate-400">{m.verificacion_tipo === 1 ? 'Huella' : m.verificacion_tipo === 15 ? 'Rostro' : 'Marca'}</p>
                    </div>
                    <span className="text-lg font-black font-mono text-slate-700">
                      {new Date(m.timestamp).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-300">
                <Clock size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Sin marcaciones registradas hoy</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-700">Resumen del Mes</h3>
            <span className="text-xs text-slate-400">{resumenMes?.total_dias || 0} días registrados</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {resumenMes && (
              <>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold">
                  <CheckCircle2 size={14} /> {resumenMes.asistencias} Normales
                </div>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold ${resumenMes.atrasos > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'}`}>
                  <Clock size={14} /> {resumenMes.atrasos} Atrasos
                </div>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold ${resumenMes.faltas > 0 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'}`}>
                  <X size={14} /> {resumenMes.faltas} Faltas
                </div>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold ${resumenMes.justificados > 0 ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                  <FileText size={14} /> {resumenMes.justificados} Justif.
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-700">Justificaciones Recientes</h3>
            <button onClick={() => setShowJustificar(true)}
              className="text-xs font-bold px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >+ Nueva</button>
          </div>
          {justificaciones.length > 0 ? (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {justificaciones.map(j => (
                <div key={j.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50">
                  <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-[10px]">J</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700">{j.tipo}</p>
                    <p className="text-xs text-slate-400">{j.motivo_detalle_txt || j.motivo_detalle || 'Sin motivo'}</p>
                  </div>
                  <span className="text-xs text-slate-400">{new Date(j.fecha).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-6">Sin justificaciones registradas</p>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-700">Todas las Marcaciones</h3>
          <button onClick={loadAllMarcaciones} disabled={cargandoMarcaciones}
            className="text-xs font-bold px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >{cargandoMarcaciones ? 'Cargando...' : showAllMarcaciones ? 'Ocultar' : 'Ver todas'}</button>
        </div>
        {showAllMarcaciones && (
          <div className="max-h-72 overflow-y-auto space-y-1">
            {allMarcaciones.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">Sin marcaciones registradas</p>
            ) : allMarcaciones.map((m, i) => (
              <div key={m.id || i} className="flex items-center gap-4 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                <span className="w-6 h-6 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                <span className="text-sm font-mono text-slate-700 flex-1">{new Date(m.timestamp).toLocaleString('es-BO')}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  m.estado_asistencia === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>{m.estado_asistencia === 0 ? 'Entrada' : 'Salida'}</span>
                <span className="text-[10px] text-slate-400">{m.device_ip || ''}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showJustificar && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowJustificar(false)}>
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><FileText size={20} /></div>
                <h3 className="font-bold text-slate-800">Nueva Justificación</h3>
              </div>
              <button onClick={() => setShowJustificar(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Fecha</label>
                <input type="date" value={justForm.fecha} onChange={e => setJustForm(f => ({ ...f, fecha: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Tipo</label>
                <select value={justForm.tipo} onChange={e => setJustForm(f => ({ ...f, tipo: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="FALTA">Falta</option>
                  <option value="ATRASO">Atraso</option>
                  <option value="ENTRADA">Entrada</option>
                  <option value="SALIDA">Salida</option>
                  <option value="AMBOS">Entrada y Salida</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Motivo</label>
                <select value={justForm.motivo_id} onChange={e => setJustForm(f => ({ ...f, motivo_id: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Seleccionar motivo...</option>
                  {catMotivos.map(m => <option key={m.id} value={m.id}>{m.detalle}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Detalle (opcional)</label>
                <textarea value={justForm.motivo_detalle} onChange={e => setJustForm(f => ({ ...f, motivo_detalle: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                  placeholder="Describe el motivo..." />
              </div>
              <button onClick={handleJustificar} disabled={enviando || !justForm.fecha || !justForm.tipo}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-slate-300 flex items-center justify-center gap-2">
                <Send size={16} /> {enviando ? 'Enviando...' : 'Enviar Justificación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
