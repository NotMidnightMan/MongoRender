require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");

require("./db/database");

const authRoutes = require("./routes/authRoutes");
const topicRoutes = require("./routes/topicRoutes");
const messageRoutes = require("./routes/messageRoutes");
const statsRoutes = require("./routes/statsRoutes");
const testRoutes = require("./routes/test");
const userRoutes = require("./routes/userRoutes");

app.use(express.json()); // Middleware to parse JSON requests
app.use(
  session({
    secret: "secret", // Replace with a secure secret
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  console.log(`[DEBUG] Static file request: ${req.url}`);
  next();
});
app.use(express.static("public"));

// Example root route
app.get("/", (req, res) => {
  res.send("Welcome to the MongoRender API!");
});

app.get("/test-db", async (req, res) => {
  try {
    const mongooseConnectionState = mongoose.connection.readyState;
    if (mongooseConnectionState === 1) {
      res.send("Database is connected!");
    } else {
      res.status(500).send("Database is not connected.");
    }
  } catch (error) {
    console.error("Error testing database connection:", error);
    res.status(500).send("Error testing database connection.");
  }
});

app.use("/api/auth", authRoutes); // Mount auth routes
console.log("Auth routes mounted at /api/auth");
app.use("/api/topics", topicRoutes);
console.log("Topic routes mounted at /api/topics");
app.use("/messages", messageRoutes);
app.use("/stats", statsRoutes);
app.use("/test", testRoutes);
app.use("/api/users", userRoutes); // Mount user routes

app.use((req, res) => {
  res.status(404).send("Route not found");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
