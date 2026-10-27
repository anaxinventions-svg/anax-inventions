const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Generate JWT Token - 90 days as per .env
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '90d' });
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ============================================
// ADMIN REGISTER (First Time Setup - With OTP)
// ============================================
router.post('/admin-register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin', isVerified: true });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }
    
    // Delete any existing unverified user with this email
    await User.deleteOne({ email, isVerified: false });
    
    const otp = generateOTP();
    console.log(`🔐 Admin Register OTP for ${email}: ${otp}`);
    
    const admin = await User.create({
      fullName,
      email,
      password,
      role: 'admin',
      isVerified: false,
      isActive: true,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
    });
    
    // Send OTP email (don't fail if email doesn't send)
    try {
      await sendEmail({
        to: email,
        subject: 'Admin Account Verification - Anax Inventions',
        html: `
          <div style="font-family: Arial; max-width: 500px;">
            <h2 style="color: #1d2e2a;">Verify Your Admin Account</h2>
            <p>Hello ${fullName},</p>
            <p>Use this OTP to verify your admin account:</p>
            <div style="background: #f0f0f0; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
              ${otp}
            </div>
            <p>This OTP expires in 10 minutes.</p>
            <p>Best Regards,<br>Anax Inventions Team</p>
          </div>
        `
      });
    } catch (emailError) {
      console.log('Email failed but continuing. OTP:', otp);
    }
    
    res.status(201).json({
      success: true,
      message: 'Verification code sent!',
      userId: admin._id
    });
  } catch (error) {
    console.error('Admin register error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// VERIFY OTP (For Admin & Client)
// ============================================
router.post('/verify-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;
    
    if (!userId || !otp) {
      return res.status(400).json({ success: false, message: 'User ID and OTP required' });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Already verified' });
    }
    
    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP expired. Please request new code.' });
    }
    
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    
    // Generate token for immediate login
    const token = generateToken(user._id);
    
    res.status(200).json({
      success: true,
      message: 'Email verified successfully!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        avatar: user.avatar,
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// RESEND OTP
// ============================================
router.post('/resend-otp', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID required' });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Already verified' });
    }
    
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    
    console.log(`🔄 Resend OTP for ${user.email}: ${otp}`);
    
    try {
      await sendEmail({
        to: user.email,
        subject: 'New Verification Code - Anax Inventions',
        html: `<p>Your new OTP is: <strong>${otp}</strong></p><p>Valid for 10 minutes.</p>`
      });
    } catch (e) {
      console.log('Email failed');
    }
    
    res.status(200).json({ success: true, message: 'New OTP sent!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// LOGIN (Admin + Client)
// ============================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }
    
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Check if email verified
    if (!user.isVerified) {
      return res.status(401).json({ success: false, message: 'Please verify your email first' });
    }
    
    // Check if account active (for clients)
    if (user.role === 'client' && !user.isActive) {
      return res.status(401).json({ success: false, message: 'Your account is not active. Contact admin.' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    const token = generateToken(user._id);
    
    console.log(`✅ Login successful: ${email} (${user.role})`);
    
    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        avatar: user.avatar,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// GOOGLE LOGIN
// ============================================
router.post('/google', async (req, res) => {
  try {
    const { email, fullName, googleId, avatar } = req.body;
    
    let user = await User.findOne({ email });
    
    if (!user) {
      const adminCount = await User.countDocuments({ role: 'admin' });
      const role = adminCount === 0 ? 'admin' : 'client';
      
      user = await User.create({
        fullName,
        email,
        googleId,
        avatar,
        role,
        isVerified: true,
        isActive: true,
      });
    } else {
      user.googleId = googleId;
      user.avatar = avatar || user.avatar;
      await user.save();
    }
    
    const token = generateToken(user._id);
    
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// GET CURRENT USER
// ============================================
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otp');
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// FORGOT PASSWORD - Send OTP
// ============================================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    
    console.log(`🔑 Forgot Password OTP for ${email}: ${otp}`);
    
    try {
      await sendEmail({
        to: email,
        subject: 'Password Reset OTP - Anax Inventions',
        html: `<p>Your OTP is: <strong>${otp}</strong></p><p>Valid for 10 minutes.</p>`
      });
    } catch (e) {
      console.log('Email failed');
    }
    
    res.status(200).json({ success: true, message: 'OTP sent!', userId: user._id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// VERIFY FORGOT OTP
// ============================================
router.post('/verify-forgot-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    
    res.status(200).json({ success: true, resetToken, message: 'OTP verified!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// RESET PASSWORD
// ============================================
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }
    
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.status(200).json({ success: true, message: 'Password reset successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// CHANGE PASSWORD (Logged in user)
// ============================================
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Current and new password (6+ chars) required' });
    }
    
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ success: true, message: 'Password changed!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;