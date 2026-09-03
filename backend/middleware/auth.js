const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please login.',
      });
    }

    const secret = process.env.JWT_SECRET || 'ccms_super_secret_jwt_key_college_management_portal_2026';

    // Verify token
    const decoded = jwt.verify(token, secret);

    // Find user
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);

    return res.status(401).json({
      success: false,
      message: 'Not authorized. Invalid or expired token.',
    });
  }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied: Administrator privileges required.',
  });
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user ? req.user.role : 'unauthenticated'}' is not authorized.`,
      });
    }

    next();
  };
};

module.exports = {
  protect,
  adminOnly,
  authorize,
};