import axiosInstance from './axiosConfig';

// Customer login/register by phone
export const customerLogin = async (phone) => {
  const response = await axiosInstance.post('/auth/customer/login', { phone });
  return response.data;
};

// Admin login with credentials
export const adminLogin = async (username, password) => {
  const response = await axiosInstance.post('/auth/admin/login', { username, password });
  return response.data;
};

// Verify JWT token validity
export const verifyToken = async () => {
  const response = await axiosInstance.post('/auth/verify');
  return response.data;
};
