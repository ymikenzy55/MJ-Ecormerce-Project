const express = require('express');
const router = express.Router();
const {
  register,
  login,
  verifyEmail,
  requestPasswordReset,
  resetPassword
} = require('../controllers/authController');
const { sanitize } = require('../middleware/validate');

// Apply sanitization to all routes
router.use(sanitize);

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/verify-email
router.post('/verify-email', verifyEmail);

// POST /api/auth/request-password-reset
router.post('/request-password-reset', requestPasswordReset);

// POST /api/auth/reset-password
router.post('/reset-password', resetPassword);

module.exports = router;
