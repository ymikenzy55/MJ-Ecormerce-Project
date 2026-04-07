const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const auth = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');
const { sanitize } = require('../middleware/validate');

// Apply sanitization to all routes
router.use(sanitize);

// Create order (authenticated or guest)
router.post('/', createOrder);

// Get order by ID (authenticated)
router.get('/:id', auth, getOrderById);

// Get user orders (authenticated)
router.get('/user/:userId', auth, getUserOrders);

// Admin routes
router.get('/', auth, adminAuth, getAllOrders);
router.put('/:id/status', auth, adminAuth, updateOrderStatus);

module.exports = router;
