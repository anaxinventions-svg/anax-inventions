import React, { useEffect, useState } from 'react';
import { companyAPI } from '../../api/api';
import './Admin.css';

const CompanySettings = () => {
  const [company, setCompany] = useState({
    name: '',
    tagline: '',
    description: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    companyNumber: '',
    businessHours: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      instagram: '',
      facebook: ''
    }
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const res = await companyAPI.get();
      setCompany(res.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const socialKey = name.split('.')[1];
      setCompany({
        ...company,
        socialLinks: { ...company.socialLinks, [socialKey]: value }
      });
    } else {
      setCompany({ ...company, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await companyAPI.update(company);
      setMessage('✅ Company info updated!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error updating');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Company Information</h1>
        <p>Update your business details</p>
      </div>

      {message && <div className="admin-message">{message}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Company Name</label>
            <input type="text" name="name" value={company.name} onChange={handleChange} />
          </div>
          <div className="admin-form-group">
            <label>Tagline</label>
            <input type="text" name="tagline" value={company.tagline} onChange={handleChange} />
          </div>
        </div>

        <div className="admin-form-group">
          <label>Description</label>
          <textarea name="description" value={company.description} onChange={handleChange} rows="3" />
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Email</label>
            <input type="email" name="email" value={company.email} onChange={handleChange} />
          </div>
          <div className="admin-form-group">
            <label>Phone</label>
            <input type="text" name="phone" value={company.phone} onChange={handleChange} />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>WhatsApp</label>
            <input type="text" name="whatsapp" value={company.whatsapp} onChange={handleChange} />
          </div>
          <div className="admin-form-group">
            <label>Company Number</label>
            <input type="text" name="companyNumber" value={company.companyNumber} onChange={handleChange} />
          </div>
        </div>

        <div className="admin-form-group">
          <label>Address</label>
          <input type="text" name="address" value={company.address} onChange={handleChange} />
        </div>

        <div className="admin-form-group">
          <label>Business Hours</label>
          <input type="text" name="businessHours" value={company.businessHours} onChange={handleChange} />
        </div>

        <h3 className="admin-section-title">Social Links</h3>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>LinkedIn</label>
            <input type="text" name="social.linkedin" value={company.socialLinks.linkedin} onChange={handleChange} placeholder="https://linkedin.com/..." />
          </div>
          <div className="admin-form-group">
            <label>Twitter</label>
            <input type="text" name="social.twitter" value={company.socialLinks.twitter} onChange={handleChange} placeholder="https://twitter.com/..." />
          </div>
        </div>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Instagram</label>
            <input type="text" name="social.instagram" value={company.socialLinks.instagram} onChange={handleChange} placeholder="https://instagram.com/..." />
          </div>
          <div className="admin-form-group">
            <label>Facebook</label>
            <input type="text" name="social.facebook" value={company.socialLinks.facebook} onChange={handleChange} placeholder="https://facebook.com/..." />
          </div>
        </div>

        <button type="submit" className="admin-btn-primary">💾 Save Changes</button>
      </form>
    </div>
  );
};

export default CompanySettings;