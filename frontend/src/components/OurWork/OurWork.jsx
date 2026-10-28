import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaEye, FaUsers, FaStar } from 'react-icons/fa';
import axios from 'axios';
import './OurWork.css';

const API_URL = 'https://anax-inventions.onrender.com/api';

const OurWork = () => {
  const [projects, setProjects] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/projects?_t=${Date.now()}`);
      const data = res.data.projects || [];
      setProjects(data);
      if (data.length > 0) setActiveId(data[0]._id);
    } catch (err) { console.log('Using defaults'); }
    setLoading(false);
  };

  if (loading || projects.length === 0) return null;

  const activeProject = projects.find(p => p._id === activeId) || projects[0];

  return (
    <section className="ow-section">
      <div className="ow-bg-pattern" />
      <div className="ow-container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="ow-header">
          <div className="ow-header-tag"><span className="ow-header-dot" />PORTFOLIO SHOWCASE</div>
          <h2 className="ow-header-title">Featured <span className="ow-header-accent">Projects</span></h2>
        </motion.div>

        <div className="ow-workspace">
          {/* LEFT - Active Card with WHITE info area */}
          <motion.div key={activeId} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="ow-active-card">
            <div className="ow-active-image">
              <img src={activeProject.image} alt={activeProject.title} />
              <div className="ow-active-overlay" />
              <div className="ow-active-category">{activeProject.category}</div>
              <div className="ow-active-view"><FaEye /><span>View Case Study</span></div>
            </div>
            {/* WHITE CONTENT AREA */}
            <div className="ow-active-content">
              <h3 className="ow-active-title">{activeProject.title}</h3>
              <p className="ow-active-desc">{activeProject.description}</p>
              <div className="ow-active-stats">
                <div className="ow-stat"><FaUsers className="ow-stat-icon" /><span className="ow-stat-value">{activeProject.stats?.users || '0'}</span><span className="ow-stat-label">Users</span></div>
                <div className="ow-stat-line" />
                <div className="ow-stat"><FaStar className="ow-stat-icon" /><span className="ow-stat-value">{activeProject.stats?.rating || '5.0'}</span><span className="ow-stat-label">Rating</span></div>
              </div>
              <div className="ow-active-tags">{(activeProject.tags || []).map((tag, j) => (<span key={j} className="ow-tag">{tag}</span>))}</div>
              <a href={activeProject.link || '/portfolio'} className="ow-active-link"><span>Explore Project</span><FaExternalLinkAlt /></a>
            </div>
          </motion.div>

          {/* RIGHT - Grid */}
          <div className="ow-thumbnail-grid">
            {projects.map((project) => (
              <motion.div key={project._id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className={`ow-thumb-card ${activeId === project._id ? 'ow-thumb-active' : ''}`} onClick={() => setActiveId(project._id)}>
                <div className="ow-thumb-image"><img src={project.image} alt={project.title} />{activeId === project._id && <div className="ow-thumb-indicator" />}</div>
                <div className="ow-thumb-info"><h4 className="ow-thumb-title">{project.title}</h4><span className="ow-thumb-category">{project.category}</span></div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="ow-cta">
          <a href="/portfolio" className="ow-cta-btn">View All Projects <span>→</span></a>
        </motion.div>
      </div>
    </section>
  );
};

export default OurWork;