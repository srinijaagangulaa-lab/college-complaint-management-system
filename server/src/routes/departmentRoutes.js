const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { createDepartmentValidator } = require('../validators/departmentValidator');

router.get('/', departmentController.getAll);
router.post('/', protect, authorize('admin'), createDepartmentValidator, validate, departmentController.create);
router.put('/:id', protect, authorize('admin'), departmentController.update);

module.exports = router;
