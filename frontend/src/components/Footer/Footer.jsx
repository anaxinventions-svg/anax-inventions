import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
import './Footer.css';

const API_URL = 'http://localhost:5001/api';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const res = await axios.get(`${API_URL}/footer`);
      setFooterData(res.data.content);
    } catch (err) { console.log('Using default footer'); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  const socialLinks = footerData?.socialLinks || [
    { platform: 'WhatsApp', icon: 'whatsapp', url: 'https://wa.me/923001234567' },
    { platform: 'Instagram', icon: 'instagram', url: 'https://instagram.com/anaxinventions' },
    { platform: 'Facebook', icon: 'facebook', url: 'https://facebook.com/anaxinventions' },
    { platform: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com/company/anaxinventions' },
    { platform: 'Twitter', icon: 'twitter', url: 'https://twitter.com/anaxinventions' },
  ];

  const linkSections = footerData?.linkSections || [
    { title: 'Services', links: [{ name: 'Web Development', path: '/services' }, { name: 'UI/UX Design', path: '/services' }, { name: 'E-Commerce', path: '/services' }] },
    { title: 'Company', links: [{ name: 'About Us', path: '/about' }, { name: 'Portfolio', path: '/portfolio' }, { name: 'Contact', path: '/contact' }] },
    { title: 'Resources', links: [{ name: 'FAQ', path: '/faq' }, { name: 'Privacy', path: '/privacy' }, { name: 'Terms', path: '/terms' }] },
  ];

  const bottomLinks = footerData?.bottomLinks || [
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Cookies', path: '/cookies' },
  ];

  // Secret admin login handler
  const handleAdminLogin = () => {
    window.dispatchEvent(new CustomEvent('openAdminLogin'));
  };

  return (
    <footer className="footer">
      <div className="footer-top-line" />
      <div className="footer-main">
        <div className="footer-container">
          
          <div className="footer-col-brand">
            <div className="footer-logo">
              <img src="/anax-logo.png" alt={footerData?.copyright || 'Anax Inventions'} />
            </div>
            <p className="footer-desc">{footerData?.description || 'Transforming ideas into digital reality.'}</p>
            
            <div className="footer-contact">
              {footerData?.address && (
                <div className="footer-contact-item"><FaMapMarkerAlt /><span>{footerData.address}</span></div>
              )}
              {footerData?.phone && (
                <div className="footer-contact-item"><FaPhone /><span>{footerData.phone}</span></div>
              )}
              {footerData?.email && (
                <div className="footer-contact-item"><FaEnvelope /><span>{footerData.email}</span></div>
              )}
            </div>

            <div className="footer-social">
              {socialLinks.filter(s => s.isActive !== false).map((social, index) => (
                <a key={index} href={social.url} target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label={social.platform}>
                  <i className={`fab fa-${social.icon}`} />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col-links">
            <div className="footer-links-grid">
              {linkSections.map((section, si) => (
                <div key={si} className="footer-link-group">
                  <h4 className="footer-link-title">{section.title}</h4>
                  <ul className="footer-link-list">
                    {section.links.filter(l => l.isActive !== false).map((link, li) => (
                      <li key={li}><a href={link.path}>{link.name}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="footer-col-form">
            <div className="footer-form-card">
              <h3 className="footer-form-title">Get In <span>Touch</span></h3>
              <p className="footer-form-subtitle">Have a project? Let's discuss.</p>
              {isSubmitted ? (
                <div className="footer-success">
                  <div className="footer-success-icon">✓</div>
                  <h4>Message Sent!</h4>
                  <p>We'll get back to you soon.</p>
                </div>
              ) : (
                <form className="footer-form" onSubmit={handleSubmit}>
                  <div className="footer-input-group"><input type="text" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="footer-input" required /></div>
                  <div className="footer-input-group"><input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="footer-input" required /></div>
                  <div className="footer-input-group"><textarea placeholder="Tell us about your project..." value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="footer-textarea" rows="3" required></textarea></div>
                  <button type="submit" className="footer-submit-btn"><span>Send Message</span><FaPaperPlane /></button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>© {currentYear} <span>{footerData?.copyright || 'Anax Inventions'}</span>. All rights reserved.</p>
          <div className="footer-bottom-links">
            {bottomLinks.map((link, i) => (
              <span key={i}>
                <a href={link.path}>{link.name}</a>
                {i < bottomLinks.length - 1 && <span>|</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 🔐 SECRET ADMIN BUTTON */}
      <div className="footer-secret-admin" style={{ 
        position: 'fixed', 
        bottom: '5px', 
        right: '5px', 
        zIndex: 999 
      }}>
        <button 
          onClick={handleAdminLogin}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '10px',
            color: '#999',
            cursor: 'pointer',
            padding: '4px 6px',
            opacity: 0.3,
            transition: 'opacity 0.3s',
            borderRadius: '4px',
          }}
          onMouseEnter={(e) => e.target.style.opacity = '1'}
          onMouseLeave={(e) => e.target.style.opacity = '0.3'}
          title="Admin Access"
        >
          🔐
        </button>
      </div>
    </footer>
  );
};

export default Footer;