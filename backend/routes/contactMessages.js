const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const { protect, admin } = require('../middleware/auth');

// ==========================================
// ✅ PUBLIC ROUTE - Website se form submit
// ==========================================
router.post('/submit', async (req, res) => {
  try {
    const {
      name, email, phone, country, company,
      website, budget, service, message
    } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and message are required'
      });
    }

    const contactMessage = new ContactMessage({
      name,
      email,
      phone: phone || '',
      country: country || '',
      company: company || '',
      website: website || '',
      budget: budget || '',
      service: service || '',
      message,
      source: 'Website Contact Form',
      status: 'New',
      ipAddress: req.ip || req.connection.remoteAddress || '',
      submittedAt: new Date()
    });

    const saved = await contactMessage.save();

    console.log('✅ New Contact Message:', {
      id: saved._id,
      name: saved.name,
      email: saved.email,
      service: saved.service || 'N/A',
      time: saved.submittedAt
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you within 24 hours.',
      data: {
        id: saved._id,
        name: saved.name,
        submittedAt: saved.submittedAt
      }
    });

  } catch (error) {
    console.error('❌ Contact Submit Error:', error);
    
    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to submit message. Please try again later.'
    });
  }
});

// ==========================================
// ✅ ADMIN ROUTES - Protected
// ==========================================

// GET - All Messages with Filters & Stats
router.get('/', protect, admin, async (req, res) => {
  try {
    const { 
      status, 
      page = 1, 
      limit = 20, 
      search,
      startDate,
      endDate,
      sortBy = 'submittedAt',
      sortOrder = 'desc'
    } = req.query;

    let query = {};

    // Status Filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Date Range Filter
    if (startDate || endDate) {
      query.submittedAt = {};
      if (startDate) query.submittedAt.$gte = new Date(startDate);
      if (endDate) query.submittedAt.$lte = new Date(endDate);
    }

    // Search Filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute Query
    const [messages, total] = await Promise.all([
      ContactMessage.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v'), // Exclude version key
      ContactMessage.countDocuments(query)
    ]);

    // Stats for Dashboard Cards
    const stats = {
      total,
      new: await ContactMessage.countDocuments({ status: 'New' }),
      read: await ContactMessage.countDocuments({ status: 'Read' }),
      replied: await ContactMessage.countDocuments({ status: 'Replied' }),
      archived: await ContactMessage.countDocuments({ status: 'Archived' })
    };

    res.json({
      success: true,
      data: messages,
      stats,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('❌ Fetch Messages Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
});

// GET - Single Message Detail
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Auto mark as Read when admin views it
    if (message.status === 'New') {
      message.status = 'Read';
      await message.save();
    }

    res.json({
      success: true,
      data: message
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch message details'
    });
  }
});

// PUT - Update Message Status & Notes
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { status, adminNotes, assignedTo } = req.body;

    const updateFields = {};
    if (status) updateFields.status = status;
    if (adminNotes !== undefined) updateFields.adminNotes = adminNotes;
    if (assignedTo !== undefined) updateFields.assignedTo = assignedTo;

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    console.log(`✅ Message ${req.params.id} updated:`, updateFields);

    res.json({
      success: true,
      message: 'Message updated successfully',
      data: message
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update message'
    });
  }
});

// DELETE - Delete Message
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    console.log(`🗑️ Message deleted: ${req.params.id}`);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete message'
    });
  }
});

// POST - Bulk Delete
router.post('/bulk-delete', protect, admin, async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide message IDs to delete'
      });
    }

    const result = await ContactMessage.deleteMany({
      _id: { $in: ids }
    });

    res.json({
      success: true,
      message: `${result.deletedCount} messages deleted successfully`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete messages'
    });
  }
});

// GET - Export Messages (CSV/JSON)
router.get('/export/data', protect, admin, async (req, res) => {
  try {
    const { format = 'json', status } = req.query;

    let query = {};
    if (status && status !== 'All') {
      query.status = status;
    }

    const messages = await ContactMessage.find(query)
      .sort({ submittedAt: -1 })
      .select('-__v');

    if (format === 'csv') {
      // Simple CSV conversion
      const csvHeaders = 'Name,Email,Phone,Country,Company,Website,Budget,Service,Message,Status,Date\n';
      const csvRows = messages.map(m => 
        `"${m.name}","${m.email}","${m.phone}","${m.country}","${m.company}","${m.website}","${m.budget}","${m.service}","${m.message.replace(/"/g, '""')}","${m.status}","${m.submittedAt}"`
      ).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=contact-messages.csv');
      return res.send(csvHeaders + csvRows);
    }

    res.json({
      success: true,
      count: messages.length,
      data: messages
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to export messages'
    });
  }
});

module.exports = router;