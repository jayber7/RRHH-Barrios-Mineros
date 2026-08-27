import { useCallback, useState } from 'react';
import { useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

export function useGridDragDrop({ personalDisponible, grilla, onDrop, calcularHorasProyectadas, estadoCargaProyectada }) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverCell, setDragOverCell] = useState(null);
  const [preview, setPreview] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
      delay: 100
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = useCallback((event) => {
    const { active } = event;
    const itemData = active.data.current;
    setDraggedItem(itemData);
    
    // Preview inicial
    if (itemData.tipo === 'personal') {
      const proyeccion = {
        personalId: itemData.personalId,
        horasActuales: estadoCargaProyectada.get(itemData.personalId)?.horasAsignadas || 0,
        horasObligatorias: estadoCargaProyectada.get(itemData.personalId)?.horasObligatorias || 0,
        horasNuevas: 0,
        estado: 'pendiente'
      };
      setPreview(proyeccion);
    }
  }, [estadoCargaProyectada]);

  const handleDragOver = useCallback((event) => {
    const { active, over } = event;
    
    if (!over) {
      setDragOverCell(null);
      if (preview) setPreview(p => ({ ...p, estado: 'pendiente' }));
      return;
    }

    const cellId = over.id;
    const cell = grilla.flatMap(d => d.franjas).find(f => f.id === cellId);
    
    if (!cell) {
      setDragOverCell(null);
      return;
    }

    setDragOverCell(cellId);

    // Calcular preview de horas
    if (active.data.current?.tipo === 'personal') {
      const personalId = active.data.current.personalId;
      const horasNuevas = calcularHorasProyectadas(personalId, cellId);
      const actual = estadoCargaProyectada.get(personalId) || { horasAsignadas: 0, horasObligatorias: 0 };
      
      setPreview({
        personalId,
        horasActuales: actual.horasAsignadas,
        horasObligatorias: actual.horasObligatorias,
        horasNuevas,
        horasProyectadas: actual.horasAsignadas + horasNuevas,
        diferencia: actual.horasAsignadas + horasNuevas - actual.horasObligatorias,
        estado: actual.horasAsignadas + horasNuevas >= actual.horasObligatorias ? 'cumple' : 'deficit',
        cellInfo: {
          dia: cell.dia,
          franja: `${cell.franja_inicio} - ${cell.franja_fin}`,
          tipo: cell.tipo_franja
        }
      });
    }
  }, [grilla, calcularHorasProyectadas, estadoCargaProyectada, preview]);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    
    if (!over) {
      setDraggedItem(null);
      setDragOverCell(null);
      setPreview(null);
      return;
    }

    const cellId = over.id;
    const cell = grilla.flatMap(d => d.franjas).find(f => f.id === cellId);
    
    if (!cell || active.data.current?.tipo !== 'personal') {
      setDraggedItem(null);
      setDragOverCell(null);
      setPreview(null);
      return;
    }

    const personalId = active.data.current.personalId;
    
    // Verificar cupo disponible
    const ocupados = cell.asignaciones?.length || 0;
    if (ocupados >= cell.cupo_maximo) {
      alert(`Cupo completo en esta franja (máx. ${cell.cupo_maximo})`);
      setDraggedItem(null);
      setDragOverCell(null);
      setPreview(null);
      return;
    }

    // Verificar solapamiento (mismo día, otra franja)
    const asignacionesDia = grilla
      .find(d => d.dia === cell.dia)?.franjas
      .flatMap(f => f.asignaciones || [])
      .filter(a => a.personal_id === personalId) || [];
    
    if (asignacionesDia.length > 0) {
      if (!window.confirm('Este personal ya tiene turno en este día. ¿Asignar también en esta franja?')) {
        setDraggedItem(null);
        setDragOverCell(null);
        setPreview(null);
        return;
      }
    }

    // Crear cambio
    const cambio = {
      accion: 'CREATE',
      personalId,
      gridMensualId: cellId,
      franjaInicioOverride: active.data.current.franjaInicioOverride,
      franjaFinOverride: active.data.current.franjaFinOverride
    };

    onDrop(cambio);
    
    setDraggedItem(null);
    setDragOverCell(null);
    setPreview(null);
  }, [grilla, onDrop]);

  const handleDragCancel = useCallback(() => {
    setDraggedItem(null);
    setDragOverCell(null);
    setPreview(null);
  }, []);

  return {
    sensors,
    draggedItem,
    dragOverCell,
    preview,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel
  };
}