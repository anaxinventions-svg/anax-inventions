import React, { useEffect, useState } from 'react';
import { servicesAPI, uploadAPI } from '../../api/api';
import { FaPlus, FaEdit, FaTrash, FaImage, FaGripVertical } from 'react-icons/fa';
import './Admin.css';

const ServicesManager = () => {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');

  const emptyService = {
    title: '',
    subtitle: '',
    description: '',
    image: '',
    features: ['', '', '', ''],
    isActive: true
  };

  const [formData, setFormData] = useState(emptyService);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await servicesAPI.getAll();
      setServices(res.data);
    } catch (error) {
      console.error('Error fetching services:', error);
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
      setMessage('❌ Image upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      features: formData.features.filter(f => f.trim() !== '')
    };

    try {
      if (editingService) {
        await servicesAPI.update(editingService._id, data);
        setMessage('✅ Service updated!');
      } else {
        await servicesAPI.create(data);
        setMessage('✅ Service created!');
      }
      setShowForm(false);
      setEditingService(null);
      setFormData(emptyService);
      fetchServices();
    } catch (error) {
      setMessage('❌ Error saving service');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      ...service,
      features: [...service.features, '', '', '', ''].slice(0, 4)
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await servicesAPI.delete(id);
      setMessage('✅ Service deleted!');
      fetchServices();
    } catch (error) {
      setMessage('❌ Error deleting service');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Services Manager</h1>
        <button className="admin-btn-primary" onClick={() => { setShowForm(true); setEditingService(null); setFormData(emptyService); }}>
          <FaPlus /> Add Service
        </button>
      </div>

      {message && <div className="admin-message">{message}</div>}

      {showForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h2>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Title</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="admin-form-group">
                  <label>Subtitle</label>
                  <input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} required />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" required />
              </div>

              <div className="admin-form-group">
                <label>Image</label>
                <div className="admin-image-upload">
                  {formData.image && <img src={formData.image} alt="Preview" className="admin-image-preview" />}
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                  <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="Or paste image URL" />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Features (up to 4)</label>
                {formData.features.map((feat, i) => (
                  <input key={i} type="text" value={feat} onChange={e => {
                    const newFeatures = [...formData.features];
                    newFeatures[i] = e.target.value;
                    setFormData({...formData, features: newFeatures});
                  }} placeholder={`Feature ${i + 1}`} />
                ))}
              </div>

              <div className="admin-form-actions">
                <button type="button" className="admin-btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="admin-btn-primary">{editingService ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Image</th>
              <th>Title</th>
              <th>Subtitle</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={service._id}>
                <td><FaGripVertical className="admin-drag-icon" /> {index + 1}</td>
                <td><img src={service.image} alt={service.title} className="admin-table-img" /></td>
                <td>{service.title}</td>
                <td>{service.subtitle}</td>
                <td>
                  <span className={`admin-status ${service.isActive ? 'active' : 'inactive'}`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button className="admin-btn-icon" onClick={() => handleEdit(service)}><FaEdit /></button>
                  <button className="admin-btn-icon danger" onClick={() => handleDelete(service._id)}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServicesManager;