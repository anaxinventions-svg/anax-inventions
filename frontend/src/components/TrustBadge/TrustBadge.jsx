import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './TrustBadge.css';

const trustData = [
  {
    id: 1,
    name: 'TechFlow',
    type: 'Digital Platform',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop',
    project: 'Full-stack web application with real-time analytics dashboard',
    result: 'Increased user engagement by 45%',
    icon: 'fa-solid fa-chart-line',
  },
  {
    id: 2,
    name: 'CloudNine',
    type: 'SaaS Solution',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&h=100&fit=crop',
    project: 'Cloud-based SaaS platform with multi-tenant architecture',
    result: 'Scaled to 10,000+ active users',
    icon: 'fa-solid fa-cloud',
  },
  {
    id: 3,
    name: 'DataPulse',
    type: 'Analytics Firm',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop',
    project: 'Custom analytics dashboard with real-time data visualization',
    result: 'Data processing speed improved by 60%',
    icon: 'fa-solid fa-database',
  },
  {
    id: 4,
    name: 'WebForge',
    type: 'E-Commerce',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop',
    project: 'Complete e-commerce platform with payment gateway integration',
    result: 'Sales conversion rate increased by 35%',
    icon: 'fa-solid fa-cart-shopping',
  },
  {
    id: 5,
    name: 'NextGen',
    type: 'Tech Startup',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop',
    project: 'Mobile-first web application with AI-powered features',
    result: 'Won "Best Startup App" award 2024',
    icon: 'fa-solid fa-rocket',
  },
];

const TrustBadge = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [cardPosition, setCardPosition] = useState('center');
  const itemRefs = useRef({});

  const handleMouseEnter = (id, index) => {
    setActiveCard(id);
    if (index < 2) {
      setCardPosition('right');
    } else {
      setCardPosition('left');
    }
  };

  return (
    <section className="trust-section" style={{ background: '#ffffff' }}>
      <div className="trust-top-line" />

      <div className="trust-container">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="trust-header"
        >
          <div className="trust-header-badge">
            <span className="trust-header-dot" />
            <span>TRUSTED BY INNOVATIVE TEAMS</span>
          </div>
        </motion.div>

        <div className="trust-grid">
          {trustData.map((item, i) => (
            <motion.div
              key={item.id}
              ref={(el) => (itemRefs.current[item.id] = el)}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="trust-item"
              onMouseEnter={() => handleMouseEnter(item.id, i)}
              onMouseLeave={() => setActiveCard(null)}
              onTouchStart={() => {
                if (activeCard === item.id) {
                  setActiveCard(null);
                } else {
                  handleMouseEnter(item.id, i);
                }
              }}
            >
              <div className="trust-logo-box">
                <img src={item.image} alt={item.name} className="trust-logo-img" />
                <div className="trust-logo-ring" />
              </div>

              <div className="trust-name-group">
                <p className="trust-company-name">{item.name}</p>
                <p className="trust-company-type">{item.type}</p>
              </div>

              <AnimatePresence>
                {activeCard === item.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.93 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className={`trust-hover-card trust-hover-${cardPosition}`}
                  >
                    <div className="trust-hover-content">
                      <img src={item.image} alt={item.name} className="trust-hover-img" />
                      <p className="trust-hover-project">{item.project}</p>
                      <div className="trust-hover-divider" />
                      <p className="trust-hover-result">
                        <span>✓</span> {item.result}
                      </p>
                      <div className="trust-hover-badge">
                        <i className={item.icon} /> Success Story
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="trust-bottom-text"
        >
          Join <span>20+</span> companies who trust our digital expertise
        </motion.p>
      </div>
    </section>
  );
};

export default TrustBadge;