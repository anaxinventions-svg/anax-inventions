const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { protect, admin } = require('../middleware/auth');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Cloudinary if credentials exist
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('✅ Cloudinary configured for uploads');
}

// Configure multer storage (local backup - optional, but kept for fallback)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'upload-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Helper function to upload to Cloudinary
const uploadToCloudinary = (filePath, folder = 'anax-uploads') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder: folder,
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        width: 1200,
        crop: 'limit'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

// ============================================
// @route   POST /api/upload
// @desc    Upload image (ADMIN) - Cloudinary primary, local backup
// ============================================
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    let imageUrl = '';
    let publicId = '';

    // Try Cloudinary first (if configured)
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        // Determine folder based on request body or default
        const folder = req.body.folder || 'anax-uploads';
        const result = await uploadToCloudinary(req.file.path, folder);
        
        imageUrl = result.secure_url;
        publicId = result.public_id;
        console.log('✅ Uploaded to Cloudinary:', imageUrl);
        
        // Delete local file after successful cloudinary upload
        fs.unlink(req.file.path, (err) => {
          if (err) console.log('Could not delete local file:', err);
        });
        
        return res.json({ 
          success: true, 
          url: imageUrl,
          publicId: publicId,
          message: 'Image uploaded to Cloudinary successfully!'
        });
        
      } catch (cloudinaryError) {
        console.log('⚠️ Cloudinary upload failed, using local file:', cloudinaryError.message);
        // Fallback to local URL
        imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      }
    } else {
      // Use local URL only
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // If Cloudinary not configured or failed, return local URL
    res.json({ 
      success: true, 
      url: imageUrl,
      filename: req.file.filename,
      message: 'Image uploaded locally (Cloudinary not configured)'
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// @route   POST /api/upload/multiple
// @desc    Upload multiple images (ADMIN)
// ============================================
router.post('/multiple', protect, admin, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const uploadedImages = [];
    const folder = req.body.folder || 'anax-uploads';

    for (const file of req.files) {
      let imageUrl = '';
      let publicId = '';

      if (process.env.CLOUDINARY_CLOUD_NAME) {
        try {
          const result = await uploadToCloudinary(file.path, folder);
          imageUrl = result.secure_url;
          publicId = result.public_id;
          
          fs.unlink(file.path, (err) => {
            if (err) console.log('Could not delete local file:', err);
          });
        } catch (err) {
          imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        }
      } else {
        imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
      }

      uploadedImages.push({ url: imageUrl, publicId });
    }

    res.json({ 
      success: true, 
      images: uploadedImages,
      message: `${uploadedImages.length} images uploaded successfully!`
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// @route   DELETE /api/upload
// @desc    Delete image from Cloudinary/local
// ============================================
router.delete('/', protect, admin, async (req, res) => {
  try {
    const { publicId, filename, imageUrl } = req.body;
    let deleted = false;
    
    // Delete from Cloudinary if publicId exists
    if (publicId && process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        const result = await cloudinary.uploader.destroy(publicId);
        if (result.result === 'ok') {
          deleted = true;
          console.log('✅ Deleted from Cloudinary:', publicId);
        }
      } catch (err) {
        console.log('Cloudinary delete error:', err.message);
      }
    }
    
    // If publicId not provided but imageUrl has cloudinary URL, extract publicId
    if (!publicId && imageUrl && imageUrl.includes('cloudinary') && process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        const parts = imageUrl.split('/upload/');
        if (parts.length >= 2) {
          const publicIdWithExt = parts[1].split('/').slice(1).join('/');
          const extractedPublicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
          const result = await cloudinary.uploader.destroy(extractedPublicId);
          if (result.result === 'ok') {
            deleted = true;
            console.log('✅ Deleted from Cloudinary (extracted):', extractedPublicId);
          }
        }
      } catch (err) {
        console.log('Cloudinary delete error:', err.message);
      }
    }
    
    // Delete local file if filename exists
    if (filename) {
      const filePath = path.join(uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('✅ Deleted local file:', filename);
        deleted = true;
      }
    }
    
    res.json({ 
      success: true, 
      message: deleted ? 'Image deleted successfully' : 'Image may have already been deleted',
      deleted 
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// @route   DELETE /api/upload/all
// @desc    Delete all temporary uploads (cleanup)
// ============================================
router.delete('/all', protect, admin, async (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    let deletedCount = 0;
    
    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      fs.unlinkSync(filePath);
      deletedCount++;
    }
    
    res.json({ 
      success: true, 
      message: `${deletedCount} temporary files deleted successfully!`
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;