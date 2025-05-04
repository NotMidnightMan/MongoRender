const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');
const User = require('../models/User');

router.post('/', async (req, res) => {
  const topic = new Topic({ title: req.body.title, subscribers: [req.session.user._id] });
  await topic.save();
  const user = await User.findById(req.session.user._id);
  user.subscribedTopics.push(topic._id);
  await user.save();
  res.status(201).json(topic);
});

router.post('/:id/subscribe', async (req, res) => {
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

router.post('/:id/unsubscribe', async (req, res) => {
  const topic = await Topic.findById(req.params.id);
  const user = await User.findById(req.session.user._id);
  user.subscribedTopics.pull(topic._id);
  topic.subscribers.pull(user._id);
  await topic.save();
  await user.save();
  res.json(topic);
});

router.get('/', async (req, res) => {
  const topics = await Topic.find();
  res.json(topics);
});

router.get('/:id', async (req, res) => {
  const topic = await Topic.findById(req.params.id).populate('subscribers');
  topic.accessCount++;
  await topic.save();
  res.json(topic);
});

module.exports = router;
