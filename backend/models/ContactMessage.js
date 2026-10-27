const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  // Required Fields
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [5000, 'Message cannot exceed 5000 characters']
  },
  
  // Optional Additional Fields
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  country: {
    type: String,
    trim: true,
    default: ''
  },
  company: {
    type: String,
    trim: true,
    default: ''
  },
  website: {
    type: String,
    trim: true,
    default: ''
  },
  budget: {
    type: String,
    trim: true,
    default: ''
  },
  service: {
    type: String,
    trim: true,
    default: ''
  },
  
  // Admin Management Fields
  status: {
    type: String,
    enum: ['New', 'Read', 'Replied', 'Archived'],
    default: 'New'
  },
  adminNotes: {
    type: String,
    trim: true,
    default: ''
  },
  assignedTo: {
    type: String,
    trim: true,
    default: ''
  },
  
  // Source Tracking
  source: {
    type: String,
    default: 'Website Contact Form'
  },
  ipAddress: {
    type: String,
    default: ''
  },
  
  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // createdAt, updatedAt auto add honge
});

// Index for faster queries
contactMessageSchema.index({ status: 1, submittedAt: -1 });
contactMessageSchema.index({ email: 1 });
contactMessageSchema.index({ name: 'text', email: 'text', company: 'text' });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);