const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a complaint title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a complaint category'],
      enum: [
        'Classroom',
        'Laboratory',
        'Hostel',
        'Wi-Fi/Internet',
        'Infrastructure',
        'Transportation',
        'Cleanliness',
        'Library',
        'Electricity',
        'Water/Sanitation',
        'Other',
      ],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long'],
    },
    location: {
      type: String,
      required: [true, 'Please provide the issue location'],
      trim: true,
    },
    attachment: {
      filename: { type: String, default: null },
      url: { type: String, default: null },
      fileType: { type: String, default: null },
      fileSize: { type: Number, default: 0 },
      originalName: { type: String, default: null },
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      index: true,
    },
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'assigned', 'in_progress', 'resolved', 'closed'],
      default: 'submitted',
      index: true,
    },
    assignedDepartment: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },
    assignedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    resolutionDetails: {
      description: { type: String, default: '' },
      resolvedAt: { type: Date, default: null },
      resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
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
  }
);

// Helpful compound indexes for queries
complaintSchema.index({ student: 1, status: 1, createdAt: -1 });
complaintSchema.index({ status: 1, priority: 1, createdAt: -1 });
complaintSchema.index({ assignedDepartment: 1, status: 1 });

module.exports = mongoose.model('Complaint', complaintSchema);
