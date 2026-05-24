import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore active user session from LocalStorage on mount
  useEffect(() => {
    const activeSession = localStorage.getItem('deepnet_active_session');
    if (activeSession) {
      setUser(JSON.parse(activeSession));
    }
    setLoading(false);
  }, []);

  // Simple Local Registration
  const register = (name, email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('deepnet_local_users') || '[]');
      const emailClean = email.toLowerCase().trim();

      // Check if user exists
      const userExists = users.some(u => u.email === emailClean);
      if (userExists) {
        return { success: false, message: 'An account already exists with this email address.' };
      }

      // Add new user
      const newUser = { name, email: emailClean, password };
      users.push(newUser);
      localStorage.setItem('deepnet_local_users', JSON.stringify(users));

      // Auto-login after registration
      const sessionUser = { name, email: emailClean };
      localStorage.setItem('deepnet_active_session', JSON.stringify(sessionUser));
      setUser(sessionUser);

      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, message: 'Failed to create local account.' };
    }
  };

  // Simple Local Login
  const login = (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('deepnet_local_users') || '[]');
      const emailClean = email.toLowerCase().trim();

      // Find user and match credentials
      const foundUser = users.find(u => u.email === emailClean && u.password === password);
      
      if (foundUser) {
        const sessionUser = { name: foundUser.name, email: foundUser.email };
        localStorage.setItem('deepnet_active_session', JSON.stringify(sessionUser));
        setUser(sessionUser);
        return { success: true };
      } else {
        return { success: false, message: 'Incorrect email or password. Please try again.' };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: 'Failed to authenticate session.' };
    }
  };

  // Local Logout
  const logout = () => {
    localStorage.removeItem('deepnet_active_session');
    setUser(null);
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
