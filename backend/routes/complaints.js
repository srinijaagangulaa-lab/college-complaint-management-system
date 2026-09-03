const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');

const router = express.Router();

const Complaint = require('../models/Complaint');
const ComplaintHistory = require('../models/ComplaintHistory');
const { protect } = require('../middleware/auth');

// ============================================================
// MULTER CONFIGURATION
// ============================================================

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Invalid file type. Allowed: JPG, PNG, WEBP, PDF, DOC, DOCX, TXT'
        ),
        false
      );
    }
  },
});

// ============================================================
// POST - CREATE NEW COMPLAINT
// ============================================================

router.post(
  '/',
  protect,
  upload.single('attachment'),

  async (req, res) => {
    try {
      console.log('CREATE COMPLAINT - USER:', req.user);
      console.log('CREATE COMPLAINT - USER ID:', req.user?._id);
      console.log('CREATE COMPLAINT - BODY:', req.body);

      // --------------------------------------------------------
      // Check authentication
      // --------------------------------------------------------

      if (!req.user || !req.user._id) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required.',
        });
      }

      // --------------------------------------------------------
      // Get form data
      // --------------------------------------------------------

      const {
        title,
        category,
        priority,
        location,
        description,
      } = req.body || {};

      // --------------------------------------------------------
      // Validate title
      // --------------------------------------------------------

      if (!title || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Title is required',
        });
      }

      // --------------------------------------------------------
      // Validate category
      // --------------------------------------------------------

      if (!category || !category.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Category is required',
        });
      }

      // --------------------------------------------------------
      // Validate location
      // --------------------------------------------------------

      if (!location || !location.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Location is required',
        });
      }

      // --------------------------------------------------------
      // Validate description
      // --------------------------------------------------------

      if (!description || !description.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Description is required',
        });
      }

      if (description.trim().length < 10) {
        return res.status(400).json({
          success: false,
          message: 'Description must be at least 10 characters',
        });
      }

      // --------------------------------------------------------
      // Generate Complaint ID
      // --------------------------------------------------------

      const randomNumber = Math.floor(1000 + Math.random() * 9000);

      const complaintId = `CCMS-${Date.now()}-${randomNumber}`;

      // --------------------------------------------------------
      // Build complaint data
      // --------------------------------------------------------

      const complaintData = {
        complaintId,

        title: title.trim(),

        category: category.trim(),

        priority: priority || 'medium',

        location: location.trim(),

        description: description.trim(),

        // ONLY USER REFERENCE
        submittedBy: req.user._id,

        status: 'submitted',
      };

      // --------------------------------------------------------
      // Attachment
      // --------------------------------------------------------

      if (req.file) {
        complaintData.attachment = {
          filename: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          data: req.file.buffer,
        };
      }

      console.log(
        'COMPLAINT DATA BEFORE SAVE:',
        {
          ...complaintData,
          attachment: complaintData.attachment
            ? {
              filename: complaintData.attachment.filename,
              mimetype: complaintData.attachment.mimetype,
              size: complaintData.attachment.size,
            }
            : undefined,
        }
      );

      // --------------------------------------------------------
      // Save complaint
      // --------------------------------------------------------

      const complaint = await Complaint.create(complaintData);

      await ComplaintHistory.create({
        complaint: complaint._id,
        changedBy: req.user._id,
        action: 'created',
        newStatus: 'submitted',
        metadata: { title: complaint.title, category: complaint.category },
      });

      console.log('COMPLAINT CREATED:', complaint._id);
      console.log('COMPLAINT ID:', complaint.complaintId);

      // --------------------------------------------------------
      // Success response
      // --------------------------------------------------------

      return res.status(201).json({
        success: true,

        message: 'Complaint submitted successfully',

        complaint: {
          id: complaint._id,

          complaintId: complaint.complaintId,

          title: complaint.title,

          category: complaint.category,

          priority: complaint.priority,

          location: complaint.location,

          description: complaint.description,

          status: complaint.status,

          submittedBy: complaint.submittedBy,

          createdAt: complaint.createdAt,
        },
      });
    } catch (error) {
      console.error('=================================');
      console.error('CREATE COMPLAINT ERROR');
      console.error(error);
      console.error('=================================');

      // Mongoose validation error
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors)
          .map((err) => err.message)
          .join(', ');

        return res.status(400).json({
          success: false,
          message: `Complaint validation failed: ${messages}`,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to submit complaint',
        error: error.message,
      });
    }
  }
);

// ============================================================
// GET - MY COMPLAINTS
// ============================================================

router.get('/my', protect, async (req, res) => {
  try {
    console.log('GET MY COMPLAINTS - USER:', req.user?._id);

    // --------------------------------------------------------
    // Authentication check
    // --------------------------------------------------------

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required.',
      });
    }

    // --------------------------------------------------------
    // Get complaints submitted by logged-in user
    // --------------------------------------------------------

    const complaints = await Complaint.find({
      submittedBy: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate('submittedBy', 'name email studentId department');

    console.log('MY COMPLAINTS COUNT:', complaints.length);

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error('GET MY COMPLAINTS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch complaints',
      error: error.message,
    });
  }
});

// ============================================================
// GET - ALL COMPLAINTS
// ============================================================

router.get('/', protect, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .populate('submittedBy', 'name email studentId department');

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error('GET COMPLAINTS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch complaints',
      error: error.message,
    });
  }
});

// ============================================================
// GET - SINGLE COMPLAINT
// ============================================================

router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid complaint ID',
      });
    }

    const complaint = await Complaint.findById(id).populate(
      'submittedBy',
      'name email studentId department'
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    return res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error('GET SINGLE COMPLAINT ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch complaint',
      error: error.message,
    });
  }
});

// ============================================================
// GET - COMPLAINT HISTORY
// ============================================================

router.get('/:id/history', protect, async (req, res) => {
  try {
    const { id } = req.params;

    let filter = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      filter = { _id: id };
    } else {
      filter = { complaintId: id };
    }

    const complaint = await Complaint.findOne(filter);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    const history = await ComplaintHistory.find({ complaint: complaint._id })
      .populate('changedBy', 'name email role')
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error('GET COMPLAINT HISTORY ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch complaint history',
      error: error.message,
    });
  }
});

// ============================================================
// DELETE - MY COMPLAINT
// ============================================================

router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    // --------------------------------------------------------
    // Validate ID
    // --------------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid complaint ID',
      });
    }

    // --------------------------------------------------------
    // Find complaint
    // --------------------------------------------------------

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // --------------------------------------------------------
    // Check ownership
    // --------------------------------------------------------

    const submittedById = complaint.submittedBy
      ? complaint.submittedBy.toString()
      : null;

    const currentUserId = req.user._id.toString();

    if (submittedById !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this complaint.',
      });
    }

    // --------------------------------------------------------
    // Delete complaint
    // --------------------------------------------------------

    await Complaint.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully',
    });
  } catch (error) {
    console.error('DELETE COMPLAINT ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete complaint',
      error: error.message,
    });
  }
});

// ============================================================
// MULTER / UPLOAD ERROR HANDLER
// ============================================================

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size must be less than 10MB',
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next();
});

module.exports = router;