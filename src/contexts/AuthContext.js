
import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

const AuthContext = createContext(null);
const cookies = new Cookies();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = cookies.get('auth_token');
    if (token) {
      try {
        const response = await axios.get(`${API_BASE_URL}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.user) {
          setUser(response.data.user);
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        handleLogout();
      }
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    cookies.remove('auth_token', { path: '/' });
    // Clear any other auth-related cookies or storage
    localStorage.removeItem('lastAuthCheck');
  };

  const login = (userData, token) => {
    setUser(userData);
    cookies.set('auth_token', token, { 
      path: '/',
      maxAge: 86400, // 24 hours
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    localStorage.setItem('lastAuthCheck', Date.now().toString());
  };

  // Function to get the current auth token
  const getToken = () => {
    return cookies.get('auth_token');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout: handleLogout, 
      loading,
      getToken,
      checkAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);