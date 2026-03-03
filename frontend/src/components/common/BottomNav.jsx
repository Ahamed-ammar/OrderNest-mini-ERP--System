import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Don't show bottom nav if not authenticated or on admin pages
  if (!isAuthenticated() || location.pathname.startsWith('/admin')) {
    return null;
  }

  // Don't show on login/signup pages
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: (active) => (
        <svg className={`w-6 h-6 ${active ? 'text-amber-600' : 'text-gray-500'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'Orders',
      path: '/orders',
      icon: (active) => (
        <svg className={`w-6 h-6 ${active ? 'text-amber-600' : 'text-gray-500'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: (active) => (
        <svg className={`w-6 h-6 ${active ? 'text-amber-600' : 'text-gray-500'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center flex-1 h-full min-w-[44px] min-h-[44px] px-2"
              aria-label={item.name}
            >
              {item.icon(active)}
              <span className={`text-xs mt-1 ${active ? 'text-amber-600 font-medium' : 'text-gray-500'}`}>
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
