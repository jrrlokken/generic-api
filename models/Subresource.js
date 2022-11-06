const mongoose = require('mongoose');

const SubresourceSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a resource title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a resource description'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resource: {
    type: mongoose.Schema.ObjectId,
    ref: 'Resource',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

SubresourceSchema.post('save', function () {
  this.constructor.getAverageCost(this.resource);
});
SubresourceSchema.pre('remove', function () {
  this.constructor.getAverageCost(this.resource);
});

module.exports = mongoose.model('Subresource', SubresourceSchema);
