import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './FooterEditor.css';

const API_URL = 'https://anax-inventions.onrender.com/api';

const FooterEditor = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [copyright, setCopyright] = useState('');
  const [socialLinks, setSocialLinks] = useState([]);
  const [linkSections, setLinkSections] = useState([]);
  const [bottomLinks, setBottomLinks] = useState([]);

  useEffect(() => { fetchContent(); }, []);

  const fetchContent = async () => {
    try {
      const res = await axios.get(`${API_URL}/footer`);
      const c = res.data.content;
      if (c) {
        setAddress(c.address || ''); setPhone(c.phone || ''); setEmail(c.email || '');
        setDescription(c.description || ''); setCopyright(c.copyright || '');
        setSocialLinks(c.socialLinks || []); setLinkSections(c.linkSections || []);
        setBottomLinks(c.bottomLinks || []);
        setContent(c);
      }
    } catch (err) { console.error('Failed'); }
    setLoading(false);
  };

  const addSocial = () => setSocialLinks([...socialLinks, { platform: '', icon: '', url: '', isActive: true }]);
  const updateSocial = (index, field, value) => { const updated = [...socialLinks]; updated[index][field] = value; setSocialLinks(updated); };
  const removeSocial = (index) => setSocialLinks(socialLinks.filter((_, i) => i !== index));

  const addSection = () => setLinkSections([...linkSections, { title: '', links: [] }]);
  const updateSection = (index, field, value) => { const updated = [...linkSections]; updated[index][field] = value; setLinkSections(updated); };
  const removeSection = (index) => setLinkSections(linkSections.filter((_, i) => i !== index));
  
  const addLink = (secIndex) => { const updated = [...linkSections]; updated[secIndex].links.push({ name: '', path: '', isActive: true }); setLinkSections(updated); };
  const updateLink = (secIndex, linkIndex, field, value) => { const updated = [...linkSections]; updated[secIndex].links[linkIndex][field] = value; setLinkSections(updated); };
  const removeLink = (secIndex, linkIndex) => { const updated = [...linkSections]; updated[secIndex].links = updated[secIndex].links.filter((_, i) => i !== linkIndex); setLinkSections(updated); };

  const addBottom = () => setBottomLinks([...bottomLinks, { name: '', path: '' }]);
  const updateBottom = (index, field, value) => { const updated = [...bottomLinks]; updated[index][field] = value; setBottomLinks(updated); };
  const removeBottom = (index) => setBottomLinks(bottomLinks.filter((_, i) => i !== index));

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${API_URL}/footer`, { address, phone, email, description, socialLinks, linkSections, copyright, bottomLinks }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire({ title: '✅ Saved!', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch (err) { Swal.fire('Error!', 'Failed', 'error'); }
  };

  if (loading) return <div className="fe-loading">Loading editor...</div>;

  return (
    <div className="fe-container">
      <div className="fe-header">
        <h2>📋 Footer Editor</h2>
        <p>Manage footer content dynamically</p>
      </div>

      <div className="fe-section">
        <h3 className="fe-section-title">📞 Contact Information</h3>
        <div className="fe-grid">
          <div className="fe-field">
            <label>Address</label>
            <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Office address" />
          </div>
          <div className="fe-field">
            <label>Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Contact number" />
          </div>
          <div className="fe-field">
            <label>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" />
          </div>
          <div className="fe-field fe-full">
            <label>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Company description" />
          </div>
          <div className="fe-field">
            <label>Copyright Text</label>
            <input value={copyright} onChange={e => setCopyright(e.target.value)} placeholder="Anax Inventions" />
          </div>
        </div>
      </div>

      <div className="fe-section">
        <h3 className="fe-section-title">
          🔗 Social Links
          <button onClick={addSocial} className="fe-btn-add">+ Add</button>
        </h3>
        {socialLinks.map((s, i) => (
          <div key={i} className="fe-row">
            <input placeholder="Platform (e.g., WhatsApp)" value={s.platform} onChange={e => updateSocial(i, 'platform', e.target.value)} />
            <input placeholder="Icon (e.g., whatsapp)" value={s.icon} onChange={e => updateSocial(i, 'icon', e.target.value)} />
            <input placeholder="URL" value={s.url} onChange={e => updateSocial(i, 'url', e.target.value)} className="fe-input-lg" />
            <button onClick={() => removeSocial(i)} className="fe-btn-del">✕</button>
          </div>
        ))}
      </div>

      <div className="fe-section">
        <h3 className="fe-section-title">
          📁 Link Sections
          <button onClick={addSection} className="fe-btn-add">+ Add Section</button>
        </h3>
        {linkSections.map((sec, si) => (
          <div key={si} className="fe-card">
            <div className="fe-row">
              <input placeholder="Section Title" value={sec.title} onChange={e => updateSection(si, 'title', e.target.value)} />
              <button onClick={() => removeSection(si)} className="fe-btn-del">Delete Section</button>
            </div>
            <button onClick={() => addLink(si)} className="fe-btn-add-sm">+ Add Link</button>
            {sec.links.map((link, li) => (
              <div key={li} className="fe-row fe-row-indent">
                <input placeholder="Link Name" value={link.name} onChange={e => updateLink(si, li, 'name', e.target.value)} />
                <input placeholder="Path" value={link.path} onChange={e => updateLink(si, li, 'path', e.target.value)} />
                <button onClick={() => removeLink(si, li)} className="fe-btn-del">✕</button>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="fe-section">
        <h3 className="fe-section-title">
          📄 Bottom Links
          <button onClick={addBottom} className="fe-btn-add">+ Add</button>
        </h3>
        {bottomLinks.map((b, i) => (
          <div key={i} className="fe-row">
            <input placeholder="Name" value={b.name} onChange={e => updateBottom(i, 'name', e.target.value)} />
            <input placeholder="Path" value={b.path} onChange={e => updateBottom(i, 'path', e.target.value)} />
            <button onClick={() => removeBottom(i)} className="fe-btn-del">✕</button>
          </div>
        ))}
      </div>

      <button onClick={handleSave} className="fe-save-btn">💾 Save All Footer Settings</button>
    </div>
  );
};

export default FooterEditor;