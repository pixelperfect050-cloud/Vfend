const User = require('../models/User');
const { notify } = require('./notificationService');

// Credit rules
const CREDIT_RULES = {
  signup: 10,
  order_complete: 20,
  payment_cashback_percent: 5, // 5% cashback
};

/**
 * Award credits to a user.
 * @param {string} userId
 * @param {number} amount - credits to award
 * @param {string} reason - e.g. 'signup', 'order_complete', 'cashback'
 * @param {Object} [meta] - extra data for notification
 * @returns {Promise<Object>} updated user
 */
async function awardCredits(userId, amount, reason, meta = {}) {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { credits: amount, totalCreditsEarned: amount } },
      { new: true }
    ).select('-password');

    if (!user) return null;

    // Send notification about earned credits
    await notify({
      userId,
      type: 'credits_earned',
      title: `🪙 You earned ${amount} coins!`,
      message: _creditMessage(amount, reason),
      link: '/dashboard',
      meta: { amount, reason, newBalance: user.credits, ...meta },
    });

    return user;
  } catch (err) {
    console.error('❌ Credit award error:', err.message);
    return null;
  }
}

/**
 * Deduct credits from a user. Returns null if insufficient balance.
 * @param {string} userId
 * @param {number} amount
 * @param {string} reason
 * @returns {Promise<Object|null>}
 */
async function deductCredits(userId, amount, reason = 'payment') {
  try {
    const user = await User.findById(userId);
    if (!user || user.credits < amount) return null;

    user.credits -= amount;
    await user.save();

    await notify({
      userId,
      type: 'credits_used',
      title: `🪙 ${amount} coins used`,
      message: `You used ${amount} coins for ${reason}. Remaining balance: ${user.credits} coins.`,
      link: '/dashboard',
      meta: { amount, reason, newBalance: user.credits },
    });

    return user;
  } catch (err) {
    console.error('❌ Credit deduct error:', err.message);
    return null;
  }
}

/**
 * Award signup bonus.
 */
async function awardSignupBonus(userId) {
  return awardCredits(userId, CREDIT_RULES.signup, 'signup');
}

/**
 * Award order completion bonus.
 */
async function awardOrderCompleteBonus(userId) {
  return awardCredits(userId, CREDIT_RULES.order_complete, 'order_complete');
}

/**
 * Award payment cashback.
 */
async function awardPaymentCashback(userId, paymentAmount) {
  const cashback = Math.round(paymentAmount * (CREDIT_RULES.payment_cashback_percent / 100));
  if (cashback <= 0) return null;
  return awardCredits(userId, cashback, 'cashback', { paymentAmount });
}

function _creditMessage(amount, reason) {
  switch (reason) {
    case 'signup':
      return `Welcome to ArtFlow! You received ${amount} bonus coins for signing up. Use them on your next order!`;
    case 'order_complete':
      return `Your order is complete! ${amount} coins have been added to your wallet as a reward.`;
    case 'cashback':
      return `${amount} coins cashback credited to your wallet from your recent payment.`;
    default:
      return `${amount} coins have been added to your wallet.`;
  }
}

module.exports = {
  CREDIT_RULES,
  awardCredits,
  deductCredits,
  awardSignupBonus,
  awardOrderCompleteBonus,
  awardPaymentCashback,
};
