const express = require('express');
const path = require('path');
const mongoRoutes = require('./routes/mongoRoutes');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Use the Mongo routes
app.use(mongoRoutes);

app.listen(port, () => {
  console.log('Server started at http://localhost:' + port);
});