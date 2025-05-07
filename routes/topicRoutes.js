const express = require("express");
const router = express.Router();
const TopicController = require("../controllers/topicController");

router.post("/", TopicController.createTopic);
router.post("/:id/subscribe", TopicController.subscribe);
router.post("/:id/unsubscribe", TopicController.unsubscribe);
router.get("/home", TopicController.getHomeTopics); // Move this above the dynamic :id route
router.get("/", TopicController.getAllTopics);
router.get("/:id", TopicController.getTopicById); // Dynamic route should come last

module.exports = router;
