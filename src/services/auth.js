export const TOKEN_KEY = 'auth_token';
export const ROLE_KEY = 'auth_role';
export const USER_EMAIL_KEY = 'auth_email';

export function setAuth({ token, role, email }) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (role) localStorage.setItem(ROLE_KEY, role);
  if (email) localStorage.setItem(USER_EMAIL_KEY, email);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USER_EMAIL_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRole() {
  return localStorage.getItem(ROLE_KEY);
}

export function getEmail() {
  return localStorage.getItem(USER_EMAIL_KEY);
}

export function isAuthenticated() {
  return Boolean(getToken());
}
