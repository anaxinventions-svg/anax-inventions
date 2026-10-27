import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/api';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      authAPI.getMe()
        .then(res => setUser(res.data.user))
        .catch(() => localStorage.removeItem('adminToken'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('adminToken', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
    window.location.href = '/admin/login';
  };

  return (
    <AdminContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AdminContext.Provider>
  );
};