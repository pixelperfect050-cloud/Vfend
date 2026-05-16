const Payment = require('../models/Payment');
const Expense = require('../models/Expense');
const Flat = require('../models/Flat');
const Block = require('../models/Block');
const Fund = require('../models/Fund');
const FundPayment = require('../models/FundPayment');
const User = require('../models/User');
const Society = require('../models/Society');

/**
 * AI Data Service - Fetches real database data to provide context for Gemini AI responses.
 * Supports both member-level and admin-level queries.
 */

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const MONTH_NAMES_HI = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

/**
 * Get member-specific data context for AI
 */
async function getMemberContext(user) {
  const context = { role: 'member', name: user.name };

  try {
    // Get flat info
    if (user.flatId) {
      const flat = await Flat.findById(user.flatId).populate('blockId', 'name');
      if (flat) {
        context.flat = {
          number: flat.number,
          block: flat.blockId?.name || 'N/A',
          type: flat.type,
          floor: flat.floor,
          isOccupied: flat.isOccupied,
          ownerName: flat.ownerName,
          currentStatus: flat.currentMonthStatus
        };
      }

      // Get payment history (last 12 months)
      const payments = await Payment.find({ flatId: user.flatId })
        .sort({ year: -1, month: -1 })
        .limit(12);

      if (payments.length > 0) {
        const pendingPayments = payments.filter(p => p.status === 'pending' || p.status === 'partial');
        const paidPayments = payments.filter(p => p.status === 'paid');
        const totalPaid = paidPayments.reduce((sum, p) => sum + p.paidAmount, 0);
        const totalDue = pendingPayments.reduce((sum, p) => sum + (p.amount + p.lateFee - p.paidAmount), 0);

        // Last payment
        const lastPaid = paidPayments[0];

        context.payments = {
          totalPaid: formatCurrency(totalPaid),
          totalDue: formatCurrency(totalDue),
          pendingMonths: pendingPayments.map(p => `${MONTH_NAMES[p.month - 1]} ${p.year} (${formatCurrency(p.amount + p.lateFee - p.paidAmount)})`),
          pendingCount: pendingPayments.length,
          lastPayment: lastPaid ? {
            month: `${MONTH_NAMES[lastPaid.month - 1]} ${lastPaid.year}`,
            amount: formatCurrency(lastPaid.paidAmount),
            date: lastPaid.paidDate ? new Date(lastPaid.paidDate).toLocaleDateString('en-IN') : 'N/A',
            method: lastPaid.paymentMethod,
            receiptNumber: lastPaid.receiptNumber
          } : null,
          recentHistory: payments.slice(0, 6).map(p => ({
            month: `${MONTH_NAMES[p.month - 1]} ${p.year}`,
            amount: formatCurrency(p.amount),
            paid: formatCurrency(p.paidAmount),
            status: p.status,
            receiptNumber: p.receiptNumber
          }))
        };
      }

      // Fund payments for this flat
      const fundPayments = await FundPayment.find({ flatId: user.flatId })
        .populate('fundId', 'name category dueDate amountPerFlat status')
        .sort({ createdAt: -1 });

      if (fundPayments.length > 0) {
        const pendingFunds = fundPayments.filter(p => p.status === 'pending' || p.status === 'partial');
        context.funds = {
          totalFundDue: formatCurrency(pendingFunds.reduce((s, p) => s + (p.amount - p.paidAmount), 0)),
          pendingFunds: pendingFunds.map(p => ({
            name: p.fundId?.name || 'Unknown Fund',
            category: p.fundId?.category,
            due: formatCurrency(p.amount - p.paidAmount),
            dueDate: p.fundId?.dueDate ? new Date(p.fundId.dueDate).toLocaleDateString('en-IN') : 'N/A'
          }))
        };
      }
    }

    // Society info
    if (user.societyId) {
      const society = await Society.findById(user.societyId);
      if (society) {
        context.society = {
          name: society.name,
          maintenanceAmount: formatCurrency(society.maintenanceAmount),
          billingDay: society.billingDay,
          lateFeePerDay: formatCurrency(society.lateFeePerDay),
          lateFeeAfterDays: society.lateFeeAfterDays
        };
      }
    }
  } catch (error) {
    console.error('Error fetching member context:', error.message);
  }

  return context;
}

/**
 * Get admin-specific data context for AI
 */
