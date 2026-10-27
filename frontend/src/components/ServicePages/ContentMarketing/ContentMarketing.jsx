// src/components/ServicePages/ContentMarketing/ContentMarketing.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './ContentMarketing.css';

// Hero Background Image
import heroBg from '../../../assets/content-bg.jpg';

// Project Images
const project1Img = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80';
const project2Img = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80';
const project3Img = 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80';

const ContentMarketing = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 600, once: true, offset: 80 });
  }, []);

  const projects = [
    {
      id: 1,
      name: "Tech Blog Strategy",
      url: "https://example.com/tech-blog",
      image: project1Img,
      description: "Comprehensive blog strategy that transformed organic reach from 2K to 12K monthly visitors in just 6 months with SEO-optimized content.",
      category: "Blog Content",
      tech: ["SEO", "Content Strategy", "Analytics"]
    },
    {
      id: 2,
      name: "E-Commerce Product Content",
      url: "https://example.com/product-content",
      image: project2Img,
      description: "Product descriptions and content overhaul that boosted sales across all platforms and doubled revenue within 3 months.",
      category: "Product Content",
      tech: ["Copywriting", "A/B Testing", "Conversion"]
    },
    {
      id: 3,
      name: "Video Marketing Campaign",
      url: "https://example.com/video-campaign",
      image: project3Img,
      description: "Viral video campaign that generated massive engagement, 1M+ views, and 50K new followers in just 30 days.",
      category: "Video Content",
      tech: ["Video Production", "Social Media", "Viral Marketing"]
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
      <section className="ecom-hero" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="ecom-hero-overlay"></div>
        <div className="ecom-container">
          <div className="ecom-hero-content" data-aos="fade-up">
            <span className="ecom-hero-tag">Content Marketing</span>
            <h1 className="ecom-hero-title">Engaging Content<br />That Converts</h1>
            <p className="ecom-hero-desc">
              We create high-quality, SEO-optimized content that attracts, engages, and converts 
              your target audience. From blog posts to videos, we've got you covered.
            </p>
            <div className="ecom-hero-buttons">
              <Link to="/contact" className="ecom-btn-primary">Get Free Consultation →</Link>
              <Link to="/contact" className="ecom-btn-secondary">View Portfolio</Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGE */}
      <div className="ecom-trust">
        <div className="ecom-container">
          <p>Backed By Client Trust And Powered By Creativity</p>
        </div>
      </div>

      {/* WHAT WE OFFER */}
      <section className="ecom-offerings">
        <div className="ecom-container">
          <div className="ecom-section-header" data-aos="fade-up">
            <h2>What We Offer</h2>
            <p>Comprehensive content marketing solutions tailored to your brand</p>
          </div>
          <div className="ecom-offerings-grid">
            {[
              { icon: 'fas fa-blog', name: 'Blog Posts' },
              { icon: 'fas fa-video', name: 'Video Content' },
              { icon: 'fas fa-chart-pie', name: 'Infographics' },
              { icon: 'fas fa-envelope', name: 'Email Newsletters' },
              { icon: 'fas fa-file-alt', name: 'Case Studies' },
              { icon: 'fas fa-newspaper', name: 'Whitepapers' }
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
              <h2>Recent Projects</h2>
            </div>
            <p className="ecom-projects-subtitle">Real content, real results</p>
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
            <p>How we create content that drives results</p>
          </div>
          <div className="ecom-process-grid">
            {[
              { num: '01', icon: 'search', title: 'Research' },
              { num: '02', icon: 'pen-fancy', title: 'Creation' },
              { num: '03', icon: 'chart-line', title: 'Distribution' },
              { num: '04', icon: 'chart-simple', title: 'Analysis' },
              { num: '05', icon: 'rocket', title: 'Optimize' }
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
            <p>Cutting-edge content marketing tools & platforms</p>
          </div>
          <div className="ecom-tech-grid">
            {[
              { title: 'Content Tools', items: ['WordPress', 'HubSpot', 'Medium', 'Ghost'] },
              { title: 'SEO Tools', items: ['Ahrefs', 'SEMrush', 'Moz', 'Google Analytics'] },
              { title: 'Design Tools', items: ['Canva', 'Figma', 'Adobe CC', 'Loom'] },
              { title: 'Distribution', items: ['Mailchimp', 'Buffer', 'Hootsuite', 'Zapier'] }
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
              { q: 'How long does it take to see content marketing results?', a: 'Typically 3-6 months for SEO content, with immediate results for paid and social campaigns.' },
              { q: 'Do you provide content strategy planning?', a: 'Yes, we create comprehensive content calendars, topic clusters, and distribution strategies.' },
              { q: 'Can you handle video content production?', a: 'Absolutely! From scripting to editing, we handle full video production for all platforms.' },
              { q: 'How do you measure content success?', a: 'We track traffic, engagement, conversions, and ROI using advanced analytics dashboards.' }
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
          <h2 data-aos="fade-up">Ready to Create Content That Converts?</h2>
          <p data-aos="fade-up" data-aos-delay="100">Let's build your brand's content engine together</p>
          <Link to="/contact" className="ecom-btn-primary" data-aos="fade-up" data-aos-delay="200">Get a Free Quote →</Link>
        </div>
      </section>

    </div>
  );
};

export default ContentMarketing;