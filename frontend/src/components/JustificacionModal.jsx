import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { API_BASE_URL, authFetch } from '../config/api';

const TIPOS = ['ENTRADA', 'SALIDA', 'AMBOS', 'FALTA', 'ATRASO'];

const JustificacionModal = ({ isOpen, onClose, onSave, personalId, fecha }) => {
  const [form, setForm] = useState({
    personal_id: personalId || '',
    fecha: fecha || new Date().toISOString().split('T')[0],
    tipo: 'ATRASO',
    hora_justificada: '',
    motivo_id: '',
    motivo_detalle: '',
    justificante: '',
  });
  const [motivos, setMotivos] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      authFetch(`${API_BASE_URL}/api/sanciones/motivos`)
        .then(r => r.json())
        .then(setMotivos)
        .catch(() => {});
      if (personalId) setForm(f => ({ ...f, personal_id: personalId, fecha: fecha || f.fecha }));
    }
  }, [isOpen, personalId, fecha]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/api/justificaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      onSave();
      onClose();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <AlertCircle size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Registrar Justificación</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Fecha</label>
              <input type="date" value={form.fecha} onChange={e => setForm(f => ({...f, fecha: e.target.value}))} required
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Tipo</label>
              <select value={form.tipo} onChange={e => setForm(f => ({...f, tipo: e.target.value}))} required
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none">
                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Hora Justificada</label>
            <input type="time" value={form.hora_justificada} onChange={e => setForm(f => ({...f, hora_justificada: e.target.value}))}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Motivo</label>
            <select value={form.motivo_id} onChange={e => setForm(f => ({...f, motivo_id: e.target.value}))}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">Seleccionar...</option>
              {motivos.map(m => <option key={m.id} value={m.id}>{m.detalle}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Detalle</label>
            <textarea value={form.motivo_detalle} onChange={e => setForm(f => ({...f, motivo_detalle: e.target.value}))} rows={2}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Justificante (quién autoriza)</label>
            <input value={form.justificante} onChange={e => setForm(f => ({...f, justificante: e.target.value}))}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200">Cancelar</button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 disabled:opacity-50">
              <Save size={18} /> {saving ? 'Guardando...' : 'Registrar Justificación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JustificacionModal;
