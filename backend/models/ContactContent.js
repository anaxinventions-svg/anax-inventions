const mongoose = require('mongoose');

const contactContentSchema = new mongoose.Schema({
  // Hero Section
  heroTag: { type: String, default: 'GET IN TOUCH' },
  heroTitle: { type: String, default: "Let's Build Something Amazing" },
  heroDescription: { type: String, default: "Have a project in mind? We'd love to hear about it. Send us a message and we'll respond within 24 hours." },
  
  // Stats Cards
  statsCards: [{
    icon: { type: String, default: '✓' },
    value: { type: String, default: '' },
    label: { type: String, default: '' },
  }],
  
  // Contact Cards
  whatsappNumber: { type: String, default: '03116735509' },
  whatsappText: { type: String, default: 'Hello Anax Inventions! I want to discuss a project.' },
  whatsappSubtitle: { type: String, default: 'Fast Response • Mon-Sat, 9AM-8PM' },
  
  emailPrimary: { type: String, default: 'info@anaxinventions.com' },
  emailSecondary: { type: String, default: 'support@anaxinventions.com' },
  emailSubtitle: { type: String, default: 'Response within 24 hours' },
  
  addressLine1: { type: String, default: 'Office #45, 3rd Floor' },
  addressLine2: { type: String, default: 'Gulberg III, Lahore, Pakistan' },
  addressSubtitle: { type: String, default: 'View on Google Maps' },
  googleMapsLink: { type: String, default: 'https://maps.google.com' },
  
  // Social Links
  socialLinks: [{
    platform: { type: String },
    icon: { type: String, default: 'whatsapp' },
    url: { type: String },
    isActive: { type: Boolean, default: true },
  }],
  
  // CTA Banner
  ctaTitle: { type: String, default: 'Ready to Start Your Project?' },
  ctaText: { type: String, default: 'Chat with us on WhatsApp — we respond within 1 hour' },
  ctaWhatsappNumber: { type: String, default: '03116735509' },
}, { timestamps: true });

module.exports = mongoose.model('ContactContent', contactContentSchema);