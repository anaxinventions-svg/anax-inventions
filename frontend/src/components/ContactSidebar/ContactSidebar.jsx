import React, { useState } from 'react';
import './ContactSidebar.css';

const socialLinks = [
  { id: 1, name: 'WhatsApp', icon: 'fab fa-whatsapp', url: 'https://wa.me/923001234567' },
  { id: 2, name: 'Instagram', icon: 'fab fa-instagram', url: 'https://instagram.com/anaxinventions' },
  { id: 3, name: 'Facebook', icon: 'fab fa-facebook-f', url: 'https://facebook.com/anaxinventions' },
  { id: 4, name: 'Twitter / X', icon: 'fab fa-x-twitter', url: 'https://twitter.com/anaxinventions' },
  { id: 5, name: 'LinkedIn', icon: 'fab fa-linkedin-in', url: 'https://linkedin.com/company/anaxinventions' },
  { id: 6, name: 'Email', icon: 'fas fa-envelope', url: 'mailto:hello@anaxinventions.com' },
];

const ContactSidebar = ({ isDarkSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* DESKTOP - LEFT SIDE BAR */}
      <div className={`social-bar-desktop ${isDarkSection ? 'dark-mode' : 'light-mode'}`}>
        {socialLinks.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-desktop"
            title={social.name}
            aria-label={social.name}
          >
            <i className={social.icon}></i>
          </a>
        ))}
      </div>

      {/* MOBILE - TOGGLE BUTTON */}
      <button 
        className={`social-mobile-toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Social links"
      >
        <i className="fas fa-share-nodes"></i>
      </button>

      {/* MOBILE - SLIDE-UP PANEL */}
      <div className={`social-mobile-panel ${isOpen ? 'open' : ''}`}>
        <div className="social-mobile-panel-inner">
          {socialLinks.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-mobile"
              title={social.name}
              aria-label={social.name}
              onClick={() => setIsOpen(false)}
            >
              <i className={social.icon}></i>
            </a>
          ))}
        </div>
        <button className="social-mobile-close" onClick={() => setIsOpen(false)}>
          <i className="fas fa-xmark"></i>
        </button>
      </div>

      {isOpen && <div className="social-mobile-overlay" onClick={() => setIsOpen(false)}></div>}
    </>
  );
};

export default ContactSidebar;