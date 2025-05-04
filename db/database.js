const mongoose = require('mongoose');
let instance = null;

class Database {
  constructor() {
    if (!instance) {
      instance = this;
      this._connect();
    }
    return instance;
  }

  _connect() {
    mongoose.connect('mongodb://localhost:27017/messageApp', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
}

module.exports = new Database();