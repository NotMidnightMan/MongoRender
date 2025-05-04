const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Topic = require('../models/Topic');
const topicObserver = require('../observers/topicObserver');

router.post('/', async (req, res) => {
  const message = new Message({
    author: req.session.user._id,
    content: req.body.content,
    topic: req.body.topic
  });
  await message.save();
  topicObserver.notify(req.body.topic, message);
  res.status(201).json(message);
});

router.get('/feed', async (req, res) => {
  const userTopics = req.session.user.subscribedTopics;
  const messages = await Promise.all(userTopics.map(async topicId => {
    return {
      topicId,
      messages: await Message.find({ topic: topicId })
        .sort({ timestamp: -1 })
        .limit(2)
        .populate('author')
    };
  }));
  res.json(messages);
});

module.exports = router;