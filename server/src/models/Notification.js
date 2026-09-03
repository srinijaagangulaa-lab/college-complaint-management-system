const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      default: null,
    },
    type: {
      type: String,
      enum: [
        'complaint_created',
        'status_updated',
        'assigned',
        'comment_added',
        'resolved',
        'closed',
        'general',
      ],
      default: 'general',
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
