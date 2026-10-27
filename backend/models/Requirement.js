const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  
  selectedService: {
    id: { type: String, default: '' },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    image: { type: String, default: '' }
  },
  
  clientInfo: {
    fullName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    company: { type: String, default: '' }
  },
  
  commonData: {
    projectName: { type: String, default: '' },
    projectGoal: { type: String, default: '' },
    budget: { type: String, default: '' },
    timeline: { type: String, default: '' },
    referenceLink: { type: String, default: '' },
    additionalInfo: { type: String, default: '' },
    currency: { type: String, default: '₨' }
  },
  
  dynamicFields: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  attachments: [{
    name: { type: String, default: '' },
    url: { type: String, default: '' },
    size: { type: Number, default: 0 },
    type: { type: String, default: '' },
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  editHistory: [{
    editedAt: { type: Date, default: Date.now },
    previousData: { type: mongoose.Schema.Types.Mixed, default: {} },
    editedBy: { type: String, default: '' }
  }],
  
  proposalData: {
    projectName: { type: String, default: '' },
    budget: { type: String, default: '' },
    timeline: { type: String, default: '' },
    scope: { type: String, default: '' },
    deliverables: { type: String, default: '' },
    paymentTerms: { type: String, default: '30% Advance, 30% Milestone, 40% Delivery' },
    validUntil: { type: Date },
    notes: { type: String, default: '' },
    sentAt: { type: Date }
  },
  
  // ✅ FIXED: Added 'proposal_ready' to enum
  status: {
    type: String,
    enum: ['pending', 'submitted', 'reviewing', 'proposal_ready', 'proposal_sent', 'approved', 'rejected', 'revision_requested', 'request_info'],
    default: 'submitted'
  },
  
  // Proposal ready tracking
  proposalReadyAt: {
    type: Date,
    default: null
  },
  
  proposalSentAt: {
    type: Date,
    default: null
  },
  
  approvedAt: {
    type: Date,
    default: null
  },
  
  rejectedAt: {
    type: Date,
    default: null
  },
  
  requestedInfo: {
    type: String,
    default: ''
  },
  
  requestedAt: {
    type: Date,
    default: null
  },
  
  rejectionReason: {
    type: String,
    default: ''
  },
  
  reviewedAt: {
    type: Date,
    default: null
  },
  
  adminNote: {
    type: String,
    default: ''
  },
  
  isEdited: {
    type: Boolean,
    default: false
  },
  
  originalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Requirement',
    default: null
  },
  
  submittedAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

requirementSchema.index({ projectId: 1 });
requirementSchema.index({ status: 1 });
requirementSchema.index({ submittedAt: -1 });

module.exports = mongoose.model('Requirement', requirementSchema);