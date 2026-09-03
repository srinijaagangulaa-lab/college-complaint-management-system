const dashboardService = require('../services/dashboardService');

const getStudentDashboard = async (req, res, next) => {
  try {
    const stats = await dashboardService.getStudentDashboardStats(req.user._id);
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

const getAdminDashboard = async (req, res, next) => {
  try {
    const stats = await dashboardService.getAdminDashboardStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentDashboard,
  getAdminDashboard,
};
