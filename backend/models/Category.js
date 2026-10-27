const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
  },
  key: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  icon: {
    type: String,
    default: 'fa-folder',
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    default: '',
  }
}, { timestamps: true });

// Auto-generate key from name before saving
categorySchema.pre('save', function(next) {
  if (!this.key && this.name) {
    // Generate key from name (lowercase, replace spaces with hyphens)
    this.key = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]+/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Also handle findOneAndUpdate
categorySchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.name && !update.key) {
    update.key = update.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]+/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);