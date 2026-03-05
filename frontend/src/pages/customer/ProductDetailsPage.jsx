import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../../api/productApi';
import { toast } from 'react-toastify';
import CustomerHeader from '../../components/common/CustomerHeader';
import Loader from '../../components/common/Loader';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      console.log('Fetching product with ID:', id);
      const data = await getProductById(id);
      console.log('Product data received:', data);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Failed to load product details');
      // Don't navigate away immediately, let user see the error
      setTimeout(() => navigate('/'), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderNow = () => {
    navigate('/order/type');
  };

  // Product image mapping
  const productImages = {
    'Wheat': '/images/wheat.jpg',
    'Rice': '/images/rice.jpg',
    'Turmeric': '/images/turmeric-powder.jpg',
    'Chili': '/images/chilli.jpg',
    'Chilli': '/images/chilli.jpg',
    'Coriander': '/images/Coriander.jpg',
    'Garam Masala': '/images/garam masala.jpg',
  };

  const getProductImage = (productName) => {
    const matchedKey = Object.keys(productImages).find(key => 
      productName.toLowerCase().includes(key.toLowerCase())
    );
    return matchedKey ? productImages[matchedKey] : '/images/wheat.jpg';
  };

  if (loading) {
    return (
      <>
        <CustomerHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader />
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <CustomerHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Product not found</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
            >
              Go back to home
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <CustomerHeader />
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Back Button */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back</span>
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="relative h-96 lg:h-full bg-gradient-to-br from-amber-50 to-orange-50">
                <img
                  src={getProductImage(product.name)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                {/* Fallback */}
                <div className="hidden absolute inset-0 bg-gradient-to-br from-amber-200 to-orange-300 items-center justify-center">
                  <span className="text-9xl">🌾</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-8 lg:p-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                
                {product.description && (
                  <p className="text-lg text-gray-600 mb-6">{product.description}</p>
                )}

                {/* Pricing Section */}
                <div className="bg-amber-50 rounded-xl p-6 mb-8 border-2 border-amber-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Pricing</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Raw Material:</span>
                      <span className="text-2xl font-bold text-amber-700">₹{product.rawMaterialPricePerKg}/kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Grinding Service:</span>
                      <span className="text-2xl font-bold text-green-700">₹{product.grindingChargePerKg}/kg</span>
                    </div>
                    <div className="pt-3 border-t-2 border-amber-300">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-900 font-semibold">Total (Buy + Grind):</span>
                        <span className="text-3xl font-bold text-amber-600">
                          ₹{(product.rawMaterialPricePerKg + product.grindingChargePerKg).toFixed(2)}/kg
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Button */}
                <button
                  onClick={handleOrderNow}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg transform transition hover:scale-105 active:scale-95 mb-6"
                >
                  🛒 Order Now
                </button>
              </div>
            </div>

            {/* Grinding Process Section */}
            <div className="border-t-2 border-gray-200 p-8 lg:p-12 bg-gradient-to-br from-white to-amber-50">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Grinding Process</h2>
              <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
                We use traditional stone grinding methods to preserve the natural aroma, flavor, and nutritional value of your {product.name.toLowerCase()}. 
                Our process ensures the perfect texture while maintaining the authentic taste.
              </p>

              {/* Grinding Levels */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Fine Grind */}
                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200 hover:border-green-400 transition">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-3xl">✨</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Fine Grind</h3>
                  </div>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>Powder-like consistency</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>Perfect for baking and smooth batters</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>Dissolves easily in liquids</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>Ideal for baby food and elderly</span>
                    </li>
                  </ul>
                </div>

                {/* Medium Grind */}
                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-amber-200 hover:border-amber-400 transition">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-3xl">⭐</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Medium Grind</h3>
                  </div>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1">✓</span>
                      <span>Balanced texture</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1">✓</span>
                      <span>Most popular choice</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1">✓</span>
                      <span>Versatile for all cooking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1">✓</span>
                      <span>Great for traditional recipes</span>
                    </li>
                  </ul>
                </div>

                {/* Coarse Grind */}
                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-200 hover:border-orange-400 transition">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-3xl">🌟</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Coarse Grind</h3>
                  </div>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">✓</span>
                      <span>Chunky texture</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">✓</span>
                      <span>Retains maximum nutrients</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">✓</span>
                      <span>Perfect for porridge and rustic dishes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">✓</span>
                      <span>Longer shelf life</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Process Steps */}
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">How We Grind</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-4xl">1️⃣</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">Cleaning</h4>
                    <p className="text-sm text-gray-600">Raw materials are thoroughly cleaned and sorted</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-4xl">2️⃣</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">Stone Grinding</h4>
                    <p className="text-sm text-gray-600">Traditional stone mills grind at optimal speed</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-4xl">3️⃣</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">Quality Check</h4>
                    <p className="text-sm text-gray-600">Each batch is inspected for consistency</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-4xl">4️⃣</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">Packaging</h4>
                    <p className="text-sm text-gray-600">Freshly ground and hygienically packed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="border-t-2 border-gray-200 p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Why Choose Our Grinding Service?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="text-5xl mb-3">🌿</div>
                  <h4 className="font-bold text-gray-900 mb-2">100% Natural</h4>
                  <p className="text-sm text-gray-600">No additives or preservatives</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="text-5xl mb-3">❄️</div>
                  <h4 className="font-bold text-gray-900 mb-2">Cool Grinding</h4>
                  <p className="text-sm text-gray-600">Low temperature preserves nutrients</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <div className="text-5xl mb-3">🧼</div>
                  <h4 className="font-bold text-gray-900 mb-2">Hygienic</h4>
                  <p className="text-sm text-gray-600">Clean equipment and process</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                  <div className="text-5xl mb-3">⚡</div>
                  <h4 className="font-bold text-gray-900 mb-2">Fast Service</h4>
                  <p className="text-sm text-gray-600">Ready in 2 business days</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-8 lg:p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
              <p className="text-xl text-amber-100 mb-6">
                Get freshly ground {product.name.toLowerCase()} delivered to your doorstep
              </p>
              <button
                onClick={handleOrderNow}
                className="bg-white text-amber-700 px-12 py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-amber-50 transform transition hover:scale-105 active:scale-95"
              >
                🛒 Start Your Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailsPage;
