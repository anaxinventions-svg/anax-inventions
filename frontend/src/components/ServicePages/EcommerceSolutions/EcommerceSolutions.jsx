// src/components/ServicePages/EcommerceSolutions/EcommerceSolutions.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './EcommerceSolutions.css';

// Hero Background Image
import heroBg from '../../../assets/ecommerce-bg.jpg';

// Project Images - Placeholder URLs (change karna hai toh yahan change karo)
const project1Img = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80';
const project2Img = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80';
const project3Img = 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80';

const EcommerceSolutions = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 600, once: true, offset: 80 });
  }, []);

  const projects = [
    {
      id: 1,
      name: "Fashion E-Commerce Store",
      url: "https://example.com/fashion-store",
      image: project1Img,
      description: "Modern fashion e-commerce platform with advanced filtering, wishlist, secure checkout, and real-time inventory management.",
      category: "Fashion",
      tech: ["React", "Node.js", "Stripe"]
    },
    {
      id: 2,
      name: "Electronics Marketplace",
      url: "https://example.com/electronics",
      image: project2Img,
      description: "Multi-vendor electronics marketplace with product comparison, reviews, deals section, and vendor dashboard.",
      category: "Electronics",
      tech: ["Next.js", "MongoDB", "PayPal"]
    },
    {
      id: 3,
      name: "Organic Grocery Store",
      url: "https://example.com/grocery",
      image: project3Img,
      description: "Organic grocery delivery platform with subscription boxes, delivery scheduling, and loyalty rewards program.",
      category: "Grocery",
      tech: ["Vue.js", "Laravel", "Razorpay"]
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
            <span className="ecom-hero-tag">E-Commerce Solutions</span>
            <h1 className="ecom-hero-title">E-Commerce<br />Development Solutions</h1>
            <p className="ecom-hero-desc">
              We build powerful, scalable, and conversion-focused online stores that drive sales 
              and deliver seamless shopping experiences across all devices.
            </p>
            <div className="ecom-hero-buttons">
              <Link to="/contact" className="ecom-btn-primary">Start Your Store →</Link>
              <Link to="/contact" className="ecom-btn-secondary">Free Consultation</Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGE */}
      <div className="ecom-trust">
        <div className="ecom-container">
          <p>Backed By Client Trust And Powered By Technology</p>
        </div>
      </div>

      {/* WHAT WE OFFER */}
      <section className="ecom-offerings">
        <div className="ecom-container">
          <div className="ecom-section-header" data-aos="fade-up">
            <h2>What We Offer</h2>
            <p>Comprehensive e-commerce solutions tailored to your business</p>
          </div>
          <div className="ecom-offerings-grid">
            {[
              { icon: 'fas fa-shopping-cart', name: 'Online Store' },
              { icon: 'fas fa-mobile-alt', name: 'Mobile Commerce' },
              { icon: 'fas fa-users', name: 'Multi-Vendor' },
              { icon: 'fas fa-box-open', name: 'Dropshipping' },
              { icon: 'fas fa-credit-card', name: 'Payment Gateway' },
              { icon: 'fas fa-chart-line', name: 'Analytics' }
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
            <p className="ecom-projects-subtitle">Real stores, real sales</p>
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
                Visit Live Store <i className="fas fa-arrow-right"></i>
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
            <p>How we build your online store</p>
          </div>
          <div className="ecom-process-grid">
            {[
              { num: '01', icon: 'search', title: 'Discovery' },
              { num: '02', icon: 'pencil-ruler', title: 'Design' },
              { num: '03', icon: 'code', title: 'Development' },
              { num: '04', icon: 'vial', title: 'Testing' },
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
            <p>Cutting-edge e-commerce technologies</p>
          </div>
          <div className="ecom-tech-grid">
            {[
              { title: 'Platforms', items: ['Shopify', 'WooCommerce', 'Magento', 'BigCommerce'] },
              { title: 'Frontend', items: ['React', 'Next.js', 'Vue.js', 'Tailwind'] },
              { title: 'Backend', items: ['Node.js', 'Laravel', 'Python', 'Django'] },
              { title: 'Payments', items: ['Stripe', 'PayPal', 'Razorpay', 'Square'] }
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
              { q: 'How long does it take to build an online store?', a: 'Typically 4-8 weeks depending on features and complexity.' },
              { q: 'Do you integrate payment gateways?', a: 'Yes, we integrate Stripe, PayPal, Razorpay, and more.' },
              { q: 'Will my store be mobile-friendly?', a: 'Absolutely! Fully responsive on all devices.' },
              { q: 'Do you provide inventory management?', a: 'Yes, with real-time stock tracking and alerts.' }
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
          <h2 data-aos="fade-up">Ready to Launch Your Online Store?</h2>
          <p data-aos="fade-up" data-aos-delay="100">Let's build something profitable together</p>
          <Link to="/contact" className="ecom-btn-primary" data-aos="fade-up" data-aos-delay="200">Get a Free Quote →</Link>
        </div>
      </section>

    </div>
  );
};

export default EcommerceSolutions;