const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String }],
  stats: {
    users: { type: String, default: '10K+' },
    rating: { type: String, default: '4.8' }
  },
  challenge: { type: String, default: '' },
  solution: { type: String, default: '' },
  techStack: [{ type: String }],
  results: [{ type: String }],
  liveDemoLink: { type: String, default: '' },
  featuredOnHome: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Portfolio', portfolioSchema);