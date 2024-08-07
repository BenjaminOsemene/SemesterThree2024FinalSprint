const express = require('express');
const router = express.Router();
const dbConfig = require('../config/database');
const Movie = require('../models/movie');

// Middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please log in to access this page');
  res.redirect('/login');
}

// PostgreSQL connection pool
const pgPool = dbConfig.getPgPool();

// Log PostgreSQL connection parameters for debugging
console.log('PostgreSQL connection parameters:');
console.log(JSON.stringify(dbConfig.postgresURI, null, 2));

// Test PostgreSQL connection
dbConfig.testPgConnection().catch(err => {
  console.error('Error during PostgreSQL connection test:', err);
});

// Search page
router.get('/', ensureAuthenticated, (req, res) => {
  res.render('search', { 
    user: req.user, 
    csrfToken: req.csrfToken(), 
    messages: req.flash() 
  });
});

// Search functionality
router.post('/', ensureAuthenticated, async (req, res) => {
  const { query, dataSource } = req.body;
  const sanitizedQuery = sanitizeInput(query);
  let results = [];

  try {
    if (dataSource === 'postgres' || dataSource === 'both') {
      results = results.concat(await searchPostgres(sanitizedQuery));
    }

    if (dataSource === 'mongo' || dataSource === 'both') {
      results = results.concat(await searchMongo(sanitizedQuery));
    }

    logSearch(req.user.id, sanitizedQuery, dataSource);

    res.render('results', { 
      results, 
      user: req.user, 
      csrfToken: req.csrfToken(), 
      messages: req.flash(),
      query: sanitizedQuery,
      dataSource: dataSource
    });
  } catch (error) {
    console.error('Search error:', error);
    handleSearchError(error, req);
    res.redirect('/search');
  }
});

// Helper Functions

async function searchPostgres(query) {
  try {
    console.log('Executing PostgreSQL query with:', query);
    const pgResults = await pgPool.query(
      "SELECT * FROM movies WHERE genre ILIKE $1",  
      [`%${query}%`]
    );
    console.log('PostgreSQL query results:', pgResults.rows);
    return pgResults.rows;
  } catch (error) {
    console.error('Error in searchPostgres:', error);
    throw error;
  }
}

async function searchMongo(query) {
  try {
    console.log('Executing MongoDB query with:', query);
    const mongoResults = await Movie.find({
      title: { $regex: new RegExp(query, 'i') }
    }).limit(100).exec();
    console.log('MongoDB query results:', mongoResults);
    return mongoResults;
  } catch (error) {
    console.error('Error in searchMongo:', error);
    throw error;
  }
}

function sanitizeInput(input) {
  return input.replace(/[^\w\s]/gi, '');
}

function logSearch(userId, query, dataSource) {
  console.log(`User ${userId} searched for "${query}" in ${dataSource}`);
}

function handleSearchError(error, req) {
  if (error.name === 'MongoError') {
    req.flash('error', 'An error occurred with the MongoDB query. Please try again.');
  } else if (error.code === 'ECONNREFUSED') {
    req.flash('error', 'Database connection was refused. Please check your database connection.');
  } else {
    req.flash('error', 'An error occurred while searching. Please try again.');
  }
}

module.exports = router;
