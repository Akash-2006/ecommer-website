import axios from 'axios';

// Use environment variable or default to localhost for development
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

// Create axios instance with credentials for session cookies
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired or invalid
      localStorage.removeItem('user');
      // Optionally redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// Products API
export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured/list'),
  getByCategory: (category) => api.get(`/products/category/${category}`),
  getByGender: (gender) => api.get(`/products/gender/${gender}`),
  getColors: () => api.get('/products/filters/colors'),
  getSizes: () => api.get('/products/filters/sizes'),
};

// Orders API
export const ordersAPI = {
  getAll: () => api.get('/orders'),
  create: (orderData) => api.post('/orders', orderData),
  getById: (orderId) => api.get(`/orders/${orderId}`),
  updateStatus: (orderId, status) => api.patch(`/orders/${orderId}/status`, { status }),
};

// Users API
export const usersAPI = {
  updateProfile: (profileData) => api.put('/users/profile', profileData),
};

// Helper functions for session-based auth
export const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  return !!user;
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const clearUserSession = () => {
  localStorage.removeItem('user');
};

export default api;
