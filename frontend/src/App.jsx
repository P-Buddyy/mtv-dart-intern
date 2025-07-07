import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DownloadsPage from './pages/DownloadsPage';
import GamesPage from './pages/GamesPage';
import MembersPage from './pages/MembersPage';
import CashPage from './pages/CashPage';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Sidebar from './components/Sidebar';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 md:ml-64 transition-all duration-300 ease-in-out">
                  <div className="pt-16 md:pt-0">
                    <Routes>
                      <Route path="downloads" element={<DownloadsPage />} />
                      <Route path="games" element={<GamesPage />} />
                      <Route path="members" element={<MembersPage />} />
                      <Route path="cash" element={<CashPage />} />
                      <Route path="*" element={<Navigate to="/downloads" />} />
                    </Routes>
                  </div>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
} 