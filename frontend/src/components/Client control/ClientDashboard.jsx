import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import DashboardTab from './tabs/DashboardTab/DashboardTab';
import ProjectsTab from './tabs/ProjectsTab/ProjectsTab';
import RequirementsTab from './tabs/RequirementsTab/RequirementsTab';
import ProposalsTab from './tabs/ProposalsTab/ProposalsTab';
import ApprovalsTab from './tabs/ApprovalsTab/ApprovalsTab';
import ChangeRequestsTab from './tabs/ChangeRequestsTab/ChangeRequestsTab';
import ProfileTab from './tabs/ProfileTab/ProfileTab';
import './ClientDashboard.css';

const API_URL = 'http://localhost:5001/api';

const ClientDashboard = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('requirements');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [unreadProposals, setUnreadProposals] = useState(0);
  const [newRequirementsCount, setNewRequirementsCount] = useState(0);

  // Professional SVG Icons
  const tabs = [
    { 
      id: 'requirements', 
      label: 'Requirements', 
      badge: newRequirementsCount,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      )
    },
    { 
      id: 'proposals', 
      label: 'Proposals', 
      badge: unreadProposals,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <circle cx="18" cy="18" r="3" fill="currentColor" stroke="none" opacity="0.9"/>
        </svg>
      )
    },
    { 
      id: 'projects', 
      label: 'Projects', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
      )
    },
    { 
      id: 'approvals', 
      label: 'Approvals', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      )
    },
    { 
      id: 'changes', 
      label: 'Changes', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9h-4m-7 9A9 9 0 0 1 3 12m9 9v-4M3 12a9 9 0 0 1 9-9m-9 9h4m7-9a9 9 0 0 1 9 9"/>
        </svg>
      )
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    }
  ];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (userData && token) {
      setUser(JSON.parse(userData));
      fetchProjects();
      fetchUnreadProposals();
      fetchNewRequirementsCount();
    } else {
      window.location.href = '/';
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/client/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data.projects || []);
      if (res.data.projects?.length > 0) {
        setSelectedProject(res.data.projects[0]);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
    setLoading(false);
  };

  const fetchUnreadProposals = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/client/requirements/proposals/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadProposals(res.data.count || 0);
    } catch (err) {
      console.log('Unread proposals endpoint not available');
      setUnreadProposals(0);
    }
  };

  const fetchNewRequirementsCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/client/requirements/all-requirements`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Count requirements with status 'submitted' or 'pending'
      const newCount = (res.data.requirements || []).filter(
        req => req.status === 'submitted' || req.status === 'pending'
      ).length;
      setNewRequirementsCount(newCount);
    } catch (err) {
      console.log('Failed to fetch requirements count');
      setNewRequirementsCount(0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'requirements':
        return <RequirementsTab project={selectedProject} onUpdate={() => { fetchProjects(); fetchNewRequirementsCount(); }} />;
      case 'proposals':
        return <ProposalsTab user={user} onUpdate={() => { fetchUnreadProposals(); }} />;
      case 'projects':
        return <ProjectsTab projects={projects} selectedProject={selectedProject} setSelectedProject={setSelectedProject} />;
      case 'approvals':
        return <ApprovalsTab project={selectedProject} />;
      case 'changes':
        return <ChangeRequestsTab project={selectedProject} />;
      case 'profile':
        return <ProfileTab user={user} onUpdate={setUser} />;
      default:
        return <RequirementsTab project={selectedProject} onUpdate={() => { fetchProjects(); fetchNewRequirementsCount(); }} />;
    }
  };

  if (!user) return null;

  return (
    <div className="client-dashboard">
      <header className="client-topbar">
        <div className="client-topbar-inner">
          <div className="client-topbar-left">
            <button className="client-hamburger" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>
              {mobileSidebarOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
            <img src="/anax-logo.png" alt="ANAX" className="client-topbar-logo" />
          </div>
          <div className="client-topbar-center">
            <h1>Client Portal</h1>
            <span className="client-topbar-date">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div className="client-topbar-right">
            <div className="client-user-info" style={{ cursor: 'pointer', position: 'relative' }}>
              <span>{user.fullName}</span>
              <div className="client-avatar">{user.fullName?.charAt(0)}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="client-body">
        <div className={`client-sidebar-overlay ${mobileSidebarOpen ? 'show' : ''}`} onClick={() => setMobileSidebarOpen(false)} />

        <aside 
          className={`client-sidebar ${sidebarOpen ? 'open' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`}
          onMouseEnter={() => setSidebarOpen(true)}
          onMouseLeave={() => setSidebarOpen(false)}
        >
          <nav className="client-sidebar-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`client-sidebar-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => { setActiveTab(tab.id); setMobileSidebarOpen(false); }}
              >
                <div className="tab-icon-wrapper">
                  {tab.icon}
                  {(tab.badge > 0 && tab.id === 'requirements') && (
                    <span className="tab-badge requirements-badge">{tab.badge}</span>
                  )}
                  {(tab.badge > 0 && tab.id === 'proposals') && (
                    <span className="tab-badge proposals-badge">{tab.badge}</span>
                  )}
                </div>
                <span className="sidebar-label">{tab.label}</span>
              </button>
            ))}
          </nav>

          <button className="client-sidebar-logout" onClick={handleLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span className="sidebar-label-logout">Logout</span>
          </button>
        </aside>

        <main className="client-main">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }} 
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .tab-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tab-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #dc2626;
          color: white;
          font-size: 9px;
          font-weight: 700;
          min-width: 18px;
          height: 18px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 5px;
          border: 1.5px solid #1d2e2a;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .requirements-badge {
          background: #cc7722;
        }
        .proposals-badge {
          background: #059669;
        }
        @keyframes pulse-badge {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .tab-badge {
          animation: pulse-badge 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default ClientDashboard;