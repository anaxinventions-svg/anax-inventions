import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ChangeRequestsTab.css';

const API_URL = 'https://anax-inventions.onrender.com/api';

const ChangeRequestsTab = ({ project }) => {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });

  useEffect(() => {
    if (project) {
      fetchRequests();
    }
  }, [project]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/client/change-requests/${project._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      Swal.fire('Error', 'Please fill all required fields', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/client/change-requests`, {
        projectId: project._id,
        ...formData
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Swal.fire('Submitted!', 'Change request submitted successfully', 'success');
      setShowForm(false);
      setFormData({ title: '', description: '', priority: 'medium' });
      fetchRequests();
    } catch (err) {
      Swal.fire('Error', 'Failed to submit request', 'error');
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return { bg: '#fff3cd', color: '#ffc107', label: '⏳ Pending' };
      case 'approved': return { bg: '#d4edda', color: '#28a745', label: '✅ Approved' };
      case 'rejected': return { bg: '#f8d7da', color: '#dc3545', label: '❌ Rejected' };
      case 'in-progress': return { bg: '#e3f2fd', color: '#1976d2', label: '🔄 In Progress' };
      case 'completed': return { bg: '#d1ecf1', color: '#17a2b8', label: '✔️ Completed' };
      default: return { bg: '#e9ecef', color: '#6c757d', label: status };
    }
  };

  if (!project) {
    return (
      <div className="change-requests-tab">
        <div className="empty-state">
          <div className="empty-icon">🔄</div>
          <h3>No Project Selected</h3>
          <p>Please select a project from "My Projects" tab first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="change-requests-tab">
      <div className="tab-header">
        <h2>🔄 Change Requests</h2>
        <p>Request changes to your project scope, features, or design</p>
      </div>

      <button className="new-request-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? '− Cancel' : '+ New Change Request'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="request-form">
          <div className="form-group">
            <label>Request Title *</label>
            <input
              type="text"
              placeholder="e.g., Change button color, Add new feature..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea
              placeholder="Describe the change in detail..."
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
              <option value="low">Low - Can wait</option>
              <option value="medium">Medium - Important</option>
              <option value="high">High - Very Important</option>
              <option value="urgent">Urgent - Need immediately</option>
            </select>
          </div>
          <button type="submit" className="submit-btn">Submit Request</button>
        </form>
      )}

      {loading ? (
        <div className="loading-state">Loading change requests...</div>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔄</div>
          <h3>No Change Requests</h3>
          <p>You haven't submitted any change requests yet.</p>
        </div>
      ) : (
        <div className="requests-list">
          {requests.map(req => {
            const statusStyle = getStatusColor(req.status);
            return (
              <div key={req._id} className="request-card">
                <div className="request-header">
                  <h3>{req.title}</h3>
                  <span className="priority-badge" style={{ background: getPriorityColor(req.priority), color: '#fff' }}>
                    {req.priority.toUpperCase()}
                  </span>
                </div>
                <p className="request-desc">{req.description}</p>
                <div className="request-footer">
                  <span className="status-badge" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                    {statusStyle.label}
                  </span>
                  <span className="request-date">Submitted: {new Date(req.createdAt).toLocaleDateString()}</span>
                </div>
                {req.adminComment && (
                  <div className="admin-response">
                    <strong>Admin Response:</strong>
                    <p>{req.adminComment}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChangeRequestsTab;