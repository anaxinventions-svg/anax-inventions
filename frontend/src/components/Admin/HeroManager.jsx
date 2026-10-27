import React, { useEffect, useState } from 'react';
import { heroAPI } from '../../api/api';
import './Admin.css';

const HeroManager = () => {
  const [hero, setHero] = useState({
    badge: '',
    titleLine1: '',
    titleLine2: '',
    titleLine3: '',
    description: '',
    primaryBtnText: '',
    primaryBtnLink: '',
    secondaryBtnText: '',
    secondaryBtnLink: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const res = await heroAPI.get();
      setHero(res.data);
    } catch (error) {
      console.error('Error fetching hero:', error);
    }
  };

  const handleChange = (e) => {
    setHero({ ...hero, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await heroAPI.update(hero);
      setMessage('✅ Hero section updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error updating hero section');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Hero Section</h1>
        <p>Manage your homepage hero content</p>
      </div>

      {message && <div className="admin-message">{message}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Badge Text</label>
            <input type="text" name="badge" value={hero.badge} onChange={handleChange} />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Title Line 1</label>
            <input type="text" name="titleLine1" value={hero.titleLine1} onChange={handleChange} />
          </div>
          <div className="admin-form-group">
            <label>Title Line 2 (Highlighted)</label>
            <input type="text" name="titleLine2" value={hero.titleLine2} onChange={handleChange} />
          </div>
          <div className="admin-form-group">
            <label>Title Line 3</label>
            <input type="text" name="titleLine3" value={hero.titleLine3} onChange={handleChange} />
          </div>
        </div>

        <div className="admin-form-group">
          <label>Description</label>
          <textarea name="description" value={hero.description} onChange={handleChange} rows="3" />
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Primary Button Text</label>
            <input type="text" name="primaryBtnText" value={hero.primaryBtnText} onChange={handleChange} />
          </div>
          <div className="admin-form-group">
            <label>Primary Button Link</label>
            <input type="text" name="primaryBtnLink" value={hero.primaryBtnLink} onChange={handleChange} />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Secondary Button Text</label>
            <input type="text" name="secondaryBtnText" value={hero.secondaryBtnText} onChange={handleChange} />
          </div>
          <div className="admin-form-group">
            <label>Secondary Button Link</label>
            <input type="text" name="secondaryBtnLink" value={hero.secondaryBtnLink} onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className="admin-btn-primary" disabled={loading}>
          {loading ? 'Saving...' : '💾 Save Changes'}
        </button>
      </form>

      <div className="admin-preview">
        <h3>Live Preview</h3>
        <div className="admin-hero-preview">
          <span className="preview-badge">{hero.badge}</span>
          <h1>
            {hero.titleLine1} <span style={{color: '#cc7722'}}>{hero.titleLine2}</span> {hero.titleLine3}
          </h1>
          <p>{hero.description}</p>
          <div className="preview-buttons">
            <span className="preview-btn-primary">{hero.primaryBtnText}</span>
            <span className="preview-btn-secondary">{hero.secondaryBtnText}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroManager;