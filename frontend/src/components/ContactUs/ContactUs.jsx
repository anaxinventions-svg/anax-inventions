import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaPaperPlane, FaArrowRight,
  FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube, FaTiktok,
  FaGlobe, FaLink, FaUser, FaBuilding, FaDollarSign, FaGlobeAsia
} from 'react-icons/fa';
import NetworkBackground from '../NetworkBackground';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ContactUs.css';

const API_URL = 'https://anax-inventions.onrender.com/api';

// ✅ Social Icon Mapping Function
const getSocialIcon = (iconName) => {
  const name = iconName?.toLowerCase().trim();
  const iconMap = {
    'whatsapp': <FaWhatsapp />,
    'email': <FaEnvelope />,
    'gmail': <FaEnvelope />,
    'mail': <FaEnvelope />,
    'envelope': <FaEnvelope />,
    'facebook': <FaFacebook />,
    'fb': <FaFacebook />,
    'instagram': <FaInstagram />,
    'insta': <FaInstagram />,
    'linkedin': <FaLinkedin />,
    'twitter': <FaTwitter />,
    'x': <FaTwitter />,
    'youtube': <FaYoutube />,
    'tiktok': <FaTiktok />,
    'website': <FaGlobe />,
    'globe': <FaGlobe />,
  };
  return iconMap[name] || <FaLink />;
};

