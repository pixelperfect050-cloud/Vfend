const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Flat = require('../models/Flat');
const { auth, adminOnly } = require('../middleware/auth');

// Record payment
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { flatId, societyId, amount, paidAmount, month, year, paymentMethod, transactionId, notes, lateFee } = req.body;

    let status = 'pending';
    const totalAmount = amount + (lateFee || 0);
    if (paidAmount >= totalAmount) status = 'paid';
    else if (paidAmount > 0) status = 'partial';

    const payment = new Payment({
      flatId, societyId, amount, paidAmount: paidAmount || 0,
      month, year, status,
      paymentMethod: paymentMethod || 'cash',
      transactionId, notes,
      lateFee: lateFee || 0,
      paidDate: paidAmount > 0 ? new Date() : null,
      dueDate: new Date(year, month - 1, 15),
      recordedBy: req.user._id
    });

    await payment.save();

    // Update flat's current month status
    const now = new Date();
    if (month === now.getMonth() + 1 && year === now.getFullYear()) {
      await Flat.findByIdAndUpdate(flatId, { currentMonthStatus: status });
    }

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Generate monthly bills for all flats
router.post('/generate-bills', auth, adminOnly, async (req, res) => {
  try {
    const { societyId, month, year, amount } = req.body;

    const flats = await Flat.find({ societyId, isOccupied: true });
    const existingPayments = await Payment.find({ societyId, month, year });
    const existingFlatIds = existingPayments.map(p => p.flatId.toString());

    const newPayments = [];
    for (const flat of flats) {
      if (!existingFlatIds.includes(flat._id.toString())) {
        newPayments.push({
          flatId: flat._id,
          societyId,
          amount,
          paidAmount: 0,
          month, year,
          status: 'pending',
          dueDate: new Date(year, month - 1, 15),
          recordedBy: req.user._id
        });
      }
    }

    if (newPayments.length > 0) {
      await Payment.insertMany(newPayments);
      // Update all flats status to pending
      const newFlatIds = newPayments.map(p => p.flatId);
      await Flat.updateMany(
        { _id: { $in: newFlatIds } },
        { currentMonthStatus: 'pending' }
      );
    }

    res.json({ message: `Bills generated for ${newPayments.length} flats`, count: newPayments.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update payment
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { paidAmount, paymentMethod, transactionId, notes } = req.body;
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    payment.paidAmount = paidAmount;
    payment.paymentMethod = paymentMethod || payment.paymentMethod;
    payment.transactionId = transactionId || payment.transactionId;
    payment.notes = notes || payment.notes;

    const totalAmount = payment.amount + payment.lateFee;
    if (paidAmount >= totalAmount) payment.status = 'paid';
    else if (paidAmount > 0) payment.status = 'partial';
    else payment.status = 'pending';

    if (paidAmount > 0) payment.paidDate = new Date();

    await payment.save();

    // Update flat status
    const now = new Date();
    if (payment.month === now.getMonth() + 1 && payment.year === now.getFullYear()) {
      await Flat.findByIdAndUpdate(payment.flatId, { currentMonthStatus: payment.status });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get payments for a flat
router.get('/flat/:flatId', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ flatId: req.params.flatId })
      .sort({ year: -1, month: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all payments for society (with filters)
router.get('/society/:societyId', auth, async (req, res) => {
  try {
    const { month, year, status } = req.query;
    const filter = { societyId: req.params.societyId };
    if (month) filter.month = parseInt(month);
    if (year) filter.year = parseInt(year);
    if (status) filter.status = status;

    const payments = await Payment.find(filter)
      .populate('flatId', 'number blockId ownerName')
      .sort({ year: -1, month: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get pending payments
router.get('/pending/:societyId', auth, async (req, res) => {
  try {
    const payments = await Payment.find({
      societyId: req.params.societyId,
      status: { $in: ['pending', 'partial'] }
    })
      .populate('flatId', 'number blockId ownerName ownerPhone')
      .sort({ year: -1, month: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
