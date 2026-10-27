const express = require('express');
const router = express.Router();
const WhyChooseUs = require('../models/WhyChooseUs');
const auth = require('../middleware/auth');

// @route   GET /api/why-choose-us
// @desc    Get why choose us content (PUBLIC)
router.get('/', async (req, res) => {
  try {
    let content = await WhyChooseUs.findOne();
    if (!content) {
      content = await WhyChooseUs.create({
        features: [
          { id: 1, icon: '⚡', title: 'Lightning Fast Delivery', description: 'We deliver projects 40% faster than industry standard.', stat: '40%', statLabel: 'Faster Delivery' },
          { id: 2, icon: '🎯', title: 'Precision Engineering', description: 'Every pixel crafted with surgical precision.', stat: '99.9%', statLabel: 'Uptime' },
          { id: 3, icon: '🛡️', title: 'Enterprise Security', description: 'Bank-grade security protocols.', stat: '256-bit', statLabel: 'Encryption' },
          { id: 4, icon: '🚀', title: 'Scalable Architecture', description: 'Built to grow with you.', stat: '10x', statLabel: 'Scale' }
        ],
        stats: [
          { value: 150, suffix: '+', label: 'Projects Delivered' },
          { value: 98, suffix: '%', label: 'Client Satisfaction' },
          { value: 12, suffix: '+', label: 'Years Experience' },
          { value: 24, suffix: '/7', label: 'Support Available' }
        ]
      });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/why-choose-us
// @desc    Update why choose us (ADMIN)
router.put('/', auth, async (req, res) => {
  try {
    let content = await WhyChooseUs.findOneAndUpdate(
      {},
      { ...req.body, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;