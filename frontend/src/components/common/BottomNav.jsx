import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../context/CartContext';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { getItemCount } = useCart();
  const cartCount = getItemCount();

  if (location.pathname.startsWith('/admin') || location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  const items = [
    { name: 'Home', path: '/', icon: 'home' },
    { name: 'Products', path: '/order/products', icon: 'restaurant_menu' },
    { name: 'Cart', path: '/order/review', icon: 'shopping_cart', badge: cartCount },
    { name: 'Orders', path: '/orders', icon: 'receipt_long' },
    { name: 'Profile', path: '/profile', icon: 'person' },
  ];

  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-5 pt-3 bg-background/90 backdrop-blur-lg border-t border-outline-variant/20 z-50 rounded-t-[2rem] shadow-nav">
      {items.map((item) => {
        const active = isActive(item.path);
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center px-4 py-2 rounded-full active:scale-90 transition-transform ${
              active ? 'bg-primary-container text-primary' : 'text-on-background/50'
            }`}
          >
            <div className="relative">
              <span className="material-symbols-outlined text-[22px]"
                style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {item.icon}
              </span>
              {item.badge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-error text-on-error text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium mt-0.5">{item.name}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
