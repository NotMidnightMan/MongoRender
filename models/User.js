const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  subscribedTopics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }]
});
module.exports = mongoose.model('User', UserSchema);