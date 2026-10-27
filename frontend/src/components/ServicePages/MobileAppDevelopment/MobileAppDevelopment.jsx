// src/components/ServicePages/MobileAppDevelopment/MobileAppDevelopment.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './MobileAppDevelopment.css';

// Hero Background Image
import heroBg from '../../../assets/mobile-app-bg.jpg';

// Project Images - Placeholder URLs (change karna hai toh yahan change karo)
const project1Img = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80';
const project2Img = 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80';
const project3Img = 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80';

const MobileAppDevelopment = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 600, once: true, offset: 80 });
  }, []);

  const projects = [
    {
      id: 1,
      name: "Food Delivery App",
      url: "https://example.com/food-app",
      image: project1Img,
      description: "Full-featured food delivery application with real-time tracking, multiple payment options, and restaurant management dashboard.",
      category: "Food & Delivery",
      tech: ["React Native", "Node.js", "Firebase"]
    },
    {
      id: 2,
      name: "Fitness Tracking App",
      url: "https://example.com/fitness-app",
      image: project2Img,
      description: "Comprehensive fitness tracking app with workout plans, progress analytics, nutrition logging, and social features.",
      category: "Health & Fitness",
      tech: ["Flutter", "Dart", "PostgreSQL"]
    },
    {
      id: 3,
      name: "E-Learning Platform",
      url: "https://example.com/learning-app",
      image: project3Img,
      description: "Interactive e-learning platform with video courses, quizzes, certificates, and live class scheduling.",
      category: "Education",
      tech: ["Swift", "SwiftUI", "Core Data"]
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
    <div className="appdev-page">

      {/* HERO */}
      <section className="appdev-hero" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="appdev-hero-overlay"></div>
        <div className="appdev-container">
          <div className="appdev-hero-content" data-aos="fade-up">
            <span className="appdev-hero-tag">Mobile App Development</span>
            <h1 className="appdev-hero-title">Innovative Mobile<br />App Solutions</h1>
            <p className="appdev-hero-desc">
              We build powerful, scalable, and user-friendly mobile applications for iOS and Android 
              platforms using React Native, Flutter, and native technologies.
            </p>
            <div className="appdev-hero-buttons">
              <Link to="/contact" className="appdev-btn-primary">Start Your App Journey →</Link>
              <Link to="/contact" className="appdev-btn-secondary">Free Consultation</Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGE */}
      <div className="appdev-trust">
        <div className="appdev-container">
          <p>Backed By Client Trust And Powered By Technology</p>
        </div>
      </div>

      {/* WHAT WE OFFER */}
      <section className="appdev-offerings">
        <div className="appdev-container">
          <div className="appdev-section-header" data-aos="fade-up">
            <h2>What We Offer</h2>
            <p>Comprehensive mobile solutions tailored to your needs</p>
          </div>
          <div className="appdev-offerings-grid">
            {[
              { icon: 'fab fa-react', name: 'React Native' },
              { icon: 'fas fa-mobile-alt', name: 'Flutter' },
              { icon: 'fab fa-apple', name: 'iOS (Swift)' },
              { icon: 'fab fa-android', name: 'Android (Kotlin)' },
              { icon: 'fas fa-cloud-upload-alt', name: 'App Publishing' },
              { icon: 'fas fa-tools', name: 'App Maintenance' }
            ].map((item, i) => (
              <div className="appdev-offer-card" key={i} data-aos="fade-up" data-aos-delay={50 + i * 50}>
                <i className={item.icon}></i>
                <h3>{item.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== RECENT PROJECTS - PROFESSIONAL CLEAN ========== */}
      <section className="appdev-projects">
        <div className="appdev-container">
          <div className="appdev-projects-header" data-aos="fade-up">
            <div className="appdev-projects-header-left">
              <span className="appdev-projects-label">Selected Work</span>
              <h2>Recent Projects</h2>
            </div>
            <p className="appdev-projects-subtitle">Real work, real results</p>
          </div>

          <div className="appdev-projects-list">
            {projects.map((project, idx) => (
              <div 
                key={project.id} 
                className="appdev-project-row"
                data-aos="fade-up"
                data-aos-delay={100 + idx * 100}
                onClick={() => openProject(project)}
              >
                <div className="appdev-project-row-img">
                  <img src={project.image} alt={project.name} />
                  <div className="appdev-project-row-overlay">
                    <span>View Project</span>
                  </div>
                </div>
                <div className="appdev-project-row-info">
                  <div className="appdev-project-row-top">
                    <span className="appdev-project-row-cat">{project.category}</span>
                    <span className="appdev-project-row-num">0{idx + 1}</span>
                  </div>
                  <h3 className="appdev-project-row-title">{project.name}</h3>
                  <p className="appdev-project-row-desc">{project.description}</p>
                  <div className="appdev-project-row-tech">
                    {project.tech.map((t, i) => (
                      <span key={i}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="appdev-project-row-arrow">
                  <i className="fas fa-arrow-right"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECT MODAL */}
      {selectedProject && (
        <div className="appdev-modal-overlay" onClick={closeProject}>
          <div className="appdev-modal" onClick={(e) => e.stopPropagation()}>
            <button className="appdev-modal-close" onClick={closeProject}>
              <i className="fas fa-times"></i>
            </button>
            <div className="appdev-modal-image">
              <img src={selectedProject.image} alt={selectedProject.name} />
            </div>
            <div className="appdev-modal-body">
              <span className="appdev-modal-cat">{selectedProject.category}</span>
              <h2>{selectedProject.name}</h2>
              <p className="appdev-modal-desc">{selectedProject.description}</p>
              <div className="appdev-modal-tech">
                {selectedProject.tech.map((t, i) => (
                  <span key={i}>{t}</span>
                ))}
              </div>
              <a href={selectedProject.url} target="_blank" rel="noopener noreferrer" className="appdev-modal-btn">
                Visit Live App <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* PROCESS */}
      <section className="appdev-process">
        <div className="appdev-container">
          <div className="appdev-section-header" data-aos="fade-up">
            <h2>Our Process</h2>
            <p>How we bring your app ideas to life</p>
          </div>
          <div className="appdev-process-grid">
            {[
              { num: '01', icon: 'lightbulb', title: 'Ideation' },
              { num: '02', icon: 'drafting-compass', title: 'UI/UX Design' },
              { num: '03', icon: 'code', title: 'Development' },
              { num: '04', icon: 'vial', title: 'Testing' },
              { num: '05', icon: 'rocket', title: 'Launch' }
            ].map((p, i) => (
              <div className="appdev-process-card" key={i} data-aos="fade-up" data-aos-delay={50 + i * 50}>
                <span className="appdev-process-num">{p.num}</span>
                <i className={`fas fa-${p.icon}`}></i>
                <h3>{p.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNOLOGIES */}
      <section className="appdev-tech">
        <div className="appdev-container">
          <div className="appdev-section-header" data-aos="fade-up">
            <h2>Technologies We Master</h2>
            <p>Cutting-edge mobile technologies</p>
          </div>
          <div className="appdev-tech-grid">
            {[
              { title: 'Cross Platform', items: ['React Native', 'Flutter', 'Ionic'] },
              { title: 'iOS', items: ['Swift', 'SwiftUI', 'Objective-C'] },
              { title: 'Android', items: ['Kotlin', 'Java', 'Jetpack Compose'] },
              { title: 'Backend & DB', items: ['Firebase', 'Node.js', 'MongoDB'] }
            ].map((g, i) => (
              <div className="appdev-tech-group" key={i} data-aos="fade-up" data-aos-delay={i * 50}>
                <h4>{g.title}</h4>
                <div className="appdev-tech-list">
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
      <section className="appdev-faq">
        <div className="appdev-container">
          <div className="appdev-section-header" data-aos="fade-up">
            <h2>Frequently Asked Questions</h2>
            <p>Got questions? We've got answers</p>
          </div>
          <div className="appdev-faq-grid">
            {[
              { q: 'How long does it take to build an app?', a: 'Typically 8-16 weeks depending on complexity.' },
              { q: 'Do you publish apps to App Store?', a: 'Yes, we handle the entire publishing process.' },
              { q: 'Do you provide post-launch support?', a: 'Yes, 3 months free support then affordable plans.' },
              { q: 'Can you integrate third-party APIs?', a: 'Yes, we integrate any API you need.' }
            ].map((f, i) => (
              <div className="appdev-faq-item" key={i} data-aos="fade-up" data-aos-delay={50 + i * 50}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="appdev-cta">
        <div className="appdev-container">
          <h2 data-aos="fade-up">Ready to Build Your Dream App?</h2>
          <p data-aos="fade-up" data-aos-delay="100">Let's create something amazing together</p>
          <Link to="/contact" className="appdev-btn-primary" data-aos="fade-up" data-aos-delay="200">Get a Free Quote →</Link>
        </div>
      </section>

    </div>
  );
};

export default MobileAppDevelopment;