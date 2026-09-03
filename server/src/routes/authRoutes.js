const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { registerValidator, loginValidator } = require('../validators/authValidator');

router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.get('/me', protect, authController.getMe);
router.post('/logout', authController.logout);

module.exports = router;
