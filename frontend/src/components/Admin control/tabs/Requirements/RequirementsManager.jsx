import { useState, useEffect, useCallback, useRef, memo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Search, RefreshCw, Bell, ChevronRight, Calendar, 
  DollarSign, Clock, User, Mail, Phone, Building, CheckCircle, 
  XCircle, AlertCircle, MessageSquare, Send, ArrowLeft, Eye,
  Download, Trash2, Edit3, Filter, BarChart3, Layers, Settings,
  Globe, Smartphone, ShoppingCart, TrendingUp, PenTool, Code,
  Database, Shield, Zap, Package, Info, ChevronDown, MoreHorizontal,
  ExternalLink, Paperclip, StickyNote, Activity, Plus, Minus,
  Play, RotateCcw, Ban
} from 'lucide-react';
import './RequirementsManager.css';

const API_URL = 'http://localhost:5001/api';

const serviceImages = {
  'web development': 'https://cdn-icons-png.flaticon.com/512/2920/2920277.png',
  'website': 'https://cdn-icons-png.flaticon.com/512/2920/2920277.png',
  'web': 'https://cdn-icons-png.flaticon.com/512/2920/2920277.png',
  'mobile app': 'https://cdn-icons-png.flaticon.com/512/2920/2920349.png',
  'mobile': 'https://cdn-icons-png.flaticon.com/512/2920/2920349.png',
  'app': 'https://cdn-icons-png.flaticon.com/512/2920/2920349.png',
  'ecommerce': 'https://cdn-icons-png.flaticon.com/512/2920/2920270.png',
  'shop': 'https://cdn-icons-png.flaticon.com/512/2920/2920270.png',
  'store': 'https://cdn-icons-png.flaticon.com/512/2920/2920270.png',
  'digital marketing': 'https://cdn-icons-png.flaticon.com/512/2920/2920265.png',
  'marketing': 'https://cdn-icons-png.flaticon.com/512/2920/2920265.png',
  'seo': 'https://cdn-icons-png.flaticon.com/512/2920/2920265.png',
  'ui ux': 'https://cdn-icons-png.flaticon.com/512/2920/2920286.png',
  'design': 'https://cdn-icons-png.flaticon.com/512/2920/2920286.png',
  'ui': 'https://cdn-icons-png.flaticon.com/512/2920/2920286.png',
  'custom software': 'https://cdn-icons-png.flaticon.com/512/2920/2920293.png',
  'software': 'https://cdn-icons-png.flaticon.com/512/2920/2920293.png',
  'default': 'https://cdn-icons-png.flaticon.com/512/2920/2920277.png'
};

const getServiceImage = (serviceTitle) => {
  if (!serviceTitle) return serviceImages.default;
  const lower = serviceTitle.toLowerCase();
  for (const [key, url] of Object.entries(serviceImages)) {
    if (lower.includes(key)) return url;
  }
  return serviceImages.default;
};

// Status color map - NO BLUE
const statusColorMap = {
  'submitted': '#cc7722',
  'reviewing': '#d97706',
  'proposal_ready': '#cc7722',
  'proposal_sent': '#059669',
  'approved': '#16a34a',
  'rejected': '#dc2626',
  'request_info': '#d97706'
};

