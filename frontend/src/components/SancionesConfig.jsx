import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, X } from 'lucide-react';
import { API_BASE_URL, authFetch } from '../config/api';

const SancionesConfig = () => {
  const [sancionesAtrasos, setSancionesAtrasos] = useState([]);
  const [sancionesFaltas, setSancionesFaltas] = useState([]);
  const [activeTab, setActiveTab] = useState('atrasos');
  const [newItem, setNewItem] = useState(null);

  const fetchData = async () => {
    try {
      const [at, fa] = await Promise.all([
        authFetch(`${API_BASE_URL}/api/sanciones/atrasos`).then(r => r.json()),
        authFetch(`${API_BASE_URL}/api/sanciones/faltas`).then(r => r.json()),
      ]);
      setSancionesAtrasos(at);
      setSancionesFaltas(fa);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (tipo, id) => {
    if (!window.confirm('¿Eliminar sanción?')) return;
    try {
      await authFetch(`${API_BASE_URL}/api/sanciones/${tipo}/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (e) { alert('Error'); }
  };

  const handleCreate = async (tipo) => {
    if (!newItem || !newItem.rango_inicial || !newItem.rango_final) return alert('Complete todos los campos');
    try {
      const endpoint = tipo === 'atrasos' ? 'atrasos' : 'faltas';
      await authFetch(`${API_BASE_URL}/api/sanciones/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      setNewItem(null);
      fetchData();
    } catch (e) { alert('Error'); }
  };

  const renderTable = (data, tipo) => (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-700">{tipo === 'atrasos' ? 'Multas por Atrasos (minutos acumulados)' : 'Multas por Faltas (días)'}</h3>
        <button onClick={() => setNewItem({ rango_inicial: '', rango_final: '', sancion_desc: '', factor: 0 })}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700">
          <Plus size={16} /> Agregar
        </button>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Rango Inicial</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Rango Final</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Sanción</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Factor</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map(s => (
            <tr key={s.id} className="hover:bg-slate-50/50">
              <td className="px-6 py-4 font-bold text-slate-700">{s.rango_inicial}</td>
              <td className="px-6 py-4 text-slate-600">{s.rango_final}</td>
              <td className="px-6 py-4 text-slate-700">{s.sancion_desc}</td>
              <td className="px-6 py-4 text-right font-bold text-blue-600">{s.factor}</td>
              <td className="px-6 py-4 text-right">
                <button onClick={() => handleDelete(tipo, s.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const newRowForm = (
    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex flex-wrap gap-3 items-end">
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-amber-600 uppercase">Rango Inicial</label>
        <input type="number" value={newItem?.rango_inicial || ''} onChange={e => setNewItem(p => ({...p, rango_inicial: parseInt(e.target.value) || 0}))}
          className="w-24 px-3 py-2 bg-white border border-amber-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-amber-600 uppercase">Rango Final</label>
        <input type="number" value={newItem?.rango_final || ''} onChange={e => setNewItem(p => ({...p, rango_final: parseInt(e.target.value) || 0}))}
          className="w-24 px-3 py-2 bg-white border border-amber-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
      </div>
      <div className="space-y-1 flex-1 min-w-[200px]">
        <label className="text-[10px] font-bold text-amber-600 uppercase">Descripción</label>
        <input value={newItem?.sancion_desc || ''} onChange={e => setNewItem(p => ({...p, sancion_desc: e.target.value}))}
          className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-amber-600 uppercase">Factor</label>
        <input type="number" step="0.01" value={newItem?.factor || ''} onChange={e => setNewItem(p => ({...p, factor: parseFloat(e.target.value) || 0}))}
          className="w-24 px-3 py-2 bg-white border border-amber-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
      </div>
      <button onClick={() => handleCreate(activeTab)}
        className="px-4 py-2 bg-amber-600 text-white rounded-xl font-bold text-sm hover:bg-amber-700">Guardar</button>
      <button onClick={() => setNewItem(null)}
        className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg"><X size={18} /></button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 w-fit">
        <button onClick={() => setActiveTab('atrasos')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'atrasos' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-500'}`}>
          Atrasos
        </button>
        <button onClick={() => setActiveTab('faltas')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'faltas' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500'}`}>
          Faltas
        </button>
      </div>

      {newItem && newRowForm}

      {activeTab === 'atrasos' ? renderTable(sancionesAtrasos, 'atrasos') : renderTable(sancionesFaltas, 'faltas')}
    </div>
  );
};

export default SancionesConfig;
