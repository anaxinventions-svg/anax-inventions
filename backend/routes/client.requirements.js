const express = require('express');
const router = express.Router();
const Requirement = require('../models/Requirement');
const Proposal = require('../models/Proposal');
const Project = require('../models/Project');
const User = require('../models/User');
const { protect, client } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');

// ============================================
// ✅ SPECIFIC ROUTES FIRST (ORDER MATTERS!)
// ============================================

// GET ALL PROPOSALS FOR CURRENT CLIENT
router.get('/proposals', protect, client, async (req, res) => {
  try {
    console.log('📋 Fetching proposals for client:', req.user._id);
    const proposals = await Proposal.find({ clientId: req.user._id }).sort({ createdAt: -1 });
    console.log(`✅ Found ${proposals.length} proposals`);
    res.json({ success: true, proposals, count: proposals.length });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET UNREAD PROPOSALS COUNT
router.get('/proposals/unread-count', protect, client, async (req, res) => {
  try {
    const proposals = await Proposal.find({ 
      clientId: req.user._id, 
      status: { $in: ['sent', 'viewed'] }
    });
    res.json({ success: true, count: proposals.length });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.json({ success: true, count: 0 });
  }
});

// GET SINGLE PROPOSAL WITH FULL DETAILS
router.get('/proposal/:proposalId', protect, client, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.proposalId);
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }
    if (proposal.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    // Update viewed status if not already
    if (proposal.status === 'sent') {
      proposal.status = 'viewed';
      proposal.viewedAt = new Date();
      await proposal.save();
    }
    
    res.json({ 
      success: true, 
      proposal: {
        ...proposal.toObject(),
        hasClientSignature: !!proposal.clientSignature,
        hasAdminSignature: !!proposal.adminSignature,
        isFullySigned: proposal.status === 'admin_signed' || proposal.status === 'finalized'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// ✅ CLIENT SIGNS PROPOSAL
// ============================================
router.put('/proposal/:proposalId/sign', protect, client, async (req, res) => {
  try {
    const { signature, signedBy } = req.body;
    
    const proposal = await Proposal.findById(req.params.proposalId);
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }
    
    if (proposal.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    if (proposal.status === 'declined') {
      return res.status(400).json({ success: false, message: 'This proposal has been declined' });
    }
    
    if (proposal.status === 'expired') {
      return res.status(400).json({ success: false, message: 'This proposal has expired' });
    }
    
    proposal.clientSignature = signature;
    proposal.clientSignedAt = new Date();
    proposal.clientSignedBy = signedBy || req.user.fullName;
    proposal.clientIpAddress = req.ip || req.connection.remoteAddress;
    proposal.status = 'client_signed';
    proposal.updatedAt = new Date();
    
    await proposal.save();
    
    // Send email to admin
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await sendEmail({
        to: admin.email,
        subject: `✍️ Client Signed: ${proposal.projectName}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #cc7722;">Client Has Signed the Proposal</h2>
            <p><strong>Client:</strong> ${proposal.clientName}</p>
            <p><strong>Project:</strong> ${proposal.projectName}</p>
            <p><strong>Signed by:</strong> ${proposal.clientSignedBy}</p>
            <p><strong>Signed at:</strong> ${new Date(proposal.clientSignedAt).toLocaleString()}</p>
            <div style="margin: 20px 0; padding: 15px; background: #f8fafc; border-left: 3px solid #cc7722;">
              <p><strong>Client Signature:</strong></p>
              <img src="${signature}" alt="Client Signature" style="max-width: 250px; max-height: 80px; border: 1px solid #e2e8f0;" />
            </div>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin-dashboard?tab=proposals" style="background: #cc7722; color: white; padding: 10px 20px; text-decoration: none;">Review & Counter-Sign</a>
          </div>
        `
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Proposal signed successfully. Admin will counter-sign shortly.',
      proposal 
    });
    
  } catch (error) {
    console.error('Client sign error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// ✅ CLIENT DECLINES PROPOSAL
// ============================================
router.post('/proposal/:proposalId/decline', protect, client, async (req, res) => {
  try {
    const { reason } = req.body;
    const proposal = await Proposal.findById(req.params.proposalId);
    
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }
    
    if (proposal.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    proposal.status = 'declined';
    proposal.rejectedAt = new Date();
    proposal.rejectionReason = reason || 'No reason provided';
    proposal.updatedAt = new Date();
    await proposal.save();
    
    // Send email to admin
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await sendEmail({
        to: admin.email,
        subject: `❌ Proposal Declined: ${proposal.projectName}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #dc2626;">Proposal Declined by Client</h2>
            <p><strong>Client:</strong> ${proposal.clientName}</p>
            <p><strong>Project:</strong> ${proposal.projectName}</p>
            <p><strong>Reason:</strong> ${reason || 'No reason provided'}</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin-dashboard?tab=proposals" style="background: #cc7722; color: white; padding: 10px 20px; text-decoration: none;">View Details</a>
          </div>
        `
      });
    }
    
    res.json({ success: true, message: 'Proposal declined', proposal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// GET ALL REQUIREMENTS FOR CURRENT CLIENT
// ============================================
router.get('/all-requirements', protect, client, async (req, res) => {
  try {
    console.log('📋 Fetching all requirements for client:', req.user._id);
    
    const projects = await Project.find({ clientId: req.user._id });
    const projectIds = projects.map(p => p._id);
    
    if (projectIds.length === 0) {
      return res.status(200).json({ success: true, requirements: [], count: 0 });
    }
    
    const requirements = await Requirement.find({ 
      projectId: { $in: projectIds } 
    }).sort({ submittedAt: -1 });
    
    console.log(`✅ Found ${requirements.length} TOTAL requirements for client`);
    
    res.status(200).json({ 
      success: true, 
      requirements: requirements,
      count: requirements.length
    });
  } catch (error) {
    console.error('❌ Fetch all requirements error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// SUBMIT OR UPDATE REQUIREMENTS
// ============================================
router.post('/', protect, client, async (req, res) => {
  try {
    const {
      projectId,
      selectedService,
      clientInfo,
      commonData,
      dynamicFields,
      attachments,
      status,
      isEdited,
      originalId
    } = req.body;
    
    console.log('📝 ===== REQUIREMENT SUBMISSION =====');
    console.log('📌 projectId:', projectId);
    console.log('📌 Service:', selectedService?.title);
    console.log('📌 Dynamic Fields Count:', Object.keys(dynamicFields || {}).length);
    
    if (!selectedService?.title) {
      return res.status(400).json({ success: false, message: 'Service selection is required' });
    }
    
    // Auto-create project if no valid projectId
    let finalProjectId = projectId;
    
    if (!projectId || projectId === 'null' || projectId === 'undefined' || String(projectId).startsWith('temp_')) {
      console.log('🆕 Creating new project automatically...');
      
      const newProject = await Project.create({
        name: commonData?.projectName || 'New Project',
        clientId: req.user._id,
        clientName: clientInfo?.fullName || req.user?.fullName || '',
        clientEmail: clientInfo?.email || req.user?.email || '',
        clientPhone: clientInfo?.phone || '',
        description: commonData?.projectGoal || '',
        budget: commonData?.budget || '',
        timeline: commonData?.timeline || '',
        status: 'active'
      });
      finalProjectId = newProject._id;
      console.log('✅ New project created:', finalProjectId);
    }
    
    // EDIT existing requirement
    if (isEdited && originalId) {
      console.log('✏️ EDITING existing requirement:', originalId);
      
      const existingRequirement = await Requirement.findById(originalId);
      if (!existingRequirement) {
        return res.status(404).json({ success: false, message: 'Original requirement not found' });
      }
      
      const project = await Project.findById(existingRequirement.projectId);
      if (project.clientId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
      
      existingRequirement.selectedService = selectedService;
      existingRequirement.clientInfo = clientInfo;
      existingRequirement.commonData = { ...commonData, currency: commonData?.currency || '₨' };
      existingRequirement.dynamicFields = dynamicFields || {};
      existingRequirement.attachments = attachments || [];
      existingRequirement.status = 'submitted';
      existingRequirement.isEdited = true;
      existingRequirement.updatedAt = new Date();
      
      existingRequirement.editHistory.push({
        editedAt: new Date(),
        previousData: {
          commonData: existingRequirement.commonData,
          dynamicFields: existingRequirement.dynamicFields,
          attachments: existingRequirement.attachments
        },
        editedBy: clientInfo?.fullName || 'Client'
      });
      
      await existingRequirement.save();
      console.log('✅ Requirement UPDATED:', existingRequirement._id);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Requirements updated successfully!',
        requirement: existingRequirement
      });
    }
    
    // CREATE NEW REQUIREMENT
    console.log('🆕 Creating NEW requirement with projectId:', finalProjectId);
    console.log('📦 Dynamic Fields being saved:', JSON.stringify(dynamicFields, null, 2));
    
    const requirement = await Requirement.create({
      projectId: finalProjectId,
      selectedService: {
        id: selectedService._id,
        title: selectedService.title,
        subtitle: selectedService.subtitle || '',
        image: selectedService.image || ''
      },
      clientInfo: {
        fullName: clientInfo?.fullName || '',
        email: clientInfo?.email || '',
        phone: clientInfo?.phone || '',
        company: clientInfo?.company || ''
      },
      commonData: {
        projectName: commonData?.projectName || '',
        projectGoal: commonData?.projectGoal || '',
        budget: commonData?.budget || '',
        timeline: commonData?.timeline || '',
        referenceLink: commonData?.referenceLink || '',
        additionalInfo: commonData?.additionalInfo || '',
        currency: commonData?.currency || '₨'
      },
      dynamicFields: dynamicFields || {},
      attachments: attachments || [],
      status: 'submitted',
      isEdited: false,
      originalId: null,
      submittedAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✅ NEW requirement CREATED:', requirement._id);
    console.log('✅ Dynamic Fields saved:', Object.keys(requirement.dynamicFields).length);
    
    res.status(201).json({ 
      success: true, 
      message: 'Requirements submitted successfully!',
      requirement: requirement
    });
    
  } catch (error) {
    console.error('❌ Submit error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// CLIENT RESPONDS TO INFO REQUEST
// ============================================
router.put('/:id/respond-info', protect, client, async (req, res) => {
  try {
    const { additionalInfo, status } = req.body;
    
    const requirement = await Requirement.findById(req.params.id);
    if (!requirement) {
      return res.status(404).json({ success: false, message: 'Requirement not found' });
    }
    
    const project = await Project.findById(requirement.projectId);
    if (!project || project.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    requirement.commonData.additionalInfo = additionalInfo;
    requirement.status = status || 'submitted';
    requirement.updatedAt = new Date();
    
    requirement.editHistory.push({
      editedAt: new Date(),
      previousData: {
        commonData: requirement.commonData,
        status: requirement.status
      },
      editedBy: req.user.fullName || 'Client'
    });
    
    await requirement.save();
    
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await sendEmail({
        to: admin.email,
        subject: `Client Response: ${requirement.commonData?.projectName || 'Requirement Update'}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="background: #1d2e2a; padding: 20px;">
              <h2 style="color: #cc7722;">Client Response Received</h2>
            </div>
            <div style="padding: 20px; border: 1px solid #e2e8f0;">
              <p><strong>Client:</strong> ${req.user.fullName}</p>
              <p><strong>Project:</strong> ${requirement.commonData?.projectName || 'N/A'}</p>
              <div style="background: #f8fafc; padding: 15px;">
                <strong>Response:</strong>
                <p>${additionalInfo}</p>
              </div>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin-dashboard" style="background: #cc7722; color: white; padding: 10px 20px; text-decoration: none;">View Dashboard</a>
            </div>
          </div>
        `
      });
    }
    
    res.json({ success: true, message: 'Response submitted successfully.' });
    
  } catch (error) {
    console.error('Error submitting response:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// GET PROPOSAL FOR A REQUIREMENT
// ============================================
router.get('/:requirementId/proposal', protect, client, async (req, res) => {
  try {
    const proposal = await Proposal.findOne({ requirementId: req.params.requirementId });
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'No proposal found' });
    }
    if (proposal.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, proposal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// UPDATE REQUIREMENT (PUT)
// ============================================
router.put('/:id', protect, client, async (req, res) => {
  try {
    const requirement = await Requirement.findById(req.params.id);
    if (!requirement) {
      return res.status(404).json({ success: false, message: 'Requirement not found' });
    }
    const project = await Project.findById(requirement.projectId);
    if (project.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const { selectedService, clientInfo, commonData, dynamicFields, attachments } = req.body;
    
    requirement.selectedService = selectedService || requirement.selectedService;
    requirement.clientInfo = clientInfo || requirement.clientInfo;
    requirement.commonData = commonData || requirement.commonData;
    requirement.dynamicFields = dynamicFields || requirement.dynamicFields;
    requirement.attachments = attachments || requirement.attachments;
    requirement.status = 'submitted';
    requirement.isEdited = true;
    requirement.updatedAt = new Date();
    
    await requirement.save();
    res.status(200).json({ success: true, message: 'Requirement updated', requirement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// DELETE REQUIREMENT
// ============================================
router.delete('/:id', protect, client, async (req, res) => {
  try {
    const requirement = await Requirement.findById(req.params.id);
    if (!requirement) {
      return res.status(404).json({ success: false, message: 'Requirement not found' });
    }
    const project = await Project.findById(requirement.projectId);
    if (project.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await requirement.deleteOne();
    res.status(200).json({ success: true, message: 'Requirement deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// ⚠️ DYNAMIC ROUTES - MUST BE LAST!
// ============================================

// GET REQUIREMENTS FOR SPECIFIC PROJECT
router.get('/:projectId', protect, client, async (req, res) => {
  try {
    const requirements = await Requirement.find({ 
      projectId: req.params.projectId 
    }).sort({ submittedAt: -1 });
    res.status(200).json({ success: true, requirements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;