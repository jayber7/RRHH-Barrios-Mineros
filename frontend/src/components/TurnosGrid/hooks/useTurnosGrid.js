import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authFetch, API_BASE_URL } from '../../../config/api';

const TIPO_FRANJA_HORAS = {
  manana: 7,
  tarde: 7,
  noche: 12,
  completo: 14,
  personalizada: 8
};

export function useTurnosGrid() {
  const queryClient = useQueryClient();
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [cambiosPendientes, setCambiosPendientes] = useState([]);
  const [filtrosPersonal, setFiltrosPersonal] = useState({ q: '', fuente_financiamiento_id: null, tipo_personal_id: null });

  // Fetch servicios
  const { data: servicios = [], isLoading: loadingServicios } = useQuery({
    queryKey: ['turnos-grid', 'servicios'],
    queryFn: async () => {
      const res = await authFetch(`${API_BASE_URL}/api/turnos-grid/servicios`);
      return res.json();
    }
  });

  // Fetch grilla mensual
  const { data: grilla = [], isLoading: loadingGrilla, refetch: refetchGrilla } = useQuery({
    queryKey: ['turnos-grid', 'grilla', servicioSeleccionado, mes, anio],
    enabled: !!servicioSeleccionado,
    queryFn: async () => {
      const res = await authFetch(`${API_BASE_URL}/api/turnos-grid/servicios/${servicioSeleccionado}/grilla?mes=${mes}&anio=${anio}`);
      return res.json();
    }
  });

  // Fetch personal disponible
  const { data: personalDisponible = [], isLoading: loadingPersonal, refetch: refetchPersonal } = useQuery({
    queryKey: ['turnos-grid', 'personal', servicioSeleccionado, mes, anio, filtrosPersonal],
    enabled: !!servicioSeleccionado,
    queryFn: async () => {
      const params = new URLSearchParams({ mes: mes.toString(), anio: anio.toString() });
      if (filtrosPersonal.fuente_financiamiento_id) params.set('fuente_financiamiento_id', filtrosPersonal.fuente_financiamiento_id);
      if (filtrosPersonal.tipo_personal_id) params.set('tipo_personal_id', filtrosPersonal.tipo_personal_id);
      if (filtrosPersonal.q) params.set('q', filtrosPersonal.q);
      const res = await authFetch(`${API_BASE_URL}/api/turnos-grid/servicios/${servicioSeleccionado}/personal-disponible?${params}`);
      return res.json();
    }
  });

  // Fetch carga horaria
  const { data: cargaHoraria = { resumen: [], alertas: [] }, isLoading: loadingCarga, refetch: refetchCarga } = useQuery({
    queryKey: ['turnos-grid', 'carga', servicioSeleccionado, mes, anio],
    enabled: !!servicioSeleccionado,
    queryFn: async () => {
      const res = await authFetch(`${API_BASE_URL}/api/turnos-grid/servicios/${servicioSeleccionado}/carga-horaria?mes=${mes}&anio=${anio}`);
      return res.json();
    }
  });

  // Mutation batch save
  const batchSaveMutation = useMutation({
    mutationFn: async (cambios) => {
      const res = await authFetch(`${API_BASE_URL}/api/turnos-grid/servicios/${servicioSeleccionado}/asignaciones/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mes, anio, cambios })
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turnos-grid', 'grilla'] });
      queryClient.invalidateQueries({ queryKey: ['turnos-grid', 'carga'] });
      queryClient.invalidateQueries({ queryKey: ['turnos-grid', 'personal'] });
      setCambiosPendientes([]);
    }
  });

  // Helpers
  const getHorasFranja = useCallback((tipoFranja, override = null) => {
    if (override && override.franja_inicio && override.franja_fin) {
      const inicio = override.franja_inicio.split(':').map(Number);
      const fin = override.franja_fin.split(':').map(Number);
      let horas = (fin[0] - inicio[0]) + (fin[1] - inicio[1]) / 60;
      if (horas < 0) horas += 24;
      return horas;
    }
    return TIPO_FRANJA_HORAS[tipoFranja] || 8;
  }, []);

  const calcularHorasProyectadas = useCallback((personalId, gridMensualId, franjaOverride = null) => {
    const cell = grilla.flatMap(d => d.franjas).find(f => f.id === gridMensualId);
    if (!cell) return 0;
    return getHorasFranja(cell.tipo_franja, franjaOverride);
  }, [grilla, getHorasFranja]);

  // Estado computado de carga horaria con cambios pendientes
  const estadoCargaProyectada = useMemo(() => {
    const mapa = new Map();
    
    // Base: carga actual
    personalDisponible.forEach(p => {
      mapa.set(p.id, {
        horasAsignadas: p.horas_asignadas || 0,
        horasObligatorias: p.horas_obligatorias || 0,
        fuente: p.fuente_financiamiento,
        tipo: p.tipo_personal
      });
    });

    // Aplicar cambios pendientes
    cambiosPendientes.forEach(cambio => {
      if (cambio.accion === 'CREATE' || cambio.accion === 'MOVE') {
        const horasNuevas = calcularHorasProyectadas(cambio.personalId, cambio.gridMensualId, cambio);
        const actual = mapa.get(cambio.personalId) || { horasAsignadas: 0, horasObligatorias: 0 };
        mapa.set(cambio.personalId, {
          ...actual,
          horasAsignadas: actual.horasAsignadas + horasNuevas
        });
      } else if (cambio.accion === 'DELETE') {
        // Necesitaríamos saber las horas de la asignación eliminada
        // Por simplicidad, invalidamos y recalculamos al guardar
      }
    });

    return mapa;
  }, [personalDisponible, cambiosPendientes, calcularHorasProyectadas]);

  // Resumen por fuente con proyección
  const resumenPorFuenteProyectado = useMemo(() => {
    const resumen = {};
    estadoCargaProyectada.forEach((v, k) => {
      const key = `${v.fuente || 'SIN_FUENTE'}_${v.tipo || 'SIN_TIPO'}`;
      if (!resumen[key]) {
        resumen[key] = { fuente: v.fuente, tipo: v.tipo, horasAsignadas: 0, horasObligatorias: 0, personal: 0 };
      }
      resumen[key].horasAsignadas += v.horasAsignadas;
      resumen[key].horasObligatorias += v.horasObligatorias;
      resumen[key].personal += 1;
    });
    return Object.values(resumen).map(r => ({
      ...r,
      porcentaje: r.horasObligatorias > 0 ? (r.horasAsignadas / r.horasObligatorias * 100).toFixed(1) : 0,
      diferencia: r.horasAsignadas - r.horasObligatorias
    }));
  }, [estadoCargaProyectada]);

  const addCambio = useCallback((cambio) => {
    setCambiosPendientes(prev => [...prev, { ...cambio, timestamp: Date.now() }]);
  }, []);

  const removeCambio = useCallback((index) => {
    setCambiosPendientes(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearCambios = useCallback(() => {
    setCambiosPendientes([]);
  }, []);

  const saveCambios = useCallback(async () => {
    if (cambiosPendientes.length === 0) return { creados: 0, actualizados: 0, eliminados: 0 };
    return batchSaveMutation.mutateAsync(cambiosPendientes);
  }, [cambiosPendientes, batchSaveMutation]);

  const changeMesAnio = useCallback((nuevoMes, nuevoAnio) => {
    setMes(nuevoMes);
    setAnio(nuevoAnio);
    clearCambios();
  }, [clearCambios]);

  return {
    // Estado
    servicioSeleccionado,
    setServicioSeleccionado,
    mes,
    anio,
    cambiosPendientes,
    filtrosPersonal,
    setFiltrosPersonal,
    isDirty: cambiosPendientes.length > 0,
    loading: loadingGrilla || loadingPersonal || loadingCarga,
    loadingServicios,
    
    // Datos
    servicios,
    grilla,
    personalDisponible,
    cargaHoraria,
    estadoCargaProyectada,
    resumenPorFuenteProyectado,
    
    // Acciones
    refetchGrilla,
    refetchPersonal,
    refetchCarga,
    addCambio,
    removeCambio,
    clearCambios,
    saveCambios,
    changeMesAnio,
    calcularHorasProyectadas,
    getHorasFranja,
    
    // Mutation state
    saving: batchSaveMutation.isPending,
    saveError: batchSaveMutation.error
  };
}