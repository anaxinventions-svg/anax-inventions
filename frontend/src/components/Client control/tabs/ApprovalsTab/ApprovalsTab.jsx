import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ApprovalsTab.css';

const API_URL = 'https://anax-inventions.onrender.com/api';

const ApprovalsTab = ({ project }) => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (project) {
      fetchApprovals();
    }
  }, [project]);

  const fetchApprovals = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/client/approvals/${project._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApprovals(res.data.approvals || []);
    } catch (err) {
      console.error('Failed to fetch approvals:', err);
    }
    setLoading(false);
  };

  const handleApprove = async (approval) => {
    const result = await Swal.fire({
      title: 'Digital Signature Required',
      html: `
        <div class="signature-modal">
          <p>By approving this document, you are digitally signing it.</p>
          <p class="legal-note">Your IP address and timestamp will be recorded.</p>
          <input type="text" id="signatureName" class="signature-input" placeholder="Type your full name as signature" />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'I Approve',
      confirmButtonColor: '#28a745',
      preConfirm: () => {
        const signatureName = document.getElementById('signatureName').value;
        if (!signatureName) {
          Swal.showValidationMessage('Please enter your name as signature');
          return false;
        }
        return { signatureName };
      }
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`${API_URL}/client/approvals/${approval._id}/approve`, {
          signature: result.value.signatureName
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Approved!', 'Document approved digitally', 'success');
        fetchApprovals();
      } catch (err) {
        Swal.fire('Error', 'Failed to approve', 'error');
      }
    }
  };

  if (!project) {
    return (
      <div className="approvals-tab">
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <h3>No Project Selected</h3>
          <p>Please select a project from "My Projects" tab first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="approvals-tab">
      <div className="tab-header">
        <h2>✅ Pending Approvals</h2>
        <p>Review and approve documents, designs, and agreements</p>
      </div>

      {loading ? (
        <div className="loading-state">Loading approvals...</div>
      ) : approvals.filter(a => a.status === 'pending').length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <h3>No Pending Approvals</h3>
          <p>All documents have been approved. Great job!</p>
        </div>
      ) : (
        <div className="approvals-list">
          {approvals.filter(a => a.status === 'pending').map(approval => (
            <div key={approval._id} className="approval-card">
              <div className="approval-header">
                <div className="approval-type">
                  <span className="type-icon">
                    {approval.fileType === 'design' ? '🎨' : 
                     approval.fileType === 'document' ? '📄' : 
                     approval.fileType === 'contract' ? '📋' : '📎'}
                  </span>
                  <h3>{approval.title}</h3>
                </div>
                <span className="status-badge pending">Pending</span>
              </div>
              <p className="approval-desc">{approval.description}</p>
              <div className="approval-actions">
                <a href={approval.fileUrl} target="_blank" rel="noopener noreferrer" className="view-btn">👁️ View Document</a>
                <button onClick={() => handleApprove(approval)} className="approve-btn">✅ Approve & Sign</button>
                <button className="revision-btn">✏️ Request Changes</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovalsTab;