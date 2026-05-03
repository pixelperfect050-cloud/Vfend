const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  societyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Society',
    required: true
  },
  category: {
    type: String,
    enum: ['electricity', 'lift', 'security', 'cleaning', 'plumbing', 'gardening', 'repairs', 'water', 'misc'],
    required: [true, 'Category is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  blockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Block'
  },
  vendor: {
    type: String,
    trim: true,
    default: ''
  },
  receipt: {
    type: String,
    default: ''
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isRecurring: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
