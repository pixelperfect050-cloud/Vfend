const mongoose = require('mongoose');

const demoLeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true
  },
  societyName: {
    type: String,
    trim: true,
    default: ''
  },
  numberOfFlats: {
    type: Number,
    default: 0
  },
  city: {
    type: String,
    trim: true,
    default: ''
  },
  preferredDemoTime: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'demo_scheduled', 'converted', 'lost'],
    default: 'new'
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  source: {
    type: String,
    enum: ['ai_chat', 'website', 'referral', 'other'],
    default: 'ai_chat'
  }
}, { timestamps: true });

module.exports = mongoose.model('DemoLead', demoLeadSchema);
