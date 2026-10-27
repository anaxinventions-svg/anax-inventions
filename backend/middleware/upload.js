// backend/middleware/upload.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const path = require('path');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req, file) => {
      // Organize by type
      if (req.baseUrl && req.baseUrl.includes('services')) return 'anax/services';
      if (req.baseUrl && req.baseUrl.includes('projects')) return 'anax/projects';
      if (req.baseUrl && req.baseUrl.includes('testimonials')) return 'anax/testimonials';
      if (req.baseUrl && req.baseUrl.includes('banner')) return 'anax/banners';
      if (req.baseUrl && req.baseUrl.includes('pages')) return 'anax/pages';
      return 'anax/uploads';
    },
    format: async (req, file) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (ext === '.png') return 'png';
      if (ext === '.jpg' || ext === '.jpeg') return 'jpg';
      if (ext === '.webp') return 'webp';
      if (ext === '.gif') return 'gif';
      return 'jpg';
    },
    public_id: (req, file) => {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000);
      const name = path.parse(file.originalname).name.replace(/\s+/g, '-').substring(0, 50);
      return `${name}-${timestamp}-${random}`;
    },
    transformation: [
      { width: 1200, quality: 'auto', fetch_format: 'auto' }
    ]
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

// Helper function to delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Cloudinary delete result:', result);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return null;
  }
};

// Extract public ID from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  // URL format: https://res.cloudinary.com/.../upload/v1234567890/folder/image-name.jpg
  const parts = url.split('/upload/');
  if (parts.length < 2) return null;
  const publicIdWithExt = parts[1].split('/').slice(1).join('/');
  const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
  return publicId;
};

module.exports = {
  upload,
  deleteFromCloudinary,
  getPublicIdFromUrl,
  cloudinary
};