// BULLETPROOF: Component wrapped in memo to prevent parent re-renders
const RequirementsManager = memo(({ onUpdate, onOpenProposalsTab }) => {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [timeline, setTimeline] = useState([]);
  const [adminNotes, setAdminNotes] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRequestInfoModal, setShowRequestInfoModal] = useState(false);
  const [requestInfoMessage, setRequestInfoMessage] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedRequirements, setSelectedRequirements] = useState([]);
  const [bulkActionMode, setBulkActionMode] = useState(false);
  const [showActivityPanel, setShowActivityPanel] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [proposalDraft, setProposalDraft] = useState(null);

  // BULLETPROOF: These refs prevent ANY re-fetching after initial load
  const initialLoadDone = useRef(false);
  const fetchInProgress = useRef(false);
  const dataLoaded = useRef(false);

  // BULLETPROOF: Only fetch on TRUE initial mount, never again
  useEffect(() => {
    // If already loaded once in this session, NEVER fetch again
    if (initialLoadDone.current || dataLoaded.current) {
      console.log('[Anax] Skipping fetch - already loaded');
      return;
    }

    // If fetch already in progress, don't start another
    if (fetchInProgress.current) {
      console.log('[Anax] Skipping fetch - already in progress');
      return;
    }

    fetchInProgress.current = true;

    const doFetch = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/admin/requirements`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const newData = res.data.requirements || [];
        setRequirements(newData);
        dataLoaded.current = true;
        console.log('[Anax] Requirements loaded:', newData.length, 'items');
      } catch (err) {
        console.error('[Anax] Fetch error:', err);
        Swal.fire('Error', 'Failed to load requirements', 'error');
      } finally {
        setLoading(false);
        fetchInProgress.current = false;
        initialLoadDone.current = true;
      }
    };

    doFetch();

    // NO cleanup needed - we want this to run once and only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update timeline when selectedReq changes
  useEffect(() => {
    if (selectedReq) {
      generateTimeline(selectedReq);
    }
  }, [selectedReq]);

  // Generate timeline - stable function
  const generateTimeline = useCallback((req) => {
    const timelineItems = [
      {
        status: 'submitted',
        title: 'Requirement Submitted',
        description: `Client ${req.clientName} submitted requirements for ${req.projectName || req.selectedService?.title}`,
        timestamp: req.submittedAt,
        icon: FileText,
        color: '#cc7722',
        completed: true
      }
    ];

    if (req.status !== 'submitted') {
      timelineItems.push({
        status: 'reviewing',
        title: 'Under Review',
        description: req.adminNote || 'Admin started reviewing the requirement',
        timestamp: req.reviewedAt || req.updatedAt,
        icon: Search,
        color: '#d97706',
        completed: ['reviewing', 'proposal_ready', 'proposal_sent', 'approved', 'rejected'].includes(req.status)
      });
    }

    if (req.status === 'proposal_ready' || req.status === 'proposal_sent' || req.status === 'approved') {
      timelineItems.push({
        status: 'proposal_ready',
        title: 'Proposal Prepared',
        description: `Proposal drafted for ${req.clientName} - ready to send`,
        timestamp: req.proposalReadyAt || req.updatedAt,
        icon: Edit3,
        color: '#cc7722',
        completed: ['proposal_sent', 'approved'].includes(req.status)
      });
    }

    if (req.status === 'proposal_sent' || req.status === 'approved') {
      timelineItems.push({
        status: 'proposal_sent',
        title: 'Proposal Sent',
        description: `Professional proposal sent to ${req.clientName}`,
        timestamp: req.proposalSentAt || req.updatedAt,
        icon: Send,
        color: '#059669',
        completed: true
      });
    }

    if (req.status === 'approved') {
      timelineItems.push({
        status: 'approved',
        title: 'Project Approved',
        description: 'Client accepted the proposal. Project is now active.',
        timestamp: req.approvedAt || req.updatedAt,
        icon: CheckCircle,
        color: '#16a34a',
        completed: true
      });
    }

    if (req.status === 'rejected') {
      timelineItems.push({
        status: 'rejected',
        title: 'Requirement Rejected',
        description: req.rejectionReason || 'Requirement was rejected',
        timestamp: req.rejectedAt || req.updatedAt,
        icon: XCircle,
        color: '#dc2626',
        completed: true
      });
    }

    if (req.status === 'request_info' && req.requestedInfo) {
      timelineItems.push({
        status: 'request_info',
        title: 'Information Requested',
        description: req.requestedInfo,
        timestamp: req.requestedAt || req.updatedAt,
        icon: MessageSquare,
        color: '#d97706',
        completed: true
      });
    }

    setTimeline(timelineItems);
  }, []);

  // BULLETPROOF: Manual refresh only - resets the guards
  const fetchRequirements = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (fetchInProgress.current) {
      console.log('[Anax] Refresh skipped - fetch in progress');
      return;
    }

    fetchInProgress.current = true;
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/requirements`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const newData = res.data.requirements || [];
      setRequirements(newData);
      console.log('[Anax] Manual refresh complete:', newData.length, 'items');
    } catch (err) {
      console.error('[Anax] Refresh error:', err);
      Swal.fire('Error', 'Failed to refresh requirements', 'error');
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  }, []);

  // Update status
  const updateStatus = useCallback(async (reqId, status, adminNote = '', extraData = {}) => {
    try {
      const token = localStorage.getItem('token');
      const payload = { status, adminNote, ...extraData };

      await axios.put(`${API_URL}/admin/requirements/${reqId}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const statusConfig = {
        reviewing: { icon: Search, title: 'Review Started', color: '#d97706' },
        proposal_ready: { icon: Edit3, title: 'Proposal Ready', color: '#cc7722' },
        proposal_sent: { icon: Send, title: 'Proposal Sent', color: '#059669' },
        approved: { icon: CheckCircle, title: 'Project Approved', color: '#16a34a' },
        rejected: { icon: XCircle, title: 'Requirement Rejected', color: '#dc2626' },
        request_info: { icon: MessageSquare, title: 'Info Requested', color: '#d97706' },
        submitted: { icon: FileText, title: 'Reset to New', color: '#cc7722' }
      };

      const config = statusConfig[status] || statusConfig.reviewing;

      Swal.fire({
        title: config.title,
        html: `<div style="text-align: center;">
          <p style="font-size: 14px; color: #666;">Status updated to <strong style="color: ${config.color};">${status.toUpperCase().replace(/_/g, ' ')}</strong></p>
          <p style="font-size: 12px; color: #888; margin-top: 8px;">Client has been notified via email</p>
        </div>`,
        icon: 'success',
        timer: 2500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });

      // Update local state without full re-fetch
      setRequirements(prev => prev.map(req => 
        req._id === reqId ? { ...req, status, adminNote, ...extraData } : req
      ));

      if (selectedReq?._id === reqId) {
        const updatedReq = { ...selectedReq, status, adminNote, ...extraData };
        setSelectedReq(updatedReq);
        generateTimeline(updatedReq);
      }

      addNotification(`Requirement #${reqId.slice(-6)} status updated to ${status}`, config.color);
    } catch (err) {
      console.error('[Anax] Update status error:', err);
      Swal.fire('Error', 'Failed to update status', 'error');
    }
  }, [selectedReq, generateTimeline]);

  // PREPARE PROPOSAL
  const prepareProposal = useCallback(async (req) => {
    const proposalData = {
      requirementId: req._id,
      clientId: req.clientId,
      clientName: req.clientName,
      clientEmail: req.clientEmail,
      clientPhone: req.clientInfo?.phone || '',
      clientCompany: req.clientInfo?.company || '',
      projectName: req.commonData?.projectName || req.projectName || 'Untitled Project',
      budget: req.commonData?.budget || '0',
      timeline: req.commonData?.timeline || 'Not specified',
      projectGoal: req.commonData?.projectGoal || '',
      requirements: req.dynamicFields || {},
      serviceTitle: req.selectedService?.title || 'Unknown Service',
      submittedAt: req.submittedAt,
      adminNote: req.adminNote || '',
      referenceLink: req.commonData?.referenceLink || '',
      additionalInfo: req.commonData?.additionalInfo || '',
      currency: req.commonData?.currency || 'Rs'
    };

    setProposalDraft(proposalData);

    await updateStatus(req._id, 'proposal_ready', `Proposal prepared for ${req.clientName}`, {
      proposalReadyAt: new Date()
    });

    Swal.fire({
      title: 'Proposal Ready',
      html: `<div style="text-align: center;">
        <p style="font-size: 16px; font-weight: 600;">Proposal prepared for <strong>${req.clientName}</strong></p>
        <p style="font-size: 13px; color: #666; margin-top: 8px;">Project: ${proposalData.projectName}</p>
        <p style="font-size: 12px; color: #d97706; margin-top: 12px;">Redirecting to Proposals tab to finalize...</p>
      </div>`,
      icon: 'info',
      confirmButtonColor: '#cc7722',
      timer: 2000
    });

    if (onOpenProposalsTab) {
      onOpenProposalsTab(proposalData);
    }
  }, [updateStatus, onOpenProposalsTab]);

  // SEND PROPOSAL
  const sendProposal = useCallback(async (req) => {
    try {
      await updateStatus(req._id, 'proposal_sent', `Proposal sent to ${req.clientName}`, {
        proposalSentAt: new Date()
      });

      Swal.fire({
        title: 'Proposal Sent!',
        html: `<div style="text-align: center;">
          <p style="font-size: 16px; font-weight: 600;">Proposal sent to <strong>${req.clientName}</strong></p>
          <p style="font-size: 13px; color: #666; margin-top: 8px;">Email notification sent</p>
        </div>`,
        icon: 'success',
        timer: 2500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } catch (err) {
      console.error('[Anax] Send proposal error:', err);
      Swal.fire('Error', 'Failed to send proposal', 'error');
    }
  }, [updateStatus]);

  const requestMoreInfo = useCallback(async () => {
    if (!requestInfoMessage.trim()) {
      Swal.fire('Error', 'Please enter your message', 'error');
      return;
    }

    await updateStatus(selectedReq._id, 'request_info', requestInfoMessage, {
      requestedInfo: requestInfoMessage,
      requestedAt: new Date()
    });

    setShowRequestInfoModal(false);
    setRequestInfoMessage('');
    addNotification(`Info requested for ${selectedReq.clientName}`, '#d97706');
  }, [selectedReq, requestInfoMessage, updateStatus]);

  const handleReject = useCallback(async () => {
    if (!rejectReason.trim()) {
      Swal.fire('Error', 'Please provide a rejection reason', 'error');
      return;
    }

    await updateStatus(selectedReq._id, 'rejected', rejectReason, {
      rejectionReason: rejectReason,
      rejectedAt: new Date()
    });

    setShowRejectModal(false);
    setRejectReason('');
  }, [selectedReq, rejectReason, updateStatus]);

  const addAdminNote = useCallback(async () => {
    if (!adminNotes.trim()) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/admin/requirements/${selectedReq._id}/notes`, {
        note: adminNotes,
        timestamp: new Date()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAdminNotes('');
      setShowNoteInput(false);

      Swal.fire({
        title: 'Note Added',
        text: 'Internal note has been saved',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } catch (err) {
      console.error('[Anax] Add note error:', err);
      Swal.fire('Error', 'Failed to add note', 'error');
    }
  }, [selectedReq, adminNotes]);

  const addNotification = useCallback((message, color = '#cc7722') => {
    const newNotification = {
      id: Date.now(),
      message,
      color,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 50));
  }, []);

  const toggleRequirementSelection = useCallback((reqId) => {
    setSelectedRequirements(prev => 
      prev.includes(reqId) 
        ? prev.filter(id => id !== reqId)
        : [...prev, reqId]
    );
  }, []);

  const bulkUpdateStatus = useCallback(async (status) => {
    if (selectedRequirements.length === 0) return;

    const result = await Swal.fire({
      title: 'Bulk Action',
      text: `Update ${selectedRequirements.length} requirements to ${status}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#cc7722'
    });

    if (result.isConfirmed) {
      for (const reqId of selectedRequirements) {
        await updateStatus(reqId, status);
      }
      setSelectedRequirements([]);
      setBulkActionMode(false);
    }
  }, [selectedRequirements, updateStatus]);

  // Status badge - NO BLUE COLORS
  const getStatusBadge = useCallback((status) => {
    const statusMap = {
      'submitted': { bg: '#FFF7ED', color: '#cc7722', label: 'New', border: '#fed7aa', icon: FileText },
      'reviewing': { bg: '#FFF7ED', color: '#d97706', label: 'Reviewing', border: '#fed7aa', icon: Search },
      'proposal_ready': { bg: '#FEF3C7', color: '#cc7722', label: 'Proposal Ready', border: '#fde68a', icon: Edit3 },
      'proposal_sent': { bg: '#ECFDF5', color: '#059669', label: 'Proposal Sent', border: '#a7f3d0', icon: Send },
      'approved': { bg: '#DCFCE7', color: '#16A34A', label: 'Approved', border: '#bbf7d0', icon: CheckCircle },
      'rejected': { bg: '#FEE2E2', color: '#DC2626', label: 'Rejected', border: '#fecaca', icon: XCircle },
      'request_info': { bg: '#FEF3C7', color: '#d97706', label: 'Info Requested', border: '#fde68a', icon: MessageSquare }
    };
    const style = statusMap[status] || statusMap['submitted'];
    const IconComp = style.icon;
    return (
      <span className="status-badge-modern" style={{ 
        background: style.bg, 
        color: style.color,
        border: `1px solid ${style.border}`
      }}>
        <IconComp size={12} />
        {style.label}
      </span>
    );
  }, []);

  // Priority badge - NO BLUE
  const getPriorityBadge = useCallback((budget) => {
    const num = parseInt(budget) || 0;
    if (num >= 500000) return { label: 'High', color: '#dc2626', bg: '#fee2e2' };
    if (num >= 100000) return { label: 'Medium', color: '#d97706', bg: '#fef3c7' };
    return { label: 'Standard', color: '#059669', bg: '#ecfdf5' };
  }, []);

  const formatFieldName = useCallback((key) => {
    const fieldMap = {
      'businessPurpose': 'Business Purpose',
      'targetAudience': 'Target Audience',
      'uniqueSellingPoints': 'Unique Selling Points',
      'scopeOfWork': 'Scope of Work',
      'frontendTech': 'Frontend Technology',
      'backendTech': 'Backend Technology',
      'database': 'Database Preference',
      'cms': 'Content Management System',
      'thirdPartyIntegrations': 'Third Party Integrations',
      'pages': 'Number of Pages',
      'features': 'Key Features',
      'responsive': 'Responsive Design',
      'performanceSecurity': 'Performance & Security',
      'seoRequirements': 'SEO Requirements',
      'brandGuidelines': 'Brand Guidelines',
      'designInspiration': 'Design Inspiration',
      'appPurpose': 'App Purpose',
      'platform': 'Target Platform',
      'appCategory': 'App Category',
      'userAuthentication': 'User Authentication',
      'backendRequirements': 'Backend Requirements',
      'offlineSupport': 'Offline Support',
      'adminPanel': 'Admin Panel',
      'designPreferences': 'Design Preferences',
      'storeSubmission': 'Store Submission',
      'businessType': 'Business Type',
      'productCount': 'Product Count',
      'productTypes': 'Product Types',
      'paymentGateways': 'Payment Gateways',
      'shippingRequirements': 'Shipping Requirements',
      'taxConfiguration': 'Tax Configuration',
      'inventoryManagement': 'Inventory Management',
      'socialCommerce': 'Social Commerce',
      'returnsPolicy': 'Returns Policy',
      'primaryGoal': 'Primary Goal',
      'platforms': 'Target Platforms',
      'monthlyBudget': 'Monthly Budget',
      'campaignDuration': 'Campaign Duration',
      'existingChannels': 'Existing Channels',
      'competitors': 'Competitors',
      'seoKeywords': 'SEO Keywords',
      'contentRequirements': 'Content Requirements',
      'analytics': 'Analytics & Reporting',
      'websiteUrl': 'Website URL',
      'existingAssets': 'Existing Assets',
      'designType': 'Design Type',
      'projectScope': 'Project Scope',
      'numberOfScreens': 'Number of Screens',
      'designTool': 'Design Tool',
      'colorPreferences': 'Color Preferences',
      'typography': 'Typography',
      'interactivity': 'Interactivity',
      'responsiveRequirements': 'Responsive Requirements',
      'deliverables': 'Deliverables',
      'targetUsers': 'Target Users',
      'accessibility': 'Accessibility',
      'softwareType': 'Software Type',
      'userRoles': 'User Roles',
      'coreFeatures': 'Core Features',
      'integrations': 'Integrations',
      'technologyPreference': 'Technology Preference',
      'databasePreference': 'Database Preference',
      'deployment': 'Deployment',
      'dataImport': 'Data Import',
      'reporting': 'Reporting',
      'security': 'Security',
      'specificRequirements': 'Specific Requirements',
      'preferredTechnology': 'Preferred Technology',
      'specialFeatures': 'Special Features',
      'timeline': 'Expected Timeline',
      'budget': 'Budget Range'
    };
    return fieldMap[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }, []);

  const renderValue = useCallback((value) => {
    if (!value) return <span className="empty-value">Not specified</span>;
    if (Array.isArray(value)) {
      return (
        <div className="feature-tags-modern">
          {value.map((item, idx) => (
            <span key={idx} className="feature-tag-modern">{item}</span>
          ))}
        </div>
      );
    }
    if (typeof value === 'object') {
      return <pre className="json-value-modern">{JSON.stringify(value, null, 2)}</pre>;
    }
    if (typeof value === 'string' && value.length > 300) {
      return <div className="long-text-modern">{value.substring(0, 300)}...</div>;
    }
    return <span className="value-text-modern">{value}</span>;
  }, []);

  // Memoized filtered and sorted requirements
  const filteredRequirements = requirements.filter(req => {
    const matchesStatus = statusFilter === 'all' ? true : req.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      req.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.selectedService?.title?.toLowerCase().includes(searchTerm.toLowerCase());

    const priority = getPriorityBadge(req.commonData?.budget);
    const matchesPriority = priorityFilter === 'all' ? true : priority.label.toLowerCase() === priorityFilter;

    return matchesStatus && matchesSearch && matchesPriority;
  });

  const sortedRequirements = [...filteredRequirements].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.submittedAt) - new Date(a.submittedAt);
    if (sortBy === 'oldest') return new Date(a.submittedAt) - new Date(b.submittedAt);
    if (sortBy === 'budget-high') return (parseInt(b.commonData?.budget) || 0) - (parseInt(a.commonData?.budget) || 0);
    if (sortBy === 'budget-low') return (parseInt(a.commonData?.budget) || 0) - (parseInt(b.commonData?.budget) || 0);
    return 0;
  });

  const stats = {
    total: requirements.length,
    submitted: requirements.filter(r => r.status === 'submitted').length,
    reviewing: requirements.filter(r => r.status === 'reviewing').length,
    proposal_ready: requirements.filter(r => r.status === 'proposal_ready').length,
    proposal_sent: requirements.filter(r => r.status === 'proposal_sent').length,
    approved: requirements.filter(r => r.status === 'approved').length,
    rejected: requirements.filter(r => r.status === 'rejected').length,
    request_info: requirements.filter(r => r.status === 'request_info').length
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Render proposal preview for proposal_ready status
  const renderProposalPreview = useCallback(() => {
    if (!selectedReq || selectedReq.status !== 'proposal_ready') return null;

    return (
      <div className="proposal-preview-box">
        <h4><Edit3 size={14} /> Proposal Draft Ready</h4>
        <p>This proposal is prepared but <strong>not yet sent</strong>. Review in Proposals tab before sending to client.</p>
        <div className="proposal-preview-actions">
          <button className="action-btn-modern success" onClick={() => {
            if (onOpenProposalsTab && proposalDraft) {
              onOpenProposalsTab(proposalDraft);
            }
          }}>
            <Send size={14} /> Open in Proposals Tab
          </button>
          <button className="action-btn-modern warning" onClick={() => updateStatus(selectedReq._id, 'reviewing', 'Back to review from proposal ready')}>
            <RotateCcw size={14} /> Back to Review
          </button>
        </div>
      </div>
    );
  }, [selectedReq, proposalDraft, updateStatus, onOpenProposalsTab]);

  // Anax Inventions Loading Spinner Component
  const AnaxLoadingSpinner = () => (
    <div className="anax-loading-container">
      <div className="anax-spinner">
        <div className="anax-spinner-ring"></div>
        <div className="anax-spinner-ring"></div>
        <div className="anax-spinner-ring"></div>
        <div className="anax-spinner-center">AI</div>
      </div>
      <div className="anax-loading-text">Anax Inventions</div>
      <div className="anax-loading-subtext">Loading requirements...</div>
    </div>
  );

  return (
    <div className="requirements-manager-modern">
      {/* Top Navigation Bar */}
      <div className="rm-top-bar">
        <div className="rm-brand">
          <div className="rm-brand-icon">
            <Layers size={24} />
          </div>
          <div>
            <h1>Requirements Hub</h1>
            <p>Manage & Process Client Requirements</p>
          </div>
        </div>
        <div className="rm-top-actions">
          <button 
            className="notification-btn" 
            onClick={() => setShowNotificationPanel(!showNotificationPanel)}
          >
            <Bell size={18} />
            {unreadNotifications > 0 && <span className="notification-badge">{unreadNotifications}</span>}
          </button>
          <button className="refresh-btn-modern" onClick={fetchRequirements}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Notification Panel */}
      <AnimatePresence>
        {showNotificationPanel && (
          <motion.div 
            className="notification-panel"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="notification-header">
              <h4><Bell size={14} /> Notifications</h4>
              <button onClick={() => setShowNotificationPanel(false)}><XCircle size={16} /></button>
            </div>
            <div className="notification-list">
              {notifications.length === 0 ? (
                <p className="no-notifications">No notifications yet</p>
              ) : (
                notifications.map(notif => (
                  <div key={notif.id} className={`notification-item ${notif.read ? 'read' : 'unread'}`}>
                    <div className="notification-dot" style={{ background: notif.color }}></div>
                    <div className="notification-content">
                      <p>{notif.message}</p>
                      <small>{new Date(notif.timestamp).toLocaleTimeString()}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Dashboard */}
      <div className="rm-stats-modern">
        <motion.div className="stat-card-modern total" whileHover={{ y: -2 }}>
          <div className="stat-icon"><BarChart3 size={20} /></div>
          <div className="stat-info">
            <div className="stat-value-modern">{stats.total}</div>
            <div className="stat-label-modern">Total</div>
          </div>
        </motion.div>
        <motion.div className="stat-card-modern new" whileHover={{ y: -2 }}>
          <div className="stat-icon"><FileText size={20} /></div>
          <div className="stat-info">
            <div className="stat-value-modern">{stats.submitted}</div>
            <div className="stat-label-modern">New</div>
          </div>
          {stats.submitted > 0 && <div className="stat-pulse"></div>}
        </motion.div>
        <motion.div className="stat-card-modern reviewing" whileHover={{ y: -2 }}>
          <div className="stat-icon"><Search size={20} /></div>
          <div className="stat-info">
            <div className="stat-value-modern">{stats.reviewing}</div>
            <div className="stat-label-modern">Reviewing</div>
          </div>
        </motion.div>
        <motion.div className="stat-card-modern proposal-ready" whileHover={{ y: -2 }}>
          <div className="stat-icon"><Edit3 size={20} /></div>
          <div className="stat-info">
            <div className="stat-value-modern">{stats.proposal_ready}</div>
            <div className="stat-label-modern">Ready</div>
          </div>
        </motion.div>
        <motion.div className="stat-card-modern proposal" whileHover={{ y: -2 }}>
          <div className="stat-icon"><Send size={20} /></div>
          <div className="stat-info">
            <div className="stat-value-modern">{stats.proposal_sent}</div>
            <div className="stat-label-modern">Sent</div>
          </div>
        </motion.div>
        <motion.div className="stat-card-modern approved" whileHover={{ y: -2 }}>
          <div className="stat-icon"><CheckCircle size={20} /></div>
          <div className="stat-info">
            <div className="stat-value-modern">{stats.approved}</div>
            <div className="stat-label-modern">Approved</div>
          </div>
        </motion.div>
        <motion.div className="stat-card-modern rejected" whileHover={{ y: -2 }}>
          <div className="stat-icon"><XCircle size={20} /></div>
          <div className="stat-info">
            <div className="stat-value-modern">{stats.rejected}</div>
            <div className="stat-label-modern">Rejected</div>
          </div>
        </motion.div>
      </div>

      {/* Filters & Search Bar */}
      <div className="rm-controls-modern">
        <div className="filter-section">
          <div className="filter-tabs-modern">
            {[
              { key: 'all', label: 'All', count: stats.total },
              { key: 'submitted', label: 'New', count: stats.submitted },
              { key: 'reviewing', label: 'Reviewing', count: stats.reviewing },
              { key: 'proposal_ready', label: 'Ready', count: stats.proposal_ready },
              { key: 'proposal_sent', label: 'Sent', count: stats.proposal_sent },
              { key: 'approved', label: 'Approved', count: stats.approved },
              { key: 'rejected', label: 'Rejected', count: stats.rejected },
              { key: 'request_info', label: 'Info Requested', count: stats.request_info }
            ].map(filter => (
              <button 
                key={filter.key} 
                className={`filter-tab-modern ${statusFilter === filter.key ? 'active' : ''}`}
                onClick={() => setStatusFilter(filter.key)}
              >
                {filter.label}
                <span className="filter-count">{filter.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="search-sort-section">
          <div className="rm-search-modern">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search clients, projects, services..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="budget-high">Budget: High to Low</option>
            <option value="budget-low">Budget: Low to High</option>
          </select>
          <select className="priority-select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="standard">Standard</option>
          </select>
          <button 
            className={`bulk-mode-btn ${bulkActionMode ? 'active' : ''}`}
            onClick={() => { setBulkActionMode(!bulkActionMode); setSelectedRequirements([]); }}
          >
            {bulkActionMode ? 'Cancel' : 'Bulk Select'}
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {bulkActionMode && selectedRequirements.length > 0 && (
          <motion.div 
            className="bulk-actions-bar"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <span>{selectedRequirements.length} selected</span>
            <div className="bulk-buttons">
              <button onClick={() => bulkUpdateStatus('reviewing')}><Search size={14} /> Reviewing</button>
              <button onClick={() => bulkUpdateStatus('approved')}><CheckCircle size={14} /> Approved</button>
              <button onClick={() => bulkUpdateStatus('rejected')}><XCircle size={14} /> Rejected</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Layout */}
      <div className="rm-layout-modern">
        {/* Requirements List */}
        <div className="rm-list-modern">
          {loading ? (
            <AnaxLoadingSpinner />
          ) : sortedRequirements.length === 0 ? (
            <div className="rm-empty-modern">
              <div className="empty-icon-large"><FileText size={48} /></div>
              <h4>No requirements found</h4>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            sortedRequirements.map(req => {
              const priority = getPriorityBadge(req.commonData?.budget);
              const serviceImg = getServiceImage(req.selectedService?.title);
              const statusColor = statusColorMap[req.status] || '#cc7722';
              return (
                <motion.div 
                  key={req._id} 
                  className={`rm-item-modern ${selectedReq?._id === req._id ? 'active' : ''}`}
                  onClick={() => !bulkActionMode && setSelectedReq(req)}
                  whileHover={{ x: 2 }}
                  layout
                >
                  {/* Status Strip */}
                  <div className={`rm-item-strip ${req.status}`} style={{ background: statusColor }}></div>

                  {bulkActionMode && (
                    <div className="bulk-checkbox">
                      <input 
                        type="checkbox" 
                        checked={selectedRequirements.includes(req._id)}
                        onChange={() => toggleRequirementSelection(req._id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}
                  <div className="rm-item-header-modern">
                    <div className="rm-client-info-modern">
                      <div className="rm-client-avatar-modern" style={{ background: statusColor }}>
                        {req.clientName?.charAt(0) || 'C'}
                      </div>
                      <div className="rm-client-details">
                        <h4>{req.clientName || 'Unknown Client'}</h4>
                        <p>{req.clientEmail || 'No email'}</p>
                      </div>
                    </div>
                    <div className="rm-item-badges">
                      {getStatusBadge(req.status)}
                      <span className="priority-badge" style={{ background: priority.bg, color: priority.color }}>
                        {priority.label}
                      </span>
                    </div>
                  </div>
                  <div className="rm-item-body-modern">
                    <div className="rm-item-project-modern">
                      <img src={serviceImg} alt="" className="service-icon-small" />
                      {req.projectName || req.selectedService?.title || 'Untitled'}
                    </div>
                    <div className="rm-item-meta-modern">
                      <span className="meta-item">
                        <DollarSign size={12} />
                        {req.commonData?.currency || 'Rs'} {req.commonData?.budget || '0'}
                      </span>
                      <span className="meta-item">
                        <Clock size={12} />
                        {req.commonData?.timeline || 'Not set'}
                      </span>
                      <span className="meta-item">
                        <Calendar size={12} />
                        {new Date(req.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="rm-item-footer-modern">
                    <span className="service-tag">{req.selectedService?.title || 'Unknown Service'}</span>
                    <span className="fields-count">{Object.keys(req.dynamicFields || {}).length} fields</span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Detail Panel */}
        <div className="rm-detail-modern">
          <AnimatePresence mode="wait">
            {selectedReq ? (
              <motion.div 
                key={selectedReq._id}
                className="rm-detail-card-modern"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {/* Detail Header */}
                <div className="rm-detail-header-modern">
                  <div className="detail-header-left">
                    <div className="client-avatar-large" style={{ background: statusColorMap[selectedReq.status] || '#cc7722' }}>
                      {selectedReq.clientName?.charAt(0) || 'C'}
                    </div>
                    <div className="detail-header-info">
                      <h3>{selectedReq.projectName || selectedReq.selectedService?.title || 'Untitled Project'}</h3>
                      <p className="client-detail-name">
                        <strong>{selectedReq.clientName}</strong> &bull; {selectedReq.clientEmail}
                      </p>
                      <p className="submitted-time">
                        <Clock size={12} /> Submitted: {new Date(selectedReq.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="detail-header-right">
                    {getStatusBadge(selectedReq.status)}
                    <button 
                      className="activity-toggle-btn"
                      onClick={() => setShowActivityPanel(!showActivityPanel)}
                    >
                      <Activity size={14} /> Timeline
                    </button>
                  </div>
                </div>

                {/* Activity Timeline Panel */}
                <AnimatePresence>
                  {showActivityPanel && (
                    <motion.div 
                      className="activity-panel"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <h4><Activity size={14} /> Activity Timeline</h4>
                      <div className="timeline-modern">
                        {timeline.map((item, idx) => {
                          const IconComp = item.icon;
                          return (
                            <div key={idx} className={`timeline-item ${item.completed ? 'completed' : ''}`}>
                              <div className="timeline-icon" style={{ background: item.color, borderColor: item.color }}>
                                <IconComp size={14} color="white" />
                              </div>
                              <div className="timeline-content">
                                <h5>{item.title}</h5>
                                <p>{item.description}</p>
                                <small>{new Date(item.timestamp).toLocaleString()}</small>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Service Image Banner */}
                <div className="service-image-banner">
                  <img 
                    src={getServiceImage(selectedReq.selectedService?.title)} 
                    alt={selectedReq.selectedService?.title || 'Service'} 
                    className="service-banner-img"
                  />
                  <div className="service-banner-overlay">
                    <h4>{selectedReq.selectedService?.title || 'Unknown Service'}</h4>
                    <p>{selectedReq.selectedService?.subtitle || 'Professional Service'}</p>
                  </div>
                </div>

                {/* Proposal Preview Box for proposal_ready status */}
                {selectedReq.status === 'proposal_ready' && renderProposalPreview()}

                {/* Tab Navigation */}
                <div className="detail-tabs-modern">
                  <button 
                    className={activeTab === 'details' ? 'active' : ''}
                    onClick={() => setActiveTab('details')}
                  >
                    <FileText size={14} /> Details
                  </button>
                  <button 
                    className={activeTab === 'requirements' ? 'active' : ''}
                    onClick={() => setActiveTab('requirements')}
                  >
                    <Settings size={14} /> Technical
                  </button>
                  <button 
                    className={activeTab === 'attachments' ? 'active' : ''}
                    onClick={() => setActiveTab('attachments')}
                  >
                    <Paperclip size={14} /> Attachments
                  </button>
                  <button 
                    className={activeTab === 'notes' ? 'active' : ''}
                    onClick={() => setActiveTab('notes')}
                  >
                    <StickyNote size={14} /> Notes
                  </button>
                </div>

                {/* Tab Content */}
                <div className="detail-tab-content">
                  {activeTab === 'details' && (
                    <div className="tab-panel">
                      <div className="info-section-modern">
                        <h4><Layers size={14} /> Service Information</h4>
                        <div className="service-card-modern">
                          <img 
                            src={getServiceImage(selectedReq.selectedService?.title)} 
                            alt="" 
                            className="service-icon-large-img"
                          />
                          <div>
                            <div className="service-title-modern">{selectedReq.selectedService?.title || 'Not specified'}</div>
                            <div className="service-subtitle-modern">{selectedReq.selectedService?.subtitle || 'Professional Service Solution'}</div>
                          </div>
                        </div>
                      </div>

                      <div className="info-section-modern">
                        <h4><User size={14} /> Client Information</h4>
                        <div className="info-grid-modern">
                          <div className="info-item-modern">
                            <span className="info-label"><User size={12} /> Full Name</span>
                            <span className="info-value">{selectedReq.clientInfo?.fullName || selectedReq.clientName || '—'}</span>
                          </div>
                          <div className="info-item-modern">
                            <span className="info-label"><Mail size={12} /> Email</span>
                            <span className="info-value">{selectedReq.clientInfo?.email || selectedReq.clientEmail || '—'}</span>
                          </div>
                          <div className="info-item-modern">
                            <span className="info-label"><Phone size={12} /> Phone</span>
                            <span className="info-value">{selectedReq.clientInfo?.phone || '—'}</span>
                          </div>
                          <div className="info-item-modern">
                            <span className="info-label"><Building size={12} /> Company</span>
                            <span className="info-value">{selectedReq.clientInfo?.company || '—'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="info-section-modern">
                        <h4><FileText size={14} /> Project Details</h4>
                        <div className="details-grid-modern">
                          <div className="detail-item-modern">
                            <span className="detail-label">Project Name</span>
                            <span className="detail-value">{selectedReq.commonData?.projectName || '—'}</span>
                          </div>
                          <div className="detail-item-modern">
                            <span className="detail-label">Project Goal</span>
                            <span className="detail-value goal">{selectedReq.commonData?.projectGoal || '—'}</span>
                          </div>
                          <div className="detail-item-modern">
                            <span className="detail-label"><DollarSign size={12} /> Budget</span>
                            <span className="detail-value budget">{selectedReq.commonData?.currency || 'Rs'} {selectedReq.commonData?.budget || '—'}</span>
                          </div>
                          <div className="detail-item-modern">
                            <span className="detail-label"><Clock size={12} /> Timeline</span>
                            <span className="detail-value">{selectedReq.commonData?.timeline || '—'}</span>
                          </div>
                          {selectedReq.commonData?.referenceLink && (
                            <div className="detail-item-modern full-width">
                              <span className="detail-label"><ExternalLink size={12} /> Reference Link</span>
                              <a href={selectedReq.commonData.referenceLink} target="_blank" rel="noopener noreferrer" className="reference-link-modern">
                                Open Link <ExternalLink size={12} />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {selectedReq.commonData?.additionalInfo && (
                        <div className="info-section-modern">
                          <h4><Info size={14} /> Additional Notes</h4>
                          <div className="additional-info-box-modern">
                            {selectedReq.commonData.additionalInfo}
                          </div>
                        </div>
                      )}

                      {selectedReq.status === 'request_info' && selectedReq.requestedInfo && (
                        <div className="info-section-modern">
                          <h4><MessageSquare size={14} /> Information Requested from Client</h4>
                          <div className="additional-info-box-modern info-requested">
                            <strong>Message sent to client:</strong>
                            <p>{selectedReq.requestedInfo}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'requirements' && (
                    <div className="tab-panel">
                      {selectedReq.dynamicFields && Object.keys(selectedReq.dynamicFields).length > 0 ? (
                        <div className="requirements-section-modern">
                          <h4><Settings size={14} /> Technical Requirements ({Object.keys(selectedReq.dynamicFields).length} fields)</h4>
                          <div className="requirements-list-modern">
                            {Object.entries(selectedReq.dynamicFields).map(([key, value]) => (
                              <div key={key} className="requirement-card-modern">
                                <div className="requirement-header">
                                  <Settings size={14} />
                                  <span className="requirement-name">{formatFieldName(key)}</span>
                                </div>
                                <div className="requirement-value-modern">
                                  {renderValue(value)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="empty-tab">
                          <Settings size={40} className="empty-tab-icon" />
                          <p>No technical requirements provided</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'attachments' && (
                    <div className="tab-panel">
                      {selectedReq.attachments && selectedReq.attachments.length > 0 ? (
                        <div className="attachments-section-modern">
                          <h4><Paperclip size={14} /> Attachments ({selectedReq.attachments.length})</h4>
                          <div className="attachments-grid-modern">
                            {selectedReq.attachments.map((file, idx) => (
                              <a key={idx} href={file.url} target="_blank" rel="noopener noreferrer" className="attachment-card-modern">
                                <div className="attachment-icon"><FileText size={24} /></div>
                                <div className="attachment-info-modern">
                                  <div className="attachment-name">{file.name}</div>
                                  <div className="attachment-size">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                                </div>
                                <span className="attachment-action"><ExternalLink size={14} /></span>
                              </a>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="empty-tab">
                          <Paperclip size={40} className="empty-tab-icon" />
                          <p>No attachments uploaded</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'notes' && (
                    <div className="tab-panel">
                      <div className="notes-section-modern">
                        <h4><StickyNote size={14} /> Internal Notes</h4>

                        <div className="add-note-area">
                          {!showNoteInput ? (
                            <button className="add-note-btn" onClick={() => setShowNoteInput(true)}>
                              <Plus size={16} /> Add Internal Note
                            </button>
                          ) : (
                            <div className="note-input-area">
                              <textarea 
                                placeholder="Add internal note about this requirement (client cannot see this)..."
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                rows="3"
                              />
                              <div className="note-actions">
                                <button className="cancel-note-btn" onClick={() => { setShowNoteInput(false); setAdminNotes(''); }}>
                                  <XCircle size={14} /> Cancel
                                </button>
                                <button className="save-note-btn" onClick={addAdminNote}>
                                  <CheckCircle size={14} /> Save Note
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="notes-list">
                          {selectedReq.adminNote && (
                            <div className="note-item">
                              <div className="note-header">
                                <span className="note-author"><User size={12} /> Admin</span>
                                <span className="note-time">{new Date(selectedReq.updatedAt).toLocaleString()}</span>
                              </div>
                              <p className="note-content">{selectedReq.adminNote}</p>
                            </div>
                          )}
                          {!selectedReq.adminNote && (
                            <div className="empty-notes">
                              <Info size={20} />
                              <p>No internal notes yet</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* STRONG ACTION BUTTONS - Status Based */}
                <div className="rm-actions-modern">
                  {/* SUBMITTED: Fresh requirement - start review or reject */}
                  {selectedReq.status === 'submitted' && (
                    <>
                      <button className="action-btn-modern primary" onClick={() => updateStatus(selectedReq._id, 'reviewing')}>
                        <Play size={16} /> Start Review
                      </button>
                      <button className="action-btn-modern info" onClick={() => setShowRequestInfoModal(true)}>
                        <MessageSquare size={16} /> Request Info
                      </button>
                      <button className="action-btn-modern danger" onClick={() => setShowRejectModal(true)}>
                        <Ban size={16} /> Reject
                      </button>
                    </>
                  )}

                  {/* REVIEWING: Under review - prepare proposal or reject */}
                  {selectedReq.status === 'reviewing' && (
                    <>
                      <button className="action-btn-modern success" onClick={() => prepareProposal(selectedReq)}>
                        <Edit3 size={16} /> Prepare Proposal
                      </button>
                      <button className="action-btn-modern info" onClick={() => setShowRequestInfoModal(true)}>
                        <MessageSquare size={16} /> Request Info
                      </button>
                      <button className="action-btn-modern danger" onClick={() => setShowRejectModal(true)}>
                        <Ban size={16} /> Reject
                      </button>
                    </>
                  )}

                  {/* PROPOSAL_READY: Draft ready - open in proposals tab or back to review */}
                  {selectedReq.status === 'proposal_ready' && (
                    <>
                      <button className="action-btn-modern success" onClick={() => {
                        if (onOpenProposalsTab && proposalDraft) {
                          onOpenProposalsTab(proposalDraft);
                        }
                      }}>
                        <Send size={16} /> Open in Proposals
                      </button>
                      <button className="action-btn-modern warning" onClick={() => updateStatus(selectedReq._id, 'reviewing', 'Back to review')}>
                        <RotateCcw size={16} /> Back to Review
                      </button>
                      <button className="action-btn-modern danger" onClick={() => setShowRejectModal(true)}>
                        <Ban size={16} /> Reject
                      </button>
                    </>
                  )}

                  {/* PROPOSAL_SENT: Already sent - can approve or back to ready */}
                  {selectedReq.status === 'proposal_sent' && (
                    <>
                      <button className="action-btn-modern success" onClick={() => updateStatus(selectedReq._id, 'approved', 'Client accepted proposal')}>
                        <CheckCircle size={16} /> Mark Approved
                      </button>
                      <button className="action-btn-modern warning" onClick={() => updateStatus(selectedReq._id, 'proposal_ready', 'Back to ready state')}>
                        <RotateCcw size={16} /> Back to Ready
                      </button>
                      <button className="action-btn-modern danger" onClick={() => setShowRejectModal(true)}>
                        <Ban size={16} /> Reject
                      </button>
                    </>
                  )}

                  {/* APPROVED: Project active - can set pending or back to review */}
                  {selectedReq.status === 'approved' && (
                    <>
                      <button className="action-btn-modern warning" onClick={() => updateStatus(selectedReq._id, 'proposal_sent', 'Set back to sent')}>
                        <RotateCcw size={16} /> Back to Sent
                      </button>
                      <button className="action-btn-modern primary" onClick={() => updateStatus(selectedReq._id, 'reviewing', 'Back to review')}>
                        <Search size={16} /> Back to Review
                      </button>
                      <button className="action-btn-modern info" onClick={() => prepareProposal(selectedReq)}>
                        <Edit3 size={16} /> New Proposal
                      </button>
                    </>
                  )}

                  {/* REJECTED: Can revive - approve, review again, or reset to new */}
                  {selectedReq.status === 'rejected' && (
                    <>
                      <button className="action-btn-modern success" onClick={() => updateStatus(selectedReq._id, 'approved', 'Previously rejected, now approved')}>
                        <CheckCircle size={16} /> Approve Now
                      </button>
                      <button className="action-btn-modern primary" onClick={() => updateStatus(selectedReq._id, 'reviewing', 'Reviewing again')}>
                        <Search size={16} /> Review Again
                      </button>
                      <button className="action-btn-modern info" onClick={() => updateStatus(selectedReq._id, 'submitted', 'Reset to new')}>
                        <RotateCcw size={16} /> Reset to New
                      </button>
                    </>
                  )}

                  {/* REQUEST_INFO: Waiting for client - resume review or reject */}
                  {selectedReq.status === 'request_info' && (
                    <>
                      <button className="action-btn-modern primary" onClick={() => updateStatus(selectedReq._id, 'reviewing', 'Resumed review after info received')}>
                        <Play size={16} /> Resume Review
                      </button>
                      <button className="action-btn-modern danger" onClick={() => setShowRejectModal(true)}>
                        <Ban size={16} /> Reject
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                className="rm-no-selection-modern"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="no-selection-icon-large"><FileText size={64} /></div>
                <h3>Select a Requirement</h3>
                <p>Choose a requirement from the left panel to view complete details and take action</p>
                <div className="quick-stats">
                  <div className="quick-stat">
                    <span>{stats.submitted}</span>
                    <small>New</small>
                  </div>
                  <div className="quick-stat">
                    <span>{stats.reviewing}</span>
                    <small>Reviewing</small>
                  </div>
                  <div className="quick-stat">
                    <span>{stats.proposal_sent}</span>
                    <small>Proposals</small>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div className="modal-overlay-modern" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-modern reject-modal" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="modal-header-modern">
                <h3><XCircle size={18} /> Reject Requirement</h3>
                <button onClick={() => setShowRejectModal(false)}><XCircle size={18} /></button>
              </div>
              <div className="modal-body-modern">
                <p>Are you sure you want to reject this requirement?</p>
                <div className="reject-client-info">
                  <strong>{selectedReq?.clientName}</strong> - {selectedReq?.projectName}
                </div>
                <textarea 
                  placeholder="Enter the reason for rejection (client will see this)..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows="4"
                />
                <p className="info-hint"><Info size={12} /> This reason will be shown to the client.</p>
              </div>
              <div className="modal-footer-modern">
                <button className="cancel-btn-modern" onClick={() => setShowRejectModal(false)}>Cancel</button>
                <button className="reject-btn-modern" onClick={handleReject}><XCircle size={14} /> Reject Requirement</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Request Info Modal */}
      <AnimatePresence>
        {showRequestInfoModal && (
          <motion.div className="modal-overlay-modern" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-modern info-modal" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="modal-header-modern">
                <h3><MessageSquare size={18} /> Request More Information</h3>
                <button onClick={() => setShowRequestInfoModal(false)}><XCircle size={18} /></button>
              </div>
              <div className="modal-body-modern">
                <p>Send a message to the client requesting additional information.</p>
                <div className="info-client-name">
                  <strong>{selectedReq?.clientName}</strong> - {selectedReq?.projectName}
                </div>
                <textarea 
                  placeholder="What additional information do you need from the client?"
                  value={requestInfoMessage}
                  onChange={(e) => setRequestInfoMessage(e.target.value)}
                  rows="4"
                />
                <p className="info-hint"><Info size={12} /> Client will receive an email notification with your request.</p>
              </div>
              <div className="modal-footer-modern">
                <button className="cancel-btn-modern" onClick={() => setShowRequestInfoModal(false)}>Cancel</button>
                <button className="info-btn-modern" onClick={requestMoreInfo}><Send size={14} /> Send Request</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default RequirementsManager;