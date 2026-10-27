// src/components/ServicePages/UIUXDesign/UIUXDesign.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './UIUXDesign.css';

const UIUXDesign = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 600, once: true, offset: 80 });
  }, []);

  const projects = [
    {
      id: 1,
      name: "E-Commerce App Design",
      url: "https://example.com/ecommerce-app",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80",
      description: "Complete mobile app redesign for a fashion e-commerce brand. Increased conversion rate by 45% through intuitive navigation and streamlined checkout flow.",
      category: "Mobile App",
      tech: ["Figma", "Prototyping", "User Testing"]
    },
    {
      id: 2,
      name: "Banking Dashboard",
      url: "https://example.com/banking-dashboard",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      description: "Modern banking dashboard with real-time analytics, transaction history, and personalized insights. Reduced task completion time by 60%.",
      category: "Web App",
      tech: ["UI Design", "Data Viz", "Accessibility"]
    },
    {
      id: 3,
      name: "Fitness Tracker",
      url: "https://example.com/fitness-tracker",
      image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&q=80",
      description: "Health & fitness tracking app with gamification elements. Achieved 4.8 star rating with 50K+ downloads in first month.",
      category: "Mobile App",
      tech: ["UX Research", "Gamification", "Motion"]
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
      <section className="ecom-hero" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1920&q=80)` }}>
        <div className="ecom-hero-overlay"></div>
        <div className="ecom-container">
          <div className="ecom-hero-content" data-aos="fade-up">
            <span className="ecom-hero-tag">UI/UX Design Studio</span>
            <h1 className="ecom-hero-title">Design Experiences<br />That Users Love</h1>
            <p className="ecom-hero-desc">
              We create intuitive, beautiful, and user-centered digital experiences that 
              delight users and drive business growth. From research to pixel-perfect UI.
            </p>
            <div className="ecom-hero-buttons">
              <Link to="/contact" className="ecom-btn-primary">Start a Project →</Link>
              <Link to="/portfolio" className="ecom-btn-secondary">View Portfolio</Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGE */}
      <div className="ecom-trust">
        <div className="ecom-container">
          <p>Designed With Passion, Built With Purpose</p>
        </div>
      </div>

      {/* WHAT WE OFFER */}
      <section className="ecom-offerings">
        <div className="ecom-container">
          <div className="ecom-section-header" data-aos="fade-up">
            <h2>What We Offer</h2>
            <p>End-to-end design solutions for digital products</p>
          </div>
          <div className="ecom-offerings-grid">
            {[
              { icon: 'fas fa-magnifying-glass', name: 'User Research' },
              { icon: 'fas fa-pen-ruler', name: 'Wireframing' },
              { icon: 'fas fa-palette', name: 'UI Design' },
              { icon: 'fas fa-arrows-spin', name: 'Prototyping' },
              { icon: 'fas fa-chart-line', name: 'Usability Testing' },
              { icon: 'fas fa-mobile-alt', name: 'Responsive Design' }
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
              <h2>Design Portfolio</h2>
            </div>
            <p className="ecom-projects-subtitle">Beautiful designs, real impact</p>
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
            <p>A human-centered approach to design</p>
          </div>
          <div className="ecom-process-grid">
            {[
              { num: '01', icon: 'search', title: 'Discover' },
              { num: '02', icon: 'lightbulb', title: 'Define' },
              { num: '03', icon: 'pen-ruler', title: 'Design' },
              { num: '04', icon: 'vial', title: 'Test' },
              { num: '05', icon: 'rocket', title: 'Deliver' }
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
            <h2>Tools We Master</h2>
            <p>Industry-leading design and prototyping tools</p>
          </div>
          <div className="ecom-tech-grid">
            {[
              { title: 'Design', items: ['Figma', 'Sketch', 'Adobe XD', 'Photoshop'] },
              { title: 'Prototyping', items: ['Figma Prototype', 'Principle', 'ProtoPie', 'Framer'] },
              { title: 'Research', items: ['Maze', 'Hotjar', 'UserTesting', 'Lookback'] },
              { title: 'Handoff', items: ['Zeplin', 'Avocode', 'Figma Dev', 'Storybook'] }
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
            <p>Got questions about our design process?</p>
          </div>
          <div className="ecom-faq-grid">
            {[
              { q: 'How long does a typical design project take?', a: 'Typically 4-8 weeks depending on scope, complexity, and number of screens required.' },
              { q: 'Do you provide design systems?', a: 'Yes, we create comprehensive design systems with components, tokens, and documentation.' },
              { q: 'Can you work with our development team?', a: 'Absolutely! We provide developer handoff with specs, assets, and interactive prototypes.' },
              { q: 'Do you conduct user research?', a: 'Yes, we perform user interviews, usability testing, and competitive analysis as needed.' }
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
          <h2 data-aos="fade-up">Ready to Create Amazing Digital Experiences?</h2>
          <p data-aos="fade-up" data-aos-delay="100">Let's design something beautiful together</p>
          <Link to="/contact" className="ecom-btn-primary" data-aos="fade-up" data-aos-delay="200">Start a Project →</Link>
        </div>
      </section>

    </div>
  );
};

export default UIUXDesign;