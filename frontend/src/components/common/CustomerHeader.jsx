import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const CustomerHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    isActive(path)
      ? 'text-primary border-b-2 border-primary pb-1 font-semibold'
      : 'text-on-background/60 hover:text-primary transition-colors font-semibold';

  return (
    <header className="w-full sticky top-0 z-50 bg-background/80 backdrop-blur-xl shadow-nav">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 md:px-8 h-20">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => handleNavigation('/')}
        >
          <img
            src="/images/logo.jpg"
            alt="Flour & Spice Mill"
            className="h-10 w-10 object-contain rounded-xl"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span className="text-xl font-headline font-black tracking-tight text-on-background">
            Flour &amp; Spice Mill
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-headline">
          <button onClick={() => handleNavigation('/')} className={navLinkClass('/')}>Home</button>
          <button onClick={() => handleNavigation('/order/products')} className={navLinkClass('/order/products')}>Products</button>
          {isAuthenticated() && (
            <button onClick={() => handleNavigation('/orders')} className={navLinkClass('/orders')}>My Orders</button>
          )}
          {isAdmin() && (
            <button onClick={() => handleNavigation('/admin/dashboard')} className={navLinkClass('/admin/dashboard')}>Dashboard</button>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated() ? (
            <>
              <button
                onClick={() => handleNavigation('/profile')}
                className="p-2 hover:bg-surface-container-low rounded-full transition-all active:scale-95"
                title="Profile"
              >
                <span className="material-symbols-outlined text-primary">account_circle</span>
              </button>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-surface-container-low rounded-full transition-all active:scale-95"
                title="Logout"
              >
                <span className="material-symbols-outlined text-primary">logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavigation('/login')}
                className="px-5 py-2 text-primary font-headline font-semibold hover:bg-primary-container/30 rounded-full transition-all"
              >
                Login
              </button>
              <button
                onClick={() => handleNavigation('/signup')}
                className="px-5 py-2 sage-gradient text-on-primary font-headline font-semibold rounded-full shadow-sage hover:shadow-sage-lg transition-all active:scale-95"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 hover:bg-surface-container-low rounded-full transition-all"
        >
          <span className="material-symbols-outlined text-on-background">
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-outline-variant/20 px-6 py-4">
          <nav className="flex flex-col gap-1">
            {[
              { label: 'Home', path: '/' },
              { label: 'Products', path: '/order/products' },
              ...(isAuthenticated() ? [{ label: 'My Orders', path: '/orders' }, { label: 'Profile', path: '/profile' }] : []),
              ...(isAdmin() ? [{ label: 'Dashboard', path: '/admin/dashboard' }] : []),
            ].map(({ label, path }) => (
              <button
                key={path}
                onClick={() => handleNavigation(path)}
                className={`text-left px-4 py-3 rounded-xl font-headline font-semibold transition-all ${
                  isActive(path) ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                {label}
              </button>
            ))}
            {isAuthenticated() ? (
              <button
                onClick={handleLogout}
                className="text-left px-4 py-3 rounded-xl font-headline font-semibold text-error hover:bg-error/5 transition-all mt-2"
              >
                Logout
              </button>
            ) : (
              <div className="flex gap-3 mt-3 pt-3 border-t border-outline-variant/20">
                <button onClick={() => handleNavigation('/login')} className="flex-1 py-3 text-primary font-headline font-semibold border-2 border-primary/20 rounded-full hover:bg-primary/5 transition-all">Login</button>
                <button onClick={() => handleNavigation('/signup')} className="flex-1 py-3 sage-gradient text-on-primary font-headline font-semibold rounded-full transition-all">Sign Up</button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default CustomerHeader;
