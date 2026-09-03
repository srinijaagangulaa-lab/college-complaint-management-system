const mongoose = require('mongoose');

const complaintCommentSchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true,
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comment: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
      minlength: [1, 'Comment cannot be empty'],
    },
    previousStatus: {
      type: String,
      default: null,
    },
    newStatus: {
      type: String,
      default: null,
    },
    isInternal: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ComplaintComment', complaintCommentSchema);
