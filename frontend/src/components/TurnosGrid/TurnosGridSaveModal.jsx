import React from 'react';
import { Save, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const TurnosGridSaveModal = ({ isOpen, cambios, onSave, onCancel, saving, error }) => {
  if (!isOpen || cambios.length === 0) return null;

  const cambiosPorAccion = cambios.reduce((acc, c) => {
    acc[c.accion] = (acc[c.accion] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onCancel}>
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Confirmar Guardado</h3>
              <p className="text-xs text-slate-400">Se aplicarán {cambios.length} cambios en batch</p>
            </div>
          </div>
          <button onClick={onCancel} disabled={saving}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl disabled:opacity-50">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Resumen de cambios */}
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(cambiosPorAccion).map(([accion, count]) => {
              const colors = {
                CREATE: 'bg-emerald-50 text-emerald-600 border-emerald-200',
                UPDATE: 'bg-blue-50 text-blue-600 border-blue-200',
                MOVE: 'bg-amber-50 text-amber-600 border-amber-200',
                DELETE: 'bg-rose-50 text-rose-600 border-rose-200'
              };
              const icons = {
                CREATE: <CheckCircle size={18} />,
                UPDATE: <Save size={18} />,
                MOVE: <Loader2 size={18} />,
                DELETE: <X size={18} />
              };
              return (
                <div key={accion} className={`p-3 rounded-xl border text-center ${colors[accion] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  <div className="flex items-center justify-center gap-1 mb-1">{icons[accion] || accion}</div>
                  <p className="font-bold text-lg">{count}</p>
                  <p className="text-xs font-medium capitalize">{accion.toLowerCase()}</p>
                </div>
              );
            })}
          </div>

          {/* Detalle de cambios */}
          <div className="max-h-64 overflow-y-auto space-y-2 border border-slate-100 rounded-xl p-3">
            {cambios.slice(0, 20).map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg text-sm">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 ${
                  c.accion === 'CREATE' ? 'bg-emerald-500' :
                  c.accion === 'DELETE' ? 'bg-rose-500' :
                  'bg-blue-500'
                }`}>
                  {c.accion === 'CREATE' ? '+' : c.accion === 'DELETE' ? '-' : '↗'}
                </span>
                <span className="font-medium text-slate-700 capitalize">{c.accion}</span>
                <span className="text-slate-500">Personal ID: {c.personalId}</span>
                <span className="text-slate-400 text-xs">Celda: {c.gridMensualId}</span>
              </div>
            ))}
            {cambios.length > 20 && (
              <p className="text-center text-xs text-slate-400 py-2">... y {cambios.length - 20} cambios más</p>
            )}
          </div>

          {/* Error si hay */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 flex items-center gap-2">
              <AlertCircle size={18} />
              <span>Error al guardar: {error.message}</span>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button onClick={onCancel} disabled={saving}
              className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 disabled:opacity-50 transition-colors">
              Cancelar
            </button>
            <button onClick={onSave} disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Confirmar Guardado
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurnosGridSaveModal;