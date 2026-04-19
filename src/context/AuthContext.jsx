import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api.js';

// Create the context, but don't export the hook from here
const AuthContext = createContext();

// Export the context itself so other components can use it
export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await api.get('/user/isLoggedIn');
        if (response.data.isLoggedIn) {
          setCurrentUser(response.data.user);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/user/login', { username, password });
      setCurrentUser(response.data.user);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (username, password) => {
    try {
      const response = await api.post('/user/register', { username, password });
      setCurrentUser(response.data.user);
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/user/logout');
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
