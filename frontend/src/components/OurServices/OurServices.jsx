import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // ✅ 1. IMPORT ADD KIYA
import NetworkBackground from '../NetworkBackground';
import axios from 'axios';
import './OurServices.css';

const API_URL = 'http://localhost:5001/api';

const OurServices = () => {
  const [services, setServices] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hoveredService, setHoveredService] = useState(null);
  const [popupStyle, setPopupStyle] = useState({});
  const [arrowSide, setArrowSide] = useState('left');
  const hoverTimeout = useRef(null);
  const sectionRef = useRef(null);
  const popupRef = useRef(null);
  const navigate = useNavigate(); // ✅ 2. HOOK ADD KIYA

  useEffect(() => { fetchServices(); }, [page]);

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API_URL}/services?page=${page}&limit=6&_t=${Date.now()}`);
      if (page === 1) {
        setServices(res.data.services);
      } else {
        setServices(prev => [...prev, ...res.data.services]);
      }
      setHasMore(res.data.pagination.hasMore);
    } catch (err) { 
      console.log('Using defaults');
      setServices([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    setPage(1);
    fetchServices();
  }, []);

  // ✅ 3. CLICK HANDLER ADD KIYA
  const handleCardClick = (service) => {
    navigate(`/services/${service.slug || service._id}`);
  };

  const calculatePopupPosition = (cardRect, popupWidth, popupHeight) => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return {};
    
    const sectionRect = sectionEl.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const gap = 15;
    
    let left, top;
    
    // ===== HORIZONTAL =====
    if (cardRect.right + popupWidth + gap > windowWidth) {
      left = cardRect.left - popupWidth - gap;
      if (left < sectionRect.left + 10) left = sectionRect.left + 10;
    } else {
      left = cardRect.right + gap;
      if (left + popupWidth > sectionRect.right - 10) {
        left = cardRect.left - popupWidth - gap;
      }
    }
    
    // ===== VERTICAL: Center with card =====
    top = cardRect.top + (cardRect.height / 2) - (popupHeight / 2);
    
    // Section top boundary
    if (top < sectionRect.top + 10) {
      top = sectionRect.top + 10;
    }
    
    // Section bottom boundary — CRITICAL FIX
    if (top + popupHeight > sectionRect.bottom - 10) {
      top = sectionRect.bottom - popupHeight - 10;
    }
    
    // Also respect window bottom
    if (top + popupHeight > windowHeight - 10) {
      top = windowHeight - popupHeight - 10;
    }
    
    return {
      position: 'fixed',
      left: `${left}px`,
      top: `${top}px`,
      zIndex: 9999,
      maxHeight: `${Math.min(popupHeight, sectionRect.bottom - top - 10, windowHeight - top - 10)}px`,
      overflowY: 'auto',
    };
  };

  const handleMouseEnter = (service, e) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    
    const cardRect = e.currentTarget.getBoundingClientRect();
    const popupWidth = 350;
    const popupHeight = 420;
    
    const style = calculatePopupPosition(cardRect, popupWidth, popupHeight);
    
    // Determine arrow direction
    const popupLeft = parseFloat(style.left);
    const arrowDir = popupLeft > cardRect.left ? 'left' : 'right';
    
    setPopupStyle(style);
    setArrowSide(arrowDir);
    setHoveredService(service);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setHoveredService(null);
    }, 150);
  };

  const handlePopupEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
  };

  const handlePopupLeave = () => {
    setHoveredService(null);
  };

  if (loading) {
    return (
      <section className="os-section" ref={sectionRef}>
        <div className="os-container" style={{ textAlign: 'center', padding: '4rem' }}>
          <p style={{ color: '#888' }}>Loading services...</p>
        </div>
      </section>
    );
  }

  if (!loading && services.length === 0) {
    return null;
  }

  return (
    <section className="os-section" ref={sectionRef}>
      <div className="os-bg-wrapper"><NetworkBackground /></div>
      
      <div className="os-container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          className="os-header"
        >
          <div className="os-header-tag">
            <span className="os-header-dot" />OUR SERVICES
          </div>
          <h2 className="os-header-title">
            Solutions That <span className="os-header-accent">Drive Results</span>
          </h2>
          <p className="os-header-desc">Crafted with precision, delivered with excellence</p>
        </motion.div>

        <div className="os-grid">
          {services.map((service, i) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.08 }}
              className={`os-card ${hoveredService?._id === service._id ? 'os-card-active' : ''}`}
              onMouseEnter={(e) => handleMouseEnter(service, e)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleCardClick(service)} // ✅ CLICK HANDLER ADD KIYA
              style={{ cursor: 'pointer' }} // ✅ POINTER CURSOR ADD KIYA
            >
              <div className="os-card-img-wrap">
                <img src={service.image} alt={service.title} className="os-card-img" />
                <span className="os-card-number">0{i + 1}</span>
                <span className="os-card-badge">{service.subtitle || 'Service'}</span>
              </div>
              <div className="os-card-label">
                <h3 className="os-card-label-title">{service.title}</h3>
                <div className="os-card-label-line"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ===== DETAIL POPUP ===== */}
        {hoveredService && (
          <div 
            ref={popupRef}
            className={`os-detail-popup arrow-${arrowSide}`}
            style={popupStyle}
            onMouseEnter={handlePopupEnter}
            onMouseLeave={handlePopupLeave}
          >
            <div className="os-popup-content">
              <span className="os-popup-category">{hoveredService.subtitle || 'Service'}</span>
              <h3 className="os-popup-title">{hoveredService.title}</h3>
              <div className="os-popup-divider"></div>
              <p className="os-popup-desc">{hoveredService.description}</p>

              {hoveredService.features && hoveredService.features.length > 0 && (
                <div className="os-popup-features">
                  <h4 className="os-popup-features-title">Key Features</h4>
                  <ul className="os-popup-features-list">
                    {hoveredService.features.map((feat, j) => (
                      <li key={j}>
                        <span className="os-popup-check">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <a href="/contact" className="os-popup-cta">
                Learn More <span>→</span>
              </a>
            </div>
          </div>
        )}

        {hasMore && (
          <div className="os-load-more">
            <button onClick={() => setPage(p => p + 1)} disabled={loading}>
              {loading ? 'Loading...' : 'Load More Services'}
            </button>
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true }} 
          className="os-cta"
        >
          <a href="/contact" className="os-cta-btn">
            Start Your Project <span>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default OurServices;