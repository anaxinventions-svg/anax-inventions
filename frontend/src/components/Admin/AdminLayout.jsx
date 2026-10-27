import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import AdminSidebar from './AdminSidebar';
import './Admin.css';

const AdminLayout = () => {
  const { isAuthenticated, loading } = useAdmin();

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;