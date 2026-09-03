const { body } = require('express-validator');

const createDepartmentValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Department name is required'),
  body('departmentCode')
    .trim()
    .notEmpty()
    .withMessage('Department code is required')
    .isLength({ min: 2, max: 10 })
    .withMessage('Department code must be between 2 and 10 characters'),
  body('description')
    .optional()
    .trim(),
];

module.exports = {
  createDepartmentValidator,
};
