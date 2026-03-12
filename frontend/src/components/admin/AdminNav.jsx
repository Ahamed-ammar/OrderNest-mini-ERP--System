import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Only show on admin pages
  if (!location.pathname.startsWith('/admin') || location.pathname === '/admin/login') {
    return null;
  }

  // Professional SVG icons for navigation
  const getIcon = (iconName) => {
    const icons = {
      dashboard: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v4M16 5v4" />
        </svg>
      ),
      orders: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      products: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      staff: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      reports: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      logout: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      )
    };
    return icons[iconName];
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
    { name: 'Orders', path: '/admin/orders', icon: 'orders' },
    { name: 'Products', path: '/admin/products', icon: 'products' },
    { name: 'Staff', path: '/admin/staff', icon: 'staff' },
    { name: 'Reports', path: '/admin/reports', icon: 'reports' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-amber-600">Admin Panel</h1>
              <div className="flex space-x-4">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                      isActive(item.path)
                        ? 'bg-amber-100 text-amber-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2">{getIcon(item.icon)}</span>
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors flex items-center"
            >
              <span className="mr-2">{getIcon('logout')}</span>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-lg font-bold text-amber-600">Admin Panel</h1>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 min-w-[44px] min-h-[44px]"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-3 rounded-md text-base font-medium transition-colors min-h-[44px] flex items-center ${
                    isActive(item.path)
                      ? 'bg-amber-100 text-amber-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{getIcon(item.icon)}</span>
                  {item.name}
                </button>
              ))}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors min-h-[44px] flex items-center"
              >
                <span className="mr-3">{getIcon('logout')}</span>
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default AdminNav;
