const Complaint = require('../models/Complaint');
const ComplaintHistory = require('../models/ComplaintHistory');
const ComplaintComment = require('../models/ComplaintComment');
const { generateComplaintId } = require('../utils/idGenerator');
const { createNotification } = require('./notificationService');
const { emitToRole, emitToComplaint } = require('../utils/socket');

const createComplaint = async (studentId, complaintData, file) => {
  const complaintId = await generateComplaintId();

  let attachment = {
    filename: null,
    url: null,
    fileType: null,
    fileSize: 0,
    originalName: null,
  };

  if (file) {
    attachment = {
      filename: file.filename,
      url: `/uploads/${file.filename}`,
      fileType: file.mimetype,
      fileSize: file.size,
      originalName: file.originalname,
    };
  }

  const complaint = await Complaint.create({
    complaintId,
    student: studentId,
    title: complaintData.title,
    category: complaintData.category,
    description: complaintData.description,
    location: complaintData.location,
    priority: complaintData.priority || 'medium',
    status: 'submitted',
    attachment,
  });

  // Create initial audit history record
  await ComplaintHistory.create({
    complaint: complaint._id,
    changedBy: studentId,
    action: 'created',
    previousStatus: null,
    newStatus: 'submitted',
    metadata: {
      title: complaint.title,
      category: complaint.category,
      priority: complaint.priority,
      location: complaint.location,
    },
  });

  // Notify student
  await createNotification({
    userId: studentId,
    complaintId: complaint._id,
    type: 'complaint_created',
    title: 'Complaint Submitted',
    message: `Your complaint #${complaint.complaintId} has been successfully submitted and is awaiting review.`,
  });

  // Notify admins via socket
  emitToRole('admin', 'new_complaint', {
    complaintId: complaint.complaintId,
    title: complaint.title,
    category: complaint.category,
    priority: complaint.priority,
  });

  return await Complaint.findById(complaint._id).populate('student', 'name email studentId department');
};

const getStudentComplaints = async (studentId, queryParams = {}) => {
  const {
    search,
    category,
    status,
    priority,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = queryParams;

  const query = { student: studentId };

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

  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const skip = (Number(page) - 1) * Number(limit);

  const [complaints, total] = await Promise.all([
    Complaint.find(query)
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

const getComplaintById = async (complaintIdOrNumber, user) => {
  let query = {};
  if (complaintIdOrNumber.startsWith('CMP-')) {
    query = { complaintId: complaintIdOrNumber };
  } else {
    query = { _id: complaintIdOrNumber };
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

  // Ownership security check: Students can only view their own complaints
  if (user.role === 'student' && complaint.student._id.toString() !== user._id.toString()) {
    const error = new Error('Access denied. You can only view your own complaints.');
    error.statusCode = 403;
    throw error;
  }

  // Fetch comments (students only see non-internal comments)
  const commentQuery = { complaint: complaint._id };
  if (user.role === 'student') {
    commentQuery.isInternal = false;
  }

  const comments = await ComplaintComment.find(commentQuery)
    .populate('author', 'name email role department')
    .sort({ createdAt: 1 });

  // Fetch history timeline
  const history = await ComplaintHistory.find({ complaint: complaint._id })
    .populate('changedBy', 'name email role')
    .sort({ createdAt: 1 });

  return {
    complaint,
    comments,
    history,
  };
};

const getComplaintHistory = async (complaintId, user) => {
  const { complaint, history } = await getComplaintById(complaintId, user);
  return history;
};

module.exports = {
  createComplaint,
  getStudentComplaints,
  getComplaintById,
  getComplaintHistory,
};
