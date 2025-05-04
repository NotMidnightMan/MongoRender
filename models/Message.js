const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
  timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Message', MessageSchema);