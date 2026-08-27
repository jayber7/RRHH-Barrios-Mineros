import React from 'react';
import { AlertTriangle, CheckCircle, Users, Clock, TrendingUp, TrendingDown } from 'lucide-react';

const TurnosGridResumenPanel = ({ resumen, alertas, totalPersonal, isDirty }) => {
  const totalHorasAsignadas = resumen.reduce((sum, r) => sum + r.horasAsignadas, 0);
  const totalHorasObligatorias = resumen.reduce((sum, r) => sum + r.horasObligatorias, 0);
  const totalDiferencia = totalHorasAsignadas - totalHorasObligatorias;
  const totalPorcentaje = totalHorasObligatorias > 0 ? (totalHorasAsignadas / totalHorasObligatorias * 100).toFixed(1) : 0;

  const alertasCriticas = alertas.filter(a => a.estado === 'SIN_ASIGNAR').length;
  const alertasAdvertencia = alertas.filter(a => a.estado === 'PARCIAL').length;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-5 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Users size={20} className="text-blue-600" />
          Resumen de Carga Horaria
        </h3>
        {isDirty && (
          <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs font-bold rounded-full">
            Cambios sin guardar
          </span>
        )}
      </div>

      {/* KPIs Generales */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-slate-50 rounded-xl">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Total Personal</p>
          <p className="text-2xl font-bold text-slate-800">{totalPersonal}</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-xl">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Horas Asignadas</p>
          <p className="text-2xl font-bold text-blue-600">{totalHorasAsignadas.toFixed(1)}h</p>
        </div>
        <div className="p-3 bg-emerald-50 rounded-xl">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Horas Requeridas</p>
          <p className="text-2xl font-bold text-emerald-600">{totalHorasObligatorias.toFixed(1)}h</p>
        </div>
      </div>

      {/* Diferencia Total */}
      <div className={`p-4 rounded-xl border ${totalDiferencia >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${totalDiferencia >= 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
            {totalDiferencia >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">Diferencia Total</p>
            <p className={`text-xl font-bold ${totalDiferencia >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {totalDiferencia >= 0 ? '+' : ''}{totalDiferencia.toFixed(1)}h ({totalPorcentaje}%)
            </p>
          </div>
        </div>
      </div>

      {/* Detalle por Fuente */}
      <div>
        <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Clock size={16} className="text-slate-500" />
          Por Fuente de Financiamiento
        </h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {resumen.map(r => {
            const diff = r.horasAsignadas - r.horasObligatorias;
            const pct = r.horasObligatorias > 0 ? (r.horasAsignadas / r.horasObligatorias * 100) : 0;
            const isOk = diff >= 0;
            const isWarning = diff < 0 && pct >= 80;
            
            return (
              <div key={`${r.fuente}_${r.tipo}`} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-700 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-200 rounded text-xs font-bold">{r.fuente}</span>
                    <span className="text-xs text-slate-500">{r.tipo}</span>
                    <span className="text-xs text-slate-400">({r.personal} pers.)</span>
                  </span>
                  <span className={`text-sm font-bold ${isOk ? 'text-emerald-600' : isWarning ? 'text-amber-600' : 'text-rose-600'}`}>
                    {pct.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(100, pct)}%`,
                      backgroundColor: isOk ? '#10B981' : isWarning ? '#F59E0B' : '#EF4444'
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>Asignadas: {r.horasAsignadas.toFixed(1)}h</span>
                  <span>Requeridas: {r.horasObligatorias.toFixed(1)}h</span>
                  <span className={isOk ? 'text-emerald-600' : isWarning ? 'text-amber-600' : 'text-rose-600'}>
                    {diff >= 0 ? '+' : ''}{diff.toFixed(1)}h
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alertas */}
      {(alertasCriticas > 0 || alertasAdvertencia > 0) && (
        <div className="border-t border-slate-100 pt-4">
          <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-600" />
            Alertas ({alertasCriticas + alertasAdvertencia})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {alertas
              .sort((a, b) => a.diferencia - b.diferencia)
              .slice(0, 10)
              .map(a => (
                <div key={a.id} className={`p-3 rounded-xl border ${a.estado === 'SIN_ASIGNAR' ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold" 
                           style={{ backgroundColor: a.estado === 'SIN_ASIGNAR' ? '#EF4444' : '#F59E0B' }}>
                        {a.primer_nombre?.[0]}{a.apellido_paterno?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">
                          {a.primer_nombre} {a.apellido_paterno}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          CI: {a.ci} · {a.fuente_financiamiento}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${a.estado === 'SIN_ASIGNAR' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                      {a.estado}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">{a.alerta}</p>
                </div>
              ))}
            {alertas.length > 10 && (
              <p className="text-center text-sm text-slate-500 mt-2">
                ... y {alertas.length - 10} alertas más
              </p>
            )}
          </div>
        </div>
      )}

      {/* Resumen de cambios pendientes */}
      {isDirty && (
        <div className="border-t border-slate-100 pt-4 bg-blue-50 rounded-xl p-3">
          <p className="text-sm font-medium text-blue-700 flex items-center gap-2">
            <Clock size={14} />
            Cambios pendientes de guardar
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Los cambios se aplicarán en batch al hacer clic en "Guardar" en el header.
          </p>
        </div>
      )}
    </div>
  );
};

export default TurnosGridResumenPanel;