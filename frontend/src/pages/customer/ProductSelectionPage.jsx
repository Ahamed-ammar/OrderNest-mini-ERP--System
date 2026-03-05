import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { getProducts } from '../../api/productApi';
import { toast } from 'react-toastify';
import CustomerHeader from '../../components/common/CustomerHeader';

const ProductSelectionPage = () => {
  const navigate = useNavigate();
  const { orderType, items, totalAmount, addToCart, removeFromCart, getItemCount } = useCart();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productSelections, setProductSelections] = useState({});

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

  // Redirect to order type if no order type selected and trying to add to cart
  const ensureOrderType = () => {
    if (!orderType) {
      toast.info('Please select an order type first');
      navigate('/order/type');
      return false;
    }
    return true;
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

  // Calculate price per kg based on order type
  const getPricePerKg = (product) => {
    if (orderType === 'serviceOnly') {
      return product.grindingChargePerKg;
    } else if (orderType === 'buyAndService') {
      return product.rawMaterialPricePerKg + product.grindingChargePerKg;
    }
    return 0;
  };

  // Add product to cart
  const handleAddToCart = (product) => {
    // Check if order type is selected
    if (!ensureOrderType()) {
      return;
    }

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

    try {
      addToCart(product, selection.quantity, selection.grindType);
      toast.success(`${product.name} added to cart`);
      
      // Reset selection for this product
      setProductSelections(prev => ({
        ...prev,
        [product._id]: {
          quantity: 0,
          grindType: ''
        }
      }));
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  // Remove item from cart
  const handleRemoveFromCart = (productId, grindType) => {
    try {
      removeFromCart(productId, grindType);
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

  // Product images mapping
  const productImages = {
    'Wheat': '/images/wheat.jpg',
    'Rice': '/images/rice.jpg',
    'Turmeric': '/images/turmeric-powder.jpg',
    'Chili': '/images/chilli.jpg',
    'Chilli': '/images/chilli.jpg',
    'Coriander': '/images/Coriander.jpg',
    'Garam Masala': '/images/garam masala.jpg',
  };

  return (
    <>
      <CustomerHeader />
      <div className="min-h-screen bg-gray-50 pb-32 md:pb-8">
        {/* Header - Only show if orderType is selected */}
        {orderType && (
          <div className="bg-white shadow-sm sticky top-16 z-10">
            <div className="max-w-6xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">Select Products</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    {orderType === 'serviceOnly' ? 'Service Only' : 'Buy + Grinding'} - 
                    Prices shown per kg
                  </p>
                </div>
                <button
                  onClick={() => navigate('/order/type')}
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  Change Type
                </button>
              </div>
              {/* Progress Indicator */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-amber-600 rounded"></div>
                <div className="flex-1 h-2 bg-amber-600 rounded"></div>
                <div className="flex-1 h-2 bg-gray-300 rounded"></div>
                <div className="flex-1 h-2 bg-gray-300 rounded"></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Step 2 of 4: Select Products</p>
            </div>
          </div>
        )}

        {/* Browse Products Header - Show if no orderType */}
        {!orderType && (
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white py-12">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Browse Our Products</h1>
              <p className="text-amber-100 text-lg mb-6">
                Explore our range of premium flour and spices
              </p>
              <button
                onClick={() => navigate('/order/type')}
                className="bg-white text-amber-700 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition"
              >
                Start Your Order
              </button>
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
                const selection = productSelections[product._id] || { quantity: 0, grindType: '' };
                const pricePerKg = getPricePerKg(product);

                return (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
                    {productImages[product.name] ? (
                      <img
                        src={productImages[product.name]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    {/* Fallback gradient */}
                    <div className={`${productImages[product.name] ? 'hidden' : 'flex'} absolute inset-0 bg-gradient-to-br from-amber-200 to-orange-300 items-center justify-center`}>
                      <span className="text-6xl">🌾</span>
                    </div>
                    {/* Price Badge */}
                    <div className="absolute top-3 right-3 bg-amber-600 text-white px-3 py-1 rounded-full shadow-lg">
                      <span className="text-lg font-bold">₹{pricePerKg.toFixed(2)}/kg</span>
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

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <button
                        onClick={() => navigate(`/product/${product._id}`)}
                        className="bg-white hover:bg-gray-50 text-amber-700 font-semibold py-3 px-4 rounded-lg text-sm shadow-md border-2 border-amber-200 hover:border-amber-300 transition flex items-center justify-center gap-2 min-h-[44px]"
                      >
                        {/* <span>ℹ️</span> */}
                        <span>Details</span>
                      </button>
                      <button
                        onClick={() => navigate('/order/type')}
                        className="bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 min-h-[44px] flex items-center justify-center gap-2"
                      >
                        <span>🛒</span>
                        <span>Order</span>
                      </button>
                    </div>

                    {/* Divider */}
                    {orderType && (
                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">or customize your order</span>
                        </div>
                      </div>
                    )}

                    {/* Quantity Input - Only show if orderType is selected */}
                    {orderType && (
                      <>
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
                      </>
                    )}
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Cart Summary - Outside main container */}
      {orderType && items.length > 0 && (
        <div className="fixed bottom-0 md:bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20 pb-16 md:pb-0">
          <div className="max-w-6xl mx-auto px-4 py-4">
            {/* Cart Items List */}
            <div className="mb-3 max-h-32 overflow-y-auto">
              {items.map((item, index) => (
                <div
                  key={`${item.productId}-${item.grindType}-${index}`}
                  className="flex items-center justify-between py-2 text-sm border-b border-gray-100 last:border-0"
                >
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">{item.productName}</span>
                    <span className="text-gray-500 ml-2">
                      ({item.quantity}kg, {item.grindType})
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">
                      ₹{item.itemTotal.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleRemoveFromCart(item.productId, item.grindType)}
                      className="text-red-600 hover:text-red-700 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      aria-label="Remove item"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary and Continue Button */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  {getItemCount()} item{getItemCount() !== 1 ? 's' : ''} in cart
                </p>
                <p className="text-xl font-bold text-gray-900">
                  Total: ₹{totalAmount.toFixed(2)}
                </p>
              </div>
              <button
                onClick={handleContinue}
                disabled={items.length === 0}
                className={`px-8 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 min-h-[44px] ${
                  items.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductSelectionPage;
