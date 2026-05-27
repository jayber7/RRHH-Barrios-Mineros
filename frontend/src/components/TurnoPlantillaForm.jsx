import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

const defaultPlantilla = {
  codigo: '', nombre: '',
  lunes_entrada: '', lunes_salida: '',
  martes_entrada: '', martes_salida: '',
  miercoles_entrada: '', miercoles_salida: '',
  jueves_entrada: '', jueves_salida: '',
  viernes_entrada: '', viernes_salida: '',
  sabado_entrada: '', sabado_salida: '',
  domingo_entrada: '', domingo_salida: '',
  lunes_habilitado: true, martes_habilitado: true, miercoles_habilitado: true,
  jueves_habilitado: true, viernes_habilitado: true, sabado_habilitado: true, domingo_habilitado: true,
  nocturno_lunes: false, nocturno_martes: false, nocturno_miercoles: false,
  nocturno_jueves: false, nocturno_viernes: false, nocturno_sabado: false, nocturno_domingo: false,
  tolerancia_atraso: 5, tolerancia_falta: 60, salida_adelantada: 0, puntualidad: 60, max_extra: 180, prioridad: 'Normal',
};

const TurnoPlantillaForm = ({ plantilla, onSave, onCancel }) => {
  const [form, setForm] = useState(defaultPlantilla);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (plantilla) {
      const f = {};
      for (const k of Object.keys(defaultPlantilla)) f[k] = plantilla[k] ?? defaultPlantilla[k];
      setForm(f);
    } else {
      setForm(defaultPlantilla);
    }
  }, [plantilla]);

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = plantilla
        ? `${API_BASE_URL}/api/turnos/plantilla/${plantilla.id}`
        : `${API_BASE_URL}/api/turnos/plantilla`;
      const method = plantilla ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      onSave();
    } catch (err) {
      alert('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const diaLabel = { lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles', jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo' };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">{plantilla ? 'Editar Plantilla' : 'Nueva Plantilla de Turno'}</h2>
        <button type="button" onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"><X size={20} /></button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase">Código *</label>
          <input value={form.codigo} onChange={e => set('codigo', e.target.value)} required
            placeholder="ej: 07:17, turno 08-20"
            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase">Nombre</label>
          <input value={form.nombre || ''} onChange={e => set('nombre', e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {DIAS.map(d => (
          <div key={d} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700">{diaLabel[d]}</label>
              <label className="flex items-center gap-2 text-xs text-slate-500">
                <input type="checkbox" checked={form[`${d}_habilitado`]}
                  onChange={e => set(`${d}_habilitado`, e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                Activo
              </label>
            </div>
            {form[`${d}_habilitado`] && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Entrada</label>
                    <input type="time" value={form[`${d}_entrada`] || ''}
                      onChange={e => set(`${d}_entrada`, e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Salida</label>
                    <input type="time" value={form[`${d}_salida`] || ''}
                      onChange={e => set(`${d}_salida`, e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs text-slate-500">
                  <input type="checkbox" checked={form[`nocturno_${d}`]}
                    onChange={e => set(`nocturno_${d}`, e.target.checked)}
                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500" />
                  Nocturno
                </label>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase">Tol. Atraso (min)</label>
          <input type="number" value={form.tolerancia_atraso} onChange={e => set('tolerancia_atraso', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase">Tol. Falta (min)</label>
          <input type="number" value={form.tolerancia_falta} onChange={e => set('tolerancia_falta', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase">Salida Adelantada</label>
          <input type="number" value={form.salida_adelantada} onChange={e => set('salida_adelantada', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase">Puntualidad</label>
          <input type="number" value={form.puntualidad} onChange={e => set('puntualidad', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase">Max Extra</label>
          <input type="number" value={form.max_extra} onChange={e => set('max_extra', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel}
          className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all">Cancelar</button>
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all">
          <Save size={18} /> {saving ? 'Guardando...' : (plantilla ? 'Actualizar' : 'Crear Plantilla')}
        </button>
      </div>
    </form>
  );
};

export default TurnoPlantillaForm;
