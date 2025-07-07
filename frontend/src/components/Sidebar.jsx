import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Menu, X, Shield } from 'lucide-react';

const navItems = [
  { to: '/downloads', label: 'Downloads', icon: '📄' },
  { to: '/games', label: 'Spielplan', icon: '🎯' },
  { to: '/members', label: 'Mitglieder', icon: '👥' },
  { to: '/cash', label: 'Getränke & Kasse', icon: '🍻' },
];

const adminItems = [
  { to: '/admin', label: 'Admin', icon: <Shield className="w-5 h-5" /> },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-ios-lg"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? '' : 'closed'} md:block`}>
        <div className="flex flex-col items-center py-8 h-full">
          <img src="/Logo/Logo.png" alt="Logo" className="w-20 h-20 rounded-2xl mb-4 shadow-ios-lg" />
          <h2 className="text-xl font-bold text-mtv-blue-800 mb-8">MTV Darts</h2>
          <nav className="flex flex-col gap-2 w-full px-4 flex-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' active' : '')
                }
                onClick={closeSidebar}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
            
            {/* Admin Section Separator */}
            <div className="my-4 border-t border-gray-200"></div>
            
            {adminItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  'nav-link bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800' + (isActive ? ' active bg-red-100 text-red-800' : '')
                }
                onClick={closeSidebar}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button
            className="btn-outline w-full mt-auto"
            onClick={() => {
              logout();
              closeSidebar();
            }}
          >
            Abmelden
          </button>
        </div>
      </aside>
    </>
  );
} 