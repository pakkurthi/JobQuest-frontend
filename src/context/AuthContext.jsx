import { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //checking
    const initAuth = async () => {
      if (AuthService.isLoggedIn()) {
        try {
          const response = await AuthService.getCurrentUser();
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching current user:", error);
          AuthService.logout();
        }
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await AuthService.login(credentials);
    setUser({
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role
    });
    return data;
  };

  const register = async (userData) => {
    const data = await AuthService.register(userData);
    setUser({
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role
    });
    return data;
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const isJobProvider = () => {
    return user?.role === 'JOB_PROVIDER';
  };

  const isJobSeeker = () => {
    return user?.role === 'JOB_SEEKER';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isJobProvider, isJobSeeker }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
