import React, { useMemo } from 'react';
import { Calendar, Clock, Users, Plus, AlertTriangle } from 'lucide-react';

const DIAS_LABEL = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

const TIPO_FRANJA_STYLES = {
  manana: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500', label: 'Mañana', abbr: 'M' },
  tarde: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500', label: 'Tarde', abbr: 'T' },
  noche: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500', label: 'Noche', abbr: 'N' },
  completo: { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200', dot: 'bg-cyan-500', label: 'Completo', abbr: 'C' },
  personalizada: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-500', label: 'Personalizada', abbr: 'P' }
};

const TurnosGridTable = ({ 
  grilla, 
  mes, 
  anio, 
  sensors, 
  draggedItem, 
  dragOverCell, 
  handleDragOver, 
  handleDragEnd, 
  handleDragCancel,
  loading 
}) => {
  // Organizar grilla: obtener todas las franjas únicas ordenadas
  const franjasUnicas = useMemo(() => {
    const franjasMap = new Map();
    grilla.forEach(dia => {
      dia.franjas.forEach(f => {
        const key = `${f.franja_inicio}-${f.franja_fin}-${f.tipo_franja}`;
        if (!franjasMap.has(key) || f.dia < franjasMap.get(key).dia) {
          franjasMap.set(key, f);
        }
      });
    });
    return Array.from(franjasMap.values()).sort((a, b) => {
      const timeA = a.franja_inicio.localeCompare(b.franja_inicio);
      if (timeA !== 0) return timeA;
      return a.tipo_franja.localeCompare(b.tipo_franja);
    });
  }, [grilla]);

  // Mapa rápido de celda por día y franja
  const celdaMap = useMemo(() => {
    const map = new Map();
    grilla.forEach(dia => {
      dia.franjas.forEach(f => {
        map.set(`${dia.dia}-${f.id}`, f);
      });
    });
    return map;
  }, [grilla]);

  const totalDias = new Date(anio, mes, 0).getDate();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="text-center text-slate-400 py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          Cargando grilla de turnos...
        </div>
      </div>
    );
  }

  if (grilla.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="text-center text-slate-400 py-12">
          <Calendar size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">No hay grilla generada para este mes</p>
          <p className="text-sm mt-1">Use el botón "Regenerar" para crear la grilla</p>
        </div>
      </div>
    );
  }

  const renderCell = (dia, franja) => {
    const cell = celdaMap.get(`${dia}-${franja.id}`);
    if (!cell) return <td className="bg-slate-50/50 border-b border-slate-50/50 min-w-[140px] max-w-[160px]" />;

    const style = TIPO_FRANJA_STYLES[cell.tipo_franja] || TIPO_FRANJA_STYLES.personalizada;
    const isDragOver = dragOverCell === cell.id;
    const ocupados = cell.asignaciones?.length || 0;
    const cupoDisponible = cell.cupo_maximo - ocupados;
    const esFestivo = cell.es_festivo;
    const fecha = new Date(anio, mes - 1, dia);
    const esHoy = fecha.toDateString() === new Date().toDateString();

    return (
      <td
        key={`${dia}-${franja.id}`}
        className={`relative p-1.5 align-top transition-all min-h-[70px] min-w-[140px] max-w-[160px] ${
          isDragOver ? 'bg-blue-50 ring-2 ring-blue-400' : 
          esFestivo ? 'bg-rose-25' : 
          esHoy ? 'bg-blue-50/30' : 'bg-white'
        } border-b border-slate-50/50 last:border-b-0`}
        onDragOver={(e) => { e.preventDefault(); handleDragOver(e); }}
        onDrop={(e) => { e.preventDefault(); handleDragEnd(e); }}
        onDragLeave={handleDragCancel}
        title={`${franja.franja_inicio} - ${franja.franja_fin} (${cell.horas_franja}h)${esFestivo ? ' - FESTIVO' : ''}`}
      >
        {/* Header franja */}
        <div className="flex items-center justify-between mb-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${style.bg} ${style.text} ${style.border}`}>
            {style.abbr}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {franja.franja_inicio.slice(0,5)}-{franja.franja_fin.slice(0,5)}
          </span>
        </div>

        {/* Cupo y festivo */}
        <div className="flex items-center justify-between mb-1.5">
          <span className={`text-[10px] font-medium ${ocupados >= cell.cupo_maximo ? 'text-rose-600' : 'text-slate-500'}`}>
            {ocupados}/{cell.cupo_maximo}
          </span>
          {esFestivo && <span className="text-[9px] text-rose-500 font-bold" title="Festivo">🎉</span>}
        </div>

        {/* Asignaciones */}
        <div className="space-y-1 min-h-[36px]">
          {cell.asignaciones?.map((asig, idx) => {
            const iniciales = `${asig.personal?.primer_nombre?.[0] || ''}${asig.personal?.apellido_paterno?.[0] || ''}`;
            const nombre = `${asig.personal?.primer_nombre || ''} ${asig.personal?.apellido_paterno || ''}`;
            return (
              <div
                key={asig.id || idx}
                className="flex items-center gap-1.5 p-1.5 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors group relative"
                title={nombre}
              >
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ backgroundColor: style.dot }}>
                  {iniciales || '?'}
                </div>
                <span className="text-[11px] font-medium text-slate-700 truncate flex-1">{nombre}</span>
                {asig.franja_inicio_override && (
                  <span className="text-[9px] text-amber-600 font-mono">
                    {asig.franja_inicio_override.slice(0,5)}-{asig.franja_fin_override.slice(0,5)}
                  </span>
                )}
              </div>
            );
          })}
          
          {/* Slots vacíos */}
          {ocupados < cell.cupo_maximo && Array.from({ length: cupoDisponible }).map((_, i) => (
            <div 
              key={`empty-${i}`}
              className={`h-7 border-2 border-dashed rounded-lg transition-colors ${
                isDragOver ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
              } flex items-center justify-center`}
            >
              <Plus size={14} className="text-slate-300" />
            </div>
          ))}
          
          {/* Indicador cupo lleno */}
          {ocupados >= cell.cupo_maximo && cupoDisponible === 0 && (
            <div className="text-center text-[10px] text-rose-500 font-medium py-1">
              Cupo completo
            </div>
          )}
        </div>

        {/* Horas */}
        <div className="absolute bottom-1 right-1 text-[9px] text-slate-300 font-mono">
          {parseFloat(cell.horas_franja).toFixed(1)}h
        </div>
      </td>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead>
            <tr className="border-b border-slate-200">
              {/* Columna franjas */}
              <th className="sticky left-0 z-20 w-36 bg-white border-r border-slate-200 p-2 text-left text-xs font-bold text-slate-500">
                Franja Horaria
              </th>
              {/* Días 1-31 */}
              {Array.from({ length: totalDias }, (_, i) => {
                const dia = i + 1;
                const fecha = new Date(anio, mes - 1, dia);
                const esHoy = fecha.toDateString() === new Date().toDateString();
                const esFinde = fecha.getDay() === 0 || fecha.getDay() === 6;
                return (
                  <th 
                    key={dia} 
                    className={`sticky top-0 z-10 min-w-[140px] max-w-[160px] p-2 text-center text-xs font-bold ${
                      esHoy ? 'bg-blue-50 text-blue-700' : esFinde ? 'bg-rose-50 text-rose-700' : 'bg-slate-50 text-slate-700'
                    } border-r border-slate-200`}
                  >
                    <div className="text-[11px] text-slate-500">{DIAS_LABEL[fecha.getDay()]}</div>
                    <div className="text-lg font-bold">{dia}</div>
                    {esHoy && <div className="text-[10px] text-blue-600 font-medium">HOY</div>}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {franjasUnicas.map(franja => (
              <tr key={franja.id} className="border-b border-slate-50/50 last:border-b-0">
                {/* Label franja */}
                <td className="sticky left-0 z-10 w-36 bg-white border-r border-slate-200 p-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${TIPO_FRANJA_STYLES[franja.tipo_franja]?.bg} ${TIPO_FRANJA_STYLES[franja.tipo_franja]?.text} ${TIPO_FRANJA_STYLES[franja.tipo_franja]?.border}`}>
                      {TIPO_FRANJA_STYLES[franja.tipo_franja]?.label || franja.tipo_franja}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">
                    {franja.franja_inicio.slice(0,5)} - {franja.franja_fin.slice(0,5)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {parseFloat(franja.horas_franja).toFixed(1)}h · Cupo: {franja.cupo_maximo}
                  </div>
                </td>
                {/* Celdas por día */}
                {Array.from({ length: totalDias }, (_, i) => renderCell(i + 1, franja))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Leyenda */}
      <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-wrap gap-3 text-xs">
        {Object.entries(TIPO_FRANJA_STYLES).map(([tipo, style]) => (
          <span key={tipo} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium" style={{ 
            backgroundColor: style.bg.replace('bg-', 'bg-'), 
            color: style.text.replace('text-', ''),
            borderColor: style.border.replace('border-', '')
          }}>
            <span className={`w-2 h-2 rounded-full ${style.dot}`} />
            {style.label}
          </span>
        ))}
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-slate-100 text-slate-600 border-slate-200 font-medium">
          <span className="w-2 h-2 rounded-full bg-rose-500" /> Festivo
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-slate-100 text-slate-600 border-slate-200 font-medium">
          <Plus size={12} className="text-slate-400" /> Slot libre
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-amber-50 text-amber-700 border-amber-200 font-medium">
          <AlertTriangle size={12} /> Override horario
        </span>
      </div>
    </div>
  );
};

export default TurnosGridTable;