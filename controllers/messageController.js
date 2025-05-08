const Message = require("../models/Message");
const Topic = require("../models/Topic");
const topicObserver = require("../observers/topicObserver");
const mongoose = require("mongoose");

class MessageController {
  static async createMessage(req, res) {
    try {
      const { topicId, content } = req.body;
      const userId = req.session.user?._id; // Assuming session contains the logged-in user

      console.log("Request body:", req.body);
      console.log("Session user:", req.session.user);
      console.log("User ID:", userId);

      // Validate topicId
      if (!mongoose.Types.ObjectId.isValid(topicId)) {
        return res.status(400).json({ error: "Invalid topic ID" });
      }

      // Validate content
      if (!content || content.trim() === "") {
        return res.status(400).json({ error: "Message content is required" });
      }

      // Check if the topic exists
      const topic = await Topic.findById(topicId);
      if (!topic) {
        return res.status(404).json({ error: "Topic not found" });
      }

      // Create a new message
      const message = new Message({
        topic: topicId,
        user: userId,
        content,
      });
      await message.save();
      console.log("Message created:", message);

      // Populate the user field with the username
      const populatedMessage = await Message.findById(message._id).populate(
        "user",
        "username"
      );
      if (!populatedMessage) {
        console.error("Failed to populate the user field for the message.");
      } else {
        console.log("Populated message:", populatedMessage);
      }

      // Add the message to the topic's messages array
      console.log("Topic before adding message:", topic);
      topic.messages.push(message._id);
      console.log("Topic after adding message:", topic);
      await topic.save();

      // Notify subscribers of the topic
      topicObserver.notify(topicId, message);

      res.status(201).json({
        message: "Message created successfully",
        message: populatedMessage,
      });
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getMessages(req, res) {
    try {
      const userTopics = req.session.user.subscribedTopics; // Assuming session contains the user's subscriptions

      // Fetch messages for each subscribed topic
      const messages = await Promise.all(
        userTopics.map(async (topicId) => {
          return {
            topicId,
            messages: await Message.find({ topic: topicId })
              .sort({ createdAt: -1 })
              .limit(10)
              .populate("user", "username"), // Populate the user field with the username
          };
        })
      );

      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = MessageController;
