// backend/models/Service.js - UPDATED (Enum removed)
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=350&fit=crop',
  },
  features: [{
    type: String,
  }],
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
  },
  icon: {
    type: String,
    default: 'fa-cube'
  },
  // ✅ REMOVED enum - now accepts any category key from Categories collection
  category: {
    type: String,
    default: 'development'
  }
}, { timestamps: true });

// Auto-generate slug before saving
serviceSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]+/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

module.exports = mongoose.model('Service', serviceSchema);