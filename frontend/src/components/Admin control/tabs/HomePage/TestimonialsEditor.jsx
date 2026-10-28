import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ProjectsEditor.css';

const API_URL = 'https://anax-inventions.onrender.com/api';

const TestimonialsEditor = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '', role: '', quote: '', image: '', rating: '5', project: '', imageFile: null,
  });
  const fileInputRef = useRef(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/testimonials/admin`, { headers: { Authorization: `Bearer ${token}` } });
      setTestimonials(res.data.testimonials || []);
    } catch (err) { console.error('Failed'); }
    setLoading(false);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => { if (e.target.files[0]) setFormData({ ...formData, imageFile: e.target.files[0] }); };
  const resetForm = () => {
    setFormData({ name: '', role: '', quote: '', image: '', rating: '5', project: '', imageFile: null });
    setEditing(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.quote.trim()) { Swal.fire('Error!', 'Name & Quote required', 'error'); return; }
    const token = localStorage.getItem('token');
    const fd = new FormData();
    fd.append('name', formData.name); fd.append('role', formData.role);
    fd.append('quote', formData.quote); fd.append('rating', formData.rating);
    fd.append('project', formData.project);
    if (formData.imageFile) fd.append('image', formData.imageFile);
    else if (formData.image.trim()) fd.append('imageUrl', formData.image.trim());
    try {
      if (editing) {
        await axios.put(`${API_URL}/testimonials/${editing}`, fd, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
        Swal.fire({ title: '✅ Updated!', icon: 'success', timer: 1500, showConfirmButton: false });
      } else {
        await axios.post(`${API_URL}/testimonials`, fd, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
        Swal.fire({ title: '✅ Created!', icon: 'success', timer: 1500, showConfirmButton: false });
      }
      fetchData(); resetForm();
    } catch (err) { Swal.fire('Error!', 'Failed', 'error'); }
  };

  const handleEdit = (t) => {
    setEditing(t._id);
    setFormData({ name: t.name, role: t.role || '', quote: t.quote, image: t.image || '', rating: String(t.rating || 5), project: t.project || '', imageFile: null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({ title: 'Delete?', html: `Delete <strong>${name}</strong>?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#e44', confirmButtonText: 'Delete' });
    if (result.isConfirmed) {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/testimonials/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchData(); Swal.fire({ title: 'Deleted!', icon: 'success', timer: 1500, showConfirmButton: false });
    }
  };

  const handleToggle = async (id, currentStatus) => {
    setTestimonials(prev => prev.map(t => t._id === id ? { ...t, isActive: !currentStatus } : t));
    try {
      const token = localStorage.getItem('token');
      const fd = new FormData(); fd.append('isActive', !currentStatus);
      await axios.put(`${API_URL}/testimonials/${id}`, fd, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
      fetchData();
    } catch (err) { setTestimonials(prev => prev.map(t => t._id === id ? { ...t, isActive: currentStatus } : t)); }
  };

  return (
    <div className="services-editor">
      <div className="services-editor-header"><div className="se-header-left"><h2>💬 Testimonials Manager</h2><p>{testimonials.length} testimonials</p></div></div>
      <form onSubmit={handleSubmit} className="services-form">
        <h3>{editing ? '✏️ Edit' : '➕ Add'} Testimonial</h3>
        <div className="services-form-grid">
          <div className="se-field"><label>Name *</label><input name="name" placeholder="Client name" value={formData.name} onChange={handleChange} required /></div>
          <div className="se-field"><label>Role</label><input name="role" placeholder="CEO, Company" value={formData.role} onChange={handleChange} /></div>
          <div className="se-field"><label>Rating</label><select name="rating" value={formData.rating} onChange={handleChange} className="se-select"><option>5</option><option>4</option><option>3</option></select></div>
          <div className="se-field"><label>Project</label><input name="project" placeholder="Web Development" value={formData.project} onChange={handleChange} /></div>
          <div className="se-field full"><label>Image</label><div className="se-image-inputs"><input name="image" placeholder="URL" value={formData.image} onChange={handleChange} /><span className="se-or">OR</span><input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="se-file-input" /></div></div>
          <div className="se-field full"><label>Quote *</label><textarea name="quote" placeholder="Client testimonial..." value={formData.quote} onChange={handleChange} rows={3} required /></div>
        </div>
        <div className="services-form-actions"><button type="submit" className="se-save-btn">{editing ? '💾 Update' : '➕ Add'}</button>{editing && <button type="button" onClick={resetForm} className="se-cancel-btn">❌ Cancel</button>}</div>
      </form>
      <div className="services-list">
        <h3>📋 All Testimonials</h3>
        {loading ? <p className="se-loading">Loading...</p> : testimonials.length === 0 ? <p className="se-empty">No testimonials yet.</p> : testimonials.map(t => (
          <div key={t._id} className={`service-item ${!t.isActive ? 'inactive-item' : ''}`}>
            <div className="service-item-info"><img src={t.image} alt={t.name} /><div><strong>{t.name}</strong><span>{t.role} | ⭐{t.rating}</span></div></div>
            <label className="se-toggle"><input type="checkbox" checked={t.isActive} onChange={() => handleToggle(t._id, t.isActive)} /><span className="se-toggle-slider"></span></label>
            <div className="service-item-actions"><button onClick={() => handleEdit(t)}>✏️</button><button onClick={() => handleDelete(t._id, t.name)}>🗑️</button></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsEditor;