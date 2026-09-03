const Complaint = require('../models/Complaint');
const ComplaintHistory = require('../models/ComplaintHistory');
const ComplaintComment = require('../models/ComplaintComment');
const { createNotification } = require('./notificationService');
const { emitToUser, emitToComplaint, emitToRole } = require('../utils/socket');

const ALLOWED_TRANSITIONS = {
  submitted: ['under_review', 'assigned', 'in_progress', 'resolved', 'closed'],
  under_review: ['assigned', 'in_progress', 'resolved', 'closed'],
  assigned: ['in_progress', 'resolved', 'closed', 'under_review'],
  in_progress: ['resolved', 'closed', 'assigned'],
  resolved: ['closed', 'in_progress'],
  closed: ['in_progress'],
};

const getAllComplaints = async (queryParams = {}) => {
  const {
    search,
    category,
    status,
    priority,
    department,
    assignedStaff,
    startDate,
    endDate,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = queryParams;

  const query = {};

  if (search) {
    query.$or = [
      { complaintId: { $regex: search, $options: 'i' } },
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
    ];
  }

  if (category && category !== 'all') {
    query.category = category;
  }

  if (status && status !== 'all') {
    query.status = status;
  }

  if (priority && priority !== 'all') {
    query.priority = priority;
  }

  if (department && department !== 'all') {
    query.assignedDepartment = department;
  }

  if (assignedStaff && assignedStaff !== 'all') {
    query.assignedStaff = assignedStaff;
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt.$lte = end;
    }
  }

  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const skip = (Number(page) - 1) * Number(limit);

  const [complaints, total] = await Promise.all([
    Complaint.find(query)
      .populate('student', 'name email studentId department phone')
      .populate('assignedStaff', 'name email department')
      .populate('resolvedBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),
    Complaint.countDocuments(query),
  ]);

  return {
    complaints,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  };
};

const getAdminComplaintById = async (idOrNumber) => {
  let query = {};
  if (idOrNumber.startsWith('CMP-')) {
    query = { complaintId: idOrNumber };
  } else {
    query = { _id: idOrNumber };
  }

  const complaint = await Complaint.findOne(query)
    .populate('student', 'name email studentId department phone')
    .populate('assignedStaff', 'name email department phone')
    .populate('resolvedBy', 'name email department');

  if (!complaint) {
    const error = new Error('Complaint not found');
    error.statusCode = 404;
    throw error;
  }

  const comments = await ComplaintComment.find({ complaint: complaint._id })
    .populate('author', 'name email role department')
    .sort({ createdAt: 1 });

  const history = await ComplaintHistory.find({ complaint: complaint._id })
    .populate('changedBy', 'name email role')
    .sort({ createdAt: 1 });

  return {
    complaint,
    comments,
    history,
  };
};

const updateComplaint = async (complaintId, updateData, adminUser) => {
  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    const error = new Error('Complaint not found');
    error.statusCode = 404;
    throw error;
  }

  const previousStatus = complaint.status;
  const previousPriority = complaint.priority;

  // Validate status transition if changing status
  if (updateData.status && updateData.status !== complaint.status) {
    const allowed = ALLOWED_TRANSITIONS[complaint.status] || [];
    if (!allowed.includes(updateData.status)) {
      const error = new Error(
        `Invalid status transition from '${complaint.status}' to '${updateData.status}'.`
      );
      error.statusCode = 400;
      throw error;
    }
    complaint.status = updateData.status;

    await ComplaintHistory.create({
      complaint: complaint._id,
      changedBy: adminUser._id,
      action: 'status_change',
      previousStatus,
      newStatus: complaint.status,
      metadata: { note: updateData.statusNote || 'Status updated by administrator' },
    });

    await createNotification({
      userId: complaint.student,
      complaintId: complaint._id,
      type: 'status_updated',
      title: 'Complaint Status Updated',
      message: `Your complaint #${complaint.complaintId} status has changed from ${previousStatus} to ${complaint.status}.`,
    });
  }

  // Priority change
  if (updateData.priority && updateData.priority !== complaint.priority) {
    complaint.priority = updateData.priority;

    await ComplaintHistory.create({
      complaint: complaint._id,
      changedBy: adminUser._id,
      action: 'priority_change',
      previousStatus: complaint.status,
      newStatus: complaint.status,
      metadata: { previousPriority, newPriority: updateData.priority },
    });
  }

  if (updateData.assignedDepartment) {
    complaint.assignedDepartment = updateData.assignedDepartment;
  }

  if (updateData.assignedStaff !== undefined) {
    complaint.assignedStaff = updateData.assignedStaff || null;
  }

  await complaint.save();

  emitToComplaint(complaint._id.toString(), 'complaint_updated', {
    complaintId: complaint.complaintId,
    status: complaint.status,
    priority: complaint.priority,
  });

  return await getAdminComplaintById(complaint._id);
};

