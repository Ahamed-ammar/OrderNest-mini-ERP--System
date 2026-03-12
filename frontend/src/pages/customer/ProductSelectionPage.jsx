import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { getProducts } from '../../api/productApi';
import { toast } from 'react-toastify';
import CustomerHeader from '../../components/common/CustomerHeader';

const ProductSelectionPage = () => {
  const navigate = useNavigate();
  const { items, totalAmount, addToCart, removeFromCart, getItemCount } = useCart();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productSelections, setProductSelections] = useState({});
  const [showCartModal, setShowCartModal] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProducts();
      // getProducts now returns the products array directly
      setProducts(response || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please check your connection and try again.');
      toast.error('Failed to load products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (productId, value) => {
    const quantity = parseFloat(value) || 0;
    setProductSelections(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: quantity
      }
    }));
  };

  // Handle grind type selection
  const handleGrindTypeChange = (productId, grindType) => {
    setProductSelections(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        grindType: grindType
      }
    }));
  };

  // Handle order type selection per product
  const handleOrderTypeChange = (productId, orderType) => {
    setProductSelections(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        orderType: orderType
      }
    }));
  };

  // Calculate price per kg based on order type for a specific product
  const getPricePerKg = (product, productOrderType) => {
    if (productOrderType === 'serviceOnly') {
      return product.grindingChargePerKg;
    } else if (productOrderType === 'buyAndService') {
      return product.rawMaterialPricePerKg + product.grindingChargePerKg;
    }
    return 0;
  };

  // Add product to cart
  const handleAddToCart = (product) => {
    const selection = productSelections[product._id];
    
    // Validation
    if (!selection || !selection.quantity || selection.quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    
    if (!selection.grindType) {
      toast.error('Please select a grind level');
      return;
    }

    if (!selection.orderType) {
      toast.error('Please select an order type (Service Only or Buy + Grinding)');
      return;
    }

    try {
      addToCart(product, selection.quantity, selection.grindType, selection.orderType);
      toast.success(`${product.name} added to cart`);
      
      // Reset selection for this product
      setProductSelections(prev => ({
        ...prev,
        [product._id]: {
          quantity: 0,
          grindType: '',
          orderType: ''
        }
      }));
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  // Remove item from cart
  const handleRemoveFromCart = (productId, grindType, orderType) => {
    try {
      removeFromCart(productId, grindType, orderType);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item');
    }
  };

  // Continue to address page
  const handleContinue = () => {
    if (items.length === 0) {
      toast.error('Please add at least one item to your cart');
      return;
    }
    navigate('/order/address');
  };

  if (loading) {
    return (
      <>
        <CustomerHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </>
    );
  }

  // Error state with retry button
  if (error) {
    return (
      <>
        <CustomerHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Products</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchProducts}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/order/type')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
      </>
    );
  }

  // Get product image with fallback
  const getProductImage = (product) => {
    // Use the product's imageUrl if available
    if (product.imageUrl) {
      return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.imageUrl}`;
    }
    
    // Fallback to static images based on product name
    const productImages = {
      'Wheat': '/images/wheat.jpg',
      'Rice': '/images/rice.jpg',
      'Turmeric': '/images/turmeric-powder.jpg',
      'Chili': '/images/chilli.jpg',
      'Chilli': '/images/chilli.jpg',
      'Coriander': '/images/Coriander.jpg',
      'Garam Masala': '/images/garam masala.jpg',
    };
    
    return productImages[product.name] || '/placeholder-product.svg';
  };

  return (
    <>
      <CustomerHeader />
      <div className="min-h-screen bg-gray-50 pb-8">
        {/* Background Pattern - Same as HomePage */}
        <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 -z-10">
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

        {/* Header */}
        <div className="bg-white shadow-sm sticky top-16 z-20">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Select Products</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Choose products and customize your order
                </p>
              </div>
            </div>
            {/* Progress Indicator */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-amber-600 rounded"></div>
              <div className="flex-1 h-2 bg-gray-300 rounded"></div>
              <div className="flex-1 h-2 bg-gray-300 rounded"></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Step 1 of 3: Select Products</p>
          </div>
        </div>

        {/* Browse Products Header - Show if no items in cart */}
        {items.length === 0 && (
          <div className="relative overflow-hidden py-16 z-0">
            {/* Background Pattern - Same as HomePage */}
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
            <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Browse Our Products</h1>
              <p className="text-gray-700 text-lg mb-6">
                Explore our range of premium flour and spices. Select order type, quantity, and grind level for each product.
              </p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const selection = productSelections[product._id] || { quantity: 0, grindType: '', orderType: '' };

                return (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    {/* Fallback gradient */}
                    <div className="hidden absolute inset-0 bg-gradient-to-br from-amber-200 to-orange-300 items-center justify-center">
                      <span className="text-6xl">🌾</span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    {/* Product Info */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                      
                      {/* Always show both prices */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Raw Material:</span>
                          <span className="font-semibold text-gray-900">₹{product.rawMaterialPricePerKg.toFixed(2)}/kg</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Grinding Service:</span>
                          <span className="font-semibold text-gray-900">₹{product.grindingChargePerKg.toFixed(2)}/kg</span>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Total (Buy + Grind):</span>
                            <span className="text-lg font-bold text-amber-600">₹{(product.rawMaterialPricePerKg + product.grindingChargePerKg).toFixed(2)}/kg</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Type Selection */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Order Type
                      </label>
                      <div className="space-y-2">
                        <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition hover:bg-amber-50 ${
                          selection.orderType === 'serviceOnly' ? 'border-green-500 bg-green-50' : 'border-gray-300'
                        }`}>
                          <input
                            type="radio"
                            name={`orderType-${product._id}`}
                            value="serviceOnly"
                            checked={selection.orderType === 'serviceOnly'}
                            onChange={() => handleOrderTypeChange(product._id, 'serviceOnly')}
                            className="w-5 h-5 text-green-600 focus:ring-green-500"
                          />
                          <div className="ml-3 flex-1">
                            <div className="font-medium text-gray-900">Service Only</div>
                            <div className="text-sm text-gray-600">₹{product.grindingChargePerKg}/kg - Bring your own materials</div>
                          </div>
                        </label>
                        
                        <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition hover:bg-amber-50 ${
                          selection.orderType === 'buyAndService' ? 'border-green-500 bg-green-50' : 'border-gray-300'
                        }`}>
                          <input
                            type="radio"
                            name={`orderType-${product._id}`}
                            value="buyAndService"
                            checked={selection.orderType === 'buyAndService'}
                            onChange={() => handleOrderTypeChange(product._id, 'buyAndService')}
                            className="w-5 h-5 text-green-600 focus:ring-green-500"
                          />
                          <div className="ml-3 flex-1">
                            <div className="font-medium text-gray-900">Buy + Grinding</div>
                            <div className="text-sm text-gray-600">₹{(product.rawMaterialPricePerKg + product.grindingChargePerKg).toFixed(2)}/kg - We provide materials</div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Quantity Input */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity (kg)
                      </label>
                      <input
                        type="number"
                        inputMode="decimal"
                        step="0.1"
                        min="0"
                        value={selection.quantity || ''}
                        onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                        placeholder="0.0"
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        style={{ fontSize: '16px' }}
                      />
                    </div>

                    {/* Grind Level Selector */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grind Level
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Fine', 'Medium', 'Coarse'].map((level) => (
                          <button
                            key={level}
                            onClick={() => handleGrindTypeChange(product._id, level)}
                            className={`py-3 px-3 text-sm font-medium rounded-lg border-2 transition-colors min-h-[44px] ${
                              selection.grindType === level
                                ? 'bg-green-600 text-white border-green-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mt-auto min-h-[44px]"
                    >
                      Add to Cart
                    </button>
                    
                    {/* Details Link */}
                    <button
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="w-full mt-2 text-amber-600 hover:text-amber-700 font-medium py-2 text-sm"
                    >
                      View Product Details →
                    </button>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Cart Button - Bottom Right - Hidden on mobile */}
      {items.length > 0 && (
        <button
          onClick={() => setShowCartModal(true)}
          className="hidden md:flex fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-2xl z-50 transition-transform hover:scale-110 active:scale-95"
        >
          <div className="relative">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {/* Item Count Badge */}
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {getItemCount()}
            </span>
          </div>
        </button>
      )}

      {/* Cart Modal */}
      {showCartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center">
          <div className="bg-white w-full md:max-w-2xl md:rounded-2xl rounded-t-2xl max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
              <button
                onClick={() => setShowCartModal(false)}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-lg">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div
                      key={`${item.productId}-${item.grindType}-${item.orderType}-${index}`}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{item.productName}</h3>
                        <div className="text-sm text-gray-600 mt-1 space-y-1">
                          <p>Quantity: {item.quantity}kg</p>
                          <p>Grind Level: {item.grindType}</p>
                          <p>Order Type: {item.orderType === 'serviceOnly' ? 'Service Only' : 'Buy + Grinding'}</p>
                        </div>
                        <p className="text-lg font-bold text-green-600 mt-2">₹{item.itemTotal.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item.productId, item.grindType, item.orderType)}
                        className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                        aria-label="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">{getItemCount()} item{getItemCount() !== 1 ? 's' : ''} in cart</p>
                    <p className="text-2xl font-bold text-gray-900">Total: ₹{totalAmount.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={handleContinue}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition transform hover:scale-105"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductSelectionPage;
