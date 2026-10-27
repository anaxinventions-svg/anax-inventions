// src/components/ServicePages/WebDevelopment/WebDevelopment.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './WebDevelopment.css';

import heroBg from '../../../assets/web.png';
import project1Img from '../../../assets/project1.jpg';
import project2Img from '../../../assets/project2.jpg';
import project3Img from '../../../assets/project3.jpg';

const WebDevelopment = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 600, once: true, offset: 80 });
  }, []);

  const projects = [
    {
      id: 1,
      name: "Immigration Canada Consultancy",
      url: "https://pristine-canada-immigration.com/",
      image: project1Img,
      description: "Canadian immigration consultancy platform with modern design and seamless user experience.",
      category: "Corporate",
      tech: ["React", "Node.js", "MongoDB"]
    },
    {
      id: 2,
      name: "Radiology Training UK",
      url: "https://ukrst.co.uk",
      image: project2Img,
      description: "Radiology training and certification platform for UK medical professionals.",
      category: "LMS Platform",
      tech: ["Next.js", "Express", "PostgreSQL"]
    },
    {
      id: 3,
      name: "Lawyer Company Austria",
      url: "https://www.ra-hoellwarth.at/",
      image: project3Img,
      description: "Professional legal services website for Austrian law firm with elegant design.",
      category: "Corporate",
      tech: ["React", "Laravel", "MySQL"]
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
    <div className="wd-page">

      {/* HERO */}
      <section className="wd-hero" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="wd-hero-overlay"></div>
        <div className="wd-container">
          <div className="wd-hero-content" data-aos="fade-up">
            <span className="wd-hero-tag">Web Development</span>
            <h1 className="wd-hero-title">Web Application<br />Development Solutions</h1>
            <p className="wd-hero-desc">
              We create fast, scalable, and user-friendly web applications that deliver smooth 
              performance, responsive design, and seamless user experience across all devices.
            </p>
            <div className="wd-hero-buttons">
              <Link to="/contact" className="btn-primary">Start Your Web Journey →</Link>
              <Link to="/contact" className="btn-secondary">Free Consultation</Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGE */}
      <div className="wd-trust">
        <div className="wd-container">
          <p>Backed By Client Trust And Powered By Technology</p>
        </div>
      </div>

      {/* WHAT WE OFFER */}
      <section className="wd-offerings">
        <div className="wd-container">
          <div className="section-header" data-aos="fade-up">
            <h2>What We Offer</h2>
            <p>Comprehensive web solutions tailored to your needs</p>
          </div>
          <div className="offerings-grid">
            {['E-Commerce', 'Corporate', 'Portfolio', 'Blog / Magazine', 'LMS Platform', 'Booking System'].map((item, i) => (
              <div className="offering-card" key={i} data-aos="fade-up" data-aos-delay={50 + i * 50}>
                <i className={`fas fa-${['store', 'building', 'landmark', 'blog', 'chalkboard-user', 'calendar-check'][i]}`}></i>
                <h3>{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== RECENT PROJECTS - PROFESSIONAL CLEAN ========== */}
      <section className="wd-projects">
        <div className="wd-container">
          <div className="projects-header" data-aos="fade-up">
            <div className="projects-header-left">
              <span className="projects-label">Selected Work</span>
              <h2>Recent Projects</h2>
            </div>
            <p className="projects-subtitle">Real work, real results</p>
          </div>

          <div className="projects-list">
            {projects.map((project, idx) => (
              <div 
                key={project.id} 
                className="project-row"
                data-aos="fade-up"
                data-aos-delay={100 + idx * 100}
                onClick={() => openProject(project)}
              >
                <div className="project-row-img">
                  <img src={project.image} alt={project.name} />
                  <div className="project-row-overlay">
                    <span>View Project</span>
                  </div>
                </div>
                <div className="project-row-info">
                  <div className="project-row-top">
                    <span className="project-row-cat">{project.category}</span>
                    <span className="project-row-num">0{idx + 1}</span>
                  </div>
                  <h3 className="project-row-title">{project.name}</h3>
                  <p className="project-row-desc">{project.description}</p>
                  <div className="project-row-tech">
                    {project.tech.map((t, i) => (
                      <span key={i}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="project-row-arrow">
                  <i className="fas fa-arrow-right"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECT MODAL */}
      {selectedProject && (
        <div className="project-modal-overlay" onClick={closeProject}>
          <div className="project-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeProject}>
              <i className="fas fa-times"></i>
            </button>
            <div className="modal-image">
              <img src={selectedProject.image} alt={selectedProject.name} />
            </div>
            <div className="modal-body">
              <span className="modal-cat">{selectedProject.category}</span>
              <h2>{selectedProject.name}</h2>
              <p className="modal-desc">{selectedProject.description}</p>
              <div className="modal-tech">
                {selectedProject.tech.map((t, i) => (
                  <span key={i}>{t}</span>
                ))}
              </div>
              <a href={selectedProject.url} target="_blank" rel="noopener noreferrer" className="modal-btn">
                Visit Live Website <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* PROCESS */}
      <section className="wd-process">
        <div className="wd-container">
          <div className="section-header" data-aos="fade-up">
            <h2>Our Process</h2>
            <p>How we bring your ideas to life</p>
          </div>
          <div className="process-grid">
            {[
              { num: '01', icon: 'search', title: 'Discovery' },
              { num: '02', icon: 'paintbrush', title: 'Design' },
              { num: '03', icon: 'code', title: 'Development' },
              { num: '04', icon: 'vial', title: 'Testing' },
              { num: '05', icon: 'rocket', title: 'Launch' }
            ].map((p, i) => (
              <div className="process-card" key={i} data-aos="fade-up" data-aos-delay={50 + i * 50}>
                <span className="process-num">{p.num}</span>
                <i className={`fas fa-${p.icon}`}></i>
                <h3>{p.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNOLOGIES */}
      <section className="wd-tech">
        <div className="wd-container">
          <div className="section-header" data-aos="fade-up">
            <h2>Technologies We Master</h2>
            <p>MERN Stack and beyond</p>
          </div>
          <div className="tech-grid-full">
            {[
              { title: 'Frontend', items: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Next.js', 'Vue.js', 'Bootstrap', 'Tailwind'] },
              { title: 'Backend', items: ['Node.js', 'Express.js', 'PHP', 'Laravel', 'Python', 'Django'] },
              { title: 'Database', items: ['MongoDB', 'MySQL', 'PostgreSQL', 'Firebase'] },
              { title: 'DevOps', items: ['AWS', 'Vercel', 'Netlify', 'Docker', 'Git'] }
            ].map((g, i) => (
              <div className="tech-group" key={i} data-aos="fade-up" data-aos-delay={i * 50}>
                <h4>{g.title}</h4>
                <div className="tech-list">
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
      <section className="wd-faq">
        <div className="wd-container">
          <div className="section-header" data-aos="fade-up">
            <h2>Frequently Asked Questions</h2>
            <p>Got questions? We've got answers</p>
          </div>
          <div className="faq-grid">
            {[
              { q: 'How long does it take to build a website?', a: 'Typically 2-6 weeks depending on complexity.' },
              { q: 'Do you provide maintenance?', a: 'Yes, 3 months free support then affordable plans.' },
              { q: 'Will my website be mobile-friendly?', a: 'Absolutely! Fully responsive on all devices.' },
              { q: 'Do you offer SEO services?', a: 'Yes, SEO-optimized websites and separate packages.' }
            ].map((f, i) => (
              <div className="faq-item" key={i} data-aos="fade-up" data-aos-delay={50 + i * 50}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="wd-cta">
        <div className="wd-container">
          <h2 data-aos="fade-up">Ready to Build Your Dream Website?</h2>
          <p data-aos="fade-up" data-aos-delay="100">Let's create something amazing together</p>
          <Link to="/contact" className="btn-primary" data-aos="fade-up" data-aos-delay="200">Get a Free Quote →</Link>
        </div>
      </section>

    </div>
  );
};

export default WebDevelopment;