import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance with base URL from environment
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors and global error notifications
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Don't show toast for network errors - let the component handle it
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject(error);
    }
    
    // Handle 401 errors - redirect to login
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
