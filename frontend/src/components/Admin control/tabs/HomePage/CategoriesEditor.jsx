// src/components/Admin control/tabs/HomePage/CategoriesEditor.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './CategoriesEditor.css';

const API_URL = 'https://anax-inventions.onrender.com/api';

const CategoriesEditor = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '', icon: 'fa-folder', order: 0, description: '', isActive: true
  });

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/categories/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const resetForm = () => {
    setFormData({ name: '', icon: 'fa-folder', order: 0, description: '', isActive: true });
    setEditing(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire('Error!', 'Category name is required', 'error');
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      if (editing) {
        await axios.put(`${API_URL}/categories/${editing}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({ title: '✅ Updated!', icon: 'success', timer: 1500, showConfirmButton: false });
      } else {
        await axios.post(`${API_URL}/categories`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({ title: '✅ Created!', icon: 'success', timer: 1500, showConfirmButton: false });
      }
      fetchCategories();
      resetForm();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to save category';
      Swal.fire('Error!', errorMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cat) => {
    setEditing(cat._id);
    setFormData({
      name: cat.name,
      icon: cat.icon || 'fa-folder',
      order: cat.order || 0,
      description: cat.description || '',
      isActive: cat.isActive !== false
    });
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Category?',
      html: `Delete <strong>${name}</strong>? Services in this category will remain but category will be removed.`,
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

  const iconOptions = [
    { value: 'fa-laptop-code', label: '💻 Development' },
    { value: 'fa-microchip', label: '🧠 AI Solutions' },
    { value: 'fa-chart-line', label: '📊 Marketing' },
    { value: 'fa-palette', label: '🎨 Design' },
    { value: 'fa-headset', label: '🎧 Consulting' },
    { value: 'fa-store', label: '🛒 E-Commerce' },
    { value: 'fa-cloud', label: '☁️ Cloud' },
    { value: 'fa-shield-haltered', label: '🛡️ Security' },
    { value: 'fa-globe', label: '🌐 Web' },
    { value: 'fa-mobile-alt', label: '📱 Mobile' },
    { value: 'fa-code', label: '💻 Code' },
    { value: 'fa-brain', label: '🧠 AI' },
    { value: 'fa-robot', label: '🤖 Robot' },
    { value: 'fa-folder', label: '📁 Other' },
  ];

  return (
    <div className="categories-editor">
      <div className="ce-header">
        <h2>📂 Categories Manager</h2>
        <p>{categories.length} categories</p>
      </div>

      <form onSubmit={handleSubmit} className="ce-form">
        <h3>{editing ? '✏️ Edit Category' : '➕ Add New Category'}</h3>
        <div className="ce-form-grid">
          <div className="ce-field full">
            <label>Category Name *</label>
            <input 
              name="name" 
              placeholder="e.g., Web Development" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              disabled={submitting}
            />
            <small style={{ fontSize: '10px', color: '#888', marginTop: '4px', display: 'block' }}>
              Unique name for your category (e.g., "Web Development", "Mobile Apps")
            </small>
          </div>
          
          <div className="ce-field">
            <label>Icon</label>
            <select name="icon" value={formData.icon} onChange={handleChange} disabled={submitting}>
              {iconOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="icon-preview">
              <i className={`fas ${formData.icon}`} style={{ fontSize: '20px', color: '#cc7722' }}></i>
            </div>
          </div>
          
          <div className="ce-field">
            <label>Order</label>
            <input 
              type="number" 
              name="order" 
              placeholder="Display order" 
              value={formData.order} 
              onChange={handleChange} 
              disabled={submitting}
            />
            <small style={{ fontSize: '10px', color: '#888' }}>Lower numbers appear first</small>
          </div>
          
          <div className="ce-field">
            <label>Active</label>
            <input 
              type="checkbox" 
              name="isActive" 
              checked={formData.isActive} 
              onChange={handleChange} 
              disabled={submitting}
            />
            <small style={{ fontSize: '10px', color: '#888', marginLeft: '8px' }}>Show in navbar</small>
          </div>
          
          <div className="ce-field full">
            <label>Description (Optional)</label>
            <textarea 
              name="description" 
              placeholder="Category description..." 
              value={formData.description} 
              onChange={handleChange} 
              rows={2} 
              disabled={submitting}
            />
          </div>
        </div>
        <div className="ce-actions">
          <button type="submit" className="ce-save-btn" disabled={submitting}>
            {submitting ? 'Saving...' : (editing ? '💾 Update' : '➕ Create')}
          </button>
          {editing && <button type="button" onClick={resetForm} className="ce-cancel-btn">Cancel</button>}
        </div>
      </form>

      <div className="ce-list">
        <h3>All Categories</h3>
        {loading ? <p>Loading...</p> : categories.length === 0 ? (
          <p className="ce-empty">No categories yet. Create your first one!</p>
        ) : (
          categories.map(cat => (
            <div key={cat._id} className={`ce-item ${!cat.isActive ? 'inactive' : ''}`}>
              <div className="ce-item-info">
                <i className={`fas ${cat.icon}`} style={{ color: '#cc7722', fontSize: '20px' }}></i>
                <div>
                  <strong>{cat.name}</strong>
                  <span>{cat.key}</span>
                  {cat.description && <p className="ce-desc">{cat.description}</p>}
                </div>
              </div>
              <div className="ce-item-actions">
                <button onClick={() => handleEdit(cat)} title="Edit">✏️</button>
                <button onClick={() => handleDelete(cat._id, cat.name)} title="Delete">🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoriesEditor;