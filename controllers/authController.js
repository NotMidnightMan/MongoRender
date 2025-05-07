const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

class AuthController {
  static async register(req, res) {
    try {
      const { username, password } = req.body;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const user = new User({ username, password: hashedPassword });
      await user.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Set session user
      req.session.user = { _id: user._id, username: user.username };

      const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "1h" });
      res.json({ token });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = AuthController;
