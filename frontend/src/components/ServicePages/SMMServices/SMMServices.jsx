// src/components/ServicePages/SMMServices/SMMServices.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './SMMServices.css';

// Project Images
const project1Img = 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80';
const project2Img = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80';
const project3Img = 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80';

const SMMServices = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 600, once: true, offset: 80 });
  }, []);

  const projects = [
    {
      id: 1,
      name: "Instagram Growth Campaign",
      url: "https://example.com/instagram-growth",
      image: project1Img,
      description: "Strategic Instagram campaign that grew followers from 5K to 55K in just 3 months with high engagement rates.",
      category: "Instagram",
      tech: ["Content Strategy", "Reels", "Hashtag Research"]
    },
    {
      id: 2,
      name: "Facebook Engagement Boost",
      url: "https://example.com/facebook-engagement",
      image: project2Img,
      description: "Community management and content strategy that increased engagement by 300% and built a loyal fanbase.",
      category: "Facebook",
      tech: ["Community", "Ads", "Content Calendar"]
    },
    {
      id: 3,
      name: "LinkedIn B2B Lead Generation",
      url: "https://example.com/linkedin-b2b",
      image: project3Img,
      description: "Professional LinkedIn strategy that generated 200+ qualified B2B leads and established thought leadership.",
      category: "LinkedIn",
      tech: ["Lead Gen", "Content", "Networking"]
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
      <section className="ecom-hero" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1920&q=80)` }}>
        <div className="ecom-hero-overlay"></div>
        <div className="ecom-container">
          <div className="ecom-hero-content" data-aos="fade-up">
            <span className="ecom-hero-tag">Social Media Marketing</span>
            <h1 className="ecom-hero-title">Build Your Brand<br />On Social Media</h1>
            <p className="ecom-hero-desc">
              We help businesses grow their social media presence, engage with audiences, 
              and drive conversions through strategic content and community management.
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
          <p>Backed By Client Trust And Powered By Engagement</p>
        </div>
      </div>

      {/* WHAT WE OFFER */}
      <section className="ecom-offerings">
        <div className="ecom-container">
          <div className="ecom-section-header" data-aos="fade-up">
            <h2>What We Offer</h2>
            <p>Comprehensive social media solutions tailored to your brand</p>
          </div>
          <div className="ecom-offerings-grid">
            {[
              { icon: 'fab fa-instagram', name: 'Instagram' },
              { icon: 'fab fa-facebook', name: 'Facebook' },
              { icon: 'fab fa-linkedin', name: 'LinkedIn' },
              { icon: 'fab fa-twitter', name: 'Twitter' },
              { icon: 'fab fa-tiktok', name: 'TikTok' },
              { icon: 'fab fa-youtube', name: 'YouTube' }
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
            <p className="ecom-projects-subtitle">Real growth, real engagement</p>
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
            <p>How we grow your social media presence</p>
          </div>
          <div className="ecom-process-grid">
            {[
              { num: '01', icon: 'search', title: 'Audit' },
              { num: '02', icon: 'pencil-ruler', title: 'Strategy' },
              { num: '03', icon: 'pen-fancy', title: 'Create' },
              { num: '04', icon: 'users', title: 'Engage' },
              { num: '05', icon: 'chart-line', title: 'Scale' }
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
            <p>Industry-leading social media management tools</p>
          </div>
          <div className="ecom-tech-grid">
            {[
              { title: 'Scheduling', items: ['Buffer', 'Hootsuite', 'Later', 'Sprout Social'] },
              { title: 'Analytics', items: ['Socialbakers', 'Sprinklr', 'Brandwatch', 'Mention'] },
              { title: 'Design', items: ['Canva', 'Adobe Express', 'Figma', 'CapCut'] },
              { title: 'Ads', items: ['Meta Ads', 'TikTok Ads', 'LinkedIn Ads', 'Twitter Ads'] }
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
              { q: 'How long does it take to see results?', a: 'Typically 2-3 months for significant growth and engagement on social media platforms.' },
              { q: 'Do you create content?', a: 'Yes, we create engaging posts, graphics, Reels, and videos tailored to your brand voice.' },
              { q: 'How many platforms should I be on?', a: 'We recommend starting with 2-3 platforms where your target audience is most active.' },
              { q: 'Do you provide monthly reports?', a: 'Yes, detailed reports with reach, engagement, follower growth, and conversion metrics.' }
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
          <h2 data-aos="fade-up">Ready to Grow Your Social Media Presence?</h2>
          <p data-aos="fade-up" data-aos-delay="100">Get a free social media audit and strategy session</p>
          <Link to="/contact" className="ecom-btn-primary" data-aos="fade-up" data-aos-delay="200">Get a Free Quote →</Link>
        </div>
      </section>

    </div>
  );
};

export default SMMServices;