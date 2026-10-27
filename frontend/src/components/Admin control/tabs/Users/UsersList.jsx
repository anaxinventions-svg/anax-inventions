import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Users.css';

const API_URL = 'http://localhost:5001/api';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Failed to fetch users');
    }
    setLoading(false);
  };

  const handleDelete = async (userId, userName) => {
    const result = await Swal.fire({
      title: 'Delete User?',
      html: `<div style="text-align:center"><p style="color:#e44;font-size:3rem;margin:0">⚠️</p><p>Are you sure you want to delete <strong>${userName}</strong>?</p><p style="color:#888;font-size:0.8rem">This action cannot be undone.</p></div>`,
      icon: null,
      showCancelButton: true,
      confirmButtonColor: '#e44',
      cancelButtonColor: '#888',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/auth/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(users.filter(u => u._id !== userId));
        
        Swal.fire({
          title: 'Deleted!',
          text: 'User has been removed successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire('Error!', err.response?.data?.message || 'Failed to delete', 'error');
      }
    }
  };

  const handleExportPDF = async () => {
    Swal.fire({
      title: 'Generating PDF...',
      text: 'Please wait',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/auth/users/export/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ANAX_Users_Report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      Swal.fire({ title: '✅ Downloaded!', text: 'PDF report generated.', icon: 'success', timer: 2000, showConfirmButton: false });
    } catch (err) {
      Swal.fire('Error!', 'Failed to export PDF', 'error');
    }
  };

  const handleExportExcel = async () => {
    Swal.fire({
      title: 'Generating Excel...',
      text: 'Please wait',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/auth/users/export/excel`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ANAX_Users_Data.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      Swal.fire({ title: '✅ Downloaded!', text: 'Excel file generated.', icon: 'success', timer: 2000, showConfirmButton: false });
    } catch (err) {
      Swal.fire('Error!', 'Failed to export Excel', 'error');
    }
  };

  const filteredUsers = users.filter(u => 
    (u.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="users-tab">
      {/* USERS BANNER - Dark fixed */}
      <div className="users-banner">
        <div className="users-banner-inner">
          <div className="users-banner-left">
            <div className="users-banner-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <h2>User Management</h2>
              <p>{users.length} registered users</p>
            </div>
          </div>
          <div className="users-banner-right">
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="users-search"
            />
            <button className="users-export-btn pdf-btn" onClick={handleExportPDF} title="Download PDF">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              PDF
            </button>
            <button className="users-export-btn excel-btn" onClick={handleExportExcel} title="Download Excel">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>
              Excel
            </button>
          </div>
        </div>
      </div>

      {/* TABLE - Scrollable */}
      <div className="users-table-container">
        {loading ? (
          <div className="users-loading">
            <div className="users-spinner" />
            <p>Loading users...</p>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Last Login</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="users-empty">
                    <div className="users-empty-icon">📭</div>
                    <p>No users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">{u.fullName?.charAt(0) || '?'}</div>
                        <span className="user-name">{u.fullName || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="user-email">{u.email || 'N/A'}</td>
                    <td><span className={`role-tag ${u.role}`}>{u.role}</span></td>
                    <td>
                      <span className={`status-badge ${u.isVerified ? 'verified' : 'pending'}`}>
                        <span className="status-dot" />
                        {u.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="user-date">{u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB') : 'N/A'}</td>
                    <td className="user-date">{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-GB') : 'Never'}</td>
                    <td>
                      <button 
                        className="users-delete-btn"
                        onClick={() => handleDelete(u._id, u.fullName)}
                        title="Delete user"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UsersList;