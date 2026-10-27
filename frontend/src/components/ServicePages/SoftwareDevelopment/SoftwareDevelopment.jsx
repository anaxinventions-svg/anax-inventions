// src/components/ServicePages/SoftwareDevelopment/SoftwareDevelopment.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './SoftwareDevelopment.css';

// Hero Background Image
import heroBg from '../../../assets/software-bg.jpg';

// Project Images - Placeholder URLs (change karna hai toh yahan change karo)
const project1Img = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80';
const project2Img = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80';
const project3Img = 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80';
const project4Img = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80';

const SoftwareDevelopment = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 600, once: true, offset: 80 });
  }, []);

  const projects = [
    {
      id: 1,
      name: "Enterprise ERP System",
      url: "https://example.com/erp-system",
      image: project1Img,
      description: "Comprehensive enterprise resource planning system with modules for finance, HR, procurement, and operations management.",
      category: "ERP Solution",
      tech: ["React", "Node.js", "PostgreSQL"]
    },
    {
      id: 2,
      name: "CRM Platform",
      url: "https://example.com/crm-platform",
      image: project2Img,
      description: "Customer relationship management platform with lead tracking, sales pipeline, automated workflows, and analytics dashboard.",
      category: "CRM Software",
      tech: ["Next.js", "Python", "MongoDB"]
    },
    {
      id: 3,
      name: "Inventory Management System",
      url: "https://example.com/inventory-system",
      image: project3Img,
      description: "Real-time inventory tracking system with barcode scanning, stock alerts, supplier management, and reporting tools.",
      category: "Inventory Software",
      tech: ["Vue.js", "Laravel", "MySQL"]
    },
    {
      id: 4,
      name: "HR & Payroll Management",
      url: "https://example.com/hr-payroll",
      image: project4Img,
      description: "Complete HR management solution with attendance tracking, payroll processing, leave management, and employee self-service portal.",
      category: "HR Software",
      tech: ["Angular", "Java", "SQL Server"]
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
    <div className="soft-page">

      {/* HERO */}
      <section className="soft-hero" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="soft-hero-overlay"></div>
        <div className="soft-container">
          <div className="soft-hero-content" data-aos="fade-up">
            <span className="soft-hero-tag">Software Development</span>
            <h1 className="soft-hero-title">Cloud-Based Business<br />Software Solutions</h1>
            <p className="soft-hero-desc">
              We build powerful, scalable, and secure cloud-based software solutions including 
              ERP, CRM, Inventory Management, HR Systems, and custom business dashboards 
              tailored to your business needs.
            </p>
            <div className="soft-hero-buttons">
              <Link to="/contact" className="soft-btn-primary">Start Your Project →</Link>
              <Link to="/contact" className="soft-btn-secondary">Free Consultation</Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGE */}
      <div className="soft-trust">
        <div className="soft-container">
          <p>Trusted By 100+ Businesses | 50+ Custom Software Solutions Delivered</p>
        </div>
      </div>

      {/* WHAT WE OFFER */}
      <section className="soft-offerings">
        <div className="soft-container">
          <div className="soft-section-header" data-aos="fade-up">
            <h2>What We Offer</h2>
            <p>Complete software solutions for modern businesses</p>
          </div>
          <div className="soft-offerings-grid">
            {[
              { icon: 'fas fa-chalkboard-user', name: 'ERP Systems' },
              { icon: 'fas fa-users', name: 'CRM Software' },
              { icon: 'fas fa-boxes', name: 'Inventory Management' },
              { icon: 'fas fa-chart-pie', name: 'Business Dashboards' },
              { icon: 'fas fa-cloud', name: 'Cloud-Based Solutions' },
              { icon: 'fas fa-chart-line', name: 'Analytics & Reporting' }
            ].map((item, i) => (
              <div className="soft-offer-card" key={i} data-aos="fade-up" data-aos-delay={50 + i * 50}>
                <i className={item.icon}></i>
                <h3>{item.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== RECENT PROJECTS - 3 CARDS GRID ========== */}
      <section className="soft-projects">
        <div className="soft-container">
          <div className="soft-projects-header" data-aos="fade-up">
            <div className="soft-projects-header-left">
              <span className="soft-projects-label">Selected Work</span>
              <h2>Recent Software Projects</h2>
            </div>
            <p className="soft-projects-subtitle">Real systems, real business impact</p>
          </div>

          <div className="soft-projects-grid">
            {projects.map((project, idx) => (
              <div 
                key={project.id} 
                className="soft-project-card"
                data-aos="fade-up"
                data-aos-delay={100 + idx * 100}
                onClick={() => openProject(project)}
              >
                <div className="soft-project-img">
                  <img src={project.image} alt={project.name} />
                  <div className="soft-project-overlay">
                    <span>View System</span>
                  </div>
                  <div className="soft-project-cat-tag">{project.category}</div>
                </div>
                <div className="soft-project-info">
                  <h3 className="soft-project-title">{project.name}</h3>
                  <p className="soft-project-desc">{project.description}</p>
                  <div className="soft-project-tech">
                    {project.tech.map((t, i) => (
                      <span key={i}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECT MODAL */}
      {selectedProject && (
        <div className="soft-modal-overlay" onClick={closeProject}>
          <div className="soft-modal" onClick={(e) => e.stopPropagation()}>
            <button className="soft-modal-close" onClick={closeProject}>
              <i className="fas fa-times"></i>
            </button>
            <div className="soft-modal-image">
              <img src={selectedProject.image} alt={selectedProject.name} />
            </div>
            <div className="soft-modal-body">
              <span className="soft-modal-cat">{selectedProject.category}</span>
              <h2>{selectedProject.name}</h2>
              <p className="soft-modal-desc">{selectedProject.description}</p>
              <div className="soft-modal-tech">
                {selectedProject.tech.map((t, i) => (
                  <span key={i}>{t}</span>
                ))}
              </div>
              <a href={selectedProject.url} target="_blank" rel="noopener noreferrer" className="soft-modal-btn">
                View Live System <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* PROCESS */}
      <section className="soft-process">
        <div className="soft-container">
          <div className="soft-section-header" data-aos="fade-up">
            <h2>Our Process</h2>
            <p>How we build your custom software</p>
          </div>
          <div className="soft-process-grid">
            {[
              { num: '01', icon: 'search', title: 'Requirement Analysis' },
              { num: '02', icon: 'drafting-compass', title: 'Architecture Design' },
              { num: '03', icon: 'code', title: 'Development' },
              { num: '04', icon: 'vial', title: 'Testing & QA' },
              { num: '05', icon: 'cloud-upload-alt', title: 'Cloud Deployment' }
            ].map((p, i) => (
              <div className="soft-process-card" key={i} data-aos="fade-up" data-aos-delay={50 + i * 50}>
                <span className="soft-process-num">{p.num}</span>
                <i className={`fas fa-${p.icon}`}></i>
                <h3>{p.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNOLOGIES */}
      <section className="soft-tech">
        <div className="soft-container">
          <div className="soft-section-header" data-aos="fade-up">
            <h2>Technologies We Master</h2>
            <p>Modern tech stack for enterprise software</p>
          </div>
          <div className="soft-tech-grid">
            {[
              { title: 'Frontend', items: ['React.js', 'Next.js', 'Angular', 'Vue.js', 'TypeScript'] },
              { title: 'Backend', items: ['Node.js', 'Python', 'Java', '.NET', 'Go'] },
              { title: 'Database', items: ['PostgreSQL', 'MongoDB', 'MySQL', 'SQL Server', 'Firebase'] },
              { title: 'Cloud & DevOps', items: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'CI/CD'] }
            ].map((g, i) => (
              <div className="soft-tech-group" key={i} data-aos="fade-up" data-aos-delay={i * 50}>
                <h4>{g.title}</h4>
                <div className="soft-tech-list">
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
      <section className="soft-faq">
        <div className="soft-container">
          <div className="soft-section-header" data-aos="fade-up">
            <h2>Frequently Asked Questions</h2>
            <p>Got questions about custom software?</p>
          </div>
          <div className="soft-faq-grid">
            {[
              { q: 'How long does it take to build custom software?', a: 'Typically 3-6 months depending on complexity and features.' },
              { q: 'Do you provide cloud hosting?', a: 'Yes, we deploy on AWS, Azure, or your preferred cloud.' },
              { q: 'Can you integrate with existing systems?', a: 'Yes, we integrate with ERPs, CRMs, and third-party APIs.' },
              { q: 'Do you provide maintenance?', a: 'Yes, we offer ongoing support and maintenance packages.' }
            ].map((f, i) => (
              <div className="soft-faq-item" key={i} data-aos="fade-up" data-aos-delay={50 + i * 50}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="soft-cta">
        <div className="soft-container">
          <h2 data-aos="fade-up">Ready to Build Your Custom Software?</h2>
          <p data-aos="fade-up" data-aos-delay="100">Let's digitize your business</p>
          <Link to="/contact" className="soft-btn-primary" data-aos="fade-up" data-aos-delay="200">Get a Free Quote →</Link>
        </div>
      </section>

    </div>
  );
};

export default SoftwareDevelopment;