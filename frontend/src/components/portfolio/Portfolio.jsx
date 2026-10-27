import React, { useEffect, useRef } from 'react';
import './Portfolio.css';

const Portfolio = () => {
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const projects = [
    { id: 1, name: "Amax Website", desc: "Corporate website with dynamic modules", icon: "💼", tech: "React + Node.js" },
    { id: 2, name: "Chachujee.com", desc: "E-commerce platform with payment gateway", icon: "🛒", tech: "Next.js + Stripe" },
    { id: 3, name: "Admission Informations", desc: "Educational portal & counselling system", icon: "🎓", tech: "PHP + MySQL" },
    { id: 4, name: "Hidaayah Online Quran", desc: "Interactive Quran learning platform", icon: "📖", tech: "React + Firebase" },
    { id: 5, name: "Inspire Education System", desc: "LMS with video lectures", icon: "📚", tech: "Vue + Laravel" },
    { id: 6, name: "IT Hustlers", desc: "Tech agency portfolio site", icon: "🚀", tech: "WordPress" },
    { id: 7, name: "Quran For All", desc: "Multi-language Quran teaching", icon: "🌍", tech: "Angular + Node" },
    { id: 8, name: "Mehtab Hussain Carpentry", desc: "Craftsmanship showcase", icon: "🔨", tech: "HTML/CSS/JS" },
    { id: 9, name: "First Choice Capital", desc: "Financial consulting solutions", icon: "📊", tech: "React + Django" },
  ];

  const services = [
    { name: "Web Development", icon: "💻", color: "#4c9aff" },
    { name: "Mobile App", icon: "📱", color: "#ff6b4a" },
    { name: "UI/UX Design", icon: "🎨", color: "#a55eff" },
    { name: "SEO Optimized", icon: "📈", color: "#00d4aa" },
  ];

  return (
    <div className="portfolio-main">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-orb orb1"></div>
        <div className="gradient-orb orb2"></div>
        <div className="gradient-orb orb3"></div>
      </div>

      <div className="container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-badge">
            <span className="live-dot"></span>
            ✨ Delivering Excellence Since 2018
          </div>
          <h1 className="hero-title">
            Our <span className="gradient">Creations</span>
            <br />Your Success
          </h1>
          <p className="hero-desc">
            Explore live projects & digital solutions we've built and delivered — each success speaks for itself.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}>
              View Projects <i className="arrow">→</i>
            </button>
            <button className="btn btn-secondary">
              Contact Us <i className="arrow">✉️</i>
            </button>
          </div>
        </div>

        {/* Services Section */}
        <div className="services-section">
          <div className="section-header">
            <span className="tag">What We Offer</span>
            <h2>Premium <span className="gradient">Services</span></h2>
          </div>
          <div className="services-grid">
            {services.map((service, idx) => (
              <div className="service-card" key={idx} style={{ '--service-color': service.color }}>
                <div className="service-icon">{service.icon}</div>
                <h3>{service.name}</h3>
                <p>High-quality digital solutions</p>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className="projects-section" id="projects">
          <div className="section-header">
            <span className="tag">Our Portfolio</span>
            <h2>Recently <span className="gradient">Delivered</span></h2>
          </div>
          <div className="projects-grid">
            {projects.map((project, idx) => (
              <div 
                className="project-card" 
                key={project.id}
                ref={el => cardRefs.current[idx] = el}
                onClick={() => alert(`✨ ${project.name} - Live & delivering results!`)}
              >
                <div className="card-icon">{project.icon}</div>
                <h3 className="project-name">{project.name}</h3>
                <p className="project-desc">{project.desc}</p>
                <div className="project-tech">
                  <span className="tech-badge">{project.tech}</span>
                </div>
                <button className="view-btn">
                  See Live Result <span>→</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Banner */}
        <div className="stats-banner">
          <div className="stat-item">
            <div className="stat-number">45+</div>
            <div className="stat-label">Projects Delivered</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">32</div>
            <div className="stat-label">Happy Clients</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Satisfaction Rate</div>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>© 2024 — Innovating digital presence, every project tells a story.</p>
        </footer>
      </div>
    </div>
  );
};

export default Portfolio;