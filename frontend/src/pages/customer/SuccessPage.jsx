import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../../context/CartContext';

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;
  const { clearCart } = useCart();

  useEffect(() => {
    if (!order) {
      const t = setTimeout(() => { toast.error('No order information found'); navigate('/'); }, 100);
      return () => clearTimeout(t);
    }
  }, [order, navigate]);

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 sm:p-12">
      <main className="max-w-xl w-full flex flex-col items-center text-center">

        {/* Celebration Visual */}
        <div className="relative w-full mb-12 flex justify-center">
          <div className="absolute -top-12 -left-4 w-32 h-32 bg-secondary-container/40 rounded-full blur-3xl" />
          <div className="absolute top-8 -right-8 w-40 h-40 bg-primary-container/30 rounded-full blur-3xl" />
          <div className="relative bg-surface-container-lowest w-32 h-32 rounded-xl flex items-center justify-center shadow-card transform -rotate-3 border-2 border-primary-container">
            <div className="sage-gradient w-20 h-20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-on-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-4 mb-10">
          <h1 className="font-headline text-4xl sm:text-5xl font-extrabold tracking-tighter text-on-background">
            Order Placed Successfully
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-md mx-auto">
            Your order has been received and is being processed. We'll have it ready by the estimated date.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-10">
          <div className="bg-surface-container-low p-8 rounded-xl flex flex-col items-center justify-center space-y-2">
            <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest font-label">Order ID</span>
            <span className="font-headline font-bold text-primary text-lg">#{order._id?.slice(-8).toUpperCase()}</span>
          </div>
          <div className="bg-primary-container p-8 rounded-xl flex flex-col items-center justify-center space-y-2">
            <span className="text-on-primary-container text-xs font-bold uppercase tracking-widest font-label">Estimated Ready</span>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-on-primary-container text-xl">schedule</span>
              <span className="font-headline font-bold text-on-primary-container">
                {order.estimatedReadyDate ? formatDate(order.estimatedReadyDate) : '2 Business Days'}
              </span>
            </div>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="w-full bg-surface-container-lowest rounded-xl p-6 mb-10 shadow-card border border-outline-variant/10 text-left">
          <h3 className="font-headline font-bold text-on-surface mb-4">Order Summary</h3>
          <div className="space-y-3 mb-4">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between items-start text-sm">
                <div>
                  <p className="font-bold text-on-surface">{item.productName}</p>
                  <p className="text-on-surface-variant text-xs mt-0.5">{item.quantity} kg · {item.grindType}</p>
                </div>
                <p className="font-bold text-on-surface ml-4">₹{item.itemTotal?.toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-outline-variant/10 flex justify-between items-center">
            <span className="font-headline font-bold text-on-surface">Total Amount</span>
            <span className="font-headline font-extrabold text-2xl text-primary tracking-tight">₹{order.totalAmount?.toFixed(2)}</span>
          </div>
        </div>

        {/* Status badge */}
        <div className="mb-8">
          <span className="bg-[#fef3c7] text-[#92400e] px-4 py-1.5 text-xs font-bold rounded-full uppercase tracking-widest">
            Status: Pending
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button
            onClick={() => navigate('/orders')}
            className="sage-gradient text-on-primary px-10 py-5 rounded-full font-headline font-bold shadow-sage hover:shadow-sage-lg transition-all active:scale-95 flex items-center justify-center gap-3 group"
          >
            View My Orders
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
          <button
            onClick={() => { clearCart(); navigate('/order/products'); }}
            className="bg-secondary-container text-on-secondary-container px-10 py-5 rounded-full font-headline font-bold hover:bg-secondary-fixed transition-colors active:scale-95"
          >
            Place Another Order
          </button>
        </div>
      </main>

      <footer className="mt-20 text-on-surface-variant/40 text-xs font-medium tracking-widest uppercase">
        Flour &amp; Spice Mill © 2026 · Artisanal Grinding
      </footer>

      {/* Mobile live indicator */}
      <div className="md:hidden fixed bottom-8 left-6 right-6">
        <div className="bg-surface-container-lowest/80 backdrop-blur-xl p-4 rounded-full shadow-card border border-outline-variant/10 flex justify-center">
          <p className="text-xs font-bold text-on-surface-variant flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Order is being processed in real-time
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
