const Admin = require('../models/Admin');

const adminAuth = async (req, res, next) => {
  try {
    // Check if user is authenticated (auth middleware should run first)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    // Find admin by ID
    const admin = await Admin.findById(req.user.id);

    if (!admin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Admin account is inactive.'
      });
    }

    // Attach admin info to request
    req.admin = {
      id: admin._id,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions
    };

    next();
  } catch (error) {
    console.error('Admin auth error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Authorization check failed.'
    });
  }
};

// Middleware to check for super admin role
const superAdminAuth = async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(403).json({
        success: false,
        message: 'Admin authentication required.'
      });
    }

    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Super admin privileges required.'
      });
    }

    next();
  } catch (error) {
    console.error('Super admin auth error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Authorization check failed.'
    });
  }
};

module.exports = { adminAuth, superAdminAuth };
