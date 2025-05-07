const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  subscribedTopics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }], // Add this property
});

module.exports = mongoose.model("User", userSchema);
