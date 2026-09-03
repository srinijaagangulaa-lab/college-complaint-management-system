const { body, param } = require('express-validator');

const VALID_CATEGORIES = [
  'Classroom',
  'Laboratory',
  'Hostel',
  'Wi-Fi/Internet',
  'Infrastructure',
  'Transportation',
  'Cleanliness',
  'Library',
  'Electricity',
  'Water/Sanitation',
  'Other',
];

const VALID_PRIORITIES = ['low', 'medium', 'high', 'critical'];
const VALID_STATUSES = [
  'submitted',
  'under_review',
  'assigned',
  'in_progress',
  'resolved',
  'closed',
];

const createComplaintValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Complaint title is required')
    .isLength({ max: 150 })
    .withMessage('Title cannot exceed 150 characters'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Complaint category is required')
    .isIn(VALID_CATEGORIES)
    .withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('priority')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(VALID_PRIORITIES)
    .withMessage(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}`),
];

const updateComplaintValidator = [
  body('priority')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(VALID_PRIORITIES)
    .withMessage(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}`),
  body('status')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(VALID_STATUSES)
    .withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),
  body('assignedDepartment')
    .optional()
    .trim(),
  body('assignedStaff')
    .optional()
    .isMongoId()
    .withMessage('Assigned staff must be a valid ID'),
];

const assignValidator = [
  body('department')
    .optional()
    .trim(),
  body('staffId')
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage('Staff ID must be a valid ID'),
];

const commentValidator = [
  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Comment text cannot be empty'),
  body('status')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(VALID_STATUSES)
    .withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),
];

const resolveValidator = [
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Resolution description is required')
    .isLength({ min: 5 })
    .withMessage('Resolution description must be at least 5 characters long'),
];

module.exports = {
  VALID_CATEGORIES,
  VALID_PRIORITIES,
  VALID_STATUSES,
  createComplaintValidator,
  updateComplaintValidator,
  assignValidator,
  commentValidator,
  resolveValidator,
};
