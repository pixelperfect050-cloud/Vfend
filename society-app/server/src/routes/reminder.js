const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const Payment = require('../models/Payment');
const Flat = require('../models/Flat');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/create', auth, async (req, res) => {
  try {
    const { flatId, type, title, message, scheduledDate, channel } = req.body;
    const user = await User.findById(req.user.id);
    const flat = await Flat.findById(flatId);
    
    const reminder = new Reminder({
      societyId: user.societyId,
      flatId,
      userId: flat.ownerId || flat.userId,
      type,
      title,
      message,
      scheduledDate: new Date(scheduledDate),
      channel: channel || 'in_app'
    });
    
    await reminder.save();
    res.json({ success: true, reminder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/create-payment-reminder', auth, async (req, res) => {
  try {
    const { paymentId, daysBefore = 3 } = req.body;
    const payment = await Payment.findById(paymentId).populate('flatId');
    
    if (!payment || !payment.dueDate) {
      return res.status(400).json({ success: false, message: 'Due date not set' });
    }
    
    const flat = await Flat.findById(payment.flatId);
    const owner = await User.findById(flat.ownerId || flat.userId);
    
    const scheduledDate = new Date(payment.dueDate);
    scheduledDate.setDate(scheduledDate.getDate() - daysBefore);
    
    if (scheduledDate <= new Date()) {
      return res.status(400).json({ success: false, message: 'Scheduled date already passed' });
    }
    
    const reminder = new Reminder({
      societyId: owner.societyId,
      flatId: flat._id,
      userId: owner._id,
      type: 'payment',
      title: 'Payment Reminder',
      message: `Reminder: Maintenance payment of Rs.${payment.amount} for ${getMonthName(payment.month)} ${payment.year} is due on ${formatDate(payment.dueDate)}`,
      scheduledDate,
      channel: 'in_app',
      metadata: {
        paymentId: payment._id,
        month: payment.month,
        year: payment.year,
        amount: payment.amount
      }
    });
    
    await reminder.save();
    res.json({ success: true, reminder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/create-all-pending-reminders', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { daysBefore = 3 } = req.body;
    
    const pendingPayments = await Payment.find({
      societyId: user.societyId,
      status: { $in: ['pending', 'partial'] }
    }).populate('flatId');
    
    let created = 0;
    
    for (const payment of pendingPayments) {
      const flat = await Flat.findById(payment.flatId);
      const owner = await User.findById(flat.ownerId || flat.userId);
      
      if (!owner || !payment.dueDate) continue;
      
      const scheduledDate = new Date(payment.dueDate);
      scheduledDate.setDate(scheduledDate.getDate() - daysBefore);
      
      if (scheduledDate <= new Date()) continue;
      
      const existing = await Reminder.findOne({
        'metadata.paymentId': payment._id,
        status: 'pending'
      });
      
      if (existing) continue;
      
      const reminder = new Reminder({
        societyId: user.societyId,
        flatId: flat._id,
        userId: owner._id,
        type: 'payment',
        title: 'Payment Reminder',
        message: `Reminder: Maintenance payment of Rs.${payment.amount} for ${getMonthName(payment.month)} ${payment.year} is due on ${formatDate(payment.dueDate)}`,
        scheduledDate,
        channel: 'in_app',
        metadata: {
          paymentId: payment._id,
          month: payment.month,
          year: payment.year,
          amount: payment.amount
        }
      });
      
      await reminder.save();
      created++;
    }
    
    res.json({ success: true, message: `Created ${created} reminders` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/society/:societyId', auth, async (req, res) => {
  try {
    const reminders = await Reminder.find({ societyId: req.params.societyId })
      .populate('flatId')
      .populate('userId', 'name email phone')
      .sort({ scheduledDate: -1 });
    res.json({ success: true, reminders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/user', auth, async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.id })
      .populate('flatId', 'flatNumber blockId')
      .sort({ scheduledDate: -1 });
    res.json({ success: true, reminders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/pending', auth, async (req, res) => {
  try {
    const reminders = await Reminder.find({ 
      userId: req.user.id,
      status: 'pending',
      scheduledDate: { $lte: new Date() }
    }).populate('flatId', 'flatNumber blockId');
    res.json({ success: true, reminders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

function getMonthName(month) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[month - 1];
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

module.exports = router;