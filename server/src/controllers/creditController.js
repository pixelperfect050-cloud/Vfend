const User = require('../models/User');
const { deductCredits } = require('../services/creditService');

// GET /api/credits — get current user's credit balance
exports.getCredits = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('credits totalCreditsEarned');
    res.json({
      success: true,
      credits: user.credits,
      totalCreditsEarned: user.totalCreditsEarned,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/credits/use — deduct credits for an order discount
exports.useCredits = async (req, res) => {
  try {
    const { amount, reason } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid credit amount.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.credits < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient credits.', available: user.credits });
    }

    const updated = await deductCredits(req.user._id, amount, reason || 'order_discount');
    if (!updated) {
      return res.status(400).json({ success: false, message: 'Failed to deduct credits.' });
    }

    res.json({
      success: true,
      message: `${amount} credits applied successfully!`,
      credits: updated.credits,
      totalCreditsEarned: updated.totalCreditsEarned,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
