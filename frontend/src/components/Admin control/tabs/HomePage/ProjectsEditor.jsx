import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ProjectsEditor.css';

const API_URL = 'http://localhost:5001/api';

const ProjectsEditor = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '', category: 'Web App', description: '', image: '',
    tags: '', statsUsers: '', statsRating: '', link: '/portfolio',
    imageFile: null,
  });
  const fileInputRef = useRef(null);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/projects/admin`, { headers: { Authorization: `Bearer ${token}` } });
      setProjects(res.data.projects || []);
    } catch (err) { console.error('Failed to fetch'); }
    setLoading(false);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => { if (e.target.files[0]) setFormData({ ...formData, imageFile: e.target.files[0] }); };

  const resetForm = () => {
    setFormData({ title: '', category: 'Web App', description: '', image: '', tags: '', statsUsers: '', statsRating: '', link: '/portfolio', imageFile: null });
    setEditing(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) { Swal.fire('Error!', 'Title required', 'error'); return; }
    const token = localStorage.getItem('token');
    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('category', formData.category);
    fd.append('description', formData.description);
    fd.append('tags', formData.tags);
    fd.append('statsUsers', formData.statsUsers);
    fd.append('statsRating', formData.statsRating);
    fd.append('link', formData.link);
    if (formData.imageFile) fd.append('image', formData.imageFile);
    else if (formData.image.trim()) fd.append('imageUrl', formData.image.trim());

    try {
      if (editing) {
        await axios.put(`${API_URL}/projects/${editing}`, fd, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
        Swal.fire({ title: '✅ Updated!', icon: 'success', timer: 1500, showConfirmButton: false });
      } else {
        await axios.post(`${API_URL}/projects`, fd, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
        Swal.fire({ title: '✅ Created!', icon: 'success', timer: 1500, showConfirmButton: false });
      }
      fetchProjects(); resetForm();
    } catch (err) { Swal.fire('Error!', 'Failed', 'error'); }
  };

  const handleEdit = (p) => {
    setEditing(p._id);
    setFormData({
      title: p.title, category: p.category || 'Web App', description: p.description || '',
      image: p.image || '', tags: (p.tags || []).join(', '),
      statsUsers: p.stats?.users || '', statsRating: p.stats?.rating || '',
      link: p.link || '/portfolio', imageFile: null,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({ title: 'Delete?', html: `Delete <strong>${title}</strong>?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#e44', confirmButtonText: 'Delete' });
    if (result.isConfirmed) {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/projects/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchProjects();
      Swal.fire({ title: 'Deleted!', icon: 'success', timer: 1500, showConfirmButton: false });
    }
  };

  const handleToggle = async (id, currentStatus) => {
    setProjects(prev => prev.map(p => p._id === id ? { ...p, isActive: !currentStatus } : p));
    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append('isActive', !currentStatus);
      await axios.put(`${API_URL}/projects/${id}`, fd, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
      fetchProjects();
    } catch (err) { setProjects(prev => prev.map(p => p._id === id ? { ...p, isActive: currentStatus } : p)); }
  };

  return (
    <div className="services-editor">
      <div className="services-editor-header"><div className="se-header-left"><h2>📁 Projects Manager</h2><p>{projects.length} projects</p></div></div>
      <form onSubmit={handleSubmit} className="services-form">
        <h3>{editing ? '✏️ Edit Project' : '➕ Add Project'}</h3>
        <div className="services-form-grid">
          <div className="se-field"><label>Title *</label><input name="title" placeholder="Project name" value={formData.title} onChange={handleChange} required /></div>
          <div className="se-field"><label>Category</label><select name="category" value={formData.category} onChange={handleChange} className="se-select"><option>Web App</option><option>UI/UX</option><option>E-Commerce</option><option>SEO</option><option>Mobile</option><option>Fintech</option></select></div>
          <div className="se-field"><label>Users Stats</label><input name="statsUsers" placeholder="e.g., 50K+" value={formData.statsUsers} onChange={handleChange} /></div>
          <div className="se-field"><label>Rating</label><input name="statsRating" placeholder="e.g., 4.9" value={formData.statsRating} onChange={handleChange} /></div>
          <div className="se-field full"><label>Image</label><div className="se-image-inputs"><input name="image" placeholder="URL" value={formData.image} onChange={handleChange} /><span className="se-or">OR</span><input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="se-file-input" /></div></div>
          <div className="se-field"><label>Tags (comma)</label><input name="tags" placeholder="React, Node.js" value={formData.tags} onChange={handleChange} /></div>
          <div className="se-field"><label>Link</label><input name="link" placeholder="/portfolio" value={formData.link} onChange={handleChange} /></div>
          <div className="se-field full"><label>Description</label><textarea name="description" placeholder="Description..." value={formData.description} onChange={handleChange} rows={2} /></div>
        </div>
        <div className="services-form-actions"><button type="submit" className="se-save-btn">{editing ? '💾 Update' : '➕ Add'}</button>{editing && <button type="button" onClick={resetForm} className="se-cancel-btn">❌ Cancel</button>}</div>
      </form>
      <div className="services-list">
        <h3>📋 All Projects</h3>
        {loading ? <p className="se-loading">Loading...</p> : projects.length === 0 ? <p className="se-empty">No projects yet.</p> : projects.map(p => (
          <div key={p._id} className={`service-item ${!p.isActive ? 'inactive-item' : ''}`}>
            <div className="service-item-info"><img src={p.image} alt={p.title} /><div><strong>{p.title}</strong><span>{p.category} | ⭐{p.stats?.rating}</span></div></div>
            <label className="se-toggle"><input type="checkbox" checked={p.isActive} onChange={() => handleToggle(p._id, p.isActive)} /><span className="se-toggle-slider"></span></label>
            <div className="service-item-actions"><button onClick={() => handleEdit(p)}>✏️</button><button onClick={() => handleDelete(p._id, p.title)}>🗑️</button></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsEditor;