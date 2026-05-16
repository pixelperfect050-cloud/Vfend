const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');
const { logActivity } = require('../services/activityLogger');

// Get all admins for the society
router.get('/list', auth, adminOnly, async (req, res) => {
  try {
    const admins = await User.find({
      societyId: req.user.societyId,
      role: 'admin',
      status: 'approved'
    }).select('-password').sort({ createdAt: 1 });

    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all members (for promoting to admin)
router.get('/members', auth, adminOnly, async (req, res) => {
  try {
    const members = await User.find({
      societyId: req.user.societyId,
      role: 'member',
      status: 'approved'
    }).select('-password').sort({ name: 1 });

    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Promote member to admin
router.post('/promote/:userId', auth, adminOnly, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (targetUser.societyId?.toString() !== req.user.societyId?.toString()) {
      return res.status(403).json({ message: 'User is not in your society' });
    }

    if (targetUser.role === 'admin') {
      return res.status(400).json({ message: 'User is already an admin' });
    }

    targetUser.role = 'admin';
    await targetUser.save();

    // Log activity
    await logActivity({
      societyId: req.user.societyId,
      admin: req.user,
      actionType: 'admin_created',
      description: `${req.user.name} promoted ${targetUser.name} to Admin`,
      targetType: 'admin',
      targetId: targetUser._id,
      metadata: { promotedUser: targetUser.name, promotedEmail: targetUser.email }
    });

    res.json({ message: `${targetUser.name} promoted to Admin`, user: targetUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Demote admin to member
router.post('/demote/:userId', auth, adminOnly, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot demote yourself' });
    }

    if (targetUser.societyId?.toString() !== req.user.societyId?.toString()) {
      return res.status(403).json({ message: 'User is not in your society' });
    }

    if (targetUser.role !== 'admin') {
      return res.status(400).json({ message: 'User is not an admin' });
    }

    targetUser.role = 'member';
    await targetUser.save();

    // Log activity
    await logActivity({
      societyId: req.user.societyId,
      admin: req.user,
      actionType: 'admin_removed',
      description: `${req.user.name} demoted ${targetUser.name} to Member`,
      targetType: 'admin',
      targetId: targetUser._id,
      metadata: { demotedUser: targetUser.name }
    });

    res.json({ message: `${targetUser.name} demoted to Member`, user: targetUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get activity logs
router.get('/activity-log', auth, adminOnly, async (req, res) => {
  try {
    const ActivityLog = require('../models/ActivityLog');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const filter = { societyId: req.user.societyId };

    // Optional filters
    if (req.query.actionType) filter.actionType = req.query.actionType;
    if (req.query.adminId) filter.adminId = req.query.adminId;

    const [logs, total] = await Promise.all([
      ActivityLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ActivityLog.countDocuments(filter)
    ]);

    res.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
