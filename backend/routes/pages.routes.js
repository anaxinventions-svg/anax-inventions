// backend/routes/pages.routes.js
const express = require('express');
const PageContent = require('../models/PageContent');
const { protect, admin } = require('../middleware/auth');
const { upload, deleteFromCloudinary, getPublicIdFromUrl } = require('../middleware/upload');

const router = express.Router();

// ============================================
// GET PAGE CONTENT BY SLUG (Public)
// ============================================
router.get('/:pageSlug', async (req, res) => {
  try {
    const page = await PageContent.findOne({ pageSlug: req.params.pageSlug });
    
    if (!page) {
      return res.status(200).json({ 
        success: true, 
        page: null, 
        message: 'Page not configured yet' 
      });
    }
    
    res.status(200).json({ success: true, page });
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// GET ALL PAGES (Admin)
// ============================================
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const pages = await PageContent.find().sort({ pageName: 1 });
    res.status(200).json({ success: true, pages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// CREATE OR UPDATE PAGE (Admin)
// ============================================
router.post('/admin/save', protect, admin, async (req, res) => {
  try {
    const { 
      pageSlug, pageName, category, 
      hero, trustBadge, whatWeOffer, 
      recentProjects, process, technologies, 
      faq, cta 
    } = req.body;
    
    let page = await PageContent.findOne({ pageSlug });
    
    if (page) {
      // Update existing page
      page.pageName = pageName;
      page.category = category;
      page.hero = hero;
      page.trustBadge = trustBadge;
      page.whatWeOffer = whatWeOffer;
      page.recentProjects = recentProjects;
      page.process = process;
      page.technologies = technologies;
      page.faq = faq;
      page.cta = cta;
    } else {
      // Create new page
      page = new PageContent({
        pageSlug, pageName, category,
        hero, trustBadge, whatWeOffer,
        recentProjects, process, technologies,
        faq, cta
      });
    }
    
    await page.save();
    res.status(200).json({ success: true, message: 'Page saved successfully!', page });
  } catch (error) {
    console.error('Save page error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// UPLOAD PAGE IMAGE (Admin)
// ============================================
router.post('/admin/upload-image', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    res.status(200).json({
      success: true,
      imageUrl: req.file.path,
      message: 'Image uploaded successfully!'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// ADD PROJECT TO PAGE (Admin)
// ============================================
router.post('/admin/:pageSlug/project', protect, admin, async (req, res) => {
  try {
    const page = await PageContent.findOne({ pageSlug: req.params.pageSlug });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    
    const { name, category, description, imageUrl, liveUrl, techStack, order } = req.body;
    
    page.recentProjects.projects.push({
      name,
      category: category || '',
      description: description || '',
      imageUrl: imageUrl || '',
      liveUrl: liveUrl || '',
      techStack: techStack || [],
      order: order || page.recentProjects.projects.length,
      isActive: true
    });
    
    await page.save();
    res.status(200).json({ success: true, message: 'Project added!', page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// UPDATE PROJECT (Admin)
// ============================================
router.put('/admin/:pageSlug/project/:projectId', protect, admin, async (req, res) => {
  try {
    const page = await PageContent.findOne({ pageSlug: req.params.pageSlug });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    
    const project = page.recentProjects.projects.id(req.params.projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    const { name, category, description, imageUrl, liveUrl, techStack, order, isActive } = req.body;
    
    if (name !== undefined) project.name = name;
    if (category !== undefined) project.category = category;
    if (description !== undefined) project.description = description;
    if (imageUrl !== undefined) project.imageUrl = imageUrl;
    if (liveUrl !== undefined) project.liveUrl = liveUrl;
    if (techStack !== undefined) project.techStack = techStack;
    if (order !== undefined) project.order = order;
    if (isActive !== undefined) project.isActive = isActive;
    
    await page.save();
    res.status(200).json({ success: true, message: 'Project updated!', page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// DELETE PROJECT (Admin)
// ============================================
router.delete('/admin/:pageSlug/project/:projectId', protect, admin, async (req, res) => {
  try {
    const page = await PageContent.findOne({ pageSlug: req.params.pageSlug });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    
    page.recentProjects.projects = page.recentProjects.projects.filter(
      p => p._id.toString() !== req.params.projectId
    );
    
    await page.save();
    res.status(200).json({ success: true, message: 'Project deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;