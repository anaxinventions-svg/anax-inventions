import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ContactEditor.css';

const API_URL = 'https://anax-inventions.onrender.com/api';

const ContactEditor = () => {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/contact-page`);
      setForm(res.data.content || {});
    } catch (err) { console.error('Failed'); }
    setLoading(false);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Social Links Management
  const socialLinks = form.socialLinks || [];
  const addSocial = () => {
    const updated = [...socialLinks, { platform: '', icon: '', url: '', isActive: true }];
    setForm({ ...form, socialLinks: updated });
  };
  const updateSocial = (index, field, value) => {
    const updated = [...socialLinks];
    updated[index][field] = value;
    setForm({ ...form, socialLinks: updated });
  };
  const removeSocial = (index) => {
    setForm({ ...form, socialLinks: socialLinks.filter((_, i) => i !== index) });
  };

  // Stats Management
  const statsCards = form.statsCards || [
    { icon: '✓', value: '500+', label: 'Projects' },
    { icon: '✓', value: '150+', label: 'Clients' },
    { icon: '✓', value: '4.9/5', label: 'Rating' },
  ];
  const addStat = () => {
    const updated = [...statsCards, { icon: '✓', value: '', label: '' }];
    setForm({ ...form, statsCards: updated });
  };
  const updateStat = (index, field, value) => {
    const updated = [...statsCards];
    updated[index][field] = value;
    setForm({ ...form, statsCards: updated });
  };
  const removeStat = (index) => {
    setForm({ ...form, statsCards: statsCards.filter((_, i) => i !== index) });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${API_URL}/contact-page`, form, { headers: { Authorization: `Bearer ${token}` } });
      Swal.fire({ title: '✅ Saved!', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch (err) { Swal.fire('Error!', 'Failed', 'error'); }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="ce-container">
      <div className="ce-header"><h2>📞 Contact Page Editor</h2></div>

      {/* Hero Section */}
      <div className="ce-section">
        <h3>🏠 Hero Section</h3>
        <div className="ce-grid">
          <div className="ce-field"><label>Tag</label><input name="heroTag" value={form.heroTag || ''} onChange={handleChange} /></div>
          <div className="ce-field"><label>Title</label><input name="heroTitle" value={form.heroTitle || ''} onChange={handleChange} /></div>
          <div className="ce-field ce-full"><label>Description</label><textarea name="heroDescription" value={form.heroDescription || ''} onChange={handleChange} rows={2} /></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ce-section">
        <h3>📊 Hero Stats Cards <button onClick={addStat} className="ce-btn-add">+ Add</button></h3>
        {statsCards.map((s, i) => (
          <div key={i} className="ce-row">
            <input placeholder="Icon (e.g., ✓)" value={s.icon} onChange={e => updateStat(i, 'icon', e.target.value)} style={{ width: 60 }} />
            <input placeholder="Value (e.g., 500+)" value={s.value} onChange={e => updateStat(i, 'value', e.target.value)} />
            <input placeholder="Label (e.g., Projects)" value={s.label} onChange={e => updateStat(i, 'label', e.target.value)} />
            <button onClick={() => removeStat(i)} className="ce-btn-del">✕</button>
          </div>
        ))}
      </div>

      {/* WhatsApp Card */}
      <div className="ce-section">
        <h3>📱 WhatsApp Card</h3>
        <div className="ce-grid">
          <div className="ce-field"><label>WhatsApp Number</label><input name="whatsappNumber" value={form.whatsappNumber || ''} onChange={handleChange} /></div>
          <div className="ce-field"><label>Pre-filled Text</label><input name="whatsappText" value={form.whatsappText || ''} onChange={handleChange} /></div>
          <div className="ce-field ce-full"><label>Subtitle</label><input name="whatsappSubtitle" value={form.whatsappSubtitle || ''} onChange={handleChange} /></div>
        </div>
      </div>

      {/* Email Card */}
      <div className="ce-section">
        <h3>📧 Email Card</h3>
        <div className="ce-grid">
          <div className="ce-field"><label>Primary Email</label><input name="emailPrimary" value={form.emailPrimary || ''} onChange={handleChange} /></div>
          <div className="ce-field"><label>Secondary Email</label><input name="emailSecondary" value={form.emailSecondary || ''} onChange={handleChange} /></div>
          <div className="ce-field ce-full"><label>Subtitle</label><input name="emailSubtitle" value={form.emailSubtitle || ''} onChange={handleChange} /></div>
        </div>
      </div>

      {/* Address Card */}
      <div className="ce-section">
        <h3>📍 Address Card</h3>
        <div className="ce-grid">
          <div className="ce-field"><label>Address Line 1</label><input name="addressLine1" value={form.addressLine1 || ''} onChange={handleChange} /></div>
          <div className="ce-field"><label>Address Line 2</label><input name="addressLine2" value={form.addressLine2 || ''} onChange={handleChange} /></div>
          <div className="ce-field"><label>Subtitle</label><input name="addressSubtitle" value={form.addressSubtitle || ''} onChange={handleChange} /></div>
          <div className="ce-field"><label>Google Maps Link</label><input name="googleMapsLink" value={form.googleMapsLink || ''} onChange={handleChange} /></div>
        </div>
      </div>

      {/* Social Links */}
      <div className="ce-section">
        <h3>🔗 Follow Us - Social Links <button onClick={addSocial} className="ce-btn-add">+ Add</button></h3>
        {socialLinks.map((s, i) => (
          <div key={i} className="ce-row">
            <input placeholder="Platform (e.g., WhatsApp)" value={s.platform} onChange={e => updateSocial(i, 'platform', e.target.value)} />
            <input placeholder="Icon (e.g., whatsapp)" value={s.icon} onChange={e => updateSocial(i, 'icon', e.target.value)} />
            <input placeholder="URL" value={s.url} onChange={e => updateSocial(i, 'url', e.target.value)} className="ce-input-lg" />
            <button onClick={() => removeSocial(i)} className="ce-btn-del">✕</button>
          </div>
        ))}
      </div>

      {/* CTA Banner */}
      <div className="ce-section">
        <h3>🎯 WhatsApp CTA Banner</h3>
        <div className="ce-grid">
          <div className="ce-field"><label>Title</label><input name="ctaTitle" value={form.ctaTitle || ''} onChange={handleChange} /></div>
          <div className="ce-field"><label>Text</label><input name="ctaText" value={form.ctaText || ''} onChange={handleChange} /></div>
          <div className="ce-field"><label>WhatsApp Number</label><input name="ctaWhatsappNumber" value={form.ctaWhatsappNumber || ''} onChange={handleChange} /></div>
        </div>
      </div>

      <button onClick={handleSave} className="ce-save-btn">💾 Save All Contact Settings</button>
    </div>
  );
};

export default ContactEditor;