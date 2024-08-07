const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

// Rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5
});

// Login routes
router.get('/login', (req, res) => {
  res.render('login', { message: req.flash('error') });
});

router.post('/login', loginLimiter, (req, res, next) => {
  console.log('Login attempt:', req.body.email);
  passport.authenticate('local', (err, user, info) => {
    if (err) { 
      console.error('Login error:', err);
      return next(err); 
    }
    if (!user) {
      console.log('Login failed:', info.message);
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) { 
        console.error('Login error:', err);
        return next(err); 
      }
      console.log('User logged in successfully:', user.email);
      return res.redirect('/search');
    });
  })(req, res, next);
});

// Signup routes
router.get('/signup', (req, res) => {
  res.render('signup', { errors: null, error: null, csrfToken: req.csrfToken() });
});

router.post('/signup', [
  body('email').isEmail().normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
    .withMessage('Password must include one lowercase character, one uppercase character, a number, and a special character'),
  body('name').trim().isLength({ min: 2 }).escape()
], async (req, res) => {
  console.log('Signup attempt:', req.body.email);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).render('signup', { 
      errors: errors.array(), 
      error: null, 
      csrfToken: req.csrfToken() 
    });
  }

  try {
    const existingUser = await User.findByEmail(req.body.email.toLowerCase());
    if (existingUser) {
      console.log('Signup failed: Email already in use:', req.body.email);
      return res.status(400).render('signup', { 
        errors: null, 
        error: 'An account with this email already exists', 
        csrfToken: req.csrfToken() 
      });
    }

    const newUser = await User.create(req.body.name, req.body.email.toLowerCase(), req.body.password);
    console.log('User created successfully:', newUser.email);
    req.flash('success', 'Account created successfully! Please log in.');
    res.redirect('/login');
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).render('signup', { 
      errors: null, 
      error: 'An unexpected error occurred. Please try again later.', 
      csrfToken: req.csrfToken() 
    });
  }
});

// Logout route
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { 
      console.error('Logout error:', err);
      return next(err); 
    }
    console.log('User logged out successfully');
    req.flash('success', 'Successfully logged out');
    res.redirect('/');
  });
});

module.exports = router;



