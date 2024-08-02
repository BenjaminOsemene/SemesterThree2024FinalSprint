const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Welcome page route
router.get('/', (req, res) => {
  res.render('welcome', { 
    title: 'Welcome to AuthApp',
    layout: 'layout'
  });
});

// Dashboard route (protected)
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard',
    user: req.user,
    layout: 'layout'
  });
});

module.exports = router;