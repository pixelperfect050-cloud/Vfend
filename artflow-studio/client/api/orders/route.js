const { connectDB } = require('../../db');
const Order = require('../../models/Order');
const Job = require('../../models/Job');
const authModule = await import('../../middleware/auth.js');

module.exports = async function handler(req, res) {
  await connectDB();
  const { method } = req;
  const path = req.url.replace(/^\/api\/orders/, '') || '/';

  const wrapAuth = (mw, handler) => {
    return new Promise((resolve) => {
      mw(req, res, () => {
        handler().then(resolve).catch((e) => { res.status(500).json({ success: false, message: e.message }); resolve(); });
      });
    });
  };

  if (method === 'POST' && path === '/') {
    return wrapAuth(authModule.auth, async () => {
      if (res.headersSent) return;
      const { jobId } = req.body;
      const job = await Job.findById(jobId);
      if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
      const existingOrder = await Order.findOne({ jobId });
      if (existingOrder) return res.status(409).json({ success: false, message: 'Order already exists for this job.', order: existingOrder });
      const order = await Order.create({ jobId: job._id, userId: req.user._id, amount: job.price || 0, originalAmount: job.price || 0, paymentStatus: job.price > 0 ? 'unpaid' : 'paid', status: 'processing' });
      const populated = await Order.findById(order._id).populate('jobId').populate('userId', 'name email');
      return res.status(201).json({ success: true, order: populated });
    });
  }

  if (method === 'GET' && path === '/user') {
    return wrapAuth(authModule.auth, async () => {
      if (res.headersSent) return;
      const orders = await Order.find({ userId: req.user._id }).populate('jobId').sort({ createdAt: -1 });
      return res.json({ success: true, orders });
    });
  }

  if (method === 'GET' && path === '/all') {
    return wrapAuth(authModule.adminAuth, async () => {
      if (res.headersSent) return;
      const orders = await Order.find().populate('jobId').populate('userId', 'name email').sort({ createdAt: -1 });
      return res.json({ success: true, orders });
    });
  }

  if (method === 'GET' && path?.match(/^\/\w+$/) && !path?.includes('/feedback')) {
    const id = path.slice(1);
    return wrapAuth(authModule.auth, async () => {
      if (res.headersSent) return;
      const order = await Order.findById(id).populate('jobId').populate('userId', 'name email');
      if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
      return res.json({ success: true, order });
    });
  }

  if (method === 'POST' && path?.match(/^\/\w+\/feedback$/)) {
    const id = path.match(/^\/(\w+)/)[1];
    return wrapAuth(authModule.auth, async () => {
      if (res.headersSent) return;
      const { rating, feedback } = req.body;
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
      order.rating = rating;
      order.feedback = feedback;
      await order.save();
      return res.json({ success: true, order });
    });
  }

  return res.status(404).json({ success: false, message: 'Not found.' });
};
