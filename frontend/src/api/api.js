import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 and 403 errors - Auto redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors (401 Unauthorized, 403 Forbidden)
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear expired/invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Show message to user
      const errorMessage = error.response?.data?.message || 'Your session has expired. Please login again.';
      
      Swal.fire({
        icon: 'warning',
        title: 'Session Expired',
        text: errorMessage,
        confirmButtonColor: '#cc7722',
        confirmButtonText: 'OK'
      }).then(() => {
        // Redirect to home page
        window.location.href = '/';
      });
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me')
};

// Hero APIs
export const heroAPI = {
  get: () => api.get('/hero'),
  update: (data) => api.put('/hero', data)
};

// Services APIs
export const servicesAPI = {
  getAll: () => api.get('/services/all'),
  getPublic: () => api.get('/services'),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
  reorder: (orders) => api.put('/services/reorder', { orders })
};

// Portfolio APIs
export const portfolioAPI = {
  getAll: () => api.get('/portfolio/all'),
  getPublic: (params) => api.get('/portfolio', { params }),
  create: (data) => api.post('/portfolio', data),
  update: (id, data) => api.put(`/portfolio/${id}`, data),
  delete: (id) => api.delete(`/portfolio/${id}`)
};

// Testimonials APIs
export const testimonialsAPI = {
  getAll: () => api.get('/testimonials/all'),
  getPublic: () => api.get('/testimonials'),
  create: (data) => api.post('/testimonials', data),
  update: (id, data) => api.put(`/testimonials/${id}`, data),
  delete: (id) => api.delete(`/testimonials/${id}`)
};

// Why Choose Us APIs
export const whyChooseUsAPI = {
  get: () => api.get('/why-choose-us'),
  update: (data) => api.put('/why-choose-us', data)
};

// Company APIs
export const companyAPI = {
  get: () => api.get('/company'),
  update: (data) => api.put('/company', data)
};

// Upload API
export const uploadAPI = {
  uploadImage: (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

export default api;