import React, { useState } from 'react';
import { X } from 'lucide-react';

const PersonalForm = ({ personal, catalogos, onClose, onSave }) => {
  // Asegurarse de que las fechas se formateen correctamente para el input date (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState(personal ? {
    ...personal,
    fecha_nacimiento: formatDateForInput(personal.fecha_nacimiento),
    fecha_ingreso: formatDateForInput(personal.fecha_ingreso),
    fecha_institucionalizacion: formatDateForInput(personal.fecha_institucionalizacion)
  } : {
    ci: '',
    complemento: '',
    exp_id: '',
    apellido_paterno: '',
    apellido_materno: '',
    apellido_casada: '',
    primer_nombre: '',
    segundo_nombre: '',
    tercer_nombre: '',
    fecha_nacimiento: '',
    profesion_id: '',
    telefono: '',
    // Datos laborales
    establecimiento_id: '',
    tipo_personal_id: '',
    fuente_financiamiento_id: '',
    identificador_laboral: '',
    unidad_servicio: '',
    cargo_actual: '',
    carga_horaria: '',
    fecha_ingreso: '',
    fecha_institucionalizacion: '',
    observaciones: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden max-h-[95vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">
            {personal ? 'Editar Personal y Vínculo' : 'Nuevo Registro de Personal y Vínculo'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          <div className="space-y-8">
            {/* Sección: Datos Personales */}
            <section>
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 border-b border-blue-100 pb-1">1. Datos Personales</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">CI *</label>
                  <div className="flex gap-1">
                    <input
                      required
                      placeholder="Número"
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      value={formData.ci}
                      onChange={(e) => setFormData({...formData, ci: e.target.value})}
                    />
                    <input
                      placeholder="Ext"
                      className="w-12 px-1 py-2 border border-slate-300 rounded-lg outline-none text-sm text-center"
                      value={formData.complemento || ''}
                      onChange={(e) => setFormData({...formData, complemento: e.target.value})}
                    />
                    <select 
                      className="w-16 px-1 py-2 border border-slate-300 rounded-lg outline-none text-sm"
                      value={formData.exp_id || ''}
                      onChange={(e) => setFormData({...formData, exp_id: e.target.value})}
                    >
                      <option value="">Exp.</option>
                      {catalogos.expediciones?.map(e => <option key={e.id} value={e.id}>{e.sigla}</option>)}
                    </select>
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Primer Nombre *</label>
                  <input
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={formData.primer_nombre}
                    onChange={(e) => setFormData({...formData, primer_nombre: e.target.value})}
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Segundo Nombre</label>
                  <input
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={formData.segundo_nombre || ''}
                    onChange={(e) => setFormData({...formData, segundo_nombre: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Apellido Paterno</label>
                  <input
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={formData.apellido_paterno || ''}
                    onChange={(e) => setFormData({...formData, apellido_paterno: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Apellido Materno</label>
                  <input
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={formData.apellido_materno || ''}
                    onChange={(e) => setFormData({...formData, apellido_materno: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Apellido de Casada</label>
                  <input
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={formData.apellido_casada || ''}
                    onChange={(e) => setFormData({...formData, apellido_casada: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">F. Nacimiento</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={formData.fecha_nacimiento}
                    onChange={(e) => setFormData({...formData, fecha_nacimiento: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Teléfono</label>
                  <input
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={formData.telefono || ''}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Profesión</label>
                  <select 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm"
                    value={formData.profesion_id || ''}
                    onChange={(e) => setFormData({...formData, profesion_id: e.target.value})}
                  >
                    <option value="">Seleccionar...</option>
                    {catalogos.profesiones?.map(p => <option key={p.id} value={p.id}>{p.nombre_profesion}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* Sección: Información Laboral */}
            <section>
              <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4 border-b border-emerald-100 pb-1">2. Información Laboral</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Establecimiento</label>
                  <select 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm"
                    value={formData.establecimiento_id || ''}
                    onChange={(e) => setFormData({...formData, establecimiento_id: e.target.value})}
                  >
                    <option value="">Seleccionar...</option>
                    {catalogos.establecimientos?.map(est => <option key={est.id} value={est.id}>{est.nombre_establecimiento}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tipo de Personal</label>
                  <select 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm"
                    value={formData.tipo_personal_id || ''}
                    onChange={(e) => setFormData({...formData, tipo_personal_id: e.target.value})}
                  >
                    <option value="">Seleccionar...</option>
                    {catalogos.tipos?.map(t => <option key={t.id} value={t.id}>{t.nombre_tipo}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Fuente Financiamiento</label>
                  <select 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm"
                    value={formData.fuente_financiamiento_id || ''}
                    onChange={(e) => setFormData({...formData, fuente_financiamiento_id: e.target.value})}
                  >
                    <option value="">Seleccionar...</option>
                    {catalogos.fuentes?.map(f => <option key={f.id} value={f.id}>{f.nombre_fuente}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Ítem / Identificador</label>
                  <input
                    placeholder="Ej. 123456"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold"
                    value={formData.identificador_laboral || ''}
                    onChange={(e) => setFormData({...formData, identificador_laboral: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Cargo Actual</label>
                  <input
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={formData.cargo_actual || ''}
                    onChange={(e) => setFormData({...formData, cargo_actual: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Unidad / Servicio</label>
                  <input
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={formData.unidad_servicio || ''}
                    onChange={(e) => setFormData({...formData, unidad_servicio: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Carga Horaria</label>
                  <input
                    placeholder="Ej. 30 Hrs."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={formData.carga_horaria || ''}
                    onChange={(e) => setFormData({...formData, carga_horaria: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">F. Ingreso</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={formData.fecha_ingreso}
                    onChange={(e) => setFormData({...formData, fecha_ingreso: e.target.value})}
                  />
                </div>

                <div className="col-span-3">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Observaciones</label>
                  <textarea
                    rows="2"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={formData.observaciones || ''}
                    onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                  ></textarea>
                </div>
              </div>
            </section>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 text-sm font-bold"
            >
              {personal ? 'Actualizar Información' : 'Registrar Personal y Vínculo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalForm;
