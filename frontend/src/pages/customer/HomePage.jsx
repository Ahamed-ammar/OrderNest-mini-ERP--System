import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import CustomerHeader from '../../components/common/CustomerHeader';
import { getProducts } from '../../api/productApi';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderNow = () => {
    if (isAuthenticated()) {
      navigate('/order/products');
    } else {
      navigate('/login');
    }
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  const getProductImage = (product) => {
    // Use the product's imageUrl if available, otherwise fall back to static images
    if (product.imageUrl) {
      return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.imageUrl}`;
    }
    
    // Fallback to static images based on product name
    const productImages = {
      'Wheat': '/images/wheat.jpg',
      'Rice': '/images/rice.jpg',
      'Turmeric': '/images/turmeric-powder.jpg',
      'Chilli': '/images/chilli.jpg',
      'Coriander': '/images/Coriander.jpg',
      'Garam Masala': '/images/garam masala.jpg'
    };
    
    const matchedKey = Object.keys(productImages).find(key => 
      product.name.toLowerCase().includes(key.toLowerCase())
    );
    return matchedKey ? productImages[matchedKey] : '/placeholder-product.svg';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Customer Header */}
      <CustomerHeader />

      {/* Hero Section with Background */}
      <section className="relative overflow-hidden">
        {/* Background Pattern - Flour/Spice Texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
          {/* Organic flour/spice texture pattern using CSS */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(249, 115, 22, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 20%, rgba(234, 179, 8, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 60% 70%, rgba(217, 119, 6, 0.2) 0%, transparent 50%)
            `,
            backgroundSize: '400px 400px, 300px 300px, 500px 500px, 350px 350px',
            backgroundPosition: '0 0, 100px 100px, 200px 50px, 300px 200px'
          }}></div>
          
          {/* Subtle grain texture */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              rgba(251, 191, 36, 0.1) 2px,
              rgba(251, 191, 36, 0.1) 4px
            )`
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* <div className="mb-6">
              <span className="inline-block text-6xl sm:text-7xl mb-4 animate-bounce">🌾</span>
            </div> */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to Our Mill
            </h2>
            <p className="text-xl sm:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto font-medium">
              Fresh Ground Flour & Spices
            </p>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Experience the authentic taste of traditionally ground flour and spices. 
              From farm to your kitchen, we preserve the natural goodness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleOrderNow}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-5 px-10 rounded-xl text-lg shadow-2xl transform transition hover:scale-105 active:scale-95 min-w-[200px]"
              >
                🛒 Order Now
              </button>
              {isAuthenticated() && (
                <button
                  onClick={handleViewOrders}
                  className="bg-white hover:bg-gray-50 text-amber-700 font-bold py-5 px-10 rounded-xl text-lg shadow-xl transform transition hover:scale-105 active:scale-95 border-2 border-amber-200 min-w-[200px]"
                >
                  📦 My Orders
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Decorative wave at bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(249, 250, 251)"/>
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-xl p-8 sm:p-10 border border-amber-200">
          <div className="flex items-center justify-center mb-6">
            <div className="text-5xl mr-4">🏛️</div>
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900">About Our Mill</h3>
          </div>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p className="text-lg leading-relaxed">
              For over <span className="font-bold text-amber-700">10 years</span>, our family-owned flour and spice mill has been serving the community 
              with premium grinding services. We take pride in preserving the authentic taste and aroma of 
              your ingredients through our traditional stone grinding methods.
            </p>
            <p className="text-lg leading-relaxed">
              Whether you bring your own raw materials or purchase from our selection of premium grains and 
              spices, we ensure every batch is ground to perfection with your preferred coarseness level.
            </p>
            <p className="text-lg leading-relaxed">
              Our commitment to <span className="font-bold text-amber-700">quality, hygiene, and customer satisfaction</span> has made us the trusted choice 
              for households and businesses alike.
            </p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t-2 border-amber-200">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-amber-700 mb-2">10+</div>
              <div className="text-sm sm:text-base text-gray-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-amber-700 mb-2">10K+</div>
              <div className="text-sm sm:text-base text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-amber-700 mb-2">100%</div>
              <div className="text-sm sm:text-base text-gray-600">Quality Assured</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Overview Section */}
      <section id="products" className="max-w-7xl mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-amber-100">
          <div className="text-center mb-8">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Our Services</h3>
            <p className="text-gray-600 text-lg">Choose the service that fits your needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Service Only */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition"></div>
              <div className="relative bg-white border-2 border-amber-300 rounded-2xl p-8 hover:border-amber-500 transition shadow-lg hover:shadow-2xl transform hover:-translate-y-1">
                <div className="text-6xl mb-4 text-center">⚙️</div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3 text-center">Grinding Service Only</h4>
                <p className="text-gray-600 mb-6 text-center">
                  Bring your own raw materials and we'll grind them to perfection
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                    <span className="text-gray-700">Choose from Fine, Medium, or Coarse grind</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                    <span className="text-gray-700">Traditional stone grinding method</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                    <span className="text-gray-700">Ready in 2 business days</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                    <span className="text-gray-700">Affordable grinding charges</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Buy + Grinding */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition"></div>
              <div className="relative bg-white border-2 border-green-300 rounded-2xl p-8 hover:border-green-500 transition shadow-lg hover:shadow-2xl transform hover:-translate-y-1">
                <div className="text-6xl mb-4 text-center">🌾</div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3 text-center">Buy Raw Materials + Grinding</h4>
                <p className="text-gray-600 mb-6 text-center">
                  Purchase premium quality ingredients and get them ground
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                    <span className="text-gray-700">Premium quality raw materials</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                    <span className="text-gray-700">Sourced from trusted suppliers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                    <span className="text-gray-700">Includes grinding service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                    <span className="text-gray-700">Convenient one-stop solution</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Popular Products */}
          <div className="pt-8 border-t-2 border-amber-100">
            <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Products</h4>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No products available at the moment</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-amber-100 hover:border-amber-300 flex flex-col"
                  >
                    {/* Image Container */}
                    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      {/* Fallback gradient if image fails */}
                      <div className="hidden absolute inset-0 bg-gradient-to-br from-amber-200 to-orange-300 items-center justify-center">
                        <span className="text-6xl">🌾</span>
                      </div>
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      
                      {/* Product Name Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h5 className="text-2xl font-bold text-white drop-shadow-lg">{product.name}</h5>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 flex-grow flex flex-col">
                      {/* Pricing Information */}
                      <div className="space-y-3 mb-6 flex-grow">
                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-600">Raw Material</span>
                            <span className="text-lg font-bold text-amber-700">
                              ₹{product.rawMaterialPricePerKg}/kg
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Grinding Service</span>
                            <span className="text-lg font-bold text-green-700">
                              ₹{product.grindingChargePerKg}/kg
                            </span>
                          </div>
                        </div>
                        
                        {/* Service Options */}
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            <span>Service Only: ₹{product.grindingChargePerKg}/kg</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            <span>Buy + Grinding: ₹{(product.rawMaterialPricePerKg + product.grindingChargePerKg).toFixed(2)}/kg</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => navigate(`/product/${product._id}`)}
                          className="bg-white hover:bg-gray-50 text-amber-700 font-semibold py-3 px-4 rounded-lg text-sm shadow-md border-2 border-amber-200 hover:border-amber-300 transition flex items-center justify-center gap-2"
                        >
                          {/* <span>ℹ️</span> */}
                          <span>Details</span>
                        </button>
                        <button
                          onClick={handleOrderNow}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-lg text-sm shadow-md transform transition hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                        >
                          <span>🛒</span>
                          <span>Order</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-2xl shadow-2xl p-8 sm:p-10 text-white">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-6">
              <h3 className="text-3xl sm:text-4xl font-bold">🎉 Special Offers</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:bg-white/30 transition">
                <div className="text-4xl mb-3">🎁</div>
                <h4 className="text-2xl font-bold mb-3">First Order Discount</h4>
                <p className="text-green-50 text-lg mb-3">
                  Get 10% off on your first order!
                </p>
                <div className="inline-block bg-white/30 px-4 py-2 rounded-lg font-mono font-bold text-lg">
                  WELCOME10
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:bg-white/30 transition">
                <div className="text-4xl mb-3">📦</div>
                <h4 className="text-2xl font-bold mb-3">Bulk Order Benefits</h4>
                <p className="text-green-50 text-lg">
                  Order 10kg or more and enjoy special pricing on grinding charges!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-7xl mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-xl p-8 sm:p-10 border border-amber-200">
          <div className="text-center mb-8">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Get In Touch</h3>
            <p className="text-gray-600 text-lg">We're here to help with your grinding needs</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition border border-amber-100">
                <div className="text-4xl flex-shrink-0">📞</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2 text-lg">Phone</h4>
                  <a
                    href="tel:+919876543210"
                    className="text-amber-600 hover:text-amber-700 text-xl font-semibold block"
                  >
                    +91 98765 43210
                  </a>
                  <p className="text-sm text-gray-600 mt-2">Call us for inquiries and orders</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition border border-amber-100">
                <div className="text-4xl flex-shrink-0">🕐</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2 text-lg">Working Hours</h4>
                  <p className="text-gray-700 font-medium">Monday - Saturday</p>
                  <p className="text-amber-600 font-semibold">8:00 AM - 7:00 PM</p>
                  <p className="text-gray-500 text-sm mt-2">Sunday: Closed</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition border border-amber-100">
                <div className="text-4xl flex-shrink-0">📍</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2 text-lg">Address</h4>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Traditional Flour & Spice Mill<br />
                    Kerala, India
                  </p>
                  <a
                    href="https://maps.app.goo.gl/HytNPx4N8q6tYvpbA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium text-sm"
                  >
                    <span>View on Map</span>
                    <span>→</span>
                  </a>
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
              <h4 className="font-bold text-gray-900 mb-3 text-lg">Find Us</h4>
              <div className="rounded-xl overflow-hidden shadow-lg h-64 lg:h-full min-h-[300px] border-2 border-amber-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.9876543210123!2d76.12345678901234!3d9.876543210987654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwNTInMzUuNiJOIDc2wrAwNyczMi40IkU!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mill Location"
                ></iframe>
              </div>
              <div className="mt-4 text-center">
                <a
                  href="https://maps.app.goo.gl/HytNPx4N8q6tYvpbA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold text-lg"
                >
                  <span>📍</span>
                  <span>Open in Google Maps</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom CTA for Mobile - positioned above bottom nav */}
      <div className="lg:hidden fixed left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10" style={{ bottom: '64px' }}>
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
      <div className="md:hidden h-40"></div>
    </div>
  );
};

export default HomePage;
