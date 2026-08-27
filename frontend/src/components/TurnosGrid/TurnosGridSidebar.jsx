import React, { useState } from 'react';
import { Search, Filter, X, AlertCircle, CheckCircle } from 'lucide-react';

const TurnosGridSidebar = ({
  personalDisponible,
  estadoCargaProyectada,
  filtros,
  onFiltrosChange,
  sensors,
  draggedItem,
  preview,
  handleDragStart
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState(filtros.q || '');

  // Agrupar por fuente financiamiento
  const personalPorFuente = personalDisponible.reduce((acc, p) => {
    const key = p.fuente_financiamiento || 'SIN_FUENTE';
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    onFiltrosChange({ ...filtros, q: value });
  };

  const getEstadoInfo = (personalId) => {
    const estado = estadoCargaProyectada.get(personalId);
    if (!estado) return { label: 'Sin datos', color: 'text-slate-400', icon: null };
    
    const diff = estado.horasAsignadas - estado.horasObligatorias;
    const pct = estado.horasObligatorias > 0 ? (estado.horasAsignadas / estado.horasObligatorias * 100) : 0;
    
    if (diff >= 0) return { 
      label: `Cumple (${estado.horasAsignadas.toFixed(1)}/${estado.horasObligatorias}h)`, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      icon: <CheckCircle size={12} className="text-emerald-600" />
    };
    if (pct >= 80) return { 
      label: `Casi (${estado.horasAsignadas.toFixed(1)}/${estado.horasObligatorias}h)`, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
      icon: <AlertCircle size={12} className="text-amber-600" />
    };
    return { 
      label: `Falta ${Math.abs(diff).toFixed(1)}h (${estado.horasAsignadas.toFixed(1)}/${estado.horasObligatorias}h)`, 
      color: 'text-rose-600', 
      bg: 'bg-rose-50',
      icon: <AlertCircle size={12} className="text-rose-600" />
    };
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 h-fit sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      {/* Header Sidebar */}
      <div className="p-4 border-b border-slate-100 sticky top-0 bg-white z-10">
        <h3 className="font-bold text-slate-800 mb-3">Personal Disponible ({personalDisponible.length})</h3>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre, CI..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>

        {/* Filtros colapsables */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Filter size={16} /> Filtros {showFilters ? <X size={14} /> : <span>▼</span>}
        </button>

        {showFilters && (
          <div className="mt-3 space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Fuente Financiamiento</label>
              <select
                value={filtros.fuente_financiamiento_id || ''}
                onChange={e => onFiltrosChange({ ...filtros, fuente_financiamiento_id: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Todas</option>
                {['TGN','GOB','Contrato GAMO','MINISTERIO','MUNICIPIO','HIPC'].map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Tipo Personal</label>
              <select
                value={filtros.tipo_personal_id || ''}
                onChange={e => onFiltrosChange({ ...filtros, tipo_personal_id: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Todos</option>
                <option value="1">ÍTEM</option>
                <option value="2">CONTRATO</option>
                <option value="3">CONSULTORÍA</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Personal */}
      <div className="p-4 space-y-2">
        {Object.entries(personalPorFuente).map(([fuente, personal]) => (
          <div key={fuente} className="space-y-2">
            <h4 className="px-2 py-1 text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              {fuente} ({personal.length})
            </h4>
            {personal.map(p => {
              const estado = getEstadoInfo(p.id);
              const isDragging = draggedItem?.personalId === p.id;
              
              return (
                <div
                  key={p.id}
                  ref={el => {
                    if (el && sensors) {
                      // dnd-kit will handle this via useDraggable
                    }
                  }}
                  className={`group relative p-3 rounded-xl border transition-all cursor-grab active:cursor-grabbing ${
                    isDragging ? 'opacity-40 ring-2 ring-blue-500' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, {
                    tipo: 'personal',
                    personalId: p.id,
                    personalData: p
                  })}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white flex-shrink-0" 
                         style={{ backgroundColor: estado.color.replace('text-', 'bg-').replace('600', '500') }}>
                      {p.primer_nombre?.[0]}{p.apellido_paterno?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">
                        {p.primer_nombre} {p.apellido_paterno}
                      </p>
                      <p className="text-xs text-slate-500 truncate">CI: {p.ci}</p>
                      <p className="text-[11px] text-slate-400 truncate">{p.cargo_actual}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {estado.icon}
                    </div>
                  </div>
                  
                  {/* Barra de progreso horas */}
                  <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, (p.horas_asignadas / (p.horas_obligatorias || 1)) * 100)}%`,
                        backgroundColor: estado.color.replace('text-', '')
                      }}
                    />
                  </div>
                  
                  <p className={`text-[10px] font-medium mt-1 ${estado.color} ${estado.bg} px-2 py-0.5 rounded inline-block`}>
                    {estado.label}
                  </p>

                  {/* Preview durante drag */}
                  {preview?.personalId === p.id && preview.estado !== 'pendiente' && (
                    <div className="mt-2 p-2 rounded-lg text-xs bg-blue-50 border border-blue-200 animate-pulse">
                      <p className="font-medium text-blue-700">Si sueltas aquí:</p>
                      <p className="text-blue-600">
                        {preview.horasProyectadas.toFixed(1)}h / {preview.horasObligatorias}h 
                        ({preview.estado === 'cumple' ? '✓ Cumple' : '⚠ Déficit'})
                      </p>
                      <p className="text-blue-500">{preview.cellInfo?.dia} - {preview.cellInfo?.franja}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {personalDisponible.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <div className="w-16 h-16 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center">
              <Search size={24} />
            </div>
            <p>No hay personal disponible</p>
            <p className="text-xs mt-1">Ajuste los filtros o verifique el servicio</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TurnosGridSidebar;