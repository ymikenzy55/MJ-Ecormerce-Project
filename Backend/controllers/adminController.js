const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const AuditLog = require('../models/AuditLog');
const { logAction } = require('../services/auditService');

// Add new admin (super admin only)
const addAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, permissions } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const admin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'admin',
      permissions: permissions || []
    });

    await admin.save();

    // Log action
    await logAction(req.admin.id, 'create', 'admin', admin._id, {
      adminEmail: email,
      role: admin.role
    });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Add admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create admin'
    });
  }
};

// Remove admin (super admin only)
const removeAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent removing super admin
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    if (admin.role === 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot remove super admin'
      });
    }

    // Soft delete by setting isActive to false
    admin.isActive = false;
    await admin.save();

    // Log action
    await logAction(req.admin.id, 'delete', 'admin', id, {
      adminEmail: admin.email
    });

    res.status(200).json({
      success: true,
      message: 'Admin removed successfully'
    });
  } catch (error) {
    console.error('Remove admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove admin'
    });
  }
};

// Update admin role (super admin only)
const updateAdminRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, permissions } = req.body;

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Prevent modifying super admin
    if (admin.role === 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot modify super admin role'
      });
    }

    const oldRole = admin.role;
    const oldPermissions = admin.permissions;

    if (role) admin.role = role;
    if (permissions) admin.permissions = permissions;

    await admin.save();

    // Log action
    await logAction(req.admin.id, 'update', 'admin', id, {
      adminEmail: admin.email,
      changes: {
        role: { old: oldRole, new: admin.role },
        permissions: { old: oldPermissions, new: admin.permissions }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Admin role updated successfully',
      data: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    console.error('Update admin role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update admin role'
    });
  }
};

// Get audit logs (super admin only)
const getAuditLogs = async (req, res) => {
  try {
    const { startDate, endDate, adminId, resource } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    let filter = {};

    // Date range filter
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    // Admin filter
    if (adminId) {
      filter.adminId = adminId;
    }

    // Resource filter
    if (resource) {
      filter.resource = resource;
    }

    const logs = await AuditLog.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate('adminId', 'firstName lastName email');

    const total = await AuditLog.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audit logs'
    });
  }
};

module.exports = {
  addAdmin,
  removeAdmin,
  updateAdminRole,
  getAuditLogs
};
