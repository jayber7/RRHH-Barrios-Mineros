import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Shield, Plus, Trash2, Save, X, Users, Key,
  CheckCircle2, AlertTriangle, Edit3, Search
} from 'lucide-react';

const TABS = [
  { id: 'roles', label: 'Roles', icon: <Shield size={18} /> },
  { id: 'permisos', label: 'Permisos por Rol', icon: <Key size={18} /> },
  { id: 'usuarios', label: 'Usuarios', icon: <Users size={18} /> },
];

export default function AdminRolesPage() {
  const { authAxios } = useAuth();
  const api = authAxios();
  const [activeTab, setActiveTab] = useState('roles');
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermisos, setRolePermisos] = useState([]);
  const [savingPermisos, setSavingPermisos] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [roleForm, setRoleForm] = useState({ nombre: '', descripcion: '' });
  const [mensaje, setMensaje] = useState(null);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [usuarioRoles, setUsuarioRoles] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());
  const [bulkRoleId, setBulkRoleId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [applyingBulk, setApplyingBulk] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [rolesRes, permisosRes] = await Promise.all([
        api.get('/api/roles'),
        api.get('/api/roles/permisos'),
      ]);
      setRoles(rolesRes.data);
      setPermisos(permisosRes.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const fetchUsuarios = async () => {
    try {
      const res = await api.get('/api/usuarios');
      setUsuarios(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => { if (activeTab === 'usuarios') fetchUsuarios(); }, [activeTab]);

  const fetchRolePermisos = async (roleId) => {
    try {
      const res = await api.get(`/api/roles/${roleId}/permisos`);
      setRolePermisos(res.data);
      setSelectedRole(roles.find(r => r.id === roleId));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSavePermisos = async () => {
    if (!selectedRole) return;
    setSavingPermisos(true);
    try {
      const ids = rolePermisos.filter(p => p.asignado).map(p => p.id);
      await api.put(`/api/roles/${selectedRole.id}/permisos`, { permiso_ids: ids });
      setMensaje({ type: 'success', text: 'Permisos actualizados correctamente' });
    } catch (e) {
      setMensaje({ type: 'error', text: e.response?.data?.error || 'Error al guardar permisos' });
    }
    setSavingPermisos(false);
    fetchAll();
  };

  const togglePermiso = (id) => {
    setRolePermisos(prev => prev.map(p =>
      p.id === id ? { ...p, asignado: !p.asignado } : p
    ));
  };

  const openNewRole = () => {
    setEditRole(null);
    setRoleForm({ nombre: '', descripcion: '' });
    setShowRoleModal(true);
  };

  const openEditRole = (role) => {
    setEditRole(role);
    setRoleForm({ nombre: role.nombre, descripcion: role.descripcion || '' });
    setShowRoleModal(true);
  };

  const handleSaveRole = async () => {
    if (!roleForm.nombre.trim()) return;
    try {
      if (editRole) {
        await api.put(`/api/roles/${editRole.id}`, roleForm);
      } else {
        await api.post('/api/roles', roleForm);
      }
      setShowRoleModal(false);
      fetchAll();
    } catch (e) {
      setMensaje({ type: 'error', text: e.response?.data?.error || 'Error al guardar rol' });
    }
  };

  const handleDeleteRole = async (id) => {
    if (!confirm('¿Eliminar este rol? Los usuarios con este rol perderán esos permisos.')) return;
    try {
      await api.delete(`/api/roles/${id}`);
      fetchAll();
    } catch (e) {
      setMensaje({ type: 'error', text: e.response?.data?.error || 'Error al eliminar rol' });
    }
  };

  const loadUsuarioRoles = async (user) => {
    setSelectedUsuario(user);
    try {
      const res = await api.get('/api/roles');
      const allRoles = res.data;
      setUsuarioRoles(allRoles.map(r => ({
        ...r,
        asignado: user.roles?.includes(r.nombre) || false,
      })));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleUsuarioRole = (rolId) => {
    setUsuarioRoles(prev => prev.map(r =>
      r.id === rolId ? { ...r, asignado: !r.asignado } : r
    ));
  };

  const handleSaveUsuarioRoles = async () => {
    if (!selectedUsuario) return;
    try {
      const roleIds = usuarioRoles.filter(r => r.asignado).map(r => r.id);
      await api.put(`/api/usuarios/${selectedUsuario.id}/roles`, { role_ids: roleIds });
      setMensaje({ type: 'success', text: 'Roles actualizados' });
      fetchUsuarios();
    } catch (e) {
      setMensaje({ type: 'error', text: e.response?.data?.error || 'Error' });
    }
  };

  const handleResetPassword = async (id) => {
    if (!confirm('¿Resetear contraseña al CI del usuario?')) return;
    try {
      await api.post(`/api/usuarios/${id}/reset-password`);
      setMensaje({ type: 'success', text: 'Contraseña reseteada al CI' });
    } catch (e) {
      setMensaje({ type: 'error', text: e.response?.data?.error || 'Error' });
    }
  };

  const handleToggleActivo = async (id) => {
    try {
      await api.put(`/api/usuarios/${id}/toggle-activo`);
      fetchUsuarios();
    } catch (e) {
      setMensaje({ type: 'error', text: e.response?.data?.error || 'Error' });
    }
  };

  const handleBulkAction = async (action) => {
    if (!bulkRoleId) return alert('Selecciona un rol');
    if (selectedUserIds.size === 0) return alert('Selecciona al menos un usuario');
    
    setApplyingBulk(true);
    try {
      const endpoint = action === 'assign' ? '/api/usuarios/bulk-assign-role' : '/api/usuarios/bulk-remove-role';
      await api.post(endpoint, {
        user_ids: Array.from(selectedUserIds),
        role_id: parseInt(bulkRoleId)
      });
      setMensaje({ type: 'success', text: `Operación masiva completada: ${action === 'assign' ? 'Asignado' : 'Removido'}` });
      setSelectedUserIds(new Set());
      fetchUsuarios();
    } catch (e) {
      setMensaje({ type: 'error', text: e.response?.data?.error || 'Error en operación masiva' });
    }
    setApplyingBulk(false);
  };

  const toggleSelectAll = () => {
    if (selectedUserIds.size === filteredUsuarios.length) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(filteredUsuarios.map(u => u.id)));
    }
  };

  const toggleSelectUser = (id) => {
    const next = new Set(selectedUserIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedUserIds(next);
  };

  const filteredUsuarios = usuarios.filter(u => 
    `${u.primer_nombre} ${u.apellido_paterno} ${u.ci} ${u.username}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const modules = [...new Set(permisos.map(p => p.modulo))];

  if (loading) {
    return <div className="p-8 flex items-center justify-center h-64"><div className="text-slate-400 text-lg">Cargando...</div></div>;
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Roles y Permisos</h1>
        <p className="text-slate-500 text-sm">Administración de roles del sistema y asignación de permisos</p>
      </div>

      {mensaje && (
        <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border ${
          mensaje.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
        }`}>
          {mensaje.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <p className="text-sm font-medium">{mensaje.text}</p>
          <button onClick={() => setMensaje(null)} className="ml-auto"><X size={16} /></button>
        </div>
      )}

      <div className="flex gap-1 mb-6 bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-fit">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'roles' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-700">Roles del Sistema</h2>
            <button onClick={openNewRole}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
              <Plus size={16} /> Nuevo Rol
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Nombre</th>
                  <th className="p-4 text-left">Descripción</th>
                  <th className="p-4 text-center">Usuarios</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {roles.map(role => (
                  <tr key={role.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="p-4 text-slate-400 font-mono">{role.id}</td>
                    <td className="p-4 font-bold text-slate-700">{role.nombre}</td>
                    <td className="p-4 text-slate-500">{role.descripcion || '-'}</td>
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">{role.total_usuarios || 0}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEditRole(role)}
                          className="p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                          <Edit3 size={15} />
                        </button>
                        <button onClick={() => handleDeleteRole(role.id)}
                          className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'permisos' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-700">Roles</h2>
            </div>
            <div className="p-2">
              {roles.map(role => (
                <button key={role.id} onClick={() => fetchRolePermisos(role.id)}
                  className={`w-full text-left p-3 rounded-xl mb-1 text-sm font-medium transition-colors ${
                    selectedRole?.id === role.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}>
                  <Shield size={14} className="inline mr-2" />
                  {role.nombre}
                  <span className="text-xs text-slate-400 ml-2">({role.total_usuarios || 0})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
            {selectedRole ? (
              <>
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-700">
                    Permisos: <span className="text-blue-600">{selectedRole.nombre}</span>
                  </h2>
                  <button onClick={handleSavePermisos} disabled={savingPermisos}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors disabled:bg-slate-300">
                    <Save size={15} /> {savingPermisos ? 'Guardando...' : 'Guardar Permisos'}
                  </button>
                </div>
                <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                  {modules.map(mod => (
                    <div key={mod}>
                      <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                        {mod === 'correspondencia' ? 'Correspondencia' :
                         mod === 'personal' ? 'Personal' :
                         mod === 'asistencia' ? 'Asistencia' :
                         mod === 'biometrico' ? 'Biométrico' :
                         mod === 'dashboard' ? 'Dashboard' :
                         mod === 'turnos' ? 'Turnos' :
                         mod === 'reportes' ? 'Reportes' :
                         mod === 'vacaciones' ? 'Vacaciones' :
                         mod === 'permisos' ? 'Permisos Laborales' :
                         mod === 'certificados' ? 'Certificados' :
                         mod === 'comunicados' ? 'Comunicados' :
                         mod === 'notificaciones' ? 'Notificaciones' :
                         mod === 'sanciones' ? 'Sanciones' :
                         mod === 'justificaciones' ? 'Justificaciones' :
                         mod === 'roles' ? 'Roles' :
                         mod === 'config' ? 'Configuración' :
                         mod === 'usuarios' ? 'Usuarios' : mod}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
                        {rolePermisos.filter(p => p.modulo === mod).map(p => (
                          <label key={p.id}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                              p.asignado ? 'bg-blue-50 border border-blue-100' : 'bg-slate-50 border border-slate-100 hover:border-slate-200'
                            }`}>
                            <input type="checkbox" checked={p.asignado}
                              onChange={() => togglePermiso(p.id)}
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                            <div>
                              <p className="text-sm font-medium text-slate-700">{p.descripcion}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{p.codigo}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-slate-400">
                <Key size={40} className="mx-auto mb-4 opacity-30" />
                <p className="text-sm">Selecciona un rol para ver y editar sus permisos</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'usuarios' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
              <h2 className="text-sm font-bold text-slate-700 whitespace-nowrap">Usuarios</h2>
              <div className="relative flex-1 max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Buscar usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border-none rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {selectedUserIds.size > 0 && (
              <div className="p-3 bg-blue-600 text-white flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold">{selectedUserIds.size} seleccionados</span>
                  <select 
                    value={bulkRoleId}
                    onChange={(e) => setBulkRoleId(e.target.value)}
                    className="bg-blue-700 border-none text-white text-xs rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-white/50"
                  >
                    <option value="">Seleccionar rol...</option>
                    {roles.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleBulkAction('assign')}
                    disabled={applyingBulk || !bulkRoleId}
                    className="px-3 py-1 bg-white text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 disabled:opacity-50 transition-colors"
                  >
                    Asignar
                  </button>
                  <button 
                    onClick={() => handleBulkAction('remove')}
                    disabled={applyingBulk || !bulkRoleId}
                    className="px-3 py-1 bg-blue-400 text-white rounded-lg text-xs font-bold hover:bg-blue-500 disabled:opacity-50 transition-colors border border-blue-400 hover:border-blue-500"
                  >
                    Quitar
                  </button>
                  <button 
                    onClick={() => setSelectedUserIds(new Set())}
                    className="p-1 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}

            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100 sticky top-0 bg-white z-10">
                    <th className="p-3 text-left w-10">
                      <input 
                        type="checkbox"
                        checked={filteredUsuarios.length > 0 && selectedUserIds.size === filteredUsuarios.length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="p-3 text-left">Usuario</th>
                    <th className="p-3 text-left">CI</th>
                    <th className="p-3 text-left">Roles</th>
                    <th className="p-3 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsuarios.map(u => (
                    <tr key={u.id} onClick={() => loadUsuarioRoles(u)}
                      className={`border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 ${
                        selectedUsuario?.id === u.id ? 'bg-blue-50' : ''
                      } ${selectedUserIds.has(u.id) ? 'bg-blue-50/50' : ''}`}>
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox"
                          checked={selectedUserIds.has(u.id)}
                          onChange={() => toggleSelectUser(u.id)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3">
                        <p className="font-medium text-slate-700">{u.primer_nombre} {u.apellido_paterno}</p>
                        <p className="text-[11px] text-slate-400">{u.username}</p>
                      </td>
                      <td className="p-3 text-slate-500 font-mono">{u.ci}</td>
                      <td className="p-3">
                        <div className="flex gap-1 flex-wrap">
                          {(u.roles || []).map(r => (
                            <span key={r} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">{r}</span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`inline-block w-2 h-2 rounded-full ${u.activo ? 'bg-emerald-500' : 'bg-red-400'}`} />
                      </td>
                    </tr>
                  ))}
                  {filteredUsuarios.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-400 italic">No se encontraron usuarios</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
            {selectedUsuario ? (
              <>
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-700">
                      {selectedUsuario.primer_nombre} {selectedUsuario.apellido_paterno}
                    </h2>
                    <p className="text-xs text-slate-400">{selectedUsuario.username}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleSaveUsuarioRoles}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
                      <Save size={15} /> Guardar Roles
                    </button>
                    <button onClick={() => handleResetPassword(selectedUsuario.id)}
                      className="px-3 py-2 bg-amber-50 text-amber-600 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors">
                      Reset Pass
                    </button>
                    <button onClick={() => handleToggleActivo(selectedUsuario.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                        selectedUsuario.activo ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      }`}>
                      {selectedUsuario.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {usuarioRoles.map(r => (
                    <label key={r.id}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                        r.asignado ? 'bg-blue-50 border border-blue-100' : 'bg-slate-50 border border-slate-100'
                      }`}>
                      <input type="checkbox" checked={r.asignado}
                        onChange={() => toggleUsuarioRole(r.id)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">{r.nombre}</p>
                        <p className="text-xs text-slate-400">{r.descripcion || ''}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-slate-400">
                <Users size={40} className="mx-auto mb-4 opacity-30" />
                <p className="text-sm">Selecciona un usuario para gestionar sus roles</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowRoleModal(false)}>
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Shield size={20} /></div>
                <h3 className="font-bold text-slate-800">{editRole ? 'Editar Rol' : 'Nuevo Rol'}</h3>
              </div>
              <button onClick={() => setShowRoleModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Nombre</label>
                <input type="text" value={roleForm.nombre} onChange={e => setRoleForm(f => ({...f, nombre: e.target.value}))}
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ej: SUPERVISOR" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Descripción</label>
                <textarea value={roleForm.descripcion} onChange={e => setRoleForm(f => ({...f, descripcion: e.target.value}))}
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                  placeholder="Descripción del rol..." />
              </div>
              <button onClick={handleSaveRole}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                <Save size={16} /> {editRole ? 'Guardar Cambios' : 'Crear Rol'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
