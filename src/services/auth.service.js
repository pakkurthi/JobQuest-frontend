import api from './api';

export const AuthService = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/signin', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      // Store the user object correctly (API returns user data directly, not under user property)
      localStorage.setItem('user', JSON.stringify({
        id: response.data.id,
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        role: response.data.role
      }));
    }
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/api/auth/signup', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      // Store the user object correctly (API returns user data directly, not under user property)
      localStorage.setItem('user', JSON.stringify({
        id: response.data.id,
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        role: response.data.role
      }));
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: async () => {
    return api.get('/api/auth/me');
  },
  
  isLoggedIn: () => {
    return localStorage.getItem('token') !== null;
  },
  
  getRole: () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role || null;
  },
};

export default AuthService;
