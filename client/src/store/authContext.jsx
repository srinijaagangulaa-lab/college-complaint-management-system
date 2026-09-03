import React, { createContext, useContext, useEffect, useState } from 'react';

import {
  login as apiLogin,
  register as apiRegister,
  getMe,
  logout as apiLogout,
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('ccms_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Failed to load saved user:', error);
      localStorage.removeItem('ccms_user');
      return null;
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem('ccms_token') || null
  );

  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // Initialize authentication
  // --------------------------------------------------
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('ccms_token');

      // No token means user is not logged in
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        // Get current user from backend
        const response = await getMe();

        if (response?.user) {
          setUser(response.user);

          localStorage.setItem(
            'ccms_user',
            JSON.stringify(response.user)
          );
        } else {
          // Some APIs return the user directly
          setUser(response);

          localStorage.setItem(
            'ccms_user',
            JSON.stringify(response)
          );
        }

        setToken(storedToken);
      } catch (error) {
        console.warn(
          'Unable to restore session:',
          error.response?.data?.message || error.message
        );

        // Clear invalid session
        setUser(null);
        setToken(null);

        localStorage.removeItem('ccms_token');
        localStorage.removeItem('ccms_user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // --------------------------------------------------
  // Login
  // --------------------------------------------------
  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials);

      console.log('Login response:', response);

      const loggedInUser = response?.user || response;
      const authToken = response?.token;

      if (!authToken) {
        throw new Error('Login successful but no authentication token was received.');
      }

      if (!loggedInUser) {
        throw new Error('Login successful but user information was not received.');
      }

      // Update React state
      setUser(loggedInUser);
      setToken(authToken);

      // Save session
      localStorage.setItem(
        'ccms_token',
        authToken
      );

      localStorage.setItem(
        'ccms_user',
        JSON.stringify(loggedInUser)
      );

      return loggedInUser;
    } catch (error) {
      console.error(
        'Login failed:',
        error.response?.data || error.message
      );

      throw error;
    }
  };

  // --------------------------------------------------
  // Register
  // --------------------------------------------------
  const register = async (userData) => {
    try {
      const response = await apiRegister(userData);

      console.log('Registration response:', response);

      const registeredUser = response?.user || response;
      const authToken = response?.token;

      if (!authToken) {
        throw new Error(
          'Registration successful but no authentication token was received.'
        );
      }

      if (!registeredUser) {
        throw new Error(
          'Registration successful but user information was not received.'
        );
      }

      // Update React state
      setUser(registeredUser);
      setToken(authToken);

      // Save session
      localStorage.setItem(
        'ccms_token',
        authToken
      );

      localStorage.setItem(
        'ccms_user',
        JSON.stringify(registeredUser)
      );

      return registeredUser;
    } catch (error) {
      console.error(
        'Registration failed:',
        error.response?.data || error.message
      );

      throw error;
    }
  };

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------
  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.warn(
        'Logout API error:',
        error.response?.data || error.message
      );
    } finally {
      // Always clear local session
      setUser(null);
      setToken(null);

      localStorage.removeItem('ccms_token');
      localStorage.removeItem('ccms_user');
    }
  };

  // --------------------------------------------------
  // Update user profile
  // --------------------------------------------------
  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);

    localStorage.setItem(
      'ccms_user',
      JSON.stringify(updatedUser)
    );
  };

  // --------------------------------------------------
  // Authentication states
  // --------------------------------------------------
  const isAuthenticated = Boolean(token && user);

  const isAdmin = user?.role === 'admin';

  const isStudent = user?.role === 'student';

  // --------------------------------------------------
  // Context provider
  // --------------------------------------------------
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        isStudent,
        login,
        register,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// --------------------------------------------------
// useAuth Hook
// --------------------------------------------------
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
};

export default AuthContext;