const Message = require('../models/Message');
const Topic = require('../models/Topic');
const topicObserver = require('../observers/topicObserver');

class MessageController {
  static async createMessage(req, res) {
    try {
      const { topicId, content } = req.body;
      const userId = req.session.user._id; // Assuming session contains the logged-in user
      console.log("Request body:", req.body);
      console.log("Session user:", req.session.user);

      // Create a new message
      const message = new Message({
        topic: topicId,
        user: userId,
        content,
      });
      await message.save();

      // Notify subscribers of the topic
      topicObserver.notify(topicId, message);

      res.status(201).json({ message: 'Message created successfully', message });
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ error: 'Internal server error' });
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
              .populate('user', 'username'), // Populate the user field with the username
          };
        })
      );

      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = MessageController;