const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const User = require('../models/User');
const { dbState } = require('../utils/memoryStore');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this resource. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    let user;
    if (dbState.isInMemory) {
      user = dbState.users.find((u) => u._id.toString() === decoded.id.toString());
      if (user) {
        // Clone without passwordHash
        const { passwordHash, ...safeUser } = user;
        user = safeUser;
      }
    } else {
      user = await User.findById(decoded.id).select('-passwordHash');
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
      error: error.message,
    });
  }
};

module.exports = { protect };
