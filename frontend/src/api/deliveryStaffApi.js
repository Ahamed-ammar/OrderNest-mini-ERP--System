import axiosInstance from './axiosConfig';

// Get all delivery staff (admin)
export const getAllDeliveryStaff = async () => {
  const response = await axiosInstance.get('/delivery-staff');
  return response.data;
};

// Add delivery staff (admin)
export const createDeliveryStaff = async (staffData) => {
  const response = await axiosInstance.post('/delivery-staff', staffData);
  return response.data;
};

// Update delivery staff (admin)
export const updateDeliveryStaff = async (id, staffData) => {
  const response = await axiosInstance.put(`/delivery-staff/${id}`, staffData);
  return response.data;
};

// Activate/deactivate staff (admin)
export const toggleDeliveryStaffStatus = async (id) => {
  const response = await axiosInstance.patch(`/delivery-staff/${id}/toggle`);
  return response.data;
};

// Get staff delivery count (admin)
export const getStaffDeliveryCount = async (id) => {
  const response = await axiosInstance.get(`/delivery-staff/${id}/deliveries`);
  return response.data;
};
