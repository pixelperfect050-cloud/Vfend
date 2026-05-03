const express = require('express');
const router = express.Router();
const Society = require('../models/Society');
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');

// Create society
router.post('/', auth, async (req, res) => {
  try {
    const { name, address, city, state, pincode, maintenanceAmount, lateFeePerDay, lateFeeAfterDays, billingDay } = req.body;

    const society = new Society({
      name, address, city, state, pincode,
      maintenanceAmount: maintenanceAmount || 0,
      lateFeePerDay: lateFeePerDay || 0,
      lateFeeAfterDays: lateFeeAfterDays || 15,
      billingDay: billingDay || 1,
      createdBy: req.user._id
    });

    await society.save();

    // Update user with society and make admin
    await User.findByIdAndUpdate(req.user._id, {
      societyId: society._id,
      role: 'admin'
    });

    res.status(201).json(society);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get society by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const society = await Society.findById(req.params.id).populate('createdBy', 'name email');
    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }
    res.json(society);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update society
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const society = await Society.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }
    res.json(society);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all members of society
router.get('/:id/members', auth, async (req, res) => {
  try {
    const members = await User.find({ societyId: req.params.id })
      .select('-password')
      .populate('flatId');
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
