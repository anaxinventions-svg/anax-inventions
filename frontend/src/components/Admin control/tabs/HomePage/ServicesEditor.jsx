import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ServicesEditor.css';

const API_URL = 'http://localhost:5001/api';

const ServicesEditor = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '', icon: 'fa-folder', order: 0, description: '', isActive: true
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [categorySubmitting, setCategorySubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '', subtitle: '', description: '', image: '', features: '',
    icon: 'fa-cube', category: '',
    imageFile: null,
  });
  const fileInputRef = useRef(null);

  useEffect(() => { 
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/services/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(res.data.services || []);
    } catch (err) { 
      console.error('Failed to fetch services:', err);
      Swal.fire('Error!', 'Failed to load services.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/categories/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  // Category Management Functions
  const handleCategoryChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setCategoryFormData({ ...categoryFormData, [e.target.name]: value });
  };

  const resetCategoryForm = () => {
    setCategoryFormData({ name: '', icon: 'fa-folder', order: 0, description: '', isActive: true });
    setEditingCategory(null);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryFormData.name.trim()) {
      Swal.fire('Error!', 'Category name is required', 'error');
      return;
    }

    setCategorySubmitting(true);
    const token = localStorage.getItem('token');

    try {
      if (editingCategory) {
        await axios.put(`${API_URL}/categories/${editingCategory}`, categoryFormData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({ title: '✅ Updated!', icon: 'success', timer: 1500, showConfirmButton: false });
      } else {
        await axios.post(`${API_URL}/categories`, categoryFormData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({ title: '✅ Created!', icon: 'success', timer: 1500, showConfirmButton: false });
      }
      fetchCategories();
      resetCategoryForm();
    } catch (err) {
      Swal.fire('Error!', err.response?.data?.message || 'Failed', 'error');
    } finally {
      setCategorySubmitting(false);
    }
  };

  const handleEditCategory = (cat) => {
    setEditingCategory(cat._id);
    setCategoryFormData({
      name: cat.name,
      icon: cat.icon || 'fa-folder',
      order: cat.order || 0,
      description: cat.description || '',
      isActive: cat.isActive !== false
    });
  };

  const handleDeleteCategory = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Category?',
      html: `Delete <strong>${name}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e44',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });
    
    if (result.isConfirmed) {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCategories();
      Swal.fire({ title: 'Deleted!', icon: 'success', timer: 1500, showConfirmButton: false });
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Error!', 'Image size should be less than 5MB', 'error');
        e.target.value = '';
        return;
      }
      setFormData({ ...formData, imageFile: file });
    }
  };

  const resetForm = () => {
    setFormData({ 
      title: '', subtitle: '', description: '', image: '', features: '', 
      icon: 'fa-cube', category: '',
      imageFile: null 
    });
    setEditing(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) { 
      Swal.fire('Error!', 'Title is required', 'error'); 
      return; 
    }
    
    if (!formData.category) { 
      Swal.fire('Error!', 'Please select a category', 'error'); 
      return; 
    }

    setSubmitting(true);
    
    const token = localStorage.getItem('token');
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('subtitle', formData.subtitle || '');
    formDataToSend.append('description', formData.description || '');
    formDataToSend.append('features', formData.features);
    formDataToSend.append('icon', formData.icon);
    formDataToSend.append('category', formData.category);

    if (formData.imageFile) {
      formDataToSend.append('image', formData.imageFile);
    } else if (formData.image.trim()) {
      formDataToSend.append('imageUrl', formData.image.trim());
    }

    try {
      if (editing) {
        await axios.put(`${API_URL}/services/${editing}`, formDataToSend, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        Swal.fire({ title: '✅ Updated!', icon: 'success', timer: 2000, showConfirmButton: false });
      } else {
        await axios.post(`${API_URL}/services`, formDataToSend, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        Swal.fire({ title: '✅ Created!', icon: 'success', timer: 2000, showConfirmButton: false });
      }
      fetchServices();
      resetForm();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Something went wrong';
      if (errorMessage.includes('duplicate') || errorMessage.includes('slug')) {
        Swal.fire('Error!', 'A service with this title already exists.', 'error');
      } else {
        Swal.fire('Error!', errorMessage, 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (service) => {
    setEditing(service._id);
    setFormData({
      title: service.title,
      subtitle: service.subtitle || '',
      description: service.description || '',
      image: service.image || '',
      features: (service.features || []).join(', '),
      icon: service.icon || 'fa-cube',
      category: service.category || '',
      imageFile: null,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: 'Delete Service?',
      html: `Delete <strong>${title}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e44',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });
    
    if (result.isConfirmed) {
      setSubmitting(true);
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/services/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        await fetchServices();
        Swal.fire({ title: 'Deleted!', icon: 'success', timer: 1500, showConfirmButton: false });
      } catch (err) {
        Swal.fire('Error!', 'Failed to delete service.', 'error');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    setServices(prev => prev.map(s => s._id === id ? { ...s, isActive: newStatus } : s));
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/services/${id}`, { isActive: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      setServices(prev => prev.map(s => s._id === id ? { ...s, isActive: currentStatus } : s));
      Swal.fire('Error!', 'Failed to update status', 'error');
    }
  };

  const iconOptions = [
    { value: 'fa-globe', label: '🌐 Web Development' },
    { value: 'fa-mobile-alt', label: '📱 Mobile App' },
    { value: 'fa-code', label: '💻 Software' },
    { value: 'fa-cart-shopping', label: '🛒 E-Commerce' },
    { value: 'fa-cloud', label: '☁️ Cloud' },
    { value: 'fa-magnifying-glass-chart', label: '🔍 SEO' },
    { value: 'fa-google', label: '📊 Google Ads' },
    { value: 'fa-facebook', label: '📘 Facebook Ads' },
    { value: 'fa-share-nodes', label: '📱 Social Media' },
    { value: 'fa-envelope', label: '✉️ Email' },
    { value: 'fa-pen-fancy', label: '✍️ Content' },
    { value: 'fa-pen-ruler', label: '✏️ UI/UX' },
    { value: 'fa-paintbrush', label: '🎨 Graphics' },
    { value: 'fa-trademark', label: '™️ Logo' },
    { value: 'fa-film', label: '🎬 Motion Graphics' },
    { value: 'fa-brain', label: '🧠 AI' },
    { value: 'fa-robot', label: '🤖 Chatbot' },
    { value: 'fa-chalkboard-user', label: '👨‍🏫 Consulting' },
    { value: 'fa-shield-haltered', label: '🛡️ Security' },
    { value: 'fa-cube', label: '📦 Other' },
  ];

  const categoryIconOptions = [
    { value: 'fa-laptop-code', label: '💻 Development' },
    { value: 'fa-microchip', label: '🧠 AI Solutions' },
    { value: 'fa-chart-line', label: '📊 Marketing' },
    { value: 'fa-palette', label: '🎨 Design' },
    { value: 'fa-headset', label: '🎧 Consulting' },
    { value: 'fa-store', label: '🛒 E-Commerce' },
    { value: 'fa-cloud', label: '☁️ Cloud' },
    { value: 'fa-shield-haltered', label: '🛡️ Security' },
    { value: 'fa-folder', label: '📁 Other' },
  ];

  return (
    <div className="services-editor">
      <div className="services-editor-header">
        <div className="se-header-left">
          <h2>🛠️ Services Manager</h2>
          <p>{services.length} services</p>
        </div>
        <button 
          className="manage-categories-btn"
          onClick={() => setShowCategoryModal(true)}
        >
          <i className="fas fa-tags"></i> Manage Categories
        </button>
      </div>

      <form onSubmit={handleSubmit} className="services-form">
        <h3>{editing ? '✏️ Edit Service' : '➕ Add New Service'}</h3>
        <div className="services-form-grid">
          <div className="se-field full">
            <label>Title *</label>
            <input name="title" placeholder="e.g., SEO Services" value={formData.title} onChange={handleChange} required disabled={submitting} />
          </div>
          
          <div className="se-field">
            <label>Subtitle</label>
            <input name="subtitle" placeholder="e.g., Boost your rankings" value={formData.subtitle} onChange={handleChange} disabled={submitting} />
          </div>
          
          <div className="se-field">
            <label>Category *</label>
            <div className="category-select-wrapper">
              <select name="category" value={formData.category} onChange={handleChange} disabled={submitting} required>
                <option value="">-- Select Category --</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.key}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="se-field">
            <label>Icon</label>
            <select name="icon" value={formData.icon} onChange={handleChange} disabled={submitting}>
              {iconOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="icon-preview">
              <i className={`fas ${formData.icon}`} style={{ fontSize: '24px', color: '#cc7722' }}></i>
              <span>Preview</span>
            </div>
          </div>
          
          <div className="se-field">
            <label>Image</label>
            <div className="se-image-inputs">
              <input name="image" placeholder="Paste image URL" value={formData.image} onChange={handleChange} disabled={submitting} />
              <span className="se-or">OR</span>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="se-file-input" disabled={submitting} />
            </div>
            {formData.imageFile && <p className="se-file-name">📁 {formData.imageFile.name}</p>}
            {formData.image && !formData.imageFile && <img src={formData.image} alt="Preview" className="se-preview" />}
          </div>
          
          <div className="se-field">
            <label>Features (comma separated)</label>
            <input name="features" placeholder="e.g., On-Page SEO, Off-Page SEO" value={formData.features} onChange={handleChange} disabled={submitting} />
          </div>
          
          <div className="se-field full">
            <label>Description</label>
            <textarea name="description" placeholder="Service description..." value={formData.description} onChange={handleChange} rows={3} disabled={submitting} />
          </div>
        </div>
        <div className="services-form-actions">
          <button type="submit" className="se-save-btn" disabled={submitting}>
            {submitting ? <><span className="spinner"></span> {editing ? 'Updating...' : 'Adding...'}</> : (editing ? '💾 Update Service' : '➕ Add Service')}
          </button>
          {editing && !submitting && <button type="button" onClick={resetForm} className="se-cancel-btn">❌ Cancel</button>}
        </div>
      </form>

      <div className="services-list">
        <h3>📋 All Services</h3>
        {loading ? <p className="se-loading">Loading services...</p> : services.length === 0 ? <p className="se-empty">No services yet. Add your first one!</p> : (
          services.map(s => {
            const categoryName = categories.find(c => c.key === s.category)?.name || s.category;
            return (
              <div key={s._id} className={`service-item ${!s.isActive ? 'inactive-item' : ''}`}>
                <div className="service-item-info">
                  {s.image && <img src={s.image} alt={s.title} />}
                  <div>
                    <strong>{s.title}</strong>
                    <span>{s.subtitle}</span>
                    <div className="service-meta">
                      <i className={`fas ${s.icon || 'fa-cube'}`}></i> {categoryName}
                    </div>
                  </div>
                </div>
                <label className="se-toggle">
                  <input type="checkbox" checked={s.isActive} onChange={() => handleToggleActive(s._id, s.isActive)} />
                  <span className="se-toggle-slider"></span>
                </label>
                <div className="service-item-actions">
                  <button onClick={() => handleEdit(s)} title="Edit" disabled={submitting}>✏️</button>
                  <button onClick={() => handleDelete(s._id, s.title)} title="Delete" disabled={submitting}>🗑️</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Categories Modal */}
      {showCategoryModal && (
        <div className="modal-overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-tags"></i> Manage Categories</h3>
              <button className="modal-close" onClick={() => setShowCategoryModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleCategorySubmit} className="modal-form">
              <div className="modal-form-grid">
                <div className="modal-field full">
                  <label>Category Name *</label>
                  <input name="name" placeholder="e.g., Web Development" value={categoryFormData.name} onChange={handleCategoryChange} required disabled={categorySubmitting} />
                </div>
                <div className="modal-field">
                  <label>Icon</label>
                  <select name="icon" value={categoryFormData.icon} onChange={handleCategoryChange} disabled={categorySubmitting}>
                    {categoryIconOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="icon-preview">
                    <i className={`fas ${categoryFormData.icon}`} style={{ fontSize: '20px', color: '#cc7722' }}></i>
                  </div>
                </div>
                <div className="modal-field">
                  <label>Order</label>
                  <input type="number" name="order" placeholder="Display order" value={categoryFormData.order} onChange={handleCategoryChange} disabled={categorySubmitting} />
                </div>
                <div className="modal-field">
                  <label>Active</label>
                  <input type="checkbox" name="isActive" checked={categoryFormData.isActive} onChange={handleCategoryChange} disabled={categorySubmitting} />
                  <span style={{ marginLeft: '8px' }}>Show in navbar</span>
                </div>
                <div className="modal-field full">
                  <label>Description (Optional)</label>
                  <textarea name="description" placeholder="Category description..." value={categoryFormData.description} onChange={handleCategoryChange} rows={2} disabled={categorySubmitting} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="modal-save-btn" disabled={categorySubmitting}>
                  {categorySubmitting ? 'Saving...' : (editingCategory ? '💾 Update' : '➕ Create')}
                </button>
                {editingCategory && <button type="button" onClick={resetCategoryForm} className="modal-cancel-btn">Cancel Edit</button>}
              </div>
            </form>

            <div className="modal-categories-list">
              <h4>Existing Categories</h4>
              {categories.length === 0 ? (
                <p className="modal-empty">No categories yet. Create your first one!</p>
              ) : (
                categories.map(cat => (
                  <div key={cat._id} className={`modal-category-item ${!cat.isActive ? 'inactive' : ''}`}>
                    <div className="modal-category-info">
                      <i className={`fas ${cat.icon}`}></i>
                      <div>
                        <strong>{cat.name}</strong>
                        <span>{cat.key}</span>
                        {cat.description && <p>{cat.description}</p>}
                      </div>
                    </div>
                    <div className="modal-category-actions">
                      <button onClick={() => handleEditCategory(cat)} title="Edit">✏️</button>
                      <button onClick={() => handleDeleteCategory(cat._id, cat.name)} title="Delete">🗑️</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesEditor;