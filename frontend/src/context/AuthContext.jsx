import { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({});

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await api.get('/api/configuracion');
      const cfg = {};
      res.data.forEach(item => {
        cfg[item.clave] = item.valor;
      });
      setConfig(cfg);
    } catch (e) { console.error('Error fetching config', e); }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/api/auth/me')
        .then(res => {
          setUsuario(res.data);
          fetchConfig();
        })
        .catch(() => {
          localStorage.removeItem('token');
          setUsuario(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const res = await api.post('/api/auth/login', { username, password });
    localStorage.setItem('token', res.data.token);
    setUsuario(res.data.usuario);
    await fetchConfig();
    return res.data.usuario;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
  };

  const cambiarPassword = async (password_actual, password_nuevo) => {
    const res = await api.put('/api/auth/cambiar-password',
      { password_actual, password_nuevo }
    );
    setUsuario(prev => ({ ...prev, password_cambiado: true }));
    return res.data;
  };

  const token = () => localStorage.getItem('token');

  const authAxios = () => api;

  const can = (permiso) => {
    const adminRole = config.seguridad_rol_admin || 'ADMIN';
    if (usuario?.roles?.includes(adminRole)) return true;
    return usuario?.permisos?.includes(permiso);
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, config, login, logout, cambiarPassword, token: token(), authAxios, can, refreshConfig: fetchConfig }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
