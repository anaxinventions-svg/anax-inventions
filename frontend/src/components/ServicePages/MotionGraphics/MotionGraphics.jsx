// src/components/ServicePages/MotionGraphics/MotionGraphics.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './MotionGraphics.css';

const MotionGraphics = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 600, once: true, offset: 80 });
  }, []);

  const services = [
    { icon: "fas fa-film", name: "Explainer Videos", desc: "2D & 3D animated explainers that simplify complex ideas" },
    { icon: "fas fa-video", name: "Product Demos", desc: "Showcase your product with stunning 3D animations" },
    { icon: "fas fa-chart-line", name: "Motion Graphics", desc: "Animated infographics and data visualizations" },
    { icon: "fas fa-pen-ruler", name: "Whiteboard Animation", desc: "Educational content with hand-drawn style" },
    { icon: "fas fa-play", name: "Social Media Videos", desc: "Short engaging clips for Instagram, TikTok & YouTube" },
    { icon: "fas fa-music", name: "Lyric Videos", desc: "Music videos and brand storytelling animations" }
  ];

  const projects = [
    { id: 1, name: "SaaS Explainer Series", category: "Explainer", url: "#" },
    { id: 2, name: "3D Product Showcase", category: "Product Demo", url: "#" },
    { id: 3, name: "Brand Story Animation", category: "Motion Graphics", url: "#" }
  ];

  const openProject = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closeProject = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="motion-page">

      {/* ===== HERO - CREATIVE DARK LAYOUT ===== */}
      <section className="motion-hero">
        <div className="motion-container">
          <div className="motion-hero-grid">
            <div className="motion-hero-content" data-aos="fade-right">
              <div className="motion-hero-badge">🎬 Creative Animation Studio</div>
              <h1 className="motion-hero-title">Bring Your Ideas<br />to Life with <span className="highlight">Animation</span></h1>
              <p className="motion-hero-desc">
                We create engaging motion graphics and animated videos that tell your story, 
                explain complex ideas, and captivate your audience across all platforms.
              </p>
              <div className="motion-hero-stats">
                <div className="hero-stat">
                  <span className="stat-number">200+</span>
                  <span className="stat-label">Videos Created</span>
                </div>
                <div className="hero-stat">
                  <span className="stat-number">10M+</span>
                  <span className="stat-label">Total Views</span>
                </div>
                <div className="hero-stat">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Happy Clients</span>
                </div>
              </div>
              <div className="motion-hero-buttons">
                <Link to="/contact" className="motion-btn-primary">Get a Quote →</Link>
                <Link to="/portfolio" className="motion-btn-secondary">View Reel</Link>
              </div>
            </div>
            <div className="motion-hero-image" data-aos="fade-left">
              <img src="https://images.unsplash.com/photo-1611162618071-b39ef9c1f2b7?w=500&h=450&fit=crop" alt="Motion Graphics" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHAT WE OFFER - CREATIVE NUMBERED CARDS ===== */}
      <section className="motion-services">
        <div className="motion-container">
          <div className="motion-section-header" data-aos="fade-up">
            <span className="header-sub">What We Create</span>
            <h2>Motion Graphics Services</h2>
            <p>Animation solutions for every need and platform</p>
          </div>
          <div className="motion-services-grid">
            {services.map((service, idx) => (
              <div className="motion-service-card" key={idx} data-aos="fade-up" data-aos-delay={50 + (idx * 50)}>
                <div className="card-number">0{idx + 1}</div>
                <i className={service.icon}></i>
                <h3>{service.name}</h3>
                <p>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ANIMATION PROCESS - CREATIVE TIMELINE ===== */}
      <section className="motion-process">
        <div className="motion-container">
          <div className="motion-section-header" data-aos="fade-up">
            <span className="header-sub">How We Work</span>
            <h2>Our Animation Process</h2>
            <p>From concept to screen — a creative journey</p>
          </div>
          <div className="motion-process-timeline">
            <div className="process-item" data-aos="fade-right">
              <div className="process-dot"></div>
              <div className="process-content">
                <span className="process-step">01</span>
                <h3>Discover & Concept</h3>
                <p>Understanding your vision, goals, and target audience through creative briefs</p>
              </div>
            </div>
            <div className="process-item" data-aos="fade-right" data-aos-delay="100">
              <div className="process-dot"></div>
              <div className="process-content">
                <span className="process-step">02</span>
                <h3>Script & Storyboard</h3>
                <p>Crafting compelling narratives and visual storyboards for approval</p>
              </div>
            </div>
            <div className="process-item" data-aos="fade-right" data-aos-delay="200">
              <div className="process-dot"></div>
              <div className="process-content">
                <span className="process-step">03</span>
                <h3>Design & Illustration</h3>
                <p>Creating style frames, character designs, and visual assets</p>
              </div>
            </div>
            <div className="process-item" data-aos="fade-right" data-aos-delay="300">
              <div className="process-dot"></div>
              <div className="process-content">
                <span className="process-step">04</span>
                <h3>Animate & Compose</h3>
                <p>Bringing designs to life with motion, effects, and transitions</p>
              </div>
            </div>
            <div className="process-item" data-aos="fade-right" data-aos-delay="400">
              <div className="process-dot"></div>
              <div className="process-content">
                <span className="process-step">05</span>
                <h3>Sound & Deliver</h3>
                <p>Adding voiceover, music, sound effects and final delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PORTFOLIO ===== */}
      <section className="motion-portfolio">
        <div className="motion-container">
          <div className="motion-section-header" data-aos="fade-up">
            <span className="header-sub">Recent Work</span>
            <h2>Animation Portfolio</h2>
            <p>Some of our best motion projects</p>
          </div>
          <div className="motion-portfolio-grid">
            {projects.map((item, idx) => (
              <div className="motion-portfolio-card" key={item.id} data-aos="fade-up" data-aos-delay={100 + (idx * 100)} onClick={() => openProject(item)}>
                <div className="portfolio-icon"><i className="fas fa-film"></i></div>
                <span className="portfolio-cat">{item.category}</span>
                <h3>{item.name}</h3>
                <span className="portfolio-link">View Project →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECT MODAL */}
      {selectedProject && (
        <div className="motion-modal-overlay" onClick={closeProject}>
          <div className="motion-modal" onClick={(e) => e.stopPropagation()}>
            <button className="motion-modal-close" onClick={closeProject}>
              <i className="fas fa-times"></i>
            </button>
            <div className="motion-modal-body">
              <span className="motion-modal-cat">{selectedProject.category}</span>
              <h2>{selectedProject.name}</h2>
              <p className="motion-modal-desc">Click below to view the full animation project details and showcase.</p>
              <a href={selectedProject.url} target="_blank" rel="noopener noreferrer" className="motion-modal-btn">
                Watch Animation <i className="fas fa-play"></i>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ===== CTA ===== */}
      <section className="motion-cta">
        <div className="motion-container">
          <h2 data-aos="fade-up">Ready to Animate Your Brand Story?</h2>
          <p data-aos="fade-up" data-aos-delay="100">Let's create motion that moves people and drives results</p>
          <Link to="/contact" className="motion-btn-primary" data-aos="fade-up" data-aos-delay="200">Get a Free Quote →</Link>
        </div>
      </section>

    </div>
  );
};

export default MotionGraphics;