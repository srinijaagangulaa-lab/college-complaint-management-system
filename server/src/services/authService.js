const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

const registerUser = async (userData) => {
  const { name, email, password, studentId, department, phone, role } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    const error = new Error('User already exists with this email address');
    error.statusCode = 400;
    throw error;
  }

  const passwordHash = await User.hashPassword(password);

  const newUser = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: role === 'admin' ? 'admin' : 'student',
    studentId: studentId || null,
    department: department || 'General',
    phone: phone || '',
  });

  const token = generateToken(newUser._id);

  return {
    user: newUser,
    token,
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  console.log('[LOGIN DEBUG]', {
    email: user.email,
    role: user.role,
    passwordReceived: typeof password === 'string' && password.length > 0,
    passwordHashExists: typeof user.passwordHash === 'string' && user.passwordHash.length > 0,
  });
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id);

  return {
    user,
    token,
  };
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

module.exports = {
  generateToken,
  registerUser,
  loginUser,
  getUserProfile,
};
