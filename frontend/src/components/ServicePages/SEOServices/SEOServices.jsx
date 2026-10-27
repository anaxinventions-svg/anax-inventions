// src/components/ServicePages/SEOServices/SEOServices.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './SEOServices.css';

// Premium Unsplash Images
const heroImg = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&h=600&fit=crop&q=80';
const whySeoImg = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=500&fit=crop&q=80';
const processImg = 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=500&fit=crop&q=80';
const resultImg1 = 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop&q=80';
const resultImg2 = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop&q=80';
const resultImg3 = 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=400&h=300&fit=crop&q=80';

const SEOServices = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [counters, setCounters] = useState({ clients: 0, keywords: 0, traffic: 0 });
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 100 });

    // Counter animation
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsVisible) {
          setStatsVisible(true);
          animateCounters();
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [statsVisible]);

  const animateCounters = () => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCounters({
        clients: Math.floor(150 * easeOut),
        keywords: Math.floor(5000 * easeOut),
        traffic: Math.floor(300 * easeOut),
      });

      if (step >= steps) clearInterval(timer);
    }, interval);
  };

  const seoTypes = [
    { icon: 'fa-store', title: 'E-Commerce SEO', desc: 'Boost product visibility and sales on search engines with optimized product pages and structured data.' },
    { icon: 'fa-chart-line', title: 'SEO Audit', desc: 'Identify gaps and create targeted strategy with comprehensive technical and content analysis.' },
    { icon: 'fa-location-dot', title: 'Local SEO', desc: 'Dominate local search results and Google Maps with optimized GMB profiles and local citations.' },
    { icon: 'fa-link', title: 'Link Building', desc: 'Build quality backlinks and domain authority through guest posting and outreach campaigns.' },
    { icon: 'fa-magnifying-glass-chart', title: 'Keyword Research', desc: 'Find high-value keywords your competitors miss with advanced research tools and analysis.' },
    { icon: 'fa-file-code', title: 'Technical SEO', desc: 'Fix crawl errors, improve site speed, and implement schema markup for better indexing.' },
  ];

  const processSteps = [
    { num: '01', title: 'Discovery', desc: 'Deep dive into your business, competitors, and current SEO performance.' },
    { num: '02', title: 'Strategy', desc: 'Craft a custom SEO roadmap tailored to your goals and budget.' },
    { num: '03', title: 'Execution', desc: 'Implement on-page, off-page, and technical optimizations.' },
    { num: '04', title: 'Measure', desc: 'Track rankings, traffic, and conversions with detailed analytics.' },
    { num: '05', title: 'Scale', desc: 'Continuously refine and expand your SEO for sustained growth.' },
  ];

  const results = [
    { img: resultImg1, client: 'Tech Startup', result: '+250%', metric: 'Organic Traffic', tag: 'SaaS' },
    { img: resultImg2, client: 'E-Commerce Brand', result: 'Top 3', metric: '50+ Keywords', tag: 'Retail' },
    { img: resultImg3, client: 'Local Business', result: '#1', metric: 'Google Maps', tag: 'Service' },
  ];

  const faqs = [
    { q: "How long does SEO take to show results?", a: "Typically 3-6 months to see significant improvements in rankings and traffic. SEO is a long-term investment that compounds over time." },
    { q: "Do you guarantee #1 rankings?", a: "No ethical SEO company can guarantee #1 rankings, but we guarantee measurable results and continuous improvements month over month." },
    { q: "What is included in an SEO audit?", a: "Our audit covers technical analysis, on-page review, backlink profile assessment, competitor analysis, and a detailed action plan with priorities." },
    { q: "Do you provide monthly reports?", a: "Yes, we provide detailed monthly reports with keyword rankings, traffic metrics, conversion data, and next steps." },
  ];

  return (
    <div className="seo-page">

      {/* ========== HERO - SPLIT PREMIUM ========== */}
      <section className="seo-hero">
        <div className="seo-hero-bg"></div>
        <div className="seo-container">
          <div className="seo-hero-grid">
            <div className="seo-hero-content" data-aos="fade-right" data-aos-duration="1000">
              <div className="seo-hero-badge">
                <i className="fas fa-rocket"></i>
                <span>#1 SEO Agency</span>
              </div>
              <h1 className="seo-hero-title">
                <span className="title-line">Dominate</span>
                <span className="title-line highlight">Google Rankings</span>
                <span className="title-line">& Drive Revenue</span>
              </h1>
              <p className="seo-hero-desc">
                Data-driven SEO strategies that turn your website into a 24/7 lead generation machine. 
                We do not just rank pages — we build digital assets that compound value.
              </p>
              <div className="seo-hero-buttons">
                <Link to="/contact" className="seo-btn-glow">Get Free SEO Audit <i className="fas fa-arrow-right"></i></Link>
                <Link to="/contact" className="seo-btn-outline">View Case Studies</Link>
              </div>
              <div className="seo-hero-trust">
                <div className="trust-avatars">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop" alt="Client" />
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop" alt="Client" />
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop" alt="Client" />
                  <span className="avatar-more">+147</span>
                </div>
                <p>Trusted by <strong>150+ businesses</strong> worldwide</p>
              </div>
            </div>
            <div className="seo-hero-visual" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="300">
              <div className="hero-image-wrap">
                <img src={heroImg} alt="SEO Analytics Dashboard" />
                <div className="floating-card card-1">
                  <i className="fas fa-arrow-trend-up"></i>
                  <div>
                    <span className="fc-label">Traffic Growth</span>
                    <span className="fc-value">+340%</span>
                  </div>
                </div>
                <div className="floating-card card-2">
                  <i className="fas fa-trophy"></i>
                  <div>
                    <span className="fc-label">Rankings</span>
                    <span className="fc-value">#1-3</span>
                  </div>
                </div>
                <div className="floating-card card-3">
                  <i className="fas fa-users"></i>
                  <div>
                    <span className="fc-label">Leads</span>
                    <span className="fc-value">+180%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* ========== STATS BAR - ANIMATED COUNTERS ========== */}
      <section className="seo-stats-bar" ref={statsRef}>
        <div className="seo-container">
          <div className="stats-grid">
            <div className="stat-box" data-aos="fade-up" data-aos-delay="0">
              <span className="stat-num">{counters.clients}+</span>
              <span className="stat-label">Clients Served</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-box" data-aos="fade-up" data-aos-delay="100">
              <span className="stat-num">{counters.keywords.toLocaleString()}+</span>
              <span className="stat-label">Keywords Ranked</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-box" data-aos="fade-up" data-aos-delay="200">
              <span className="stat-num">{counters.traffic}%</span>
              <span className="stat-label">Avg. Traffic Increase</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-box" data-aos="fade-up" data-aos-delay="300">
              <span className="stat-num">98%</span>
              <span className="stat-label">Client Retention</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== WHY SEO ========== */}
      <section className="seo-why">
        <div className="seo-container">
          <div className="seo-why-grid">
            <div className="seo-why-image" data-aos="fade-right">
              <div className="image-frame">
                <img src={whySeoImg} alt="Why SEO Matters" />
                <div className="image-badge">
                  <span className="badge-num">93%</span>
                  <span className="badge-text">of online experiences begin with a search engine</span>
                </div>
              </div>
            </div>
            <div className="seo-why-content" data-aos="fade-left">
              <span className="section-tag">Why Invest in SEO</span>
              <h2>SEO Is Not Optional.<br />It Is Survival.</h2>
              <p>
                In a world where 93% of online experiences start with a search engine, 
                being invisible on Google means being invisible to your customers. We turn 
                that invisibility into market dominance.
              </p>
              <div className="why-points">
                <div className="why-point">
                  <div className="point-icon"><i className="fas fa-check"></i></div>
                  <div className="point-text">
                    <h4>Organic Traffic Converts 14x Better</h4>
                    <p>Than outbound leads like direct mail or print ads</p>
                  </div>
                </div>
                <div className="why-point">
                  <div className="point-icon"><i className="fas fa-check"></i></div>
                  <div className="point-text">
                    <h4>75% Never Scroll Past Page 1</h4>
                    <p>If you are not on the first page, you do not exist</p>
                  </div>
                </div>
                <div className="why-point">
                  <div className="point-icon"><i className="fas fa-check"></i></div>
                  <div className="point-text">
                    <h4>SEO Compounds Over Time</h4>
                    <p>Unlike ads, SEO builds lasting digital assets</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PROCESS - TIMELINE STYLE ========== */}
      <section className="seo-process">
        <div className="seo-container">
          <div className="process-header" data-aos="fade-up">
            <span className="section-tag">Our Methodology</span>
            <h2>How We Deliver Results</h2>
            <p>A battle-tested process refined across 150+ campaigns</p>
          </div>
          <div className="process-timeline">
            {processSteps.map((step, idx) => (
              <div className="timeline-item" key={idx} data-aos="fade-up" data-aos-delay={idx * 100}>
                <div className="timeline-num">{step.num}</div>
                <div className="timeline-content">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
                <div className="timeline-line"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FULL WIDTH PROCESS IMAGE ========== */}
      <section className="seo-process-visual">
        <div className="process-visual-overlay"></div>
        <img src={processImg} alt="SEO Process Visualization" className="process-visual-img" />
        <div className="process-visual-content">
          <span className="pv-tag">End-to-End SEO</span>
          <h2>From Audit to Authority</h2>
          <p>Every touchpoint optimized for maximum search visibility</p>
        </div>
      </section>

      {/* ========== SERVICES - GRID CARDS ========== */}
      <section className="seo-services">
        <div className="seo-container">
          <div className="services-header" data-aos="fade-up">
            <span className="section-tag">What We Do</span>
            <h2>Full-Spectrum SEO Services</h2>
            <p>Everything you need to own your niche on Google</p>
          </div>
          <div className="services-grid">
            {seoTypes.map((type, idx) => (
              <div className="service-card" key={idx} data-aos="fade-up" data-aos-delay={idx * 80}>
                <div className="service-card-top">
                  <div className="service-icon">
                    <i className={`fas ${type.icon}`}></i>
                  </div>
                  <span className="service-num">0{idx + 1}</span>
                </div>
                <h3>{type.title}</h3>
                <p>{type.desc}</p>
                <div className="service-hover">
                  <span>Learn More <i className="fas fa-arrow-right"></i></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== RESULTS / CASE STUDIES ========== */}
      <section className="seo-results">
        <div className="seo-container">
          <div className="results-header" data-aos="fade-up">
            <span className="section-tag">Proven Results</span>
            <h2>Real Clients. Real Growth.</h2>
            <p>Numbers that speak louder than promises</p>
          </div>
          <div className="results-grid">
            {results.map((item, idx) => (
              <div className="result-card" key={idx} data-aos="fade-up" data-aos-delay={idx * 150}>
                <div className="result-image">
                  <img src={item.img} alt={item.client} />
                  <div className="result-tag">{item.tag}</div>
                </div>
                <div className="result-info">
                  <span className="result-client">{item.client}</span>
                  <div className="result-metric">
                    <span className="result-num">{item.result}</span>
                    <span className="result-label">{item.metric}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FAQ - ACCORDION ========== */}
      <section className="seo-faq">
        <div className="seo-container">
          <div className="faq-header" data-aos="fade-up">
            <span className="section-tag">FAQ</span>
            <h2>Questions? Answered.</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <div 
                className={`faq-item ${activeFaq === idx ? 'active' : ''}`} 
                key={idx}
                data-aos="fade-up" 
                data-aos-delay={idx * 60}
              >
                <button className="faq-trigger" onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
                  <span className="faq-q-num">0{idx + 1}</span>
                  <span className="faq-q-text">{faq.q}</span>
                  <span className="faq-icon">
                    <i className={`fas fa-${activeFaq === idx ? 'minus' : 'plus'}`}></i>
                  </span>
                </button>
                <div className="faq-panel">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA BANNER ========== */}
      <section className="seo-cta-banner">
        <div className="cta-banner-bg"></div>
        <div className="seo-container">
          <div className="cta-banner-content" data-aos="zoom-in">
            <h2>Ready to Own Page 1?</h2>
            <p>Get a free SEO audit worth $500. No strings attached.</p>
            <Link to="/contact" className="seo-btn-glow large">Claim Your Free Audit <i className="fas fa-arrow-right"></i></Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default SEOServices;