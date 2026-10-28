import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import './RequirementsTab.css';

const API_URL = 'https://anax-inventions.onrender.com/api';

const RequirementsTab = ({ project, onUpdate }) => {
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [existingReq, setExistingReq] = useState(null);
  const [allRequirements, setAllRequirements] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [hoveredService, setHoveredService] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showViewRequirements, setShowViewRequirements] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState(null);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [currencySymbol, setCurrencySymbol] = useState('₨');

  const [clientInfo, setClientInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: ''
  });

  const [commonData, setCommonData] = useState({
    projectName: '',
    projectGoal: '',
    budget: '',
    timeline: '',
    referenceLink: '',
    additionalInfo: ''
  });

  const [dynamicFields, setDynamicFields] = useState({});

  // ✅ Status Configuration
  const getStatusConfig = (status) => {
    const configs = {
      submitted: { label: 'Pending', className: 'status-pending' },
      pending: { label: 'Pending', className: 'status-pending' },
      reviewing: { label: 'Under Review', className: 'status-reviewing' },
      proposal_sent: { label: 'Proposal Sent', className: 'status-proposal' },
      approved: { label: 'Approved', className: 'status-approved' },
      rejected: { label: 'Rejected', className: 'status-rejected' },
      request_info: { label: 'Info Required', className: 'status-info-requested' }
    };
    return configs[status] || configs.submitted;
  };

  // Format field name
  const formatFieldName = (key) => {
    const labels = {
      businessPurpose: 'Business Purpose',
      targetAudience: 'Target Audience',
      uniqueSellingPoints: 'Unique Selling Points',
      scopeOfWork: 'Scope of Work',
      frontendTech: 'Frontend Technology',
      backendTech: 'Backend Technology',
      database: 'Database Preference',
      cms: 'Content Management System',
      thirdPartyIntegrations: 'Third Party Integrations',
      pages: 'Number of Pages',
      features: 'Key Features',
      responsive: 'Responsive Design',
      performanceSecurity: 'Performance & Security',
      seoRequirements: 'SEO Requirements',
      brandGuidelines: 'Brand Guidelines',
      designInspiration: 'Design Inspiration',
      specificRequirements: 'Specific Requirements',
      preferredTechnology: 'Preferred Technology',
      specialFeatures: 'Special Features'
    };
    return labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  // ✅ Submit additional info response to admin (FIXED)
  const submitAdditionalInfo = async (requirementId) => {
    const textarea = document.getElementById(`response-${requirementId}`);
    const additionalInfo = textarea?.value;
    
    if (!additionalInfo || !additionalInfo.trim()) {
      Swal.fire('Error', 'Please enter your response before submitting', 'error');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/client/requirements/${requirementId}/respond-info`, {
        additionalInfo: additionalInfo,
        status: 'submitted'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      Swal.fire({
        title: 'Response Sent!',
        text: 'Thank you for providing additional information. Admin will review it shortly.',
        icon: 'success',
        confirmButtonColor: '#cc7722'
      });
      
      fetchAllClientRequirements();
      
    } catch (err) {
      console.error('Error submitting response:', err);
      Swal.fire('Error', 'Failed to send response', 'error');
    }
  };

  // Currency Detection
  useEffect(() => {
    const detectCurrency = async () => {
      try {
        const res = await axios.get('https://ipapi.co/json/', { timeout: 5000 });
        if (res.data.country_code === 'PK') {
          setCurrencySymbol('₨');
        } else {
          setCurrencySymbol('₨');
        }
      } catch (err) {
        setCurrencySymbol('₨');
      }
    };
    detectCurrency();
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setClientInfo({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || ''
      });
    }
    fetchAllServices();
    fetchAllClientRequirements();
    if (project && project._id) {
      fetchExistingRequirements();
    }
  }, [project]);

  const fetchAllServices = async () => {
    try {
      const res = await axios.get(`${API_URL}/services?limit=100`);
      const servicesList = res.data.services || [];
      setServices([...servicesList, {
        _id: 'other',
        title: 'Other Service',
        subtitle: 'Tell us about your custom requirement',
        image: null,
        isActive: true
      }]);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    }
    setLoadingServices(false);
  };

  const fetchExistingRequirements = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!project?._id) return;
      const res = await axios.get(`${API_URL}/client/requirements/${project._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.requirements) {
        setExistingReq(res.data.requirements);
      }
    } catch (err) {
      console.log('No existing requirements');
    }
  };

  const fetchAllClientRequirements = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setAllRequirements([]);
        return;
      }

      const res = await axios.get(`${API_URL}/client/requirements/all-requirements`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.requirements && res.data.requirements.length > 0) {
        setAllRequirements(res.data.requirements);
      } else {
        setAllRequirements([]);
      }
    } catch (err) {
      console.error('Error fetching requirements:', err);
      setAllRequirements([]);
    }
  };

  const handleClientInfoChange = (e) => {
    setClientInfo({ ...clientInfo, [e.target.name]: e.target.value });
  };

  const handleCommonChange = (e) => {
    setCommonData({ ...commonData, [e.target.name]: e.target.value });
  };

  const handleDynamicChange = (e) => {
    setDynamicFields({ ...dynamicFields, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (fieldName, value) => {
    const currentValues = dynamicFields[fieldName] || [];
    if (currentValues.includes(value)) {
      setDynamicFields({
        ...dynamicFields,
        [fieldName]: currentValues.filter(v => v !== value)
      });
    } else {
      setDynamicFields({
        ...dynamicFields,
        [fieldName]: [...currentValues, value]
      });
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setDynamicFields({});
    setShowForm(true);
    setTimeout(() => {
      document.querySelector('.requirements-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleBackToServices = () => {
    setShowForm(false);
    setSelectedService(null);
    setExistingReq(null);
    setEditingRequirement(null);
  };

  const handleServiceHover = (service, e) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredService({ service, rect });
  };

  const handleServiceLeave = () => {
    const timeout = setTimeout(() => setHoveredService(null), 200);
    setHoverTimeout(timeout);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    Swal.fire({
      title: 'Uploading files...',
      text: 'Please wait',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    setUploading(true);
    const uploadedUrls = [];

    for (const file of files) {
      if (file.size > 50 * 1024 * 1024) {
        continue;
      }

      try {
        const reader = new FileReader();
        const fileData = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });

        uploadedUrls.push({
          name: file.name,
          url: fileData,
          size: file.size,
          type: file.type,
          uploadedAt: new Date()
        });
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }

    Swal.close();
    setUploading(false);

    if (uploadedUrls.length > 0) {
      setUploadedFiles([...uploadedFiles, ...uploadedUrls]);
      Swal.fire({
        icon: 'success',
        title: 'Upload Successful',
        text: `${uploadedUrls.length} file(s) uploaded`,
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  const removeFile = (index) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };

  const validateForm = () => {
    if (!selectedService) {
      Swal.fire('Error', 'Please select a service type', 'error');
      return false;
    }
    if (!commonData.projectName?.trim()) {
      Swal.fire('Error', 'Please enter project name', 'error');
      return false;
    }
    if (!commonData.projectGoal?.trim()) {
      Swal.fire('Error', 'Please describe your project goal', 'error');
      return false;
    }
    if (!commonData.budget?.trim()) {
      Swal.fire('Error', 'Please enter your budget', 'error');
      return false;
    }
    if (!commonData.timeline) {
      Swal.fire('Error', 'Please select timeline', 'error');
      return false;
    }
    return true;
  };

  const openViewRequirements = async () => {
    await fetchAllClientRequirements();
    setShowViewRequirements(true);
  };

  const closeViewRequirements = () => {
    setShowViewRequirements(false);
    setSelectedRequirement(null);
    setShowDetailModal(false);
  };

  const openDetailModal = (req) => {
    setSelectedRequirement(req);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedRequirement(null);
  };

  const editRequirement = (req) => {
    setEditingRequirement(req);
    setSelectedService(req.selectedService);
    setCommonData({
      projectName: req.commonData?.projectName || '',
      projectGoal: req.commonData?.projectGoal || '',
      budget: req.commonData?.budget || '',
      timeline: req.commonData?.timeline || '',
      referenceLink: req.commonData?.referenceLink || '',
      additionalInfo: req.commonData?.additionalInfo || ''
    });
    setDynamicFields(req.dynamicFields || {});
    setUploadedFiles(req.attachments || []);
    setShowForm(true);
    closeViewRequirements();

    Swal.fire({
      title: 'Edit Mode',
      text: 'You can now edit and resubmit your requirements.',
      icon: 'info',
      timer: 2000,
      showConfirmButton: false
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');

      let finalProjectId = project?._id;

      if (!finalProjectId) {
        finalProjectId = null;
      }

      const submitData = {
        projectId: finalProjectId,
        selectedService: {
          id: selectedService._id,
          title: selectedService.title,
          subtitle: selectedService.subtitle,
          image: selectedService.image
        },
        clientInfo,
        commonData: { ...commonData, currency: currencySymbol },
        dynamicFields,
        attachments: uploadedFiles,
        status: 'submitted',
        submittedAt: new Date(),
        isEdited: !!editingRequirement,
        originalId: editingRequirement?._id
      };

      await axios.post(`${API_URL}/client/requirements`, submitData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchAllClientRequirements();

      await Swal.fire({
        title: editingRequirement ? 'Requirements Updated!' : 'Thank You!',
        html: `
          <div style="text-align: center; padding: 10px;">
            <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #cc7722, #e0882e); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
              <span style="font-size: 35px; color: white;">✓</span>
            </div>
            <h3 style="color: #cc7722; margin: 15px 0 10px;">${editingRequirement ? 'Requirements Updated!' : 'Requirements Submitted!'}</h3>
            <p>Dear <strong>${clientInfo.fullName}</strong></p>
            <p>Your requirements for <strong>"${commonData.projectName}"</strong> have been ${editingRequirement ? 'updated' : 'received'}.</p>
            <div style="background: #f8f9fa; border-radius: 12px; padding: 12px; margin: 15px 0; text-align: left;">
              <p><strong>Status:</strong> <span style="color: #cc7722;">Pending Review</span></p>
              <p><strong>Response Time:</strong> Within 24 hours</p>
              <p><strong>Confirmation Email:</strong> ${clientInfo.email}</p>
            </div>
            <p style="font-size: 12px; color: #888;">Click "View My Requirements" to see all your submissions.</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'View My Requirements',
        confirmButtonColor: '#cc7722',
        showCancelButton: true,
        cancelButtonText: 'Submit Another',
        cancelButtonColor: '#6c757d'
      }).then((result) => {
        if (result.isConfirmed) {
          openViewRequirements();
        }
      });

      setUploadedFiles([]);
      setCommonData({
        projectName: '',
        projectGoal: '',
        budget: '',
        timeline: '',
        referenceLink: '',
        additionalInfo: ''
      });
      setDynamicFields({});
      setEditingRequirement(null);
      setShowForm(false);
      setSelectedService(null);

      if (onUpdate) onUpdate();

    } catch (err) {
      console.error('Submit error:', err);
      Swal.fire('Error', err.response?.data?.message || 'Failed to submit', 'error');
    }
    setSubmitting(false);
  };

  const getProjectGoalPlaceholder = () => {
    if (!selectedService) return "Describe your project...";
    const title = selectedService.title.toLowerCase();
    if (title.includes('web')) return "Example: Modern website for my clothing brand with online store, shopping cart, and payment gateway";
    if (title.includes('mobile')) return "Example: Food delivery application for iOS and Android with real-time tracking";
    if (title.includes('ecommerce')) return "Example: Online store to sell handmade jewelry worldwide with inventory management";
    if (title.includes('marketing')) return "Example: Increase brand awareness and generate leads through social media campaigns";
    return "Describe your project in detail...";
  };

  const getTimelineOptions = () => [
    'ASAP (2-3 weeks)', '1 month', '2 months', '3 months', '4-6 months', '6+ months', 'Flexible'
  ];

  const getDynamicFields = () => {
    if (!selectedService || selectedService._id === 'other') return [];
    const title = selectedService.title.toLowerCase();

    if (title.includes('web') || title.includes('website')) {
      return [
        { name: 'businessPurpose', label: 'Business Purpose', type: 'select', options: ['E-commerce Sales', 'Lead Generation', 'Brand Awareness', 'Informational/Blog', 'Portfolio', 'Booking/Reservation System', 'Membership/Subscription Site', 'Other'], required: false },
        { name: 'targetAudience', label: 'Target Audience', type: 'textarea', placeholder: 'Describe your ideal website visitors', required: false },
        { name: 'uniqueSellingPoints', label: 'Unique Selling Points (USPs)', type: 'textarea', placeholder: 'What makes your business different from competitors?', required: false },
        { name: 'scopeOfWork', label: 'Scope of Work', type: 'select', options: ['New Build from Scratch', 'Redesign of Existing Website', 'Feature Update/Enhancement', 'Migration to New Platform', 'Maintenance & Support'], required: false },
        { name: 'frontendTech', label: 'Frontend Technology', type: 'select', options: ['React.js', 'Next.js', 'Vue.js', 'Angular', 'HTML/CSS/JS', 'No Preference', 'Other'], required: false },
        { name: 'backendTech', label: 'Backend Technology', type: 'select', options: ['Node.js', 'Python/Django', 'PHP/Laravel', 'Java/Spring', 'WordPress', 'Shopify', 'No Preference', 'Other'], required: false },
        { name: 'database', label: 'Database Preference', type: 'select', options: ['MongoDB', 'PostgreSQL', 'MySQL', 'Firebase', 'Not Sure', 'None Required'], required: false },
        { name: 'features', label: 'Key Features Needed', type: 'checkbox-group', options: ['User Login/Signup', 'Admin Dashboard', 'Payment Gateway Integration', 'Contact Form', 'SEO Optimization', 'Multi-language Support'], required: false }
      ];
    }

    if (title.includes('mobile') || title.includes('app')) {
      return [
        { name: 'appPurpose', label: 'App Purpose/Business Goal', type: 'textarea', placeholder: 'What problem will this app solve?', required: false },
        { name: 'targetAudience', label: 'Target Audience', type: 'textarea', placeholder: 'Describe your ideal app users', required: false },
        { name: 'platform', label: 'Target Platform', type: 'select', options: ['iOS Only', 'Android Only', 'Both iOS & Android', 'Cross-platform'], required: false },
        { name: 'features', label: 'Core Features Required', type: 'checkbox-group', options: ['Push Notifications', 'In-App Purchases', 'GPS/Location', 'Chat/Messaging', 'Payment Gateway'], required: false }
      ];
    }

    return [
      { name: 'specificRequirements', label: 'Specific Requirements', type: 'textarea', placeholder: 'Please describe your requirements in detail', required: false },
      { name: 'timeline', label: 'Expected Timeline', type: 'select', options: ['Urgent (<2 weeks)', 'Standard (1-2 months)', 'Flexible', '3+ months'], required: false },
      { name: 'budget', label: 'Budget Range', type: 'text', placeholder: 'e.g., 50,000 - 100,000', required: false }
    ];
  };

  const renderDynamicField = (field) => {
    const isRequired = field.required === true;

    switch (field.type) {
      case 'text':
        return (
          <div className="dynamic-field" key={field.name}>
            <label>{field.label} {isRequired && <span className="required-star">*</span>}</label>
            <input type="text" name={field.name} value={dynamicFields[field.name] || ''} onChange={handleDynamicChange} placeholder={field.placeholder} />
          </div>
        );
      case 'textarea':
        return (
          <div className="dynamic-field" key={field.name}>
            <label>{field.label} {isRequired && <span className="required-star">*</span>}</label>
            <textarea name={field.name} value={dynamicFields[field.name] || ''} onChange={handleDynamicChange} placeholder={field.placeholder} rows="3" />
          </div>
        );
      case 'select':
        return (
          <div className="dynamic-field" key={field.name}>
            <label>{field.label} {isRequired && <span className="required-star">*</span>}</label>
            <select name={field.name} value={dynamicFields[field.name] || ''} onChange={handleDynamicChange}>
              <option value="">Select {field.label}</option>
              {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        );
      case 'checkbox-group':
        return (
          <div className="dynamic-field" key={field.name}>
            <label>{field.label} {isRequired && <span className="required-star">*</span>}</label>
            <div className="checkbox-group">
              {field.options.map(opt => (
                <label key={opt} className="checkbox-label">
                  <input type="checkbox" checked={(dynamicFields[field.name] || []).includes(opt)} onChange={() => handleArrayChange(field.name, opt)} />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getRequirementForService = (serviceId) => {
    const currentService = services.find(s => s._id === serviceId);
    if (!currentService) return null;
    return allRequirements.find(req => req.selectedService?.title === currentService.title);
  };

  const renderDetailSection = (title, children) => (
    <div className="detail-section" key={title}>
      <div className="detail-section-header">
        <span className="detail-section-icon">◆</span>
        <h4>{title}</h4>
      </div>
      <div className="detail-section-body">
        {children}
      </div>
    </div>
  );

  const renderRequirementDetailModal = () => {
    if (!selectedRequirement) return null;
    const req = selectedRequirement;
    const statusConfig = getStatusConfig(req.status);

    return (
      <div className="modal-overlay detail-modal-overlay" onClick={closeDetailModal}>
        <motion.div
          className="detail-modal"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="detail-modal-header">
            <div className="detail-modal-title">
              <span className="detail-modal-icon">◆</span>
              <div>
                <h3>{req.selectedService?.title || 'Requirement Details'}</h3>
                <span className="detail-modal-project">{req.commonData?.projectName}</span>
              </div>
            </div>
            <button className="detail-modal-close" onClick={closeDetailModal}>✕</button>
          </div>

          <div className="detail-modal-body">
            {/* Status Banner */}
            <div className={`status-banner ${statusConfig.className}`}>
              <div className="status-banner-content">
                <span className="status-banner-label">{statusConfig.label}</span>
                <span className="status-banner-date">Submitted: {new Date(req.submittedAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* ✅ REJECTION REASON BANNER - FIXED */}
            {req.status === 'rejected' && req.rejectionReason && (
              <div className="rejection-banner-detail">
                <div className="rejection-header-detail">
                  <span className="rejection-icon-detail">❌</span>
                  <span className="rejection-title-detail">Rejection Reason</span>
                </div>
                <div className="rejection-content-detail">
                  <strong>Message from Admin:</strong>
                  <p>{req.rejectionReason}</p>
                </div>
              </div>
            )}

            {/* ✅ REQUEST INFO BANNER WITH RESPONSE SYSTEM - FIXED */}
            {req.status === 'request_info' && req.requestedInfo && (
              <div className="request-info-banner-detail">
                <div className="request-info-header-detail">
                  <span className="request-info-icon-detail">❓</span>
                  <span className="request-info-title-detail">Additional Information Required</span>
                </div>
                <div className="request-info-content-detail">
                  <strong>Message from Admin:</strong>
                  <p>{req.requestedInfo}</p>
                </div>
                <div className="request-info-response-detail">
                  <label>Your Response:</label>
                  <textarea 
                    id={`response-${req._id}`}
                    placeholder="Please provide the requested information here..."
                    rows="3"
                  />
                  <button 
                    className="submit-response-btn"
                    onClick={() => submitAdditionalInfo(req._id)}
                  >
                    Send Response
                  </button>
                </div>
              </div>
            )}

            {/* Service Info */}
            {renderDetailSection('Service Information', (
              <>
                <div className="detail-row"><span className="detail-label">Service Type</span><span className="detail-value">{req.selectedService?.title || 'N/A'}</span></div>
                <div className="detail-row"><span className="detail-label">Description</span><span className="detail-value">{req.selectedService?.subtitle || 'N/A'}</span></div>
              </>
            ))}

            {/* Client Info */}
            {renderDetailSection('Client Information', (
              <>
                <div className="detail-row"><span className="detail-label">Full Name</span><span className="detail-value">{req.clientInfo?.fullName || 'N/A'}</span></div>
                <div className="detail-row"><span className="detail-label">Email</span><span className="detail-value detail-email">{req.clientInfo?.email || 'N/A'}</span></div>
                <div className="detail-row"><span className="detail-label">Phone</span><span className="detail-value">{req.clientInfo?.phone || 'N/A'}</span></div>
                <div className="detail-row"><span className="detail-label">Company</span><span className="detail-value">{req.clientInfo?.company || 'N/A'}</span></div>
              </>
            ))}

            {/* Project Details */}
            {renderDetailSection('Project Details', (
              <>
                <div className="detail-row"><span className="detail-label">Project Name</span><span className="detail-value highlight">{req.commonData?.projectName || 'N/A'}</span></div>
                <div className="detail-row detail-row-block"><span className="detail-label">Project Goal</span><span className="detail-value detail-block">{req.commonData?.projectGoal || 'N/A'}</span></div>
                <div className="detail-row"><span className="detail-label">Budget</span><span className="detail-value highlight">{req.commonData?.currency || '₨'} {req.commonData?.budget || 'N/A'}</span></div>
                <div className="detail-row"><span className="detail-label">Timeline</span><span className="detail-value">{req.commonData?.timeline || 'N/A'}</span></div>
                <div className="detail-row"><span className="detail-label">Reference</span><span className="detail-value detail-link">{req.commonData?.referenceLink ? <a href={req.commonData.referenceLink} target="_blank" rel="noopener noreferrer">{req.commonData.referenceLink}</a> : 'N/A'}</span></div>
              </>
            ))}

            {/* Dynamic Fields */}
            {req.dynamicFields && Object.keys(req.dynamicFields).length > 0 && (
              renderDetailSection('Service-Specific Requirements', (
                Object.entries(req.dynamicFields).map(([key, value]) => {
                  let displayValue = value;
                  if (Array.isArray(value)) displayValue = value.join(', ');
                  return (
                    <div className="detail-row" key={key}>
                      <span className="detail-label">{formatFieldName(key)}</span>
                      <span className="detail-value">{displayValue || 'N/A'}</span>
                    </div>
                  );
                })
              ))
            )}

            {/* Attachments */}
            {req.attachments && req.attachments.length > 0 && (
              renderDetailSection('Attachments', (
                <div className="detail-attachments">
                  {req.attachments.map((file, i) => (
                    <a key={i} href={file.url} target="_blank" rel="noopener noreferrer" className="detail-attachment-item">
                      <span className="detail-attachment-icon">📎</span>
                      <span className="detail-attachment-name">{file.name}</span>
                      <span className="detail-attachment-size">{(file.size / 1024).toFixed(1)} KB</span>
                    </a>
                  ))}
                </div>
              ))
            )}

            {/* Additional Info */}
            {req.commonData?.additionalInfo && (
              renderDetailSection('Additional Information', (
                <div className="detail-row detail-row-block">
                  <span className="detail-value detail-block">{req.commonData.additionalInfo}</span>
                </div>
              ))
            )}

            {/* Timeline */}
            {renderDetailSection('Timeline & History', (
              <>
                <div className="detail-row"><span className="detail-label">Submitted At</span><span className="detail-value">{new Date(req.submittedAt).toLocaleString()}</span></div>
                <div className="detail-row"><span className="detail-label">Last Updated</span><span className="detail-value">{req.updatedAt ? new Date(req.updatedAt).toLocaleString() : 'N/A'}</span></div>
                {req.isEdited && <div className="detail-row"><span className="detail-label">Edited</span><span className="detail-value detail-edited">Yes (Resubmitted)</span></div>}
              </>
            ))}
          </div>

          <div className="detail-modal-footer">
            <button className="detail-btn-secondary" onClick={closeDetailModal}>Close</button>
            <button className="detail-btn-edit" onClick={() => { closeDetailModal(); editRequirement(req); }}>
              <span>✎</span> Edit Requirement
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  const timelineOptions = getTimelineOptions();
  const dynamicFieldsList = getDynamicFields();

  if (loadingServices) {
    return (
      <div className="requirements-tab">
        <div className="loading-spinner-container">
          <div className="anax-spinner"></div>
          <p className="loading-text">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="requirements-tab">
      <div className="tab-header">
        <h2>Project Requirements</h2>
        <p>Tell us about your project and we'll get back to you within 24 hours</p>
        <span className="time-estimate">Estimated time: 15-20 minutes</span>
      </div>

      <div className="view-req-container">
        <button className="view-req-btn" onClick={openViewRequirements}>
          View My Requirements ({allRequirements.length})
        </button>
      </div>

      <div className="requirements-form">
        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.div
              key="services-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="services-section"
            >
              <div className="form-card">
                <div className="card-header">
                  <span className="header-icon">◆</span>
                  <h3>Select Service Type</h3>
                </div>
                <div className="card-body">
                  <label>What service do you need? *</label>
                  <div className="services-grid">
                    {services.filter(s => s.isActive !== false).map(service => {
                      const reqForService = getRequirementForService(service._id);
                      const statusConfig = reqForService ? getStatusConfig(reqForService.status) : null;

                      return (
                        <button
                          key={service._id}
                          type="button"
                          className={`service-btn ${selectedService?._id === service._id ? 'selected' : ''}`}
                          onClick={() => handleServiceSelect(service)}
                          onMouseEnter={(e) => handleServiceHover(service, e)}
                          onMouseLeave={handleServiceLeave}
                        >
                          <div className="service-img">
                            {service.image ? (
                              <img src={service.image} alt={service.title} />
                            ) : (
                              <div className="service-initial">{service.title.charAt(0)}</div>
                            )}
                          </div>
                          <div className="service-text">
                            <div className="service-title-row">
                              <strong>{service.title}</strong>
                              {reqForService && statusConfig && (
                                <span className={`service-badge ${statusConfig.className}`}>
                                  {statusConfig.label}
                                </span>
                              )}
                            </div>
                            <span>{service.subtitle || 'Click to select'}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form-section"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
              className="form-section-wrapper"
            >
              <button className="back-btn" onClick={handleBackToServices}>← Back to Services</button>

              <div className="selected-service-badge">
                <span>◆</span> Selected: <strong>{selectedService?.title}</strong>
                {editingRequirement && <span className="edit-badge"> (Editing Mode)</span>}
              </div>

              {/* Client Info */}
              <div className="form-card">
                <div className="card-header">
                  <span className="header-icon">◆</span>
                  <h3>Your Information</h3>
                </div>
                <div className="card-body">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input type="text" name="fullName" value={clientInfo.fullName} onChange={handleClientInfoChange} />
                    </div>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input type="email" name="email" value={clientInfo.email} onChange={handleClientInfoChange} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input type="tel" name="phone" value={clientInfo.phone} onChange={handleClientInfoChange} placeholder="+92 XXX XXXXXXX" />
                    </div>
                    <div className="form-group">
                      <label>Company (Optional)</label>
                      <input type="text" name="company" value={clientInfo.company} onChange={handleClientInfoChange} placeholder="Your company name" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="form-card">
                <div className="card-header">
                  <span className="header-icon">◆</span>
                  <h3>Project Details</h3>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label>Project Name *</label>
                    <input type="text" name="projectName" value={commonData.projectName} onChange={handleCommonChange} placeholder="e.g., My Awesome Project" />
                  </div>
                  <div className="form-group">
                    <label>Project Goal / Description *</label>
                    <textarea name="projectGoal" value={commonData.projectGoal} onChange={handleCommonChange} placeholder={getProjectGoalPlaceholder()} rows="4" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Budget ({currencySymbol}) *</label>
                      <input type="text" name="budget" value={commonData.budget} onChange={handleCommonChange} placeholder="e.g., 50,000" />
                    </div>
                    <div className="form-group">
                      <label>Expected Timeline *</label>
                      <select name="timeline" value={commonData.timeline} onChange={handleCommonChange}>
                        <option value="">Select timeline</option>
                        {timelineOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Reference Link (Optional)</label>
                    <input type="url" name="referenceLink" value={commonData.referenceLink} onChange={handleCommonChange} placeholder="https://example.com" />
                  </div>
                </div>
              </div>

              {/* Service Specific Detailed Requirements */}
              {dynamicFieldsList.length > 0 && (
                <div className="form-card">
                  <div className="card-header">
                    <span className="header-icon">◆</span>
                    <h3>{selectedService?.title} - Detailed Requirements</h3>
                  </div>
                  <div className="card-body">
                    {dynamicFieldsList.map(field => renderDynamicField(field))}
                  </div>
                </div>
              )}

              {/* Attachments */}
              <div className="form-card">
                <div className="card-header">
                  <span className="header-icon">◆</span>
                  <h3>Attachments</h3>
                </div>
                <div className="card-body">
                  <div className="upload-area">
                    <input type="file" id="fileUpload" multiple onChange={handleFileUpload} style={{ display: 'none' }} disabled={uploading} />
                    <button type="button" className="upload-btn" onClick={() => document.getElementById('fileUpload').click()} disabled={uploading}>
                      {uploading ? 'Uploading...' : 'Click to Upload Files'}
                    </button>
                    <p className="upload-hint">Supported: PDF, DOC, XLS, Images, ZIP (Max 50MB each)</p>
                  </div>
                  {uploadedFiles.length > 0 && (
                    <div className="file-list">
                      <label>Uploaded Files ({uploadedFiles.length}):</label>
                      {uploadedFiles.map((file, idx) => (
                        <div key={idx} className="file-item">
                          <span className="file-name">{file.name}</span>
                          <a href={file.url} target="_blank" rel="noopener noreferrer" className="file-view">View</a>
                          <button className="file-remove" onClick={() => removeFile(idx)}>Remove</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              <div className="form-card">
                <div className="card-header">
                  <span className="header-icon">◆</span>
                  <h3>Additional Information</h3>
                </div>
                <div className="card-body">
                  <textarea name="additionalInfo" value={commonData.additionalInfo} onChange={handleCommonChange} placeholder="Anything else you'd like us to know?" rows="3" />
                </div>
              </div>

              {/* Actions */}
              <div className="form-actions">
                <button className="preview-btn" onClick={() => setShowPreview(true)}>Preview</button>
                <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Submitting...' : (editingRequirement ? 'Update Requirements' : 'Submit Requirements')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* View Requirements Modal */}
      <AnimatePresence>
        {showViewRequirements && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeViewRequirements}
          >
            <motion.div
              className="view-req-modal"
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div className="modal-header-content">
                  <span className="modal-header-icon">📋</span>
                  <div>
                    <h3>My Requirements</h3>
                    <span className="modal-header-subtitle">{allRequirements.length} submission{allRequirements.length !== 1 ? 's' : ''} found</span>
                  </div>
                </div>
                <button className="modal-close" onClick={closeViewRequirements}>✕</button>
              </div>
              <div className="modal-body">
                {allRequirements.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📄</div>
                    <h3>No Requirements Yet</h3>
                    <p>Select a service and submit your first requirement to get started.</p>
                  </div>
                ) : (
                  <div className="requirements-list-modal">
                    {allRequirements.map((req, idx) => {
                      const statusConfig = getStatusConfig(req.status);
                      return (
                        <motion.div
                          key={idx}
                          className="req-card"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.08, duration: 0.3 }}
                        >
                          <div className="req-card-header">
                            <div className="req-service">
                              <div className="req-service-img">
                                {req.selectedService?.image ? (
                                  <img src={req.selectedService.image} alt="" />
                                ) : (
                                  <span>{req.selectedService?.title?.charAt(0) || '?'}</span>
                                )}
                              </div>
                              <div className="req-service-info">
                                <span className="service-name">{req.selectedService?.title || 'Unknown'}</span>
                                <span className="req-date">{new Date(req.submittedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className={`req-status-badge ${statusConfig.className}`}>
                              <span className="status-text">{statusConfig.label}</span>
                            </div>
                          </div>
                          <div className="req-card-body">
                            <div className="req-info-grid">
                              <div className="req-info-item">
                                <span className="req-info-label">Project</span>
                                <span className="req-info-value">{req.commonData?.projectName || 'N/A'}</span>
                              </div>
                              <div className="req-info-item">
                                <span className="req-info-label">Budget</span>
                                <span className="req-info-value highlight">{req.commonData?.currency || '₨'} {req.commonData?.budget || 'N/A'}</span>
                              </div>
                              <div className="req-info-item">
                                <span className="req-info-label">Timeline</span>
                                <span className="req-info-value">{req.commonData?.timeline || 'N/A'}</span>
                              </div>
                              <div className="req-info-item">
                                <span className="req-info-label">Client</span>
                                <span className="req-info-value">{req.clientInfo?.fullName || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                          <div className="req-card-footer">
                            <button className="view-details" onClick={() => openDetailModal(req)}>
                              <span>🔍</span> View Full Details
                            </button>
                            <button className="edit-req-btn" onClick={() => editRequirement(req)}>
                              <span>✎</span> Edit
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={closeViewRequirements}>Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && renderRequirementDetailModal()}
      </AnimatePresence>

      {/* Hover Preview */}
      <AnimatePresence>
        {hoveredService && !showForm && (
          <motion.div
            className="hover-preview"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            style={{ 
              position: 'fixed', 
              left: Math.min(hoveredService.rect.right + 15, window.innerWidth - 260), 
              top: Math.max(10, Math.min(hoveredService.rect.top, window.innerHeight - 150)),
              zIndex: 1000 
            }}
          >
            <div className="hover-content">
              <h4>{hoveredService.service.title}</h4>
              <p>{hoveredService.service.subtitle || 'Professional service for your needs'}</p>
              <small>Click to select →</small>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      {showPreview && (
        <div className="modal-overlay" onClick={() => setShowPreview(false)}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Preview Requirements</h3>
              <button className="modal-close" onClick={() => setShowPreview(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="preview-block"><strong>Service:</strong> {selectedService?.title}</div>
              <div className="preview-block"><strong>Name:</strong> {clientInfo.fullName}</div>
              <div className="preview-block"><strong>Email:</strong> {clientInfo.email}</div>
              <div className="preview-block"><strong>Project:</strong> {commonData.projectName}</div>
              <div className="preview-block"><strong>Goal:</strong> {commonData.projectGoal?.substring(0, 100)}...</div>
              <div className="preview-block"><strong>Budget:</strong> {currencySymbol} {commonData.budget}</div>
              <div className="preview-block"><strong>Timeline:</strong> {commonData.timeline}</div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowPreview(false)}>Edit</button>
              <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : (editingRequirement ? 'Update' : 'Submit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequirementsTab;