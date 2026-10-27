// src/components/ServicePages/PPCServices/PPCServices.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './PPCServices.css';

// Project Images
const project1Img = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80';
const project2Img = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80';
const project3Img = 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&q=80';

const PPCServices = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 600, once: true, offset: 80 });
  }, []);

  const projects = [
    {
      id: 1,
      name: "Google Ads Campaign",
      url: "https://example.com/google-ads",
      image: project1Img,
      description: "Comprehensive Google Ads campaign that increased ROI by 300% through strategic keyword targeting and bid optimization.",
      category: "Google Ads",
      tech: ["Search Ads", "Display Ads", "Shopping Ads"]
    },
    {
      id: 2,
      name: "Facebook Ads Campaign",
      url: "https://example.com/facebook-ads",
      image: project2Img,
      description: "Targeted Facebook advertising that reduced cost per lead by 45% while increasing qualified leads by 200%.",
      category: "Facebook Ads",
      tech: ["Lead Gen", "Retargeting", "Lookalike"]
    },
    {
      id: 3,
      name: "Retargeting Campaign",
      url: "https://example.com/retargeting",
      image: project3Img,
      description: "Advanced retargeting strategy that boosted conversion rates by 60% and recovered abandoned cart sales.",
      category: "Retargeting",
      tech: ["Pixel Tracking", "Dynamic Ads", "Segmentation"]
    }
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
    <div className="ecom-page">

      {/* HERO */}
      <section className="ecom-hero" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80)` }}>
        <div className="ecom-hero-overlay"></div>
        <div className="ecom-container">
          <div className="ecom-hero-content" data-aos="fade-up">
            <span className="ecom-hero-tag">PPC Advertising</span>
            <h1 className="ecom-hero-title">Drive Targeted Traffic<br />With Paid Ads</h1>
            <p className="ecom-hero-desc">
              We manage Google Ads, Facebook Ads, and other paid platforms to drive targeted traffic, 
              increase conversions, and maximize your ROI. Get instant results with our data-driven approach.
            </p>
            <div className="ecom-hero-buttons">
              <Link to="/contact" className="ecom-btn-primary">Get Free Audit →</Link>
              <Link to="/contact" className="ecom-btn-secondary">Talk to Expert</Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGE */}
      <div className="ecom-trust">
        <div className="ecom-container">
          <p>Backed By Client Trust And Powered By Data</p>
        </div>
      </div>

      {/* WHAT WE OFFER */}
      <section className="ecom-offerings">
        <div className="ecom-container">
          <div className="ecom-section-header" data-aos="fade-up">
            <h2>What We Offer</h2>
            <p>Comprehensive PPC solutions tailored to your business goals</p>
          </div>
          <div className="ecom-offerings-grid">
            {[
              { icon: 'fab fa-google', name: 'Google Ads' },
              { icon: 'fab fa-facebook', name: 'Facebook Ads' },
              { icon: 'fab fa-instagram', name: 'Instagram Ads' },
              { icon: 'fab fa-linkedin', name: 'LinkedIn Ads' },
              { icon: 'fab fa-twitter', name: 'Twitter Ads' },
              { icon: 'fab fa-tiktok', name: 'TikTok Ads' }
            ].map((item, i) => (
              <div className="ecom-offer-card" key={i} data-aos="fade-up" data-aos-delay={50 + i * 50}>
                <i className={item.icon}></i>
                <h3>{item.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== RECENT PROJECTS - PROFESSIONAL CLEAN ========== */}
      <section className="ecom-projects">
        <div className="ecom-container">
          <div className="ecom-projects-header" data-aos="fade-up">
            <div className="ecom-projects-header-left">
              <span className="ecom-projects-label">Selected Work</span>
              <h2>Recent Campaigns</h2>
            </div>
            <p className="ecom-projects-subtitle">Real campaigns, real ROI</p>
          </div>

          <div className="ecom-projects-list">
            {projects.map((project, idx) => (
              <div 
                key={project.id} 
                className="ecom-project-row"
                data-aos="fade-up"
                data-aos-delay={100 + idx * 100}
                onClick={() => openProject(project)}
              >
                <div className="ecom-project-row-img">
                  <img src={project.image} alt={project.name} />
                  <div className="ecom-project-row-overlay">
                    <span>View Project</span>
                  </div>
                </div>
                <div className="ecom-project-row-info">
                  <div className="ecom-project-row-top">
                    <span className="ecom-project-row-cat">{project.category}</span>
                    <span className="ecom-project-row-num">0{idx + 1}</span>
                  </div>
                  <h3 className="ecom-project-row-title">{project.name}</h3>
                  <p className="ecom-project-row-desc">{project.description}</p>
                  <div className="ecom-project-row-tech">
                    {project.tech.map((t, i) => (
                      <span key={i}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="ecom-project-row-arrow">
                  <i className="fas fa-arrow-right"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECT MODAL */}
      {selectedProject && (
        <div className="ecom-modal-overlay" onClick={closeProject}>
          <div className="ecom-modal" onClick={(e) => e.stopPropagation()}>
            <button className="ecom-modal-close" onClick={closeProject}>
              <i className="fas fa-times"></i>
            </button>
            <div className="ecom-modal-image">
              <img src={selectedProject.image} alt={selectedProject.name} />
            </div>
            <div className="ecom-modal-body">
              <span className="ecom-modal-cat">{selectedProject.category}</span>
              <h2>{selectedProject.name}</h2>
              <p className="ecom-modal-desc">{selectedProject.description}</p>
              <div className="ecom-modal-tech">
                {selectedProject.tech.map((t, i) => (
                  <span key={i}>{t}</span>
                ))}
              </div>
              <a href={selectedProject.url} target="_blank" rel="noopener noreferrer" className="ecom-modal-btn">
                View Case Study <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* PROCESS */}
      <section className="ecom-process">
        <div className="ecom-container">
          <div className="ecom-section-header" data-aos="fade-up">
            <h2>Our Process</h2>
            <p>How we maximize your PPC ROI</p>
          </div>
          <div className="ecom-process-grid">
            {[
              { num: '01', icon: 'search', title: 'Research' },
              { num: '02', icon: 'bullhorn', title: 'Setup' },
              { num: '03', icon: 'chart-line', title: 'Launch' },
              { num: '04', icon: 'vial', title: 'Test' },
              { num: '05', icon: 'rocket', title: 'Scale' }
            ].map((p, i) => (
              <div className="ecom-process-card" key={i} data-aos="fade-up" data-aos-delay={50 + i * 50}>
                <span className="ecom-process-num">{p.num}</span>
                <i className={`fas fa-${p.icon}`}></i>
                <h3>{p.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNOLOGIES */}
      <section className="ecom-tech">
        <div className="ecom-container">
          <div className="ecom-section-header" data-aos="fade-up">
            <h2>Technologies We Master</h2>
            <p>Industry-leading PPC management platforms</p>
          </div>
          <div className="ecom-tech-grid">
            {[
              { title: 'Platforms', items: ['Google Ads', 'Facebook Ads', 'LinkedIn Ads', 'TikTok Ads'] },
              { title: 'Analytics', items: ['Google Analytics', 'Meta Pixel', 'Tag Manager', 'Data Studio'] },
              { title: 'Optimization', items: ['Optmyzr', 'AdEspresso', 'Kenshoo', 'WordStream'] },
              { title: 'Tracking', items: ['Hotjar', 'Mixpanel', 'Amplitude', 'CallRail'] }
            ].map((g, i) => (
              <div className="ecom-tech-group" key={i} data-aos="fade-up" data-aos-delay={i * 50}>
                <h4>{g.title}</h4>
                <div className="ecom-tech-list">
                  {g.items.map((item, j) => (
                    <span key={j}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="ecom-faq">
        <div className="ecom-container">
          <div className="ecom-section-header" data-aos="fade-up">
            <h2>Frequently Asked Questions</h2>
            <p>Got questions? We've got answers</p>
          </div>
          <div className="ecom-faq-grid">
            {[
              { q: 'What is the minimum budget for PPC?', a: 'We recommend starting with $500-1000 per month for meaningful results and data collection.' },
              { q: 'How quickly will I see results?', a: 'PPC delivers instant visibility. You will see traffic within 24-48 hours of campaign launch.' },
              { q: 'Do you manage all platforms?', a: 'Yes, we manage Google, Facebook, Instagram, LinkedIn, Twitter, and TikTok Ads professionally.' },
              { q: 'Do you provide monthly reports?', a: 'Yes, detailed reports with ROI, CTR, conversion metrics, and actionable recommendations.' }
            ].map((f, i) => (
              <div className="ecom-faq-item" key={i} data-aos="fade-up" data-aos-delay={50 + i * 50}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ecom-cta">
        <div className="ecom-container">
          <h2 data-aos="fade-up">Ready to Scale Your Business with PPC?</h2>
          <p data-aos="fade-up" data-aos-delay="100">Get a free PPC audit and start driving qualified traffic today</p>
          <Link to="/contact" className="ecom-btn-primary" data-aos="fade-up" data-aos-delay="200">Get a Free Quote →</Link>
        </div>
      </section>

    </div>
  );
};

export default PPCServices;