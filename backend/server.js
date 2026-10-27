const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Routes
const authRoutes = require('./routes/auth.routes');
const contentRoutes = require('./routes/content.routes');
const servicesRoutes = require('./routes/services.routes');
const bannerRoutes = require('./routes/banner.routes');
const projectsRoutes = require('./routes/projects.routes');
const testimonialRoutes = require('./routes/testimonials.routes');
const footerRoutes = require('./routes/footer.routes');
const contactRoutes = require('./routes/contact.routes');
const contactMessagesRoutes = require('./routes/contactMessages');
const adminRoutes = require('./routes/admin.routes');
const clientRoutes = require('./routes/client.routes');
const uploadRoutes = require('./routes/upload.routes');

// ✅ NEW: Categories Routes
const categoriesRoutes = require('./routes/categories');

// ✅ NEW: Pages Routes (Dynamic Page Content)
const pageRoutes = require('./routes/pages.routes');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

// Requirements Routes
let clientRequirementsRoutes;
let adminRequirementsRoutes;

try {
  clientRequirementsRoutes = require('./routes/client.requirements');
  console.log('✅ Loaded: client.requirements.js');
} catch(e) {
  try {
    clientRequirementsRoutes = require('./routes/client-requirements');
    console.log('✅ Loaded: client-requirements.js');
  } catch(e2) {
    console.error('❌ Could not load client requirements routes');
    clientRequirementsRoutes = (req, res) => res.status(404).json({ error: 'Requirements routes not found' });
  }
}

try {
  adminRequirementsRoutes = require('./routes/admin.requirements');
  console.log('✅ Loaded: admin.requirements.js');
} catch(e) {
  try {
    adminRequirementsRoutes = require('./routes/admin-requirements');
    console.log('✅ Loaded: admin-requirements.js');
  } catch(e2) {
    console.error('❌ Could not load admin requirements routes');
    adminRequirementsRoutes = (req, res) => res.status(404).json({ error: 'Admin requirements routes not found' });
  }
}

// Proposals Routes
let adminProposalsRoutes;

try {
  adminProposalsRoutes = require('./routes/admin.proposals');
  console.log('✅ Loaded: admin.proposals.js');
} catch(e) {
  try {
    adminProposalsRoutes = require('./routes/admin-proposals');
    console.log('✅ Loaded: admin-proposals.js');
  } catch(e2) {
    console.error('❌ Could not load admin proposals routes');
    adminProposalsRoutes = (req, res) => res.status(404).json({ error: 'Proposals routes not found' });
  }
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS Configuration
app.use(cors({ 
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000', process.env.FRONTEND_URL].filter(Boolean), 
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));

// Body Parser with increased limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => { 
    console.log(`${req.method} ${req.url}`); 
    next(); 
  });
}

// ============================================
// HEALTH CHECK ROUTES
// ============================================
app.get('/api/health', (req, res) => res.json({ success: true, message: 'API running!' }));
app.get('/api/test', (req, res) => res.json({ success: true, message: 'API working!' }));

// ============================================
// EXISTING ROUTES
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/banner', bannerRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/footer', footerRoutes);
app.use('/api/contact-page', contactRoutes);
app.use('/api/contact-messages', contactMessagesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/client', clientRoutes);

// ============================================
// ✅ NEW: CATEGORIES ROUTES
// ============================================
app.use('/api/categories', categoriesRoutes);

// ============================================
// ✅ NEW: PAGES ROUTES (Dynamic Page Content)
// ============================================
app.use('/api/pages', pageRoutes);

// ============================================
// REQUIREMENTS ROUTES
// ============================================
app.use('/api/client/requirements', clientRequirementsRoutes);
app.use('/api/admin/requirements', adminRequirementsRoutes);

// ============================================
// CLIENT PROPOSALS ROUTE
// ============================================
app.use('/api/client/proposals', clientRequirementsRoutes);

// ============================================
// ADMIN PROPOSALS ROUTE
// ============================================
app.use('/api/admin/proposals', adminProposalsRoutes);

// ============================================
// 🆕 UPLOAD ROUTES (Images for proposals)
// ============================================
app.use('/api/upload', uploadRoutes);

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.url}` });
});

// ============================================
// ERROR HANDLER
// ============================================
app.use((err, req, res, next) => { 
  console.error('❌ Server Error:', err.message); 
  res.status(500).json({ success: false, message: err.message }); 
});

// ============================================
// DATABASE CONNECTION & SERVER START
// ============================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => { 
    console.log('✅ MongoDB Connected'); 
    app.listen(PORT, () => {
      console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 SERVER RUNNING ON PORT ${PORT}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 Auth Routes:           /api/auth
📌 Admin Routes:          /api/admin
📌 Client Routes:         /api/client
📌 Categories Routes:     /api/categories  ✅
📌 Pages Routes:          /api/pages       ✅ NEW
📌 Services Routes:       /api/services
📌 Requirements Routes:   /api/client/requirements
📌 Admin Requirements:    /api/admin/requirements
📌 Admin Proposals:       /api/admin/proposals
📌 Client Proposals:      /api/client/proposals
📌 Upload Routes:         /api/upload
📌 Static Files:          /uploads
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `);
    });
  })
  .catch(err => { 
    console.error('❌ MongoDB Connection Error:', err.message); 
    process.exit(1); 
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});

module.exports = app;