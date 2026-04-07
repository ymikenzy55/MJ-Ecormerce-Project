const express = require('express');
const router = express.Router();
const {
  subscribe,
  unsubscribe,
  getSubscribers
} = require('../controllers/newsletterController');
const auth = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');
const { sanitize } = require('../middleware/validate');

// Apply sanitization to all routes
router.use(sanitize);

// Public routes
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

// Admin route
router.get('/subscribers', auth, adminAuth, getSubscribers);

module.exports = router;
