const express = require('express');
const router = express.Router();
const adminComplaintController = require('../controllers/adminComplaintController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const {
  updateComplaintValidator,
  assignValidator,
  commentValidator,
  resolveValidator,
} = require('../validators/complaintValidator');

// All admin complaint routes require admin role
router.use(protect, authorize('admin'));

router.get('/', adminComplaintController.getAll);
router.get('/:id', adminComplaintController.getById);
router.put('/:id', updateComplaintValidator, validate, adminComplaintController.update);
router.post('/:id/assign', assignValidator, validate, adminComplaintController.assign);
router.post('/:id/comments', commentValidator, validate, adminComplaintController.addComment);
router.post('/:id/resolve', resolveValidator, validate, adminComplaintController.resolve);
router.post('/:id/close', adminComplaintController.close);
router.delete('/:id', adminComplaintController.deleteComplaint);

module.exports = router;
