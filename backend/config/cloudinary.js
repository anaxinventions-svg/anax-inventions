const cloudinary = require('cloudinary').v2;

// Force reload .env
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verify config loaded
console.log('✅ Cloudinary Config:', {
  cloud: cloudinary.config().cloud_name,
  key: cloudinary.config().api_key ? 'SET' : 'MISSING',
  secret: cloudinary.config().api_secret ? 'SET' : 'MISSING',
});

module.exports = cloudinary;