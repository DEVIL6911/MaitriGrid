import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, setToken, removeToken, getToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing token on mount
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const token = await getToken();
      if (token) {
        const userData = await authAPI.getMe();
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (e) {
      await removeToken();
    } finally {
      setIsLoading(false);
    }
  }

  async function login(phone, password) {
    const result = await authAPI.login(phone, password);
    await setToken(result.access_token);
    const userData = await authAPI.getMe();
    setUser(userData);
    setIsAuthenticated(true);
    return result;
  }

  async function signup(phone, password) {
    const result = await authAPI.signup(phone, password);
    return result;
  }

  async function verifyOTP(phone, otp) {
    const result = await authAPI.verifyOTP(phone, otp);
    await setToken(result.access_token);
    const userData = await authAPI.getMe();
    setUser(userData);
    setIsAuthenticated(true);
    return result;
  }

  async function logout() {
    await removeToken();
    setUser(null);
    setIsAuthenticated(false);
  }

  async function refreshUser() {
    try {
      const userData = await authAPI.getMe();
      setUser(userData);
    } catch (e) {
      // silently fail
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        signup,
        verifyOTP,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
