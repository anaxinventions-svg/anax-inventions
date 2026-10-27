import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome, FaCog, FaBriefcase, FaComments,
  FaStar, FaBuilding, FaEnvelope
} from 'react-icons/fa';
import { servicesAPI, portfolioAPI, testimonialsAPI } from '../../api/api';
import './Admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    services: 0,
    portfolio: 0,
    testimonials: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [servicesRes, portfolioRes, testimonialsRes] = await Promise.all([
          servicesAPI.getAll(),
          portfolioAPI.getAll(),
          testimonialsAPI.getAll()
        ]);
        setStats({
          services: servicesRes.data.length,
          portfolio: portfolioRes.data.length,
          testimonials: testimonialsRes.data.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Services', count: stats.services, icon: FaCog, path: '/admin/services', color: '#cc7722' },
    { title: 'Portfolio', count: stats.portfolio, icon: FaBriefcase, path: '/admin/portfolio', color: '#1d2e2a' },
    { title: 'Testimonials', count: stats.testimonials, icon: FaComments, path: '/admin/testimonials', color: '#cc7722' },
  ];

  const quickLinks = [
    { title: 'Hero Section', path: '/admin/hero', icon: FaHome },
    { title: 'Why Choose Us', path: '/admin/why-choose-us', icon: FaStar },
    { title: 'Company Info', path: '/admin/company', icon: FaBuilding },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Welcome to Anax Inventions Admin Panel</p>
      </div>

      <div className="admin-stats-grid">
        {cards.map((card) => (
          <Link to={card.path} key={card.title} className="admin-stat-card" style={{ borderLeftColor: card.color }}>
            <div className="admin-stat-icon" style={{ background: card.color + '15', color: card.color }}>
              <card.icon />
            </div>
            <div className="admin-stat-info">
              <h3>{card.count}</h3>
              <p>{card.title}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="admin-quick-links">
        <h2>Quick Links</h2>
        <div className="admin-quick-grid">
          {quickLinks.map((link) => (
            <Link to={link.path} key={link.title} className="admin-quick-card">
              <link.icon />
              <span>{link.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;