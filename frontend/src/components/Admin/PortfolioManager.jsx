import React, { useEffect, useState } from 'react';
import { portfolioAPI, uploadAPI } from '../../api/api';
import { FaPlus, FaEdit, FaTrash, FaEye, FaStar } from 'react-icons/fa';
import './Admin.css';

const PortfolioManager = () => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');

  const emptyItem = {
    title: '',
    category: 'Web App',
    image: '',
    description: '',
    tags: ['', '', ''],
    stats: { users: '10K+', rating: '4.8' },
    challenge: '',
    solution: '',
    techStack: ['', '', '', ''],
    results: ['', '', ''],
    liveDemoLink: '',
    featuredOnHome: false,
    isActive: true
  };

  const [formData, setFormData] = useState(emptyItem);

  const categories = ['Web App', 'UI/UX', 'E-Commerce', 'SEO', 'Mobile', 'Fintech'];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await portfolioAPI.getAll();
      setItems(res.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
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
      setMessage('✅ Image uploaded!');
    } catch (error) {
      setMessage('❌ Upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      tags: formData.tags.filter(t => t.trim() !== ''),
      techStack: formData.techStack.filter(t => t.trim() !== ''),
      results: formData.results.filter(r => r.trim() !== '')
    };

    try {
      if (editingItem) {
        await portfolioAPI.update(editingItem._id, data);
        setMessage('✅ Project updated!');
      } else {
        await portfolioAPI.create(data);
        setMessage('✅ Project created!');
      }
      setShowForm(false);
      setEditingItem(null);
      setFormData(emptyItem);
      fetchItems();
    } catch (error) {
      setMessage('❌ Error saving project');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      ...item,
      tags: [...item.tags, '', ''].slice(0, 3),
      techStack: [...item.techStack, '', '', '', ''].slice(0, 4),
      results: [...item.results, '', ''].slice(0, 3)
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await portfolioAPI.delete(id);
      setMessage('✅ Deleted!');
      fetchItems();
    } catch (error) {
      setMessage('❌ Error');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Portfolio Manager</h1>
        <button className="admin-btn-primary" onClick={() => { setShowForm(true); setEditingItem(null); setFormData(emptyItem); }}>
          <FaPlus /> Add Project
        </button>
      </div>

      {message && <div className="admin-message">{message}</div>}

      {showForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal admin-modal-large">
            <h2>{editingItem ? 'Edit Project' : 'Add New Project'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Title</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="admin-form-group">
                  <label>Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Image</label>
                <div className="admin-image-upload">
                  {formData.image && <img src={formData.image} alt="Preview" className="admin-image-preview" />}
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                  <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="Or paste URL" />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Short Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="2" required />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Users Stat</label>
                  <input type="text" value={formData.stats.users} onChange={e => setFormData({...formData, stats: {...formData.stats, users: e.target.value}})} />
                </div>
                <div className="admin-form-group">
                  <label>Rating</label>
                  <input type="text" value={formData.stats.rating} onChange={e => setFormData({...formData, stats: {...formData.stats, rating: e.target.value}})} />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Tags</label>
                <div className="admin-tag-inputs">
                  {formData.tags.map((tag, i) => (
                    <input key={i} type="text" value={tag} onChange={e => {
                      const newTags = [...formData.tags];
                      newTags[i] = e.target.value;
                      setFormData({...formData, tags: newTags});
                    }} placeholder={`Tag ${i+1}`} />
                  ))}
                </div>
              </div>

              <div className="admin-form-group">
                <label>Challenge</label>
                <textarea value={formData.challenge} onChange={e => setFormData({...formData, challenge: e.target.value})} rows="2" />
              </div>

              <div className="admin-form-group">
                <label>Solution</label>
                <textarea value={formData.solution} onChange={e => setFormData({...formData, solution: e.target.value})} rows="2" />
              </div>

              <div className="admin-form-group">
                <label>Tech Stack</label>
                <div className="admin-tag-inputs">
                  {formData.techStack.map((tech, i) => (
                    <input key={i} type="text" value={tech} onChange={e => {
                      const newTech = [...formData.techStack];
                      newTech[i] = e.target.value;
                      setFormData({...formData, techStack: newTech});
                    }} placeholder={`Tech ${i+1}`} />
                  ))}
                </div>
              </div>

              <div className="admin-form-group">
                <label>Results</label>
                {formData.results.map((res, i) => (
                  <input key={i} type="text" value={res} onChange={e => {
                    const newRes = [...formData.results];
                    newRes[i] = e.target.value;
                    setFormData({...formData, results: newRes});
                  }} placeholder={`Result ${i+1}`} />
                ))}
              </div>

              <div className="admin-form-group">
                <label>Live Demo Link</label>
                <input type="text" value={formData.liveDemoLink} onChange={e => setFormData({...formData, liveDemoLink: e.target.value})} placeholder="https://..." />
              </div>

              <div className="admin-form-check">
                <input type="checkbox" checked={formData.featuredOnHome} onChange={e => setFormData({...formData, featuredOnHome: e.target.checked})} />
                <label>Featured on Homepage</label>
              </div>

              <div className="admin-form-actions">
                <button type="button" className="admin-btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="admin-btn-primary">{editingItem ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-grid">
        {items.map(item => (
          <div key={item._id} className={`admin-card ${item.featuredOnHome ? 'featured' : ''}`}>
            <div className="admin-card-image">
              <img src={item.image} alt={item.title} />
              {item.featuredOnHome && <span className="admin-featured-badge"><FaStar /> Featured</span>}
            </div>
            <div className="admin-card-body">
              <span className="admin-card-category">{item.category}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="admin-card-actions">
                <button className="admin-btn-icon" onClick={() => handleEdit(item)}><FaEdit /></button>
                <button className="admin-btn-icon danger" onClick={() => handleDelete(item._id)}><FaTrash /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioManager;