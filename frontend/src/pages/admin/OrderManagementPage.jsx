import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllOrders, updateOrderStatus, assignDeliveryStaff } from '../../api/orderApi';
import { getAllDeliveryStaff } from '../../api/deliveryStaffApi';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/admin/StatusBadge';
import {
  ORDER_STATUS,
  VALID_STATUS_TRANSITIONS,
  STATUS_DISPLAY_NAMES,
  DELIVERY_TYPES
} from '../../utils/constants';

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryStaff, setDeliveryStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    deliveryType: '',
    startDate: '',
    endDate: ''
  });

  // Modal states
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [updating, setUpdating] = useState(false);

  // Fetch orders with filters
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const filterParams = {};
      
      if (filters.status) filterParams.status = filters.status;
      if (filters.deliveryType) filterParams.deliveryType = filters.deliveryType;
      if (filters.startDate) filterParams.startDate = filters.startDate;
      if (filters.endDate) filterParams.endDate = filters.endDate;

      const data = await getAllOrders(filterParams);
      setOrders(data.data?.orders || []);
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch delivery staff
  const fetchDeliveryStaff = async () => {
    try {
      const data = await getAllDeliveryStaff();
      setDeliveryStaff(data.data || []);
    } catch (error) {
      console.error('Error fetching delivery staff:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchDeliveryStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch when filters change
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      status: '',
      deliveryType: '',
      startDate: '',
      endDate: ''
    });
  };

  // Open status update modal
  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus('');
    setStatusModalOpen(true);
  };

  // Open staff assignment modal
  const openStaffModal = (order) => {
    setSelectedOrder(order);
    setSelectedStaffId(order.deliveryStaffId?._id || '');
    setStaffModalOpen(true);
  };

  // Open order details modal
  const openDetailsModal = (order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!newStatus) {
      toast.error('Please select a status');
      return;
    }

    try {
      setUpdating(true);
      await updateOrderStatus(selectedOrder._id, newStatus);
      toast.success('Order status updated successfully');
      setStatusModalOpen(false);
      fetchOrders();
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to update order status';
      
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  // Handle staff assignment
  const handleStaffAssignment = async () => {
    if (!selectedStaffId) {
      toast.error('Please select a delivery staff member');
      return;
    }

    try {
      setUpdating(true);
      await assignDeliveryStaff(selectedOrder._id, selectedStaffId);
      toast.success('Delivery staff assigned successfully');
      setStaffModalOpen(false);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to assign delivery staff');
    } finally {
      setUpdating(false);
    }
  };

  // Get valid next statuses for an order
  const getValidNextStatuses = (currentStatus) => {
    return VALID_STATUS_TRANSITIONS[currentStatus] || [];
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

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount.toFixed(2)}`;
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-96">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="mt-1 text-sm text-gray-600">Manage and track all customer orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                {Object.values(ORDER_STATUS).map(status => (
                  <option key={status} value={status}>
                    {STATUS_DISPLAY_NAMES[status]}
                  </option>
                ))}
              </select>
            </div>

            {/* Delivery Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Type
              </label>
              <select
                name="deliveryType"
                value={filters.deliveryType}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                {Object.values(DELIVERY_TYPES).map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* End Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-4">
            <Button onClick={clearFilters} variant="secondary">
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Orders Table - Desktop */}
        <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.customerId?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{order.customerId?.phone || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.deliveryType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <Button
                          onClick={() => openDetailsModal(order)}
                          variant="secondary"
                          className="text-xs"
                        >
                          Details
                        </Button>
                        <Button
                          onClick={() => openStatusModal(order)}
                          variant="primary"
                          className="text-xs"
                        >
                          Update Status
                        </Button>
                        {order.status === ORDER_STATUS.OUT_FOR_DELIVERY && (
                          <Button
                            onClick={() => openStaffModal(order)}
                            variant="secondary"
                            className="text-xs"
                          >
                            Assign Staff
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Orders Cards - Mobile */}
        <div className="lg:hidden space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              No orders found
            </div>
          ) : (
            orders.map(order => (
              <div key={order._id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium text-gray-900">
                      {order.customerId?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium text-gray-900">
                      {order.customerId?.phone || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Type:</span>
                    <span className="font-medium text-gray-900">
                      {order.deliveryType}
                    </span>
                  </div>
                  {order.deliveryStaffId && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Staff:</span>
                      <span className="font-medium text-gray-900">
                        {order.deliveryStaffId.name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => openDetailsModal(order)}
                    variant="secondary"
                    className="flex-1 text-sm"
                  >
                    Details
                  </Button>
                  <Button
                    onClick={() => openStatusModal(order)}
                    variant="primary"
                    className="flex-1 text-sm"
                  >
                    Update Status
                  </Button>
                  {order.status === ORDER_STATUS.OUT_FOR_DELIVERY && (
                    <Button
                      onClick={() => openStaffModal(order)}
                      variant="secondary"
                      className="flex-1 text-sm"
                    >
                      Assign Staff
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title={`Order #${selectedOrder?._id.slice(-6).toUpperCase()} Details`}
      >
        {selectedOrder && (
          <div className="space-y-4">
            {/* Customer Info */}
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Customer</p>
              <p className="text-sm font-medium text-gray-900">{selectedOrder.customerId?.name || 'N/A'}</p>
              <p className="text-sm text-gray-600">{selectedOrder.customerId?.phone || selectedOrder.customerId?.email || 'N/A'}</p>
            </div>

            {/* Ordered Products */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Ordered Products</p>
              <div className="space-y-2">
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {item.productId?.name || item.productName || 'Product'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Qty: {item.quantity} kg &nbsp;|&nbsp; Grind: {item.grindType}
                        </p>
                        <p className="text-xs text-gray-500">
                          Type: {item.orderType === 'serviceOnly' ? 'Service Only' : 'Buy + Grinding'}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">₹{item.itemTotal?.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            {selectedOrder.deliveryAddress && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Delivery Address</p>
                <p className="text-sm text-gray-700">
                  {selectedOrder.deliveryAddress.doorNo}, {selectedOrder.deliveryAddress.houseName}
                </p>
                <p className="text-sm text-gray-700">{selectedOrder.deliveryAddress.streetType}</p>
                {selectedOrder.deliveryAddress.landmark && (
                  <p className="text-sm text-gray-500">Landmark: {selectedOrder.deliveryAddress.landmark}</p>
                )}
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between items-center border-t pt-3">
              <span className="font-semibold text-gray-900">Grand Total</span>
              <span className="text-lg font-bold text-green-600">₹{selectedOrder.totalAmount?.toFixed(2)}</span>
            </div>

            <Button onClick={() => setDetailsModalOpen(false)} variant="secondary" className="w-full">
              Close
            </Button>
          </div>
        )}
      </Modal>

      {/* Status Update Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Update Order Status"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Current Status: <span className="font-medium">{selectedOrder && STATUS_DISPLAY_NAMES[selectedOrder.status]}</span>
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select new status</option>
              {selectedOrder && getValidNextStatuses(selectedOrder.status).map(status => (
                <option key={status} value={status}>
                  {STATUS_DISPLAY_NAMES[status]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleStatusUpdate}
              variant="primary"
              disabled={updating || !newStatus}
              className="flex-1"
            >
              {updating ? 'Updating...' : 'Update Status'}
            </Button>
            <Button
              onClick={() => setStatusModalOpen(false)}
              variant="secondary"
              disabled={updating}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Staff Assignment Modal */}
      <Modal
        isOpen={staffModalOpen}
        onClose={() => setStaffModalOpen(false)}
        title="Assign Delivery Staff"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Delivery Staff
            </label>
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select staff member</option>
              {deliveryStaff
                .filter(staff => staff.isActive)
                .map(staff => (
                  <option key={staff._id} value={staff._id}>
                    {staff.name} - {staff.phone}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleStaffAssignment}
              variant="primary"
              disabled={updating || !selectedStaffId}
              className="flex-1"
            >
              {updating ? 'Assigning...' : 'Assign Staff'}
            </Button>
            <Button
              onClick={() => setStaffModalOpen(false)}
              variant="secondary"
              disabled={updating}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderManagementPage;