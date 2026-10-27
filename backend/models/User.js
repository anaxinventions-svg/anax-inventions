const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, minlength: [6, 'Password must be at least 6 characters'], select: false },
  role: { type: String, enum: ['client', 'admin'], default: 'client' },
  googleId: String,
  avatar: String,
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Plain password - for admin reference
  plainPassword: { type: String, default: '' },
  
  phone: { type: String, default: '' },
  company: { type: String, default: '' },
  country: { type: String, default: '' },
  
  otp: String,
  otpExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    // Save plain password for admin reference
    if (this.password) {
      this.plainPassword = this.password;
    }
    
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if account is locked
userSchema.methods.isLocked = function() {
  return this.lockUntil && this.lockUntil > Date.now();
};

module.exports = mongoose.model('User', userSchema);