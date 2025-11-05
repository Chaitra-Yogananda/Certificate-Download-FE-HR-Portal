import api from './api';

export async function login(email, password) {
  const res = await api.post('/api/auth/login', { email, password });
  return res.data;
}
