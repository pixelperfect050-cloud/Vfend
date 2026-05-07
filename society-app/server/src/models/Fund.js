const mongoose = require('mongoose');

const fundSchema = new mongoose.Schema({
  societyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Society',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Fund name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  category: {
    type: String,
    enum: ['emergency', 'festival', 'repair', 'water_tank', 'renovation', 'security', 'special', 'other'],
    default: 'other'
  },
  amountPerFlat: {
    type: Number,
    required: [true, 'Amount per flat is required'],
    min: 1
  },
  totalTarget: {
    type: Number,
    default: 0
  },
  totalCollected: {
    type: Number,
    default: 0
  },
  dueDate: {
    type: Date,
    required: true
  },
  applicableTo: {
    type: String,
    enum: ['all', 'specific_blocks'],
    default: 'all'
  },
  applicableBlocks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Block'
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Fund', fundSchema);
