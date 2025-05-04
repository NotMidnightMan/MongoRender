const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Topic = require('../models/Topic');
const Message = require('../models/Message');

router.get('/seed', async (req, res) => {
  try {
    let user = await User.findOne();
    if (!user) {
      user = await User.create({
        username: 'testuser',
        password: 'hashedpassword', // Ideally hash this
        subscriptions: []
      });
    }

    const topic = await Topic.create({
      title: 'Test Topic',
      createdBy: user._id,
      subscribers: [user._id],
      accessCount: 0
    });

    await Message.create({
      topic: topic._id,
      user: user._id,
      content: 'Hello, this is a test message!'
    });

    user.subscriptions.push(topic._id);
    await user.save();

    res.json({ message: 'Seeded user, topic, and message.', user, topic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to seed test data' });
  }
});

module.exports = router;
