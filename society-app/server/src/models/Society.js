const mongoose = require('mongoose');

const societySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Society name is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  inviteCode: {
    type: String,
    unique: true,
    sparse: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  pincode: {
    type: String,
    trim: true
  },
  maintenanceAmount: {
    type: Number,
    default: 0
  },
  lateFeePerDay: {
    type: Number,
    default: 0
  },
  lateFeeAfterDays: {
    type: Number,
    default: 15
  },
  billingDay: {
    type: Number,
    default: 1,
    min: 1,
    max: 28
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  logo: {
    type: String,
    default: ''
  },
  contactNumber: {
    type: String,
    trim: true
  },
  upiId: {
    type: String,
    trim: true
  },
  totalBlocks: {
    type: Number,
    default: 0
  },
  totalFlats: {
    type: Number,
    default: 0
  },
  googleSheetId: {
    type: String,
    default: ''
  },
  googleSheetUrl: {
    type: String,
    default: ''
  },
  googleFolderUrl: {
    type: String,
    default: ''
  },
  sheetCreatedAt: {
    type: Date
  },
  sheetEnabled: {
    type: Boolean,
    default: false
  },
  lastSyncedAt: {
    type: Date
  },
  subscriptionTier: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  subscriptionPlan: {
    type: String,
    enum: ['fixed', 'per_flat', 'none'],
    default: 'none'
  },
  subscriptionExpiry: {
    type: Date
  },
  trialExpiry: {
    type: Date
  },
  trialActivated: {
    type: Boolean,
    default: true
  },
  razorpayPaymentId: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Society', societySchema);
