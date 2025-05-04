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

app.use('/auth', authRoutes);
app.use('/topics', topicRoutes);
app.use('/messages', messageRoutes);
app.use('/stats', statsRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));