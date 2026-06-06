import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, AlertTriangle, AlertCircle, CheckCircle, Clock, User, Calendar, ShieldAlert } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const ContratosAlertasModal = ({ onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inactivating, setInactivating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchAlertas();
  }, []);

  const fetchAlertas = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/personal/contratos-alertas`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching contratos alertas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoInactivar = async () => {
    setInactivating(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/personal/auto-inactivar`);
      setResult({ type: 'success', message: response.data.message });
      setShowConfirm(false);
      fetchAlertas();
    } catch (error) {
      setResult({ type: 'error', message: error.response?.data?.error || error.message });
    } finally {
      setInactivating(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const daysRemaining = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateString);
    target.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 leading-none">Alertas de Contratos</h2>
              <p className="text-sm text-slate-500 mt-1">Personal con contratos vencidos o próximos a vencer</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto bg-slate-50/50 flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm font-medium">Cargando alertas de contratos...</p>
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* Stats cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
                  <div className="flex justify-center mb-2">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <AlertCircle size={20} className="text-red-500" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-slate-800">{data.stats.vencidosCount}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Vencidos</div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
                  <div className="flex justify-center mb-2">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <Clock size={20} className="text-amber-500" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-slate-800">{data.stats.porVencerCount}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Por Vencer (30d)</div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
                  <div className="flex justify-center mb-2">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <CheckCircle size={20} className="text-emerald-500" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-slate-800">{data.stats.activos}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Activos</div>
                </div>
              </div>

              {/* Result message */}
              {result && (
                <div className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
                  result.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {result.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  {result.message}
                </div>
              )}

              {/* Vencidos section */}
              {data.vencidos.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-500" />
                    Contratos Vencidos
                    <span className="text-xs font-normal text-slate-400">({data.vencidos.length})</span>
                  </h3>
                  <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
                    {data.vencidos.map((item) => {
                      const days = daysRemaining(item.fecha_fin_contrato);
                      return (
                        <div key={item.id} className="flex items-center justify-between px-4 py-3 hover:bg-red-50/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <User size={16} className="text-slate-400" />
                            <div>
                              <p className="text-sm font-semibold text-slate-800">
                                {item.primer_nombre} {item.apellido_paterno}
                              </p>
                              <p className="text-xs text-slate-500 flex items-center gap-1">
                                <Calendar size={12} />
                                Venció: {formatDate(item.fecha_fin_contrato)}
                              </p>
                            </div>
                          </div>
                          <span className="text-[11px] px-2.5 py-1 bg-red-100 text-red-700 rounded-full font-bold">
                            {Math.abs(days)} días vencido
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Por Vencer section */}
              {data.porVencer.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Clock size={16} className="text-amber-500" />
                    Próximos a Vencer (30 días)
                    <span className="text-xs font-normal text-slate-400">({data.porVencer.length})</span>
                  </h3>
                  <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
                    {data.porVencer.map((item) => {
                      const days = daysRemaining(item.fecha_fin_contrato);
                      return (
                        <div key={item.id} className="flex items-center justify-between px-4 py-3 hover:bg-amber-50/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <User size={16} className="text-slate-400" />
                            <div>
                              <p className="text-sm font-semibold text-slate-800">
                                {item.primer_nombre} {item.apellido_paterno}
                              </p>
                              <p className="text-xs text-slate-500 flex items-center gap-1">
                                <Calendar size={12} />
                                Vence: {formatDate(item.fecha_fin_contrato)}
                              </p>
                            </div>
                          </div>
                          <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold ${
                            days <= 7 
                              ? 'bg-red-100 text-red-700' 
                              : days <= 15 
                                ? 'bg-amber-100 text-amber-700' 
                                : 'bg-blue-100 text-blue-700'
                          }`}>
                            {days} días
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* No alerts */}
              {data.vencidos.length === 0 && data.porVencer.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                    <CheckCircle size={32} className="text-emerald-400" />
                  </div>
                  <h3 className="text-slate-800 font-bold">Sin alertas pendientes</h3>
                  <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
                    No hay contratos vencidos ni próximos a vencer en los próximos 30 días.
                  </p>
                </div>
              )}

              {/* Auto-inactivar section */}
              {data.vencidos.length > 0 && !showConfirm && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <ShieldAlert size={20} className="text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">Auto-inactivar personal</p>
                        <p className="text-xs text-slate-500">Marcar como INACTIVO al personal con contrato vencido</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowConfirm(true)}
                      className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-bold text-sm shadow-sm"
                    >
                      <span className="flex items-center gap-1.5">
                        <ShieldAlert size={16} />
                        Auto-inactivar
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Confirmation dialog */}
              {showConfirm && (
                <div className="bg-white rounded-xl border-2 border-red-200 p-5 shadow-sm">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                    <AlertTriangle size={20} className="text-red-500" />
                    ¿Está seguro de inactivar {data.vencidos.length} empleado(s)?
                  </h4>
                  <p className="text-sm text-slate-600 mb-4">
                    Se cambiará el estado a <strong>INACTIVO</strong> y se registrará la fecha de baja como hoy. 
                    Esta acción se ejecuta automáticamente cada día a la 01:00 AM, pero puede adelantarla manualmente.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="px-5 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-bold text-sm"
                      disabled={inactivating}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleAutoInactivar}
                      className="px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-bold text-sm shadow-sm flex items-center gap-2"
                      disabled={inactivating}
                    >
                      {inactivating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Inactivando...
                        </>
                      ) : (
                        <>
                          <ShieldAlert size={16} />
                          Confirmar Inactivación
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                <AlertTriangle size={32} className="text-slate-300" />
              </div>
              <h3 className="text-slate-800 font-bold">Error al cargar datos</h3>
              <p className="text-slate-500 text-sm mt-1">No se pudieron obtener las alertas de contratos.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-all font-bold text-sm shadow-lg shadow-slate-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContratosAlertasModal;