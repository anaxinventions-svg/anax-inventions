const jwt = require('jsonwebtoken');
const User = require('../models/User');

// PROTECT MIDDLEWARE - Authentication
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Please login to access this resource',
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists',
      });
    }
    
    // Check if email is verified
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email first',
      });
    }
    
    // Check if account is active (for clients only)
    if (user.role === 'client' && !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account is not active. Please contact admin.',
      });
    }
    
    // Check if account is locked
    if (user.isLocked && user.isLocked()) {
      const mins = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(423).json({
        success: false,
        message: `Account temporarily locked. Try again in ${mins} minutes`,
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please login again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Please login again.',
    });
  }
};

// ADMIN MIDDLEWARE - Role check
exports.admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Please login first',
    });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access only. This area is restricted.',
    });
  }
  next();
};

// CLIENT MIDDLEWARE - Role check
exports.client = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Please login first',
    });
  }
  
  if (req.user.role !== 'client') {
    return res.status(403).json({
      success: false,
      message: 'Client access only.',
    });
  }
  next();
};