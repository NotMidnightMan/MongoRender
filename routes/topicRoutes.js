const express = require("express");
const router = express.Router();
const Topic = require("../models/Topic");
const User = require("../models/User");

router.post("/", async (req, res) => {
  const topic = new Topic({
    title: req.body.title,
    subscribers: [req.session.user._id],
  });
  await topic.save();
  const user = await User.findById(req.session.user._id);
  user.subscribedTopics.push(topic._id);
  await user.save();
  res.status(201).json(topic);
});

router.post("/:id/subscribe", async (req, res) => {
  const topic = await Topic.findById(req.params.id);
  const user = await User.findById(req.session.user._id);
  if (!user.subscribedTopics.includes(topic._id)) {
    user.subscribedTopics.push(topic._id);
    topic.subscribers.push(user._id);
    await topic.save();
    await user.save();
  }
  res.json(topic);
});

router.post("/:id/unsubscribe", async (req, res) => {
  const topic = await Topic.findById(req.params.id);
  const user = await User.findById(req.session.user._id);
  user.subscribedTopics.pull(topic._id);
  topic.subscribers.pull(user._id);
  await topic.save();
  await user.save();
  res.json(topic);
});

// Route to fetch all topics
router.get("/", async (req, res) => {
  try {
    const topics = await Topic.find().populate("createdBy", "username");
    res.json(topics);
  } catch (err) {
    console.error("Error fetching topics:", err);
    res.status(500).json({ error: "Failed to fetch topics" });
  }
});

// Route to fetch a specific topic by ID
router.get("/:id", async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id).populate("subscribers");
    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }
    topic.accessCount++;
    await topic.save();
    res.json(topic);
  } catch (err) {
    console.error("Error fetching topic:", err);
    res.status(500).json({ error: "Failed to fetch topic" });
  }
});

router.get("/home", async (req, res) => {
  try {
    const userId = req.session.user._id; // Assuming session contains the logged-in user
    const user = await User.findById(userId).populate({
      path: "subscribedTopics",
      populate: { path: "messages", select: "content createdAt" },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.subscribedTopics);
  } catch (err) {
    console.error("Error fetching home topics:", err);
    res.status(500).json({ error: "Failed to fetch home topics" });
  }
});

module.exports = router;
