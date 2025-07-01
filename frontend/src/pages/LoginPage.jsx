import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/downloads';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(password);
    if (success) navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-mtv-blue-50">
      <div className="card w-full max-w-sm flex flex-col items-center">
        <img src="/Logo/Logo.png" alt="MTV Schwabstedt Darts" className="w-24 h-24 mb-4 rounded-2xl shadow-ios-lg" />
        <h1 className="text-2xl font-bold text-mtv-blue-800 mb-2">Mitglieder-Login</h1>
        <p className="text-gray-500 mb-6 text-center">Bitte Passwort eingeben, um Zugriff zu erhalten.</p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            type="password"
            className="input-field"
            placeholder="Passwort"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
            required
          />
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Einloggen...' : 'Einloggen'}
          </button>
          {error && <div className="text-red-600 text-sm text-center mt-2">{error}</div>}
        </form>
      </div>
      <div className="mt-8 text-xs text-gray-400">&copy; {new Date().getFullYear()} MTV Schwabstedt Darts</div>
    </div>
  );
} 