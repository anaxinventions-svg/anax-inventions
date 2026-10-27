const express = require('express');
const router = express.Router();
const CompanyInfo = require('../models/CompanyInfo');
const auth = require('../middleware/auth');

// @route   GET /api/company
// @desc    Get company info (PUBLIC)
router.get('/', async (req, res) => {
  try {
    let info = await CompanyInfo.findOne();
    if (!info) {
      info = await CompanyInfo.create({});
    }
    res.json(info);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/company
// @desc    Update company info (ADMIN)
router.put('/', auth, async (req, res) => {
  try {
    let info = await CompanyInfo.findOneAndUpdate(
      {},
      { ...req.body, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    res.json(info);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;