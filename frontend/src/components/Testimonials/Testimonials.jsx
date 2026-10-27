import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import './Testimonials.css';

const API_URL = 'http://localhost:5001/api';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(`${API_URL}/testimonials?_t=${Date.now()}`);
      const data = res.data.testimonials || [];
      setTestimonials(data);
      if (data.length > 2) setActiveIndex(2);
      else if (data.length > 0) setActiveIndex(0);
    } catch (err) { console.log('Using defaults'); }
    setLoading(false);
  };

  const paginate = useCallback((newDirection) => {
    if (testimonials.length === 0) return;
    setDirection(newDirection);
    setActiveIndex((prev) => {
      let next = prev + newDirection;
      if (next < 0) next = testimonials.length - 1;
      if (next >= testimonials.length) next = 0;
      return next;
    });
  }, [testimonials.length]);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => paginate(1), 4000);
    return () => clearInterval(timer);
  }, [paginate, testimonials.length]);

  const getCardPosition = (index) => {
    const total = testimonials.length;
    if (total === 0) return { display: 'none' };
    
    const diff = index - activeIndex;
    let normalizedDiff = diff;
    if (diff > total / 2) normalizedDiff = diff - total;
    if (diff < -total / 2) normalizedDiff = diff + total;
    
    const absDiff = Math.abs(normalizedDiff);
    const isActive = normalizedDiff === 0;
    
    if (absDiff > 2) return { display: 'none' };
    
    let translateX = 0, translateZ = 0, rotateY = 0, scale = 1, opacity = 1;
    
    if (isActive) {
      translateZ = 150; scale = 1.08;
    } else if (normalizedDiff < 0) {
      translateX = -340 * absDiff; translateZ = -80 * absDiff;
      rotateY = 35 * absDiff; opacity = 0.85 - (absDiff * 0.15); scale = 0.88 - (absDiff * 0.04);
    } else {
      translateX = 340 * absDiff; translateZ = -80 * absDiff;
      rotateY = -35 * absDiff; opacity = 0.85 - (absDiff * 0.15); scale = 0.88 - (absDiff * 0.04);
    }
    
    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity, zIndex: isActive ? 20 : 10 - absDiff,
    };
  };

  if (loading) {
    return (
      <section className="tm-section">
        <div className="tm-container" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#888' }}>Loading testimonials...</p>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <section className="tm-section">
      <div className="tm-container">
        <div className="tm-header">
          <div className="tm-tag"><span className="tm-pulse" />CLIENT STORIES</div>
          <h2 className="tm-title">Voices of <span className="tm-gold">Trust</span></h2>
          <p className="tm-subtitle">Real partners. Real results. Real impact.</p>
        </div>

        <div className="tm-carousel-wrapper">
          <div className="tm-carousel-3d">
            {testimonials.map((item, index) => {
              const isActive = index === activeIndex;
              const position = getCardPosition(index);
              
              return (
                <motion.div
                  key={item._id}
                  className={`tm-card-3d ${isActive ? 'tm-active' : ''}`}
                  initial={false}
                  animate={position}
                  transition={{ type: "spring", stiffness: 260, damping: 25, mass: 1.2 }}
                >
                  <div className="tm-card-inner">
                    <div className={`tm-avatar-wrap ${isActive ? 'tm-avatar-active' : ''}`}>
                      <img src={item.image} alt={item.name} />
                      {isActive && <motion.div className="tm-avatar-ring" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} />}
                    </div>
                    <div className="tm-quote-box">
                      <FaQuoteLeft className={`tm-quote-icon ${isActive ? 'tm-icon-active' : ''}`} />
                      <p className={`tm-quote-text ${isActive ? 'tm-text-active' : ''}`}>{item.quote}</p>
                    </div>
                    <div className={`tm-stars-row ${isActive ? 'tm-stars-active' : ''}`}>
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <motion.span key={i} initial={isActive ? { scale: 0 } : {}} animate={isActive ? { scale: 1 } : {}} transition={{ delay: 0.15 + i * 0.08 }}><FaStar /></motion.span>
                      ))}
                    </div>
                    <div className="tm-author-block">
                      <h4 className={isActive ? 'tm-name-active' : ''}>{item.name}</h4>
                      <span className={isActive ? 'tm-role-active' : ''}>{item.role}</span>
                    </div>
                    <div className={`tm-project-badge ${isActive ? 'tm-badge-active' : ''}`}>{item.project}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          <button className="tm-nav-btn tm-nav-prev" onClick={() => paginate(-1)}><FaChevronLeft /></button>
          <button className="tm-nav-btn tm-nav-next" onClick={() => paginate(1)}><FaChevronRight /></button>
        </div>

        <div className="tm-dots">
          {testimonials.map((_, index) => (
            <button key={index} className={`tm-dot ${index === activeIndex ? 'tm-dot-active' : ''}`} onClick={() => { setDirection(index > activeIndex ? 1 : -1); setActiveIndex(index); }} />
          ))}
        </div>

        <div className="tm-stats-row">
          <div className="tm-stat-box"><span className="tm-stat-num">98%</span><span className="tm-stat-label">Client Satisfaction</span></div>
          <div className="tm-stat-box"><span className="tm-stat-num">50+</span><span className="tm-stat-label">Projects Delivered</span></div>
          <div className="tm-stat-box"><span className="tm-stat-num">4.9</span><span className="tm-stat-label">Average Rating</span></div>
          <div className="tm-stat-box"><span className="tm-stat-num">3x</span><span className="tm-stat-label">Average ROI</span></div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;