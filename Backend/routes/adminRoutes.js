const express = require('express');
const router = express.Router();
const {
  addAdmin,
  removeAdmin,
  updateAdminRole,
  getAuditLogs
} = require('../controllers/adminController');
const auth = require('../middleware/auth');
const { adminAuth, superAdminAuth } = require('../middleware/adminAuth');
const { sanitize } = require('../middleware/validate');

// Apply sanitization to all routes
router.use(sanitize);

// All routes require authentication and super admin privileges
router.use(auth);
router.use(adminAuth);
router.use(superAdminAuth);

// POST /api/admin/add
router.post('/add', addAdmin);

// DELETE /api/admin/:id
router.delete('/:id', removeAdmin);

// PUT /api/admin/:id/role
router.put('/:id/role', updateAdminRole);

// GET /api/admin/audit-logs
router.get('/audit-logs', getAuditLogs);

module.exports = router;
