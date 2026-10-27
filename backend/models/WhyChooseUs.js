const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  icon: { type: String, default: '⚡' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  stat: { type: String, default: '' },
  statLabel: { type: String, default: '' },
  order: { type: Number, default: 0 }
});

const statSchema = new mongoose.Schema({
  value: { type: Number, default: 0 },
  suffix: { type: String, default: '+' },
  label: { type: String, required: true }
});

const whyChooseUsSchema = new mongoose.Schema({
  features: [featureSchema],
  stats: [statSchema],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WhyChooseUs', whyChooseUsSchema);