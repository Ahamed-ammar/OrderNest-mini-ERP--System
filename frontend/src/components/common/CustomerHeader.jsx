import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const CustomerHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer gap-3"
            onClick={() => handleNavigation('/')}
          >
            <img 
              src="/images/logo.jpg" 
              alt="Flour & Spice Mill Logo" 
              className="h-12 w-12 object-contain rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'inline';
              }}
            />
            <span className="text-2xl hidden">🌾</span>
            <div>
              <h1 className="text-xl font-bold">Flour & Spice Mill</h1>
              <p className="text-amber-100 text-xs hidden sm:block">Traditional Grinding</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAdmin() && (
              <button
                onClick={() => handleNavigation('/admin/dashboard')}
                className={`transition font-medium flex items-center gap-1 ${
                  isActive('/admin/dashboard') 
                    ? 'text-amber-100 border-b-2 border-amber-100' 
                    : 'text-white hover:text-amber-100'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Dashboard
              </button>
            )}
            
            <button
              onClick={() => handleNavigation('/order/products')}
              className={`transition font-medium ${
                isActive('/order/products') 
                  ? 'text-amber-100 border-b-2 border-amber-100' 
                  : 'text-white hover:text-amber-100'
              }`}
            >
              Products
            </button>
            
            {isAuthenticated() && (
              <button
                onClick={() => handleNavigation('/orders')}
                className={`transition font-medium ${
                  isActive('/orders') 
                    ? 'text-amber-100 border-b-2 border-amber-100' 
                    : 'text-white hover:text-amber-100'
                }`}
              >
                My Orders
              </button>
            )}
            
            <button
              onClick={() => scrollToSection('contact')}
              className="text-white hover:text-amber-100 transition font-medium"
            >
              Contact
            </button>

            {isAuthenticated() ? (
              <>
                <button
                  onClick={() => handleNavigation('/profile')}
                  className={`transition font-medium ${
                    isActive('/profile') 
                      ? 'text-amber-100 border-b-2 border-amber-100' 
                      : 'text-white hover:text-amber-100'
                  }`}
                >
                  Profile
                </button>
                <div className="flex items-center gap-3 pl-3 border-l border-amber-500">
                  <span className="text-amber-100 text-sm">
                    {user?.name || user?.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-amber-800 hover:bg-amber-900 rounded-lg transition font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 pl-3 border-l border-amber-500">
                <button
                  onClick={() => handleNavigation('/login')}
                  className="px-4 py-2 text-amber-600 bg-white rounded-lg hover:bg-amber-50 transition font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation('/signup')}
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-900 rounded-lg transition font-medium"
                >
                  Sign Up
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-amber-800 transition"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-amber-500">
            <nav className="flex flex-col space-y-3">
              {isAdmin() && (
                <button
                  onClick={() => handleNavigation('/admin/dashboard')}
                  className={`text-left px-4 py-2 rounded-lg transition font-medium flex items-center gap-2 ${
                    isActive('/admin/dashboard') 
                      ? 'bg-amber-800 text-amber-100' 
                      : 'text-white hover:bg-amber-800'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Dashboard
                </button>
              )}
              
              <button
                onClick={() => handleNavigation('/order/products')}
                className={`text-left px-4 py-2 rounded-lg transition font-medium ${
                  isActive('/order/products') 
                    ? 'bg-amber-800 text-amber-100' 
                    : 'text-white hover:bg-amber-800'
                }`}
              >
                Products
              </button>
              
              {isAuthenticated() && (
                <button
                  onClick={() => handleNavigation('/orders')}
                  className={`text-left px-4 py-2 rounded-lg transition font-medium ${
                    isActive('/orders') 
                      ? 'bg-amber-800 text-amber-100' 
                      : 'text-white hover:bg-amber-800'
                  }`}
                >
                  My Orders
                </button>
              )}
              
              <button
                onClick={() => scrollToSection('contact')}
                className="text-left px-4 py-2 text-white hover:bg-amber-800 rounded-lg transition font-medium"
              >
                Contact
              </button>

              {isAuthenticated() ? (
                <>
                  <button
                    onClick={() => handleNavigation('/profile')}
                    className={`text-left px-4 py-2 rounded-lg transition font-medium ${
                      isActive('/profile') 
                        ? 'bg-amber-800 text-amber-100' 
                        : 'text-white hover:bg-amber-800'
                    }`}
                  >
                    Profile
                  </button>
                  <div className="px-4 py-2 border-t border-amber-500 mt-2 pt-4">
                    <p className="text-amber-100 text-sm mb-3">
                      Logged in as: {user?.name || user?.username}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 bg-amber-800 hover:bg-amber-900 rounded-lg transition font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="px-4 py-2 border-t border-amber-500 mt-2 pt-4 space-y-2">
                  <button
                    onClick={() => handleNavigation('/login')}
                    className="w-full px-4 py-2 text-amber-600 bg-white rounded-lg hover:bg-amber-50 transition font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNavigation('/signup')}
                    className="w-full px-4 py-2 bg-amber-800 hover:bg-amber-900 rounded-lg transition font-medium"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default CustomerHeader;
