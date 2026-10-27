// backend/routes/services.routes.js - UPDATED (With Cloudinary Support)
const express = require('express');
const Service = require('../models/Service');
const { protect, admin } = require('../middleware/auth');
const { upload, deleteFromCloudinary, getPublicIdFromUrl } = require('../middleware/upload');

const router = express.Router();

// Helper function to generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// ============================================
// GET ALL ACTIVE SERVICES (Public)
// ============================================
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;
    
    const services = await Service.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Service.countDocuments({ isActive: true });
    
    res.status(200).json({
      success: true,
      services,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalServices: total,
        hasMore: skip + services.length < total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// GET SERVICE BY SLUG (Public)
// ============================================
router.get('/slug/:slug', async (req, res) => {
  try {
    const service = await Service.findOne({ 
      slug: req.params.slug,
      isActive: true 
    });
    
    if (!service) {
      return res.status(404).json({ 
        success: false, 
        message: 'Service not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      service
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// ============================================
// GET SERVICE BY ID (Public)
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const isValidId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    
    if (!isValidId) {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid service ID' 
      });
    }
    
    const service = await Service.findOne({ 
      _id: req.params.id,
      isActive: true 
    });
    
    if (!service) {
      return res.status(404).json({ 
        success: false, 
        message: 'Service not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      service
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// ============================================
// GET ALL SERVICES (Admin - Including inactive)
// ============================================
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// CREATE SERVICE (With Cloudinary Support)
// ============================================
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, description, features, order, icon, category } = req.body;
    
    // Generate slug from title
    let slug = generateSlug(title);
    
    // Check if slug already exists
    let existingSlug = await Service.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }
    
    const serviceData = {
      title,
      slug,
      subtitle: subtitle || '',
      description: description || '',
      features: features ? features.split(',').map(f => f.trim()).filter(Boolean) : [],
      order: order || 0,
      icon: icon || 'fa-cube',
      category: category || 'development',
    };

    // ✅ Handle image from Cloudinary or URL
    if (req.file) {
      serviceData.image = req.file.path; // Cloudinary URL
    } else if (req.body.imageUrl) {
      serviceData.image = req.body.imageUrl;
    }

    const service = await Service.create(serviceData);
    res.status(201).json({ success: true, message: 'Service created!', service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// UPDATE SERVICE (With Cloudinary Support - Old Image Deletion)
// ============================================
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, description, features, order, isActive, icon, category } = req.body;
    
    // ✅ Get existing service to check old image
    const existingService = await Service.findById(req.params.id);
    if (!existingService) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    
    const updateData = {};
    
    if (title !== undefined) {
      updateData.title = title;
      // Update slug when title changes
      let newSlug = generateSlug(title);
      
      // Check if new slug already exists
      const existingSlug = await Service.findOne({ slug: newSlug, _id: { $ne: req.params.id } });
      if (existingSlug) {
        newSlug = `${newSlug}-${Date.now()}`;
      }
      updateData.slug = newSlug;
    }
    
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (description !== undefined) updateData.description = description;
    if (features !== undefined) updateData.features = features.split(',').map(f => f.trim()).filter(Boolean);
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;
    if (icon !== undefined) updateData.icon = icon;
    if (category !== undefined) updateData.category = category;

    // ✅ Handle image update - delete old from Cloudinary
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (existingService.image && existingService.image.includes('cloudinary')) {
        const oldPublicId = getPublicIdFromUrl(existingService.image);
        if (oldPublicId) {
          await deleteFromCloudinary(oldPublicId);
          console.log('✅ Deleted old image from Cloudinary');
        }
      }
      updateData.image = req.file.path;
    } else if (req.body.imageUrl) {
      updateData.image = req.body.imageUrl;
    }

    const service = await Service.findByIdAndUpdate(req.params.id, updateData, {
      new: true, runValidators: true,
    });
    
    if (!service) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Updated!', service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// DELETE SERVICE (With Cloudinary Image Deletion)
// ============================================
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Not found' });
    
    // ✅ Delete image from Cloudinary if exists
    if (service.image && service.image.includes('cloudinary')) {
      const publicId = getPublicIdFromUrl(service.image);
      if (publicId) {
        await deleteFromCloudinary(publicId);
        console.log('✅ Deleted image from Cloudinary');
      }
    }
    
    await Service.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// MIGRATE EXISTING SERVICES (Add Slugs)
// ============================================
router.post('/migrate-slugs', protect, admin, async (req, res) => {
  try {
    const services = await Service.find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }] });
    
    let updated = 0;
    for (let service of services) {
      let newSlug = generateSlug(service.title);
      
      const existing = await Service.findOne({ slug: newSlug, _id: { $ne: service._id } });
      if (existing) {
        newSlug = `${newSlug}-${Math.floor(Math.random() * 1000)}`;
      }
      
      service.slug = newSlug;
      await service.save();
      updated++;
    }
    
    res.status(200).json({
      success: true,
      message: `${updated} services updated with slugs!`,
      updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// UPDATE CATEGORIES BULK (For migration)
// ============================================
router.post('/migrate-categories', protect, admin, async (req, res) => {
  try {
    const { mappings } = req.body;
    
    let updated = 0;
    for (const [oldCat, newCat] of Object.entries(mappings)) {
      const result = await Service.updateMany(
        { category: oldCat },
        { $set: { category: newCat } }
      );
      updated += result.modifiedCount;
    }
    
    res.status(200).json({
      success: true,
      message: `${updated} services updated with new categories!`,
      updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;