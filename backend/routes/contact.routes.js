const express = require('express');
const ContactContent = require('../models/ContactContent');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// GET (Public)
router.get('/', async (req, res) => {
  try {
    let content = await ContactContent.findOne();
    if (!content) {
      content = await ContactContent.create({});
    }
    res.status(200).json({ success: true, content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE (Admin)
router.put('/', protect, admin, async (req, res) => {
  try {
    let content = await ContactContent.findOne();
    if (!content) content = new ContactContent();
    
    const fields = [
      'heroTag', 'heroTitle', 'heroDescription',
      'whatsappNumber', 'whatsappText', 'whatsappSubtitle',
      'emailPrimary', 'emailSecondary', 'emailSubtitle',
      'addressLine1', 'addressLine2', 'addressSubtitle', 'googleMapsLink',
      'socialLinks', 'ctaTitle', 'ctaText', 'ctaWhatsappNumber',
    ];
    
    fields.forEach(f => {
      if (req.body[f] !== undefined) content[f] = req.body[f];
    });
    
    await content.save();
    res.status(200).json({ success: true, message: 'Contact page updated!', content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;