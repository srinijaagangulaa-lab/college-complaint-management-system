const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { createComplaintValidator } = require('../validators/complaintValidator');

// Student complaints
router.get('/my', protect, complaintController.getMyComplaints);
router.post('/', protect, upload.single('attachment'), createComplaintValidator, validate, complaintController.create);
router.get('/:id', protect, complaintController.getById);
router.get('/:id/history', protect, complaintController.getHistory);

module.exports = router;
