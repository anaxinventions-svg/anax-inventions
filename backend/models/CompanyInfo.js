const mongoose = require('mongoose');

const companyInfoSchema = new mongoose.Schema({
  name: { type: String, default: 'Anax Inventions' },
  tagline: { type: String, default: 'UK Registered Digital Agency' },
  description: { type: String, default: '' },
  email: { type: String, default: 'anas@anaxinventions.com' },
  phone: { type: String, default: '+92 XXX XXXXXXX' },
  whatsapp: { type: String, default: '+92 XXX XXXXXXX' },
  address: { type: String, default: 'UK Virtual Address' },
  companyNumber: { type: String, default: '12345678' },
  businessHours: { type: String, default: 'Mon-Fri: 9AM-6PM GMT' },
  socialLinks: {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' }
  },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CompanyInfo', companyInfoSchema);