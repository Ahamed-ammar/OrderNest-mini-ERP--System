import axiosInstance from './axiosConfig';

// Create new order (customer)
export const createOrder = async (orderData) => {
  const response = await axiosInstance.post('/orders', orderData);
  return response.data;
};

// Get all orders (admin)
export const getAllOrders = async (filters = {}) => {
  const response = await axiosInstance.get('/orders', { params: filters });
  return response.data;
};

// Get order by ID
export const getOrderById = async (id) => {
  const response = await axiosInstance.get(`/orders/${id}`);
  return response.data;
};

// Update order status (admin)
export const updateOrderStatus = async (id, status) => {
  const response = await axiosInstance.put(`/orders/${id}/status`, { status });
  return response.data;
};

// Assign delivery staff (admin)
export const assignDeliveryStaff = async (id, deliveryStaffId) => {
  const response = await axiosInstance.put(`/orders/${id}/assign-staff`, { deliveryStaffId });
  return response.data;
};
