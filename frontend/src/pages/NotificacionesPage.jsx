import React, { useState, useEffect } from 'react';
import {
  Bell, CheckCheck, Trash2, Info, AlertTriangle,
  CheckCircle2, AlertOctagon, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, authFetch } from '../config/api';

const TIPO_ICON = {
  INFO: { icon: Info, class: 'bg-blue-50 text-blue-600' },
  SUCCESS: { icon: CheckCircle2, class: 'bg-emerald-50 text-emerald-600' },
  WARNING: { icon: AlertTriangle, class: 'bg-amber-50 text-amber-600' },
  ALERT: { icon: AlertOctagon, class: 'bg-rose-50 text-rose-600' },
};

const NotificacionesPage = () => {
  const navigate = useNavigate();
  const [notificaciones, setNotificaciones] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    fetchNotificaciones();
    fetchResumen();
  }, [filtro]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  };

  const fetchNotificaciones = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/api/notificaciones`;
      if (filtro === 'no-leidas') url += '?solo_no_leidas=true';
      const res = await authFetch(url, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      if (res.ok) setNotificaciones(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchResumen = async () => {
    try {
      const res = await authFetch(`${API_BASE_URL}/api/notificaciones/resumen`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) setResumen(await res.json());
    } catch (e) { console.error(e); }
  };

  const marcarLeida = async (id) => {
    try {
      await authFetch(`${API_BASE_URL}/api/notificaciones/${id}/leer`, {
        method: 'PUT', headers: getAuthHeaders()
      });
      fetchNotificaciones();
      fetchResumen();
    } catch (e) { console.error(e); }
  };

  const marcarTodasLeidas = async () => {
    try {
      await authFetch(`${API_BASE_URL}/api/notificaciones/leer-todas`, {
        method: 'PUT', headers: getAuthHeaders()
      });
      fetchNotificaciones();
      fetchResumen();
    } catch (e) { console.error(e); }
  };

  const eliminar = async (id) => {
    try {
      await authFetch(`${API_BASE_URL}/api/notificaciones/${id}`, {
        method: 'DELETE', headers: getAuthHeaders()
      });
      fetchNotificaciones();
      fetchResumen();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Notificaciones</h1>
          <p className="text-slate-500 mt-1">Alertas, recordatorios y eventos del sistema</p>
        </div>
        <button
          onClick={marcarTodasLeidas}
          className="flex items-center gap-2 bg-slate-800 text-white px-5 py-3 rounded-2xl font-bold hover:bg-slate-700 transition-all"
        >
          <CheckCheck size={18} />
          Marcar todas leídas
        </button>
      </div>

      {resumen && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <ResumenCard label="Total" value={resumen.total} color="blue" />
          <ResumenCard label="No Leídas" value={resumen.no_leidas} color="amber" />
          <ResumenCard label="Alertas" value={resumen.alertas} color="rose" />
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
          <button
            onClick={() => setFiltro('')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${!filtro ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}
          >Todas</button>
          <button
            onClick={() => setFiltro('no-leidas')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filtro === 'no-leidas' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}
          >No leídas</button>
        </div>

        <div className="divide-y divide-slate-50">
          {loading ? (
            <div className="p-20 text-center text-slate-300">Cargando...</div>
          ) : notificaciones.length === 0 ? (
            <div className="p-20 text-center text-slate-300">
              <Bell size={48} className="mx-auto mb-4 opacity-20" />
              No hay notificaciones
            </div>
          ) : notificaciones.map(n => {
            const tc = TIPO_ICON[n.tipo] || TIPO_ICON.INFO;
            const Icon = tc.icon;
            return (
              <div key={n.id} className={`p-6 hover:bg-slate-50/50 transition-colors flex items-start gap-4 ${!n.leido ? 'bg-blue-50/30' : ''}`}>
                <div className={`p-2 rounded-xl shrink-0 ${tc.class}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-bold ${!n.leido ? 'text-slate-800' : 'text-slate-500'}`}>{n.titulo}</h3>
                    {!n.leido && <span className="w-2 h-2 bg-blue-600 rounded-full shrink-0" />}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{n.mensaje}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                    {n.apellido_paterno && (
                      <span className="text-[10px] text-slate-400">· {n.apellido_paterno} {n.primer_nombre}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  {n.link && (
                    <button onClick={() => navigate(n.link)}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors" title="Ir">
                      <ArrowRight size={16} />
                    </button>
                  )}
                  {!n.leido && (
                    <button onClick={() => marcarLeida(n.id)}
                      className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors" title="Marcar leída">
                      <CheckCheck size={16} />
                    </button>
                  )}
                  <button onClick={() => eliminar(n.id)}
                    className="p-2 hover:bg-rose-50 rounded-lg text-rose-400 transition-colors" title="Eliminar">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ResumenCard = ({ label, value, color }) => {
  const colors = {
    blue: 'bg-blue-50 border-blue-100 text-blue-600',
    amber: 'bg-amber-50 border-amber-100 text-amber-600',
    rose: 'bg-rose-50 border-rose-100 text-rose-600',
  };
  return (
    <div className={`rounded-3xl border p-6 text-center ${colors[color] || colors.blue}`}>
      <p className="text-3xl font-black">{value || 0}</p>
      <p className="text-sm font-bold mt-1">{label}</p>
    </div>
  );
};

export default NotificacionesPage;
