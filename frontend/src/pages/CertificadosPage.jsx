import React, { useState, useEffect } from 'react';
import {
  FileText, Plus, Download, Search, CheckCircle2,
  AlertCircle, Printer, Ban, Filter
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const TIPOS = [
  { codigo: 'TRABAJO', nombre: 'Certificado de Trabajo' },
  { codigo: 'INGRESOS', nombre: 'Certificado de Ingresos' },
  { codigo: 'ANTIGUEDAD', nombre: 'Certificado de Antigüedad' },
  { codigo: 'ASISTENCIA', nombre: 'Certificado de Asistencia' },
];

const ESTADOS = {
  GENERADO: { label: 'Generado', class: 'bg-blue-50 text-blue-600' },
  ENTREGADO: { label: 'Entregado', class: 'bg-emerald-50 text-emerald-600' },
  ANULADO: { label: 'Anulado', class: 'bg-slate-50 text-slate-400' },
};

const CertificadosPage = () => {
  const [certificados, setCertificados] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [personalList, setPersonalList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [filtros, setFiltros] = useState({ tipo: '', estado: '' });
  const [form, setForm] = useState({ personal_id: '', tipo: 'TRABAJO' });

  useEffect(() => {
    fetchCertificados();
    fetchResumen();
    fetchPersonal();
  }, [filtros]);

  const fetchCertificados = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/api/certificados?limit=100`;
      if (filtros.tipo) url += `&tipo=${filtros.tipo}`;
      if (filtros.estado) url += `&estado=${filtros.estado}`;
      const res = await fetch(url);
      if (res.ok) setCertificados(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchResumen = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/certificados/resumen`);
      if (res.ok) setResumen(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchPersonal = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/personal?limit=300`);
      if (res.ok) {
        const json = await res.json();
        setPersonalList(json.data || []);
      }
    } catch (e) { console.error(e); }
  };

  const handleGenerar = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/certificados/generar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personal_id: parseInt(form.personal_id),
          tipo: form.tipo
        })
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error);
        return;
      }
      const result = await res.json();
      setShowForm(false);
      setForm({ personal_id: '', tipo: 'TRABAJO' });
      fetchCertificados();
      fetchResumen();
      // Auto-download
      downloadPDF(result.id, result.nro_cite);
    } catch (e) {
      alert('Error al generar certificado');
    } finally {
      setGenerating(false);
    }
  };

  const downloadPDF = async (id, filename) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/certificados/${id}/pdf`);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) { console.error(e); }
  };

  const cambiarEstado = async (id, estado) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/certificados/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado })
      });
      if (res.ok) { fetchCertificados(); fetchResumen(); }
    } catch (e) { console.error(e); }
  };

  const getTipoNombre = (codigo) => TIPOS.find(t => t.codigo === codigo)?.nombre || codigo;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Certificaciones</h1>
          <p className="text-slate-500 mt-1">Generación y gestión de certificados laborales</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all"
        >
          <Plus size={20} />
          Generar Certificado
        </button>
      </div>

      {resumen && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <ResumenCard label="Total" value={resumen.total} color="blue" />
          <ResumenCard label="Generados" value={resumen.generados} color="blue" />
          <ResumenCard label="Entregados" value={resumen.entregados} color="emerald" />
          <ResumenCard label="Anulados" value={resumen.anulados} color="slate" />
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Generar Nuevo Certificado</h2>
          <form onSubmit={handleGenerar} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Empleado</label>
                <select value={form.personal_id} onChange={e => setForm({ ...form, personal_id: e.target.value })}
                  required className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500">
                  <option value="">Seleccionar...</option>
                  {personalList.map(p => (
                    <option key={p.id} value={p.id}>{p.apellido_paterno} {p.primer_nombre} - {p.ci}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Tipo de Certificado</label>
                <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}
                  required className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500">
                  {TIPOS.map(t => (
                    <option key={t.codigo} value={t.codigo}>{t.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={generating}
                className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:bg-slate-300">
                {generating ? 'Generando...' : 'Generar y Descargar'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-8 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4 flex-wrap">
          <Filter size={18} className="text-slate-400" />
          <select value={filtros.tipo} onChange={e => setFiltros({ ...filtros, tipo: e.target.value })}
            className="px-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500">
            <option value="">Todos los tipos</option>
            {TIPOS.map(t => (
              <option key={t.codigo} value={t.codigo}>{t.nombre}</option>
            ))}
          </select>
          <select value={filtros.estado} onChange={e => setFiltros({ ...filtros, estado: e.target.value })}
            className="px-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500">
            <option value="">Todos los estados</option>
            <option value="GENERADO">Generados</option>
            <option value="ENTREGADO">Entregados</option>
            <option value="ANULADO">Anulados</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Nº Certificado</th>
                <th className="px-6 py-4">Empleado</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Fecha Emisión</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-20 text-center text-slate-300">Cargando...</td></tr>
              ) : certificados.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-20 text-center text-slate-300">
                  <FileText size={48} className="mx-auto mb-4 opacity-20" />
                  No hay certificados generados
                </td></tr>
              ) : certificados.map(c => {
                const est = ESTADOS[c.estado] || ESTADOS.GENERADO;
                return (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <code className="bg-slate-100 px-2 py-1 rounded text-blue-600 font-mono text-sm font-bold">
                        {c.nro_cite}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-700">{c.apellido_paterno} {c.primer_nombre}</div>
                      <div className="text-xs text-slate-400">CI: {c.ci}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-700">{getTipoNombre(c.tipo)}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(c.fecha_emision).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${est.class}`}>
                        {est.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <button onClick={() => downloadPDF(c.id, c.nro_cite)}
                          className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors" title="Descargar PDF">
                          <Download size={16} />
                        </button>
                        {c.estado === 'GENERADO' && (
                          <>
                            <button onClick={() => cambiarEstado(c.id, 'ENTREGADO')}
                              className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors" title="Marcar entregado">
                              <CheckCircle2 size={16} />
                            </button>
                            <button onClick={() => cambiarEstado(c.id, 'ANULADO')}
                              className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors" title="Anular">
                              <Ban size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ResumenCard = ({ label, value, color }) => {
  const colors = {
    blue: 'bg-blue-50 border-blue-100 text-blue-600',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-600',
    amber: 'bg-amber-50 border-amber-100 text-amber-600',
    slate: 'bg-slate-50 border-slate-200 text-slate-500',
  };
  return (
    <div className={`rounded-3xl border p-6 text-center ${colors[color] || colors.blue}`}>
      <p className="text-3xl font-black">{value}</p>
      <p className="text-sm font-bold mt-1">{label}</p>
    </div>
  );
};

export default CertificadosPage;
