import React, { useEffect, useState } from 'react';
import { testimonialsAPI, uploadAPI } from '../../api/api';
import { FaPlus, FaEdit, FaTrash, FaStar } from 'react-icons/fa';
import './Admin.css';

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');

  const emptyItem = {
    name: '',
    role: '',
    company: '',
    image: '',
    quote: '',
    rating: 5,
    project: '',
    isVerified: true,
    featuredOnHome: true,
    isActive: true
  };

  const [formData, setFormData] = useState(emptyItem);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await testimonialsAPI.getAll();
      setTestimonials(res.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formDataImg = new FormData();
    formDataImg.append('image', file);
    try {
      const res = await uploadAPI.uploadImage(formDataImg);
      setFormData(prev => ({ ...prev, image: res.data.url }));
    } catch (error) {
      setMessage('❌ Upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await testimonialsAPI.update(editingItem._id, formData);
        setMessage('✅ Updated!');
      } else {
        await testimonialsAPI.create(formData);
        setMessage('✅ Created!');
      }
      setShowForm(false);
      setEditingItem(null);
      setFormData(emptyItem);
      fetchTestimonials();
    } catch (error) {
      setMessage('❌ Error');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    try {
      await testimonialsAPI.delete(id);
      setMessage('✅ Deleted!');
      fetchTestimonials();
    } catch (error) {
      setMessage('❌ Error');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Testimonials Manager</h1>
        <button className="admin-btn-primary" onClick={() => { setShowForm(true); setEditingItem(null); setFormData(emptyItem); }}>
          <FaPlus /> Add Testimonial
        </button>
      </div>

      {message && <div className="admin-message">{message}</div>}

      {showForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h2>{editingItem ? 'Edit' : 'Add'} Testimonial</h2>
            <form onSubmit={handleSubmit}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="admin-form-group">
                  <label>Role</label>
                  <input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Company</label>
                  <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                </div>
                <div className="admin-form-group">
                  <label>Project</label>
                  <input type="text" value={formData.project} onChange={e => setFormData({...formData, project: e.target.value})} />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Photo</label>
                <div className="admin-image-upload">
                  {formData.image && <img src={formData.image} alt="" className="admin-image-preview" />}
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                  <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="Or URL" />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Quote</label>
                <textarea value={formData.quote} onChange={e => setFormData({...formData, quote: e.target.value})} rows="4" required />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Rating (1-5)</label>
                  <input type="number" min="1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})} />
                </div>
              </div>

              <div className="admin-form-check">
                <input type="checkbox" checked={formData.isVerified} onChange={e => setFormData({...formData, isVerified: e.target.checked})} />
                <label>Verified</label>
              </div>

              <div className="admin-form-check">
                <input type="checkbox" checked={formData.featuredOnHome} onChange={e => setFormData({...formData, featuredOnHome: e.target.checked})} />
                <label>Featured on Homepage</label>
              </div>

              <div className="admin-form-actions">
                <button type="button" className="admin-btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="admin-btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-grid">
        {testimonials.map(item => (
          <div key={item._id} className="admin-card testimonial-card">
            <div className="admin-card-header">
              <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} className="admin-avatar" />
              <div>
                <h4>{item.name}</h4>
                <span>{item.role}</span>
              </div>
              {item.isVerified && <span className="admin-verified">✓</span>}
            </div>
            <div className="admin-card-body">
              <div className="admin-stars">
                {[...Array(item.rating)].map((_, i) => <FaStar key={i} className="admin-star" />)}
              </div>
              <p>"{item.quote}"</p>
              <span className="admin-project-tag">{item.project}</span>
            </div>
            <div className="admin-card-actions">
              <button className="admin-btn-icon" onClick={() => handleEdit(item)}><FaEdit /></button>
              <button className="admin-btn-icon danger" onClick={() => handleDelete(item._id)}><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsManager;