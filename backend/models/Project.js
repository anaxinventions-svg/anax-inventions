const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectId: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    enum: ['Website', 'Mobile App', 'Software', 'E-commerce', 'SEO', 'Design', 'Other'],
    default: 'Website',
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  clientEmail: {
    type: String,
    default: '',
  },
  clientName: {
    type: String,
    default: '',
  },
  clientPhone: {
    type: String,
    default: '',
  },
  totalBudget: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: '₨',
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
  budget: {
    type: String,
    default: '',
  },
  timeline: {
    type: String,
    default: '',
  },
  startDate: {
    type: Date,
  },
  expectedDeliveryDate: {
    type: Date,
  },
  actualDeliveryDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Planning', 'Active', 'active', 'Paused', 'Completed', 'Cancelled', 'pending', 'in-progress', 'on-hold', 'submitted'],
    default: 'Planning',
  },
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  phaseProgress: {
    discovery: { type: Number, default: 0 },
    design: { type: Number, default: 0 },
    development: { type: Number, default: 0 },
    testing: { type: Number, default: 0 },
    deployment: { type: Number, default: 0 },
    support: { type: Number, default: 0 },
  },
  teamMembers: {
    projectManager: { type: String, default: '' },
    leadDeveloper: { type: String, default: '' },
    designer: { type: String, default: '' },
    qaEngineer: { type: String, default: '' },
  },
  stagingUrl: { type: String, default: '' },
  productionUrl: { type: String, default: '' },
}, { timestamps: true });

// Auto-generate project ID
projectSchema.pre('save', async function(next) {
  if (!this.projectId) {
    const count = await mongoose.model('Project').countDocuments();
    this.projectId = `ANAX-PRJ-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);