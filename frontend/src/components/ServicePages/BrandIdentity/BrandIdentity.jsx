// src/components/ServicePages/BrandIdentity/BrandIdentity.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './BrandIdentity.css';

const BrandIdentity = () => {

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      offset: 80
    });
  }, []);

  const services = [
    { icon: "fa-trademark", name: "Logo Design", desc: "Unique brand mark" },
    { icon: "fa-palette", name: "Color Palette", desc: "Brand colors" },
    { icon: "fa-font", name: "Typography", desc: "Font selection" },
    { icon: "fa-image", name: "Brand Guidelines", desc: "Complete brand book" },
    { icon: "fa-business-time", name: "Brand Strategy", desc: "Positioning" },
    { icon: "fa-chart-line", name: "Brand Voice", desc: "Tone & messaging" }
  ];

  return (
    <div className="brand-page">
      
      <section className="brand-hero">
        <div className="brand-container">
          <div className="brand-hero-grid">
            <div className="brand-hero-content" data-aos="fade-right">
              <span className="brand-hero-tag">Brand Identity</span>
              <h1 className="brand-hero-title">Build a Brand<br />That Lasts Forever</h1>
              <p className="brand-hero-desc">
                We create complete brand identities that connect with your audience, 
                tell your story, and stand out from the competition.
              </p>
              <div className="brand-hero-buttons">
                <Link to="/contact" className="brand-btn-primary">Start a Project →</Link>
                <Link to="/portfolio" className="brand-btn-secondary">View Portfolio</Link>
              </div>
            </div>
            <div className="brand-hero-image" data-aos="fade-left">
              <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&h=400&fit=crop" alt="Brand Identity" />
            </div>
          </div>
        </div>
      </section>

      <div className="brand-trust">
        <div className="brand-container">
          <p>✓ 200+ Brands Created | ✓ 100+ Guidelines | ✓ 98% Client Retention</p>
        </div>
      </div>

      <section className="brand-services">
        <div className="brand-container">
          <div className="brand-section-header" data-aos="fade-up">
            <h2>What We Create</h2>
            <p>Complete brand identity solutions</p>
          </div>
          <div className="brand-services-grid">
            {services.map((service, idx) => (
              <div className="brand-service-card" key={idx} data-aos="fade-up" data-aos-delay={50 + (idx * 50)}>
                <i className={`fas ${service.icon}`}></i>
                <h3>{service.name}</h3>
                <p>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="brand-cta">
        <div className="brand-container">
          <h2 data-aos="fade-up">Ready to Build Your Brand Identity?</h2>
          <p data-aos="fade-up" data-aos-delay="100">Let's create a brand your customers will love</p>
          <Link to="/contact" className="brand-btn-primary" data-aos="fade-up" data-aos-delay="200">Start a Project →</Link>
        </div>
      </section>

    </div>
  );
};

export default BrandIdentity;