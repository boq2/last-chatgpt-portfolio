import { useState, useEffect } from 'react';
import authService from '../src/services/authService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setIsAuthenticated(true);
        setUser(currentUser);
      }
    } catch (error) {
      console.log('Not authenticated');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoginLoading(true);
    setError('');
    
    try {
      await authService.login(email, password);
      const currentUser = await authService.getCurrentUser();
      
      setIsAuthenticated(true);
      setUser(currentUser);
      setLoginLoading(false);
      return true;
    } catch (error) {
      const errorMessage = error.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      setLoginLoading(false);
      return false;
    }
  };

  const register = async (email, password, name) => {
    setLoginLoading(true);
    setError('');
    
    try {
      await authService.register(email, password, name);
      // Auto login after registration
      return await login(email, password);
    } catch (error) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      setLoginLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
      setError('');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return { 
    isAuthenticated, 
    user, 
    error, 
    loading, 
    loginLoading, 
    login, 
    register, 
    logout,
    checkAuthStatus 
  };
};