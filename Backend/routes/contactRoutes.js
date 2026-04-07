const express = require('express');
const router = express.Router();
const {
  submitMessage,
  getMessages,
  markAsRead
} = require('../controllers/contactController');
const auth = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');
const { sanitize } = require('../middleware/validate');

// Apply sanitization to all routes
router.use(sanitize);

// Public route
router.post('/', submitMessage);

// Admin routes
router.get('/messages', auth, adminAuth, getMessages);
router.put('/messages/:id/read', auth, adminAuth, markAsRead);

module.exports = router;
