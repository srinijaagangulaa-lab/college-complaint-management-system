const Complaint = require('../models/Complaint');
const User = require('../models/User');

const getStudentDashboardStats = async (studentId) => {
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
    Complaint.countDocuments({ student: studentId }),
    Complaint.countDocuments({ student: studentId, status: 'submitted' }),
    Complaint.countDocuments({ student: studentId, status: 'under_review' }),
    Complaint.countDocuments({ student: studentId, status: 'assigned' }),
    Complaint.countDocuments({ student: studentId, status: 'in_progress' }),
    Complaint.countDocuments({ student: studentId, status: 'resolved' }),
    Complaint.countDocuments({ student: studentId, status: 'closed' }),
    Complaint.find({ student: studentId })
      .populate('assignedStaff', 'name')
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  return {
    total,
    submitted,
    underReview,
    assigned,
    inProgress,
    resolved,
    closed,
    active: submitted + underReview + assigned + inProgress,
    recentComplaints,
  };
};

const getAdminDashboardStats = async () => {
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
    categoryBreakdown,
    priorityBreakdown,
    statusBreakdown,
    departmentBreakdown,
  ] = await Promise.all([
    Complaint.countDocuments({}),
    Complaint.countDocuments({ status: 'submitted' }),
    Complaint.countDocuments({ status: 'under_review' }),
    Complaint.countDocuments({ status: 'assigned' }),
    Complaint.countDocuments({ status: 'in_progress' }),
    Complaint.countDocuments({ status: 'resolved' }),
    Complaint.countDocuments({ status: 'closed' }),
    Complaint.countDocuments({ priority: 'critical', status: { $nin: ['resolved', 'closed'] } }),
    Complaint.countDocuments({ priority: 'high', status: { $nin: ['resolved', 'closed'] } }),
    User.countDocuments({ role: 'student' }),
    Complaint.find({})
      .populate('student', 'name email department')
      .populate('assignedStaff', 'name')
      .sort({ updatedAt: -1 })
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

  const resolutionRate = total > 0 ? Math.round(((resolved + closed) / total) * 100) : 0;

  return {
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
    categoryBreakdown: categoryBreakdown.map((item) => ({
      category: item._id || 'Other',
      count: item.count,
    })),
    priorityBreakdown: priorityBreakdown.map((item) => ({
      priority: item._id,
      count: item.count,
    })),
    statusBreakdown: statusBreakdown.map((item) => ({
      status: item._id,
      count: item.count,
    })),
    departmentBreakdown: departmentBreakdown.map((item) => ({
      department: item._id,
      count: item.count,
    })),
  };
};

module.exports = {
  getStudentDashboardStats,
  getAdminDashboardStats,
};
