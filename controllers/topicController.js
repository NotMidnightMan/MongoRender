const mongoose = require("mongoose");
const Topic = require("../models/Topic");
const User = require("../models/User");
const topicObserver = require("../observers/topicObserver");

function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}

class TopicController {
  static async getTopicById(req, res) {
    try {
      // Validate the ID
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid topic ID" });
      }

      // Fetch the topic and populate messages with user details
      const topic = await Topic.findById(req.params.id)
        .populate({
          path: "messages",
          populate: { path: "user", select: "username" }, // Populate user field with username
          options: { sort: { createdAt: -1 } }, // Sort messages by most recent
        })
        .populate("subscribers", "username"); // Optionally populate subscribers

      if (!topic) {
        return res.status(404).json({ error: "Topic not found" });
      }

      // Increment the access count
      topic.accessCount = (topic.accessCount || 0) + 1;
      await topic.save();

      res.json(topic);
    } catch (err) {
      console.error("Error fetching topic:", err);
      res.status(500).json({ error: "Failed to fetch topic" });
    }
  }

  static async createTopic(req, res) {
    console.log("Request body:", req.body); // Log the request body
    console.log("Session user:", req.session.user); // Log the session user

    try {
      if (!req.session.user) {
        console.error("User is not logged in. Session user is undefined.");
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!req.body.title) {
        console.error("Title is missing in the request body.");
        return res.status(400).json({ error: "Title is required" });
      }

      console.log("Username from session:", req.session.user.username); // Log the username

      const topic = new Topic({
        title: req.body.title,
        createdBy: req.session.user.username,
        subscribers: [req.session.user._id],
      });

      console.log("Saving topic to database...");
      await topic.save();

      const user = await User.findById(req.session.user._id);
      if (!user) {
        console.error("User not found in the database.");
        return res.status(404).json({ error: "User not found" });
      }

      console.log("Adding topic to user's subscribedTopics...");
      user.subscribedTopics.push(topic._id);
      await user.save();

      console.log("Topic created successfully:", topic);
      res.status(201).json(topic);
    } catch (err) {
      console.error("Error creating topic:", err); // Log the error
      res.status(500).json({ error: "Failed to create topic" });
    }
  }

  static async deleteTopic(req, res) {
    try {
      const topicId = req.params.id;
      const deletedTopic = await Topic.findByIdAndDelete(topicId);

      if (!deletedTopic) {
        return res.status(404).json({ message: "Topic not found" });
      }

      res.status(200).json({ message: "Topic deleted successfully" });
    } catch (error) {
      console.error("Error deleting topic:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async subscribe(req, res) {
    try {
      const topic = await Topic.findById(req.params.id);
      const user = await User.findById(req.session.user._id);

      if (!user.subscribedTopics.includes(topic._id)) {
        user.subscribedTopics.push(topic._id);
        topic.subscribers.push(user._id);
        await topic.save();
        await user.save();
      }

      res.json(topic);
    } catch (err) {
      console.error("Error subscribing to topic:", err);
      res.status(500).json({ error: "Failed to subscribe to topic" });
    }
  }

  static async unsubscribe(req, res) {
    try {
      const topic = await Topic.findById(req.params.id);
      const user = await User.findById(req.session.user._id);

      user.subscribedTopics.pull(topic._id);
      topic.subscribers.pull(user._id);
      await topic.save();
      await user.save();

      res.json(topic);
    } catch (err) {
      console.error("Error unsubscribing from topic:", err);
      res.status(500).json({ error: "Failed to unsubscribe from topic" });
    }
  }

  static async getAllTopics(req, res) {
    console.log("Fetching all topics");
    try {
      const topics = await Topic.find().populate({
        path: "messages",
        options: { limit: 2, sort: { createdAt: 1 } }, // Fetch the first two messages sorted by creation date
        select: "content createdAt", // Only include the content and createdAt fields
      });

      console.log("Topics fetched successfully:", topics); // Debugging log
      res.json(topics);
    } catch (err) {
      console.error("Error fetching topics:", err); // Log the error
      res.status(500).json({ error: "Failed to fetch topics" });
    }
  }

  static async getHomeTopics(req, res) {
    try {
      if (!req.session.user) {
        console.error("Session user is undefined. User is not logged in.");
        return res.status(401).json({ error: "Unauthorized" });
      }

      const userId = req.session.user._id;
      console.log("Session user:", req.session.user);

      // Fetch the user and populate subscribed topics with the 2 most recent messages
      const user = await User.findById(userId).populate({
        path: "subscribedTopics",
        populate: {
          path: "messages",
          options: { limit: 2, sort: { createdAt: -1 } }, // Fetch the 2 most recent messages
          populate: { path: "user", select: "username" }, // Populate the user field with the username
          select: "content createdAt user", // Include content, createdAt, and user fields
        },
      });

      if (!user) {
        console.error("User not found in the database.");
        return res.status(404).json({ error: "User not found" });
      }

      console.log("Subscribed topics with messages:", user.subscribedTopics);
      res.json(user.subscribedTopics);
    } catch (err) {
      console.error("Error fetching home topics:", err);
      res.status(500).json({ error: "Failed to fetch home topics" });
    }
  }
}

module.exports = TopicController;
