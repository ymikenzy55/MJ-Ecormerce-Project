const AuditLog = require('../models/AuditLog');
const Admin = require('../models/Admin');

// Log admin action
const logAction = async (adminId, action, resource, resourceId, details = {}) => {
  try {
    // Get admin email
    const admin = await Admin.findById(adminId);
    if (!admin) {
      console.error('Admin not found for audit log');
      return false;
    }

    const auditLog = new AuditLog({
      adminId,
      adminEmail: admin.email,
      action,
      resource,
      resourceId,
      details
    });

    await auditLog.save();
    return true;
  } catch (error) {
    console.error('Log action error:', error);
    return false;
  }
};

// Get logs by date range
const getLogsByDateRange = async (startDate, endDate, options = {}) => {
  try {
    const filter = {
      timestamp: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    // Add optional filters
    if (options.adminId) {
      filter.adminId = options.adminId;
    }

    if (options.resource) {
      filter.resource = options.resource;
    }

    if (options.action) {
      filter.action = options.action;
    }

    const logs = await AuditLog.find(filter)
      .sort({ timestamp: -1 })
      .populate('adminId', 'firstName lastName email');

    return logs;
  } catch (error) {
    console.error('Get logs by date range error:', error);
    return [];
  }
};

module.exports = {
  logAction,
  getLogsByDateRange
};
