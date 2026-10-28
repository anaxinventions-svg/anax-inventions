import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './SettingsPanel.css';

const API_URL = 'https://anax-inventions.onrender.com/api';

const SettingsPanel = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [profile, setProfile] = useState({ fullName: '', email: '', avatar: '' });
  const [password, setPassword] = useState({ current: '', newPass: '', confirm: '' });
  const [siteConfig, setSiteConfig] = useState({ siteName: 'ANAX INVENTIONS', adminEmail: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const u = JSON.parse(userData);
      setProfile({ fullName: u.fullName || '', email: u.email || '', avatar: u.avatar || '' });
      setAvatarPreview(u.avatar || '');
    }
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        setAvatarPreview(base64);
        // Immediately update localStorage so dashboard reflects instantly
        const userData = localStorage.getItem('user');
        if (userData) {
          const u = JSON.parse(userData);
          u.avatar = base64;
          localStorage.setItem('user', JSON.stringify(u));
          // Dispatch custom event to notify dashboard
          window.dispatchEvent(new Event('profileUpdate'));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profile.fullName.trim()) { Swal.fire('Error!', 'Name is required', 'error'); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append('fullName', profile.fullName);
      fd.append('email', profile.email);
      if (avatarFile) fd.append('avatar', avatarFile);

      const res = await axios.put(`${API_URL}/auth/profile`, fd, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      
      localStorage.setItem('user', JSON.stringify(res.data.user));
      // Dispatch custom event to notify dashboard
      window.dispatchEvent(new Event('profileUpdate'));
      Swal.fire({ title: '✅ Profile Updated!', icon: 'success', timer: 1500, showConfirmButton: false });
      setAvatarFile(null);
    } catch (err) { 
      Swal.fire('Error!', err.response?.data?.message || 'Failed', 'error'); 
    }
    setLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!password.current || !password.newPass || !password.confirm) {
      Swal.fire('Error!', 'All fields are required', 'error'); return;
    }
    if (password.newPass !== password.confirm) { 
      Swal.fire('Error!', 'Passwords do not match', 'error'); return; 
    }
    if (password.newPass.length < 6) { 
      Swal.fire('Error!', 'Password must be 6+ characters', 'error'); return; 
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/auth/password`, 
        { currentPassword: password.current, newPassword: password.newPass }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire({ title: '✅ Password Changed!', icon: 'success', timer: 2000, showConfirmButton: false });
      setPassword({ current: '', newPass: '', confirm: '' });
    } catch (err) { 
      Swal.fire('Error!', err.response?.data?.message || 'Incorrect current password', 'error'); 
    }
    setLoading(false);
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?', 
      text: 'Are you sure you want to logout?', 
      icon: 'question',
      showCancelButton: true, 
      confirmButtonColor: '#e44', 
      confirmButtonText: 'Yes, Logout', 
      cancelButtonText: 'Cancel',
    }).then((result) => { 
      if (result.isConfirmed) { 
        localStorage.clear(); 
        window.location.href = '/'; 
      } 
    });
  };

  const sections = [
    { id: 'profile', icon: '👤', label: 'My Profile' },
    { id: 'password', icon: '🔒', label: 'Password' },
    { id: 'site', icon: '⚙️', label: 'Site Config' },
    { id: 'backup', icon: '💾', label: 'Backup' },
  ];

  return (
    <div className="sp-container">
      <div className="sp-header">
        <h2>⚙️ Settings</h2>
        <p>Manage your account and preferences</p>
      </div>

      <div className="sp-layout">
        <div className="sp-sidebar">
          {sections.map(s => (
            <button 
              key={s.id} 
              className={`sp-tab ${activeSection === s.id ? 'active' : ''}`} 
              onClick={() => setActiveSection(s.id)}
            >
              <span>{s.icon}</span> {s.label}
            </button>
          ))}
          <div className="sp-sidebar-divider" />
          <button 
            className={`sp-tab sp-tab-danger ${activeSection === 'logout' ? 'active' : ''}`} 
            onClick={() => setActiveSection('logout')}
          >
            <span>🚪</span> Logout
          </button>
        </div>

        <div className="sp-content">
          
          {/* ===== PROFILE ===== */}
          {activeSection === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="sp-form">
              <h3>👤 My Profile</h3>
              <p className="sp-desc">Update your personal information and avatar</p>
              
              {/* Avatar Upload */}
              <div className="sp-avatar-section">
                <div className="sp-avatar-preview" onClick={() => fileInputRef.current?.click()}>
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" />
                  ) : (
                    <span className="sp-avatar-placeholder">
                      {profile.fullName?.charAt(0) || 'A'}
                    </span>
                  )}
                  <div className="sp-avatar-overlay">
                    <span>📷</span>
                  </div>
                </div>
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                  hidden 
                />
                <div className="sp-avatar-info">
                  <strong>Profile Picture</strong>
                  <span>Click to upload new photo</span>
                </div>
              </div>

              <div className="sp-field">
                <label>Full Name</label>
                <input 
                  value={profile.fullName} 
                  onChange={e => setProfile({...profile, fullName: e.target.value})} 
                  placeholder="Your full name" 
                />
              </div>
              <div className="sp-field">
                <label>Email Address</label>
                <input 
                  value={profile.email} 
                  onChange={e => setProfile({...profile, email: e.target.value})} 
                  placeholder="your@email.com" 
                  type="email" 
                />
              </div>
              <button type="submit" className="sp-btn" disabled={loading}>
                {loading ? 'Saving...' : '💾 Save Changes'}
              </button>
            </form>
          )}

          {/* ===== PASSWORD ===== */}
          {activeSection === 'password' && (
            <form onSubmit={handlePasswordChange} className="sp-form">
              <h3>🔒 Change Password</h3>
              <p className="sp-desc">Use a strong password you don't use elsewhere</p>
              <div className="sp-field">
                <label>Current Password</label>
                <input 
                  type="password" 
                  value={password.current} 
                  onChange={e => setPassword({...password, current: e.target.value})} 
                  placeholder="Enter current password" 
                  required 
                />
              </div>
              <div className="sp-field">
                <label>New Password</label>
                <input 
                  type="password" 
                  value={password.newPass} 
                  onChange={e => setPassword({...password, newPass: e.target.value})} 
                  placeholder="Min 6 characters" 
                  required 
                />
              </div>
              <div className="sp-field">
                <label>Confirm New Password</label>
                <input 
                  type="password" 
                  value={password.confirm} 
                  onChange={e => setPassword({...password, confirm: e.target.value})} 
                  placeholder="Re-enter new password" 
                  required 
                />
              </div>
              <button type="submit" className="sp-btn" disabled={loading}>
                {loading ? 'Updating...' : '🔒 Update Password'}
              </button>
            </form>
          )}

          {/* ===== SITE CONFIG ===== */}
          {activeSection === 'site' && (
            <div className="sp-form">
              <h3>⚙️ Site Configuration</h3>
              <p className="sp-desc">Basic website settings</p>
              <div className="sp-field">
                <label>Site Name</label>
                <input 
                  value={siteConfig.siteName} 
                  onChange={e => setSiteConfig({...siteConfig, siteName: e.target.value})} 
                />
              </div>
              <div className="sp-field">
                <label>Admin Email</label>
                <input 
                  value={siteConfig.adminEmail} 
                  onChange={e => setSiteConfig({...siteConfig, adminEmail: e.target.value})} 
                  type="email" 
                />
              </div>
              <button className="sp-btn">💾 Save Configuration</button>
            </div>
          )}

          {/* ===== BACKUP ===== */}
          {activeSection === 'backup' && (
            <div className="sp-form">
              <h3>💾 Backup & Export</h3>
              <p className="sp-desc">Download your website data for safekeeping</p>
              <div className="sp-actions">
                <button className="sp-btn-outline">📥 Export Users (CSV)</button>
                <button className="sp-btn-outline">📥 Export Services (JSON)</button>
                <button className="sp-btn-outline">📥 Export Projects (JSON)</button>
                <button className="sp-btn-outline">📥 Full Database Backup</button>
              </div>
            </div>
          )}

          {/* ===== LOGOUT ===== */}
          {activeSection === 'logout' && (
            <div className="sp-form" style={{ textAlign: 'center' }}>
              <div className="sp-logout-icon">🚪</div>
              <h3>Ready to leave?</h3>
              <p className="sp-desc">You'll be signed out and redirected to the homepage.</p>
              <button 
                className="sp-btn" 
                style={{ background: '#e44', width: '100%', padding: '0.8rem' }} 
                onClick={handleLogout}
              >
                🚪 Logout from Dashboard
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;