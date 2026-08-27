import React from 'react';
import { Save, RotateCw, ChevronLeft, ChevronRight, Calendar, AlertTriangle } from 'lucide-react';

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

const TurnosGridHeader = ({
  servicioSeleccionado,
  servicios,
  mes,
  anio,
  isDirty,
  saving,
  onSave,
  onRegenerar,
  onChangeMesAnio,
  onChangeServicio
}) => {
  const servicio = servicios.find(s => s.id === servicioSeleccionado);

  const mesAnterior = () => {
    if (mes === 1) { onChangeMesAnio(12, anio - 1); } else { onChangeMesAnio(mes - 1, anio); }
  };
  const mesSiguiente = () => {
    if (mes === 12) { onChangeMesAnio(1, anio + 1); } else { onChangeMesAnio(mes + 1, anio); }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Selector Servicio */}
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-sm font-medium text-slate-600 whitespace-nowrap">Servicio:</label>
          <select
            value={servicioSeleccionado}
            onChange={e => onChangeServicio(parseInt(e.target.value))}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm min-w-[250px]"
          >
            {servicios.map(s => (
              <option key={s.id} value={s.id} style={{ borderLeft: `4px solid ${s.color_identificacion}` }}>
                {s.unidad_servicio}
              </option>
            ))}
          </select>
          {servicio && (
            <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium" style={{ color: servicio.color_identificacion }}>
              {servicio.unidad_servicio}
            </span>
          )}
        </div>

        {/* Navegación Mes/Año */}
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={mesAnterior} className="p-2 hover:bg-slate-100 rounded-xl transition-colors" title="Mes anterior">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
            <Calendar size={16} className="text-slate-400" />
            <span className="font-bold text-slate-700 min-w-[140px] text-center">
              {MESES[mes - 1]} {anio}
            </span>
          </div>
          <button onClick={mesSiguiente} className="p-2 hover:bg-slate-100 rounded-xl transition-colors" title="Mes siguiente">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onRegenerar}
            className="px-4 py-2 bg-amber-50 text-amber-700 rounded-xl text-sm font-medium hover:bg-amber-100 transition-colors flex items-center gap-2"
            title="Regenerar grilla desde configuración"
          >
            <RotateCw size={16} /> Regenerar
          </button>
          
          {isDirty && (
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              <Save size={18} /> {saving ? 'Guardando...' : `Guardar ${cambiosPendientes?.length || 0} cambios`}
            </button>
          )}
        </div>
      </div>

      {/* Indicador de cambios pendientes */}
      {isDirty && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertTriangle className="text-red-600" size={20} />
          <span className="text-sm text-red-700 font-medium">
            Tienes <strong>{cambiosPendientes?.length || 0} cambios pendientes</strong> sin guardar. 
            Los cambios se aplicarán al hacer clic en "Guardar".
          </span>
        </div>
      )}
    </div>
  );
};

export default TurnosGridHeader;