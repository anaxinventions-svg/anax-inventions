import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ProjectsManager.css';

const API_URL = 'http://localhost:5001/api';

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    name: '',
    description: '',
    type: 'Website',
    totalBudget: '',
    currency: 'GBP',
    startDate: '',
    expectedDeliveryDate: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const getToken = () => localStorage.getItem('token');

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${getToken()}` };
      const [projectsRes, clientsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/projects`, { headers }),
        axios.get(`${API_URL}/admin/clients`, { headers })
      ]);
      setProjects(projectsRes.data.projects || []);
      setClients(clientsRes.data.clients?.filter(c => c.isActive) || []);
    } catch (err) {
      console.error('Error:', err);
      Swal.fire('Error', 'Failed to load data', 'error');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!formData.clientId || !formData.name) {
      Swal.fire('Error', 'Client and Project Name required!', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/admin/projects`, formData, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      Swal.fire('Success!', 'Project created successfully', 'success');
      setShowCreateModal(false);
      setFormData({
        clientId: '',
        name: '',
        description: '',
        type: 'Website',
        totalBudget: '',
        currency: 'GBP',
        startDate: '',
        expectedDeliveryDate: ''
      });
      fetchData();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to create project', 'error');
    }
    setSubmitting(false);
  };

  const handleDeleteProject = async (projectId, projectName) => {
    const result = await Swal.fire({
      title: 'Delete Project?',
      text: `Delete "${projectName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Yes, Delete'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/admin/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        Swal.fire('Deleted!', 'Project removed.', 'success');
        fetchData();
      } catch (err) {
        Swal.fire('Error', 'Failed to delete', 'error');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Planning': '#ffc107',
      'Active': '#28a745',
      'Paused': '#fd7e14',
      'Completed': '#17a2b8',
      'Cancelled': '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c._id === clientId);
    return client ? client.fullName : 'Unknown';
  };

  return (
    <div className="projects-manager">
      <div className="pm-header">
        <div className="pm-header-left">
          <h2>Project Management</h2>
          <p>Create and manage client projects</p>
        </div>
        <button className="pm-add-btn" onClick={() => setShowCreateModal(true)}>+ New Project</button>
      </div>

      <div className="pm-table-container">
        {loading ? (
          <div className="pm-loading">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="pm-empty">
            <div className="pm-empty-icon">📁</div>
            <h3>No Projects Yet</h3>
            <p>Create a project and assign to a client.</p>
          </div>
        ) : (
          <table className="pm-table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Name</th>
                <th>Client</th>
                <th>Type</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project._id}>
                  <td><code>{project.projectId}</code></td>
                  <td><strong>{project.name}</strong></td>
                  <td>{getClientName(project.clientId)}</td>
                  <td>{project.type}</td>
                  <td>{project.currency} {project.totalBudget?.toLocaleString()}</td>
                  <td>
                    <span className="pm-status-badge" style={{ background: getStatusColor(project.status) + '20', color: getStatusColor(project.status) }}>
                      {project.status}
                    </span>
                  </td>
                  <td>
                    <div className="pm-progress-bar">
                      <div className="pm-progress-fill" style={{ width: `${project.overallProgress}%` }}></div>
                    </div>
                    <small>{project.overallProgress}%</small>
                  </td>
                  <td>
                    <button className="pm-action-btn delete" onClick={() => handleDeleteProject(project._id, project.name)} title="Delete">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="pm-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="pm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pm-modal-header">
              <h3>Create New Project</h3>
              <button className="pm-modal-close" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateProject}>
              <div className="pm-modal-body">
                <div className="pm-form-row">
                  <div className="pm-form-group">
                    <label>Select Client *</label>
                    <select name="clientId" value={formData.clientId} onChange={handleChange} required>
                      <option value="">-- Choose Client --</option>
                      {clients.map(client => (
                        <option key={client._id} value={client._id}>{client.fullName} ({client.email})</option>
                      ))}
                    </select>
                  </div>
                  <div className="pm-form-group">
                    <label>Project Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                </div>

                <div className="pm-form-row">
                  <div className="pm-form-group">
                    <label>Project Type</label>
                    <select name="type" value={formData.type} onChange={handleChange}>
                      <option>Website</option>
                      <option>Mobile App</option>
                      <option>Software</option>
                      <option>E-commerce</option>
                      <option>SEO</option>
                      <option>Design</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="pm-form-group">
                    <label>Total Budget</label>
                    <input type="number" name="totalBudget" value={formData.totalBudget} onChange={handleChange} placeholder="0" />
                  </div>
                </div>

                <div className="pm-form-row">
                  <div className="pm-form-group">
                    <label>Currency</label>
                    <select name="currency" value={formData.currency} onChange={handleChange}>
                      <option>GBP</option>
                      <option>USD</option>
                      <option>EUR</option>
                      <option>PKR</option>
                    </select>
                  </div>
                  <div className="pm-form-group">
                    <label>Start Date</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                  </div>
                </div>

                <div className="pm-form-row">
                  <div className="pm-form-group">
                    <label>Expected Delivery</label>
                    <input type="date" name="expectedDeliveryDate" value={formData.expectedDeliveryDate} onChange={handleChange} />
                  </div>
                </div>

                <div className="pm-form-group full-width">
                  <label>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Project details..."></textarea>
                </div>
              </div>
              <div className="pm-modal-footer">
                <button type="button" className="pm-btn-cancel" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="pm-btn-create" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsManager;