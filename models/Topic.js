const mongoose = require('mongoose');
const TopicSchema = new mongoose.Schema({
  title: String,
  subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  accessCount: { type: Number, default: 0 }
});
module.exports = mongoose.model('Topic', TopicSchema);