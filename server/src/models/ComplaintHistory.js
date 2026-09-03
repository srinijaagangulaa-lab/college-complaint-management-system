const mongoose = require('mongoose');

const complaintHistorySchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true,
      index: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'created',
        'status_change',
        'assigned',
        'priority_change',
        'comment_added',
        'resolved',
        'closed',
        'updated',
      ],
    },
    previousStatus: {
      type: String,
      default: null,
    },
    newStatus: {
      type: String,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ComplaintHistory', complaintHistorySchema);
