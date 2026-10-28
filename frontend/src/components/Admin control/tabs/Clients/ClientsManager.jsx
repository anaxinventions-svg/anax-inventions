import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ClientsManager.css';

const API_URL = 'https://anax-inventions.onrender.com/api';

const ClientsManager = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newClientData, setNewClientData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    country: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const getToken = () => localStorage.getItem('token');

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/clients`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setClients(res.data.clients || []);
    } catch (err) {
      console.error('Error fetching clients:', err);
      Swal.fire('Error', 'Failed to load clients', 'error');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditClient({ ...editClient, [e.target.name]: e.target.value });
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      Swal.fire('Error', 'Name and email are required!', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(`${API_URL}/admin/clients`, formData, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      setNewClientData(res.data.client);
      setShowPasswordModal(true);
      setShowCreateModal(false);
      setFormData({ fullName: '', email: '', phone: '', company: '', country: '' });
      fetchClients();

    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to create client', 'error');
    }
    setSubmitting(false);
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.put(`${API_URL}/admin/clients/${editClient._id}`, editClient, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      Swal.fire('Updated!', 'Client updated successfully', 'success');
      setShowEditModal(false);
      setEditClient(null);
      fetchClients();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to update client', 'error');
    }
    setSubmitting(false);
  };

  const handleResetPassword = async (clientId, clientName) => {
    const result = await Swal.fire({
      title: 'Reset Password?',
      text: `Generate new password for ${clientName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#cc7722',
      confirmButtonText: 'Yes, Reset'
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.post(`${API_URL}/admin/clients/${clientId}/reset-password`, {}, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        
        Swal.fire({
          title: 'New Password Generated!',
          html: `<div style="padding: 10px;"><code style="background:#f0f0f0; padding: 8px; border-radius: 4px; font-size: 16px;">${res.data.newPassword}</code></div><p>Share this with the client.</p>`,
          icon: 'success',
          confirmButtonColor: '#cc7722'
        });
        fetchClients();
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || 'Failed to reset password', 'error');
      }
    }
  };

  const handleDeleteClient = async (clientId, clientName) => {
    const result = await Swal.fire({
      title: 'Deactivate Client?',
      text: `${clientName} will not be able to login.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Yes, Deactivate'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/admin/clients/${clientId}`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        Swal.fire('Deactivated!', `${clientName} has been deactivated.`, 'success');
        fetchClients();
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || 'Failed to deactivate client', 'error');
      }
    }
  };

  const handlePermanentDelete = async (clientId, clientName) => {
    const result = await Swal.fire({
      title: 'PERMANENTLY DELETE?',
      text: `${clientName} will be completely removed forever!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Yes, Delete Forever'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/admin/clients/${clientId}/permanent`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        Swal.fire('Deleted!', `${clientName} has been permanently deleted.`, 'success');
        fetchClients();
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || 'Failed to delete client', 'error');
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    Swal.fire({ title: 'Copied!', icon: 'success', timer: 1500, showConfirmButton: false });
  };

  const getStatusBadge = (isActive) => {
    return isActive ? 
      <span className="client-badge active">Active</span> : 
      <span className="client-badge inactive">Inactive</span>;
  };

  return (
    <div className="clients-manager">
      <div className="cm-header">
        <div className="cm-header-left">
          <h2>Client Management</h2>
          <p>Create, manage, and track all clients</p>
        </div>
        <button className="cm-add-btn" onClick={() => setShowCreateModal(true)}>+ Add New Client</button>
      </div>

      <div className="cm-table-container">
        {loading ? (
          <div className="cm-loading">Loading clients...</div>
        ) : clients.length === 0 ? (
          <div className="cm-empty">
            <div className="cm-empty-icon">👥</div>
            <h3>No Clients Yet</h3>
            <p>Click "Add New Client" to create your first client.</p>
          </div>
        ) : (
          <table className="cm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Company</th>
                <th>Country</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, idx) => (
                <tr key={client._id}>
                  <td>{idx + 1}</td>
                  <td><strong>{client.fullName}</strong></td>
                  <td>{client.email}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <code style={{ background: '#f0f0f0', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                        {client.plainPassword || '••••••••'}
                      </code>
                      {client.plainPassword && (
                        <button 
                          onClick={() => copyToClipboard(client.plainPassword)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                          title="Copy Password"
                        >
                          📋
                        </button>
                      )}
                    </div>
                  </td>
                  <td>{client.company || '—'}</td>
                  <td>{client.country || '—'}</td>
                  <td>{getStatusBadge(client.isActive)}</td>
                  <td>{new Date(client.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="cm-action-btn edit" onClick={() => { setEditClient(client); setShowEditModal(true); }} title="Edit">✏️</button>
                    <button className="cm-action-btn reset" onClick={() => handleResetPassword(client._id, client.fullName)} title="Reset Password">🔑</button>
                    <button className="cm-action-btn delete" onClick={() => handleDeleteClient(client._id, client.fullName)} title="Deactivate">🗑️</button>
                    <button className="cm-action-btn permanent" onClick={() => handlePermanentDelete(client._id, client.fullName)} title="Delete Forever">❌</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Client Modal */}
      {showCreateModal && (
        <div className="cm-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="cm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cm-modal-header"><h3>Create New Client</h3><button className="cm-modal-close" onClick={() => setShowCreateModal(false)}>✕</button></div>
            <form onSubmit={handleCreateClient}>
              <div className="cm-modal-body">
                <div className="cm-form-row">
                  <div className="cm-form-group"><label>Full Name *</label><input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required /></div>
                  <div className="cm-form-group"><label>Email *</label><input type="email" name="email" value={formData.email} onChange={handleChange} required /></div>
                </div>
                <div className="cm-form-row">
                  <div className="cm-form-group"><label>Phone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} /></div>
                  <div className="cm-form-group"><label>Company</label><input type="text" name="company" value={formData.company} onChange={handleChange} /></div>
                </div>
                <div className="cm-form-row">
                  <div className="cm-form-group"><label>Country</label><input type="text" name="country" value={formData.country} onChange={handleChange} /></div>
                </div>
                <div className="cm-info-box">Password will be auto-generated and shown after creation.</div>
              </div>
              <div className="cm-modal-footer">
                <button type="button" className="cm-btn-cancel" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="cm-btn-create" disabled={submitting}>{submitting ? 'Creating...' : 'Create Client'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && newClientData && (
        <div className="cm-modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="cm-modal password-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cm-modal-header" style={{ background: '#1d2e2a' }}><h3 style={{ color: '#fff' }}>Client Created!</h3><button className="cm-modal-close" onClick={() => setShowPasswordModal(false)} style={{ color: '#fff' }}>✕</button></div>
            <div className="cm-modal-body">
              <div className="password-success-icon">🎉</div>
              <h4>{newClientData.fullName}</h4>
              <div className="credentials-box">
                <div className="cred-row"><label>Email:</label><span>{newClientData.email}</span><button className="copy-small" onClick={() => copyToClipboard(newClientData.email)}>Copy</button></div>
                <div className="cred-row"><label>Password:</label><code>{newClientData.plainPassword}</code><button className="copy-small" onClick={() => copyToClipboard(newClientData.plainPassword)}>Copy</button></div>
              </div>
              <div className="email-status-box">
                <p>Password is also saved in the table above. You can copy it anytime.</p>
              </div>
            </div>
            <div className="cm-modal-footer"><button className="cm-btn-create" onClick={() => setShowPasswordModal(false)}>Done</button></div>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {showEditModal && editClient && (
        <div className="cm-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="cm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cm-modal-header"><h3>Edit Client</h3><button className="cm-modal-close" onClick={() => setShowEditModal(false)}>✕</button></div>
            <form onSubmit={handleUpdateClient}>
              <div className="cm-modal-body">
                <div className="cm-form-row">
                  <div className="cm-form-group"><label>Full Name</label><input type="text" name="fullName" value={editClient.fullName} onChange={handleEditChange} required /></div>
                  <div className="cm-form-group"><label>Email</label><input type="email" name="email" value={editClient.email} disabled style={{ background: '#f0f0f0' }} /></div>
                </div>
                <div className="cm-form-row">
                  <div className="cm-form-group"><label>Phone</label><input type="tel" name="phone" value={editClient.phone || ''} onChange={handleEditChange} /></div>
                  <div className="cm-form-group"><label>Company</label><input type="text" name="company" value={editClient.company || ''} onChange={handleEditChange} /></div>
                </div>
                <div className="cm-form-row">
                  <div className="cm-form-group"><label>Country</label><input type="text" name="country" value={editClient.country || ''} onChange={handleEditChange} /></div>
                  <div className="cm-form-group"><label>Status</label><select name="isActive" value={editClient.isActive} onChange={handleEditChange}>
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select></div>
                </div>
              </div>
              <div className="cm-modal-footer">
                <button type="button" className="cm-btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="cm-btn-create" disabled={submitting}>{submitting ? 'Updating...' : 'Update Client'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsManager;