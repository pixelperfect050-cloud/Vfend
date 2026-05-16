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
// ═══════════════════════════════════════════════════
// DEMO LEADS MANAGEMENT
// ═══════════════════════════════════════════════════

// Get all demo leads (with search, filter, pagination)
router.get('/demo-leads', auth, adminOnly, async (req, res) => {
  try {
    const DemoLead = require('../models/DemoLead');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      const s = req.query.search;
      filter.$or = [
        { name: { $regex: s, $options: 'i' } },
        { mobile: { $regex: s, $options: 'i' } },
        { societyName: { $regex: s, $options: 'i' } },
        { city: { $regex: s, $options: 'i' } }
      ];
    }

    const [leads, total] = await Promise.all([
      DemoLead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      DemoLead.countDocuments(filter)
    ]);

    // Counts by status
    const statusCounts = await DemoLead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const counts = { new: 0, contacted: 0, demo_scheduled: 0, converted: 0, lost: 0 };
    statusCounts.forEach(s => { counts[s._id] = s.count; });

    res.json({
      leads,
      counts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Export demo leads as CSV (opens in Excel / Google Sheets)
router.get('/demo-leads/export', auth, adminOnly, async (req, res) => {
  try {
    const DemoLead = require('../models/DemoLead');
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const leads = await DemoLead.find(filter).sort({ createdAt: -1 }).lean();

    // Build CSV
    const headers = ['Name', 'Mobile', 'Society Name', 'Flats', 'City', 'Preferred Time', 'Status', 'Source', 'Notes', 'Booked On'];
    const rows = leads.map(l => [
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${l.mobile || ''}"`,
      `"${(l.societyName || '').replace(/"/g, '""')}"`,
      l.numberOfFlats || 0,
      `"${(l.city || '').replace(/"/g, '""')}"`,
      `"${(l.preferredDemoTime || '').replace(/"/g, '""')}"`,
      l.status || 'new',
      l.source || 'ai_chat',
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      l.createdAt ? new Date(l.createdAt).toLocaleString('en-IN') : ''
    ].join(','));

    const csv = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=demo-leads-${new Date().toISOString().slice(0,10)}.csv`);
    // Add BOM for Excel to detect UTF-8
    res.send('\uFEFF' + csv);
  } catch (error) {
    res.status(500).json({ message: 'Export failed', error: error.message });
  }
});

// Update lead status / notes
router.put('/demo-leads/:id', auth, adminOnly, async (req, res) => {
  try {
    const DemoLead = require('../models/DemoLead');
    const { status, notes } = req.body;

    const lead = await DemoLead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    if (status) lead.status = status;
    if (notes !== undefined) lead.notes = notes;
    await lead.save();

    res.json({ message: 'Lead updated', lead });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
