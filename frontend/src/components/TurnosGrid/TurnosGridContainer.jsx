import React from 'react';
import { Save, RotateCw, Download, Filter, X } from 'lucide-react';
import { useTurnosGrid } from './hooks/useTurnosGrid';
import { useGridDragDrop } from './hooks/useGridDragDrop';
import TurnosGridHeader from './TurnosGridHeader';
import TurnosGridSidebar from './TurnosGridSidebar';
import TurnosGridTable from './TurnosGridTable';
import TurnosGridResumenPanel from './TurnosGridResumenPanel';
import TurnosGridSaveModal from './TurnosGridSaveModal';

const TurnosGridContainer = () => {
  const {
    servicioSeleccionado,
    mes,
    anio,
    cambiosPendientes,
    isDirty,
    loading,
    servicios,
    grilla,
    personalDisponible,
    cargaHoraria,
    estadoCargaProyectada,
    resumenPorFuenteProyectado,
    refetchGrilla,
    refetchPersonal,
    refetchCarga,
    addCambio,
    saveCambios,
    changeMesAnio,
    saving,
    saveError,
    setServicioSeleccionado,
    setFiltrosPersonal,
    filtrosPersonal
  } = useTurnosGrid();

  const dragDrop = useGridDragDrop({
    personalDisponible,
    grilla,
    onDrop: addCambio,
    calcularHorasProyectadas: (pid, gid) => {
      const cell = grilla.flatMap(d => d.franjas).find(f => f.id === gid);
      if (!cell) return 0;
      const tipo = cell.tipo_franja;
      const horasMap = { manana: 7, tarde: 7, noche: 12, completo: 14, personalizada: 8 };
      return horasMap[tipo] || 8;
    },
    estadoCargaProyectada
  });

  const handleSave = async () => {
    try {
      await saveCambios();
      refetchGrilla();
      refetchPersonal();
      refetchCarga();
    } catch (e) {
      console.error('Error guardando:', e);
    }
  };

  const handleRegenerar = async () => {
    if (!window.confirm('Regenerar grilla eliminará asignaciones no guardadas. ¿Continuar?')) return;
    try {
      const res = await fetch(`/api/turnos-grid/servicios/${servicioSeleccionado}/generar-grilla?mes=${mes}&anio=${anio}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        refetchGrilla();
        refetchPersonal();
      }
    } catch (e) {
      console.error('Error regenerando:', e);
    }
  };

  if (!servicioSeleccionado) {
    return (
      <div className="p-8 bg-slate-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Panel Interactivo de Turnos</h1>
            <p className="text-slate-500 mb-8">Seleccione un servicio para comenzar</p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-3xl mx-auto">
              {servicios.map(s => (
                <button
                  key={s.id}
                  onClick={() => setServicioSeleccionado(s.id)}
                  className="p-6 bg-white border-2 border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: s.color_identificacion + '20' }}>
                    <span style={{ color: s.color_identificacion, fontSize: '24px', fontWeight: 'bold' }}>
                      {s.unidad_servicio.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800">{s.unidad_servicio}</h3>
                  <p className="text-sm text-slate-500 mt-1">{s.activo ? 'Activo' : 'Inactivo'}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen">
      <TurnosGridHeader
        servicioSeleccionado={servicioSeleccionado}
        servicios={servicios}
        mes={mes}
        anio={anio}
        isDirty={isDirty}
        saving={saving}
        onSave={handleSave}
        onRegenerar={handleRegenerar}
        onChangeMesAnio={changeMesAnio}
        onChangeServicio={setServicioSeleccionado}
      />

      <div className="flex gap-4 mt-4">
        {/* Sidebar - Personal Disponible */}
        <aside className="w-80 md:w-96 flex-shrink-0">
          <TurnosGridSidebar
            personalDisponible={personalDisponible}
            estadoCargaProyectada={estadoCargaProyectada}
            filtros={filtrosPersonal}
            onFiltrosChange={setFiltrosPersonal}
            sensors={dragDrop.sensors}
            draggedItem={dragDrop.draggedItem}
            preview={dragDrop.preview}
            handleDragStart={dragDrop.handleDragStart}
          />
        </aside>

        {/* Grid Principal */}
        <main className="flex-1 min-w-0 lg:mr-96">
          <TurnosGridTable
            grilla={grilla}
            mes={mes}
            anio={anio}
            sensors={dragDrop.sensors}
            draggedItem={dragDrop.draggedItem}
            dragOverCell={dragDrop.dragOverCell}
            handleDragOver={dragDrop.handleDragOver}
            handleDragEnd={dragDrop.handleDragEnd}
            handleDragCancel={dragDrop.handleDragCancel}
            loading={loading}
          />
        </main>

        {/* Panel Resumen - Sticky Right */}
        <aside className="hidden lg:block fixed right-4 top-24 bottom-4 w-96 overflow-y-auto z-10">
          <TurnosGridResumenPanel
            resumen={resumenPorFuenteProyectado}
            alertas={cargaHoraria.alertas || []}
            totalPersonal={personalDisponible.length}
            isDirty={isDirty}
          />
        </aside>
      </div>

      {/* Modal Guardar Cambios */}
      <TurnosGridSaveModal
        isOpen={isDirty}
        cambios={cambiosPendientes}
        onSave={handleSave}
        onCancel={() => {}}
        saving={saving}
        error={saveError}
      />
    </div>
  );
};

export default TurnosGridContainer;