import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleOrderNow = () => {
    if (isAuthenticated()) {
      navigate('/order/type');
    } else {
      navigate('/login');
    }
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">🌾 Flour & Spice Mill</h1>
              <p className="text-amber-100 text-sm mt-1">Traditional Grinding, Modern Service</p>
            </div>
            <div className="flex items-center gap-3">
              {isAuthenticated() ? (
                <>
                  <span className="text-amber-100 text-sm hidden sm:inline">
                    Hello, {user?.name || user?.username}!
                  </span>
                  <button
                    onClick={handleViewOrders}
                    className="text-white hover:text-amber-100 text-sm sm:text-base"
                  >
                    My Orders
                  </button>
                  <button
                    onClick={logout}
                    className="text-white hover:text-amber-100 text-sm sm:text-base"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-amber-600 bg-white rounded-lg hover:bg-amber-50 transition-colors text-sm sm:text-base font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="px-4 py-2 text-white bg-amber-800 rounded-lg hover:bg-amber-900 transition-colors text-sm sm:text-base font-medium"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Welcome, {user?.name || 'Customer'}!
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience the finest grinding services for your flour and spices. 
              We combine traditional methods with modern convenience.
            </p>
            <button
              onClick={handleOrderNow}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transform transition hover:scale-105 active:scale-95"
            >
              🛒 Order Now
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">About Our Mill</h3>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-4">
              For over three decades, our family-owned flour and spice mill has been serving the community 
              with premium grinding services. We take pride in preserving the authentic taste and aroma of 
              your ingredients through our traditional stone grinding methods.
            </p>
            <p className="mb-4">
              Whether you bring your own raw materials or purchase from our selection of premium grains and 
              spices, we ensure every batch is ground to perfection with your preferred coarseness level.
            </p>
            <p>
              Our commitment to quality, hygiene, and customer satisfaction has made us the trusted choice 
              for households and businesses alike.
            </p>
          </div>
        </div>
      </section>

      {/* Products Overview Section */}
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Our Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Only */}
            <div className="border-2 border-amber-200 rounded-lg p-6 hover:border-amber-400 transition">
              <div className="text-4xl mb-3">⚙️</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Grinding Service Only</h4>
              <p className="text-gray-600 mb-4">
                Bring your own raw materials and we'll grind them to your preferred consistency. 
                Perfect for those who source their own premium ingredients.
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ Choose from Fine, Medium, or Coarse grind</li>
                <li>✓ Traditional stone grinding method</li>
                <li>✓ Ready in 2 business days</li>
                <li>✓ Affordable grinding charges</li>
              </ul>
            </div>

            {/* Buy + Grinding */}
            <div className="border-2 border-amber-200 rounded-lg p-6 hover:border-amber-400 transition">
              <div className="text-4xl mb-3">🌾</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Buy Raw Materials + Grinding</h4>
              <p className="text-gray-600 mb-4">
                Purchase premium quality grains and spices from us and get them ground to perfection. 
                A complete solution for your needs.
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ Premium quality raw materials</li>
                <li>✓ Sourced from trusted suppliers</li>
                <li>✓ Includes grinding service</li>
                <li>✓ Convenient one-stop solution</li>
              </ul>
            </div>
          </div>

          {/* Popular Products */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h4 className="text-xl font-bold text-gray-900 mb-4">Popular Products We Grind</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[
                { name: 'Wheat', icon: '🌾' },
                { name: 'Rice', icon: '🍚' },
                { name: 'Turmeric', icon: '🟡' },
                { name: 'Chili', icon: '🌶️' },
                { name: 'Coriander', icon: '🌿' },
                { name: 'Cumin', icon: '🟤' },
                { name: 'Black Pepper', icon: '⚫' },
                { name: 'Gram', icon: '🟠' }
              ].map((product) => (
                <div
                  key={product.name}
                  className="bg-amber-50 rounded-lg p-4 text-center hover:bg-amber-100 transition"
                >
                  <div className="text-3xl mb-2">{product.icon}</div>
                  <p className="text-sm font-medium text-gray-800">{product.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md p-6 sm:p-8 text-white">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">🎉 Special Offers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <h4 className="text-xl font-bold mb-2">First Order Discount</h4>
              <p className="text-green-50">
                Get 10% off on your first order! Use code: WELCOME10
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <h4 className="text-xl font-bold mb-2">Bulk Order Benefits</h4>
              <p className="text-green-50">
                Order 10kg or more and enjoy special pricing on grinding charges!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Contact Us</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📞</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Phone</h4>
                    <a
                      href="tel:+919876543210"
                      className="text-amber-600 hover:text-amber-700 text-lg"
                    >
                      +91 98765 43210
                    </a>
                    <p className="text-sm text-gray-600 mt-1">Call us for inquiries and orders</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-2xl">🕐</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Working Hours</h4>
                    <p className="text-gray-700">Monday - Saturday: 8:00 AM - 7:00 PM</p>
                    <p className="text-gray-700">Sunday: Closed</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-2xl">📍</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Address</h4>
                    <p className="text-gray-700">
                      123 Mill Street, Center<br />
                      Your City, State - 123456
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button for Mobile */}
              <div className="mt-8 lg:hidden">
                <button
                  onClick={handleOrderNow}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-6 rounded-lg text-lg shadow-lg"
                >
                  🛒 Place Your Order
                </button>
              </div>
            </div>

            {/* Google Maps */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3">Find Us</h4>
              <div className="rounded-lg overflow-hidden shadow-md h-64 lg:h-full min-h-[300px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1841374555634!2d-73.98823492346618!3d40.75797097138558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mill Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom CTA for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10">
        <button
          onClick={handleOrderNow}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-6 rounded-lg text-lg shadow-lg transform active:scale-95 transition"
        >
          🛒 Order Now
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300">
            © 2026 Flour & Spice Mill. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Quality grinding services since 1990
          </p>
        </div>
      </footer>

      {/* Add padding at bottom for mobile sticky button and bottom nav */}
      <div className="md:hidden h-32"></div>
    </div>
  );
};

export default HomePage;
