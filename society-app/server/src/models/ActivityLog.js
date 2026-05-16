const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  societyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Society',
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adminName: {
    type: String,
    required: true,
    trim: true
  },
  adminEmail: {
    type: String,
    trim: true,
    default: ''
  },
  actionType: {
    type: String,
    enum: [
      'payment_approved', 'payment_rejected', 'payment_edited', 'payment_deleted',
      'expense_created', 'expense_updated', 'expense_deleted',
      'fund_created', 'fund_updated', 'fund_deleted',
      'member_approved', 'member_rejected', 'member_removed',
      'admin_created', 'admin_removed', 'admin_role_changed',
      'maintenance_updated', 'society_settings_updated',
      'block_created', 'block_deleted',
      'flat_updated',
      'other'
    ],
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  targetType: {
    type: String,
    enum: ['payment', 'expense', 'fund', 'member', 'admin', 'society', 'block', 'flat', 'other'],
    default: 'other'
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

// Index for efficient querying
activityLogSchema.index({ societyId: 1, createdAt: -1 });
activityLogSchema.index({ adminId: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
