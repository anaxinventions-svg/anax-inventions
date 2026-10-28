import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import html2pdf from 'html2pdf.js';
import './ContactMessages.css';

const API_URL = 'https://anax-inventions.onrender.com/api';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => { 
    fetchMessages(); 
  }, [filter]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/contact-messages?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.data || []);
      setStats(res.data.stats || {});
    } catch (err) { 
      console.error('Fetch error:', err); 
    }
    setLoading(false);
  };

  const openDetail = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/contact-messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedMsg(res.data.data);
    } catch (err) { 
      console.error('Detail error:', err); 
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/contact-messages/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMessages();
      if (selectedMsg?._id === id) setSelectedMsg({ ...selectedMsg, status });
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: `Message marked as ${status}`,
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) { 
      Swal.fire('Error!', 'Failed to update', 'error'); 
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({ 
      title: 'Delete Message?', 
      text: 'This cannot be undone!', 
      icon: 'warning', 
      showCancelButton: true, 
      confirmButtonColor: '#dc3545', 
      confirmButtonText: 'Delete',
      cancelButtonColor: '#6c757d'
    });
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/contact-messages/${id}`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        fetchMessages();
        if (selectedMsg?._id === id) setSelectedMsg(null);
        Swal.fire('Deleted!', 'Message removed', 'success');
      } catch(err) {
        Swal.fire('Error', 'Failed to delete', 'error');
      }
    }
  };

  // ✅ EMAIL OPEN - Working
  const openEmailClient = (email, name, message = '') => {
    if (!email) {
      Swal.fire('Info', 'No email address available', 'info');
      return;
    }
    
    const subject = encodeURIComponent(`Re: Your Inquiry - Anax Inventions`);
    const body = encodeURIComponent(
`Hello ${name},

Thank you for reaching out to Anax Inventions.

${message ? `Regarding your message: "${message.substring(0, 100)}"` : ''}

We will get back to you shortly.

Best Regards,
Anax Inventions Team
🌐 www.anaxinventions.com
📧 anaxinventions@gmail.com
📱 +92 311 6735509`
    );
    
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    
    setTimeout(() => {
      if (selectedMsg && selectedMsg._id && selectedMsg.status !== 'Replied') {
        updateStatus(selectedMsg._id, 'Replied');
      }
    }, 2000);
  };

  // ✅ CSV EXPORT - Direct Download
  const exportToCSV = async () => {
    if (messages.length === 0) {
      Swal.fire('No Data', 'No messages to export', 'info');
      return;
    }

    setExporting(true);
    
    try {
      const headers = [
        'S.No', 'Date & Time', 'Name', 'Email', 'Phone', 'Country', 
        'Company', 'Website', 'Service', 'Budget', 'Message', 'Status'
      ];

      const rows = messages.map((msg, index) => [
        index + 1,
        new Date(msg.submittedAt).toLocaleString(),
        `"${(msg.name || '').replace(/"/g, '""')}"`,
        msg.email || '',
        msg.phone || '',
        msg.country || '',
        msg.company || '',
        msg.website || '',
        msg.service || '',
        msg.budget || '',
        `"${(msg.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        msg.status || ''
      ]);

      const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `anax_inventions_messages_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      Swal.fire({
        icon: 'success',
        title: 'Export Complete!',
        text: `${messages.length} messages exported as CSV`,
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire('Export Failed', 'Something went wrong', 'error');
    }
    
    setExporting(false);
  };

  // ✅ PDF EXPORT - Proper PDF Direct Download
  const exportToPDF = async () => {
    if (messages.length === 0) {
      Swal.fire('No Data', 'No messages to export', 'info');
      return;
    }

    setExporting(true);
    
    try {
      // Create a temporary div for PDF content
      const element = document.createElement('div');
      const currentDate = new Date().toLocaleString();
      
      // Build HTML content for PDF
      let tableRows = '';
      messages.forEach((msg, index) => {
        tableRows += `
          <tr style="border-bottom: 1px solid #e0e0e0;">
            <td style="padding: 10px; border: 1px solid #ddd; font-size: 11px;">${index + 1}</td>
            <td style="padding: 10px; border: 1px solid #ddd; font-size: 11px;">${new Date(msg.submittedAt).toLocaleString()}</td>
            <td style="padding: 10px; border: 1px solid #ddd; font-size: 11px;"><strong>${msg.name}</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd; font-size: 11px; color: #cc7722;">${msg.email}</td>
            <td style="padding: 10px; border: 1px solid #ddd; font-size: 11px;">${msg.phone || '-'}</td>
            <td style="padding: 10px; border: 1px solid #ddd; font-size: 11px;">${msg.country || '-'}</td>
            <td style="padding: 10px; border: 1px solid #ddd; font-size: 11px;">${msg.company || '-'}</td>
            <td style="padding: 10px; border: 1px solid #ddd; font-size: 11px;">${msg.service || '-'}</td>
            <td style="padding: 10px; border: 1px solid #ddd; font-size: 11px;">${msg.budget || '-'}</td>
            <td style="padding: 10px; border: 1px solid #ddd; font-size: 11px;">
              <span style="padding: 3px 8px; border-radius: 12px; background: ${msg.status === 'New' ? '#fff3e6' : msg.status === 'Read' ? '#e9ecef' : msg.status === 'Replied' ? '#d4edda' : '#e9ecef'}; color: ${msg.status === 'New' ? '#cc7722' : msg.status === 'Replied' ? '#28a745' : '#6c757d'};">
                ${msg.status}
              </span>
            </td>
            <td style="padding: 10px; border: 1px solid #ddd; font-size: 11px; max-width: 250px;">${(msg.message || '').substring(0, 100)}${(msg.message || '').length > 100 ? '...' : ''}</td>
          </tr>
        `;
      });

      element.innerHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Anax Inventions - Contact Messages Report</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              padding: 20px;
              background: #fff;
            }
            .header {
              text-align: center;
              margin-bottom: 25px;
              padding-bottom: 20px;
              border-bottom: 3px solid #cc7722;
            }
            .header h1 {
              color: #1d2e2a;
              font-size: 28px;
              margin-bottom: 8px;
            }
            .header h2 {
              color: #cc7722;
              font-size: 14px;
              font-weight: normal;
              margin-bottom: 10px;
            }
            .header p {
              color: #666;
              font-size: 11px;
            }
            .logo {
              width: 60px;
              height: 60px;
              background: #1d2e2a;
              border-radius: 12px;
              margin: 0 auto 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #cc7722;
              font-size: 24px;
              font-weight: bold;
            }
            .stats {
              display: flex;
              gap: 15px;
              margin-bottom: 25px;
              padding: 15px;
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
              border-radius: 12px;
            }
            .stat {
              flex: 1;
              text-align: center;
              padding: 10px;
              background: #fff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .stat-value {
              font-size: 24px;
              font-weight: bold;
              color: #1d2e2a;
            }
            .stat-label {
              font-size: 11px;
              color: #666;
              margin-top: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              font-size: 11px;
            }
            th {
              background: #1d2e2a;
              color: #fff;
              padding: 12px;
              text-align: left;
              font-weight: 600;
              font-size: 11px;
            }
            td {
              padding: 10px;
              border: 1px solid #dee2e6;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 10px;
              color: #999;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">ANAX</div>
            <h1>ANAX INVENTIONS</h1>
            <h2>Contact Messages Report</h2>
            <p>Generated on: ${currentDate}</p>
          </div>
          
          <div class="stats">
            <div class="stat">
              <div class="stat-value">${stats.new || 0}</div>
              <div class="stat-label">🆕 New</div>
            </div>
            <div class="stat">
              <div class="stat-value">${stats.read || 0}</div>
              <div class="stat-label">👁️ Read</div>
            </div>
            <div class="stat">
              <div class="stat-value">${stats.replied || 0}</div>
              <div class="stat-label">✅ Replied</div>
            </div>
            <div class="stat">
              <div class="stat-value">${stats.archived || 0}</div>
              <div class="stat-label">📦 Archived</div>
            </div>
            <div class="stat">
              <div class="stat-value">${messages.length}</div>
              <div class="stat-label">📊 Total</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Date & Time</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Country</th>
                <th>Company</th>
                <th>Service</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Anax Inventions - www.anaxinventions.com | anaxinventions@gmail.com | +92 311 6735509</p>
            <p>This is a system generated report | Generated on ${currentDate}</p>
          </div>
        </body>
        </html>
      `;

      // PDF options
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `anax_inventions_report_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, letterRendering: true, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
      };

      // Generate and download PDF
      html2pdf().set(opt).from(element).save();
      
      Swal.fire({
        icon: 'success',
        title: 'PDF Generated!',
        text: 'PDF file is being downloaded',
        timer: 2000,
        showConfirmButton: false
      });
      
    } catch (error) {
      console.error('PDF export error:', error);
      Swal.fire('Export Failed', 'Something went wrong: ' + error.message, 'error');
    }
    
    setExporting(false);
  };

  // Helper: WhatsApp link
  const getWhatsAppLink = (phone) => {
    if (!phone) return '#';
    let cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('92') && cleaned.length === 12) {
      // good
    } else if (cleaned.startsWith('0') && cleaned.length === 11) {
      cleaned = '92' + cleaned.substring(1);
    } else if (cleaned.length === 10) {
      cleaned = '92' + cleaned;
    }
    return `https://wa.me/${cleaned}`;
  };

  // Toggle select for bulk delete
  const toggleSelect = (id, e) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredMessages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMessages.map(m => m._id));
    }
  };

  const bulkDelete = async () => {
    if (selectedIds.length === 0) {
      Swal.fire('Warning', 'Select messages to delete', 'warning');
      return;
    }
    
    const result = await Swal.fire({
      title: `Delete ${selectedIds.length} messages?`,
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Yes, delete',
      cancelButtonColor: '#6c757d'
    });
    
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`${API_URL}/contact-messages/bulk-delete`, 
          { ids: selectedIds },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire('Deleted!', `${selectedIds.length} messages deleted.`, 'success');
        setSelectedIds([]);
        fetchMessages();
        if (selectedMsg && selectedIds.includes(selectedMsg._id)) setSelectedMsg(null);
      } catch (err) {
        Swal.fire('Error', 'Failed to delete messages', 'error');
      }
    }
  };

  const filteredMessages = messages.filter(m => 
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase()) ||
    m.company?.toLowerCase().includes(search.toLowerCase()) ||
    m.phone?.toLowerCase().includes(search.toLowerCase()) ||
    m.message?.toLowerCase().includes(search.toLowerCase())
  );

  const statusTabs = [
    { key: 'All', label: 'All Messages', icon: '📬' },
    { key: 'New', label: 'New', icon: '🆕', color: '#cc7722' },
    { key: 'Read', label: 'Read', icon: '👁️', color: '#6c757d' },
    { key: 'Replied', label: 'Replied', icon: '✅', color: '#28a745' },
    { key: 'Archived', label: 'Archived', icon: '📦', color: '#6c757d' }
  ];

  const getStatusClass = (status) => {
    switch(status) {
      case 'New': return 'status-new';
      case 'Read': return 'status-read';
      case 'Replied': return 'status-replied';
      case 'Archived': return 'status-archived';
      default: return '';
    }
  };

  return (
    <div className="cm-container">
      {/* Header */}
      <div className="cm-header">
        <div className="cm-header-content">
          <div className="cm-title-section">
            <div className="cm-title-icon">📧</div>
            <div>
              <h1>Contact Messages</h1>
              <p>Manage and respond to customer inquiries</p>
            </div>
          </div>
          <div className="cm-stats-cards">
            <div className="stat-card">
              <span className="stat-value">{stats.new || 0}</span>
              <span className="stat-label">New</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.read || 0}</span>
              <span className="stat-label">Read</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.replied || 0}</span>
              <span className="stat-label">Replied</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="cm-toolbar">
        <div className="cm-tabs">
          {statusTabs.map(tab => (
            <button 
              key={tab.key} 
              className={`cm-tab ${filter === tab.key ? 'active' : ''}`}
              onClick={() => { setFilter(tab.key); setSelectedIds([]); }}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
              {tab.key !== 'All' && (
                <span className="tab-count" style={{ background: tab.color }}>
                  {stats[tab.key.toLowerCase()] || 0}
                </span>
              )}
            </button>
          ))}
        </div>
        
        <div className="cm-actions">
          <div className="cm-search-box">
            <span className="search-icon">🔍</span>
            <input 
              type="text"
              placeholder="Search by name, email, company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="cm-search"
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>
          <div className="cm-export-group">
            <button className="cm-export-btn csv" onClick={exportToCSV} disabled={exporting}>
              📊 Export CSV
            </button>
            <button className="cm-export-btn pdf" onClick={exportToPDF} disabled={exporting}>
              📄 Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="cm-bulk-bar">
          <div className="bulk-info">
            <input type="checkbox" checked={selectedIds.length === filteredMessages.length} onChange={selectAll} id="selectAll" />
            <label htmlFor="selectAll">Select All ({filteredMessages.length})</label>
            <span className="bulk-count">{selectedIds.length} selected</span>
          </div>
          <div className="bulk-actions">
            <button className="bulk-delete" onClick={bulkDelete}>🗑️ Delete Selected</button>
            <button className="bulk-cancel" onClick={() => setSelectedIds([])}>Cancel</button>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="cm-main-layout">
        {/* Left Panel - Messages List */}
        <div className="cm-messages-panel">
          <div className="panel-header">
            <span>All Conversations</span>
            <span className="message-count">{filteredMessages.length} messages</span>
          </div>
          <div className="messages-list">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading messages...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>No messages found</p>
              </div>
            ) : (
              filteredMessages.map(msg => (
                <div 
                  key={msg._id}
                  className={`message-item ${selectedMsg?._id === msg._id ? 'active' : ''} ${msg.status === 'New' ? 'unread' : ''}`}
                  onClick={() => openDetail(msg._id)}
                >
                  <div className="message-checkbox" onClick={(e) => toggleSelect(msg._id, e)}>
                    <input type="checkbox" checked={selectedIds.includes(msg._id)} readOnly />
                  </div>
                  <div className="message-avatar">
                    <div className="avatar-initials">{msg.name?.charAt(0)?.toUpperCase()}</div>
                    {msg.status === 'New' && <div className="unread-badge"></div>}
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <h4>{msg.name}</h4>
                      <span className="message-time">{new Date(msg.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="message-sub">
                      <span className="message-email">{msg.email}</span>
                      {msg.company && <span className="message-company">• {msg.company}</span>}
                    </div>
                    <p className="message-preview">{msg.message?.substring(0, 60)}...</p>
                    <div className="message-footer">
                      <span className={`message-status ${getStatusClass(msg.status)}`}>
                        {msg.status === 'New' && '🆕 New'}
                        {msg.status === 'Read' && '👁️ Read'}
                        {msg.status === 'Replied' && '✅ Replied'}
                        {msg.status === 'Archived' && '📦 Archived'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Message Detail */}
        <div className="cm-detail-panel">
          {selectedMsg ? (
            <div className="detail-container">
              {/* Detail Header */}
              <div className="detail-header">
                <div className="contact-info">
                  <div className="contact-avatar-large">
                    {selectedMsg.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="contact-details">
                    <h2>{selectedMsg.name}</h2>
                    <div className="contact-badges">
                      <span className={`detail-status ${getStatusClass(selectedMsg.status)}`}>
                        {selectedMsg.status}
                      </span>
                      <span className="contact-date">
                        Received: {new Date(selectedMsg.submittedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="contact-actions">
                  <button className="action-btn email" onClick={() => openEmailClient(selectedMsg.email, selectedMsg.name, selectedMsg.message)}>
                    ✉️ Email
                  </button>
                  {selectedMsg.phone && (
                    <a href={getWhatsAppLink(selectedMsg.phone)} target="_blank" rel="noopener noreferrer" className="action-btn whatsapp">
                      💬 WhatsApp
                    </a>
                  )}
                </div>
              </div>

              {/* Contact Details Grid */}
              <div className="details-grid">
                <div className="detail-card">
                  <div className="detail-card-header">
                    <span>📧</span>
                    <h4>Contact Information</h4>
                  </div>
                  <div className="detail-card-content">
                    <div className="detail-row">
                      <label>Email Address</label>
                      <button className="email-link" onClick={() => openEmailClient(selectedMsg.email, selectedMsg.name, selectedMsg.message)}>
                        {selectedMsg.email} <span>✉️</span>
                      </button>
                    </div>
                    {selectedMsg.phone && (
                      <div className="detail-row">
                        <label>Phone Number</label>
                        <a href={getWhatsAppLink(selectedMsg.phone)} target="_blank" rel="noopener noreferrer">
                          {selectedMsg.phone} <span>💬</span>
                        </a>
                      </div>
                    )}
                    {selectedMsg.country && (
                      <div className="detail-row">
                        <label>Country</label>
                        <span>{selectedMsg.country}</span>
                      </div>
                    )}
                    {selectedMsg.company && (
                      <div className="detail-row">
                        <label>Company</label>
                        <span>{selectedMsg.company}</span>
                      </div>
                    )}
                    {selectedMsg.website && (
                      <div className="detail-row">
                        <label>Website</label>
                        <a href={selectedMsg.website.startsWith('http') ? selectedMsg.website : `https://${selectedMsg.website}`} target="_blank" rel="noopener noreferrer">
                          {selectedMsg.website} <span>🌐</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="detail-card">
                  <div className="detail-card-header">
                    <span>⚙️</span>
                    <h4>Project Details</h4>
                  </div>
                  <div className="detail-card-content">
                    {selectedMsg.service && (
                      <div className="detail-row">
                        <label>Service Required</label>
                        <span className="service-tag">{selectedMsg.service}</span>
                      </div>
                    )}
                    {selectedMsg.budget && (
                      <div className="detail-row">
                        <label>Budget Range</label>
                        <span className="budget-value">{selectedMsg.budget}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="message-content-card">
                <div className="message-header-section">
                  <span>💬</span>
                  <h4>Message</h4>
                </div>
                <div className="message-body">
                  {selectedMsg.message}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button className="action-btn primary" onClick={() => openEmailClient(selectedMsg.email, selectedMsg.name, selectedMsg.message)}>
                  ✉️ Reply via Email
                </button>
                {selectedMsg.phone && (
                  <a href={getWhatsAppLink(selectedMsg.phone)} target="_blank" rel="noopener noreferrer" className="action-btn secondary">
                    💬 Chat on WhatsApp
                  </a>
                )}
                <div className="status-actions">
                  {selectedMsg.status !== 'Read' && (
                    <button className="status-update" onClick={() => updateStatus(selectedMsg._id, 'Read')}>
                      👁️ Mark as Read
                    </button>
                  )}
                  {selectedMsg.status !== 'Replied' && (
                    <button className="status-update" onClick={() => updateStatus(selectedMsg._id, 'Replied')}>
                      ✅ Mark as Replied
                    </button>
                  )}
                  <button className="status-update delete" onClick={() => handleDelete(selectedMsg._id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-detail">
              <div className="empty-icon">💬</div>
              <h3>No Message Selected</h3>
              <p>Select a message from the left panel to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactMessages;