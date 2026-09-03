const Complaint = require('../models/Complaint');

/**
 * Generates a human-friendly unique complaint ID
 * Format: CMP-YYYY-XXXX (e.g., CMP-2026-0001)
 */
const generateComplaintId = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `CMP-${currentYear}-`;

  // Find the highest number complaint for the current year
  const lastComplaint = await Complaint.findOne({
    complaintId: new RegExp(`^${prefix}`),
  })
    .sort({ createdAt: -1 })
    .select('complaintId');

  let nextSequence = 1;

  if (lastComplaint && lastComplaint.complaintId) {
    const parts = lastComplaint.complaintId.split('-');
    if (parts.length === 3) {
      const parsedSeq = parseInt(parts[2], 10);
      if (!isNaN(parsedSeq)) {
        nextSequence = parsedSeq + 1;
      }
    }
  }

  // Pad to 4 digits (e.g., 0001, 0042)
  const paddedSequence = String(nextSequence).padStart(4, '0');
  return `${prefix}${paddedSequence}`;
};

module.exports = {
  generateComplaintId,
};
