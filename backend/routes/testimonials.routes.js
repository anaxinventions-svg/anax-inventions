const express = require('express');
const Testimonial = require('../models/Testimonial');
const { protect, admin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

// GET ALL (Public)
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET ALL (Admin)
router.get('/admin', protect, admin, async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { name, role, quote, rating, project } = req.body;
    const data = {
      name, role: role || '', quote,
      rating: rating || 5, project: project || '',
    };
    if (req.file) data.image = req.file.path;
    else if (req.body.imageUrl) data.image = req.body.imageUrl;
    const testimonial = await Testimonial.create(data);
    res.status(201).json({ success: true, message: 'Created!', testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { name, role, quote, rating, project, isActive } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (quote !== undefined) updateData.quote = quote;
    if (rating !== undefined) updateData.rating = rating;
    if (project !== undefined) updateData.project = project;
    if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;
    if (req.file) updateData.image = req.file.path;
    else if (req.body.imageUrl) updateData.image = req.body.imageUrl;
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!testimonial) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Updated!', testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;