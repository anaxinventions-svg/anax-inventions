import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import './HeroEditor.css';

const API_URL = 'http://localhost:5001/api';

const HeroEditor = () => {
  const [formData, setFormData] = useState({
    badge: '',
    headingLine1: '',
    headingLine2: '',
    headingLine3: '',
    description: '',
    button1Text: '',
    button1Link: '',
    button2Text: '',
    button2Link: '',
    rotationInterval: 4000,
    serviceTexts: [
      { text: 'Web Development', color: '#cc7722' },
      { text: 'UI/UX Design', color: '#cc7722' },
      { text: 'Digital Marketing', color: '#cc7722' },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [newServiceText, setNewServiceText] = useState('');
  const [newServiceColor, setNewServiceColor] = useState('#cc7722');

  useEffect(() => { fetchContent(); }, []);

  const fetchContent = async () => {
    try {
      const res = await axios.get(`${API_URL}/content/hero`);
      if (res.data.content) {
        setFormData({
          badge: res.data.content.badge || '',
          headingLine1: res.data.content.headingLine1 || '',
          headingLine2: res.data.content.headingLine2 || '',
          headingLine3: res.data.content.headingLine3 || '',
          description: res.data.content.description || '',
          button1Text: res.data.content.button1Text || '',
          button1Link: res.data.content.button1Link || '',
          button2Text: res.data.content.button2Text || '',
          button2Link: res.data.content.button2Link || '',
          rotationInterval: res.data.content.rotationInterval || 4000,
          serviceTexts: res.data.content.serviceTexts || [
            { text: 'Web Development', color: '#cc7722' },
            { text: 'UI/UX Design', color: '#cc7722' },
            { text: 'Digital Marketing', color: '#cc7722' },
          ],
        });
      }
    } catch (err) {
      console.error('Failed to fetch hero content');
    }
    setFetching(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceTextChange = (index, field, value) => {
    const updated = [...formData.serviceTexts];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, serviceTexts: updated });
  };

  const addServiceText = () => {
    if (!newServiceText.trim()) {
      Swal.fire({ icon: 'warning', title: 'Empty Text', text: 'Please enter a service text first.', confirmButtonColor: '#cc7722', customClass: { popup: 'swal-modern-popup' } });
      return;
    }
    setFormData({ ...formData, serviceTexts: [...formData.serviceTexts, { text: newServiceText.trim(), color: newServiceColor }] });
    setNewServiceText('');
    Swal.fire({ icon: 'success', title: 'Added!', text: 'Service text added successfully.', timer: 1200, showConfirmButton: false, customClass: { popup: 'swal-modern-popup' } });
  };

  const removeServiceText = (index) => {
    Swal.fire({
      title: 'Remove Service?', text: `Remove "${formData.serviceTexts[index].text}"?`,
      icon: 'question', showCancelButton: true,
      confirmButtonColor: '#dc3545', cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Remove', cancelButtonText: 'Cancel',
      customClass: { popup: 'swal-modern-popup' }
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = formData.serviceTexts.filter((_, i) => i !== index);
        setFormData({ ...formData, serviceTexts: updated });
        Swal.fire({ icon: 'success', title: 'Removed!', timer: 1000, showConfirmButton: false, customClass: { popup: 'swal-modern-popup' } });
      }
    });
  };

  const moveServiceText = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === formData.serviceTexts.length - 1) return;
    const updated = [...formData.serviceTexts];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setFormData({ ...formData, serviceTexts: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.serviceTexts.length === 0) {
      Swal.fire({ icon: 'error', title: 'No Services', text: 'Please add at least one service text.', confirmButtonColor: '#cc7722', customClass: { popup: 'swal-modern-popup' } });
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/content/hero`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire({
        icon: 'success', title: '\u2705 Updated!',
        html: `<div style="text-align:center"><p style="margin-bottom:8px">Hero section updated successfully.</p><p style="font-size:0.8rem;color:#666">${formData.serviceTexts.length} service texts will rotate every ${formData.rotationInterval/1000}s</p></div>`,
        timer: 2000, showConfirmButton: false,
        customClass: { popup: 'swal-modern-popup' }
      });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error!', text: 'Failed to update hero content.', confirmButtonColor: '#dc3545', customClass: { popup: 'swal-modern-popup' } });
    }
    setLoading(false);
  };

  const [previewIndex, setPreviewIndex] = useState(0);
  useEffect(() => {
    if (!formData.serviceTexts.length) return;
    const interval = setInterval(() => {
      setPreviewIndex((prev) => (prev + 1) % formData.serviceTexts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [formData.serviceTexts]);

  if (fetching) {
    return <div className="hero-editor-loading">Loading editor...</div>;
  }

  return (
    <div className="hero-editor">
      <div className="hero-editor-header">
        <div className="hero-editor-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </div>
        <div>
          <h2>Hero Section Editor</h2>
          <p>Customize hero content & animated service rotation</p>
        </div>
      </div>

      {/* LIVE PREVIEW */}
      <div className="hero-preview-box">
        <div className="hero-preview-label">\ud83c\udfac Live Preview</div>
        <div className="hero-preview-content">
          <span className="preview-static">{formData.headingLine1 || 'We Craft'}</span>
          <span className="preview-animated">
            <AnimatePresence mode="wait">
              <motion.span
                key={previewIndex}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{ color: formData.serviceTexts[previewIndex]?.color || '#cc7722' }}
              >
                {formData.serviceTexts[previewIndex]?.text || 'Digital Products'}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="preview-static">{formData.headingLine3 || 'That Win'}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="hero-editor-form">

        {/* BASIC CONTENT */}
        <div className="editor-section">
          <div className="editor-section-title">
            <span className="section-icon">\u25c6</span>
            <h3>Basic Content</h3>
          </div>

          <div className="hero-editor-grid">
            <div className="hero-editor-field">
              <label>Badge Text</label>
              <input type="text" name="badge" value={formData.badge} onChange={handleChange} placeholder="Premium Digital Agency" />
            </div>
            <div className="hero-editor-field">
              <label>Heading Line 1</label>
              <input type="text" name="headingLine1" value={formData.headingLine1} onChange={handleChange} placeholder="We Craft" />
            </div>
            <div className="hero-editor-field">
              <label>Heading Line 2 (Static Fallback)</label>
              <input type="text" name="headingLine2" value={formData.headingLine2} onChange={handleChange} placeholder="Digital Products" />
            </div>
            <div className="hero-editor-field">
              <label>Heading Line 3</label>
              <input type="text" name="headingLine3" value={formData.headingLine3} onChange={handleChange} placeholder="That Win" />
            </div>
            <div className="hero-editor-field hero-editor-full">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Your agency description..." />
            </div>
            <div className="hero-editor-field">
              <label>Button 1 Text</label>
              <input type="text" name="button1Text" value={formData.button1Text} onChange={handleChange} />
            </div>
            <div className="hero-editor-field">
              <label>Button 1 Link</label>
              <input type="text" name="button1Link" value={formData.button1Link} onChange={handleChange} />
            </div>
            <div className="hero-editor-field">
              <label>Button 2 Text</label>
              <input type="text" name="button2Text" value={formData.button2Text} onChange={handleChange} />
            </div>
            <div className="hero-editor-field">
              <label>Button 2 Link</label>
              <input type="text" name="button2Link" value={formData.button2Link} onChange={handleChange} />
            </div>
            <div className="hero-editor-field">
              <label>Rotation Speed (ms)</label>
              <input type="number" name="rotationInterval" value={formData.rotationInterval} onChange={handleChange} min="1000" max="10000" step="500" />
              <small className="field-hint">{formData.rotationInterval/1000} seconds per service</small>
            </div>
          </div>
        </div>

        {/* SERVICE TEXTS MANAGER */}
        <div className="editor-section">
          <div className="editor-section-title">
            <span className="section-icon">\u25c6</span>
            <h3>Animated Service Texts ({formData.serviceTexts.length})</h3>
          </div>

          <div className="service-texts-list">
            {formData.serviceTexts.map((service, index) => (
              <motion.div key={index} className="service-text-item" layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="service-text-number">{index + 1}</div>
                <div className="service-text-inputs">
                  <input type="text" value={service.text} onChange={(e) => handleServiceTextChange(index, 'text', e.target.value)} placeholder="Service name..." className="service-text-input" />
                  <input type="color" value={service.color} onChange={(e) => handleServiceTextChange(index, 'color', e.target.value)} className="service-color-picker" title="Text Color" />
                </div>
                <div className="service-text-actions">
                  <button type="button" className="action-btn move-up" onClick={() => moveServiceText(index, 'up')} disabled={index === 0} title="Move Up">↑</button>
                  <button type="button" className="action-btn move-down" onClick={() => moveServiceText(index, 'down')} disabled={index === formData.serviceTexts.length - 1} title="Move Down">↓</button>
                  <button type="button" className="action-btn delete" onClick={() => removeServiceText(index)} title="Remove">🗑️</button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ADD NEW SERVICE */}
          <div className="add-service-box">
            <div className="add-service-inputs">
              <input type="text" value={newServiceText} onChange={(e) => setNewServiceText(e.target.value)} placeholder="Enter new service text..." className="add-service-text" onKeyPress={(e) => e.key === 'Enter' && addServiceText()} />
              <input type="color" value={newServiceColor} onChange={(e) => setNewServiceColor(e.target.value)} className="add-service-color" title="Choose color" />
            </div>
            <button type="button" className="add-service-btn" onClick={addServiceText}>+ Add Service</button>
          </div>
        </div>

        <button type="submit" className="hero-editor-save-btn" disabled={loading}>
          {loading ? '💾 Saving...' : '💾 Save All Changes'}
        </button>
      </form>
    </div>
  );
};

export default HeroEditor;