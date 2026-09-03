const express = require('express');
const mongoose = require('mongoose');

const Complaint = require('../models/Complaint');
const ComplaintComment = require('../models/ComplaintComment');
const ComplaintHistory = require('../models/ComplaintHistory');
const Notification = require('../models/Notification');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Apply auth & admin check to all admin complaint routes
router.use(protect, adminOnly);

/*
|--------------------------------------------------------------------------
| GET /api/admin/complaints
| List all complaints across the institution with filters, search, and pagination
|--------------------------------------------------------------------------
*/
router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
      status,
      priority,
      department,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Keyword search across complaintId, title, description, and location
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { complaintId: searchRegex },
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
      ];
    }

    // Filter by Category
    if (category && category !== 'all') {
      query.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
    }

    // Filter by Status
    if (status && status !== 'all') {
      query.status = status.trim();
    }

    // Filter by Priority
    if (priority && priority !== 'all') {
      query.priority = priority.trim();
    }

    // Filter by Department
    if (department && department !== 'all') {
      query.assignedDepartment = { $regex: new RegExp(`^${department.trim()}$`, 'i') };
    }

    // Sorting
    const sortField = sortBy || 'createdAt';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortDirection };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    const [complaints, total] = await Promise.all([
      Complaint.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .populate('submittedBy', 'name email studentId department phone')
        .populate('assignedStaff', 'name email department phone')
        .populate('resolvedBy', 'name email department'),
      Complaint.countDocuments(query),
    ]);

    const pages = Math.ceil(total / limitNum) || 1;

    return res.status(200).json({
      success: true,
      data: {
        complaints,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages,
        },
      },
    });
  } catch (error) {
    console.error('ADMIN GET COMPLAINTS ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch administrative complaints',
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET /api/admin/complaints/:id
| Get detailed complaint record with audit timeline and comments
|--------------------------------------------------------------------------
*/
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    let filter = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      filter = { _id: id };
    } else {
      filter = { complaintId: id };
    }

    const complaint = await Complaint.findOne(filter)
      .populate('submittedBy', 'name email studentId department phone')
      .populate('assignedStaff', 'name email department phone')
      .populate('resolvedBy', 'name email department');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    const [comments, history] = await Promise.all([
      ComplaintComment.find({ complaint: complaint._id })
        .populate('author', 'name email role department')
        .sort({ createdAt: 1 }),
      ComplaintHistory.find({ complaint: complaint._id })
        .populate('changedBy', 'name email role')
        .sort({ createdAt: 1 }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        complaint,
        comments,
        history,
      },
    });
  } catch (error) {
    console.error('ADMIN GET SINGLE COMPLAINT ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch complaint details',
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| PUT /api/admin/complaints/:id
| Update priority, status, or assignment of complaint
|--------------------------------------------------------------------------
*/
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { priority, status, assignedDepartment, assignedStaff, adminResponse } = req.body;

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

    const previousStatus = complaint.status;
    const previousPriority = complaint.priority;

    if (priority && priority !== complaint.priority) {
      complaint.priority = priority;
      await ComplaintHistory.create({
        complaint: complaint._id,
        changedBy: req.user._id,
        action: 'priority_change',
        previousStatus: complaint.status,
        newStatus: complaint.status,
        metadata: { previousPriority, newPriority: priority },
      });
    }

    if (status && status !== complaint.status) {
      complaint.status = status;
      await ComplaintHistory.create({
        complaint: complaint._id,
        changedBy: req.user._id,
        action: 'status_change',
        previousStatus,
        newStatus: status,
        metadata: { note: 'Status updated by administrator' },
      });

      // Send notification to student
      await Notification.create({
        recipient: complaint.submittedBy,
        complaint: complaint._id,
        type: 'status_updated',
        title: 'Complaint Status Updated',
        message: `Your complaint #${complaint.complaintId} status changed to ${status.replace('_', ' ')}.`,
      });
    }

    if (assignedDepartment !== undefined) {
      complaint.assignedDepartment = assignedDepartment;
    }

    if (assignedStaff !== undefined) {
      complaint.assignedStaff = assignedStaff || null;
    }

    if (adminResponse !== undefined) {
      complaint.adminResponse = adminResponse;
    }

    await complaint.save();

    const updated = await Complaint.findById(complaint._id)
      .populate('submittedBy', 'name email studentId department phone')
      .populate('assignedStaff', 'name email department phone');

    return res.status(200).json({
      success: true,
      message: 'Complaint updated successfully',
      data: { complaint: updated },
    });
  } catch (error) {
    console.error('ADMIN UPDATE COMPLAINT ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update complaint',
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| POST /api/admin/complaints/:id/assign
| Assign department and staff to complaint
|--------------------------------------------------------------------------
*/
router.post('/:id/assign', async (req, res) => {
  try {
    const { id } = req.params;
    const { department, staffId } = req.body;

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

    const previousStatus = complaint.status;
    complaint.assignedDepartment = department || complaint.assignedDepartment;
    if (staffId !== undefined) {
      complaint.assignedStaff = staffId || null;
    }

    if (complaint.status === 'submitted' || complaint.status === 'under_review') {
      complaint.status = 'assigned';
    }

    await complaint.save();

    await ComplaintHistory.create({
      complaint: complaint._id,
      changedBy: req.user._id,
      action: 'assigned',
      previousStatus,
      newStatus: complaint.status,
      metadata: { department, staffId },
    });

    await Notification.create({
      recipient: complaint.submittedBy,
      complaint: complaint._id,
      type: 'assigned',
      title: 'Complaint Assigned',
      message: `Your complaint #${complaint.complaintId} has been assigned to ${department || 'Department'}.`,
    });

    const updated = await Complaint.findById(complaint._id)
      .populate('submittedBy', 'name email studentId department phone')
      .populate('assignedStaff', 'name email department phone');

    return res.status(200).json({
      success: true,
      message: 'Complaint assigned successfully',
      data: { complaint: updated },
    });
  } catch (error) {
    console.error('ADMIN ASSIGN COMPLAINT ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to assign complaint',
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| POST /api/admin/complaints/:id/comments
| Add administrator progress comment
|--------------------------------------------------------------------------
*/
router.post('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, status, isInternal = false } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required',
      });
    }

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

    const previousStatus = complaint.status;
    let newStatus = previousStatus;

    if (status && status !== previousStatus) {
      complaint.status = status;
      newStatus = status;
      await complaint.save();

      await ComplaintHistory.create({
        complaint: complaint._id,
        changedBy: req.user._id,
        action: 'status_change',
        previousStatus,
        newStatus,
        metadata: { note: 'Status changed during comment update' },
      });
    }

    const newComment = await ComplaintComment.create({
      complaint: complaint._id,
      author: req.user._id,
      comment: comment.trim(),
      previousStatus,
      newStatus,
      isInternal,
    });

    await ComplaintHistory.create({
      complaint: complaint._id,
      changedBy: req.user._id,
      action: 'comment_added',
      previousStatus,
      newStatus,
      metadata: { isInternal, commentText: comment.trim() },
    });

    if (!isInternal) {
      await Notification.create({
        recipient: complaint.submittedBy,
        complaint: complaint._id,
        type: 'comment_added',
        title: 'New Update on Your Complaint',
        message: `An administrator left an update on complaint #${complaint.complaintId}: "${comment.substring(0, 80)}"`,
      });
    }

    const populatedComment = await ComplaintComment.findById(newComment._id).populate(
      'author',
      'name email role department'
    );

    return res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { comment: populatedComment },
    });
  } catch (error) {
    console.error('ADMIN ADD COMMENT ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add comment',
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| POST /api/admin/complaints/:id/resolve
| Record resolution details and mark complaint resolved
|--------------------------------------------------------------------------
*/
router.post('/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const { description, attachments = [] } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Resolution description is required',
      });
    }

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

    const previousStatus = complaint.status;
    complaint.status = 'resolved';
    complaint.resolvedBy = req.user._id;
    complaint.resolvedAt = new Date();
    complaint.adminResponse = description.trim();
    complaint.resolutionDetails = {
      description: description.trim(),
      resolvedAt: new Date(),
      resolvedBy: req.user._id,
      attachments,
    };

    await complaint.save();

    await ComplaintHistory.create({
      complaint: complaint._id,
      changedBy: req.user._id,
      action: 'resolved',
      previousStatus,
      newStatus: 'resolved',
      metadata: { description: description.trim() },
    });

    await ComplaintComment.create({
      complaint: complaint._id,
      author: req.user._id,
      comment: `Resolution: ${description.trim()}`,
      previousStatus,
      newStatus: 'resolved',
    });

    await Notification.create({
      recipient: complaint.submittedBy,
      complaint: complaint._id,
      type: 'resolved',
      title: 'Complaint Resolved',
      message: `Your complaint #${complaint.complaintId} has been resolved: "${description.substring(0, 80)}"`,
    });

    const updated = await Complaint.findById(complaint._id)
      .populate('submittedBy', 'name email studentId department phone')
      .populate('resolvedBy', 'name email department');

    return res.status(200).json({
      success: true,
      message: 'Complaint resolved successfully',
      data: { complaint: updated },
    });
  } catch (error) {
    console.error('ADMIN RESOLVE COMPLAINT ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to resolve complaint',
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| POST /api/admin/complaints/:id/close
| Finalize and close complaint
|--------------------------------------------------------------------------
*/
router.post('/:id/close', async (req, res) => {
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

    const previousStatus = complaint.status;
    complaint.status = 'closed';
    complaint.closedAt = new Date();
    await complaint.save();

    await ComplaintHistory.create({
      complaint: complaint._id,
      changedBy: req.user._id,
      action: 'closed',
      previousStatus,
      newStatus: 'closed',
      metadata: { closedBy: req.user.name },
    });

    await Notification.create({
      recipient: complaint.submittedBy,
      complaint: complaint._id,
      type: 'closed',
      title: 'Complaint Closed',
      message: `Your complaint #${complaint.complaintId} has been closed.`,
    });

    const updated = await Complaint.findById(complaint._id)
      .populate('submittedBy', 'name email studentId department phone');

    return res.status(200).json({
      success: true,
      message: 'Complaint closed successfully',
      data: { complaint: updated },
    });
  } catch (error) {
    console.error('ADMIN CLOSE COMPLAINT ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to close complaint',
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| DELETE /api/admin/complaints/:id
| Delete complaint and all associated records
|--------------------------------------------------------------------------
*/
router.delete('/:id', async (req, res) => {
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

    await ComplaintComment.deleteMany({ complaint: complaint._id });
    await ComplaintHistory.deleteMany({ complaint: complaint._id });
    await Complaint.findByIdAndDelete(complaint._id);

    return res.status(200).json({
      success: true,
      message: `Complaint #${complaint.complaintId} deleted successfully`,
    });
  } catch (error) {
    console.error('ADMIN DELETE COMPLAINT ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete complaint',
      error: error.message,
    });
  }
});

module.exports = router;
