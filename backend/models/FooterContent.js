const mongoose = require('mongoose');

const footerContentSchema = new mongoose.Schema({
  // Contact Info
  address: { type: String, default: '123 Tech Street, Karachi, Pakistan' },
  phone: { type: String, default: '+92 300 1234567' },
  email: { type: String, default: 'hello@anaxinventions.com' },
  
  // Description
  description: { type: String, default: 'Transforming ideas into digital reality. We craft exceptional web experiences that drive growth and innovation.' },
  
  // Social Links
  socialLinks: [{
    platform: { type: String, required: true },
    icon: { type: String, default: 'globe' },
    url: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  }],
  
  // Footer Links (Services, Company, Resources)
  linkSections: [{
    title: { type: String, required: true },
    links: [{
      name: { type: String, required: true },
      path: { type: String, required: true },
      isActive: { type: Boolean, default: true },
    }],
  }],
  
  // Bottom
  copyright: { type: String, default: 'Anax Inventions' },
  bottomLinks: [{
    name: { type: String },
    path: { type: String },
  }],
}, { timestamps: true });

module.exports = mongoose.model('FooterContent', footerContentSchema);