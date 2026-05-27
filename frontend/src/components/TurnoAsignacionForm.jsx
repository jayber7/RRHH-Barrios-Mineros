import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const TurnoAsignacionForm = ({ plantillas, personal, onSave, onCancel }) => {
  const [form, setForm] = useState({
    personal_id: '',
    turno_plantilla_id: '',
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_fin: '',
  });
  const [saving, setSaving] = useState(false);
  const [sinTurno, setSinTurno] = useState([]);

  const loadSinTurno = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/turnos/personal-sin-turno`);
      const data = await res.json();
      setSinTurno(data);
    } catch (e) { console.error(e); }
  };

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/turnos/asignados`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      onSave();
    } catch (err) {
      alert('Error al asignar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Asignar Turno a Personal</h2>
        <button type="button" onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"><X size={20} /></button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase">Personal *</label>
          <select value={form.personal_id} onChange={e => set('personal_id', e.target.value)} required
            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">Seleccionar personal...</option>
            {personal.map(p => (
              <option key={p.id} value={p.id}>{p.primer_nombre} {p.apellido_paterno} - CI: {p.ci}</option>
            ))}
          </select>
          <button type="button" onClick={loadSinTurno}
            className="text-xs text-blue-600 hover:text-blue-800 mt-1">
            Mostrar personal sin turno
          </button>
          {sinTurno.length > 0 && (
            <div className="mt-2 max-h-32 overflow-y-auto bg-slate-50 rounded-xl p-2">
              <p className="text-xs font-bold text-slate-500 mb-1">Sin turno asignado ({sinTurno.length}):</p>
              {sinTurno.slice(0, 10).map(p => (
                <button key={p.id} type="button" onClick={() => set('personal_id', p.id)}
                  className="block text-xs text-left w-full px-2 py-1 hover:bg-blue-50 rounded text-slate-600">
                  {p.primer_nombre} {p.apellido_paterno}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase">Plantilla de Turno *</label>
          <select value={form.turno_plantilla_id} onChange={e => set('turno_plantilla_id', e.target.value)} required
            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">Seleccionar turno...</option>
            {plantillas.map(tp => (
              <option key={tp.id} value={tp.id}>{tp.codigo} - {tp.nombre || ''}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase">Fecha Inicio *</label>
          <input type="date" value={form.fecha_inicio} onChange={e => set('fecha_inicio', e.target.value)} required
            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase">Fecha Fin (opcional)</label>
          <input type="date" value={form.fecha_fin} onChange={e => set('fecha_fin', e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel}
          className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200">Cancelar</button>
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50">
          <Save size={18} /> {saving ? 'Guardando...' : 'Asignar Turno'}
        </button>
      </div>
    </form>
  );
};

export default TurnoAsignacionForm;
