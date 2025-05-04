const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');

router.get('/topics', async (req, res) => {
  const stats = await Topic.find({}, 'title accessCount');
  res.json(stats);
});

module.exports = router;