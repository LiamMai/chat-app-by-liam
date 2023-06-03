const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accepted: {
      type: Boolean,
      default: false
    },
    created_at: {
      type: Date,
      default: Date.now(),
    },
  });
  
  const Friend = mongoose.model('Friends', friendSchema);
  
  module.exports = Friend;