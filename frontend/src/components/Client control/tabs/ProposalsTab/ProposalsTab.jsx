import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import './ProposalsTab.css';

const API_URL = 'https://anax-inventions.onrender.com/api';

const ProposalsTab = ({ user, onUpdate }) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showDocument, setShowDocument] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureData, setSignatureData] = useState('');
  const [signatureType, setSignatureType] = useState('draw');
  const [typedSignature, setTypedSignature] = useState('');
  const [canvasRef, setCanvasRef] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signingProposalId, setSigningProposalId] = useState(null);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/client/requirements/proposals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProposals(res.data.proposals || []);
    } catch (err) {
      console.error('Error fetching proposals:', err);
      setProposals([]);
    }
    setLoading(false);
  };

  // ✅ CLIENT SIGNS PROPOSAL
  const handleClientSign = async (proposalId) => {
    setSigningProposalId(proposalId);
    setShowSignatureModal(true);
  };

  const submitClientSignature = async () => {
    let finalSignature = signatureData;

    if (signatureType === 'type' && typedSignature) {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      ctx.font = 'italic 24px "Brush Script MT", cursive';
      ctx.fillStyle = '#1d2e2a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(typedSignature, 200, 50);
      finalSignature = canvas.toDataURL();
    }

    if (!finalSignature) {
      Swal.fire('Error', 'Please provide a signature', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/client/requirements/proposal/${signingProposalId}/sign`, {
        signature: finalSignature,
        signedBy: user?.fullName
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Swal.fire({
        title: 'Proposal Signed!',
        html: `<div style="text-align: center;">
          <div style="width: 60px; height: 60px; background: #28a745; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
            <span style="font-size: 30px; color: white;">✓</span>
          </div>
          <p style="font-size: 16px; font-weight: 600;">Proposal Signed Successfully!</p>
          <p style="font-size: 13px; color: #666;">Admin has been notified and will counter-sign shortly.</p>
          <p style="font-size: 12px; color: #cc7722; margin-top: 10px;">You will receive a confirmation email once admin countersigns.</p>
        </div>`,
        icon: 'success',
        confirmButtonColor: '#cc7722'
      });

      setShowSignatureModal(false);
      setSignatureData('');
      setTypedSignature('');
      setSigningProposalId(null);
      fetchProposals();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Sign error:', err);
      Swal.fire('Error', err.response?.data?.message || 'Failed to sign proposal', 'error');
    }
  };

  const handleAccept = async (proposalId) => {
    const result = await Swal.fire({
      title: 'Accept Proposal?',
      text: 'Are you sure you want to accept this proposal?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Yes, Accept'
    });
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`${API_URL}/client/requirements/proposal/${proposalId}/accept`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Accepted!', 'Proposal accepted successfully', 'success');
        fetchProposals();
        if (onUpdate) onUpdate();
      } catch (err) {
        Swal.fire('Error', 'Failed to accept proposal', 'error');
      }
    }
  };

  const handleDecline = async (proposalId) => {
    const result = await Swal.fire({
      title: 'Decline Proposal?',
      text: 'Are you sure you want to decline this proposal?',
      icon: 'warning',
      showCancelButton: true,
      input: 'textarea',
      inputPlaceholder: 'Please provide a reason for declining...',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Decline'
    });
    
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`${API_URL}/client/requirements/proposal/${proposalId}/decline`, {
          reason: result.value || 'No reason provided'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Declined!', 'Proposal declined', 'success');
        fetchProposals();
        if (onUpdate) onUpdate();
      } catch (err) {
        Swal.fire('Error', 'Failed to decline proposal', 'error');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      draft: { bg: '#FEF3C7', color: '#D97706', label: 'Draft' },
      sent: { bg: '#DBEAFE', color: '#2563EB', label: 'Sent' },
      viewed: { bg: '#E0E7FF', color: '#4F46E5', label: 'Viewed' },
      client_signed: { bg: '#FEF3C7', color: '#D97706', label: 'Awaiting Admin' },
      admin_signed: { bg: '#DCFCE7', color: '#16A34A', label: 'Counter-Signed' },
      accepted: { bg: '#DCFCE7', color: '#16A34A', label: 'Accepted' },
      declined: { bg: '#FEE2E2', color: '#DC2626', label: 'Declined' },
      expired: { bg: '#F3F4F6', color: '#6B7280', label: 'Expired' }
    };
    const style = statusMap[status] || statusMap.draft;
    return (
      <span className="proposal-status-badge" style={{ background: style.bg, color: style.color }}>
        {style.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatCurrency = (amount) => parseInt(amount).toLocaleString();

  const formatFieldName = (key) => {
    const fieldMap = {
      businessPurpose: 'Business Purpose', targetAudience: 'Target Audience',
      uniqueSellingPoints: 'Unique Selling Points', scopeOfWork: 'Scope of Work',
      frontendTech: 'Frontend Technology', backendTech: 'Backend Technology',
      database: 'Database Preference', cms: 'Content Management System',
      thirdPartyIntegrations: 'Third Party Integrations', pages: 'Number of Pages',
      features: 'Key Features', responsive: 'Responsive Design',
      performanceSecurity: 'Performance & Security', seoRequirements: 'SEO Requirements',
      brandGuidelines: 'Brand Guidelines', designInspiration: 'Design Inspiration',
      appPurpose: 'App Purpose', platform: 'Target Platform', appCategory: 'App Category',
      userAuthentication: 'User Authentication', backendRequirements: 'Backend Requirements',
      offlineSupport: 'Offline Support', adminPanel: 'Admin Panel Required',
      designPreferences: 'Design Preferences', storeSubmission: 'App Store Submission',
      businessType: 'Business Type', productCount: 'Estimated Products',
      productTypes: 'Product Types', paymentGateways: 'Payment Gateways',
      shippingRequirements: 'Shipping Requirements', taxConfiguration: 'Tax Configuration',
      inventoryManagement: 'Inventory Management', socialCommerce: 'Social Commerce',
      returnsPolicy: 'Returns Policy', primaryGoal: 'Primary Marketing Goal',
      platforms: 'Target Platforms', monthlyBudget: 'Monthly Budget',
      campaignDuration: 'Campaign Duration', existingChannels: 'Existing Channels',
      competitors: 'Competitors', seoKeywords: 'SEO Keywords',
      contentRequirements: 'Content Requirements', analytics: 'Analytics & Reporting',
      websiteUrl: 'Website URL', existingAssets: 'Existing Assets',
      designType: 'Design Type', projectScope: 'Project Scope',
      numberOfScreens: 'Number of Screens', designTool: 'Design Tool',
      colorPreferences: 'Color Preferences', typography: 'Typography',
      interactivity: 'Interactivity', responsiveRequirements: 'Responsive Requirements',
      deliverables: 'Deliverables', targetUsers: 'Target Users',
      accessibility: 'Accessibility', softwareType: 'Software Type',
      userRoles: 'User Roles', coreFeatures: 'Core Features',
      integrations: 'Integrations', technologyPreference: 'Technology Preference',
      databasePreference: 'Database Preference', deployment: 'Deployment',
      dataImport: 'Data Import', reporting: 'Reporting',
      security: 'Security', specificRequirements: 'Specific Requirements',
      preferredTechnology: 'Preferred Technology', specialFeatures: 'Special Features'
    };
    return fieldMap[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  const startDrawing = (e) => {
    const canvas = canvasRef;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1d2e2a';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef;
    if (canvas) setSignatureData(canvas.toDataURL());
  };

  const clearSignature = () => {
    const canvas = canvasRef;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureData('');
      setTypedSignature('');
    }
  };

  const downloadProposal = (proposal) => {
    const printWindow = window.open('', '_blank');
    const content = document.getElementById(`proposal-document-${proposal._id}`)?.cloneNode(true);
    if (content) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Proposal - ${proposal.projectName}</title>
            <style>
              body { font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; }
              @media print { body { margin: 0; padding: 20px; } .no-print { display: none !important; } }
              .proposal-status-badge { display: inline-block; padding: 4px 12px; font-size: 0.7rem; }
            </style>
          </head>
          <body>${content.innerHTML}</body>
        </html>
      `);
      printWindow.print();
    }
  };

  const getProposalRef = (proposal) => {
    if (proposal._id && proposal._id.length > 8) {
      return `ANAX-${proposal._id.slice(-8).toUpperCase()}`;
    }
    return `ANAX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  };

  const renderAboutSection = () => {
    if (!selectedProposal) return null;
    const imageUrl = selectedProposal.aboutImage;
    const hasAboutText = selectedProposal.aboutUs && selectedProposal.aboutUs.trim().length > 0;
    const hasImage = !!imageUrl;
    if (!hasAboutText && !hasImage) return null;

    return (
      <div className="doc-section about-section">
        <h3>About Us</h3>
        <div className="about-content">
          {hasImage && (
            <div className="about-image-wrapper">
              <img 
                src={imageUrl}
                alt="About Anax Inventions" 
                className="about-image"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}
          <div className="about-text">
            <p>{selectedProposal.aboutUs || 'Anax Inventions is a leading digital solutions provider...'}</p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="proposals-tab">
        <div className="pt-loading"><div className="pt-spinner"></div><p>Loading proposals...</p></div>
      </div>
    );
  }

  return (
    <div className="proposals-tab">
      <div className="pt-header">
        <h2>My Proposals</h2>
        <p>View and manage professional proposals from Anax Inventions</p>
      </div>

      {proposals.length === 0 ? (
        <div className="pt-empty">
          <div className="pt-empty-icon">◆</div>
          <h3>No Proposals Yet</h3>
          <p>When admin sends you a proposal, it will appear here.</p>
        </div>
      ) : (
        <div className="pt-proposals-grid">
          {proposals.map((proposal, idx) => (
            <motion.div key={proposal._id || idx} className="pt-proposal-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <div className="pt-card-header">
                <div className="pt-card-icon">◆</div>
                <div className="pt-card-title"><h3>{proposal.projectName}</h3><p>{getProposalRef(proposal)}</p></div>
                {getStatusBadge(proposal.status)}
              </div>
              <div className="pt-card-body">
                <div className="pt-detail-row"><span className="pt-detail-label">Budget</span><span className="pt-detail-value">Rs {formatCurrency(proposal.budget)}</span></div>
                <div className="pt-detail-row"><span className="pt-detail-label">Timeline</span><span className="pt-detail-value">{proposal.timeline}</span></div>
                <div className="pt-detail-row"><span className="pt-detail-label">Valid Until</span><span className="pt-detail-value">{formatDate(proposal.validUntil)}</span></div>
              </div>
              <div className="pt-card-footer">
                <button className="pt-btn-view" onClick={() => { setSelectedProposal(proposal); setShowDocument(true); }}>View Full Proposal</button>
                {proposal.status === 'sent' && (
                  <button className="pt-btn-accept" onClick={() => handleClientSign(proposal._id)}>Accept & Sign</button>
                )}
                {proposal.status === 'sent' && (
                  <button className="pt-btn-decline" onClick={() => handleDecline(proposal._id)}>Decline</button>
                )}
                {proposal.status === 'client_signed' && (
                  <span className="pt-pending-badge">Awaiting Admin Counter-Signature</span>
                )}
                {proposal.status === 'admin_signed' && (
                  <span className="pt-finalized-badge">✓ Finalized & Counter-Signed</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* PROPOSAL DOCUMENT MODAL */}
      <AnimatePresence>
        {showDocument && selectedProposal && (
          <motion.div className="document-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="document-container">
              <div className="document-header-actions no-print">
                <button className="doc-close-btn" onClick={() => setShowDocument(false)}>← Back to Proposals</button>
                <button className="doc-download-btn" onClick={() => downloadProposal(selectedProposal)}>Download / Print</button>
              </div>

              <div className="proposal-document" id={`proposal-document-${selectedProposal._id}`}>
                {/* Letterhead */}
                <div className="doc-letterhead">
                  <div className="letterhead-left">
                    <div className="logo-circle"><img src="/anax-logo.png" alt="Anax Inventions" className="logo-image-circle" /></div>
                    <div className="logo-text"><h1>ANAX INVENTIONS</h1><p>Transforming Ideas into Digital Reality</p></div>
                  </div>
                  <div className="letterhead-right">
                    <div className="proposal-badge">OFFICIAL PROPOSAL</div>
                    <div className="proposal-ref">{getProposalRef(selectedProposal)}</div>
                    <div className="proposal-date">{formatDate(selectedProposal.createdAt)}</div>
                  </div>
                </div>
                <div className="doc-border-top"></div>

                {/* Client & Project Info */}
                <div className="doc-info-grid">
                  <div className="doc-info-box">
                    <h4>Prepared For</h4>
                    <p className="client-name"><strong>{selectedProposal.clientName}</strong></p>
                    <p>{selectedProposal.clientEmail}</p>
                    {selectedProposal.clientPhone && <p>{selectedProposal.clientPhone}</p>}
                    {selectedProposal.clientCompany && <p className="client-company">{selectedProposal.clientCompany}</p>}
                  </div>
                  <div className="doc-info-box">
                    <h4>Project Details</h4>
                    <table className="info-table"><tbody>
                      <tr><td className="label">Project Title</td><td className="value">{selectedProposal.projectName}</td></tr>
                      <tr><td className="label">Budget</td><td className="value budget">Rs {formatCurrency(selectedProposal.budget)}</td></tr>
                      <tr><td className="label">Timeline</td><td className="value">{selectedProposal.timeline}</td></tr>
                      <tr><td className="label">Valid Until</td><td className="value">{formatDate(selectedProposal.validUntil)}</td></tr>
                    </tbody></table>
                  </div>
                </div>

                <div className="doc-status">{getStatusBadge(selectedProposal.status)}</div>

                {/* Client Signature Status Banner */}
                {selectedProposal.status === 'client_signed' && (
                  <div className="signature-status-banner client-signed">
                    <span>✓ You have signed this proposal. Awaiting admin counter-signature.</span>
                  </div>
                )}
                {selectedProposal.status === 'admin_signed' && (
                  <div className="signature-status-banner admin-signed">
                    <span>✓✓ Proposal fully signed and finalized!</span>
                  </div>
                )}

                {/* Client Signature Display */}
                {selectedProposal.clientSignature && (
                  <div className="signature-display-section client">
                    <h4>Your Signature</h4>
                    <div className="signature-image">
                      <img src={selectedProposal.clientSignature} alt="Your Signature" />
                    </div>
                    <p>Signed on: {formatDate(selectedProposal.clientSignedAt)}</p>
                  </div>
                )}

                {/* Admin Signature Display */}
                {selectedProposal.adminSignature && (
                  <div className="signature-display-section admin">
                    <h4>Admin Counter-Signature</h4>
                    <div className="signature-image">
                      <img src={selectedProposal.adminSignature} alt="Admin Signature" />
                    </div>
                    <p>Signed on: {formatDate(selectedProposal.adminSignedAt)}</p>
                    {selectedProposal.adminNotes && <p className="admin-notes">Notes: {selectedProposal.adminNotes}</p>}
                  </div>
                )}

                {/* About Us */}
                {renderAboutSection()}

                {/* Scope & Deliverables */}
                <div className="doc-section"><h3>Scope of Work</h3><div className="doc-section-content"><p>{selectedProposal.scope || 'As per the requirements discussed.'}</p></div></div>
                {selectedProposal.deliverables && <div className="doc-section"><h3>Deliverables</h3><div className="doc-section-content"><p>{selectedProposal.deliverables}</p></div></div>}

                {/* Website Structure */}
                {selectedProposal.websiteStructure?.length > 0 && (
                  <div className="doc-section"><h3>Website Structure</h3><div className="website-structure-grid">{selectedProposal.websiteStructure.map((page, idx) => <span key={idx} className="structure-tag">{page}</span>)}</div></div>
                )}

                {/* Integrations */}
                {selectedProposal.integrations?.length > 0 && (
                  <div className="doc-section"><h3>Integrations</h3><div className="integrations-grid">{selectedProposal.integrations.map((i, idx) => <span key={idx} className="integration-tag">{i}</span>)}</div></div>
                )}

                {/* Additional Features */}
                {selectedProposal.additionalFeatures?.length > 0 && (
                  <div className="doc-section"><h3>Additional Features</h3><div className="features-grid">{selectedProposal.additionalFeatures.map((f, idx) => <span key={idx} className="feature-tag">{f}</span>)}</div></div>
                )}

                {/* Milestones */}
                {selectedProposal.milestones?.length > 0 && (
                  <div className="doc-section"><h3>Project Milestones</h3><div className="milestones-container">{selectedProposal.milestones.map((m, idx) => (
                    <div key={idx} className="milestone-row">
                      <div className="milestone-number">{idx + 1}</div>
                      <div className="milestone-details"><div className="milestone-name">{m.name}</div><div className="milestone-meta">{m.percentage}% · {m.duration}</div></div>
                      <div className="milestone-progress-bar"><div className="milestone-progress-fill" style={{ width: `${m.percentage}%` }}></div></div>
                    </div>
                  ))}</div></div>
                )}

                {/* Client Requirements */}
                {selectedProposal.clientRequirements && Object.keys(selectedProposal.clientRequirements).length > 0 && (
                  <div className="doc-section"><h3>Your Requirements</h3><div className="requirements-grid-doc">{Object.entries(selectedProposal.clientRequirements).map(([key, value]) => {
                    if (!value) return null;
                    const dv = Array.isArray(value) ? value.join(', ') : value;
                    return <div key={key} className="req-item-doc"><div className="req-label-doc">{formatFieldName(key)}</div><div className="req-value-doc">{dv}</div></div>;
                  })}</div></div>
                )}

                {/* Team Assigned */}
                {selectedProposal.teamAssigned && <div className="doc-section"><h3>Team Assigned</h3><div className="doc-section-content"><p>{selectedProposal.teamAssigned}</p></div></div>}

                {/* Payment & Cost */}
                <div className="doc-section"><h3>Payment Terms</h3><div className="payment-terms-doc">{selectedProposal.paymentTerms || '30% Advance, 30% Milestone, 40% Delivery'}</div></div>
                <div className="doc-section"><h3>Cost Summary</h3><div className="cost-table">
                  <div className="cost-row"><span>Project Budget</span><strong>Rs {formatCurrency(selectedProposal.budget)}</strong></div>
                  <div className="cost-row"><span>Payment Structure</span><strong>{selectedProposal.paymentTerms || '30% - 30% - 40%'}</strong></div>
                  <div className="cost-row total"><span>Total Investment</span><strong>Rs {formatCurrency(selectedProposal.budget)}</strong></div>
                </div></div>

                {/* Additional Notes */}
                {selectedProposal.notes && <div className="doc-section"><h3>Additional Notes</h3><div className="doc-section-content"><p>{selectedProposal.notes}</p></div></div>}

                {/* Terms & Conditions */}
                <div className="doc-section terms-section"><h3>Terms & Conditions</h3><div className="terms-content">
                  {selectedProposal.termsAndConditions ? selectedProposal.termsAndConditions.split('\n').map((line, idx) => {
                    if (line.trim().match(/^\d+\./)) {
                      const num = line.match(/^\d+/)[0];
                      const text = line.replace(/^\d+\./, '').trim();
                      return <div key={idx} className="term-item"><span className="term-number">{num}</span><span className="term-text">{text}</span></div>;
                    }
                    return line.trim() && <p key={idx} className="term-paragraph">{line}</p>;
                  }) : (
                    <>
                      <div className="term-item"><span className="term-number">1</span><span className="term-text">Payment Terms: All payments are to be made as per the schedule mentioned above.</span></div>
                      <div className="term-item"><span className="term-number">2</span><span className="term-text">Warranty: We guarantee all services will be completed within the agreed timeframe.</span></div>
                      <div className="term-item"><span className="term-number">3</span><span className="term-text">Confidentiality: All proprietary information will be handled with confidentiality.</span></div>
                      <div className="term-item"><span className="term-number">4</span><span className="term-text">Approval: Client can request changes within 7 days of completion.</span></div>
                    </>
                  )}
                </div></div>

                {/* Thank You */}
                {selectedProposal.thankYouMessage && (
                  <div className="doc-section thank-you-section"><div className="thank-you-content"><p>Dear <strong>{selectedProposal.clientName}</strong>,</p><p>{selectedProposal.thankYouMessage}</p></div></div>
                )}

                {/* Footer */}
                <div className="doc-footer"><div className="footer-content">
                  <p>Anax Inventions — Transforming Ideas into Digital Reality</p>
                  <p>Email: anaxinventions@gmail.com | Phone: +92 311 6735509</p>
                  <p className="footer-note">This proposal is valid for 30 days from the date of issue.</p>
                </div></div>
              </div>

              <div className="document-footer-actions no-print">
                {selectedProposal.status === 'sent' && (
                  <>
                    <button className="doc-action-btn accept" onClick={() => handleClientSign(selectedProposal._id)}>Accept & Sign Proposal</button>
                    <button className="doc-action-btn decline" onClick={() => handleDecline(selectedProposal._id)}>Decline Proposal</button>
                  </>
                )}
                {selectedProposal.status === 'client_signed' && (
                  <div className="doc-action-btn-pending">✓ Signed — Awaiting Admin Counter-Signature</div>
                )}
                {selectedProposal.status === 'admin_signed' && (
                  <div className="doc-action-btn-finalized">✓✓ Fully Signed & Finalized</div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIGNATURE MODAL */}
      <AnimatePresence>
        {showSignatureModal && (
          <motion.div className="pt-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="pt-modal signature-modal" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
              <div className="signature-header"><h3>Digital Signature</h3><button className="modal-close" onClick={() => setShowSignatureModal(false)}>✕</button></div>
              <div className="signature-body">
                <p className="signature-intro">Please sign below to accept this proposal. Your signature is legally binding.</p>
                <div className="signature-type-selector">
                  <button className={signatureType === 'draw' ? 'active' : ''} onClick={() => setSignatureType('draw')}>Draw</button>
                  <button className={signatureType === 'type' ? 'active' : ''} onClick={() => setSignatureType('type')}>Type</button>
                </div>
                {signatureType === 'draw' && (
                  <div className="signature-canvas-container">
                    <canvas ref={ref => setCanvasRef(ref)} width={450} height={120} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} style={{ border: '1px solid #e2e8f0', cursor: 'crosshair', background: 'white' }} />
                    <button className="clear-signature-btn" onClick={clearSignature}>Clear</button>
                  </div>
                )}
                {signatureType === 'type' && (
                  <div className="signature-type-container">
                    <input type="text" value={typedSignature} onChange={(e) => setTypedSignature(e.target.value)} placeholder="Type your full name" className="signature-type-input" />
                    {typedSignature && <div className="signature-preview"><p style={{ fontFamily: '"Brush Script MT", cursive', fontSize: '24px' }}>{typedSignature}</p></div>}
                  </div>
                )}
                <div className="signature-terms"><p>By signing, you agree to the terms and conditions outlined in this proposal.</p></div>
              </div>
              <div className="signature-footer">
                <button className="cancel-btn" onClick={() => setShowSignatureModal(false)}>Cancel</button>
                <button className="sign-btn" onClick={submitClientSignature}>Confirm Signature</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProposalsTab;