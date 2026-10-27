const express = require('express');
const FooterContent = require('../models/FooterContent');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// GET (Public)
router.get('/', async (req, res) => {
  try {
    let content = await FooterContent.findOne();
    if (!content) {
      content = await FooterContent.create({
        socialLinks: [
          { platform: 'WhatsApp', icon: 'whatsapp', url: 'https://wa.me/923001234567' },
          { platform: 'Instagram', icon: 'instagram', url: 'https://instagram.com/anaxinventions' },
          { platform: 'Facebook', icon: 'facebook', url: 'https://facebook.com/anaxinventions' },
          { platform: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com/company/anaxinventions' },
          { platform: 'Twitter', icon: 'twitter', url: 'https://twitter.com/anaxinventions' },
        ],
        linkSections: [
          { title: 'Services', links: [{ name: 'Web Development', path: '/services' }, { name: 'UI/UX Design', path: '/services' }] },
          { title: 'Company', links: [{ name: 'About Us', path: '/about' }, { name: 'Portfolio', path: '/portfolio' }] },
          { title: 'Resources', links: [{ name: 'FAQ', path: '/faq' }, { name: 'Privacy', path: '/privacy' }] },
        ],
        bottomLinks: [{ name: 'Terms', path: '/terms' }, { name: 'Privacy', path: '/privacy' }],
      });
    }
    res.status(200).json({ success: true, content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE (Admin)
router.put('/', protect, admin, async (req, res) => {
  try {
    let content = await FooterContent.findOne();
    if (!content) content = new FooterContent();
    
    const { address, phone, email, description, socialLinks, linkSections, copyright, bottomLinks } = req.body;
    if (address !== undefined) content.address = address;
    if (phone !== undefined) content.phone = phone;
    if (email !== undefined) content.email = email;
    if (description !== undefined) content.description = description;
    if (socialLinks !== undefined) content.socialLinks = socialLinks;
    if (linkSections !== undefined) content.linkSections = linkSections;
    if (copyright !== undefined) content.copyright = copyright;
    if (bottomLinks !== undefined) content.bottomLinks = bottomLinks;
    
    await content.save();
    res.status(200).json({ success: true, message: 'Footer updated!', content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router; 