import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import {
  FaHome, FaCog, FaBriefcase, FaImages,
  FaComments, FaStar, FaBuilding, FaSignOutAlt,
  FaTachometerAlt
} from 'react-icons/fa';
import './Admin.css';

const AdminSidebar = () => {
  const { logout } = useAdmin();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
    { path: '/admin/hero', icon: FaHome, label: 'Hero Section' },
    { path: '/admin/services', icon: FaCog, label: 'Services' },
    { path: '/admin/portfolio', icon: FaBriefcase, label: 'Portfolio' },
    { path: '/admin/testimonials', icon: FaComments, label: 'Testimonials' },
    { path: '/admin/why-choose-us', icon: FaStar, label: 'Why Choose Us' },
    { path: '/admin/company', icon: FaBuilding, label: 'Company Info' },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2>ANAX</h2>
        <span>Admin</span>
      </div>

      <nav className="admin-sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? 'admin-nav-item active' : 'admin-nav-item'
            }
          >
            <item.icon />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <button onClick={logout} className="admin-logout-btn">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;