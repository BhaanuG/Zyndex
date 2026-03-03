import axios from 'axios';

// API Base URL - Update this with your actual backend URL
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - Clear auth and redirect to login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          window.location.href = '/Zyndex/User/Log-In';
          break;
        case 403:
          // Forbidden - User doesn't have permission
          console.error('Access forbidden:', data.message);
          break;
        case 404:
          // Not found
          console.error('Resource not found:', data.message);
          break;
        case 500:
          // Server error
          console.error('Server error:', data.message);
          break;
        default:
          console.error('API Error:', data.message);
      }
      
      return Promise.reject(data);
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
      return Promise.reject({ message: 'Network error. Please check your connection.' });
    } else {
      console.error('Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

export default apiClient;
