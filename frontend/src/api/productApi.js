import axiosInstance from './axiosConfig';

// Get all active products (public)
export const getProducts = async () => {
  const response = await axiosInstance.get('/products');
  return response.data;
};

// Get all products including inactive (admin only)
export const getAllProducts = async () => {
  const response = await axiosInstance.get('/products/admin/all');
  return response.data;
};

// Get product by ID (public)
export const getProductById = async (id) => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

// Create product (admin only)
export const createProduct = async (productData) => {
  const response = await axiosInstance.post('/products', productData);
  return response.data;
};

// Update product (admin only)
export const updateProduct = async (id, productData) => {
  const response = await axiosInstance.put(`/products/${id}`, productData);
  return response.data;
};

// Enable/disable product (admin only)
export const toggleProductStatus = async (id) => {
  const response = await axiosInstance.patch(`/products/${id}/toggle`);
  return response.data;
};

