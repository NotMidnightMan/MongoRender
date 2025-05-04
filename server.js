const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');

require('./db/database');

const authRoutes = require('./routes/authRoutes');
const topicRoutes = require('./routes/topicRoutes');
const messageRoutes = require('./routes/messageRoutes');
const statsRoutes = require('./routes/statsRoutes');

app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));

// Example root route
app.get("/", (req, res) => {
    res.send("Welcome to the MongoRender API!");
});

app.use('/auth', authRoutes);
app.use('/api', topicRoutes);
app.use('/messages', messageRoutes);
app.use('/stats', statsRoutes);

app.use((req, res) => {
    res.status(404).send("Route not found");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});