const express = require("express");
const router = express.Router();
const TopicController = require("../controllers/topicController");


router.post("/", TopicController.createTopic);
router.post("/:id/subscribe", TopicController.subscribe);
router.post("/:id/unsubscribe", TopicController.unsubscribe);
router.get("/", TopicController.getAllTopics);
router.get("/:id", TopicController.getTopicById);
router.get("/home", TopicController.getHomeTopics);

module.exports = router;
