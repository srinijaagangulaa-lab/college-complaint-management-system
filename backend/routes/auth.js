const express = require('express');
const { body, validationResult } = require('express-validator');

const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { protect } = require('../middleware/auth');

const router = express.Router();

/*
|--------------------------------------------------------------------------
| REGISTER STUDENT
| POST /api/auth/register
|--------------------------------------------------------------------------
*/
router.post(
  '/register',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required'),

    body('email')
      .trim()
      .isEmail()
      .withMessage('Valid email is required'),

    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
          errors: errors.array(),
        });
      }

      const {
        name,
        email,
        password,
        studentId,
        department,
        phone,
      } = req.body;

      // Normalize email
      const normalizedEmail = email.trim().toLowerCase();

      // Check existing user
      const userExists = await User.findOne({
        email: normalizedEmail,
      });

      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email',
        });
      }

      // Create student
      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        studentId: studentId || '',
        department: department || '',
        phone: phone || '',
        role: 'student',
      });

      // Generate JWT
      const token = generateToken(user);

      console.log(`Registration successful: ${normalizedEmail}`);

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          studentId: user.studentId,
          department: user.department,
          phone: user.phone,
        },
        token,
      });
    } catch (error) {
      console.error('Registration error:', error);

      return res.status(500).json({
        success: false,
        message: 'Registration failed. Please try again.',
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| LOGIN
| POST /api/auth/login
|--------------------------------------------------------------------------
*/
router.post(
  '/login',
  [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Valid email is required'),

    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
          errors: errors.array(),
        });
      }

      const email = req.body.email.trim().toLowerCase();
      const password = req.body.password;

      // Find user
      const user = await User.findOne({ email });

      if (!user) {
        console.log(`Login failed: user not found - ${email}`);

        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      // Check password
      const passwordMatches = await user.matchPassword(password);

      if (!passwordMatches) {
        console.log(`Login failed: incorrect password - ${email}`);

        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT
      const token = generateToken(user);

      console.log(`Login successful: ${email}`);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          studentId: user.studentId,
          department: user.department,
          phone: user.phone,
        },
        token,
      });
    } catch (error) {
      console.error('Login error:', error);

      return res.status(500).json({
        success: false,
        message: 'Login failed. Please try again.',
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| GET CURRENT USER
| GET /api/auth/me
|--------------------------------------------------------------------------
*/
router.get('/me', protect, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        studentId: req.user.studentId,
        department: req.user.department,
        phone: req.user.phone,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to get user information',
    });
  }
});

/*
|--------------------------------------------------------------------------
| LOGOUT
| POST /api/auth/logout
|--------------------------------------------------------------------------
*/
router.post('/logout', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

module.exports = router;