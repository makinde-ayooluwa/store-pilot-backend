const mongoose = require('mongoose');

const resetTokenSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // Automatically deletes from MongoDB after 1 hour (60 mins * 60 secs)
  },
});

const ResetToken = mongoose.model('ResetToken', resetTokenSchema);
module.exports = ResetToken;