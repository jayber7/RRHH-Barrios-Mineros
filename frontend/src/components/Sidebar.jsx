import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { 
  Users, Calendar, Clock, Plane, FileBadge, 
  MessageSquare, RefreshCw, LayoutDashboard, Cpu,
  FileSpreadsheet, FileText, Inbox, Settings, LogOut, AlertTriangle,
  Bell, CheckCheck, User, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL, authFetch } from '../config/api';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, logout, config } = useAuth();
  const [notifCount, setNotifCount] = useState(0);
  const [notifList, setNotifList] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const esSoloEmpleado = usuario?.roles?.every(r => ['GENERAL', 'AUXILIAR'].includes(r));

  useEffect(() => {
    if (usuario) {
      fetchNotifCount();
      const interval = setInterval(fetchNotifCount, 30000);
      return () => clearInterval(interval);
    }
  }, [usuario]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifCount = async () => {
    try {
      const res = await authFetch(`${API_BASE_URL}/api/notificaciones/no-leidas`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifCount(data.total);
      }
    } catch (e) { /* ignore */ }
  };

  const toggleDropdown = async () => {
    if (!showDropdown) {
      try {
        const res = await authFetch(`${API_BASE_URL}/api/notificaciones?solo_no_leidas=true&limit=5`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) setNotifList(await res.json());
      } catch (e) { /* ignore */ }
    }
    setShowDropdown(!showDropdown);
  };

  const marcarLeida = async (id) => {
    try {
      await authFetch(`${API_BASE_URL}/api/notificaciones/${id}/leer`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      fetchNotifCount();
      setNotifList(prev => prev.filter(n => n.id !== id));
    } catch (e) { /* ignore */ }
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/', permission: 'dashboard.ver' },
    { name: 'Mi Perfil', icon: <User size={20} />, path: '/self-service' },
    { name: 'Gestión de Personal', icon: <Users size={20} />, path: '/personal', permission: 'personal.ver' },
    { name: 'Asistencias', icon: <Clock size={20} />, path: '/asistencias', permission: 'asistencia.ver' },
    { name: 'Biométrico', icon: <Cpu size={20} />, path: '/biometrico', permission: 'biometrico.ver' },
    { name: 'Turnos', icon: <Calendar size={20} />, path: '/turnos', permission: 'turnos.ver' },
    { name: 'Vacaciones', icon: <Plane size={20} />, path: '/vacaciones', permission: 'vacaciones.ver' },
    { name: 'Permisos', icon: <FileBadge size={20} />, path: '/permisos', permission: 'permisos.ver' },
    { name: 'Certificaciones', icon: <FileBadge size={20} />, path: '/certificaciones', permission: 'certificados.ver' },
    { name: 'Notificaciones', icon: <Bell size={20} />, path: '/notificaciones', badge: notifCount },
    { name: 'Comunicados/Memo', icon: <MessageSquare size={20} />, path: '/comunicados', permission: 'comunicados.ver' },
    { name: 'Reemplazos', icon: <RefreshCw size={20} />, path: '/reemplazos', permission: 'personal.ver' },
  ];

  const correspondenciaItems = [
    { name: 'Correspondencia', icon: <FileText size={20} />, path: '/correspondencia', permission: 'correspondencia.ver' },
    { name: 'Bandeja Entrada', icon: <Inbox size={20} />, path: '/correspondencia/bandeja', permission: 'correspondencia.ver' },
  ];

  const adminItems = [
    { name: 'Configuración', icon: <Settings size={20} />, path: '/admin/config', permission: 'config.ver' },
    { name: 'Roles y Permisos', icon: <Shield size={20} />, path: '/admin/roles', permission: 'roles.ver' },
    { name: 'Sanciones', icon: <AlertTriangle size={20} />, path: '/admin/sanciones', permission: 'sanciones.ver' },
  ];

  const hasPermission = (item) => {
    if (!item.permission) return true;
    const adminRole = config?.seguridad_rol_admin || 'ADMIN';
    if (usuario?.roles?.includes(adminRole)) return true;
    return usuario?.permisos?.includes(item.permission);
  };

  const isActive = (path) => location.pathname === path;
  const linkClass = (path) => 
    `flex items-center gap-3 p-3 rounded-lg mb-1 transition-colors ${
      isActive(path) ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
    }`;

  return (
    <div className="w-64 bg-slate-800 text-white min-h-screen p-4 flex flex-col">
      <div className="text-xl font-bold mb-8 px-2 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-md overflow-hidden flex-shrink-0">
          {config?.institucion_logo_url ? (
            <img src={config.institucion_logo_url} alt="Logo" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-blue-500"></div>
          )}
        </div>
        <span className="truncate">{config?.institucion_nombre || 'Hospital BM'}</span>
      </div>

      <div className="mb-4 px-3 py-2 bg-slate-700/50 rounded-lg flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{usuario?.nombre_completo || usuario?.username}</p>
          <p className="text-xs text-slate-400 truncate">{usuario?.cargo || usuario?.roles?.join(', ')}</p>
        </div>
        <div className="relative shrink-0 ml-2" ref={dropdownRef}>
          <button onClick={toggleDropdown} className="relative p-2 hover:bg-slate-600 rounded-lg transition-colors">
            <Bell size={18} className="text-slate-300" />
            {notifCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {notifCount > 9 ? '9+' : notifCount}
              </span>
            )}
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 text-slate-700">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <span className="font-bold text-sm">Notificaciones</span>
                <button onClick={() => { setShowDropdown(false); navigate('/notificaciones'); }}
                  className="text-xs text-blue-600 font-medium hover:underline">
                  Ver todas
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifList.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-sm">No hay notificaciones nuevas</div>
                ) : notifList.map(n => (
                  <div key={n.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-700">{n.titulo}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.mensaje}</p>
                    </div>
                    <button onClick={() => marcarLeida(n.id)}
                      className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 shrink-0">
                      <CheckCheck size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-500 uppercase px-3 mb-2 tracking-wider">General</p>
        {menuItems.filter(hasPermission).map((item) => (
          <Link key={item.path} to={item.path} className={linkClass(item.path)}>
            {item.icon}
            <span className="flex-1">{item.name}</span>
            {item.badge > 0 && (
              <span className="w-5 h-5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {item.badge > 9 ? '9+' : item.badge}
              </span>
            )}
          </Link>
        ))}

        {!esSoloEmpleado && (
          <>
            <Link to="/reportes" className={linkClass('/reportes')}>
              <FileSpreadsheet size={20} />
              <span>Reportes</span>
            </Link>

            <p className="text-xs font-semibold text-slate-500 uppercase px-3 mt-4 mb-2 tracking-wider">Correspondencia</p>
            {correspondenciaItems.filter(hasPermission).map((item) => (
              <Link key={item.path} to={item.path} className={linkClass(item.path)}>
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}

            {(usuario?.roles?.includes(config?.seguridad_rol_admin || 'ADMIN') || adminItems.some(hasPermission)) && (
              <>
                <p className="text-xs font-semibold text-slate-500 uppercase px-3 mt-4 mb-2 tracking-wider">Administración</p>
                {adminItems.filter(hasPermission).map((item) => (
                  <Link key={item.path} to={item.path} className={linkClass(item.path)}>
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </>
            )}
          </>
        )}
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-700">
        <button onClick={logout} className="flex items-center gap-3 p-3 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white w-full transition-colors">
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
