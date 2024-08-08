const express = require('express');
const router = express.Router();
const dbConfig = require('../config/database');
const Movie = require('../models/movie');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please log in to access this page');
  res.redirect('/login');
}

const pgPool = dbConfig.getPgPool();

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('search', { 
    user: req.user, 
    csrfToken: req.csrfToken(), 
    messages: req.flash() 
  });
});

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

async function searchPostgres(query) {
  try {
    const pgResults = await pgPool.query(
      "SELECT * FROM movies WHERE title ILIKE $1 OR genre ILIKE $1",  
      [`%${query}%`]
    );
    return pgResults.rows;
  } catch (error) {
    console.error('Error in searchPostgres:', error);
    throw error;
  }
}

async function searchMongo(query) {
  try {
    console.log('Executing MongoDB query with:', query);
    
    const regexQuery = new RegExp(query, 'i'); // 'i' for case-insensitive

    const mongoResults = await Movie.find({
      $or: [
        { title: regexQuery },
        { description: regexQuery },
        { director: regexQuery } // Include director in the search
      ]
    }).limit(100).exec();

    return mongoResults;
  } catch (error) {
    console.error('Error in searchMongo:', error);
    throw error;
  }
}

// GET route for text search using query parameters
router.get('/search', async (req, res) => {
  const searchTerm = req.query.q; // Get the search term from the query parameter

  try {
    const results = await searchMongo(searchTerm);
    res.json(results); // Send the results as a JSON response
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ error: 'An error occurred while searching' });
  }
});

function sanitizeInput(input) {
  return input.replace(/[^\w\s]/gi, '');
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











