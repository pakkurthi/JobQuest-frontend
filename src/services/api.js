import axios from 'axios';

const API_URL = 'http://localhost:8081';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Enable request and response logging
api.interceptors.request.use(request => {
  console.log('Starting Request', request.method, request.url);
  console.log('Request Headers:', request.headers);
  return request;
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.config.url);
    console.log('Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      
      if (error.response.status === 401) {
        // Unauthorized, clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
