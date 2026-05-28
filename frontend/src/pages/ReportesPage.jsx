import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FileSpreadsheet, Download, CalendarClock, Users, Filter,
  ChevronRight, Settings, Calendar, AlertTriangle, Gavel, LayoutGrid
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const meses = [
  { id: 1, nombre: 'Enero' }, { id: 2, nombre: 'Febrero' }, { id: 3, nombre: 'Marzo' },
  { id: 4, nombre: 'Abril' }, { id: 5, nombre: 'Mayo' }, { id: 6, nombre: 'Junio' },
  { id: 7, nombre: 'Julio' }, { id: 8, nombre: 'Agosto' }, { id: 9, nombre: 'Septiembre' },
  { id: 10, nombre: 'Octubre' }, { id: 11, nombre: 'Noviembre' }, { id: 12, nombre: 'Diciembre' }
];

const defaultFilters = {
  estado: 'TODOS', fuente_id: '', tipo_id: '', unidad_id: '', days: 30,
  mes: new Date().getMonth() + 1, anio: new Date().getFullYear(),
  tipo_planilla: '', top: 50
};

const ReportesPage = () => {
  const [config, setConfig] = useState({ fuentes: [], tipos: [], unidades: [] });
  const [selectedReport, setSelectedReport] = useState(null);
  const [filters, setFilters] = useState({ ...defaultFilters });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/reportes/config`)
      .then(res => setConfig(res.data))
      .catch(err => console.error(err));
  }, []);

  const reports = [
    {
      section: 'Personal',
      items: [
        {
          id: 'inventario',
          title: 'Inventario Personal HBM',
          description: 'Reporte completo con todos los campos del inventario de personal.',
          icon: <FileSpreadsheet size={24} className="text-blue-600" />,
          color: 'blue',
          filters: ['estado', 'fuente_id', 'tipo_id', 'unidad_id']
        },
        {
          id: 'contratos-vencer',
          title: 'Contratos por Vencer',
          description: 'Personal con contratos que vencen en los próximos N días.',
          icon: <CalendarClock size={24} className="text-amber-600" />,
          color: 'amber',
          filters: ['days']
        },
      ]
    },
    {
      section: 'Asistencia',
      items: [
        {
          id: 'reporte-mensual',
          title: 'Reporte Mensual por Empleado',
          description: 'Como el reporte ASIS: detalle diario por empleado con horarios, marcas, atrasos y horas trabajadas.',
          icon: <Calendar size={24} className="text-emerald-600" />,
          color: 'emerald',
          filters: ['mes', 'anio', 'tipo_planilla']
        },
        {
          id: 'planilla-consolidada',
          title: 'Planilla Consolidada',
          description: 'Todos los empleados en una hoja con estado diario (P/A/J/F) y totales mensuales.',
          icon: <LayoutGrid size={24} className="text-purple-600" />,
          color: 'purple',
          filters: ['mes', 'anio', 'tipo_planilla']
        },
        {
          id: 'reporte-atrasos',
          title: 'Reporte de Atrasos',
          description: 'Ranking de empleados con más minutos de atraso, días con atraso y faltas.',
          icon: <AlertTriangle size={24} className="text-orange-600" />,
          color: 'orange',
          filters: ['mes', 'anio', 'tipo_planilla', 'top']
        },
        {
          id: 'reporte-sanciones',
          title: 'Reporte de Sanciones',
          description: 'Cálculo de multas por atrasos y faltas según la tabla de sanciones vigente.',
          icon: <Gavel size={24} className="text-red-600" />,
          color: 'red',
          filters: ['mes', 'anio', 'tipo_planilla']
        },
      ]
    }
  ];

  const handleExport = async () => {
    setLoading(true);
    try {
      let url;
      const params = new URLSearchParams();

      if (selectedReport === 'inventario') {
        if (filters.estado !== 'TODOS') params.append('estado', filters.estado);
        if (filters.fuente_id) params.append('fuente_id', filters.fuente_id);
        if (filters.tipo_id) params.append('tipo_id', filters.tipo_id);
        if (filters.unidad_id) params.append('unidad_id', filters.unidad_id);
        url = `${API_BASE_URL}/api/reportes/inventario?${params}`;
      } else if (selectedReport === 'contratos-vencer') {
        url = `${API_BASE_URL}/api/reportes/contratos-vencer?days=${filters.days}`;
      } else if (selectedReport === 'reporte-mensual') {
        params.append('mes', filters.mes);
        params.append('anio', filters.anio);
        if (filters.tipo_planilla) params.append('tipo', filters.tipo_planilla);
        url = `${API_BASE_URL}/api/reportes/asistencia/mensual?${params}`;
      } else if (selectedReport === 'planilla-consolidada') {
        params.append('mes', filters.mes);
        params.append('anio', filters.anio);
        if (filters.tipo_planilla) params.append('tipo', filters.tipo_planilla);
        url = `${API_BASE_URL}/api/reportes/asistencia/planilla?${params}`;
      } else if (selectedReport === 'reporte-atrasos') {
        params.append('mes', filters.mes);
        params.append('anio', filters.anio);
        if (filters.tipo_planilla) params.append('tipo', filters.tipo_planilla);
        if (filters.top) params.append('top', filters.top);
        url = `${API_BASE_URL}/api/reportes/asistencia/atrasos?${params}`;
      } else if (selectedReport === 'reporte-sanciones') {
        params.append('mes', filters.mes);
        params.append('anio', filters.anio);
        if (filters.tipo_planilla) params.append('tipo', filters.tipo_planilla);
        url = `${API_BASE_URL}/api/reportes/asistencia/sanciones?${params}`;
      }

      window.open(url, '_blank');
    } catch (error) {
      alert('Error al generar reporte: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const colorClasses = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', ring: 'ring-blue-500' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', ring: 'ring-amber-500' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', ring: 'ring-emerald-500' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', ring: 'ring-purple-500' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', ring: 'ring-orange-500' },
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', ring: 'ring-red-500' },
  };

  const currentReport = reports.flatMap(s => s.items).find(r => r.id === selectedReport);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Centro de Reportes</h1>
        <p className="text-slate-500 text-sm">Genera reportes del Hospital Barrios Mineros</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {reports.map(section => (
            <div key={section.section}>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{section.section}</h2>
              <div className="space-y-2">
                {section.items.map(report => {
                  const colors = colorClasses[report.color];
                  const isSelected = selectedReport === report.id;
                  return (
                    <button key={report.id}
                      onClick={() => setSelectedReport(report.id)}
                      className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                        isSelected
                          ? `${colors.border} ${colors.bg} ring-2 ${colors.ring} ring-opacity-20`
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${colors.bg}`}>{report.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-bold text-xs ${isSelected ? colors.text : 'text-slate-800'}`}>
                            {report.title}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 leading-tight">{report.description}</div>
                        </div>
                        <ChevronRight size={14} className={isSelected ? colors.text : 'text-slate-400 shrink-0'} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selectedReport && currentReport ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h2 className="text-lg font-bold text-slate-800">{currentReport.title}</h2>
                <p className="text-sm text-slate-500 mt-0.5">{currentReport.description}</p>
              </div>

              <div className="p-6 space-y-5">
                <div className="flex items-center gap-2 mb-4">
                  <Filter size={16} className="text-slate-400" />
                  <h3 className="text-sm font-bold text-slate-700 uppercase">Filtros</h3>
                </div>

                {(currentReport.filters.includes('mes') || currentReport.filters.includes('anio')) && (
                  <div className="grid grid-cols-2 gap-4">
                    {currentReport.filters.includes('mes') && (
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Mes</label>
                        <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          value={filters.mes}
                          onChange={e => setFilters({...filters, mes: parseInt(e.target.value)})}>
                          {meses.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                        </select>
                      </div>
                    )}
                    {currentReport.filters.includes('anio') && (
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Año</label>
                        <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          value={filters.anio}
                          onChange={e => setFilters({...filters, anio: parseInt(e.target.value)})} />
                      </div>
                    )}
                  </div>
                )}

                {currentReport.filters.includes('tipo_planilla') && (
                  <div className="w-64">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tipo Planilla</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      value={filters.tipo_planilla}
                      onChange={e => setFilters({...filters, tipo_planilla: e.target.value})}>
                      <option value="">Todas</option>
                      <option value="MINISTERIAL">Ministerial</option>
                      <option value="RESIDENTE">Residente</option>
                    </select>
                  </div>
                )}

                {currentReport.filters.includes('top') && (
                  <div className="w-48">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Top N</label>
                    <input type="number" min={5} max={200} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      value={filters.top}
                      onChange={e => setFilters({...filters, top: parseInt(e.target.value)})} />
                  </div>
                )}

                {currentReport.id === 'inventario' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Estado</label>
                      <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        value={filters.estado}
                        onChange={e => setFilters({...filters, estado: e.target.value})}>
                        <option value="TODOS">Todos (Activos + Inactivos)</option>
                        <option value="ACTIVO">Solo Activos</option>
                        <option value="INACTIVO">Solo Inactivos</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Fuente de Financiamiento</label>
                        <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          value={filters.fuente_id}
                          onChange={e => setFilters({...filters, fuente_id: e.target.value})}>
                          <option value="">Todas</option>
                          {config.fuentes.map(f => <option key={f.id} value={f.id}>{f.nombre_fuente}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tipo de Personal</label>
                        <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          value={filters.tipo_id}
                          onChange={e => setFilters({...filters, tipo_id: e.target.value})}>
                          <option value="">Todos</option>
                          {config.tipos.map(t => <option key={t.id} value={t.id}>{t.nombre_tipo}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Unidad / Servicio</label>
                        <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          value={filters.unidad_id}
                          onChange={e => setFilters({...filters, unidad_id: e.target.value})}>
                          <option value="">Todas</option>
                          {config.unidades.map(u => <option key={u.id} value={u.id}>{u.nombre_unidad}</option>)}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {currentReport.id === 'contratos-vencer' && (
                  <div className="w-96">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Días a consultar</label>
                    <div className="flex items-center gap-3">
                      <input type="range" min="7" max="90" step="7"
                        value={filters.days}
                        onChange={e => setFilters({...filters, days: parseInt(e.target.value)})}
                        className="flex-1" />
                      <span className="text-sm font-bold text-slate-700 min-w-[60px] text-center">{filters.days} días</span>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button onClick={handleExport} disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-bold shadow-lg shadow-blue-500/20">
                    <Download size={16} />
                    {loading ? 'Generando...' : 'Exportar Excel'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <Settings size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-600 mb-2">Selecciona un Reporte</h3>
              <p className="text-sm text-slate-400">Elige un reporte de la lista para configurar y exportar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportesPage;
