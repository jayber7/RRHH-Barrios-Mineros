import axios from 'axios';

const TOKEN_KEY = 'token';

const getToken = () => localStorage.getItem(TOKEN_KEY);

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const authFetch = async (url, options = {}) => {
  const token = getToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }
  return res;
};

export const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);
