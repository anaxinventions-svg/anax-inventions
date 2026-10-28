// src/components/ServicePages/DynamicPage/DynamicPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import './DynamicPage.css';

const API_URL = 'https://anax-inventions.onrender.com/api';

const DynamicPage = () => {
  const { slug } = useParams();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 600, once: true, offset: 80 });
    fetchPageData();
  }, [slug]);

  const fetchPageData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/pages/${slug}`);
      if (response.data.success && response.data.page) {
        setPageData(response.data.page);
      } else {
        setPageData(null);
      }
    } catch (error) {
      console.error('Error fetching page:', error);
      setPageData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dp-loading">
        <div className="dp-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="dp-not-found">
        <h2>Page Not Configured</h2>
        <p>This page is currently being set up. Please check back later.</p>
        <Link to="/" className="dp-home-btn">Back to Home</Link>
      </div>
    );
  }

  const data = pageData;

  return (
    <div className="dp-page">
      
      {/* ========== HERO SECTION ========== */}
      <section 
        className="dp-hero" 
        style={{ backgroundImage: `url(${data.hero?.backgroundImage || ''})` }}
      >
        <div className="dp-hero-overlay"></div>
        <div className="dp-container">
          <div className="dp-hero-content" data-aos="fade-up">
            {data.hero?.tagline && (
              <span className="dp-hero-tag">{data.hero.tagline}</span>
            )}
            <h1 className="dp-hero-title">{data.hero?.title || 'Welcome'}</h1>
            <p className="dp-hero-desc">{data.hero?.description}</p>
            <div className="dp-hero-buttons">
              {data.hero?.primaryButtonText && (
                <Link to="/contact" className="dp-btn-primary">
                  {data.hero.primaryButtonText}
                </Link>
              )}
              {data.hero?.secondaryButtonText && (
                <Link to="/contact" className="dp-btn-secondary">
                  {data.hero.secondaryButtonText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========== TRUST BADGE ========== */}
      {data.trustBadge?.enabled !== false && data.trustBadge?.text && (
        <div className="dp-trust">
          <div className="dp-container">
            <p>{data.trustBadge.text}</p>
          </div>
        </div>
      )}

      {/* ========== WHAT WE OFFER ========== */}
      {data.whatWeOffer?.items?.length > 0 && (
        <section className="dp-offerings">
          <div className="dp-container">
            <div className="dp-section-header" data-aos="fade-up">
              <h2>{data.whatWeOffer.title || 'What We Offer'}</h2>
              <p>{data.whatWeOffer.subtitle}</p>
            </div>
            <div className="dp-offerings-grid">
              {data.whatWeOffer.items.map((item, idx) => (
                <div 
                  className="dp-offering-card" 
                  key={idx} 
                  data-aos="fade-up" 
                  data-aos-delay={50 + idx * 50}
                >
                  <i className={`fas ${item.icon}`}></i>
                  <h3>{item.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== RECENT PROJECTS ========== */}
      {data.recentProjects?.projects?.length > 0 && (
        <section className="dp-projects">
          <div className="dp-container">
            <div className="dp-projects-header" data-aos="fade-up">
              <h2>{data.recentProjects.title || 'Recent Projects'}</h2>
              <p>{data.recentProjects.subtitle}</p>
            </div>
            <div className="dp-projects-list">
              {data.recentProjects.projects
                .filter(p => p.isActive !== false)
                .map((project, idx) => (
                  <div 
                    key={idx} 
                    className="dp-project-row"
                    data-aos="fade-up"
                    data-aos-delay={100 + idx * 100}
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="dp-project-img">
                      <img src={project.imageUrl || '/placeholder.jpg'} alt={project.name} />
                      <div className="dp-project-overlay">
                        <span>View Project</span>
                      </div>
                    </div>
                    <div className="dp-project-info">
                      <div className="dp-project-cat">{project.category}</div>
                      <h3>{project.name}</h3>
                      <p>{project.description}</p>
                      <div className="dp-project-tech">
                        {project.techStack?.map((tech, i) => (
                          <span key={i}>{tech}</span>
                        ))}
                      </div>
                    </div>
                    <div className="dp-project-arrow">
                      <i className="fas fa-arrow-right"></i>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* PROJECT MODAL */}
      {selectedProject && (
        <div className="dp-modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="dp-modal" onClick={(e) => e.stopPropagation()}>
            <button className="dp-modal-close" onClick={() => setSelectedProject(null)}>
              <i className="fas fa-times"></i>
            </button>
            <div className="dp-modal-image">
              <img src={selectedProject.imageUrl} alt={selectedProject.name} />
            </div>
            <div className="dp-modal-body">
              <span className="dp-modal-cat">{selectedProject.category}</span>
              <h2>{selectedProject.name}</h2>
              <p className="dp-modal-desc">{selectedProject.description}</p>
              <div className="dp-modal-tech">
                {selectedProject.techStack?.map((tech, i) => (
                  <span key={i}>{tech}</span>
                ))}
              </div>
              <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="dp-modal-btn">
                Visit Live Website <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========== OUR PROCESS ========== */}
      {data.process?.steps?.length > 0 && (
        <section className="dp-process">
          <div className="dp-container">
            <div className="dp-section-header" data-aos="fade-up">
              <h2>{data.process.title || 'Our Process'}</h2>
              <p>{data.process.subtitle}</p>
            </div>
            <div className="dp-process-grid">
              {data.process.steps.map((step, idx) => (
                <div 
                  className="dp-process-card" 
                  key={idx} 
                  data-aos="fade-up" 
                  data-aos-delay={50 + idx * 50}
                >
                  <span className="dp-process-num">{step.number}</span>
                  <i className={`fas fa-${step.icon}`}></i>
                  <h3>{step.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== TECHNOLOGIES ========== */}
      {data.technologies?.categories?.length > 0 && (
        <section className="dp-tech">
          <div className="dp-container">
            <div className="dp-section-header" data-aos="fade-up">
              <h2>{data.technologies.title || 'Technologies We Master'}</h2>
              <p>{data.technologies.subtitle}</p>
            </div>
            <div className="dp-tech-grid">
              {data.technologies.categories.map((cat, idx) => (
                <div className="dp-tech-group" key={idx} data-aos="fade-up" data-aos-delay={idx * 50}>
                  <h4>{cat.name}</h4>
                  <div className="dp-tech-list">
                    {cat.items?.map((item, i) => (
                      <span key={i}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== FAQ ========== */}
      {data.faq?.items?.length > 0 && (
        <section className="dp-faq">
          <div className="dp-container">
            <div className="dp-section-header" data-aos="fade-up">
              <h2>{data.faq.title || 'Frequently Asked Questions'}</h2>
              <p>{data.faq.subtitle}</p>
            </div>
            <div className="dp-faq-grid">
              {data.faq.items.map((faq, idx) => (
                <div className="dp-faq-item" key={idx} data-aos="fade-up" data-aos-delay={50 + idx * 50}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== CTA SECTION ========== */}
      {data.cta?.title && (
        <section className="dp-cta">
          <div className="dp-container">
            <h2 data-aos="fade-up">{data.cta.title}</h2>
            <p data-aos="fade-up" data-aos-delay="100">{data.cta.subtitle}</p>
            <Link to={data.cta.buttonLink || '/contact'} className="dp-btn-primary" data-aos="fade-up" data-aos-delay={200}>
              {data.cta.buttonText || 'Get Started →'}
            </Link>
          </div>
        </section>
      )}

    </div>
  );
};

export default DynamicPage;