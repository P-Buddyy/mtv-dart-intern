import React, { useState } from 'react';
import BackupManager from '../components/BackupManager';
import { Lock, Shield, Database, Settings } from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'qay236987410') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Falsches Passwort');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setError('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="card max-w-md w-full">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-red-100 rounded-xl">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin-Bereich</h1>
              <p className="text-gray-500">Geschützter Bereich für Administratoren</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Admin-Passwort
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-mtv-blue-500 focus:border-transparent"
                  placeholder="Passwort eingeben"
                  required
                />
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Shield className="w-5 h-5" />
              Admin-Bereich betreten
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Verfügbare Funktionen:</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• Daten-Backup erstellen</li>
                  <li>• Backup wiederherstellen</li>
                  <li>• System-Einstellungen</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-xl">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin-Bereich</h1>
            <p className="text-gray-500">Verwaltung und Wartung der MTV Darts Anwendung</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn-outline flex items-center gap-2"
        >
          <Lock className="w-4 h-4" />
          Verlassen
        </button>
      </div>

      <div className="grid gap-6">
        <BackupManager />
        
        <div className="card">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-2xl">⚙️</span>
            <div>
              <div className="font-semibold">System-Einstellungen</div>
              <div className="text-gray-500 text-sm">Weitere Admin-Funktionen (in Entwicklung)</div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600">Weitere Admin-Funktionen werden hier verfügbar sein</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 