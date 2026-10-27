const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const auth = require('../middleware/auth');

// @route   GET /api/portfolio
// @desc    Get all portfolio items (PUBLIC)
router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query;
    let query = { isActive: true };
    
    if (category && category !== 'all') query.category = category;
    if (featured === 'true') query.featuredOnHome = true;
    
    const items = await Portfolio.find(query).sort({ order: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/portfolio/all
// @desc    Get all portfolio items (ADMIN)
router.get('/all', auth, async (req, res) => {
  try {
    const items = await Portfolio.find().sort({ order: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/portfolio
// @desc    Create portfolio item (ADMIN)
router.post('/', auth, async (req, res) => {
  try {
    const count = await Portfolio.countDocuments();
    const item = new Portfolio({
      ...req.body,
      id: count + 1,
      order: count
    });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/portfolio/:id
// @desc    Update portfolio item (ADMIN)
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Portfolio.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/portfolio/:id
// @desc    Delete portfolio item (ADMIN)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Portfolio.findByIdAndDelete(req.params.id);
    res.json({ message: 'Portfolio item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;