import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Search, Plus, X, ChevronRight, ChevronLeft, CheckCircle, 
  Send, Download, Trash2, Eye, PenTool, Type, Upload, AlertCircle,
  Clock, DollarSign, User, Mail, Phone, Building, Calendar, 
  Layers, BarChart3, Check, ArrowRight, Save, RefreshCw,
  Settings, Package, Shield, Zap, Globe, Smartphone, ShoppingCart,
  TrendingUp, Code, Database, Info, ExternalLink, MessageSquare,
  Edit3, Ban, RotateCcw, Loader2
} from 'lucide-react';
import './ProposalsManager.css';

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

const showToast = (title, icon = 'success', timer = 2000) => {
  Swal.fire({
    title,
    icon,
    timer,
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
    customClass: { popup: 'pm-toast' }
  });
};

const ProposalsManager = ({ onUpdate, prefillData, onClearPrefill }) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showAdminSignModal, setShowAdminSignModal] = useState(false);
  const [showClientView, setShowClientView] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientRequirements, setClientRequirements] = useState(null);
  const [projectGoal, setProjectGoal] = useState('');
  const [serviceTitle, setServiceTitle] = useState('');
  const [signatureData, setSignatureData] = useState('');
  const [signatureType, setSignatureType] = useState('draw');
  const [typedSignature, setTypedSignature] = useState('');
  const [adminSignatureData, setAdminSignatureData] = useState('');
  const [adminSignatureType, setAdminSignatureType] = useState('draw');
  const [adminTypedSignature, setAdminTypedSignature] = useState('');
  const [adminSignatureNotes, setAdminSignatureNotes] = useState('');
  const [activeStep, setActiveStep] = useState(1);
  const [templateStyle, setTemplateStyle] = useState('modern');
  const [expiryDays, setExpiryDays] = useState(7);
  const [includeTerms, setIncludeTerms] = useState(true);
  const [showNegotiation, setShowNegotiation] = useState(false);
  const [negotiationMessage, setNegotiationMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  const [aboutUs, setAboutUs] = useState('');
  const [aboutImage, setAboutImage] = useState('');
  const [aboutImagePreview, setAboutImagePreview] = useState('');
  const [websiteStructure, setWebsiteStructure] = useState(['Home', 'About', 'Services', 'Portfolio', 'Blog', 'Contact']);
  const [integrations, setIntegrations] = useState(['Email Marketing', 'CRM', 'Analytics', 'Payment Gateway']);
  const [additionalFeatures, setAdditionalFeatures] = useState(['Mobile Responsive', 'SEO', 'SSL', '24/7 Support']);
  const [termsAndConditions, setTermsAndConditions] = useState('');
  const [thankYouMessage, setThankYouMessage] = useState('');
  const [newTagInput, setNewTagInput] = useState({ type: '', value: '' });
  const [uploadingImage, setUploadingImage] = useState(false);

  const canvasRef = useRef(null);
  const adminCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isAdminDrawing, setIsAdminDrawing] = useState(false);

  const [formData, setFormData] = useState({
    requirementId: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientCompany: '',
    projectName: '',
    budget: '',
    timeline: '',
    scope: '',
    deliverables: '',
    paymentTerms: '30% Advance, 30% Milestone, 40% Delivery',
    validUntil: '',
    notes: '',
    teamAssigned: '',
    milestones: [
      { name: 'Project Kickoff', percentage: 10, duration: '1 week' },
      { name: 'Design Phase', percentage: 20, duration: '2 weeks' },
      { name: 'Development', percentage: 40, duration: '4 weeks' },
      { name: 'Testing', percentage: 20, duration: '2 weeks' },
      { name: 'Deployment', percentage: 10, duration: '1 week' }
    ]
  });

  const setLoadingAction = (action, isLoading) => {
    setActionLoading(prev => ({ ...prev, [action]: isLoading }));
  };

  const isActionLoading = (action) => !!actionLoading[action];

  useEffect(() => {
    fetchProposals();
  }, []);

  useEffect(() => {
    if (prefillData) {
      setFormData({
        requirementId: prefillData.requirementId || '',
        clientName: prefillData.clientName || '',
        clientEmail: prefillData.clientEmail || '',
        clientPhone: prefillData.clientPhone || '',
        clientCompany: prefillData.clientCompany || '',
        projectName: prefillData.projectName || '',
        budget: prefillData.budget || '',
        timeline: prefillData.timeline || '',
        scope: '',
        deliverables: '',
        paymentTerms: '30% Advance, 30% Milestone, 40% Delivery',
        validUntil: calculateExpiryDate(7),
        notes: '',
        teamAssigned: '',
        milestones: getDefaultMilestones(prefillData.serviceTitle)
      });

      setClientRequirements(prefillData.requirements || {});
      setProjectGoal(prefillData.projectGoal || '');
      setServiceTitle(prefillData.serviceTitle || '');

      setShowCreateForm(true);
      if (onClearPrefill) onClearPrefill();

      showToast(`Creating proposal for ${prefillData.clientName}`, 'info', 2000);
    }
  }, [prefillData, onClearPrefill]);

  const calculateExpiryDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const getDefaultMilestones = (serviceTitle) => {
    const title = (serviceTitle || '').toLowerCase();
    if (title.includes('web')) {
      return [
        { name: 'Discovery & Planning', percentage: 10, duration: '1 week' },
        { name: 'UI/UX Design', percentage: 20, duration: '2 weeks' },
        { name: 'Frontend Development', percentage: 25, duration: '3 weeks' },
        { name: 'Backend Development', percentage: 25, duration: '3 weeks' },
        { name: 'Testing & QA', percentage: 15, duration: '2 weeks' },
        { name: 'Deployment', percentage: 5, duration: '1 week' }
      ];
    }
    if (title.includes('mobile') || title.includes('app')) {
      return [
        { name: 'Requirements Analysis', percentage: 10, duration: '1 week' },
        { name: 'App Design', percentage: 20, duration: '2 weeks' },
        { name: 'Development Phase 1', percentage: 30, duration: '4 weeks' },
        { name: 'Development Phase 2', percentage: 20, duration: '3 weeks' },
        { name: 'Testing & Beta', percentage: 15, duration: '2 weeks' },
        { name: 'App Store Launch', percentage: 5, duration: '1 week' }
      ];
    }
    return [
      { name: 'Project Kickoff', percentage: 10, duration: '1 week' },
      { name: 'Design Phase', percentage: 20, duration: '2 weeks' },
      { name: 'Development', percentage: 40, duration: '4 weeks' },
      { name: 'Testing', percentage: 20, duration: '2 weeks' },
      { name: 'Deployment', percentage: 10, duration: '1 week' }
    ];
  };

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await axios.get(`${API_URL}/admin/proposals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProposals(res.data.proposals || []);
    } catch (err) {
      console.error('Error fetching proposals:', err);
      setProposals([]);
      showToast('Failed to load proposals', 'error', 3000);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMilestoneChange = (index, field, value) => {
    const newMilestones = [...formData.milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setFormData(prev => ({ ...prev, milestones: newMilestones }));
  };

  const handleAboutImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/upload`, formDataUpload, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setAboutImage(res.data.url);
        setAboutImagePreview(res.data.url);
        showToast('Image uploaded successfully', 'success', 1500);
      }
    } catch (err) {
      console.error('Upload error:', err);
      showToast('Failed to upload image', 'error', 3000);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddTag = (type) => {
    if (!newTagInput.value.trim()) return;
    if (type === 'structure') {
      setWebsiteStructure([...websiteStructure, newTagInput.value.trim()]);
    } else if (type === 'integrations') {
      setIntegrations([...integrations, newTagInput.value.trim()]);
    } else if (type === 'features') {
      setAdditionalFeatures([...additionalFeatures, newTagInput.value.trim()]);
    }
    setNewTagInput({ type: '', value: '' });
  };

  const handleRemoveTag = (type, index) => {
    if (type === 'structure') {
      setWebsiteStructure(websiteStructure.filter((_, i) => i !== index));
    } else if (type === 'integrations') {
      setIntegrations(integrations.filter((_, i) => i !== index));
    } else if (type === 'features') {
      setAdditionalFeatures(additionalFeatures.filter((_, i) => i !== index));
    }
  };

  const generateProposal = async () => {
    if (!formData.projectName || !formData.budget || !formData.timeline || !formData.scope) {
      Swal.fire('Error', 'Please fill all required fields', 'error');
      return;
    }

    setLoadingAction('create', true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        budget: Number(formData.budget),
        clientRequirements: clientRequirements || {},
        projectGoal: projectGoal,
        serviceTitle: serviceTitle,
        templateStyle: templateStyle,
        expiryDays: expiryDays,
        includeTerms: includeTerms,
        aboutUs: aboutUs,
        aboutImage: aboutImage,
        websiteStructure: websiteStructure,
        integrations: integrations,
        additionalFeatures: additionalFeatures,
        termsAndConditions: termsAndConditions,
        thankYouMessage: thankYouMessage,
        status: 'draft'
      };

      await axios.post(`${API_URL}/admin/proposals/generate`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Swal.fire({
        title: 'Proposal Created!',
        text: 'Your proposal has been created successfully.',
        icon: 'success',
        confirmButtonColor: '#cc7722',
        confirmButtonText: 'View Proposals'
      });

      setShowCreateForm(false);
      resetForm();
      fetchProposals();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Generate proposal error:', err);
      Swal.fire('Error', err.response?.data?.message || 'Failed to generate proposal', 'error');
    } finally {
      setLoadingAction('create', false);
    }
  };

  const updateProposal = async () => {
    if (!editFormData || !editFormData._id) return;

    setLoadingAction('update', true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...editFormData,
        budget: Number(editFormData.budget)
      };

      await axios.put(`${API_URL}/admin/proposals/${editFormData._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showToast('Proposal updated successfully');
      setShowEditModal(false);
      setEditFormData(null);
      fetchProposals();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Update proposal error:', err);
      Swal.fire('Error', err.response?.data?.message || 'Failed to update proposal', 'error');
    } finally {
      setLoadingAction('update', false);
    }
  };

  const sendProposal = async (proposalId) => {
    setLoadingAction(`send_${proposalId}`, true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/admin/proposals/${proposalId}/send`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showToast('Proposal sent to client!', 'success', 2500);
      fetchProposals();
    } catch (err) {
      showToast('Failed to send proposal', 'error', 3000);
    } finally {
      setLoadingAction(`send_${proposalId}`, false);
    }
  };

  const adminSignProposal = async () => {
    let finalSignature = adminSignatureData;

    if (adminSignatureType === 'type' && adminTypedSignature) {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      ctx.font = 'italic 24px "Brush Script MT", cursive';
      ctx.fillStyle = '#1d2e2a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(adminTypedSignature, 200, 50);
      finalSignature = canvas.toDataURL();
    }

    if (!finalSignature) {
      Swal.fire('Error', 'Please provide a signature', 'error');
      return;
    }

    setLoadingAction('adminSign', true);
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      await axios.put(`${API_URL}/admin/requirements/proposals/${selectedProposal._id}/admin-sign`, {
        signature: finalSignature,
        signedBy: user?.fullName || 'Admin',
        notes: adminSignatureNotes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Swal.fire({
        title: 'Counter-Signed!',
        text: 'Proposal has been counter-signed successfully.',
        icon: 'success',
        confirmButtonColor: '#cc7722'
      });

      setShowAdminSignModal(false);
      setAdminSignatureData('');
      setAdminTypedSignature('');
      setAdminSignatureNotes('');
      fetchProposals();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Admin sign error:', err);
      Swal.fire('Error', err.response?.data?.message || 'Failed to sign proposal', 'error');
    } finally {
      setLoadingAction('adminSign', false);
    }
  };

  const updateStatus = async (proposalId, newStatus) => {
    setLoadingAction(`status_${proposalId}`, true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/admin/proposals/${proposalId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showToast(`Status updated to ${newStatus}`);
      fetchProposals();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Status update error:', err);
      showToast('Failed to update status', 'error', 3000);
    } finally {
      setLoadingAction(`status_${proposalId}`, false);
    }
  };

  const resetForm = () => {
    setFormData({
      requirementId: '',
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      clientCompany: '',
      projectName: '',
      budget: '',
      timeline: '',
      scope: '',
      deliverables: '',
      paymentTerms: '30% Advance, 30% Milestone, 40% Delivery',
      validUntil: '',
      notes: '',
      teamAssigned: '',
      milestones: [
        { name: 'Project Kickoff', percentage: 10, duration: '1 week' },
        { name: 'Design Phase', percentage: 20, duration: '2 weeks' },
        { name: 'Development', percentage: 40, duration: '4 weeks' },
        { name: 'Testing', percentage: 20, duration: '2 weeks' },
        { name: 'Deployment', percentage: 10, duration: '1 week' }
      ]
    });
    setClientRequirements(null);
    setProjectGoal('');
    setServiceTitle('');
    setActiveStep(1);
    setTemplateStyle('modern');
    setAboutUs('');
    setAboutImage('');
    setAboutImagePreview('');
    setWebsiteStructure(['Home', 'About', 'Services', 'Portfolio', 'Blog', 'Contact']);
    setIntegrations(['Email Marketing', 'CRM', 'Analytics', 'Payment Gateway']);
    setAdditionalFeatures(['Mobile Responsive', 'SEO', 'SSL', '24/7 Support']);
    setTermsAndConditions('');
    setThankYouMessage('');
    setNewTagInput({ type: '', value: '' });
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
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
    const canvas = canvasRef.current;
    if (canvas) setSignatureData(canvas.toDataURL());
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureData('');
      setTypedSignature('');
    }
  };

  const startAdminDrawing = (e) => {
    const canvas = adminCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsAdminDrawing(true);
  };

  const drawAdmin = (e) => {
    if (!isAdminDrawing) return;
    const canvas = adminCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1d2e2a';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopAdminDrawing = () => {
    setIsAdminDrawing(false);
    const canvas = adminCanvasRef.current;
    if (canvas) setAdminSignatureData(canvas.toDataURL());
  };

  const clearAdminSignature = () => {
    const canvas = adminCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setAdminSignatureData('');
      setAdminTypedSignature('');
    }
  };

  const handleSignatureSubmit = async () => {
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

    setLoadingAction('clientSign', true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/admin/proposals/${selectedProposal._id}/sign`, {
        signature: finalSignature,
        signedAt: new Date(),
        signedBy: selectedProposal.clientName,
        ipAddress: 'client-ip'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showToast('Proposal digitally signed!', 'success', 2500);
      setShowSignatureModal(false);
      setSignatureData('');
      setTypedSignature('');
      fetchProposals();
    } catch (err) {
      showToast('Failed to sign proposal', 'error', 3000);
    } finally {
      setLoadingAction('clientSign', false);
    }
  };

  const handleNegotiation = async () => {
    if (!negotiationMessage.trim()) {
      Swal.fire('Error', 'Please enter your message', 'error');
      return;
    }

    setLoadingAction('negotiate', true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/admin/proposals/${selectedProposal._id}/negotiate`, {
        message: negotiationMessage,
        timestamp: new Date(),
        from: 'client'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showToast('Negotiation message sent');
      setShowNegotiation(false);
      setNegotiationMessage('');
      fetchProposals();
    } catch (err) {
      showToast('Failed to send message', 'error', 3000);
    } finally {
      setLoadingAction('negotiate', false);
    }
  };

  const viewProposal = (proposal) => {
    setSelectedProposal(proposal);
    setShowViewModal(true);
  };

  const viewClientProposal = (proposal) => {
    setSelectedProposal(proposal);
    setShowClientView(true);
  };

  const editProposal = (proposal) => {
    setEditFormData({ ...proposal });
    setShowEditModal(true);
  };

  const openAdminSignModal = (proposal) => {
    setSelectedProposal(proposal);
    setShowAdminSignModal(true);
  };

  const downloadProposal = async (proposal) => {
    setLoadingAction(`download_${proposal._id}`, true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/proposals/${proposal._id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Proposal_${proposal.projectName.replace(/\s/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showToast('Download started');
    } catch (err) {
      showToast('Failed to download proposal', 'error', 3000);
    } finally {
      setLoadingAction(`download_${proposal._id}`, false);
    }
  };

  const deleteProposal = async (proposalId) => {
    const result = await Swal.fire({
      title: 'Delete Proposal?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it'
    });

    if (result.isConfirmed) {
      setLoadingAction(`delete_${proposalId}`, true);
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/admin/proposals/${proposalId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        showToast('Proposal deleted');
        fetchProposals();
        if (onUpdate) onUpdate();
      } catch (err) {
        showToast('Failed to delete proposal', 'error', 3000);
      } finally {
        setLoadingAction(`delete_${proposalId}`, false);
      }
    }
  };

  const formatFieldName = (key) => {
    const fieldMap = {
      'businessPurpose': 'Business Purpose',
      'targetAudience': 'Target Audience',
      'uniqueSellingPoints': 'Unique Selling Points',
      'scopeOfWork': 'Scope of Work',
      'frontendTech': 'Frontend Technology',
      'backendTech': 'Backend Technology',
      'database': 'Database Preference',
      'pages': 'Number of Pages',
      'features': 'Key Features',
      'responsive': 'Responsive Design',
      'platform': 'Target Platform',
      'appCategory': 'App Category',
      'userAuthentication': 'User Authentication',
      'paymentGateways': 'Payment Gateways',
      'shippingRequirements': 'Shipping Requirements',
      'primaryGoal': 'Primary Goal',
      'platforms': 'Target Platforms',
      'monthlyBudget': 'Monthly Budget',
      'designType': 'Design Type',
      'numberOfScreens': 'Number of Screens'
    };
    return fieldMap[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  const renderClientRequirements = () => {
    if (!clientRequirements || Object.keys(clientRequirements).length === 0) {
      return <p className="pm-no-requirements">No specific requirements provided.</p>;
    }

    return (
      <div className="pm-requirements-list">
        {Object.entries(clientRequirements).map(([key, value]) => {
          if (!value) return null;
          const displayValue = Array.isArray(value) ? value.join(', ') : value;
          return (
            <div key={key} className="pm-requirement-item">
              <span className="pm-req-label">{formatFieldName(key)}</span>
              <span className="pm-req-value">{displayValue}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      draft: { bg: '#FEF3C7', color: '#D97706', label: 'Draft', icon: FileText },
      sent: { bg: '#DBEAFE', color: '#2563EB', label: 'Sent', icon: Send },
      viewed: { bg: '#E0E7FF', color: '#4F46E5', label: 'Viewed', icon: Eye },
      negotiating: { bg: '#FEF3C7', color: '#D97706', label: 'Negotiating', icon: AlertCircle },
      client_signed: { bg: '#FEF3C7', color: '#D97706', label: 'Client Signed', icon: PenTool },
      admin_signed: { bg: '#DCFCE7', color: '#16A34A', label: 'Counter-Signed', icon: CheckCircle },
      accepted: { bg: '#DCFCE7', color: '#16A34A', label: 'Accepted', icon: CheckCircle },
      signed: { bg: '#DCFCE7', color: '#16A34A', label: 'Signed', icon: PenTool },
      declined: { bg: '#FEE2E2', color: '#DC2626', label: 'Declined', icon: X },
      expired: { bg: '#F3F4F6', color: '#6B7280', label: 'Expired', icon: Clock }
    };
    const style = statusMap[status] || statusMap.draft;
    const IconComp = style.icon;
    return (
      <span className={`proposal-status-modern ${status}`} style={{ background: style.bg, color: style.color }}>
        <IconComp size={12} />
        {style.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilExpiry = (validUntil) => {
    if (!validUntil) return 0;
    const diff = new Date(validUntil) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const filteredProposals = proposals.filter(proposal => {
    const matchesStatus = statusFilter === 'all' ? true : proposal.status === statusFilter;
    const matchesSearch = searchTerm === '' ||
      proposal.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.projectName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: proposals.length,
    draft: proposals.filter(p => p.status === 'draft').length,
    sent: proposals.filter(p => p.status === 'sent').length,
    viewed: proposals.filter(p => p.status === 'viewed').length,
    negotiating: proposals.filter(p => p.status === 'negotiating').length,
    client_signed: proposals.filter(p => p.status === 'client_signed').length,
    admin_signed: proposals.filter(p => p.status === 'admin_signed').length,
    accepted: proposals.filter(p => ['accepted', 'signed'].includes(p.status)).length,
    declined: proposals.filter(p => p.status === 'declined').length,
    expired: proposals.filter(p => p.status === 'expired').length
  };

  const renderWizardStep = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="wizard-step">
            <h4><User size={16} /> Step 1: Client Information</h4>
            <div className="pm-form-row">
              <div className="pm-form-group">
                <label>Client Name <span className="required">*</span></label>
                <input type="text" name="clientName" value={formData.clientName} onChange={handleInputChange} placeholder="Enter client name" />
              </div>
              <div className="pm-form-group">
                <label>Client Email <span className="required">*</span></label>
                <input type="email" name="clientEmail" value={formData.clientEmail} onChange={handleInputChange} placeholder="client@email.com" />
              </div>
            </div>
            <div className="pm-form-row">
              <div className="pm-form-group">
                <label>Phone Number</label>
                <input type="text" name="clientPhone" value={formData.clientPhone} onChange={handleInputChange} placeholder="+92 XXX XXXXXXX" />
              </div>
              <div className="pm-form-group">
                <label>Company</label>
                <input type="text" name="clientCompany" value={formData.clientCompany} onChange={handleInputChange} placeholder="Company name" />
              </div>
            </div>

            {clientRequirements && Object.keys(clientRequirements).length > 0 && (
              <div className="pm-client-requirements">
                <h4><Layers size={14} /> Client Requirements</h4>
                <div className="pm-requirements-wrapper">
                  {renderClientRequirements()}
                </div>
                {projectGoal && (
                  <div className="pm-project-goal">
                    <strong>Project Goal:</strong>
                    <p>{projectGoal}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="wizard-step">
            <h4><FileText size={16} /> Step 2: Project Details</h4>
            <div className="pm-form-group">
              <label>Project Title <span className="required">*</span></label>
              <input type="text" name="projectName" value={formData.projectName} onChange={handleInputChange} placeholder="Enter project title" />
            </div>
            <div className="pm-form-row">
              <div className="pm-form-group">
                <label>Budget (Rs) <span className="required">*</span></label>
                <input type="number" name="budget" value={formData.budget} onChange={handleInputChange} placeholder="e.g., 500000" />
              </div>
              <div className="pm-form-group">
                <label>Timeline <span className="required">*</span></label>
                <input type="text" name="timeline" value={formData.timeline} onChange={handleInputChange} placeholder="e.g., 2 months" />
              </div>
            </div>
            <div className="pm-form-group">
              <label>Scope of Work <span className="required">*</span></label>
              <textarea name="scope" value={formData.scope} onChange={handleInputChange} rows="5" placeholder="Detailed description of what will be delivered..."></textarea>
            </div>
            <div className="pm-form-group">
              <label>Deliverables</label>
              <textarea name="deliverables" value={formData.deliverables} onChange={handleInputChange} rows="3" placeholder="List what the client will receive..."></textarea>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="wizard-step">
            <h4><DollarSign size={16} /> Step 3: Payment & Terms</h4>
            <div className="pm-form-row">
              <div className="pm-form-group">
                <label>Payment Terms</label>
                <select name="paymentTerms" value={formData.paymentTerms} onChange={handleInputChange}>
                  <option value="30% Advance, 30% Milestone, 40% Delivery">30% Advance, 30% Milestone, 40% Delivery</option>
                  <option value="50% Advance, 50% on Delivery">50% Advance, 50% on Delivery</option>
                  <option value="100% Upfront">100% Upfront</option>
                  <option value="25% Advance, 25% Milestone, 25% Testing, 25% Delivery">25% Advance, 25% Milestone, 25% Testing, 25% Delivery</option>
                </select>
              </div>
              <div className="pm-form-group">
                <label>Valid Until (Days)</label>
                <select value={expiryDays} onChange={(e) => { setExpiryDays(Number(e.target.value)); setFormData(prev => ({ ...prev, validUntil: calculateExpiryDate(Number(e.target.value)) })); }}>
                  <option value={3}>3 Days</option>
                  <option value={7}>7 Days</option>
                  <option value={14}>14 Days</option>
                  <option value={30}>30 Days</option>
                </select>
              </div>
            </div>
            <div className="pm-form-group">
              <label>Team Assigned</label>
              <input type="text" name="teamAssigned" value={formData.teamAssigned} onChange={handleInputChange} placeholder="e.g., Senior Developer, UI Designer, QA Engineer" />
            </div>
            <div className="pm-form-group">
              <label>Additional Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="2" placeholder="Any special terms or conditions..."></textarea>
            </div>
            <div className="pm-form-group checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" checked={includeTerms} onChange={(e) => setIncludeTerms(e.target.checked)} />
                Include Standard Terms & Conditions
              </label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="wizard-step">
            <h4><Layers size={16} /> Step 4: Milestones</h4>
            <div className="milestones-list">
              {formData.milestones.map((milestone, idx) => (
                <div key={idx} className="milestone-item">
                  <div className="milestone-number">{idx + 1}</div>
                  <div className="milestone-fields">
                    <input 
                      type="text" 
                      value={milestone.name} 
                      onChange={(e) => handleMilestoneChange(idx, 'name', e.target.value)}
                      placeholder="Milestone name"
                    />
                    <div className="milestone-meta">
                      <input 
                        type="number" 
                        value={milestone.percentage} 
                        onChange={(e) => handleMilestoneChange(idx, 'percentage', e.target.value)}
                        placeholder="%"
                        className="percentage-input"
                      />
                      <input 
                        type="text" 
                        value={milestone.duration} 
                        onChange={(e) => handleMilestoneChange(idx, 'duration', e.target.value)}
                        placeholder="Duration"
                        className="duration-input"
                      />
                    </div>
                  </div>
                  <div className="milestone-bar">
                    <div className="milestone-progress" style={{ width: `${milestone.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="milestone-total">
              Total: {formData.milestones.reduce((acc, m) => acc + Number(m.percentage), 0)}%
            </div>
          </div>
        );

      case 5:
        return (
          <div className="wizard-step">
            <h4><Settings size={16} /> Step 5: Template & Preview</h4>
            <div className="template-selector">
              <label>Select Template Style</label>
              <div className="template-options">
                <button 
                  className={`template-option ${templateStyle === 'modern' ? 'active' : ''}`}
                  onClick={() => setTemplateStyle('modern')}
                >
                  <div className="template-preview modern-preview">Modern</div>
                  <span>Clean & Modern</span>
                </button>
                <button 
                  className={`template-option ${templateStyle === 'corporate' ? 'active' : ''}`}
                  onClick={() => setTemplateStyle('corporate')}
                >
                  <div className="template-preview corporate-preview">Corporate</div>
                  <span>Professional</span>
                </button>
                <button 
                  className={`template-option ${templateStyle === 'minimal' ? 'active' : ''}`}
                  onClick={() => setTemplateStyle('minimal')}
                >
                  <div className="template-preview minimal-preview">Minimal</div>
                  <span>Minimalist</span>
                </button>
              </div>
            </div>

            <div className="proposal-preview-summary">
              <h5>Proposal Summary</h5>
              <div className="preview-summary-item">
                <span>Client:</span>
                <strong>{formData.clientName || 'Not set'}</strong>
              </div>
              <div className="preview-summary-item">
                <span>Project:</span>
                <strong>{formData.projectName || 'Not set'}</strong>
              </div>
              <div className="preview-summary-item">
                <span>Budget:</span>
                <strong>Rs {formData.budget || '0'}</strong>
              </div>
              <div className="preview-summary-item">
                <span>Timeline:</span>
                <strong>{formData.timeline || 'Not set'}</strong>
              </div>
              <div className="preview-summary-item">
                <span>Valid Until:</span>
                <strong>{formData.validUntil || calculateExpiryDate(expiryDays)}</strong>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="wizard-step">
            <h4><Building size={16} /> Step 6: About Us & Legal</h4>
            <div className="pm-form-group">
              <label>About Us</label>
              <textarea 
                value={aboutUs}
                onChange={(e) => setAboutUs(e.target.value)}
                rows="4"
                placeholder="Write about your company, mission, and expertise..."
              />
            </div>
            <div className="pm-form-group">
              <label>About Us Image</label>
              <div className="image-upload-area">
                <input type="file" accept="image/*" onChange={handleAboutImageUpload} disabled={uploadingImage} />
                {uploadingImage && (
                  <div className="upload-loading">
                    <Loader2 size={16} className="spin-icon" />
                    <span>Uploading image...</span>
                  </div>
                )}
                {aboutImagePreview && (
                  <div className="image-preview">
                    <img src={aboutImagePreview} alt="About preview" />
                    <button type="button" onClick={() => { setAboutImage(''); setAboutImagePreview(''); }}>Remove</button>
                  </div>
                )}
              </div>
            </div>
            <div className="pm-form-group">
              <label>Website Structure (Pages)</label>
              <div className="tags-input-container">
                {websiteStructure.map((item, idx) => (
                  <span key={idx} className="tag-item">
                    {item}
                    <button type="button" onClick={() => handleRemoveTag('structure', idx)}>×</button>
                  </span>
                ))}
                <div className="tag-input-row">
                  <input type="text" placeholder="Add page (e.g., Careers)" value={newTagInput.type === 'structure' ? newTagInput.value : ''} onChange={(e) => setNewTagInput({ type: 'structure', value: e.target.value })} onKeyPress={(e) => e.key === 'Enter' && handleAddTag('structure')} />
                  <button type="button" onClick={() => handleAddTag('structure')}>Add</button>
                </div>
              </div>
            </div>
            <div className="pm-form-group">
              <label>Integrations</label>
              <div className="tags-input-container">
                {integrations.map((item, idx) => (
                  <span key={idx} className="tag-item">
                    {item}
                    <button type="button" onClick={() => handleRemoveTag('integrations', idx)}>×</button>
                  </span>
                ))}
                <div className="tag-input-row">
                  <input type="text" placeholder="Add integration (e.g., Mailchimp)" value={newTagInput.type === 'integrations' ? newTagInput.value : ''} onChange={(e) => setNewTagInput({ type: 'integrations', value: e.target.value })} onKeyPress={(e) => e.key === 'Enter' && handleAddTag('integrations')} />
                  <button type="button" onClick={() => handleAddTag('integrations')}>Add</button>
                </div>
              </div>
            </div>
            <div className="pm-form-group">
              <label>Additional Features</label>
              <div className="tags-input-container">
                {additionalFeatures.map((item, idx) => (
                  <span key={idx} className="tag-item">
                    {item}
                    <button type="button" onClick={() => handleRemoveTag('features', idx)}>×</button>
                  </span>
                ))}
                <div className="tag-input-row">
                  <input type="text" placeholder="Add feature (e.g., Live Chat)" value={newTagInput.type === 'features' ? newTagInput.value : ''} onChange={(e) => setNewTagInput({ type: 'features', value: e.target.value })} onKeyPress={(e) => e.key === 'Enter' && handleAddTag('features')} />
                  <button type="button" onClick={() => handleAddTag('features')}>Add</button>
                </div>
              </div>
            </div>
            <div className="pm-form-group">
              <label>Terms & Conditions</label>
              <textarea 
                value={termsAndConditions}
                onChange={(e) => setTermsAndConditions(e.target.value)}
                rows="8"
                placeholder="Enter your terms and conditions..."
              />
            </div>
            <div className="pm-form-group">
              <label>Thank You Message</label>
              <textarea 
                value={thankYouMessage}
                onChange={(e) => setThankYouMessage(e.target.value)}
                rows="3"
                placeholder="Thank you message for the client..."
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStatusOptions = () => {
    return [
      { value: 'draft', label: 'Draft', icon: FileText },
      { value: 'sent', label: 'Sent', icon: Send },
      { value: 'viewed', label: 'Viewed', icon: Eye },
      { value: 'negotiating', label: 'Negotiating', icon: AlertCircle },
      { value: 'client_signed', label: 'Client Signed', icon: PenTool },
      { value: 'admin_signed', label: 'Admin Signed', icon: CheckCircle },
      { value: 'accepted', label: 'Accepted', icon: CheckCircle },
      { value: 'declined', label: 'Declined', icon: Ban },
      { value: 'expired', label: 'Expired', icon: Clock }
    ];
  };

  if (loading && proposals.length === 0) {
    return (
      <div className="pm-loading-modern">
        <div className="pm-spinner-modern"></div>
        <p>Loading proposals...</p>
      </div>
    );
  }

  return (
    <div className="proposals-manager-modern">
      {/* Header */}
      <div className="pm-header-modern">
        <div className="pm-header-left-modern">
          <div className="pm-header-icon-modern">
            <FileText size={22} />
          </div>
          <div>
            <h2>Proposals Hub</h2>
            <p>Create, manage, and track professional client proposals</p>
          </div>
        </div>
        <button 
          className="pm-create-btn-modern" 
          onClick={() => { resetForm(); setShowCreateForm(true); }}
          disabled={isActionLoading('create')}
          style={{ opacity: isActionLoading('create') ? 0.7 : 1 }}
        >
          {isActionLoading('create') ? <Loader2 size={16} className="spin-icon" /> : <Plus size={16} />}
          New Proposal
        </button>
      </div>

      {/* Stats Cards */}
      <div className="pm-stats-modern">
        <motion.div className="pm-stat-card-modern" whileHover={{ y: -2 }}>
          <div className="pm-stat-icon"><BarChart3 size={20} /></div>
          <div className="pm-stat-info">
            <div className="pm-stat-value-modern">{stats.total}</div>
            <div className="pm-stat-label-modern">Total</div>
          </div>
        </motion.div>
        <motion.div className="pm-stat-card-modern draft" whileHover={{ y: -2 }}>
          <div className="pm-stat-icon"><FileText size={20} /></div>
          <div className="pm-stat-info">
            <div className="pm-stat-value-modern">{stats.draft}</div>
            <div className="pm-stat-label-modern">Draft</div>
          </div>
        </motion.div>
        <motion.div className="pm-stat-card-modern sent" whileHover={{ y: -2 }}>
          <div className="pm-stat-icon"><Send size={20} /></div>
          <div className="pm-stat-info">
            <div className="pm-stat-value-modern">{stats.sent}</div>
            <div className="pm-stat-label-modern">Sent</div>
          </div>
        </motion.div>
        <motion.div className="pm-stat-card-modern viewed" whileHover={{ y: -2 }}>
          <div className="pm-stat-icon"><Eye size={20} /></div>
          <div className="pm-stat-info">
            <div className="pm-stat-value-modern">{stats.viewed}</div>
            <div className="pm-stat-label-modern">Viewed</div>
          </div>
        </motion.div>
        <motion.div className="pm-stat-card-modern client_signed" whileHover={{ y: -2 }}>
          <div className="pm-stat-icon"><PenTool size={20} /></div>
          <div className="pm-stat-info">
            <div className="pm-stat-value-modern">{stats.client_signed}</div>
            <div className="pm-stat-label-modern">Client Signed</div>
          </div>
        </motion.div>
        <motion.div className="pm-stat-card-modern admin_signed" whileHover={{ y: -2 }}>
          <div className="pm-stat-icon"><CheckCircle size={20} /></div>
          <div className="pm-stat-info">
            <div className="pm-stat-value-modern">{stats.admin_signed}</div>
            <div className="pm-stat-label-modern">Counter-Signed</div>
          </div>
        </motion.div>
        <motion.div className="pm-stat-card-modern declined" whileHover={{ y: -2 }}>
          <div className="pm-stat-icon"><X size={20} /></div>
          <div className="pm-stat-info">
            <div className="pm-stat-value-modern">{stats.declined}</div>
            <div className="pm-stat-label-modern">Declined</div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="pm-filters-modern">
        <div className="pm-search-modern">
          <Search size={16} className="pm-search-icon" />
          <input type="text" placeholder="Search by client or project..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="filter-pills">
          {[
            { key: 'all', label: 'All' },
            { key: 'draft', label: 'Draft' },
            { key: 'sent', label: 'Sent' },
            { key: 'viewed', label: 'Viewed' },
            { key: 'negotiating', label: 'Negotiating' },
            { key: 'client_signed', label: 'Client Signed' },
            { key: 'admin_signed', label: 'Counter-Signed' },
            { key: 'accepted', label: 'Accepted' },
            { key: 'declined', label: 'Declined' }
          ].map(filter => (
            <button 
              key={filter.key} 
              className={`filter-pill ${statusFilter === filter.key ? 'active' : ''}`}
              onClick={() => setStatusFilter(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Proposals Table */}
      <div className="pm-table-container-modern">
        {filteredProposals.length === 0 ? (
          <div className="pm-empty-modern">
            <div className="pm-empty-icon-large"><FileText size={48} /></div>
            <h4>No Proposals Found</h4>
            <p>Create your first proposal by clicking the "New Proposal" button</p>
          </div>
        ) : (
          <table className="pm-table-modern">
            <thead>
              <tr>
                <th>Proposal</th>
                <th>Client</th>
                <th>Project</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Expiry</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProposals.map((proposal, idx) => {
                const daysLeft = getDaysUntilExpiry(proposal.validUntil);
                const serviceImg = getServiceImage(proposal.serviceTitle);
                return (
                  <motion.tr 
                    key={proposal._id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <td>
                      <div className="proposal-id">#ANAX-{String(idx + 1).padStart(4, '0')}</div>
                      <div className="proposal-date">{formatDate(proposal.createdAt)}</div>
                    </td>
                    <td>
                      <div className="client-cell">
                        <div className="client-avatar-small">{proposal.clientName?.charAt(0) || 'C'}</div>
                        <div>
                          <div className="client-name">{proposal.clientName || 'N/A'}</div>
                          <div className="client-email">{proposal.clientEmail || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="project-cell">
                        <img src={serviceImg} alt="" className="project-service-icon" />
                        <div>
                          <div className="project-name">{proposal.projectName}</div>
                          <div className="project-service">{proposal.serviceTitle || 'General'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="budget-cell">
                        <span className="budget-amount">Rs {parseInt(proposal.budget).toLocaleString()}</span>
                      </div>
                    </td>
                    <td>
                      <div className="status-cell">
                        {getStatusBadge(proposal.status)}
                        <select 
                          className="status-dropdown"
                          value={proposal.status}
                          onChange={(e) => updateStatus(proposal._id, e.target.value)}
                          title="Change Status"
                          disabled={isActionLoading(`status_${proposal._id}`)}
                        >
                          {getStatusOptions().map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td>
                      <div className="expiry-cell">
                        {daysLeft > 0 ? (
                          <>
                            <span className={`expiry-badge ${daysLeft <= 2 ? 'urgent' : ''}`}>
                              {daysLeft} days left
                            </span>
                            <div className="expiry-bar">
                              <div className="expiry-progress" style={{ width: `${Math.max(0, Math.min(100, (daysLeft / 7) * 100))}%` }}></div>
                            </div>
                          </>
                        ) : (
                          <span className="expiry-badge expired">Expired</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="pm-actions-modern">
                        <button 
                          className="pm-action-view-modern" 
                          onClick={() => viewProposal(proposal)} 
                          title="View Details"
                          disabled={isActionLoading(`view_${proposal._id}`)}
                        >
                          {isActionLoading(`view_${proposal._id}`) ? <Loader2 size={14} className="spin-icon" /> : <Eye size={14} />}
                          View
                        </button>
                        <button 
                          className="pm-action-edit-modern" 
                          onClick={() => editProposal(proposal)} 
                          title="Edit Proposal"
                          disabled={isActionLoading(`edit_${proposal._id}`)}
                        >
                          {isActionLoading(`edit_${proposal._id}`) ? <Loader2 size={14} className="spin-icon" /> : <Edit3 size={14} />}
                          Edit
                        </button>
                        {proposal.status === 'draft' && (
                          <button 
                            className="pm-action-send-modern" 
                            onClick={() => sendProposal(proposal._id)} 
                            title="Send to Client"
                            disabled={isActionLoading(`send_${proposal._id}`)}
                          >
                            {isActionLoading(`send_${proposal._id}`) ? <Loader2 size={14} className="spin-icon" /> : <Send size={14} />}
                            Send
                          </button>
                        )}
                        {proposal.status === 'client_signed' && (
                          <button 
                            className="pm-action-sign-admin" 
                            onClick={() => openAdminSignModal(proposal)} 
                            title="Counter-Sign"
                            disabled={isActionLoading(`adminSign_${proposal._id}`)}
                          >
                            {isActionLoading(`adminSign_${proposal._id}`) ? <Loader2 size={14} className="spin-icon" /> : <PenTool size={14} />}
                            Counter-Sign
                          </button>
                        )}
                        <button 
                          className="pm-action-download-modern" 
                          onClick={() => downloadProposal(proposal)} 
                          title="Download PDF"
                          disabled={isActionLoading(`download_${proposal._id}`)}
                        >
                          {isActionLoading(`download_${proposal._id}`) ? <Loader2 size={14} className="spin-icon" /> : <Download size={14} />}
                          PDF
                        </button>
                        <button 
                          className="pm-action-delete-modern" 
                          onClick={() => deleteProposal(proposal._id)} 
                          title="Delete"
                          disabled={isActionLoading(`delete_${proposal._id}`)}
                        >
                          {isActionLoading(`delete_${proposal._id}`) ? <Loader2 size={14} className="spin-icon" /> : <Trash2 size={14} />}
                          Del
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Proposal Modal - Wizard */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div className="pm-modal-overlay-modern" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="pm-modal-modern pm-create-modal-modern" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
              <div className="pm-modal-header-modern">
                <h3><FileText size={18} /> Create New Proposal</h3>
                <button className="pm-modal-close-modern" onClick={() => { setShowCreateForm(false); resetForm(); }}><X size={20} /></button>
              </div>

              <div className="wizard-steps">
                {[1, 2, 3, 4, 5, 6].map(step => (
                  <div key={step} className={`wizard-step-indicator ${activeStep >= step ? 'active' : ''} ${activeStep > step ? 'completed' : ''}`}>
                    <div className="step-number">{activeStep > step ? <Check size={12} /> : step}</div>
                    <div className="step-label">
                      {step === 1 && 'Client'}
                      {step === 2 && 'Project'}
                      {step === 3 && 'Terms'}
                      {step === 4 && 'Milestones'}
                      {step === 5 && 'Preview'}
                      {step === 6 && 'About & Legal'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pm-modal-body-modern">
                {renderWizardStep()}
              </div>

              <div className="pm-modal-footer-modern">
                <button 
                  className="pm-cancel-btn-modern" 
                  onClick={() => { 
                    if (activeStep > 1) setActiveStep(activeStep - 1);
                    else { setShowCreateForm(false); resetForm(); }
                  }}
                  disabled={isActionLoading('create')}
                >
                  {activeStep > 1 ? <><ChevronLeft size={14} /> Back</> : 'Cancel'}
                </button>
                {activeStep < 6 ? (
                  <button className="pm-next-btn-modern" onClick={() => setActiveStep(activeStep + 1)} disabled={isActionLoading('create')}>
                    Next Step <ChevronRight size={14} />
                  </button>
                ) : (
                  <button 
                    className="pm-generate-btn-modern" 
                    onClick={generateProposal}
                    disabled={isActionLoading('create')}
                    style={{ opacity: isActionLoading('create') ? 0.7 : 1 }}
                  >
                    {isActionLoading('create') ? <Loader2 size={14} className="spin-icon" /> : <Check size={14} />}
                    Create Proposal
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Proposal Modal */}
      <AnimatePresence>
        {showEditModal && editFormData && (
          <motion.div className="pm-modal-overlay-modern" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="pm-modal-modern pm-edit-modal-modern" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
              <div className="pm-modal-header-modern">
                <h3><Edit3 size={18} /> Edit Proposal</h3>
                <button className="pm-modal-close-modern" onClick={() => { setShowEditModal(false); setEditFormData(null); }}><X size={20} /></button>
              </div>
              <div className="pm-modal-body-modern">
                <div className="pm-form-row">
                  <div className="pm-form-group">
                    <label>Client Name</label>
                    <input type="text" value={editFormData.clientName || ''} onChange={(e) => setEditFormData({...editFormData, clientName: e.target.value})} />
                  </div>
                  <div className="pm-form-group">
                    <label>Client Email</label>
                    <input type="email" value={editFormData.clientEmail || ''} onChange={(e) => setEditFormData({...editFormData, clientEmail: e.target.value})} />
                  </div>
                </div>
                <div className="pm-form-row">
                  <div className="pm-form-group">
                    <label>Project Name</label>
                    <input type="text" value={editFormData.projectName || ''} onChange={(e) => setEditFormData({...editFormData, projectName: e.target.value})} />
                  </div>
                  <div className="pm-form-group">
                    <label>Budget (Rs)</label>
                    <input type="number" value={editFormData.budget || ''} onChange={(e) => setEditFormData({...editFormData, budget: e.target.value})} />
                  </div>
                </div>
                <div className="pm-form-group">
                  <label>Timeline</label>
                  <input type="text" value={editFormData.timeline || ''} onChange={(e) => setEditFormData({...editFormData, timeline: e.target.value})} />
                </div>
                <div className="pm-form-group">
                  <label>Scope of Work</label>
                  <textarea value={editFormData.scope || ''} onChange={(e) => setEditFormData({...editFormData, scope: e.target.value})} rows="4" />
                </div>
                <div className="pm-form-group">
                  <label>Deliverables</label>
                  <textarea value={editFormData.deliverables || ''} onChange={(e) => setEditFormData({...editFormData, deliverables: e.target.value})} rows="3" />
                </div>
                <div className="pm-form-group">
                  <label>Payment Terms</label>
                  <input type="text" value={editFormData.paymentTerms || ''} onChange={(e) => setEditFormData({...editFormData, paymentTerms: e.target.value})} />
                </div>
                <div className="pm-form-group">
                  <label>Notes</label>
                  <textarea value={editFormData.notes || ''} onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})} rows="2" />
                </div>
              </div>
              <div className="pm-modal-footer-modern">
                <button className="pm-cancel-btn-modern" onClick={() => { setShowEditModal(false); setEditFormData(null); }}>Cancel</button>
                <button 
                  className="pm-generate-btn-modern" 
                  onClick={updateProposal}
                  disabled={isActionLoading('update')}
                  style={{ opacity: isActionLoading('update') ? 0.7 : 1 }}
                >
                  {isActionLoading('update') ? <Loader2 size={14} className="spin-icon" /> : <Save size={14} />}
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Proposal Modal */}
      <AnimatePresence>
        {showViewModal && selectedProposal && (
          <motion.div className="pm-modal-overlay-modern" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="pm-modal-modern pm-view-modal-modern" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="pm-modal-header-modern">
                <h3><Eye size={18} /> Proposal Details</h3>
                <button className="pm-modal-close-modern" onClick={() => setShowViewModal(false)}><X size={20} /></button>
              </div>
              <div className="pm-modal-body-modern">
                {/* Service Image Banner */}
                <div className="proposal-view-banner">
                  <img src={getServiceImage(selectedProposal.serviceTitle)} alt="" className="proposal-banner-img" />
                  <div className="proposal-banner-overlay">
                    <h4>{selectedProposal.projectName}</h4>
                    <p>{selectedProposal.serviceTitle || 'General Service'}</p>
                  </div>
                </div>

                <div className="pm-view-section-modern">
                  <h4><User size={14} /> Client Information</h4>
                  <div className="pm-view-row-modern">
                    <span className="pm-view-label">Client Name:</span>
                    <span className="pm-view-value">{selectedProposal.clientName || 'N/A'}</span>
                  </div>
                  <div className="pm-view-row-modern">
                    <span className="pm-view-label">Email:</span>
                    <span className="pm-view-value">{selectedProposal.clientEmail || 'N/A'}</span>
                  </div>
                  {selectedProposal.clientPhone && selectedProposal.clientPhone !== 'N/A' && (
                    <div className="pm-view-row-modern">
                      <span className="pm-view-label">Phone:</span>
                      <span className="pm-view-value">{selectedProposal.clientPhone}</span>
                    </div>
                  )}
                </div>

                <div className="pm-view-section-modern">
                  <h4><FileText size={14} /> Project Details</h4>
                  <div className="pm-view-row-modern">
                    <span className="pm-view-label">Project Title:</span>
                    <span className="pm-view-value">{selectedProposal.projectName}</span>
                  </div>
                  <div className="pm-view-row-modern">
                    <span className="pm-view-label">Budget:</span>
                    <span className="pm-view-value budget-modern">Rs {parseInt(selectedProposal.budget).toLocaleString()}</span>
                  </div>
                  <div className="pm-view-row-modern">
                    <span className="pm-view-label">Timeline:</span>
                    <span className="pm-view-value">{selectedProposal.timeline}</span>
                  </div>
                  <div className="pm-view-row-modern">
                    <span className="pm-view-label">Status:</span>
                    <span className="pm-view-value">{getStatusBadge(selectedProposal.status)}</span>
                  </div>
                </div>

                {/* Client Signature Display */}
                {selectedProposal.clientSignature && (
                  <div className="pm-view-section-modern">
                    <h4><PenTool size={14} /> Client Signature</h4>
                    <div className="signature-display">
                      <img src={selectedProposal.clientSignature} alt="Client Signature" />
                      <div className="signature-meta">
                        <p>Signed by: <strong>{selectedProposal.clientSignedBy}</strong></p>
                        <p>Date: {formatDate(selectedProposal.clientSignedAt)}</p>
                        <p>IP: {selectedProposal.clientIpAddress}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Admin Signature Display */}
                {selectedProposal.adminSignature && (
                  <div className="pm-view-section-modern">
                    <h4><PenTool size={14} /> Admin Counter-Signature</h4>
                    <div className="signature-display">
                      <img src={selectedProposal.adminSignature} alt="Admin Signature" />
                      <div className="signature-meta">
                        <p>Signed by: <strong>{selectedProposal.adminSignedBy}</strong></p>
                        <p>Date: {formatDate(selectedProposal.adminSignedAt)}</p>
                        {selectedProposal.adminNotes && <p>Notes: {selectedProposal.adminNotes}</p>}
                      </div>
                    </div>
                  </div>
                )}

                <div className="pm-view-section-modern">
                  <h4><Layers size={14} /> Scope of Work</h4>
                  <div className="pm-view-text-modern">{selectedProposal.scope}</div>
                </div>

                {selectedProposal.deliverables && (
                  <div className="pm-view-section-modern">
                    <h4><Package size={14} /> Deliverables</h4>
                    <div className="pm-view-text-modern">{selectedProposal.deliverables}</div>
                  </div>
                )}

                <div className="pm-view-section-modern">
                  <h4><DollarSign size={14} /> Payment Terms</h4>
                  <div className="pm-view-text-modern">{selectedProposal.paymentTerms}</div>
                </div>

                {selectedProposal.notes && (
                  <div className="pm-view-section-modern">
                    <h4><Info size={14} /> Additional Notes</h4>
                    <div className="pm-view-text-modern">{selectedProposal.notes}</div>
                  </div>
                )}

                {/* Step 6 Data Display */}
                {selectedProposal.aboutUs && (
                  <div className="pm-view-section-modern">
                    <h4><Building size={14} /> About Us</h4>
                    <div className="pm-view-text-modern">{selectedProposal.aboutUs}</div>
                    {selectedProposal.aboutImage && (
                      <div className="about-image-display">
                        <img src={selectedProposal.aboutImage} alt="About Us" />
                      </div>
                    )}
                  </div>
                )}

                {selectedProposal.websiteStructure && selectedProposal.websiteStructure.length > 0 && (
                  <div className="pm-view-section-modern">
                    <h4><Globe size={14} /> Website Structure</h4>
                    <div className="tags-display">
                      {selectedProposal.websiteStructure.map((item, idx) => (
                        <span key={idx} className="tag-display-item">{item}</span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProposal.integrations && selectedProposal.integrations.length > 0 && (
                  <div className="pm-view-section-modern">
                    <h4><Zap size={14} /> Integrations</h4>
                    <div className="tags-display">
                      {selectedProposal.integrations.map((item, idx) => (
                        <span key={idx} className="tag-display-item">{item}</span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProposal.additionalFeatures && selectedProposal.additionalFeatures.length > 0 && (
                  <div className="pm-view-section-modern">
                    <h4><Shield size={14} /> Additional Features</h4>
                    <div className="tags-display">
                      {selectedProposal.additionalFeatures.map((item, idx) => (
                        <span key={idx} className="tag-display-item">{item}</span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProposal.termsAndConditions && (
                  <div className="pm-view-section-modern">
                    <h4><FileText size={14} /> Terms & Conditions</h4>
                    <div className="pm-view-text-modern">{selectedProposal.termsAndConditions}</div>
                  </div>
                )}

                {selectedProposal.thankYouMessage && (
                  <div className="pm-view-section-modern">
                    <h4><CheckCircle size={14} /> Thank You Message</h4>
                    <div className="pm-view-text-modern">{selectedProposal.thankYouMessage}</div>
                  </div>
                )}

                {selectedProposal.milestones && selectedProposal.milestones.length > 0 && (
                  <div className="pm-view-section-modern">
                    <h4><Layers size={14} /> Project Milestones</h4>
                    <div className="milestones-view">
                      {selectedProposal.milestones.map((m, idx) => (
                        <div key={idx} className="milestone-view-item">
                          <div className="milestone-view-header">
                            <span className="milestone-view-number">{idx + 1}</span>
                            <span className="milestone-view-name">{m.name}</span>
                            <span className="milestone-view-percentage">{m.percentage}%</span>
                          </div>
                          <div className="milestone-view-bar">
                            <div className="milestone-view-progress" style={{ width: `${m.percentage}%` }}></div>
                          </div>
                          <span className="milestone-view-duration">{m.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pm-view-section-modern">
                  <h4><Calendar size={14} /> Proposal Information</h4>
                  <div className="pm-view-row-modern">
                    <span className="pm-view-label">Created:</span>
                    <span className="pm-view-value">{formatDate(selectedProposal.createdAt)}</span>
                  </div>
                  {selectedProposal.validUntil && (
                    <div className="pm-view-row-modern">
                      <span className="pm-view-label">Valid Until:</span>
                      <span className="pm-view-value">{formatDate(selectedProposal.validUntil)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="pm-modal-footer-modern">
                <button className="pm-cancel-btn-modern" onClick={() => setShowViewModal(false)}>Close</button>
                <button 
                  className="pm-generate-btn-modern" 
                  onClick={() => downloadProposal(selectedProposal)}
                  disabled={isActionLoading(`download_${selectedProposal._id}`)}
                  style={{ opacity: isActionLoading(`download_${selectedProposal._id}`) ? 0.7 : 1 }}
                >
                  {isActionLoading(`download_${selectedProposal._id}`) ? <Loader2 size={14} className="spin-icon" /> : <Download size={14} />}
                  Download PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Counter-Sign Modal */}
      <AnimatePresence>
        {showAdminSignModal && selectedProposal && (
          <motion.div className="pm-modal-overlay-modern" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="pm-modal-modern signature-modal" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="pm-modal-header-modern">
                <h3><PenTool size={18} /> Admin Counter-Signature</h3>
                <button className="pm-modal-close-modern" onClick={() => setShowAdminSignModal(false)}><X size={20} /></button>
              </div>
              <div className="pm-modal-body-modern">
                <p className="signature-intro">Client has signed the proposal. Please counter-sign to finalize the agreement.</p>
                <p><strong>Client:</strong> {selectedProposal.clientName}</p>
                <p><strong>Project:</strong> {selectedProposal.projectName}</p>

                {selectedProposal.clientSignature && (
                  <div className="client-signature-preview">
                    <p><strong>Client Signature:</strong></p>
                    <img src={selectedProposal.clientSignature} alt="Client Signature" style={{ maxWidth: '200px', maxHeight: '60px', border: '1px solid #e2e8f0' }} />
                    <p><small>Signed on: {formatDate(selectedProposal.clientSignedAt)}</small></p>
                  </div>
                )}

                <div className="signature-type-selector">
                  <button className={adminSignatureType === 'draw' ? 'active' : ''} onClick={() => setAdminSignatureType('draw')}>
                    <PenTool size={14} /> Draw
                  </button>
                  <button className={adminSignatureType === 'type' ? 'active' : ''} onClick={() => setAdminSignatureType('type')}>
                    <Type size={14} /> Type
                  </button>
                </div>

                {adminSignatureType === 'draw' && (
                  <div className="signature-canvas-container">
                    <canvas
                      ref={adminCanvasRef}
                      width={400}
                      height={150}
                      onMouseDown={startAdminDrawing}
                      onMouseMove={drawAdmin}
                      onMouseUp={stopAdminDrawing}
                      onMouseLeave={stopAdminDrawing}
                      style={{ border: '2px dashed #e2e8f0', cursor: 'crosshair', background: 'white' }}
                    />
                    <button className="clear-signature-btn" onClick={clearAdminSignature}><Trash2 size={14} /> Clear</button>
                  </div>
                )}

                {adminSignatureType === 'type' && (
                  <div className="signature-type-container">
                    <input 
                      type="text" 
                      value={adminTypedSignature}
                      onChange={(e) => setAdminTypedSignature(e.target.value)}
                      placeholder="Type your full name"
                      className="signature-type-input"
                    />
                    {adminTypedSignature && (
                      <div className="signature-preview">
                        <p style={{ fontFamily: '"Brush Script MT", cursive', fontSize: '24px', color: '#1d2e2a' }}>
                          {adminTypedSignature}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="pm-form-group">
                  <label>Internal Notes (Optional)</label>
                  <textarea 
                    value={adminSignatureNotes}
                    onChange={(e) => setAdminSignatureNotes(e.target.value)}
                    rows="2"
                    placeholder="Add any internal notes about this counter-signature..."
                  />
                </div>

                <div className="signature-terms">
                  <p><Info size={12} /> By counter-signing, you confirm that you have reviewed the client's signature and approve the proposal.</p>
                </div>
              </div>
              <div className="pm-modal-footer-modern">
                <button className="pm-cancel-btn-modern" onClick={() => setShowAdminSignModal(false)}>Cancel</button>
                <button 
                  className="pm-generate-btn-modern" 
                  onClick={adminSignProposal}
                  disabled={isActionLoading('adminSign')}
                  style={{ opacity: isActionLoading('adminSign') ? 0.7 : 1 }}
                >
                  {isActionLoading('adminSign') ? <Loader2 size={14} className="spin-icon" /> : <Check size={14} />}
                  Confirm Counter-Signature
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Client View Modal - Interactive Proposal */}
      <AnimatePresence>
        {showClientView && selectedProposal && (
          <motion.div className="pm-modal-overlay-modern client-view-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="pm-modal-modern client-proposal-modal" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="client-proposal-header">
                <div className="company-branding">
                  <div className="company-logo"><Layers size={28} /></div>
                  <div>
                    <h2>ANAX TECHNOLOGIES</h2>
                    <p>Professional Software Solutions</p>
                  </div>
                </div>
                <div className="proposal-meta">
                  <span className="proposal-number">Proposal #{selectedProposal._id?.slice(-6)}</span>
                  <span className="proposal-date">{formatDate(selectedProposal.createdAt)}</span>
                </div>
              </div>
              <div className="client-proposal-body">
                <div className="proposal-hero">
                  <img src={getServiceImage(selectedProposal.serviceTitle)} alt="" className="proposal-hero-img" />
                  <h1>{selectedProposal.projectName}</h1>
                  <p className="proposal-subtitle">Prepared exclusively for {selectedProposal.clientName}</p>
                </div>
                <div className="proposal-section">
                  <h3><FileText size={16} /> Project Overview</h3>
                  <p>{selectedProposal.scope}</p>
                </div>
                <div className="proposal-section">
                  <h3><DollarSign size={16} /> Investment</h3>
                  <div className="pricing-card">
                    <div className="price-amount">Rs {parseInt(selectedProposal.budget).toLocaleString()}</div>
                    <div className="price-terms">{selectedProposal.paymentTerms}</div>
                  </div>
                </div>
                <div className="proposal-section">
                  <h3><Clock size={16} /> Timeline</h3>
                  <div className="timeline-visual">
                    {selectedProposal.milestones?.map((m, idx) => (
                      <div key={idx} className="timeline-step">
                        <div className="step-dot"></div>
                        <div className="step-content">
                          <span className="step-name">{m.name}</span>
                          <span className="step-duration">{m.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {selectedProposal.validUntil && (
                  <div className="expiry-notice">
                    <Clock size={16} /> This proposal is valid until {formatDate(selectedProposal.validUntil)}
                  </div>
                )}
              </div>
              <div className="client-proposal-footer">
                <button className="btn-decline" onClick={() => { setShowClientView(false); setShowNegotiation(true); }}>
                  <MessageSquare size={16} /> Negotiate
                </button>
                <button className="btn-accept" onClick={() => { setShowClientView(false); setShowSignatureModal(true); }}>
                  <CheckCircle size={16} /> Accept & Sign
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Negotiation Modal */}
      <AnimatePresence>
        {showNegotiation && (
          <motion.div className="pm-modal-overlay-modern" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="pm-modal-modern" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="pm-modal-header-modern">
                <h3><MessageSquare size={18} /> Negotiation</h3>
                <button className="pm-modal-close-modern" onClick={() => setShowNegotiation(false)}><X size={20} /></button>
              </div>
              <div className="pm-modal-body-modern">
                <p>Send a message to discuss terms, pricing, or timeline adjustments.</p>
                <textarea 
                  value={negotiationMessage}
                  onChange={(e) => setNegotiationMessage(e.target.value)}
                  rows="4"
                  placeholder="Enter your negotiation message..."
                />
              </div>
              <div className="pm-modal-footer-modern">
                <button className="pm-cancel-btn-modern" onClick={() => setShowNegotiation(false)}>Cancel</button>
                <button 
                  className="pm-generate-btn-modern" 
                  onClick={handleNegotiation}
                  disabled={isActionLoading('negotiate')}
                  style={{ opacity: isActionLoading('negotiate') ? 0.7 : 1 }}
                >
                  {isActionLoading('negotiate') ? <Loader2 size={14} className="spin-icon" /> : <Send size={14} />}
                  Send Message
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProposalsManager;
