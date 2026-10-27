// src/components/ServicePages/EmailMarketing/EmailMarketing.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './EmailMarketing.css';

// Project Images
const project1Img = 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80';
const project2Img = 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&q=80';
const project3Img = 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=800&q=80';

const EmailMarketing = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 600, once: true, offset: 80 });
  }, []);

  const projects = [
    {
      id: 1,
      name: "Welcome Series Campaign",
      url: "https://example.com/welcome-campaign",
      image: project1Img,
      description: "Automated welcome email sequence that increased subscriber engagement by 45% and reduced churn rate significantly.",
      category: "Automation",
      tech: ["Mailchimp", "Segmentation", "A/B Testing"]
    },
    {
      id: 2,
      name: "Abandoned Cart Recovery",
      url: "https://example.com/cart-recovery",
      image: project2Img,
      description: "Strategic abandoned cart email flow that recovered 30% of lost sales and boosted overall revenue by 25%.",
      category: "E-Commerce",
      tech: ["Klaviyo", "Personalization", "Analytics"]
    },
    {
      id: 3,
      name: "Weekly Newsletter Growth",
      url: "https://example.com/newsletter",
      image: project3Img,
      description: "Redesigned newsletter strategy that achieved 25% click-through rate and grew subscriber list by 10K in 2 months.",
      category: "Newsletter",
      tech: ["ConvertKit", "Design", "Content"]
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
      <section className="ecom-hero" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1920&q=80)` }}>
        <div className="ecom-hero-overlay"></div>
        <div className="ecom-container">
          <div className="ecom-hero-content" data-aos="fade-up">
            <span className="ecom-hero-tag">Email Marketing</span>
            <h1 className="ecom-hero-title">Connect & Convert<br />Via Email</h1>
            <p className="ecom-hero-desc">
              We create powerful email campaigns that nurture leads, build relationships, 
              and drive sales. From welcome sequences to promotional emails, we've got you covered.
            </p>
            <div className="ecom-hero-buttons">
              <Link to="/contact" className="ecom-btn-primary">Get Free Consultation →</Link>
              <Link to="/contact" className="ecom-btn-secondary">View Examples</Link>
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
            <p>Comprehensive email marketing solutions tailored to your business</p>
          </div>
          <div className="ecom-offerings-grid">
            {[
              { icon: 'fas fa-envelope-open-text', name: 'Welcome Emails' },
              { icon: 'fas fa-chart-line', name: 'Drip Campaigns' },
              { icon: 'fas fa-newspaper', name: 'Newsletters' },
              { icon: 'fas fa-shopping-cart', name: 'Abandoned Cart' },
              { icon: 'fas fa-tag', name: 'Promotional Emails' },
              { icon: 'fas fa-star', name: 'Re-engagement' }
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
            <p className="ecom-projects-subtitle">Real campaigns, real results</p>
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
            <p>How we create email campaigns that convert</p>
          </div>
          <div className="ecom-process-grid">
            {[
              { num: '01', icon: 'search', title: 'Audit' },
              { num: '02', icon: 'pencil-ruler', title: 'Strategy' },
              { num: '03', icon: 'code', title: 'Design' },
              { num: '04', icon: 'vial', title: 'Test' },
              { num: '05', icon: 'rocket', title: 'Launch' }
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
            <p>Industry-leading email marketing platforms</p>
          </div>
          <div className="ecom-tech-grid">
            {[
              { title: 'Platforms', items: ['Mailchimp', 'Klaviyo', 'ConvertKit', 'ActiveCampaign'] },
              { title: 'Automation', items: ['Zapier', 'HubSpot', 'Marketo', 'MailerLite'] },
              { title: 'Analytics', items: ['Google Analytics', 'Mixpanel', 'Amplitude', 'Hotjar'] },
              { title: 'Design', items: ['Figma', 'Canva', 'Stripo', 'BeeFree'] }
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
              { q: 'How do you improve email open rates?', a: 'We use compelling subject lines, optimal send times, and list segmentation to boost open rates.' },
              { q: 'Do you handle email list building?', a: 'Yes, we create lead magnets, popups, and landing pages to grow your subscriber list organically.' },
              { q: 'Can you integrate with our CRM?', a: 'Absolutely! We integrate with Salesforce, HubSpot, Zoho, and most major CRM platforms.' },
              { q: 'How do you ensure email deliverability?', a: 'We follow best practices including SPF/DKIM setup, list hygiene, and reputation monitoring.' }
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
          <h2 data-aos="fade-up">Ready to Boost Your Email Marketing?</h2>
          <p data-aos="fade-up" data-aos-delay="100">Let's create campaigns that convert subscribers into customers</p>
          <Link to="/contact" className="ecom-btn-primary" data-aos="fade-up" data-aos-delay="200">Get a Free Quote →</Link>
        </div>
      </section>

    </div>
  );
};

export default EmailMarketing;