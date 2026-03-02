import axiosInstance from './axiosConfig';

// Customer registration
export const customerRegister = async (username, email, password, name) => {
  const response = await axiosInstance.post('/auth/customer/register', { 
    username, 
    email, 
    password,
    name 
  });
  return response.data;
};

// Customer login with username/email and password
export const customerLogin = async (usernameOrEmail, password) => {
  const response = await axiosInstance.post('/auth/customer/login', { 
    usernameOrEmail, 
    password 
  });
  return response.data;
};

// Legacy: Customer login/register by phone
export const customerPhoneLogin = async (phone) => {
  const response = await axiosInstance.post('/auth/customer/login-phone', { phone });
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
