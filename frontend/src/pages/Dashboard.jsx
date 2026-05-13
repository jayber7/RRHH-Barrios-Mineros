import React, { useState, useEffect } from 'react';
import { 
  Users, Clock, AlertTriangle, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Briefcase, DollarSign 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) return <div className="p-8">Cargando dashboard...</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Panel de Control</h1>
        <p className="text-slate-500 mt-1">Hospital de Segundo Nivel "Barrios Mineros"</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Personal Total" 
          value={stats.totales.personal} 
          icon={<Users className="text-blue-600" />} 
          trend="+2.5%" 
          up={true}
        />
        <StatCard 
          title="Horas Trabajadas" 
          value={Math.round(stats.totales.horas)} 
          icon={<Clock className="text-emerald-600" />} 
          subtitle="Mes de Abril"
        />
        <StatCard 
          title="Minutos Atraso" 
          value={stats.totales.atrasos} 
          icon={<AlertTriangle className="text-rose-600" />} 
          trend="-12%" 
          up={false}
        />
        <StatCard 
          title="Financiamiento" 
          value={stats.fuentesDistribucion.length} 
          icon={<DollarSign className="text-amber-600" />} 
          subtitle="Fuentes Activas"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Gráfico Tipo Personal */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Composición del Personal</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.tipoDistribucion}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({label}) => label}
                >
                  {stats.tipoDistribucion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico Fuentes de Financiamiento */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Personal por Fuente</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.fuentesDistribucion}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Atrasos */}
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Ranking de Atrasos</h3>
          <div className="space-y-4">
            {stats.topAtrasos.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-xs shadow-sm">
                    {i+1}
                  </div>
                  <div>
                    <div className="font-bold text-slate-700 text-sm">{item.primer_nombre} {item.apellido_paterno}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">{item.tipo_planilla}</div>
                  </div>
                </div>
                <div className="text-rose-600 font-black">{item.total_atrasos_min}m</div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen Operativo */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Análisis de Cumplimiento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                    <TrendingUp className="text-blue-500 mb-4" size={24} />
                    <div className="text-slate-500 text-sm font-medium mb-1">Carga Horaria Promedio</div>
                    <div className="text-2xl font-black text-blue-900">142 hrs / mes</div>
                    <div className="text-xs text-blue-600 mt-2 font-bold">+5% respecto al mes anterior</div>
                </div>
                <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                    <Briefcase className="text-emerald-500 mb-4" size={24} />
                    <div className="text-slate-500 text-sm font-medium mb-1">Efectividad de Guardia</div>
                    <div className="text-2xl font-black text-emerald-900">98.2%</div>
                    <div className="text-xs text-emerald-600 mt-2 font-bold">Respuesta inmediata</div>
                </div>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-100 flex justify-between items-center text-slate-400 text-xs font-medium">
                <span>Última actualización: Hoy, {new Date().toLocaleTimeString()}</span>
                <button className="text-blue-600 font-bold hover:underline">Ver Reporte Detallado</button>
            </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, up, subtitle }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      )}
    </div>
    <div className="text-2xl font-black text-slate-800">{value}</div>
    <div className="text-slate-400 text-sm font-medium">{title}</div>
    {subtitle && <div className="text-[10px] text-slate-300 font-bold uppercase mt-1">{subtitle}</div>}
  </div>
);

export default Dashboard;
