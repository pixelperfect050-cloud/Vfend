const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Block name is required'],
    trim: true
  },
  societyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Society',
    required: true
  },
  totalFloors: {
    type: Number,
    required: [true, 'Total floors is required'],
    min: 1
  },
  flatsPerFloor: {
    type: Number,
    required: [true, 'Flats per floor is required'],
    min: 1
  },
  description: {
    type: String,
    trim: true,
    default: ''
  }
}, { timestamps: true });

// Virtual: total flats in this block
blockSchema.virtual('totalFlats').get(function() {
  return this.totalFloors * this.flatsPerFloor;
});

blockSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Block', blockSchema);
