const express = require('express');
const router = express.Router();
const Proposal = require('../models/Proposal');
const Requirement = require('../models/Requirement');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');

// ✅ DIRECT IMPORT - Use pdfGenerator (html-pdf-node)
const generateProposalPDF = require('../utils/proposalPDF');

// ============================================
// GET ALL PROPOSALS
// ============================================
router.get('/', protect, admin, async (req, res) => {
  try {
    const proposals = await Proposal.find().sort({ createdAt: -1 });
    res.json({ success: true, proposals, count: proposals.length });
  } catch (error) {
    console.error('❌ Fetch proposals error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// GET SINGLE PROPOSAL
// ============================================
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }
    res.json({ success: true, proposal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// DOWNLOAD PROPOSAL PDF
// ============================================
router.get('/:id/pdf', protect, admin, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    const requirement = await Requirement.findById(proposal.requirementId);
    const client = await User.findById(proposal.clientId);

    const pdfData = {
      clientName: proposal.clientName,
      clientEmail: proposal.clientEmail,
      clientPhone: client?.phone || 'N/A',
      clientCompany: client?.company || 'N/A',
      projectName: proposal.projectName,
      budget: proposal.budget,
      timeline: proposal.timeline,
      scope: proposal.scope,
      deliverables: proposal.deliverables,
      paymentTerms: proposal.paymentTerms,
      validUntil: proposal.validUntil,
      notes: proposal.notes,
      clientRequirements: requirement?.dynamicFields || {},
      serviceTitle: requirement?.selectedService?.title || 'Custom Development',
      projectGoal: requirement?.commonData?.projectGoal || '',
      // ✅ FIXED: Added Step 6 fields for PDF
      aboutUs: proposal.aboutUs,
      aboutImage: proposal.aboutImage,
      websiteStructure: proposal.websiteStructure,
      integrations: proposal.integrations,
      additionalFeatures: proposal.additionalFeatures,
      termsAndConditions: proposal.termsAndConditions,
      thankYouMessage: proposal.thankYouMessage
    };

    const pdfBuffer = await generateProposalPDF(pdfData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Proposal_${proposal.projectName.replace(/\s/g, '_')}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('❌ PDF Generation Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate PDF' });
  }
});

// ============================================
// CREATE PROPOSAL - ✅ FIXED WITH ALL STEP 6 FIELDS
// ============================================
router.post('/generate', protect, admin, async (req, res) => {
  try {
    // ✅ FIXED: Destructure ALL Step 6 fields from req.body
    const {
      requirementId, clientName, clientEmail, clientPhone, clientCompany,
      projectName, budget, timeline, scope, deliverables, paymentTerms,
      validUntil, notes, clientRequirements, serviceTitle, projectGoal,
      // 🔴 THESE WERE MISSING - NOW ADDED:
      aboutUs,
      aboutImage,
      websiteStructure,
      integrations,
      additionalFeatures,
      termsAndConditions,
      thankYouMessage,
      teamAssigned,
      milestones,
      templateStyle,
      includeTerms
    } = req.body;

    console.log('📝 Creating proposal for:', clientName);
    console.log('📝 aboutImage received:', aboutImage);  // Debug log

    const client = await User.findOne({ email: clientEmail });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    // ✅ FIXED: Create proposal with ALL fields including Step 6
    const proposal = await Proposal.create({
      requirementId,
      clientId: client._id,
      clientName,
      clientEmail,
      clientPhone: clientPhone || '',
      clientCompany: clientCompany || '',
      projectName,
      budget: Number(budget),
      timeline,
      scope,
      deliverables: deliverables || '',
      paymentTerms: paymentTerms || '30% Advance, 30% Milestone, 40% Delivery',
      validUntil: validUntil ? new Date(validUntil) : null,
      notes: notes || '',
      clientRequirements: clientRequirements || {},
      serviceTitle: serviceTitle || '',
      projectGoal: projectGoal || '',
      teamAssigned: teamAssigned || '',
      milestones: milestones || [],
      templateStyle: templateStyle || 'modern',
      includeTerms: includeTerms !== undefined ? includeTerms : true,
      // ✅ FIXED: Step 6 fields now properly saved
      aboutUs: aboutUs || '',
      aboutImage: aboutImage || '',
      websiteStructure: websiteStructure || ['Home', 'About', 'Services', 'Portfolio', 'Blog', 'Contact'],
      integrations: integrations || ['Email Marketing', 'CRM Integration', 'Google Analytics', 'Payment Gateway'],
      additionalFeatures: additionalFeatures || ['Mobile Responsive Design', 'SEO Optimization', 'SSL Security', '24/7 Technical Support'],
      termsAndConditions: termsAndConditions || '',
      thankYouMessage: thankYouMessage || '',
      status: 'sent',
      sentAt: new Date()
    });

    console.log('✅ Proposal created with aboutImage:', proposal.aboutImage);

    await sendProposalEmail(proposal, client);
    res.json({ success: true, message: 'Proposal sent!', proposal });

  } catch (error) {
    console.error('❌ Create proposal error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// UPDATE PROPOSAL STATUS
// ============================================
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, declinedReason } = req.body;
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    proposal.status = status;
    if (status === 'accepted') proposal.acceptedAt = new Date();
    if (status === 'declined') {
      proposal.declinedAt = new Date();
      proposal.declinedReason = declinedReason || '';
    }
    await proposal.save();

    res.json({ success: true, message: `Proposal ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// UPDATE PROPOSAL - ✅ NEW ROUTE FOR EDITING
// ============================================
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    const {
      clientName, clientEmail, clientPhone, clientCompany,
      projectName, budget, timeline, scope, deliverables,
      paymentTerms, validUntil, notes, teamAssigned,
      aboutUs, aboutImage, websiteStructure, integrations,
      additionalFeatures, termsAndConditions, thankYouMessage
    } = req.body;

    // Update fields
    if (clientName) proposal.clientName = clientName;
    if (clientEmail) proposal.clientEmail = clientEmail;
    if (clientPhone !== undefined) proposal.clientPhone = clientPhone;
    if (clientCompany !== undefined) proposal.clientCompany = clientCompany;
    if (projectName) proposal.projectName = projectName;
    if (budget) proposal.budget = Number(budget);
    if (timeline) proposal.timeline = timeline;
    if (scope) proposal.scope = scope;
    if (deliverables !== undefined) proposal.deliverables = deliverables;
    if (paymentTerms) proposal.paymentTerms = paymentTerms;
    if (validUntil) proposal.validUntil = new Date(validUntil);
    if (notes !== undefined) proposal.notes = notes;
    if (teamAssigned !== undefined) proposal.teamAssigned = teamAssigned;
    // ✅ Step 6 fields
    if (aboutUs !== undefined) proposal.aboutUs = aboutUs;
    if (aboutImage !== undefined) proposal.aboutImage = aboutImage;
    if (websiteStructure) proposal.websiteStructure = websiteStructure;
    if (integrations) proposal.integrations = integrations;
    if (additionalFeatures) proposal.additionalFeatures = additionalFeatures;
    if (termsAndConditions !== undefined) proposal.termsAndConditions = termsAndConditions;
    if (thankYouMessage !== undefined) proposal.thankYouMessage = thankYouMessage;

    await proposal.save();

    res.json({ success: true, message: 'Proposal updated', proposal });
  } catch (error) {
    console.error('❌ Update proposal error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// DELETE PROPOSAL
// ============================================
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Proposal.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Proposal deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// Helper Functions
// ============================================
async function sendProposalEmail(proposal, client) {
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1d2e2a 0%, #2a463f 100%); padding: 30px; text-align: center;">
        <h1 style="color: #cc7722; margin: 0;">ANAX INVENTIONS</h1>
        <p style="color: #fff;">Official Proposal</p>
      </div>
      <div style="padding: 30px;">
        <h2>Dear ${proposal.clientName},</h2>
        <p>Thank you for choosing Anax Inventions.</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p><strong>Project:</strong> ${proposal.projectName}</p>
          <p><strong>Budget:</strong> ₨ ${proposal.budget.toLocaleString()}</p>
          <p><strong>Timeline:</strong> ${proposal.timeline}</p>
        </div>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/client-dashboard" 
           style="background: #cc7722; color: white; padding: 12px 25px; text-decoration: none; border-radius: 30px; display: inline-block;">
          View Proposal
        </a>
      </div>
      <div style="background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #999;">
        <p>Anax Inventions — Transforming Ideas into Digital Reality</p>
      </div>
    </div>
  `;

  await sendEmail({
    to: proposal.clientEmail,
    subject: `Official Proposal: ${proposal.projectName} | Anax Inventions`,
    html: emailHtml
  });
}

module.exports = router;