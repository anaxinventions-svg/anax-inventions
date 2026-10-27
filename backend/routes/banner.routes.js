const express = require('express');
const BannerService = require('../models/BannerService');
const { protect, admin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');  // ✅ FIXED: Destructure upload
const router = express.Router();

// GET ALL (Public - only active)
router.get('/', async (req, res) => {
  try {
    const services = await BannerService.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET ALL (Admin)
router.get('/admin', protect, admin, async (req, res) => {
  try {
    const services = await BannerService.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { mainService, title, subtitle, description, features, icon, order } = req.body;
    
    const data = {
      mainService,
      title,
      subtitle: subtitle || '',
      description: description || '',
      features: features ? features.split(',').map(f => f.trim()).filter(Boolean) : [],
      icon: icon || 'FaCode',
      order: order || 0,
    };

    if (req.file) data.image = req.file.path;
    else if (req.body.imageUrl) data.image = req.body.imageUrl;

    const service = await BannerService.create(data);
    res.status(201).json({ success: true, message: 'Created!', service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { mainService, title, subtitle, description, features, icon, order, isActive } = req.body;
    
    const updateData = {};
    if (mainService !== undefined) updateData.mainService = mainService;
    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (description !== undefined) updateData.description = description;
    if (features !== undefined) updateData.features = features.split(',').map(f => f.trim()).filter(Boolean);
    if (icon !== undefined) updateData.icon = icon;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;

    if (req.file) updateData.image = req.file.path;
    else if (req.body.imageUrl) updateData.image = req.body.imageUrl;

    const service = await BannerService.findByIdAndUpdate(req.params.id, updateData, {
      new: true, runValidators: true,
    });
    
    if (!service) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Updated!', service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const service = await BannerService.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;