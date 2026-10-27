import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import './WhyChooseUs.css';

const features = [
  {
    id: 1,
    icon: '⚡',
    title: 'Lightning Fast Delivery',
    desc: 'We deliver projects 40% faster than industry standard without compromising quality.',
    stat: '40%',
    statLabel: 'Faster Delivery',
  },
  {
    id: 2,
    icon: '🎯',
    title: 'Precision Engineering',
    desc: 'Every pixel, every line of code is crafted with surgical precision.',
    stat: '99.9%',
    statLabel: 'Uptime Guarantee',
  },
  {
    id: 3,
    icon: '🛡️',
    title: 'Enterprise Security',
    desc: 'Bank-grade security protocols with end-to-end encryption.',
    stat: '256-bit',
    statLabel: 'Encryption',
  },
  {
    id: 4,
    icon: '🚀',
    title: 'Scalable Architecture',
    desc: 'Built to grow with you. Our solutions handle 10x traffic spikes.',
    stat: '10x',
    statLabel: 'Scale Capacity',
  }
];

const stats = [
  { value: 150, suffix: '+', label: 'Projects Delivered' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
  { value: 12, suffix: '+', label: 'Years Experience' },
  { value: 24, suffix: '/7', label: 'Support Available' }
];

const Counter = ({ value, suffix }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    if (isInView) {
      const animation = animate(count, value, { duration: 2.5, ease: "easeOut" });
      return animation.stop;
    }
  }, [isInView, value, count]);

  return (
    <span ref={ref} className="wcu-stat-number">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
};

const WhyChooseUs = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="wcu-section">
      <div className="wcu-bg-grid" />

      <div className="wcu-container">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="wcu-header"
        >
          <div className="wcu-header-tag">
            <span className="wcu-header-dot" />
            WHY CHOOSE US
          </div>
          <h2 className="wcu-header-title">
            The <span className="wcu-header-accent">Anax</span> Advantage
          </h2>
          <p className="wcu-header-desc">
            We don't just build websites. We engineer digital experiences that convert visitors into loyal customers.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="wcu-stats-row"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="wcu-stat-item"
            >
              <Counter value={stat.value} suffix={stat.suffix} />
              <span className="wcu-stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="wcu-features-grid">
          {features.map((feature, i) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 + i * 0.15 }}
              className={`wcu-feature-card ${hoveredCard === feature.id ? 'wcu-card-active' : ''}`}
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="wcu-card-icon">
                <span>{feature.icon}</span>
              </div>

              <h3 className="wcu-card-title">{feature.title}</h3>
              <p className="wcu-card-desc">{feature.desc}</p>

              <div className="wcu-card-stat">
                <span className="wcu-card-stat-value">{feature.stat}</span>
                <span className="wcu-card-stat-label">{feature.statLabel}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="wcu-cta"
        >
          <a href="/contact" className="wcu-cta-btn">
            <span>Start Your Project</span>
            <motion.span 
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;