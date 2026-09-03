const express = require('express');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET /api/dashboard/admin
| Comprehensive analytics and real-time statistics for college administrators
|--------------------------------------------------------------------------
*/
router.get('/admin', protect, adminOnly, async (req, res) => {
  try {
    const [
      total,
      submitted,
      underReview,
      assigned,
      inProgress,
      resolved,
      closed,
      criticalCount,
      highCount,
      totalStudents,
      recentActivity,
      categoryAggr,
      priorityAggr,
      statusAggr,
      departmentAggr,
    ] = await Promise.all([
      Complaint.countDocuments({}),
      Complaint.countDocuments({ status: 'submitted' }),
      Complaint.countDocuments({ status: 'under_review' }),
      Complaint.countDocuments({ status: 'assigned' }),
      Complaint.countDocuments({ status: 'in_progress' }),
      Complaint.countDocuments({ status: 'resolved' }),
      Complaint.countDocuments({ status: 'closed' }),
      Complaint.countDocuments({
        priority: 'critical',
        status: { $nin: ['resolved', 'closed'] },
      }),
      Complaint.countDocuments({
        priority: 'high',
        status: { $nin: ['resolved', 'closed'] },
      }),
      User.countDocuments({ role: 'student' }),
      Complaint.find({})
        .populate('submittedBy', 'name email studentId department')
        .populate('assignedStaff', 'name email department')
        .sort({ updatedAt: -1, createdAt: -1 })
        .limit(8),
      Complaint.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Complaint.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Complaint.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Complaint.aggregate([
        {
          $group: {
            _id: { $ifNull: ['$assignedDepartment', 'Unassigned'] },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),
    ]);

    const resolutionRate =
      total > 0 ? Math.round(((resolved + closed) / total) * 100) : 0;

    return res.status(200).json({
      success: true,
      data: {
        metrics: {
          total,
          newSubmitted: submitted,
          underReview,
          assigned,
          inProgress,
          resolved,
          closed,
          pending: submitted + underReview + assigned + inProgress,
          criticalPriority: criticalCount,
          highPriority: highCount,
          totalStudents,
          resolutionRate,
        },
        recentActivity,
        categoryBreakdown: categoryAggr.map((item) => ({
          category: item._id || 'Other',
          count: item.count,
        })),
        priorityBreakdown: priorityAggr.map((item) => ({
          priority: item._id || 'medium',
          count: item.count,
        })),
        statusBreakdown: statusAggr.map((item) => ({
          status: item._id || 'submitted',
          count: item.count,
        })),
        departmentBreakdown: departmentAggr.map((item) => ({
          department: item._id || 'Unassigned',
          count: item.count,
        })),
      },
    });
  } catch (error) {
    console.error('GET ADMIN DASHBOARD ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate admin dashboard metrics',
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET /api/dashboard/student
| Personal complaint progress indicators and KPIs for logged-in student
|--------------------------------------------------------------------------
*/
router.get('/student', protect, async (req, res) => {
  try {
    const studentId = req.user._id;

    const [
      total,
      submitted,
      underReview,
      assigned,
      inProgress,
      resolved,
      closed,
      recentComplaints,
    ] = await Promise.all([
      Complaint.countDocuments({ submittedBy: studentId }),
      Complaint.countDocuments({ submittedBy: studentId, status: 'submitted' }),
      Complaint.countDocuments({
        submittedBy: studentId,
        status: 'under_review',
      }),
      Complaint.countDocuments({ submittedBy: studentId, status: 'assigned' }),
      Complaint.countDocuments({
        submittedBy: studentId,
        status: 'in_progress',
      }),
      Complaint.countDocuments({ submittedBy: studentId, status: 'resolved' }),
      Complaint.countDocuments({ submittedBy: studentId, status: 'closed' }),
      Complaint.find({ submittedBy: studentId })
        .populate('submittedBy', 'name email studentId department')
        .populate('assignedStaff', 'name')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        total,
        submitted,
        underReview,
        assigned,
        inProgress,
        resolved,
        closed,
        active: submitted + underReview + assigned + inProgress,
        recentComplaints,
      },
    });
  } catch (error) {
    console.error('GET STUDENT DASHBOARD ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch student dashboard statistics',
      error: error.message,
    });
  }
});

module.exports = router;
