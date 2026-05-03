const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  flatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flat',
    required: true
  },
  societyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Society',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required']
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['paid', 'pending', 'partial'],
    default: 'pending'
  },
  paidDate: {
    type: Date
  },
  dueDate: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'upi', 'bank_transfer', 'cheque', 'online'],
    default: 'cash'
  },
  transactionId: {
    type: String,
    trim: true,
    default: ''
  },
  lateFee: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  receiptNumber: {
    type: String,
    trim: true
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Auto-generate receipt number
paymentSchema.pre('save', function(next) {
  if (!this.receiptNumber) {
    this.receiptNumber = `RCP-${this.year}${String(this.month).padStart(2, '0')}-${Date.now().toString(36).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
