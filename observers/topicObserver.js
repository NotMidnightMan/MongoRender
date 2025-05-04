class TopicObserver {
    constructor() {
      this.subscribers = new Map();
    }
  
    subscribe(topicId, userId) {
      if (!this.subscribers.has(topicId)) this.subscribers.set(topicId, []);
      this.subscribers.get(topicId).push(userId);
    }
  
    notify(topicId, message) {
      const users = this.subscribers.get(topicId) || [];
      users.forEach(userId => {
        console.log(`Notify ${userId}: New message in ${topicId}: ${message.content}`);
      });
    }
  }
  module.exports = new TopicObserver();