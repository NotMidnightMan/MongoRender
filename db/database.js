const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected');

    // Log the database name
    console.log('Connected to database:', mongoose.connection.name);

    // Log the collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in the database:', collections.map(c => c.name));
  }
};

connectDB();

module.exports = mongoose; // Export the Mongoose instance
