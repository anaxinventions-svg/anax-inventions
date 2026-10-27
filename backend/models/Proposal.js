const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  requirementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Requirement',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  clientEmail: {
    type: String,
    required: true
  },
  clientPhone: {
    type: String,
    default: ''
  },
  clientCompany: {
    type: String,
    default: ''
  },
  projectName: {
    type: String,
    required: true
  },
  projectGoal: {
    type: String,
    default: ''
  },
  budget: {
    type: Number,
    required: true
  },
  timeline: {
    type: String,
    required: true
  },
  scope: {
    type: String,
    required: true
  },
  deliverables: {
    type: String,
    default: ''
  },
  paymentTerms: {
    type: String,
    default: '30% Advance, 30% Milestone, 40% Delivery'
  },
  validUntil: {
    type: Date
  },
  notes: {
    type: String,
    default: ''
  },
  teamAssigned: {
    type: String,
    default: ''
  },
  milestones: {
    type: Array,
    default: [
      { name: 'Project Kickoff', percentage: 10, duration: '1 week' },
      { name: 'Design Phase', percentage: 20, duration: '2 weeks' },
      { name: 'Development', percentage: 40, duration: '4 weeks' },
      { name: 'Testing', percentage: 20, duration: '2 weeks' },
      { name: 'Deployment', percentage: 10, duration: '1 week' }
    ]
  },
  templateStyle: {
    type: String,
    enum: ['modern', 'corporate', 'minimal'],
    default: 'modern'
  },
  includeTerms: {
    type: Boolean,
    default: true
  },
  referenceLink: {
    type: String,
    default: ''
  },
  clientRequirements: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  serviceTitle: {
    type: String,
    default: ''
  },
  
  // ✅ CLIENT SIGNATURE FIELDS
  clientSignature: {
    type: String,
    default: ''
  },
  clientSignedAt: {
    type: Date,
    default: null
  },
  clientSignedBy: {
    type: String,
    default: ''
  },
  clientIpAddress: {
    type: String,
    default: ''
  },
  
  // ✅ ADMIN SIGNATURE FIELDS
  adminSignature: {
    type: String,
    default: ''
  },
  adminSignedAt: {
    type: Date,
    default: null
  },
  adminSignedBy: {
    type: String,
    default: ''
  },
  adminNotes: {
    type: String,
    default: ''
  },
  
  // ✅ REJECTION TRACKING
  rejectedAt: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  
  // ✅ SIGNATURE VERIFICATION
  signatureVerified: {
    type: Boolean,
    default: false
  },
  
  // ✅ STATUS (Updated with new states)
  status: {
    type: String,
    enum: [
      'draft',           // Admin created, not sent
      'sent',            // Sent to client
      'viewed',          // Client viewed
      'client_signed',   // Client signed, awaiting admin
      'admin_signed',    // Admin counter-signed
      'finalized',       // Both signed, complete
      'accepted',        // Client accepted
      'declined',        // Client declined
      'expired',         // Proposal expired
      'negotiating'      // Under negotiation
    ],
    default: 'draft'
  },
  
  pdfUrl: {
    type: String,
    default: ''
  },
  pdfData: {
    type: Buffer,
    default: null
  },
  sentAt: {
    type: Date
  },
  viewedAt: {
    type: Date
  },
  acceptedAt: {
    type: Date
  },
  declinedAt: {
    type: Date
  },
  declinedReason: {
    type: String,
    default: ''
  },
  negotiationHistory: {
    type: Array,
    default: []
  },
  
  // ✅ PROFESSIONAL PROPOSAL FIELDS
  aboutUs: {
    type: String,
    default: 'Anax Inventions is a leading digital solutions provider, specializing in custom web development, mobile apps, e-commerce solutions, and digital marketing.'
  },
  aboutImage: {
    type: String,
    default: ''
  },
  websiteStructure: {
    type: [String],
    default: ['Home', 'About', 'Services', 'Portfolio', 'Blog', 'Contact']
  },
  integrations: {
    type: [String],
    default: ['Email Marketing', 'CRM Integration', 'Google Analytics', 'Payment Gateway']
  },
  additionalFeatures: {
    type: [String],
    default: ['Mobile Responsive Design', 'SEO Optimization', 'SSL Security', '24/7 Technical Support']
  },
  termsAndConditions: {
    type: String,
    default: `1. PAYMENT TERMS: All payments are to be made as per the schedule mentioned above. Invoices will be sent on the first business day of each month. Failure to pay beyond the default period will result in breach of contract.

2. WARRANTY: We guarantee all services will be completed within the agreed timeframe. All proprietary information will be handled with confidentiality during and after the project term.

3. LICENSE AND APPROVALS: Client confirms they have permission to use any content, code, data, or reports provided for inclusion in the project.

4. APPROVAL OF WORK: Client can request changes within 7 days of completion. Once approved or deemed approved, the remaining payment becomes due.

5. LIMITATION OF LIABILITY: Our liability shall not exceed the total amount paid by the client for the project.

6. GOVERNING LAW: This agreement shall be governed by the laws of Pakistan.`
  },
  thankYouMessage: {
    type: String,
    default: 'Thank you for choosing Anax Inventions. We look forward to building a successful partnership and delivering exceptional results for your project.'
  },
  companyLogo: {
    type: String,
    default: ''
  },
  watermarkImage: {
    type: String,
    default: ''
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

// ✅ Indexes for faster queries
proposalSchema.index({ clientId: 1 });
proposalSchema.index({ requirementId: 1 });
proposalSchema.index({ status: 1 });
proposalSchema.index({ createdAt: -1 });
proposalSchema.index({ signatureVerified: 1 });
proposalSchema.index({ 'clientSignedAt': 1 });
proposalSchema.index({ 'adminSignedAt': 1 });

module.exports = mongoose.model('Proposal', proposalSchema);