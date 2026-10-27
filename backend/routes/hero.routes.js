const express = require('express');
const router = express.Router();
const Hero = require('../models/Hero');
const auth = require('../middleware/auth');

// @route   GET /api/hero
// @desc    Get hero content (PUBLIC)
router.get('/', async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) {
      hero = await Hero.create({});
    }
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/hero
// @desc    Update hero content (ADMIN ONLY)
router.put('/', auth, async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: Date.now()
    };

    let hero = await Hero.findOneAndUpdate(
      {},
      updateData,
      { new: true, upsert: true }
    );

    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;