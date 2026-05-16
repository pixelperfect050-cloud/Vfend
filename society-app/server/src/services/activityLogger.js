const ActivityLog = require('../models/ActivityLog');

/**
 * Log an admin activity. Call this from any route where admin actions need tracking.
 * 
 * @param {Object} params
 * @param {string} params.societyId - Society ID
 * @param {Object} params.admin - Admin user object (req.user)
 * @param {string} params.actionType - e.g., 'payment_approved', 'expense_created'
 * @param {string} params.description - Human-readable description
 * @param {string} [params.targetType] - e.g., 'payment', 'expense'
 * @param {string} [params.targetId] - ID of the affected resource
 * @param {Object} [params.metadata] - Extra data for context
 */
async function logActivity({ societyId, admin, actionType, description, targetType, targetId, metadata }) {
  try {
    await ActivityLog.create({
      societyId,
      adminId: admin._id,
      adminName: admin.name,
      adminEmail: admin.email,
      actionType,
      description,
      targetType: targetType || 'other',
      targetId,
      metadata: metadata || {}
    });
  } catch (error) {
    // Never block the main operation — just log and continue
    console.error('Activity log error:', error.message);
  }
}

module.exports = { logActivity };
