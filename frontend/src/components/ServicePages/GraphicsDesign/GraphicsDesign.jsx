// src/components/ServicePages/GraphicsDesign/GraphicsDesign.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './GraphicsDesign.css';

const GraphicsDesign = () => {

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      offset: 80
    });
  }, []);

  const services = [
    { icon: "fa-paintbrush", name: "Print Design", desc: "Brochures, flyers, business cards" },
    { icon: "fa-chart-simple", name: "Social Media Graphics", desc: "Posts, banners, ads" },
    { icon: "fa-image", name: "Brand Collateral", desc: "Letterheads, envelopes" },
    { icon: "fa-ad", name: "Advertising Materials", desc: "Billboards, posters" },
    { icon: "fa-book", name: "Catalog Design", desc: "Product catalogs, magazines" },
    { icon: "fa-palette", name: "Custom Illustrations", desc: "Unique artwork" }
  ];

  const portfolio = [
    { id: 1, name: "Brand Identity Package", category: "Print", url: "#" },
    { id: 2, name: "Social Media Campaign", category: "Digital", url: "#" },
    { id: 3, name: "Product Catalog", category: "Print", url: "#" }
  ];

  return (
    <div className="graphics-page">
      
      <section className="graphics-hero">
        <div className="graphics-container">
          <div className="graphics-hero-grid">
            <div className="graphics-hero-content" data-aos="fade-right">
              <span className="graphics-hero-tag">Graphics Design</span>
              <h1 className="graphics-hero-title">Visual Stories That<br />Capture Attention</h1>
              <p className="graphics-hero-desc">
                We create stunning graphics that communicate your brand message effectively. 
                From print materials to digital assets, we bring your vision to life.
              </p>
              <div className="graphics-hero-buttons">
                <Link to="/contact" className="graphics-btn-primary">Start a Project →</Link>
                <Link to="/portfolio" className="graphics-btn-secondary">View Portfolio</Link>
              </div>
            </div>
            <div className="graphics-hero-image" data-aos="fade-left">
              <img src="https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&h=400&fit=crop" alt="Graphics Design" />
            </div>
          </div>
        </div>
      </section>

      <div className="graphics-trust">
        <div className="graphics-container">
          <p>✓ 500+ Designs Created | ✓ 200+ Happy Clients | ✓ 10+ Years Experience</p>
        </div>
      </div>

      <section className="graphics-services">
        <div className="graphics-container">
          <div className="graphics-section-header" data-aos="fade-up">
            <h2>What We Create</h2>
            <p>Comprehensive graphics design solutions</p>
          </div>
          <div className="graphics-services-grid">
            {services.map((service, idx) => (
              <div className="graphics-service-card" key={idx} data-aos="fade-up" data-aos-delay={50 + (idx * 50)}>
                <i className={`fas ${service.icon}`}></i>
                <h3>{service.name}</h3>
                <p>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="graphics-portfolio">
        <div className="graphics-container">
          <h2 className="graphics-portfolio-heading">Recent Work</h2>
          <div className="graphics-portfolio-grid">
            {portfolio.map((item, idx) => (
              <div key={item.id} className="graphics-portfolio-card" data-aos="fade-up" data-aos-delay={100 + (idx * 100)}>
                <div className="portfolio-icon"><i className="fas fa-paintbrush"></i></div>
                <span className="portfolio-cat">{item.category}</span>
                <h3>{item.name}</h3>
                <a href={item.url} className="portfolio-link">View Project →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="graphics-cta">
        <div className="graphics-container">
          <h2 data-aos="fade-up">Ready to Elevate Your Brand with Stunning Graphics?</h2>
          <p data-aos="fade-up" data-aos-delay="100">Let's create visuals that stand out</p>
          <Link to="/contact" className="graphics-btn-primary" data-aos="fade-up" data-aos-delay="200">Start a Project →</Link>
        </div>
      </section>

    </div>
  );
};

export default GraphicsDesign;