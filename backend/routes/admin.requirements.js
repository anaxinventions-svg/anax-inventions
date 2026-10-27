const express = require('express');
const router = express.Router();
const Requirement = require('../models/Requirement');
const Project = require('../models/Project');
const User = require('../models/User');
const Proposal = require('../models/Proposal'); // ✅ IMPORT ADDED
const { protect, admin } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');

// Helper function to format field labels
function formatFieldLabel(fieldName) {
  const labels = {
    // Web Development
    businessPurpose: '🎯 Business Purpose',
    targetAudience: '👥 Target Audience',
    uniqueSellingPoints: '💎 Unique Selling Points (USPs)',
    scopeOfWork: '📐 Scope of Work',
    frontendTech: '💻 Frontend Technology',
    backendTech: '⚙️ Backend Technology',
    database: '🗄️ Database Preference',
    cms: '📝 Content Management System',
    thirdPartyIntegrations: '🔌 Third Party Integrations',
    pages: '📄 Number of Pages',
    features: '⭐ Key Features Needed',
    responsive: '📱 Responsive Design',
    performanceSecurity: '🔒 Performance & Security',
    seoRequirements: '🔍 SEO Requirements',
    brandGuidelines: '🎨 Brand Guidelines',
    designInspiration: '✨ Design Inspiration',
    
    // Mobile App
    appPurpose: '📱 App Purpose/Business Goal',
    platform: '📲 Target Platform',
    appCategory: '🏷️ App Category',
    userAuthentication: '🔐 User Authentication',
    backendRequirements: '🖥️ Backend Requirements',
    offlineSupport: '📶 Offline Support',
    adminPanel: '👑 Admin Panel Required',
    designPreferences: '🎨 Design Preferences',
    storeSubmission: '📦 App Store Submission',
    
    // E-commerce
    businessType: '🏪 Business Type',
    productCount: '📦 Estimated Products',
    productTypes: '🏷️ Product Types',
    paymentGateways: '💳 Payment Gateways',
    shippingRequirements: '🚚 Shipping Requirements',
    taxConfiguration: '💰 Tax Configuration',
    inventoryManagement: '📊 Inventory Management',
    socialCommerce: '📱 Social Commerce',
    returnsPolicy: '🔄 Returns Management',
    
    // Digital Marketing
    primaryGoal: '🎯 Primary Marketing Goal',
    platforms: '📢 Target Platforms',
    monthlyBudget: '💰 Monthly Ad Budget',
    campaignDuration: '⏰ Campaign Duration',
    existingChannels: '📡 Existing Marketing Channels',
    competitors: '🏆 Key Competitors',
    seoKeywords: '🔑 SEO Keywords',
    contentRequirements: '📝 Content Requirements',
    analytics: '📊 Analytics & Reporting',
    websiteUrl: '🌐 Website URL',
    existingAssets: '🎨 Existing Marketing Assets',
    
    // UI/UX Design
    designType: '🎨 Type of Design',
    projectScope: '📐 Project Scope',
    numberOfScreens: '📱 Number of Screens',
    designTool: '🛠️ Preferred Design Tool',
    colorPreferences: '🎨 Color Preferences',
    typography: '📝 Typography Preferences',
    interactivity: '🖱️ Interactive Prototype',
    responsiveRequirements: '📱 Responsive Requirements',
    deliverables: '📦 Deliverables',
    targetUsers: '👥 Target Users',
    accessibility: '♿ Accessibility Requirements',
    
    // Custom Software
    softwareType: '💻 Software Type',
    userRoles: '👥 User Roles/Permissions',
    coreFeatures: '⭐ Core Features',
    integrations: '🔌 Third Party Integrations',
    technologyPreference: '⚙️ Technology Preference',
    databasePreference: '🗄️ Database Preference',
    deployment: '☁️ Deployment Type',
    dataImport: '📥 Data Migration',
    reporting: '📊 Reporting Requirements',
    security: '🔒 Security Requirements',
    
    // Default
    specificRequirements: '📋 Specific Requirements',
    preferredTechnology: '⚙️ Preferred Technology',
    specialFeatures: '✨ Special Features',
    timeline: '⏰ Expected Timeline',
    budget: '💰 Budget Range',
    details: '📝 Requirement Details',
    projectName: '📌 Project Name',
    projectGoal: '🎯 Project Goal',
    referenceLink: '🔗 Reference Link',
    additionalInfo: '📝 Additional Information'
  };
  
  return labels[fieldName] || fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

// ============================================
// GET ALL REQUIREMENTS (Admin) - WITH FULL DETAILS
// ============================================
router.get('/', protect, admin, async (req, res) => {
  try {
    const requirements = await Requirement.find()
      .sort({ submittedAt: -1 });
    
    console.log(`📋 Total requirements in DB: ${requirements.length}`);
    
    // Enhance with client and project names
    const enhancedRequirements = await Promise.all(requirements.map(async (reqItem) => {
      const project = await Project.findById(reqItem.projectId);
      const client = await User.findById(project?.clientId);
      
      // Extract dynamic fields for summary
      const dynamicFieldsKeys = Object.keys(reqItem.dynamicFields || {});
      const dynamicFieldsValues = Object.values(reqItem.dynamicFields || {});
      
      return {
        ...reqItem.toObject(),
        clientId: client?._id,
        clientName: client?.fullName || 'Unknown Client',
        clientEmail: client?.email || 'Unknown Email',
        clientPhone: client?.phone || 'Not provided',
        clientCompany: client?.company || 'Not provided',
        projectName: project?.name || 'Unknown Project',
        serviceTitle: reqItem.selectedService?.title || 'Unknown Service',
        dynamicFieldsCount: dynamicFieldsKeys.length,
        dynamicFieldsSummary: dynamicFieldsKeys.slice(0, 5).join(', ') + (dynamicFieldsKeys.length > 5 ? '...' : ''),
        attachmentsCount: reqItem.attachments?.length || 0,
        hasAttachments: (reqItem.attachments?.length || 0) > 0,
        isEdited: reqItem.isEdited || false,
        editCount: reqItem.editHistory?.length || 0
      };
    }));
    
    console.log(`✅ Admin fetched ${enhancedRequirements.length} enhanced requirements`);
    
    // Group by service for stats
    const groupedByService = {};
    enhancedRequirements.forEach(req => {
      const service = req.serviceTitle;
      if (!groupedByService[service]) groupedByService[service] = 0;
      groupedByService[service]++;
    });
    
    res.status(200).json({ 
      success: true, 
      count: enhancedRequirements.length,
      requirements: enhancedRequirements,
      groupedByService: groupedByService,
      totalAttachments: enhancedRequirements.reduce((sum, req) => sum + req.attachmentsCount, 0)
    });
  } catch (error) {
    console.error('❌ Fetch requirements error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// GET REQUIREMENTS BY CLIENT (Admin)
// ============================================
router.get('/client/:clientId', protect, admin, async (req, res) => {
  try {
    const { clientId } = req.params;
    
    // Get all projects for this client
    const projects = await Project.find({ clientId });
    const projectIds = projects.map(p => p._id);
    
    // Get all requirements for these projects
    const requirements = await Requirement.find({ 
      projectId: { $in: projectIds } 
    }).sort({ submittedAt: -1 });
    
    const client = await User.findById(clientId);
    
    console.log(`📋 Found ${requirements.length} requirements for client: ${client?.fullName}`);
    
    res.status(200).json({ 
      success: true, 
      count: requirements.length,
      clientName: client?.fullName,
      clientEmail: client?.email,
      requirements: requirements 
    });
  } catch (error) {
    console.error('❌ Fetch client requirements error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// GET REQUIREMENTS BY SERVICE (Admin)
// ============================================
router.get('/service/:serviceName', protect, admin, async (req, res) => {
  try {
    const { serviceName } = req.params;
    
    const requirements = await Requirement.find({ 
      'selectedService.title': { $regex: serviceName, $options: 'i' }
    }).sort({ submittedAt: -1 });
    
    console.log(`📋 Found ${requirements.length} requirements for service: ${serviceName}`);
    
    res.status(200).json({ 
      success: true, 
      count: requirements.length,
      serviceName: serviceName,
      requirements: requirements 
    });
  } catch (error) {
    console.error('❌ Fetch service requirements error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// GET SINGLE REQUIREMENT DETAILS (Admin) - COMPLETE DATA
// ============================================
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const requirement = await Requirement.findById(req.params.id);
    
    if (!requirement) {
      return res.status(404).json({ success: false, message: 'Requirement not found' });
    }
    
    const project = await Project.findById(requirement.projectId);
    const client = await User.findById(project?.clientId);
    
    // Organize dynamic fields for better display
    const dynamicFields = requirement.dynamicFields || {};
    const dynamicFieldsArray = Object.entries(dynamicFields).map(([key, value]) => ({
      fieldName: key,
      fieldLabel: formatFieldLabel(key),
      value: Array.isArray(value) ? value : value,
      valueDisplay: Array.isArray(value) ? value.join(', ') : (typeof value === 'object' ? JSON.stringify(value) : value),
      type: Array.isArray(value) ? 'array' : typeof value
    }));
    
    // Organize attachments
    const attachmentsList = (requirement.attachments || []).map(att => ({
      name: att.name,
      url: att.url,
      size: att.size,
      sizeInMB: (att.size / 1024 / 1024).toFixed(2),
      type: att.type,
      uploadedAt: att.uploadedAt,
      uploadedAtFormatted: new Date(att.uploadedAt).toLocaleString()
    }));
    
    // Edit history with formatted dates
    const editHistoryFormatted = (requirement.editHistory || []).map(edit => ({
      ...edit,
      editedAtFormatted: new Date(edit.editedAt).toLocaleString(),
      editedBy: edit.editedBy || 'Unknown'
    }));
    
    const enhancedRequirement = {
      _id: requirement._id,
      projectId: requirement.projectId,
      projectName: project?.name || 'Unknown Project',
      
      // Client Info
      clientId: client?._id,
      clientName: client?.fullName || 'Unknown Client',
      clientEmail: client?.email || 'Unknown Email',
      clientPhone: client?.phone || 'Not provided',
      clientCompany: client?.company || 'Not provided',
      
      // Selected Service
      selectedService: requirement.selectedService,
      
      // Client Info from form
      clientInfo: requirement.clientInfo,
      
      // Common Data
      commonData: requirement.commonData,
      
      // Dynamic Fields (ALL)
      dynamicFields: dynamicFields,
      dynamicFieldsArray: dynamicFieldsArray,
      dynamicFieldsCount: dynamicFieldsArray.length,
      
      // Attachments
      attachments: requirement.attachments,
      attachmentsList: attachmentsList,
      attachmentsCount: attachmentsList.length,
      
      // Status
      status: requirement.status,
      adminNote: requirement.adminNote || '',
      
      // Edit tracking
      isEdited: requirement.isEdited || false,
      editHistory: requirement.editHistory,
      editHistoryFormatted: editHistoryFormatted,
      editCount: editHistoryFormatted.length,
      
      // Proposal Data
      proposalData: requirement.proposalData,
      
      // Timestamps
      submittedAt: requirement.submittedAt,
      submittedAtFormatted: new Date(requirement.submittedAt).toLocaleString(),
      updatedAt: requirement.updatedAt,
      updatedAtFormatted: new Date(requirement.updatedAt).toLocaleString(),
      
      // Raw data for debugging
      rawData: requirement.toObject()
    };
    
    console.log(`📋 Admin viewed requirement ${req.params.id}`);
    console.log(`   - Service: ${requirement.selectedService?.title}`);
    console.log(`   - Dynamic fields: ${dynamicFieldsArray.length}`);
    console.log(`   - Attachments: ${attachmentsList.length}`);
    console.log(`   - Edit count: ${editHistoryFormatted.length}`);
    
    res.status(200).json({ 
      success: true, 
      requirement: enhancedRequirement 
    });
  } catch (error) {
    console.error('❌ Fetch requirement error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// UPDATE REQUIREMENT STATUS (Admin)
// ============================================
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    
    const requirement = await Requirement.findById(req.params.id);
    
    if (!requirement) {
      return res.status(404).json({ success: false, message: 'Requirement not found' });
    }
    
    const oldStatus = requirement.status;
    
    requirement.status = status;
    if (adminNote !== undefined) requirement.adminNote = adminNote;
    requirement.updatedAt = new Date();
    
    await requirement.save();
    
    // Get client for notification
    const project = await Project.findById(requirement.projectId);
    const client = await User.findById(project?.clientId);
    
    // Send email notification to client
    if (client && client.email && status !== oldStatus) {
      const statusMessages = {
        reviewing: 'Your requirements are now under review by our team.',
        approved: 'Great news! Your requirements have been approved.',
        rejected: 'Unfortunately, your requirements were not approved at this time.',
        proposal_sent: 'A proposal has been sent to your email. Please check your inbox.'
      };
      
      const statusMessage = statusMessages[status] || `Your requirement status has been updated to: ${status}`;
      
      await sendEmail({
        to: client.email,
        subject: `Requirement Status Update: ${requirement.commonData?.projectName || 'Your Project'}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Status Update - Anax Inventions</title>
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; padding: 30px; }
              .container { max-width: 550px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #1d2e2a 0%, #2a463f 100%); padding: 25px; text-align: center; }
              .header h2 { color: #cc7722; margin: 0; font-family: 'Playfair Display', serif; }
              .body { padding: 25px; }
              .status-box { background: #f8f9fa; border-radius: 12px; padding: 15px; margin: 20px 0; border-left: 4px solid #cc7722; }
              .btn { display: inline-block; background: #cc7722; color: white; padding: 10px 25px; text-decoration: none; border-radius: 30px; margin-top: 15px; }
              .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 11px; color: #999; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>ANAX INVENTIONS</h2>
                <p style="color: rgba(255,255,255,0.7); margin: 5px 0 0;">Status Update</p>
              </div>
              <div class="body">
                <h3>Dear ${client.fullName},</h3>
                <p>${statusMessage}</p>
                <div class="status-box">
                  <p><strong>📋 Project:</strong> ${requirement.commonData?.projectName}</p>
                  <p><strong>📌 Status:</strong> <span style="color: #cc7722; font-weight: bold;">${status}</span></p>
                  ${adminNote ? `<p><strong>📝 Admin Note:</strong> ${adminNote}</p>` : ''}
                </div>
                <p>Login to your dashboard to view full details.</p>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/client-dashboard" class="btn">View Dashboard</a>
              </div>
              <div class="footer">
                <p>Anax Inventions — Transforming Ideas into Digital Reality</p>
              </div>
            </div>
          </body>
          </html>
        `
      });
      
      console.log(`📧 Status update email sent to ${client.email}`);
    }
    
    console.log(`✅ Admin updated requirement ${req.params.id} status from ${oldStatus} to ${status}`);
    
    res.status(200).json({ 
      success: true, 
      message: 'Requirement status updated',
      requirement: requirement
    });
  } catch (error) {
    console.error('❌ Update requirement error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// SEND PROPOSAL (Admin) - ENHANCED VERSION
// ============================================
router.post('/:id/proposal', protect, admin, async (req, res) => {
  try {
    const { 
      projectName, 
      budget, 
      timeline, 
      scope, 
      deliverables, 
      paymentTerms, 
      validUntil, 
      notes 
    } = req.body;
    
    const requirement = await Requirement.findById(req.params.id);
    
    if (!requirement) {
      return res.status(404).json({ success: false, message: 'Requirement not found' });
    }
    
    const project = await Project.findById(requirement.projectId);
    const client = await User.findById(project?.clientId);
    
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    
    // Save proposal data
    requirement.proposalData = {
      projectName: projectName || requirement.commonData?.projectName,
      budget: budget || requirement.commonData?.budget,
      timeline: timeline || requirement.commonData?.timeline,
      scope: scope || '',
      deliverables: deliverables || '',
      paymentTerms: paymentTerms || '30% Advance, 30% Milestone, 40% Delivery',
      validUntil: validUntil ? new Date(validUntil) : null,
      notes: notes || '',
      sentAt: new Date()
    };
    requirement.status = 'proposal_sent';
    await requirement.save();
    
    // Generate dynamic fields HTML for email
    const dynamicFieldsHtml = Object.entries(requirement.dynamicFields || {})
      .slice(0, 15)
      .map(([key, value]) => {
        const formattedValue = Array.isArray(value) ? value.join(', ') : (typeof value === 'object' ? JSON.stringify(value) : value);
        return `
          <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
            <span style="font-size: 13px; color: #888;">${formatFieldLabel(key)}</span>
            <span style="font-size: 14px; font-weight: 600; color: #1d2e2a;">${formattedValue || 'N/A'}</span>
          </div>
        `;
      }).join('');
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Proposal from Anax Inventions</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; padding: 30px; }
          .proposal-container { max-width: 700px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
          .proposal-header { background: linear-gradient(135deg, #1d2e2a 0%, #2a463f 100%); padding: 30px; text-align: center; border-bottom: 3px solid #cc7722; }
          .proposal-header h1 { color: #cc7722; font-size: 28px; margin: 0; font-family: 'Playfair Display', serif; }
          .proposal-header p { color: rgba(255,255,255,0.7); font-size: 12px; margin-top: 8px; }
          .proposal-badge { background: #cc7722; color: #fff; display: inline-block; padding: 6px 20px; border-radius: 30px; font-size: 12px; font-weight: 600; margin-top: 15px; }
          .proposal-body { padding: 30px; }
          .greeting { margin-bottom: 25px; }
          .greeting h2 { color: #1d2e2a; font-size: 22px; margin-bottom: 8px; }
          .greeting p { color: #666; font-size: 14px; line-height: 1.5; }
          .proposal-card { background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #cc7722; }
          .proposal-card h3 { color: #1d2e2a; font-size: 16px; margin-bottom: 15px; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0e0e0; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { font-size: 13px; color: #888; flex: 1; }
          .detail-value { font-size: 14px; font-weight: 600; color: #1d2e2a; flex: 2; text-align: right; }
          .budget-value { color: #28a745; font-size: 18px; font-weight: 700; }
          .scope-text, .deliverables-text { font-size: 13px; color: #555; line-height: 1.5; margin-top: 8px; }
          .payment-terms { background: #fff8f0; padding: 12px; border-radius: 8px; margin-top: 10px; font-size: 13px; color: #1d2e2a; }
          .validity { text-align: center; padding: 15px; background: #fff8f0; border-radius: 8px; margin-top: 20px; font-size: 12px; color: #cc7722; }
          .cta-button { display: inline-block; background: #cc7722; color: #fff; text-decoration: none; padding: 12px 30px; border-radius: 30px; font-weight: 600; margin-top: 20px; transition: all 0.3s; }
          .cta-button:hover { background: #e0882e; transform: translateY(-2px); }
          .proposal-footer { background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0; }
          .proposal-footer p { font-size: 11px; color: #999; margin: 5px 0; }
          @media (max-width: 600px) {
            .detail-row { flex-direction: column; }
            .detail-value { text-align: left; margin-top: 4px; }
            .proposal-body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="proposal-container">
          <div class="proposal-header">
            <h1>ANAX INVENTIONS</h1>
            <p>Transforming Ideas into Digital Reality</p>
            <div class="proposal-badge">OFFICIAL PROPOSAL</div>
          </div>
          
          <div class="proposal-body">
            <div class="greeting">
              <h2>Dear ${client.fullName},</h2>
              <p>Thank you for choosing Anax Inventions. We are excited to present this proposal for your project.</p>
            </div>
            
            <div class="proposal-card">
              <h3>📋 Project Overview</h3>
              <div class="detail-row">
                <span class="detail-label">Project Name</span>
                <span class="detail-value">${projectName || requirement.commonData?.projectName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Service Type</span>
                <span class="detail-value">${requirement.selectedService?.title || 'Custom Development'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Budget</span>
                <span class="detail-value budget-value">${requirement.commonData?.currency || '₨'} ${budget || requirement.commonData?.budget}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Timeline</span>
                <span class="detail-value">${timeline || requirement.commonData?.timeline}</span>
              </div>
            </div>
            
            ${dynamicFieldsHtml ? `
            <div class="proposal-card">
              <h3>📊 Your Requirements Details</h3>
              ${dynamicFieldsHtml}
              ${Object.keys(requirement.dynamicFields || {}).length > 15 ? `<p style="font-size: 12px; color: #888; margin-top: 10px;">... and ${Object.keys(requirement.dynamicFields).length - 15} more requirements</p>` : ''}
            </div>
            ` : ''}
            
            <div class="proposal-card">
              <h3>📝 Scope of Work</h3>
              <div class="scope-text">${(scope || '').replace(/\n/g, '<br>') || 'As discussed in the requirements'}</div>
            </div>
            
            ${deliverables ? `
            <div class="proposal-card">
              <h3>🎯 Deliverables</h3>
              <div class="deliverables-text">${deliverables.replace(/\n/g, '<br>')}</div>
            </div>
            ` : ''}
            
            <div class="proposal-card">
              <h3>💰 Payment Terms</h3>
              <div class="payment-terms">${paymentTerms || '30% Advance, 30% on Milestone, 40% on Final Delivery'}</div>
            </div>
            
            <div class="validity">
              ⏰ This proposal is valid until ${validUntil ? new Date(validUntil).toLocaleDateString() : '30 days from now'}
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/client-dashboard" class="cta-button">📄 View & Accept Proposal</a>
            </div>
            
            ${notes ? `
            <div style="margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 8px;">
              <p style="font-size: 12px; color: #666;"><strong>Additional Notes:</strong><br>${notes}</p>
            </div>
            ` : ''}
          </div>
          
          <div class="proposal-footer">
            <p>Anax Inventions — UK Registered Company</p>
            <p>Email: anaxinventions@gmail.com | Phone: +92 311 6735509</p>
            <p>© ${new Date().getFullYear()} Anax Inventions. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    await sendEmail({
      to: client.email,
      subject: `📄 Official Proposal: ${projectName || requirement.commonData?.projectName} | Anax Inventions`,
      html: emailHtml
    });
    
    console.log(`✅ Proposal sent for requirement ${req.params.id} to ${client.email}`);
    
    res.status(200).json({ 
      success: true, 
      message: 'Proposal sent successfully!',
      proposalData: requirement.proposalData
    });
  } catch (error) {
    console.error('❌ Send proposal error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// GET REQUIREMENT STATISTICS (Admin Dashboard)
// ============================================
router.get('/stats/dashboard', protect, admin, async (req, res) => {
  try {
    const totalRequirements = await Requirement.countDocuments();
    const pendingRequirements = await Requirement.countDocuments({ 
      status: { $in: ['submitted', 'pending', 'reviewing'] } 
    });
    const approvedRequirements = await Requirement.countDocuments({ status: 'approved' });
    const rejectedRequirements = await Requirement.countDocuments({ status: 'rejected' });
    const proposalSent = await Requirement.countDocuments({ status: 'proposal_sent' });
    
    // Requirements by service type
    const requirementsByService = await Requirement.aggregate([
      { $group: { _id: '$selectedService.title', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Requirements by client
    const requirementsByClient = await Requirement.aggregate([
      { $lookup: { from: 'projects', localField: 'projectId', foreignField: '_id', as: 'project' } },
      { $unwind: { path: '$project', preserveNullAndEmptyArrays: true } },
      { $group: { _id: '$project.clientId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Get client names for the stats
    const clientNames = {};
    for (const item of requirementsByClient) {
      if (item._id) {
        const client = await User.findById(item._id);
        clientNames[item._id] = client?.fullName || 'Unknown';
      }
    }
    
    const requirementsByClientWithNames = requirementsByClient.map(item => ({
      clientId: item._id,
      clientName: clientNames[item._id] || 'Unknown',
      count: item.count
    }));
    
    // Recent requirements (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRequirements = await Requirement.countDocuments({
      submittedAt: { $gte: sevenDaysAgo }
    });
    
    // Daily submissions (last 7 days)
    const dailySubmissions = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const count = await Requirement.countDocuments({
        submittedAt: { $gte: date, $lt: nextDate }
      });
      
      dailySubmissions.push({
        date: date.toLocaleDateString(),
        count: count
      });
    }
    
    console.log('📊 Admin fetched dashboard stats');
    
    res.status(200).json({
      success: true,
      stats: {
        total: totalRequirements,
        pending: pendingRequirements,
        approved: approvedRequirements,
        rejected: rejectedRequirements,
        proposalSent: proposalSent,
        recent: recentRequirements
      },
      byService: requirementsByService,
      byClient: requirementsByClientWithNames,
      dailySubmissions: dailySubmissions,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// DELETE REQUIREMENT (Admin)
// ============================================
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const requirement = await Requirement.findById(req.params.id);
    
    if (!requirement) {
      return res.status(404).json({ success: false, message: 'Requirement not found' });
    }
    
    const project = await Project.findById(requirement.projectId);
    const client = await User.findById(project?.clientId);
    
    await requirement.deleteOne();
    
    console.log(`🗑️ Admin DELETED requirement ${req.params.id} - Service: ${requirement.selectedService?.title}, Client: ${client?.fullName}`);
    
    res.status(200).json({ 
      success: true, 
      message: 'Requirement deleted successfully' 
    });
  } catch (error) {
    console.error('❌ Delete requirement error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// ✅ GET ALL PROPOSALS (Admin)
// ============================================
router.get('/proposals', protect, admin, async (req, res) => {
  try {
    const proposals = await Proposal.find()
      .populate('clientId', 'fullName email phone company')
      .populate('requirementId', 'selectedService commonData')
      .sort({ createdAt: -1 });
    
    console.log(`📋 Admin fetched ${proposals.length} proposals`);
    
    res.status(200).json({
      success: true,
      count: proposals.length,
      proposals: proposals
    });
  } catch (error) {
    console.error('❌ Fetch proposals error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// ✅ GET SINGLE PROPOSAL (Admin)
// ============================================
router.get('/proposals/:proposalId', protect, admin, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.proposalId)
      .populate('clientId', 'fullName email phone company')
      .populate('requirementId', 'selectedService commonData dynamicFields');
    
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }
    
    console.log(`📋 Admin viewed proposal ${req.params.proposalId}`);
    
    res.status(200).json({
      success: true,
      proposal: proposal
    });
  } catch (error) {
    console.error('❌ Fetch proposal error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// ✅ ADMIN COUNTER-SIGNS PROPOSAL
// ============================================
router.put('/proposals/:proposalId/admin-sign', protect, admin, async (req, res) => {
  try {
    const { signature, adminNotes } = req.body;
    
    console.log(`📝 Admin signing proposal ${req.params.proposalId}`);
    console.log(`   - Signature received: ${signature ? 'Yes' : 'No'}`);
    console.log(`   - Admin notes: ${adminNotes || 'None'}`);
    
    const proposal = await Proposal.findById(req.params.proposalId);
    
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }
    
    console.log(`   - Current status: ${proposal.status}`);
    console.log(`   - Client signed: ${proposal.clientSignature ? 'Yes' : 'No'}`);
    
    // Check if client has already signed
    if (proposal.status !== 'client_signed') {
      return res.status(400).json({ 
        success: false, 
        message: 'Client must sign first before admin can counter-sign. Current status: ' + proposal.status 
      });
    }
    
    // Update admin signature fields
    proposal.adminSignature = signature || '';
    proposal.adminSignedAt = new Date();
    proposal.adminSignedBy = req.user.fullName || req.user.email;
    proposal.adminNotes = adminNotes || '';
    proposal.status = 'admin_signed';
    proposal.signatureVerified = true;
    proposal.updatedAt = new Date();
    
    // If both signatures exist, mark as finalized
    if (proposal.clientSignature && proposal.adminSignature) {
      proposal.status = 'finalized';
    }
    
    await proposal.save();
    
    console.log(`✅ Admin signed proposal ${req.params.proposalId}`);
    console.log(`   - New status: ${proposal.status}`);
    console.log(`   - Signature verified: ${proposal.signatureVerified}`);
    
    // Send email to client that admin has signed
    const client = await User.findById(proposal.clientId);
    if (client && client.email) {
      await sendEmail({
        to: client.email,
        subject: `✅ Proposal Counter-Signed: ${proposal.projectName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Proposal Counter-Signed - Anax Inventions</title>
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; padding: 30px; }
              .container { max-width: 550px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #1d2e2a 0%, #2a463f 100%); padding: 25px; text-align: center; }
              .header h2 { color: #cc7722; margin: 0; }
              .body { padding: 25px; }
              .signature-box { background: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; border: 1px solid #e2e8f0; }
              .signature-img { max-width: 250px; max-height: 80px; border: 1px solid #e2e8f0; padding: 10px; background: white; }
              .btn { display: inline-block; background: #cc7722; color: white; padding: 12px 30px; text-decoration: none; border-radius: 30px; margin-top: 20px; }
              .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 11px; color: #999; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>ANAX INVENTIONS</h2>
                <p style="color: rgba(255,255,255,0.7); margin: 5px 0 0;">Proposal Counter-Signed</p>
              </div>
              <div class="body">
                <h3>Dear ${client.fullName},</h3>
                <p>Great news! Admin has counter-signed the proposal for <strong>${proposal.projectName}</strong>.</p>
                <p>The proposal is now <strong>finalized and legally binding</strong>.</p>
                
                <div class="signature-box">
                  <p><strong>📝 Admin Signature:</strong></p>
                  ${signature ? `<img src="${signature}" alt="Admin Signature" class="signature-img" />` : '<p>Electronically signed by Admin</p>'}
                  <p style="margin-top: 10px; font-size: 12px; color: #666;">Signed by: ${req.user.fullName || req.user.email}</p>
                  <p style="font-size: 12px; color: #666;">Date: ${new Date().toLocaleString()}</p>
                </div>
                
                ${adminNotes ? `<p><strong>📝 Admin Notes:</strong> ${adminNotes}</p>` : ''}
                
                <div style="text-align: center;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/client-dashboard?tab=proposals" class="btn">View Finalized Proposal</a>
                </div>
              </div>
              <div class="footer">
                <p>Anax Inventions — Transforming Ideas into Digital Reality</p>
              </div>
            </div>
          </body>
          </html>
        `
      });
      console.log(`📧 Counter-sign email sent to ${client.email}`);
    }
    
    res.json({ 
      success: true, 
      message: 'Admin counter-signature added successfully. Proposal is now finalized.',
      proposal: {
        _id: proposal._id,
        status: proposal.status,
        adminSignedAt: proposal.adminSignedAt,
        adminSignedBy: proposal.adminSignedBy,
        signatureVerified: proposal.signatureVerified
      }
    });
    
  } catch (error) {
    console.error('❌ Admin sign error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// ✅ GET PROPOSAL SIGNATURE STATUS (Admin)
// ============================================
router.get('/proposals/:proposalId/signature-status', protect, admin, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.proposalId)
      .select('status clientSignature adminSignature signatureVerified clientSignedAt adminSignedAt clientSignedBy adminSignedBy clientIpAddress');
    
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }
    
    res.status(200).json({
      success: true,
      signatureStatus: {
        status: proposal.status,
        clientSigned: !!proposal.clientSignature,
        clientSignedAt: proposal.clientSignedAt,
        clientSignedBy: proposal.clientSignedBy,
        clientIpAddress: proposal.clientIpAddress,
        adminSigned: !!proposal.adminSignature,
        adminSignedAt: proposal.adminSignedAt,
        adminSignedBy: proposal.adminSignedBy,
        signatureVerified: proposal.signatureVerified,
        isComplete: proposal.status === 'finalized' || proposal.status === 'admin_signed'
      }
    });
  } catch (error) {
    console.error('❌ Signature status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;