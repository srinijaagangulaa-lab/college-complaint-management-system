const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: 3,
      maxlength: 150,
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },

    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },

    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },

    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    attachmentUrl: {
      type: String,
      default: null,
    },

    attachmentName: {
      type: String,
      default: null,
    },

    attachment: {
      filename: { type: String, default: null },
      url: { type: String, default: null },
      fileType: { type: String, default: null },
      fileSize: { type: Number, default: 0 },
      originalName: { type: String, default: null },
      data: { type: Buffer, default: null },
      mimetype: { type: String, default: null },
    },

    status: {
      type: String,
      enum: [
        'submitted',
        'under_review',
        'assigned',
        'in_progress',
        'resolved',
        'closed',
        'rejected',
      ],
      default: 'submitted',
    },

    assignedDepartment: {
      type: String,
      trim: true,
      default: null,
    },

    assignedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    adminResponse: {
      type: String,
      default: '',
      trim: true,
    },

    resolutionDetails: {
      description: { type: String, default: '' },
      resolvedAt: { type: Date, default: null },
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
      attachments: [{ filename: String, url: String, originalName: String }],
    },

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    closedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property 'student' mapping to submittedBy for frontend compatibility
complaintSchema.virtual('student').get(function () {
  return this.submittedBy;
});

module.exports = mongoose.model('Complaint', complaintSchema);