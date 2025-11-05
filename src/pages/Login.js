import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../services/authService';
import { setAuth } from '../services/auth';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await login(email.trim(), password);
      setAuth({ token: data.token, role: data.role, email: data.email });
      toast.success('Logged in successfully');
      navigate('/courses', { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 relative z-10">
      <div className="w-full max-w-md mx-auto overflow-hidden bg-white/95 backdrop-blur rounded-xl shadow-2xl border relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg blur-xl"></div>
        <div className="relative p-6">
          <h1 className="text-2xl font-semibold text-center mb-2">Login</h1>
          <p className="text-sm text-center text-gray-600 mb-6">Enter your credentials to continue</p>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
                autoComplete="off"
                name="email"
                className="w-full rounded-md border-2 border-blue-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
                autoComplete="off"
                className="w-full rounded-md border-2 border-blue-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium py-2.5 hover:from-blue-700 hover:to-blue-800 disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4">
            Tip: use an email containing the word "super" to get the Super Admin role.
          </p>
        </div>
      </div>
    </div>
  );
}
