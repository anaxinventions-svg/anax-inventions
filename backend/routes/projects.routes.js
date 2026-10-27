const express = require('express');
const Project = require('../models/Project');
const { protect, admin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

// GET ALL (Public - only active)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET ALL (Admin)
router.get('/admin', protect, admin, async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { title, category, description, tags, statsUsers, statsRating, link, order } = req.body;
    
    const data = {
      title,
      category: category || 'Web App',
      description: description || '',
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      stats: { users: statsUsers || '0', rating: statsRating || '5.0' },
      link: link || '/portfolio',
      order: order || 0,
    };

    if (req.file) data.image = req.file.path;
    else if (req.body.imageUrl) data.image = req.body.imageUrl;

    const project = await Project.create(data);
    res.status(201).json({ success: true, message: 'Created!', project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { title, category, description, tags, statsUsers, statsRating, link, order, isActive } = req.body;
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (tags !== undefined) updateData.tags = tags.split(',').map(t => t.trim()).filter(Boolean);
    if (statsUsers !== undefined || statsRating !== undefined) {
      updateData.stats = {};
      if (statsUsers !== undefined) updateData.stats.users = statsUsers;
      if (statsRating !== undefined) updateData.stats.rating = statsRating;
    }
    if (link !== undefined) updateData.link = link;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;

    if (req.file) updateData.image = req.file.path;
    else if (req.body.imageUrl) updateData.image = req.body.imageUrl;

    const project = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Updated!', project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;