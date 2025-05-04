const database = require("../db/database");

class UserController {
  static async getUserById(req, res) {
    try {
      const userId = req.params.id;
      const client = await database.connect();
      const db = database.getDb("MongoRenderDB");
      const usersCollection = db.collection("Users");

      const user = await usersCollection.findOne({ _id: userId });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async createUser(req, res) {
    try {
      const userData = req.body;
      const client = await database.connect();
      const db = database.getDb("MongoRenderDB");
      const usersCollection = db.collection("Users");

      const result = await usersCollection.insertOne(userData);

      res.status(201).json({ message: "User created successfully", userId: result.insertedId });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async deleteUser(req, res) {
    try {
      const userId = req.params.id;
      const client = await database.connect();
      const db = database.getDb("MongoRenderDB");
      const usersCollection = db.collection("Users");

      const result = await usersCollection.deleteOne({ _id: userId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = UserController;