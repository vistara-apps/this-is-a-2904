import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('simutrade_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate login - in real app, this would connect to Supabase
    const userData = {
      userId: Math.random().toString(36).substr(2, 9),
      username: email.split('@')[0],
      email,
      subscriptionTier: 'free',
      virtualBalance: 10000,
      tradeHistory: [],
      tutorialProgress: {}
    };
    
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('simutrade_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (email, password, username) => {
    // Simulate registration
    const userData = {
      userId: Math.random().toString(36).substr(2, 9),
      username,
      email,
      subscriptionTier: 'free',
      virtualBalance: 10000,
      tradeHistory: [],
      tutorialProgress: {}
    };
    
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('simutrade_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('simutrade_user');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('simutrade_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};