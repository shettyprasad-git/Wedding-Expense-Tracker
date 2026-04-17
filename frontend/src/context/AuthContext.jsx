import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await api.get('/auth/user');
        // This now includes budgets, phone, role, profileImage from backend
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const signup = async (userData) => {
    const res = await api.post('/auth/signup', userData);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    // Refresh to get full schema including budgets/role etc
    await loadUser();
    return res.data;
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    // Refresh to get full schema
    await loadUser();
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      // Backend returns full user object or profile fields
      setUser(prev => ({ ...prev, ...res.data }));
      return res.data;
    } catch (err) {
      console.error('❌ Update Profile Error:', err);
      throw err;
    }
  };

  const updateBudgets = async (budgetData) => {
    try {
      const res = await api.put('/auth/budgets', budgetData);
      setUser(prev => ({ ...prev, budgets: res.data }));
      return res.data;
    } catch (err) {
      console.error('❌ Update Budgets Error:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signup, 
      login, 
      logout, 
      updateProfile, 
      updateBudgets, 
      refreshUser: loadUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
