const express = require('express');
const Category = require('../models/Category');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// ============================================
// GET ALL ACTIVE CATEGORIES (Public)
// ============================================
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1, name: 1 });
    
    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// GET ALL CATEGORIES (Admin)
// ============================================
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// CREATE CATEGORY
// ============================================
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, icon, order, description, isActive } = req.body;
    
    // Check if category with same name exists
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: 'Category with this name already exists' 
      });
    }
    
    const category = await Category.create({
      name: name.trim(),
      icon: icon || 'fa-folder',
      order: order || 0,
      description: description || '',
      isActive: isActive !== false
    });
    
    res.status(201).json({ success: true, message: 'Category created!', category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// UPDATE CATEGORY
// ============================================
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, icon, order, description, isActive } = req.body;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (icon !== undefined) updateData.icon = icon;
    if (order !== undefined) updateData.order = order;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    const category = await Category.findByIdAndUpdate(req.params.id, updateData, {
      new: true, runValidators: true
    });
    
    if (!category) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Updated!', category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// DELETE CATEGORY
// ============================================
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;