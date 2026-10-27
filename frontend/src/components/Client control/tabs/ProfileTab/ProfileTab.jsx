import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ProfileTab.css';

const API_URL = 'http://localhost:5001/api';

const ProfileTab = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
    country: user?.country || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/auth/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const updatedUser = { ...user, ...res.data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      if (onUpdate) onUpdate(updatedUser);
      
      Swal.fire('Success!', 'Profile updated successfully', 'success');
      setIsEditing(false);
    } catch (err) {
      Swal.fire('Error', 'Failed to update profile', 'error');
    }
    setLoading(false);
  };

  const handleChangePassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Change Password',
      html: `
        <input type="password" id="currentPassword" class="swal2-input" placeholder="Current Password">
        <input type="password" id="newPassword" class="swal2-input" placeholder="New Password (min 6 chars)">
        <input type="password" id="confirmPassword" class="swal2-input" placeholder="Confirm New Password">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (!currentPassword || !newPassword || !confirmPassword) {
          Swal.showValidationMessage('Please fill all fields');
          return false;
        }
        if (newPassword.length < 6) {
          Swal.showValidationMessage('New password must be at least 6 characters');
          return false;
        }
        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage('New passwords do not match');
          return false;
        }
        return { currentPassword, newPassword };
      }
    });

    if (formValues) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`${API_URL}/auth/password`, {
          currentPassword: formValues.currentPassword,
          newPassword: formValues.newPassword
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Success!', 'Password changed successfully', 'success');
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || 'Failed to change password', 'error');
      }
    }
  };

  return (
    <div className="profile-tab">
      <div className="tab-header">
        <h2>👤 My Profile</h2>
        <p>View and manage your account information</p>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          <div className="avatar-large">{user?.fullName?.charAt(0)}</div>
          <h3>{user?.fullName}</h3>
          <p className="role-badge">{user?.role === 'admin' ? 'Administrator' : 'Client'}</p>
        </div>

        <div className="profile-info">
          {!isEditing ? (
            <>
              <div className="info-row">
                <span className="info-label">Full Name</span>
                <span className="info-value">{user?.fullName}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email Address</span>
                <span className="info-value">{user?.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Phone Number</span>
                <span className="info-value">{user?.phone || 'Not provided'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Company</span>
                <span className="info-value">{user?.company || 'Not provided'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Country</span>
                <span className="info-value">{user?.country || 'Not provided'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Member Since</span>
                <span className="info-value">{new Date(user?.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="profile-actions">
                <button className="edit-btn" onClick={() => setIsEditing(true)}>✏️ Edit Profile</button>
                <button className="password-btn" onClick={handleChangePassword}>🔑 Change Password</button>
              </div>
            </>
          ) : (
            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input type="text" name="country" value={formData.country} onChange={handleChange} />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;