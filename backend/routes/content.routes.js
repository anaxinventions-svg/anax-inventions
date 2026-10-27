const express = require('express');
const HeroContent = require('../models/HeroContent');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// ============================================
// GET Hero Content (PUBLIC)
// ============================================
router.get('/hero', async (req, res) => {
  try {
    let content = await HeroContent.findOne();
    
    // If no content exists, create default
    if (!content) {
      content = await HeroContent.create({});
    }
    
    res.status(200).json({ success: true, content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// UPDATE Hero Content (ADMIN ONLY)
// ============================================
router.put('/hero', protect, admin, async (req, res) => {
  try {
    const {
      badge, headingLine1, headingLine2, headingLine3,
      description, button1Text, button1Link, button2Text, button2Link
    } = req.body;
    
    let content = await HeroContent.findOne();
    
    if (!content) {
      content = new HeroContent({});
    }
    
    // Update fields
    if (badge !== undefined) content.badge = badge;
    if (headingLine1 !== undefined) content.headingLine1 = headingLine1;
    if (headingLine2 !== undefined) content.headingLine2 = headingLine2;
    if (headingLine3 !== undefined) content.headingLine3 = headingLine3;
    if (description !== undefined) content.description = description;
    if (button1Text !== undefined) content.button1Text = button1Text;
    if (button1Link !== undefined) content.button1Link = button1Link;
    if (button2Text !== undefined) content.button2Text = button2Text;
    if (button2Link !== undefined) content.button2Link = button2Link;
    
    await content.save();
    
    res.status(200).json({ success: true, message: 'Hero content updated!', content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;