const ContactUs = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    country: '',
    company: '',
    website: '',
    budget: '',      // ✅ Ab ye manual type hoga
    service: '', 
    message: '' 
  });
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(null);

  useEffect(() => { 
    fetchContactContent(); 
  }, []);

  const fetchContactContent = async () => {
    try {
      const res = await axios.get(`${API_URL}/contact-page`);
      console.log('✅ Contact Content Loaded:', res.data);
      setContent(res.data.content);
    } catch (err) { 
      console.log('⚠️ Using default contact content');
    }
  };

  const services = [
    'Select Service', 
    'Web Development', 
    'App Development', 
    'Software Development',
    'UI/UX Design', 
    'Digital Marketing', 
    'SEO Services',
    'E-Commerce', 
    'Graphic Design', 
    'Video Editing',
    'Customer Support', 
    'Other'
  ];

  const countries = [
    'Select Country',
    'Pakistan',
    'India',
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'UAE',
    'Saudi Arabia',
    'Germany',
    'France',
    'Other'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      Swal.fire('Error!', 'Please fill all required fields (*)', 'error'); 
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        submittedAt: new Date().toISOString(),
        source: 'Website Contact Form',
        status: 'New'
      };
      
      const res = await axios.post(`${API_URL}/contact-messages/submit`, payload);
      console.log('✅ Form Submitted:', res.data);
      
      Swal.fire({ 
        title: ' Message Sent!', 
        text: "We'll get back to you within 24 hours.", 
        icon: 'success', 
        timer: 3000, 
        showConfirmButton: false 
      });
      
      setFormData({ 
        name: '', email: '', phone: '', country: '',
        company: '', website: '', budget: '', service: '', message: '' 
      });
      
    } catch (err) { 
      console.error('❌ Submission Error:', err);
      Swal.fire('Error!', 'Something went wrong. Please try again.', 'error'); 
    }
    setLoading(false);
  };

  // Default stats
  const defaultStats = [
    { icon: '✓', value: '500+', label: 'Projects' },
    { icon: '✓', value: '150+', label: 'Clients' },
    { icon: '✓', value: '4.9/5', label: 'Rating' },
  ];
  const statsCards = content?.statsCards?.length > 0 ? content.statsCards : defaultStats;

  const contactCards = [
    {
      icon: <FaWhatsapp />,
      title: 'WhatsApp',
      details: [content?.whatsappNumber || '03116735509'],
      subtitle: content?.whatsappSubtitle || 'Fast Response • Mon-Sat, 9AM-8PM',
      link: `https://wa.me/${(content?.whatsappNumber || '03116735509').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(content?.whatsappText || 'Hello Anax Inventions!')}`,
    },
    {
      icon: <FaEnvelope />,
      title: 'Email Us',
      details: [content?.emailPrimary || 'anaxinventions@gmail.com', content?.emailSecondary || 'support@anaxinventions.com'],
      subtitle: content?.emailSubtitle || 'Response within 24 hours',
      link: `mailto:${content?.emailPrimary || 'anaxinventions@gmail.com'}?subject=${encodeURIComponent('Project Inquiry - Anax Inventions')}`,
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Visit Us',
      details: [content?.addressLine1 || 'Office #45, 3rd Floor', content?.addressLine2 || 'Gulberg III, Lahore, Pakistan'],
      subtitle: content?.addressSubtitle || 'View on Google Maps',
      link: content?.googleMapsLink || 'https://maps.google.com',
    },
  ];

  const socialLinks = content?.socialLinks?.filter(s => s.isActive) || [];

  return (
    <div className="contact-page">
      {/* ==================== HERO SECTION ==================== */}
      <section className="contact-hero">
        <div className="contact-hero-bg">
          <NetworkBackground />
        </div>
        <div className="contact-hero-overlay" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }} 
          className="contact-hero-content"
        >
          <span className="contact-hero-tag">
            {content?.heroTag || 'GET IN TOUCH'}
          </span>
          <h1 className="contact-hero-title">
            {content?.heroTitle || "Let's Build Something"}{' '}
            <span className="contact-hero-accent">Amazing</span>
          </h1>
          <p className="contact-hero-desc">
            {content?.heroDescription || 'Have a project in mind? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.'}
          </p>
          <div className="contact-hero-badges">
            {statsCards.map((stat, i) => (
              <span key={i}>{stat.icon} {stat.value} {stat.label}</span>
            ))}
          </div>
        </motion.div>
        <div className="contact-hero-wave">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,30 1440,60 L1440,120 L0,120 Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* ==================== MAIN SECTION ==================== */}
      <section className="contact-main">
        <div className="contact-container">
          <div className="contact-grid">
            
            {/* LEFT SIDE - INFO */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              className="contact-info-side"
            >
              <div className="contact-info-header">
                <span className="contact-section-tag">CONTACT</span>
                <h2>Reach Out to Us</h2>
                <p>Choose your preferred way to connect with our team</p>
              </div>

              <div className="contact-cards">
                {contactCards.map((card, i) => (
                  <motion.a 
                    key={i} 
                    href={card.link} 
                    target={card.link.startsWith('http') ? '_blank' : '_self'} 
                    rel="noopener noreferrer" 
                    initial={{ opacity: 0, y: 15 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ delay: i * 0.12 }} 
                    className="contact-info-card" 
                    style={{ textDecoration: 'none', cursor: 'pointer' }}
                  >
                    <div className="contact-card-icon-wrap">
                      <span className="contact-card-icon">{card.icon}</span>
                    </div>
                    <div className="contact-card-content">
                      <h3>{card.title}</h3>
                      {card.details.map((detail, j) => (
                        <p key={j}>{detail}</p>
                      ))}
                      <span className="contact-card-sub">{card.subtitle}</span>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* SOCIAL LINKS */}
              <div className="contact-social">
                <h4>Follow Us</h4>
                <div className="contact-social-icons">
                  {socialLinks.length > 0 ? (
                    socialLinks.map((s, i) => (
                      <a 
                        key={i} 
                        href={s.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="social-link"
                        title={s.name || s.platform || 'Social Link'}
                        aria-label={s.name || s.platform || 'Social Link'}
                      >
                        {getSocialIcon(s.icon || s.platform)}
                      </a>
                    ))
                  ) : (
                    <>
                      <a href="https://wa.me/923116735509?text=Hello%20Anax%20Inventions!" target="_blank" rel="noopener noreferrer" className="social-link" title="WhatsApp"><FaWhatsapp /></a>
                      <a href="mailto:anaxinventions@gmail.com" className="social-link" title="Email"><FaEnvelope /></a>
                      <a href="#" className="social-link" title="LinkedIn"><FaLinkedin /></a>
                      <a href="#" className="social-link" title="Instagram"><FaInstagram /></a>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* ==================== RIGHT SIDE - FORM ==================== */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              className="contact-form-side"
            >
              <div className="contact-form-wrapper">
                <div className="contact-form-header">
                  <span className="contact-section-tag">SEND MESSAGE</span>
                  <h2>Start Your Project</h2>
                  <p>Fill the form below and we'll respond within 24 hours</p>
                </div>
                
                <form onSubmit={handleSubmit} className="contact-form">
                  
                  {/* Row 1: Name + Email */}
                  <div className="form-row">
                    <div className="form-group">
                      <label><FaUser className="field-icon" /> Full Name *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required />
                    </div>
                    <div className="form-group">
                      <label><FaEnvelope className="field-icon" /> Email Address *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Active E-mail" required />
                    </div>
                  </div>

                  {/* Row 2: Phone + Country */}
                  <div className="form-row">
                    <div className="form-group">
                      <label><FaWhatsapp className="field-icon" /> Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+92 311 6735509" />
                    </div>
                    <div className="form-group">
                      <label><FaGlobeAsia className="field-icon" /> Country</label>
                      <select name="country" value={formData.country} onChange={handleChange}>
                        {countries.map((c, i) => (
                          <option key={i} value={i === 0 ? '' : c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Company + Website */}
                  <div className="form-row">
                    <div className="form-group">
                      <label><FaBuilding className="field-icon" /> Company Name</label>
                      <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Your Company Ltd." />
                    </div>
                    <div className="form-group">
                      <label><FaGlobe className="field-icon" /> Website URL</label>
                      <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://yourcompany.com" />
                    </div>
                  </div>

                  {/* Row 4: Budget (Manual Type ✅) + Service */}
                  <div className="form-row">
                    <div className="form-group">
                      <label><FaDollarSign className="field-icon" /> Budget</label>
                      {/* ✅✅✅ MANUAL TYPE INPUT - KHUD LIKH SAKTA HAI ✅✅✅ */}
                      <input 
                        type="text" 
                        name="budget" 
                        value={formData.budget} 
                        onChange={handleChange} 
                        placeholder="Budget" 
                      />
                      <small style={{ fontSize: '0.65rem', color: '#999', marginTop: '2px' }}>
                        Enter your budget range or amount
                      </small>
                    </div>
                    <div className="form-group">
                      <label>Service Interested In</label>
                      <select name="service" value={formData.service} onChange={handleChange}>
                        {services.map((s, i) => (
                          <option key={i} value={i === 0 ? '' : s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="form-group full">
                    <label>Your Message *</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Tell us about your project, requirements, timeline..." rows="5" required />
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="contact-submit-btn" disabled={loading}>
                    {loading ? (
                      'Sending...'
                    ) : (
                      <>
                        <span>Send Message</span>
                        <FaPaperPlane className="submit-icon" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== CTA BANNER ==================== */}
      <section className="contact-cta-banner">
        <div className="contact-container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="contact-cta-inner"
          >
            <div className="contact-cta-text">
              <h2>{content?.ctaTitle || 'Ready to Start Your Project?'}</h2>
              <p>{content?.ctaText || 'Chat with us on WhatsApp — we respond within 1 hour'}</p>
            </div>
            <a 
              href={`https://wa.me/${(content?.ctaWhatsappNumber || '923116735509').replace(/[^0-9]/g, '')}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="contact-cta-btn"
            >
              <FaWhatsapp /> Chat on WhatsApp <FaArrowRight />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;