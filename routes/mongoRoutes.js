const express = require('express');
const { getPart } = require('../controllers/mongoController');

const router = express.Router();

router.get('/api/mongo/:item', getPart);

module.exports = router;