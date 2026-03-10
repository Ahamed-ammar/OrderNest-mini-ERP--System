import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomerOrders, cancelOrder } from '../../api/customerApi';
import { useCart } from '../../hooks/useCart';
import { toast } from 'react-toastify';
import CustomerHeader from '../../components/common/CustomerHeader';

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const { clearCart, resetCartOnTypeChange, addToCart } = useCart();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getCustomerOrders();
      // Backend returns { success: true, data: { orders: [...] } }
      const fetchedOrders = response.data.orders || [];
      // Sort by date descending (most recent first)
      const sortedOrders = fetchedOrders.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load order history');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle reorder
  const handleReorder = (order) => {
    try {
      // Clear existing cart
      clearCart();
      
      // Set order type
      resetCartOnTypeChange(order.orderType);
      
      // Add all items from the order to cart
      order.items.forEach(item => {
        const product = {
          _id: item.productId,
          name: item.productName,
          rawMaterialPricePerKg: item.rawMaterialPriceSnapshot,
          grindingChargePerKg: item.grindingChargeSnapshot
        };
        addToCart(product, item.quantity, item.grindType);
      });
      
      toast.success('Order items added to cart');
      navigate('/order/products');
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Failed to reorder. Please try again.');
    }
  };

  // Handle cancel order
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      setCancellingOrderId(orderId);
      await cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      
      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: 'Cancelled' } : order
        )
      );
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(error.response?.data?.error?.message || 'Failed to cancel order');
    } finally {
      setCancellingOrderId(null);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'InProgress': 'bg-blue-100 text-blue-800',
      'Ready': 'bg-purple-100 text-purple-800',
      'OutForDelivery': 'bg-indigo-100 text-indigo-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Format status text
  const formatStatus = (status) => {
    const statusMap = {
      'Pending': 'Pending',
      'InProgress': 'In Progress',
      'Ready': 'Ready',
      'OutForDelivery': 'Out for Delivery',
      'Delivered': 'Delivered',
      'Cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  };

  // Get items summary
  const getItemsSummary = (items) => {
    if (items.length === 0) return 'No items';
    if (items.length === 1) return `${items[0].productName} (${items[0].quantity}kg)`;
    return `${items[0].productName} and ${items.length - 1} more item${items.length > 2 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order history...</p>
        </div>
      </div>
    );
  }

  // Split orders into recent (last 5) and older
  const recentOrders = orders.slice(0, 5);
  const olderOrders = orders.slice(5);

  return (
    <>
      <CustomerHeader />
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Order History</h1>
              <p className="text-sm text-gray-600 mt-1">
                {orders.length} order{orders.length !== 1 ? 's' : ''} total
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-sm text-green-600 hover:text-green-700 font-medium min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {orders.length === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">Start by placing your first order</p>
            <button
              onClick={() => navigate('/order/type')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Place an Order
            </button>
          </div>
        ) : (
          <>
            {/* Recent Orders Section */}
            {recentOrders.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <OrderCard
                      key={order._id}
                      order={order}
                      onReorder={handleReorder}
                      onCancel={handleCancelOrder}
                      formatDate={formatDate}
                      getStatusColor={getStatusColor}
                      formatStatus={formatStatus}
                      getItemsSummary={getItemsSummary}
                      isCancelling={cancellingOrderId === order._id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Older Orders Section */}
            {olderOrders.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Older Orders</h2>
                <div className="space-y-4">
                  {olderOrders.map((order) => (
                    <OrderCard
                      key={order._id}
                      order={order}
                      onReorder={handleReorder}
                      onCancel={handleCancelOrder}
                      formatDate={formatDate}
                      getStatusColor={getStatusColor}
                      formatStatus={formatStatus}
                      getItemsSummary={getItemsSummary}
                      isCancelling={cancellingOrderId === order._id}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </>
  );
};

// Order Card Component
const OrderCard = ({
  order,
  onReorder,
  onCancel,
  formatDate,
  getStatusColor,
  formatStatus,
  getItemsSummary,
  isCancelling
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      {/* Order Header */}
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-gray-500">Order ID:</span>
              <span className="text-sm font-mono font-semibold text-gray-900">{order._id}</span>
            </div>
            <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
            {formatStatus(order.status)}
          </span>
        </div>

        {/* Order Summary */}
        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-2">{getItemsSummary(order.items)}</p>
          <p className="text-xl font-bold text-gray-900">₹{order.totalAmount?.toFixed(2)}</p>
        </div>

        {/* Expandable Items Details */}
        {order.items && order.items.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
            >
              {expanded ? 'Hide' : 'View'} Details
              <svg
                className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {expanded && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start text-sm">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        <p className="text-gray-600 text-xs">
                          {item.quantity} kg | {item.grindType}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900 ml-4">₹{item.itemTotal?.toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Delivery Address */}
                {order.deliveryAddress && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-700 mb-1">Delivery Address:</p>
                    <p className="text-xs text-gray-600">
                      {order.deliveryAddress.name}, {order.deliveryAddress.phone}
                      <br />
                      {order.deliveryAddress.doorNo}, {order.deliveryAddress.houseName}
                      <br />
                      {order.deliveryAddress.streetType}
                      {order.deliveryAddress.landmark && `, ${order.deliveryAddress.landmark}`}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onReorder(order)}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 min-h-[44px]"
          >
            Reorder
          </button>
          
          {order.status === 'Pending' && (
            <button
              onClick={() => onCancel(order._id)}
              disabled={isCancelling}
              className="flex-1 px-4 py-3 bg-white text-red-600 border-2 border-red-600 rounded-lg font-medium text-sm hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
