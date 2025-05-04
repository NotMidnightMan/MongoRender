const express = require('express');
const path = require('path');
const topicRoutes = require('./routes/topicRoutes');
const testRoutes = require('./routes/test');

const app = express();
const port = 3000;

app.use(express.json());
app.use("/api", topicRoutes);
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use("api/test", testRoutes);


// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log('Server started at http://localhost:' + port);
});