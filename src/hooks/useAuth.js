import { useMemo, useCallback } from 'react';
import { getRole, getEmail, isAuthenticated as checkAuth, clearAuth } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function useAuth() {
  const navigate = useNavigate();

  const isAuthenticated = useMemo(() => checkAuth(), []);
  const role = useMemo(() => getRole() || '', []);
  const email = useMemo(() => getEmail() || '', []);

  const logout = useCallback(() => {
    clearAuth();
    navigate('/login', { replace: true });
  }, [navigate]);

  return { isAuthenticated, role, email, logout };
}
