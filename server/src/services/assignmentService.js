const Complaint = require('../models/Complaint');
const ComplaintHistory = require('../models/ComplaintHistory');
const User = require('../models/User');
const { createNotification } = require('./notificationService');
const { emitToUser, emitToComplaint } = require('../utils/socket');

const assignComplaint = async (complaintId, { department, staffId }, adminUser) => {
  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    const error = new Error('Complaint not found');
    error.statusCode = 404;
    throw error;
  }

  let assignedStaffUser = null;
  if (staffId) {
    assignedStaffUser = await User.findById(staffId);
    if (!assignedStaffUser) {
      const error = new Error('Assigned staff member not found');
      error.statusCode = 404;
      throw error;
    }
  }

  const previousDept = complaint.assignedDepartment;
  const previousStaff = complaint.assignedStaff;
  const previousStatus = complaint.status;

  if (department) {
    complaint.assignedDepartment = department;
  }
  if (staffId !== undefined) {
    complaint.assignedStaff = staffId || null;
  }

  // Update status to 'assigned' if it was submitted or under_review
  if (['submitted', 'under_review'].includes(complaint.status)) {
    complaint.status = 'assigned';
  }

  await complaint.save();

  // Create audit history
  await ComplaintHistory.create({
    complaint: complaint._id,
    changedBy: adminUser._id,
    action: 'assigned',
    previousStatus,
    newStatus: complaint.status,
    metadata: {
      department: complaint.assignedDepartment,
      previousDept,
      staffName: assignedStaffUser ? assignedStaffUser.name : null,
    },
  });

  // Notify student
  await createNotification({
    userId: complaint.student,
    complaintId: complaint._id,
    type: 'assigned',
    title: 'Complaint Assigned',
    message: `Your complaint #${complaint.complaintId} has been assigned to ${complaint.assignedDepartment || 'the responsible department'}.`,
  });

  // Notify assigned staff member if applicable
  if (staffId && staffId.toString() !== adminUser._id.toString()) {
    await createNotification({
      userId: staffId,
      complaintId: complaint._id,
      type: 'assigned',
      title: 'New Complaint Assigned to You',
      message: `You have been assigned to handle complaint #${complaint.complaintId} (${complaint.title}).`,
    });
  }

  emitToComplaint(complaint._id.toString(), 'complaint_updated', {
    complaintId: complaint.complaintId,
    status: complaint.status,
    assignedDepartment: complaint.assignedDepartment,
  });

  return await Complaint.findById(complaint._id)
    .populate('student', 'name email studentId department')
    .populate('assignedStaff', 'name email department')
    .populate('resolvedBy', 'name email');
};

module.exports = {
  assignComplaint,
};
