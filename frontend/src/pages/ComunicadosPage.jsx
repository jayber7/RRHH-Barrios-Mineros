import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, Send, Search, Plus, CheckCheck, Download, X } from 'lucide-react';

const ESTADO_BADGES = {
  recibido: 'bg-blue-100 text-blue-600',
  derivado: 'bg-amber-100 text-amber-600',
  respondido: 'bg-emerald-100 text-emerald-600',
};

export default function ComunicadosPage() {
  const { authAxios, usuario } = useAuth();
  const api = authAxios();
  const [comunicados, setComunicados] = useState([]);
  const [destinatarios, setDestinatarios] = useState([]);
  const [catalogos, setCatalogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [form, setForm] = useState({
    referencia: '', observaciones: '', tipo_id: '', clasificacion_id: '',
    fecha_documento: new Date().toISOString().split('T')[0],
    destinatarios: [], etiquetas: [], cite: '',
  });

  useEffect(() => {
    Promise.all([
      api.get('/api/comunicados'),
      api.get('/api/comunicados/destinatarios'),
      api.get('/api/correspondencia/catalogos'),
    ]).then(([comRes, destRes, catRes]) => {
      setComunicados(comRes.data?.data || []);
      setDestinatarios(destRes.data || []);
      const cat = catRes.data;
      setCatalogos(cat);
      if (!form.tipo_id && cat.tipos?.length > 0) {
        const comTipo = cat.tipos.find(t => t.codigo === 'COM');
        setForm(f => ({ ...f, tipo_id: comTipo?.id || cat.tipos[0]?.id || '' }));
      }
    }).finally(() => setLoading(false));
  }, []);

  const toggleDestinatario = (id) => {
    setForm(f => ({
      ...f,
      destinatarios: f.destinatarios.includes(id) ? f.destinatarios.filter(d => d !== id) : [...f.destinatarios, id],
    }));
  };

  const handleCreate = async () => {
    if (!form.referencia.trim()) return;
    try {
      const payload = {
        ...form,
        destinatarios: JSON.stringify(form.destinatarios),
        etiquetas: JSON.stringify(form.etiquetas),
      };
      const res = await api.post('/api/comunicados', payload);
      setComunicados(prev => [res.data, ...prev]);
      setShowForm(false);
      setForm(f => ({ ...f, referencia: '', observaciones: '', destinatarios: [], etiquetas: [], cite: '' }));
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  const marcarLeido = async (id) => {
    try {
      await api.put(`/api/comunicados/${id}/leer`);
      setComunicados(prev => prev.map(c => {
        if (c.id !== id) return c;
        const dist = (c.distribucion || []).map(d =>
          d.personal_id === usuario?.personal_id ? { ...d, leido: true, fecha_lectura: new Date().toISOString() } : d
        );
        return { ...c, distribucion: dist };
      }));
    } catch {}
  };

  const handlePDF = async (id) => {
    try {
      const res = await api.get(`/api/comunicados/${id}/pdf`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      window.open(url);
    } catch {
      alert('Error al generar PDF');
    }
  };

  if (loading) return <div className="p-8 text-slate-400">Cargando...</div>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            <FileText size={26} className="text-slate-600" /> Comunicados / Memorándums
          </h1>
          <p className="text-slate-500 text-sm mt-1">Gestión de comunicaciones internas</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus size={16} /> Nuevo Comunicado
        </button>
      </div>

      <div className="mb-4">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={filtro} onChange={e => setFiltro(e.target.value)}
            placeholder="Buscar comunicados..." className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="space-y-3">
        {comunicados.filter(c => !filtro || c.referencia?.toLowerCase().includes(filtro.toLowerCase())).length === 0 && (
          <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm text-center">
            <FileText size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No hay comunicados registrados</p>
          </div>
        )}
        {comunicados.filter(c => !filtro || c.referencia?.toLowerCase().includes(filtro.toLowerCase())).map(c => (
          <div key={c.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelected(selected?.id === c.id ? null : c)}>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-400 font-mono">HR-{String(c.hr_correlativo).padStart(4, '0')}/{c.gestion}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ESTADO_BADGES[c.estado] || 'bg-slate-100 text-slate-500'}`}>{c.estado}</span>
                  {c.etiquetas?.map(e => (
                    <span key={e.id} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: e.color + '20', color: e.color }}>{e.nombre}</span>
                  ))}
                </div>
                <p className="text-sm font-bold text-slate-700">{c.referencia}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {c.remitente_nombre || 'DIRECCIÓN'} · {new Date(c.fecha_recepcion).toLocaleDateString('es-BO')}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <button onClick={(e) => { e.stopPropagation(); handlePDF(c.id); }}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><Download size={16} /></button>
                {c.distribucion?.some(d => d.personal_id === usuario?.personal_id && !d.leido) && (
                  <button onClick={(e) => { e.stopPropagation(); marcarLeido(c.id); }}
                    className="p-2 hover:bg-blue-50 rounded-lg text-blue-500"><CheckCheck size={16} /></button>
                )}
              </div>
            </div>

            {selected?.id === c.id && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                {c.observaciones && (
                  <div className="mb-3 p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Contenido:</p>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{c.observaciones}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 mb-1">Distribución</p>
                    <div className="space-y-1">
                      {(c.distribucion || []).map(d => (
                        <div key={d.id} className="flex items-center gap-2 text-sm">
                          <span className={`w-2 h-2 rounded-full ${d.leido ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                          <span className={d.leido ? 'text-slate-600' : 'text-slate-400'}>{d.nombre}</span>
                          {d.leido && <span className="text-[10px] text-emerald-500">Leído</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 mb-1">Acciones</p>
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); handlePDF(c.id); }}
                        className="px-3 py-1.5 text-xs bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600 flex items-center gap-1">
                        <Download size={12} /> PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Nuevo Comunicado</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Tipo</label>
                  <select value={form.tipo_id} onChange={e => setForm(f => ({ ...f, tipo_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                    {catalogos.tipos?.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Clasificación</label>
                  <select value={form.clasificacion_id} onChange={e => setForm(f => ({ ...f, clasificacion_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Sin clasificación</option>
                    {catalogos.clasificaciones?.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">CITE (opcional)</label>
                <input type="text" value={form.cite} onChange={e => setForm(f => ({ ...f, cite: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Referencia / Asunto *</label>
                <input type="text" value={form.referencia} onChange={e => setForm(f => ({ ...f, referencia: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Contenido / Observaciones</label>
                <textarea value={form.observaciones} onChange={e => setForm(f => ({ ...f, observaciones: e.target.value }))} rows={5}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Destinatarios</label>
                <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-2 space-y-1">
                  {destinatarios.map(d => (
                    <label key={d.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
                      <input type="checkbox" checked={form.destinatarios.includes(d.id)}
                        onChange={() => toggleDestinatario(d.id)} className="rounded text-blue-600" />
                      <span className="text-sm text-slate-700">{d.nombre_completo}</span>
                      <span className="text-xs text-slate-400 ml-auto">{d.unidad_servicio}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Fecha del Documento</label>
                <input type="date" value={form.fecha_documento} onChange={e => setForm(f => ({ ...f, fecha_documento: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button onClick={handleCreate}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700">
                <Send size={16} /> Publicar Comunicado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