const addComment = async (complaintId, commentData, authorUser) => {
  const { comment, status, isInternal = false } = commentData;

  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    const error = new Error('Complaint not found');
    error.statusCode = 404;
    throw error;
  }

  const previousStatus = complaint.status;
  let newStatus = previousStatus;

  if (status && status !== previousStatus) {
    const allowed = ALLOWED_TRANSITIONS[previousStatus] || [];
    if (!allowed.includes(status)) {
      const error = new Error(`Invalid status transition from '${previousStatus}' to '${status}'.`);
      error.statusCode = 400;
      throw error;
    }
    complaint.status = status;
    newStatus = status;
    await complaint.save();

    await ComplaintHistory.create({
      complaint: complaint._id,
      changedBy: authorUser._id,
      action: 'status_change',
      previousStatus,
      newStatus,
      metadata: { commentText: comment },
    });
  }

  const newComment = await ComplaintComment.create({
    complaint: complaint._id,
    author: authorUser._id,
    comment,
    previousStatus,
    newStatus,
    isInternal,
  });

  await ComplaintHistory.create({
    complaint: complaint._id,
    changedBy: authorUser._id,
    action: 'comment_added',
    previousStatus,
    newStatus,
    metadata: { isInternal },
  });

  // Notify student if not internal comment
  if (!isInternal && complaint.student.toString() !== authorUser._id.toString()) {
    await createNotification({
      userId: complaint.student,
      complaintId: complaint._id,
      type: 'comment_added',
      title: 'New Update on Your Complaint',
      message: `An update was posted on complaint #${complaint.complaintId}: "${comment.substring(0, 80)}${comment.length > 80 ? '...' : ''}"`,
    });
  }

  emitToComplaint(complaint._id.toString(), 'comment_added', {
    comment: newComment,
    status: newStatus,
  });

  return await ComplaintComment.findById(newComment._id).populate('author', 'name email role department');
};

const resolveComplaint = async (complaintId, resolutionData, adminUser) => {
  const { description, attachments = [] } = resolutionData;

  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    const error = new Error('Complaint not found');
    error.statusCode = 404;
    throw error;
  }

  const previousStatus = complaint.status;
  complaint.status = 'resolved';
  complaint.resolvedBy = adminUser._id;
  complaint.resolvedAt = new Date();
  complaint.resolutionDetails = {
    description,
    resolvedAt: new Date(),
    resolvedBy: adminUser._id,
    attachments,
  };

  await complaint.save();

  await ComplaintHistory.create({
    complaint: complaint._id,
    changedBy: adminUser._id,
    action: 'resolved',
    previousStatus,
    newStatus: 'resolved',
    metadata: { description },
  });

  // Create audit comment
  await ComplaintComment.create({
    complaint: complaint._id,
    author: adminUser._id,
    comment: `Issue Resolved: ${description}`,
    previousStatus,
    newStatus: 'resolved',
  });

  // Notify student
  await createNotification({
    userId: complaint.student,
    complaintId: complaint._id,
    type: 'resolved',
    title: 'Complaint Resolved',
    message: `Your complaint #${complaint.complaintId} has been marked as Resolved. Resolution: ${description}`,
  });

  emitToComplaint(complaint._id.toString(), 'complaint_resolved', {
    complaintId: complaint.complaintId,
    resolutionDetails: complaint.resolutionDetails,
  });

  return await getAdminComplaintById(complaint._id);
};

const closeComplaint = async (complaintId, adminUser) => {
  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    const error = new Error('Complaint not found');
    error.statusCode = 404;
    throw error;
  }

  const previousStatus = complaint.status;
  complaint.status = 'closed';
  complaint.closedAt = new Date();
  await complaint.save();

  await ComplaintHistory.create({
    complaint: complaint._id,
    changedBy: adminUser._id,
    action: 'closed',
    previousStatus,
    newStatus: 'closed',
    metadata: { closedBy: adminUser.name },
  });

  await createNotification({
    userId: complaint.student,
    complaintId: complaint._id,
    type: 'closed',
    title: 'Complaint Closed',
    message: `Your complaint #${complaint.complaintId} has been officially closed. Thank you.`,
  });

  emitToComplaint(complaint._id.toString(), 'complaint_closed', {
    complaintId: complaint.complaintId,
  });

  return await getAdminComplaintById(complaint._id);
};

const deleteComplaint = async (complaintId, adminUser) => {
  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    const error = new Error('Complaint not found');
    error.statusCode = 404;
    throw error;
  }

  await ComplaintComment.deleteMany({ complaint: complaint._id });
  await ComplaintHistory.deleteMany({ complaint: complaint._id });
  await Complaint.findByIdAndDelete(complaint._id);

  return { success: true, message: `Complaint #${complaint.complaintId} deleted successfully.` };
};

module.exports = {
  getAllComplaints,
  getAdminComplaintById,
  updateComplaint,
  addComment,
  resolveComplaint,
  closeComplaint,
  deleteComplaint,
};
