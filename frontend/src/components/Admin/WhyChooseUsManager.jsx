import React, { useEffect, useState } from 'react';
import { whyChooseUsAPI } from '../../api/api';
import './Admin.css';

const WhyChooseUsManager = () => {
  const [data, setData] = useState({
    features: [],
    stats: []
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await whyChooseUsAPI.get();
      setData(res.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...data.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setData({ ...data, features: newFeatures });
  };

  const handleStatChange = (index, field, value) => {
    const newStats = [...data.stats];
    newStats[index] = { ...newStats[index], [field]: field === 'value' ? parseInt(value) || 0 : value };
    setData({ ...data, stats: newStats });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await whyChooseUsAPI.update(data);
      setMessage('✅ Updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error updating');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Why Choose Us</h1>
        <p>Manage features and statistics</p>
      </div>

      {message && <div className="admin-message">{message}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <h3 className="admin-section-title">Features</h3>
        {data.features.map((feature, index) => (
          <div key={feature.id} className="admin-feature-block">
            <h4>Feature {index + 1}</h4>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Icon (Emoji)</label>
                <input type="text" value={feature.icon} onChange={e => handleFeatureChange(index, 'icon', e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label>Title</label>
                <input type="text" value={feature.title} onChange={e => handleFeatureChange(index, 'title', e.target.value)} />
              </div>
            </div>
            <div className="admin-form-group">
              <label>Description</label>
              <textarea value={feature.description} onChange={e => handleFeatureChange(index, 'description', e.target.value)} rows="2" />
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Stat Value</label>
                <input type="text" value={feature.stat} onChange={e => handleFeatureChange(index, 'stat', e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label>Stat Label</label>
                <input type="text" value={feature.statLabel} onChange={e => handleFeatureChange(index, 'statLabel', e.target.value)} />
              </div>
            </div>
          </div>
        ))}

        <h3 className="admin-section-title">Statistics</h3>
        {data.stats.map((stat, index) => (
          <div key={index} className="admin-stat-block">
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Value</label>
                <input type="number" value={stat.value} onChange={e => handleStatChange(index, 'value', e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label>Suffix</label>
                <input type="text" value={stat.suffix} onChange={e => handleStatChange(index, 'suffix', e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label>Label</label>
                <input type="text" value={stat.label} onChange={e => handleStatChange(index, 'label', e.target.value)} />
              </div>
            </div>
          </div>
        ))}

        <button type="submit" className="admin-btn-primary">💾 Save All Changes</button>
      </form>
    </div>
  );
};

export default WhyChooseUsManager;