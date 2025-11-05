import axios from 'axios';
import { getToken, clearAuth } from './auth';

const api = axios.create({ baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:49975' });

api.interceptors.request.use((config) => {
  const url = (config?.url || '').toLowerCase();
  const isAuthEndpoint = url.includes('/api/auth/login') || url.includes('/api/auth/register');
  if (!isAuthEndpoint) {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuth();
      try {
        if (typeof window !== 'undefined') {
          // Redirect to login so user can re-authenticate
          window.location.assign('/login');
        }
      } catch {}
    }
    return Promise.reject(error);
  }
);

export default api;
