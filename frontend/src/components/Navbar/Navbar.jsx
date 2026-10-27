// Navbar.jsx - Final Premium with Dynamic Categories
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

const logo = '/anax-logo.png';
const API_URL = 'http://localhost:5001/api';

const Navbar = ({ onOpenLogin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]); // ✅ Dynamic categories
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState(null);
  const [loadingServices, setLoadingServices] = useState(true);
  const menuButtonRef = useRef(null);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const dropdownTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback categories if API fails
        setCategories([
          { key: 'development', name: 'DEVELOPMENT', icon: 'fa-laptop-code', isActive: true },
          { key: 'ai-solutions', name: 'AI SOLUTIONS', icon: 'fa-microchip', isActive: true },
          { key: 'marketing', name: 'MARKETING', icon: 'fa-chart-line', isActive: true },
          { key: 'design', name: 'DESIGN', icon: 'fa-palette', isActive: true },
          { key: 'consulting', name: 'CONSULTING', icon: 'fa-headset', isActive: true },
        ]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        const response = await axios.get(`${API_URL}/services?page=1&limit=100&_t=${Date.now()}`);
        
        let allServices = [];
        if (response.data && response.data.services && response.data.services.length > 0) {
          allServices = response.data.services;
        } else if (response.data && Array.isArray(response.data)) {
          allServices = response.data;
        }
        
        const processedServices = allServices.map(service => ({
          ...service,
          icon: service.icon || getFallbackIcon(service.title),
          slug: service.slug || service._id,
          isActive: service.isActive !== false
        }));
        
        const activeServices = processedServices.filter(s => s.isActive);
        setServices(activeServices);
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  const getFallbackIcon = (title) => {
    const t = (title || '').toLowerCase();
    if (t.includes('web')) return 'fa-globe';
    if (t.includes('mobile') || t.includes('app')) return 'fa-mobile-alt';
    if (t.includes('software')) return 'fa-code';
    if (t.includes('ecommerce')) return 'fa-cart-shopping';
    if (t.includes('cloud')) return 'fa-cloud';
    if (t.includes('ai')) return 'fa-brain';
    if (t.includes('chatbot')) return 'fa-robot';
    if (t.includes('seo')) return 'fa-magnifying-glass-chart';
    if (t.includes('marketing')) return 'fa-chart-line';
    if (t.includes('design') || t.includes('ui')) return 'fa-pen-ruler';
    if (t.includes('graphic')) return 'fa-paintbrush';
    if (t.includes('consulting')) return 'fa-chalkboard-user';
    return 'fa-cube';
  };

  // ✅ Group services by dynamic categories
  const categoriesWithServices = categories
    .filter(cat => cat.isActive !== false)
    .map(cat => ({
      key: cat.key,
      title: cat.name,
      icon: cat.icon || 'fa-folder',
      services: services.filter(s => s.category === cat.key)
    }))
    .filter(cat => cat.services.length > 0);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth > 1150) setIsMobileMenuOpen(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setShowAuth(false);
        setOpenDropdown(null);
        setMobileOpenDropdown(null);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services', hasDropdown: true },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'About', path: '/about' },
    { name: 'Resources', path: '/resources' },
    { name: 'Contact', path: '/contact' },
  ];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobileOpenDropdown(null);
  };
  
  const handleNavClick = (path) => {
    setOpenDropdown(null);
    closeMobileMenu();
    navigate(path);
    window.scrollTo(0, 0);
  };
  
  const handleOpenAuth = () => {
    closeMobileMenu();
    onOpenLogin ? onOpenLogin() : setShowAuth(true);
  };
  
  const handleMouseEnter = (dropdownName) => {
    if (window.innerWidth > 1150) {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
      setOpenDropdown(dropdownName);
    }
  };
  
  const handleMouseLeave = () => {
    if (window.innerWidth > 1150) {
      hideTimeoutRef.current = setTimeout(() => {
        setOpenDropdown(null);
      }, 100);
    }
  };

  const handleMobileDropdownToggle = (dropdownName) => {
    setMobileOpenDropdown(mobileOpenDropdown === dropdownName ? null : dropdownName);
  };

  return (
    <>
      <nav className={`anax-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <Link to="/" className="logo-link" onClick={() => setOpenDropdown(null)}>
              <img src={logo} alt="Anax Inventions" />
              <span className="logo-text">ANAX INVENTIONS</span>
            </Link>
          </div>

          <div className="desktop-nav">
            <ul className="desktop-links">
              {navLinks.map((link) => (
                <li 
                  key={link.name}
                  className={`nav-item ${link.hasDropdown ? 'has-dropdown' : ''}`}
                  onMouseEnter={() => link.hasDropdown && handleMouseEnter(link.name)}
                  onMouseLeave={link.hasDropdown ? handleMouseLeave : undefined}
                >
                  <Link to={link.path} onClick={() => setOpenDropdown(null)}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="desktop-cta">
            <button className="nav-login-btn" onClick={handleOpenAuth}>
              <i className="fas fa-user-circle"></i>
              <span>Client Login</span>
            </button>
            <Link to="/contact" className="cta-button" onClick={() => setOpenDropdown(null)}>
              <span>Get In Touch</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>

          <button 
            ref={menuButtonRef}
            className="mobile-menu-toggle" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
              <span></span><span></span><span></span>
            </span>
          </button>
        </div>
      </nav>

      {/* Desktop Dropdown - With Discount Card & Dynamic Categories */}
      {window.innerWidth > 1150 && openDropdown === 'Services' && (
        <div 
          className="fullwidth-dropdown"
          onMouseEnter={() => handleMouseEnter('Services')}
          onMouseLeave={handleMouseLeave}
        >
          <div className="fullwidth-dropdown-container">
            <div className="fullwidth-dropdown-inner">
              {loadingServices ? (
                <div className="dropdown-loading"><i className="fas fa-spinner fa-spin"></i> Loading...</div>
              ) : categoriesWithServices.length === 0 ? (
                <div className="dropdown-empty"><p>No services available</p></div>
              ) : (
                <div className="dropdown-sections five-columns">
                  {categoriesWithServices.map((category) => (
                    <div key={category.key} className="dropdown-section">
                      <h3 className="dropdown-section-title">
                        <i className={`fas ${category.icon} section-icon`}></i>
                        {category.title}
                      </h3>
                      <div className="dropdown-items-list">
                        {category.services.map((service) => (
                          <Link 
                            key={service._id} 
                            to={`/services/${service.slug}`} 
                            className="dropdown-item"
                            onClick={() => setOpenDropdown(null)}
                          >
                            <div className="dropdown-item-icon">
                              <i className={`fas ${service.icon || 'fa-cube'}`}></i>
                            </div>
                            <span className="dropdown-item-name">{service.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* PREMIUM 30% DISCOUNT CARD */}
                  <div className="dropdown-section offer-section">
                    <div className="offer-card">
                      <div className="offer-badge">
                        <span className="offer-badge-text">LIMITED TIME</span>
                      </div>
                      <div className="offer-discount">
                        <span className="discount-percent">30%</span>
                        <span className="discount-off">OFF</span>
                      </div>
                      <h4 className="offer-title">Special Launch Discount</h4>
                      <p className="offer-desc">Get 30% off on all development services. Limited slots available!</p>
                      <div className="offer-timer">
                        <div className="timer-item"><span className="timer-number">12</span><span className="timer-label">Days</span></div>
                        <div className="timer-item"><span className="timer-number">08</span><span className="timer-label">Hours</span></div>
                        <div className="timer-item"><span className="timer-number">45</span><span className="timer-label">Mins</span></div>
                      </div>
                      <Link to="/contact" className="offer-button" onClick={() => setOpenDropdown(null)}>
                        CLAIM OFFER <i className="fas fa-gift"></i>
                      </Link>
                      <p className="offer-terms">*Terms & conditions apply</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar */}
      <div ref={sidebarRef} className={`mobile-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-sidebar-overlay" onClick={closeMobileMenu}></div>
        <div className="mobile-sidebar-content">
          <ul className="sidebar-list">
            {navLinks.map((link) => (
              <li key={link.name} className="mobile-nav-item">
                {link.hasDropdown ? (
                  <>
                    <button className="sidebar-link-btn mobile-dropdown-toggle" onClick={() => handleMobileDropdownToggle(link.name)}>
                      <span>{link.name}</span>
                      <i className={`fas fa-chevron-${mobileOpenDropdown === link.name ? 'up' : 'down'}`}></i>
                    </button>
                    {mobileOpenDropdown === link.name && (
                      <div className="mobile-submenu">
                        <div className="mobile-services-submenu">
                          {categoriesWithServices.map((category) => (
                            <div key={category.key} className="mobile-submenu-section">
                              <h4><i className={`fas ${category.icon}`}></i> {category.title}</h4>
                              {category.services.map((service) => (
                                <button key={service._id} onClick={() => handleNavClick(`/services/${service.slug}`)} className="mobile-submenu-item">
                                  <i className={`fas ${service.icon || 'fa-cube'}`}></i>
                                  {service.title}
                                </button>
                              ))}
                            </div>
                          ))}
                          {/* Mobile Offer Card */}
                          <div className="mobile-offer-card">
                            <div className="mobile-offer-badge">LIMITED TIME</div>
                            <div className="mobile-offer-discount">30% OFF</div>
                            <p className="mobile-offer-desc">on all development services</p>
                            <button onClick={() => handleNavClick('/contact')} className="mobile-offer-button">
                              CLAIM OFFER <i className="fas fa-gift"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <button className="sidebar-link-btn" onClick={() => handleNavClick(link.path)}>
                    {link.name}
                  </button>
                )}
              </li>
            ))}
            <li className="sidebar-cta-li">
              <button className="sidebar-login-btn" onClick={handleOpenAuth}>
                <i className="fas fa-user-circle"></i> Login
              </button>
            </li>
            <li className="sidebar-cta-li">
              <button className="sidebar-cta" onClick={() => handleNavClick('/contact')}>
                Get In Touch
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;