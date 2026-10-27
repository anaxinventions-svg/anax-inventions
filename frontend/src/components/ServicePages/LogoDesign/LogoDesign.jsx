// src/components/ServicePages/LogoDesign/LogoDesign.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './LogoDesign.css';

const LogoDesign = () => {

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      offset: 80
    });
  }, []);

  const styles = [
    { icon: "fa-font", name: "Wordmark", desc: "Typography-based logos" },
    { icon: "fa-image", name: "Pictorial", desc: "Icon-based logos" },
    { icon: "fa-shapes", name: "Abstract", desc: "Unique geometric shapes" },
    { icon: "fa-landmark", name: "Emblem", desc: "Classic badge style" },
    { icon: "fa-mask", name: "Mascot", desc: "Character-based logos" },
    { icon: "fa-pen-fancy", name: "Hand-drawn", desc: "Custom illustrations" }
  ];

  return (
    <div className="logo-page">
      
      <section className="logo-hero">
        <div className="logo-container">
          <div className="logo-hero-grid">
            <div className="logo-hero-content" data-aos="fade-right">
              <span className="logo-hero-tag">Logo Design</span>
              <h1 className="logo-hero-title">Create a Brand Identity<br />That Stands Out</h1>
              <p className="logo-hero-desc">
                Your logo is the face of your brand. We create memorable, timeless logos 
                that capture your brand essence and leave a lasting impression.
              </p>
              <div className="logo-hero-buttons">
                <Link to="/contact" className="logo-btn-primary">Get a Quote →</Link>
                <Link to="/portfolio" className="logo-btn-secondary">View Portfolio</Link>
              </div>
            </div>
            <div className="logo-hero-image" data-aos="fade-left">
              <img src="https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500&h=400&fit=crop" alt="Logo Design" />
            </div>
          </div>
        </div>
      </section>

      <div className="logo-trust">
        <div className="logo-container">
          <p>✓ 1000+ Logos Created | ✓ 500+ Happy Brands | ✓ 48hr Turnaround</p>
        </div>
      </div>

      <section className="logo-styles">
        <div className="logo-container">
          <div className="logo-section-header" data-aos="fade-up">
            <h2>Logo Styles We Create</h2>
            <p>Diverse styles for every brand personality</p>
          </div>
          <div className="logo-styles-grid">
            {styles.map((style, idx) => (
              <div className="logo-style-card" key={idx} data-aos="fade-up" data-aos-delay={50 + (idx * 50)}>
                <i className={`fas ${style.icon}`}></i>
                <h3>{style.name}</h3>
                <p>{style.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="logo-process">
        <div className="logo-container">
          <div className="logo-section-header" data-aos="fade-up">
            <h2>Our Logo Design Process</h2>
            <p>Simple, transparent, and collaborative</p>
          </div>
          <div className="logo-process-grid">
            <div className="logo-process-card" data-aos="fade-up" data-aos-delay="50">
              <div className="process-num">01</div>
              <h3>Brief</h3>
              <p>Understanding your brand</p>
            </div>
            <div className="logo-process-card" data-aos="fade-up" data-aos-delay="100">
              <div className="process-num">02</div>
              <h3>Research</h3>
              <p>Industry & competitor analysis</p>
            </div>
            <div className="logo-process-card" data-aos="fade-up" data-aos-delay="150">
              <div className="process-num">03</div>
              <h3>Sketching</h3>
              <p>Initial concepts & ideas</p>
            </div>
            <div className="logo-process-card" data-aos="fade-up" data-aos-delay="200">
              <div className="process-num">04</div>
              <h3>Presentation</h3>
              <p>3-5 unique concepts</p>
            </div>
            <div className="logo-process-card" data-aos="fade-up" data-aos-delay="250">
              <div className="process-num">05</div>
              <h3>Refinement</h3>
              <p>Feedback & revisions</p>
            </div>
            <div className="logo-process-card" data-aos="fade-up" data-aos-delay="300">
              <div className="process-num">06</div>
              <h3>Delivery</h3>
              <p>Final files & assets</p>
            </div>
          </div>
        </div>
      </section>

      <section className="logo-cta">
        <div className="logo-container">
          <h2 data-aos="fade-up">Ready to Create Your Brand Identity?</h2>
          <p data-aos="fade-up" data-aos-delay="100">Let's design a logo you'll love</p>
          <Link to="/contact" className="logo-btn-primary" data-aos="fade-up" data-aos-delay="200">Get a Quote →</Link>
        </div>
      </section>

    </div>
  );
};

export default LogoDesign;