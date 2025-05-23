const express = require('express');
const MessageController = require('../controllers/messageController');
const router = express.Router();

router.post('/', MessageController.createMessage);
router.get('/feed', MessageController.getMessages);

module.exports = router;