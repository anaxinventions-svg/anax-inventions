import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './BannerServicesEditor.css';

const API_URL = 'http://localhost:5001/api';

const BannerServicesEditor = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    mainService: '', title: '', subtitle: '', description: '', 
    image: '', features: '', icon: 'FaCode',
    imageFile: null,
  });
  const fileInputRef = useRef(null);

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/banner/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(res.data.services || []);
    } catch (err) { console.error('Failed to fetch'); }
    setLoading(false);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => { if (e.target.files[0]) setFormData({ ...formData, imageFile: e.target.files[0] }); };

  const resetForm = () => {
    setFormData({ mainService: '', title: '', subtitle: '', description: '', image: '', features: '', icon: 'FaCode', imageFile: null });
    setEditing(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.mainService.trim() || !formData.title.trim()) {
      Swal.fire('Error!', 'Main Service & Title are required', 'error'); return;
    }
    const token = localStorage.getItem('token');
    const fd = new FormData();
    fd.append('mainService', formData.mainService);
    fd.append('title', formData.title);
    fd.append('subtitle', formData.subtitle);
    fd.append('description', formData.description);
    fd.append('features', formData.features);
    fd.append('icon', formData.icon);
    if (formData.imageFile) fd.append('image', formData.imageFile);
    else if (formData.image.trim()) fd.append('imageUrl', formData.image.trim());

    try {
      if (editing) {
        await axios.put(`${API_URL}/banner/${editing}`, fd, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        Swal.fire({ title: '✅ Updated!', icon: 'success', timer: 1500, showConfirmButton: false });
      } else {
        await axios.post(`${API_URL}/banner`, fd, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        Swal.fire({ title: '✅ Created!', icon: 'success', timer: 1500, showConfirmButton: false });
      }
      fetchServices(); resetForm();
    } catch (err) { Swal.fire('Error!', 'Failed', 'error'); }
  };

  const handleEdit = (s) => {
    setEditing(s._id);
    setFormData({
      mainService: s.mainService, title: s.title, subtitle: s.subtitle || '',
      description: s.description || '', image: s.image || '',
      features: (s.features || []).join(', '), icon: s.icon || 'FaCode', imageFile: null,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: 'Delete?', html: `Delete <strong>${title}</strong>?`, icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#e44', confirmButtonText: 'Delete',
    });
    if (result.isConfirmed) {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/banner/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchServices();
      Swal.fire({ title: 'Deleted!', icon: 'success', timer: 1500, showConfirmButton: false });
    }
  };

  const handleToggle = async (id, currentStatus) => {
    setServices(prev => prev.map(s => s._id === id ? { ...s, isActive: !currentStatus } : s));
    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append('isActive', !currentStatus);
      await axios.put(`${API_URL}/banner/${id}`, fd, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      fetchServices();
    } catch (err) {
      setServices(prev => prev.map(s => s._id === id ? { ...s, isActive: currentStatus } : s));
    }
  };

  return (
    <div className="services-editor">
      <div className="services-editor-header">
        <div className="se-header-left">
          <h2>🎯 Banner Services Manager</h2>
          <p>{services.length} banner items</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="services-form">
        <h3>{editing ? '✏️ Edit Banner Item' : '➕ Add Banner Item'}</h3>
        <div className="services-form-grid">
          <div className="se-field">
            <label>Main Service *</label>
            <input name="mainService" placeholder="e.g., Digital Marketing" value={formData.mainService} onChange={handleChange} required />
          </div>
          <div className="se-field">
            <label>Title *</label>
            <input name="title" placeholder="e.g., Facebook Ads" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="se-field">
            <label>Subtitle</label>
            <input name="subtitle" placeholder="Short tagline" value={formData.subtitle} onChange={handleChange} />
          </div>
          <div className="se-field">
            <label>Icon</label>
            <select name="icon" value={formData.icon} onChange={handleChange} className="se-select">
              <option value="FaCode">Code</option>
              <option value="FaPaintBrush">Design</option>
              <option value="FaSearch">SEO</option>
              <option value="FaBullhorn">Marketing</option>
              <option value="FaShoppingCart">E-Commerce</option>
              <option value="FaTools">Tools</option>
            </select>
          </div>
          <div className="se-field full">
            <label>Image</label>
            <div className="se-image-inputs">
              <input name="image" placeholder="Paste image URL" value={formData.image} onChange={handleChange} />
              <span className="se-or">OR</span>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="se-file-input" />
            </div>
          </div>
          <div className="se-field">
            <label>Features (comma separated)</label>
            <input name="features" placeholder="e.g., Audience Targeting, A/B Testing" value={formData.features} onChange={handleChange} />
          </div>
          <div className="se-field full">
            <label>Description</label>
            <textarea name="description" placeholder="Description..." value={formData.description} onChange={handleChange} rows={2} />
          </div>
        </div>
        <div className="services-form-actions">
          <button type="submit" className="se-save-btn">{editing ? '💾 Update' : '➕ Add'}</button>
          {editing && <button type="button" onClick={resetForm} className="se-cancel-btn">❌ Cancel</button>}
        </div>
      </form>

      <div className="services-list">
        <h3>📋 All Banner Items</h3>
        {loading ? <p className="se-loading">Loading...</p> : services.length === 0 ? (
          <p className="se-empty">No banner items yet.</p>
        ) : (
          services.map(s => (
            <div key={s._id} className={`service-item ${!s.isActive ? 'inactive-item' : ''}`}>
              <div className="service-item-info">
                <img src={s.image} alt={s.title} />
                <div>
                  <strong>{s.mainService} → {s.title}</strong>
                  <span>{s.subtitle}</span>
                </div>
              </div>
              <label className="se-toggle">
                <input type="checkbox" checked={s.isActive} onChange={() => handleToggle(s._id, s.isActive)} />
                <span className="se-toggle-slider"></span>
              </label>
              <div className="service-item-actions">
                <button onClick={() => handleEdit(s)}>✏️</button>
                <button onClick={() => handleDelete(s._id, s.title)}>🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BannerServicesEditor;