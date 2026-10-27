const mongoose = require('mongoose');

const bannerServiceSchema = new mongoose.Schema({
  mainService: { type: String, required: true },  // Parent service name
  title: { type: String, required: true },        // Sub-service title
  subtitle: { type: String },
  description: { type: String },
  image: { type: String },
  features: [{ type: String }],
  icon: { type: String, default: 'FaCode' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('BannerService', bannerServiceSchema);