async function getAdminContext(user) {
  const context = { role: 'admin', name: user.name };

  try {
    if (!user.societyId) return context;

    const societyId = user.societyId;
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Society info
    const society = await Society.findById(societyId);
    if (society) {
      context.society = {
        name: society.name,
        maintenanceAmount: formatCurrency(society.maintenanceAmount),
        totalBlocks: society.totalBlocks,
        totalFlats: society.totalFlats
      };
    }

    // Current month payments overview
    const monthPayments = await Payment.find({ societyId, month: currentMonth, year: currentYear });
    const allPayments = await Payment.find({ societyId });

    const monthPaid = monthPayments.filter(p => p.status === 'paid');
    const monthPending = monthPayments.filter(p => p.status === 'pending');
    const monthPartial = monthPayments.filter(p => p.status === 'partial');

    const totalCollected = allPayments.reduce((sum, p) => sum + p.paidAmount, 0);
    const totalExpensesAll = await Expense.find({ societyId });
    const totalExpenseAmount = totalExpensesAll.reduce((sum, e) => sum + e.amount, 0);

    context.financials = {
      currentMonth: `${MONTH_NAMES[currentMonth - 1]} ${currentYear}`,
      monthCollection: formatCurrency(monthPayments.reduce((s, p) => s + p.paidAmount, 0)),
      monthDue: formatCurrency(monthPayments.reduce((s, p) => s + Math.max(0, p.amount - p.paidAmount), 0)),
      monthPaidCount: monthPaid.length,
      monthPendingCount: monthPending.length,
      monthPartialCount: monthPartial.length,
      totalCollection: formatCurrency(totalCollected),
      totalExpenses: formatCurrency(totalExpenseAmount),
      currentBalance: formatCurrency(totalCollected - totalExpenseAmount)
    };

    // Today's approved payments
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const todayPayments = await Payment.find({
      societyId,
      status: 'paid',
      paidDate: { $gte: todayStart, $lt: todayEnd }
    });
    context.financials.todayApproved = todayPayments.length;
    context.financials.todayAmount = formatCurrency(todayPayments.reduce((s, p) => s + p.paidAmount, 0));

    // Block-wise dues analysis
    const blocks = await Block.find({ societyId });
    const blockDues = [];

    for (const block of blocks) {
      const flats = await Flat.find({ blockId: block._id });
      const flatIds = flats.map(f => f._id);
      const pendingPayments = await Payment.find({
        flatId: { $in: flatIds },
        month: currentMonth,
        year: currentYear,
        status: { $in: ['pending', 'partial'] }
      });
      const dueAmount = pendingPayments.reduce((s, p) => s + (p.amount - p.paidAmount), 0);
      blockDues.push({
        block: block.name,
        totalFlats: flats.length,
        pendingCount: pendingPayments.length,
        dueAmount: formatCurrency(dueAmount)
      });
    }
    context.blockDues = blockDues.sort((a, b) => b.pendingCount - a.pendingCount);

    // Most pending flats (top 5)
    const pendingFlats = await Flat.find({ societyId, currentMonthStatus: 'pending' })
      .populate('blockId', 'name')
      .limit(10);
    context.mostPendingFlats = pendingFlats.slice(0, 5).map(f => ({
      flat: f.number,
      block: f.blockId?.name || 'N/A',
      owner: f.ownerName
    }));

    // Fund overview
    const activeFunds = await Fund.find({ societyId, status: 'active' });
    const allFundPayments = await FundPayment.find({ societyId, status: 'paid' });
    context.funds = {
      activeFundsCount: activeFunds.length,
      totalFundTarget: formatCurrency(activeFunds.reduce((s, f) => s + f.totalTarget, 0)),
      totalFundCollected: formatCurrency(activeFunds.reduce((s, f) => s + f.totalCollected, 0)),
      fundDetails: activeFunds.slice(0, 5).map(f => ({
        name: f.name,
        category: f.category,
        target: formatCurrency(f.totalTarget),
        collected: formatCurrency(f.totalCollected),
        progress: f.totalTarget > 0 ? Math.round((f.totalCollected / f.totalTarget) * 100) : 0
      }))
    };

    // Members overview
    const totalMembers = await User.countDocuments({ societyId, status: 'approved' });
    const pendingMembers = await User.countDocuments({ societyId, status: 'pending' });
    context.members = {
      total: totalMembers,
      pending: pendingMembers
    };

    // Recent expenses (this month)
    const monthStart = new Date(currentYear, currentMonth - 1, 1);
    const monthEnd = new Date(currentYear, currentMonth, 0);
    const monthExpenses = await Expense.find({
      societyId,
      date: { $gte: monthStart, $lte: monthEnd }
    }).sort({ date: -1 }).limit(5);

    context.recentExpenses = monthExpenses.map(e => ({
      category: e.category,
      description: e.description,
      amount: formatCurrency(e.amount),
      date: new Date(e.date).toLocaleDateString('en-IN')
    }));

  } catch (error) {
    console.error('Error fetching admin context:', error.message);
  }

  return context;
}

/**
 * Detect what data the user is asking about
 */
function detectIntent(message) {
  const msg = message.toLowerCase();
  const intents = [];

  // Payment related
  if (/maintenance|due|pending|payment|paid|receipt|bill/.test(msg)) intents.push('payments');
  if (/last payment|pichla payment|kab kiya/.test(msg)) intents.push('last_payment');
  if (/receipt|download|download karo/.test(msg)) intents.push('receipt');
  if (/pending month|kitne month|konse month/.test(msg)) intents.push('pending_months');

  // Financial
  if (/balance|fund|saving|collection|total/.test(msg)) intents.push('financials');
  if (/expense|kharcha|spent/.test(msg)) intents.push('expenses');

  // Admin specific
  if (/block.*due|block.*pending|sabse.*jyada/.test(msg)) intents.push('block_analysis');
  if (/aaj.*payment|today.*payment|approve/.test(msg)) intents.push('today_payments');
  if (/report|monthly|collection report/.test(msg)) intents.push('report');
  if (/flat.*status|member|kitne/.test(msg)) intents.push('flat_status');

  return intents.length > 0 ? intents : ['general'];
}

module.exports = {
  getMemberContext,
  getAdminContext,
  detectIntent,
  formatCurrency
};
