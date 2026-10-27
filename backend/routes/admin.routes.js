const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const { protect, admin } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');

// Generate secure random password
const generateSecurePassword = () => {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*';
  const all = upper + lower + numbers + special;
  
  let password = '';
  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  for (let i = password.length; i < 12; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  
  return password.split('').sort(() => 0.5 - Math.random()).join('');
};

// ============================================
// CREATE CLIENT ACCOUNT
// ============================================
router.post('/clients', protect, admin, async (req, res) => {
  try {
    const { fullName, email, phone, company, country } = req.body;
    
    if (!fullName || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }
    
    let existingUser = await User.findOne({ email });
    
    if (existingUser && existingUser.isActive) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }
    
    const plainPassword = generateSecurePassword();
    console.log(`Generated password for ${email}: ${plainPassword}`);
    
    let user;
    
    if (existingUser && !existingUser.isActive) {
      // Reactivate existing user
      existingUser.fullName = fullName;
      existingUser.phone = phone || '';
      existingUser.company = company || '';
      existingUser.country = country || '';
      existingUser.isActive = true;
      existingUser.isVerified = true;
      existingUser.password = plainPassword;  // pre-save hook will hash AND save plainPassword
      existingUser.createdBy = req.user._id;
      user = await existingUser.save();
    } else {
      // Create new user
      user = await User.create({
        fullName,
        email,
        password: plainPassword,  // pre-save hook will hash AND save plainPassword
        phone: phone || '',
        company: company || '',
        country: country || '',
        role: 'client',
        isActive: true,
        isVerified: true,
        createdBy: req.user._id,
      });
    }
    
    // Verify plainPassword saved correctly
    const savedUser = await User.findById(user._id);
    console.log(`Client created: ${email}`);
    console.log(`Plain Password stored: ${savedUser.plainPassword}`);
    
    // Send email
    let emailSent = false;
    try {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      await sendEmail({
        to: email,
        subject: 'Welcome to Anax Inventions Client Portal!',
        html: `
          <div style="font-family: Arial; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #1d2e2a;">Welcome ${fullName}!</h2>
            <p>Your client portal account has been created.</p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
              <p><strong>Portal:</strong> ${frontendUrl}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Password:</strong> ${plainPassword}</p>
            </div>
            <p style="color: #666; font-size: 12px;">Please change your password after first login.</p>
          </div>
        `
      });
      emailSent = true;
    } catch (emailError) {
      console.log('Email failed, but client created');
    }
    
    res.status(201).json({
      success: true,
      message: 'Client created successfully!',
      client: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        company: user.company,
        country: user.country,
        isActive: user.isActive,
        plainPassword: savedUser.plainPassword,
        createdAt: user.createdAt,
      },
      credentials: {
        email: user.email,
        password: plainPassword,
      },
      emailSent: emailSent,
    });
    
  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// GET ALL CLIENTS (with plain password)
// ============================================
router.get('/clients', protect, admin, async (req, res) => {
  try {
    const clients = await User.find({ role: 'client' })
      .select('-password -otp -otpExpires -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, clients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// GET SINGLE CLIENT
// ============================================
router.get('/clients/:id', protect, admin, async (req, res) => {
  try {
    const client = await User.findOne({ _id: req.params.id, role: 'client' })
      .select('-password -otp -otpExpires -resetPasswordToken -resetPasswordExpires');
    
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    
    res.status(200).json({ success: true, client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// UPDATE CLIENT
// ============================================
router.put('/clients/:id', protect, admin, async (req, res) => {
  try {
    const { fullName, phone, company, country, isActive } = req.body;
    
    const client = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'client' },
      { fullName, phone, company, country, isActive },
      { new: true, runValidators: true }
    ).select('-password -otp');
    
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    
    res.status(200).json({ success: true, message: 'Client updated!', client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// RESET CLIENT PASSWORD
// ============================================
router.post('/clients/:id/reset-password', protect, admin, async (req, res) => {
  try {
    const client = await User.findOne({ _id: req.params.id, role: 'client' });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    
    const newPassword = generateSecurePassword();
    client.password = newPassword;  // pre-save hook will hash AND save plainPassword
    await client.save();
    
    res.status(200).json({
      success: true,
      message: 'Password reset successfully!',
      newPassword: newPassword
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// DEACTIVATE CLIENT (Soft Delete)
// ============================================
router.delete('/clients/:id', protect, admin, async (req, res) => {
  try {
    const client = await User.findOne({ _id: req.params.id, role: 'client' });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    
    client.isActive = false;
    await client.save();
    
    res.status(200).json({ success: true, message: 'Client deactivated!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// PERMANENTLY DELETE CLIENT
// ============================================
router.delete('/clients/:id/permanent', protect, admin, async (req, res) => {
  try {
    const client = await User.findOneAndDelete({ _id: req.params.id, role: 'client' });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    
    res.status(200).json({ success: true, message: 'Client permanently deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// CREATE PROJECT FOR CLIENT
// ============================================
router.post('/projects', protect, admin, async (req, res) => {
  try {
    const { clientId, name, description, type, totalBudget, currency, startDate, expectedDeliveryDate } = req.body;
    
    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    
    const project = await Project.create({
      name,
      description: description || '',
      type: type || 'Website',
      clientId: client._id,
      clientEmail: client.email,
      clientName: client.fullName,
      totalBudget: totalBudget || 0,
      currency: currency || 'GBP',
      startDate: startDate ? new Date(startDate) : null,
      expectedDeliveryDate: expectedDeliveryDate ? new Date(expectedDeliveryDate) : null,
      status: 'Planning',
      overallProgress: 0,
    });
    
    res.status(201).json({ success: true, message: 'Project created!', project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// GET ALL PROJECTS
// ============================================
router.get('/projects', protect, admin, async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// GET PROJECTS BY CLIENT
// ============================================
router.get('/projects/client/:clientId', protect, admin, async (req, res) => {
  try {
    const projects = await Project.find({ clientId: req.params.clientId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// UPDATE PROJECT
// ============================================
router.put('/projects/:id', protect, admin, async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.expectedDeliveryDate) updateData.expectedDeliveryDate = new Date(updateData.expectedDeliveryDate);
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    res.status(200).json({ success: true, message: 'Project updated!', project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// DELETE PROJECT
// ============================================
router.delete('/projects/:id', protect, admin, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.status(200).json({ success: true, message: 'Project deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;