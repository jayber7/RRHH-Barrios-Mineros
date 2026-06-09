import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({});

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get(`${API_BASE_URL}/api/configuracion`, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
      axios.get(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
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
    const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { username, password });
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
    const token = localStorage.getItem('token');
    const res = await axios.put(`${API_BASE_URL}/api/auth/cambiar-password`,
      { password_actual, password_nuevo },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUsuario(prev => ({ ...prev, password_cambiado: true }));
    return res.data;
  };

  const token = () => localStorage.getItem('token');

  const authAxios = () => {
    const instance = axios.create({ baseURL: API_BASE_URL });
    instance.interceptors.request.use(config => {
      config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
      return config;
    });
    instance.interceptors.response.use(
      res => res,
      err => {
        if (err.response?.status === 401) {
          logout();
          window.location.href = '/login';
        }
        return Promise.reject(err);
      }
    );
    return instance;
  };

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
