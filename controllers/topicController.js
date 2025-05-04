const Topic = require('../models/Topic');
const topicObserver = require('../observers/topicObserver');

exports.viewTopic = async (req, res) => {
    const topic = await Topic.findById(req.params.id).populate('messages');
    topic.assessCount = (topic.assessCount || 0) + 1;
    await topic.save();
    res.json(topic);
};

class TopicController {
  static async getTopicById(req, res) {
    try {
      const topicId = req.params.id;
      const topic = await Topic.findById(topicId).populate('messages');

      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }

      topic.assessCount = (topic.assessCount || 0) + 1;
      await topic.save();

      res.status(200).json(topic);
    } catch (error) {
      console.error("Error fetching topic:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async createTopic(req, res) {
    try {
      const topicData = req.body;
      const newTopic = new Topic(topicData);

      const savedTopic = await newTopic.save();

      // Notify observers about the new topic
      topicObserver.notify(savedTopic);

      res.status(201).json({ message: "Topic created successfully", topic: savedTopic });
    } catch (error) {
      console.error("Error creating topic:", error);
      res.status(500).json({ message: "Internal server error" });
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
}

module.exports = TopicController;