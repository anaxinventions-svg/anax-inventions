// backend/models/PageContent.js
const mongoose = require('mongoose');

const pageContentSchema = new mongoose.Schema({
  // Page identification
  pageSlug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  pageName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['development', 'ai-solutions', 'marketing', 'design', 'consulting']
  },

  // ========== HERO SECTION ==========
  hero: {
    tagline: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    primaryButtonText: { type: String, default: 'Get Started →' },
    secondaryButtonText: { type: String, default: 'Learn More' },
    backgroundImage: { type: String, default: '' }
  },

  // ========== TRUST BADGE ==========
  trustBadge: {
    enabled: { type: Boolean, default: true },
    text: { type: String, default: '' }
  },

  // ========== WHAT WE OFFER ==========
  whatWeOffer: {
    title: { type: String, default: 'What We Offer' },
    subtitle: { type: String, default: '' },
    items: [{
      icon: { type: String, default: 'fa-cube' },
      title: { type: String, required: true },
      description: { type: String, default: '' },
      order: { type: Number, default: 0 }
    }]
  },

  // ========== RECENT PROJECTS ==========
  recentProjects: {
    title: { type: String, default: 'Recent Projects' },
    subtitle: { type: String, default: '' },
    projects: [{
      name: { type: String, required: true },
      category: { type: String, default: '' },
      description: { type: String, default: '' },
      imageUrl: { type: String, default: '' },
      liveUrl: { type: String, default: '' },
      techStack: [{ type: String }],
      order: { type: Number, default: 0 },
      isActive: { type: Boolean, default: true }
    }]
  },

  // ========== OUR PROCESS ==========
  process: {
    title: { type: String, default: 'Our Process' },
    subtitle: { type: String, default: '' },
    steps: [{
      number: { type: String, required: true },
      icon: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, default: '' },
      order: { type: Number, default: 0 }
    }]
  },

  // ========== TECHNOLOGIES ==========
  technologies: {
    title: { type: String, default: 'Technologies We Master' },
    subtitle: { type: String, default: '' },
    categories: [{
      name: { type: String, required: true },
      items: [{ type: String }],
      order: { type: Number, default: 0 }
    }]
  },

  // ========== FAQ ==========
  faq: {
    title: { type: String, default: 'Frequently Asked Questions' },
    subtitle: { type: String, default: '' },
    items: [{
      question: { type: String, required: true },
      answer: { type: String, required: true },
      order: { type: Number, default: 0 }
    }]
  },

  // ========== CTA SECTION ==========
  cta: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    buttonText: { type: String, default: 'Get a Free Quote →' },
    buttonLink: { type: String, default: '/contact' }
  }

}, { timestamps: true });

// Index for faster queries
pageContentSchema.index({ pageSlug: 1 });

module.exports = mongoose.model('PageContent', pageContentSchema);