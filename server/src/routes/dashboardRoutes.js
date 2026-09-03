const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/student', protect, dashboardController.getStudentDashboard);
router.get('/admin', protect, authorize('admin'), dashboardController.getAdminDashboard);

module.exports = router;
