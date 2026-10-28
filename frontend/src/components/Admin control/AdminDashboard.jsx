import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UsersList from './tabs/Users/UsersList';
import HeroEditor from './tabs/HomePage/HeroEditor';
import ServicesEditor from './tabs/HomePage/ServicesEditor';
import PageEditor from './tabs/HomePage/PageEditor'; // ✅ NEW: Page Editor
import BannerServicesEditor from './tabs/HomePage/BannerServicesEditor';
import ProjectsEditor from './tabs/HomePage/ProjectsEditor';
import TestimonialsEditor from './tabs/HomePage/TestimonialsEditor';
import FooterEditor from './tabs/HomePage/FooterEditor';
import ContactEditor from './tabs/HomePage/ContactEditor';
import ContactMessages from './tabs/Messages/ContactMessages';
import SettingsPanel from './tabs/Settings/SettingsPanel';
import ClientsManager from './tabs/Clients/ClientsManager';
import ProjectsManager from './tabs/Projects/ProjectsManager';
import RequirementsManager from './tabs/Requirements/RequirementsManager';
import ProposalsManager from './tabs/Proposals/ProposalsManager';
import axios from 'axios';
import './AdminDashboard.css';

const API_URL = 'https://anax-inventions.onrender.com/api';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('clients');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [homeDropdownOpen, setHomeDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [newRequirementsCount, setNewRequirementsCount] = useState(0);
  const [newProposalsCount, setNewProposalsCount] = useState(0);
  const [proposalPrefillData, setProposalPrefillData] = useState(null);
  
  // ✅ NEW: Selected page for PageEditor
  const [selectedPageSlug, setSelectedPageSlug] = useState('web-development');
  const [selectedPageName, setSelectedPageName] = useState('Web Development');

  // ✅ Pages list for dropdown
  const pagesList = [
    { slug: 'web-development', name: 'Web Development' },
    { slug: 'ui-ux-design', name: 'UI/UX Design' },
    { slug: 'graphics-design', name: 'Graphics Design' },
    { slug: 'logo-design', name: 'Logo Design' },
    { slug: 'motion-graphics', name: 'Motion Graphics' },
    { slug: 'brand-identity', name: 'Brand Identity' },
    { slug: 'seo-services', name: 'SEO Services' },
    { slug: 'ppc-services', name: 'PPC Services' },
    { slug: 'smm-services', name: 'Social Media Marketing' },
    { slug: 'content-marketing', name: 'Content Marketing' },
    { slug: 'email-marketing', name: 'Email Marketing' },
    { slug: 'software-development', name: 'Software Development' },
    { slug: 'mobile-app-development', name: 'Mobile App Development' },
    { slug: 'ecommerce-solutions', name: 'E-Commerce Solutions' },
    { slug: 'ai-solutions', name: 'AI Solutions' },
  ];

  useEffect(() => { 
    const d = localStorage.getItem('user'); 
    if (d) setUser(JSON.parse(d)); 
    fetchNewMessagesCount();
    fetchNewRequirementsCount();
    fetchNewProposalsCount();
    const interval = setInterval(() => {
      fetchNewMessagesCount();
      fetchNewRequirementsCount();
      fetchNewProposalsCount();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNewMessagesCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get(`${API_URL}/contact-messages?status=New&limit=1`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewMessagesCount(res.data.pagination?.total || res.data.stats?.new || 0);
    } catch (err) { /* Silently fail */ }
  };

  const fetchNewRequirementsCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get(`${API_URL}/admin/requirements`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newCount = res.data.requirements?.filter(r => r.status === 'submitted').length || 0;
      setNewRequirementsCount(newCount);
    } catch (err) { /* Silently fail */ }
  };

  const fetchNewProposalsCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get(`${API_URL}/admin/proposals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newCount = res.data.proposals?.filter(p => p.status === 'draft').length || 0;
      setNewProposalsCount(newCount);
    } catch (err) { /* Silently fail */ }
  };

  useEffect(() => {
    const handleProfileUpdate = () => {
      const d = localStorage.getItem('user');
      if (d) setUser(JSON.parse(d));
    };
    window.addEventListener('profileUpdate', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdate', handleProfileUpdate);
  }, []);

  useEffect(() => {
    const handleClick = () => setProfileDropdownOpen(false);
    if (profileDropdownOpen) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [profileDropdownOpen]);

  // ✅ UPDATED homeSubTabs with Page Editor
  const homeSubTabs = [
    { id: 'hero-editor', label: 'Hero Section' },
    { id: 'services-editor', label: 'Services' },
    { id: 'page-editor', label: 'Page Editor' }, // ✅ NEW
    { id: 'banner-editor', label: 'Banner Services' },
    { id: 'projects-editor', label: 'Our Work' },
    { id: 'testimonials-editor', label: 'Testimonials' },
    { id: 'contact-editor', label: 'Contact Page' },
    { id: 'footer-editor', label: 'Footer' },
  ];

  if (!user) return null;

  const openProposalsTabWithData = (requirementData) => {
    setProposalPrefillData(requirementData);
    setActiveTab('proposals');
    setHomeDropdownOpen(false);
  };

  const handlePageChange = (e) => {
    const slug = e.target.value;
    const page = pagesList.find(p => p.slug === slug);
    setSelectedPageSlug(slug);
    setSelectedPageName(page?.name || 'Page');
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'requirements': return <RequirementsManager 
        onUpdate={fetchNewRequirementsCount} 
        onOpenProposalsTab={openProposalsTabWithData}
      />;
      
      case 'proposals': return <ProposalsManager 
        onUpdate={fetchNewProposalsCount} 
        prefillData={proposalPrefillData}
        onClearPrefill={() => setProposalPrefillData(null)}
      />;
      
      case 'clients': return <ClientsManager />;
      case 'projects': return <ProjectsManager />;
      case 'users': return <UsersList />;
      
      // Home Page Editors
      case 'hero-editor': return <HeroEditor />;
      case 'services-editor': return <ServicesEditor />;
      case 'page-editor': return (
        <div className="page-editor-container">
          <div className="page-selector">
            <label>Select Page to Edit:</label>
            <select value={selectedPageSlug} onChange={handlePageChange}>
              {pagesList.map(page => (
                <option key={page.slug} value={page.slug}>{page.name}</option>
              ))}
            </select>
          </div>
          <PageEditor pageSlug={selectedPageSlug} pageName={selectedPageName} />
        </div>
      );
      case 'banner-editor': return <BannerServicesEditor />;
      case 'projects-editor': return <ProjectsEditor />;
      case 'testimonials-editor': return <TestimonialsEditor />;
      case 'contact-editor': return <ContactEditor />;
      case 'footer-editor': return <FooterEditor />;
      
      case 'messages': return <ContactMessages />;
      case 'settings': return <SettingsPanel />;
      
      default: return <div className="admin-placeholder"><span>🚧</span><h3>Coming Soon</h3></div>;
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
    if (tab === 'messages') {
      setNewMessagesCount(0);
    }
    if (tab === 'requirements') {
      setNewRequirementsCount(0);
    }
    if (tab === 'proposals') {
      setNewProposalsCount(0);
      setProposalPrefillData(null);
    }
  };

  const toggleHomeDropdown = () => {
    setHomeDropdownOpen(!homeDropdownOpen);
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <div className="admin-topbar-left">
            <button className="admin-hamburger" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} aria-label="Toggle menu">
              {mobileSidebarOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              )}
            </button>
            <img src="/anax-logo.png" alt="ANAX" className="admin-topbar-logo" />
          </div>
          <div className="admin-topbar-center"><h1>CEO Dashboard</h1><span className="admin-topbar-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span></div>
          
          <div className="admin-topbar-right">
            <div className="admin-user-info" onClick={(e) => { e.stopPropagation(); setProfileDropdownOpen(!profileDropdownOpen); }} style={{ cursor: 'pointer', position: 'relative' }}>
              <span>{user.fullName}</span>
              <div className="admin-avatar">{user.avatar ? <img src={user.avatar} alt={user.fullName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : user.fullName?.charAt(0)}</div>
              {profileDropdownOpen && (
                <div className="admin-profile-dropdown" onClick={(e) => e.stopPropagation()}>
                  <div className="apd-header"><div className="apd-avatar">{user.avatar ? <img src={user.avatar} alt={user.fullName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : user.fullName?.charAt(0)}</div><div><strong>{user.fullName}</strong><span>{user.email}</span></div></div>
                  <div className="apd-divider" />
                  <button onClick={() => { setActiveTab('settings'); setProfileDropdownOpen(false); }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> Settings</button>
                  <button onClick={() => { localStorage.clear(); window.location.href = '/'; }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="admin-body">
        <div className={`admin-sidebar-overlay ${mobileSidebarOpen ? 'show' : ''}`} onClick={() => setMobileSidebarOpen(false)} />
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`} onMouseEnter={() => setSidebarOpen(true)} onMouseLeave={() => { setSidebarOpen(false); setHomeDropdownOpen(false); }}>
          <nav className="admin-sidebar-nav">
            <button className={`admin-sidebar-item ${activeTab === 'proposals' ? 'active' : ''}`} onClick={() => handleTabClick('proposals')} style={{ position: 'relative' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              <span className="sidebar-label">Proposals</span>
              {newProposalsCount > 0 && <span className="sidebar-badge proposals-badge">{newProposalsCount}</span>}
            </button>

            <button className={`admin-sidebar-item ${activeTab === 'requirements' ? 'active' : ''}`} onClick={() => handleTabClick('requirements')} style={{ position: 'relative' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              <span className="sidebar-label">Requirements</span>
              {newRequirementsCount > 0 && <span className="sidebar-badge requirements-badge">{newRequirementsCount}</span>}
            </button>

            <button className={`admin-sidebar-item ${activeTab === 'clients' ? 'active' : ''}`} onClick={() => handleTabClick('clients')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span className="sidebar-label">Clients</span>
            </button>

            <button className={`admin-sidebar-item ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => handleTabClick('projects')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span className="sidebar-label">Projects</span>
            </button>

            {/* Home Page Dropdown */}
            <div className="admin-sidebar-group">
              <button className={`admin-sidebar-item ${['hero-editor','services-editor','page-editor','banner-editor','projects-editor','testimonials-editor','contact-editor','footer-editor'].includes(activeTab) ? 'active' : ''}`} onClick={toggleHomeDropdown}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <span className="sidebar-label">Home Page</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 'auto', transform: homeDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div className={`admin-sidebar-dropdown ${homeDropdownOpen ? 'open' : ''}`}>
                {homeSubTabs.map(sub => (
                  <button key={sub.id} className={`admin-sidebar-subitem ${activeTab === sub.id ? 'active' : ''}`} onClick={() => handleTabClick(sub.id)}>
                    <span className="subitem-dot" /><span className="sidebar-label">{sub.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button className={`admin-sidebar-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => handleTabClick('users')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span className="sidebar-label">Users</span>
            </button>
            
            <button className={`admin-sidebar-item ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => handleTabClick('messages')} style={{ position: 'relative' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <span className="sidebar-label">Messages</span>
              {newMessagesCount > 0 && <span className="sidebar-badge">{newMessagesCount}</span>}
            </button>

            <button className={`admin-sidebar-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => handleTabClick('settings')} style={{ marginTop: 'auto' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              <span className="sidebar-label">Settings</span>
            </button>
          </nav>
        </aside>

        <main className="admin-main">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {renderTab()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;