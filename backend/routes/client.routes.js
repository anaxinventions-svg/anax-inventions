const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, client } = require('../middleware/auth');

// GET CLIENT'S PROJECTS
router.get('/projects', protect, client, async (req, res) => {
  try {
    const projects = await Project.find({ clientId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET SINGLE PROJECT
router.get('/projects/:id', protect, client, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, clientId: req.user._id });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;