// src/components/ServicePages/AISolutions/AISolutions.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './AISolutions.css';

const AISolutions = ({ data }) => {
  return (
    <div className="ai-solutions-page">
      
      {/* ===== HERO SECTION ===== */}
      <section className="ai-hero">
        <div className="ai-container">
          <div className="ai-hero-content">
            <div className="ai-hero-icon">
              <i className="fas fa-brain"></i>
            </div>
            <span className="ai-category">AI SOLUTIONS</span>
            <h1 className="ai-title">{data?.title || 'AI Solutions'}</h1>
            <p className="ai-description">
              {data?.description || 'Transform your business with cutting-edge artificial intelligence. We build smart systems that learn, adapt, and deliver results.'}
            </p>
            <div className="ai-hero-buttons">
              <Link to="/contact" className="ai-btn-primary">
                Start AI Project <i className="fas fa-arrow-right"></i>
              </Link>
              <Link to="/portfolio" className="ai-btn-secondary">
                View AI Portfolio <i className="fas fa-eye"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== AI CAPABILITIES SECTION ===== */}
      <section className="ai-capabilities">
        <div className="ai-container">
          <h2 className="ai-section-title">Our AI Capabilities</h2>
          <div className="ai-capabilities-grid">
            <div className="ai-capability-card">
              <div className="ai-capability-icon">
                <i className="fas fa-robot"></i>
              </div>
              <h3>Chatbots & Virtual Assistants</h3>
              <p>Intelligent conversational AI that understands context and delivers human-like interactions 24/7.</p>
            </div>
            <div className="ai-capability-card">
              <div className="ai-capability-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Predictive Analytics</h3>
              <p>Data-driven insights and forecasting models that help you make smarter business decisions.</p>
            </div>
            <div className="ai-capability-card">
              <div className="ai-capability-icon">
                <i className="fas fa-image"></i>
              </div>
              <h3>Computer Vision</h3>
              <p>Visual recognition systems for object detection, facial recognition, and image analysis.</p>
            </div>
            <div className="ai-capability-card">
              <div className="ai-capability-icon">
                <i className="fas fa-language"></i>
              </div>
              <h3>NLP Solutions</h3>
              <p>Natural language processing for sentiment analysis, text summarization, and content generation.</p>
            </div>
            <div className="ai-capability-card">
              <div className="ai-capability-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>AI Security</h3>
              <p>Intelligent threat detection and fraud prevention systems powered by machine learning.</p>
            </div>
            <div className="ai-capability-card">
              <div className="ai-capability-icon">
                <i className="fas fa-cogs"></i>
              </div>
              <h3>Process Automation</h3>
              <p>Smart automation that learns your workflows and optimizes operations continuously.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== AI TECH STACK SECTION ===== */}
      <section className="ai-tech">
        <div className="ai-container">
          <h2 className="ai-section-title">AI Technologies We Use</h2>
          <div className="ai-tech-grid">
            <span className="ai-tech-tag">TensorFlow</span>
            <span className="ai-tech-tag">PyTorch</span>
            <span className="ai-tech-tag">OpenAI GPT</span>
            <span className="ai-tech-tag">LangChain</span>
            <span className="ai-tech-tag">Hugging Face</span>
            <span className="ai-tech-tag">Scikit-Learn</span>
            <span className="ai-tech-tag">Keras</span>
            <span className="ai-tech-tag">Pandas</span>
            <span className="ai-tech-tag">NumPy</span>
            <span className="ai-tech-tag">OpenCV</span>
            <span className="ai-tech-tag">spaCy</span>
            <span className="ai-tech-tag">NLTK</span>
          </div>
        </div>
      </section>

      {/* ===== HOW WE WORK SECTION ===== */}
      <section className="ai-process">
        <div className="ai-container">
          <h2 className="ai-section-title">Our AI Development Process</h2>
          <div className="ai-process-steps">
            <div className="ai-step">
              <div className="ai-step-number">01</div>
              <div className="ai-step-content">
                <h3>Data Collection</h3>
                <p>Gather and clean relevant data for training</p>
              </div>
            </div>
            <div className="ai-step">
              <div className="ai-step-number">02</div>
              <div className="ai-step-content">
                <h3>Model Design</h3>
                <p>Build custom AI architecture</p>
              </div>
            </div>
            <div className="ai-step">
              <div className="ai-step-number">03</div>
              <div className="ai-step-content">
                <h3>Training</h3>
                <p>Train and fine-tune models</p>
              </div>
            </div>
            <div className="ai-step">
              <div className="ai-step-number">04</div>
              <div className="ai-step-content">
                <h3>Deployment</h3>
                <p>Integrate into your systems</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="ai-stats">
        <div className="ai-container">
          <div className="ai-stats-grid">
            <div className="ai-stat">
              <span className="ai-stat-number">95%</span>
              <span className="ai-stat-label">Accuracy Rate</span>
            </div>
            <div className="ai-stat">
              <span className="ai-stat-number">50+</span>
              <span className="ai-stat-label">AI Models Built</span>
            </div>
            <div className="ai-stat">
              <span className="ai-stat-number">10x</span>
              <span className="ai-stat-label">Faster Processing</span>
            </div>
            <div className="ai-stat">
              <span className="ai-stat-number">24/7</span>
              <span className="ai-stat-label">AI Operations</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== USE CASES SECTION ===== */}
      <section className="ai-usecases">
        <div className="ai-container">
          <h2 className="ai-section-title">Industries We Serve</h2>
          <div className="ai-usecases-grid">
            <div className="ai-usecase-card">
              <i className="fas fa-hospital"></i>
              <h3>Healthcare</h3>
              <p>Diagnostic AI, patient monitoring, drug discovery</p>
            </div>
            <div className="ai-usecase-card">
              <i className="fas fa-shopping-cart"></i>
              <h3>E-Commerce</h3>
              <p>Recommendation engines, pricing optimization</p>
            </div>
            <div className="ai-usecase-card">
              <i className="fas fa-university"></i>
              <h3>Finance</h3>
              <p>Fraud detection, algorithmic trading, risk analysis</p>
            </div>
            <div className="ai-usecase-card">
              <i className="fas fa-industry"></i>
              <h3>Manufacturing</h3>
              <p>Predictive maintenance, quality control</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="ai-cta">
        <div className="ai-container">
          <h2>Ready to Harness AI?</h2>
          <p>Let's build intelligent solutions for your business</p>
          <Link to="/contact" className="ai-btn-primary">
            Start Your AI Journey <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default AISolutions;