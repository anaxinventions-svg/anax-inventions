const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: '' },
  quote: { type: String, required: true },
  image: { type: String, default: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
  rating: { type: Number, default: 5 },
  project: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);