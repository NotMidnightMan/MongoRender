const express = require('express');
const AuthController = require('../controllers/authController');
const router = express.Router();

router.post('/register', (req, res) => {
    console.log('Register route hit');
    res.send('Register route is working');
});

router.post('/login', (req, res) => {
    console.log('Login route hit');
    res.send('Login route is working');
});

module.exports = router;