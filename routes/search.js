const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const mongoose = require('mongoose');
const dbConfig = require('../config/database');

// Middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please log in to access this page');
  res.redirect('/login');
}

// PostgreSQL connection pool
const pgPool = new Pool(dbConfig.postgresURI);

// Search page
router.get('/', ensureAuthenticated, (req, res) => {
  res.render('search', { user: req.user, csrfToken: req.csrfToken(), messages: req.flash() });
});

// Search functionality
router.post('/', ensureAuthenticated, async (req, res) => {
  const { query, dataSource } = req.body;
  let results = [];

  try {
    if (dataSource === 'postgres' || dataSource === 'both') {
      const pgResults = await pgPool.query(
        'SELECT * FROM movies WHERE title ILIKE $1 OR description ILIKE $1 LIMIT 100',
        [`%${query}%`]
      );
      results = results.concat(pgResults.rows);
    }

    if (dataSource === 'mongo' || dataSource === 'both') {
      const mongoResults = await mongoose.connection.db.collection('movies')
        .find({ 
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
          ]
        })
        .limit(100)
        .toArray();
      results = results.concat(mongoResults);
    }

    // Log the search
    console.log(`User ${req.user.id} searched for "${query}" in ${dataSource}`);

    res.render('results', { 
      results, 
      user: req.user, 
      csrfToken: req.csrfToken(), 
      messages: req.flash(),
      query: query,
      dataSource: dataSource
    });
  } catch (error) {
    console.error('Search error:', error);

    // Specific error handling
    if (error instanceof mongoose.Error) {
      req.flash('error', 'An error occurred with the MongoDB query. Please try again.');
    } else if (error.code === 'ECONNREFUSED') {
      req.flash('error', 'Database connection was refused. Please check your database connection.');
    } else {
      req.flash('error', 'An error occurred while searching. Please try again.');
    }

    res.redirect('/search');
  }
});

module.exports = router;

