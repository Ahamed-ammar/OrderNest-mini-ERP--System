import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CartContext } from '../../context/CartContext';
import { createOrder } from '../../api/orderApi';

const ReviewPage = () => {
  const navigate = useNavigate();
  const { orderType, items, totalAmount, isEmpty, clearCart } = useContext(CartContext);

  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [estimatedReadyDate, setEstimatedReadyDate] = useState(null);

  // Load delivery address from localStorage
  useEffect(() => {
    const storedAddress = localStorage.getItem('deliveryAddress');
    if (storedAddress) {
      try {
        const address = JSON.parse(storedAddress);
        setDeliveryAddress(address);
      } catch (error) {
        console.error('Error loading address:', error);
        toast.error('Failed to load delivery address');
        navigate('/order/address');
      }
    } else {
      toast.error('No delivery address found');
      navigate('/order/address');
    }
  }, [navigate]);

  // Check if cart is empty
  useEffect(() => {
    if (isEmpty()) {
      toast.error('Your cart is empty. Please add items first.');
      navigate('/order/products');
    }
  }, [isEmpty, navigate]);

  // Calculate estimated ready date (2 business days)
  useEffect(() => {
    const calculateReadyDate = () => {
      const today = new Date();
      let daysAdded = 0;
      const readyDate = new Date(today);

      while (daysAdded < 2) {
        readyDate.setDate(readyDate.getDate() + 1);
        // Skip Sundays (0)
        if (readyDate.getDay() !== 0) {
          daysAdded++;
        }
      }

      return readyDate;
    };

    setEstimatedReadyDate(calculateReadyDate());
  }, []);

  // Calculate price breakdown
  const calculateBreakdown = () => {
    let grindingTotal = 0;
    let rawMaterialTotal = 0;

    items.forEach(item => {
      grindingTotal += item.quantity * item.grindingCharge;
      // Check per-item order type
      if (item.orderType === 'buyAndService') {
        rawMaterialTotal += item.quantity * item.rawMaterialPrice;
      }
    });

    return { grindingTotal, rawMaterialTotal };
  };

  const { grindingTotal, rawMaterialTotal } = calculateBreakdown();

  const handleConfirmOrder = async () => {
    if (!deliveryAddress) {
      toast.error('Delivery address is missing');
      navigate('/order/address');
      return;
    }

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          grindType: item.grindType,
          orderType: item.orderType // Include per-item order type
        })),
        deliveryAddress: {
          name: deliveryAddress.name,
          phone: deliveryAddress.phone,
          streetType: deliveryAddress.streetType,
          houseName: deliveryAddress.houseName,
          doorNo: deliveryAddress.doorNo,
          landmark: deliveryAddress.landmark || ''
        }
      };

      // Create order
      const response = await createOrder(orderData);

      // Clear cart and address
      clearCart();
      localStorage.removeItem('deliveryAddress');

      // Navigate to success page with order details
      navigate('/order/success', { 
        state: { 
          order: response.data 
        } 
      });

      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error.response?.data?.error?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!deliveryAddress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Review Order</h1>
          <p className="text-gray-600 mt-2">Review your order details before confirmation</p>
          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mt-4">
            <div className="flex-1 h-2 bg-green-600 rounded"></div>
            <div className="flex-1 h-2 bg-green-600 rounded"></div>
            <div className="flex-1 h-2 bg-green-600 rounded"></div>
            <div className="flex-1 h-2 bg-green-600 rounded"></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Step 4 of 4: Review & Confirm</p>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-start border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.productName}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Quantity: {item.quantity} kg | Grind: {item.grindType}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.orderType === 'serviceOnly' ? 'Service Only' : 'Buy + Grinding'}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-semibold text-gray-900">₹{item.itemTotal.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Price Breakdown</h2>
          <div className="space-y-3">
            {rawMaterialTotal > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Raw Material Cost</span>
                <span>₹{rawMaterialTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-700">
              <span>Grinding Charge</span>
              <span>₹{grindingTotal.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
              <span>Grand Total</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Estimated Ready Date */}
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-900">Estimated Ready Date</p>
              <p className="text-sm text-blue-700">
                {estimatedReadyDate?.toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h2>
          <div className="text-gray-700 space-y-1">
            <p className="font-medium">{deliveryAddress.name}</p>
            <p>{deliveryAddress.phone}</p>
            <p>{deliveryAddress.doorNo}, {deliveryAddress.houseName}</p>
            <p>{deliveryAddress.streetType}</p>
            {deliveryAddress.landmark && <p>Landmark: {deliveryAddress.landmark}</p>}
          </div>
        </div>

        {/* Confirm Button */}
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 md:relative md:bottom-auto md:border-0 md:bg-transparent md:p-0">
          <button
            onClick={handleConfirmOrder}
            disabled={loading}
            className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold text-base hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Confirm Order'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
