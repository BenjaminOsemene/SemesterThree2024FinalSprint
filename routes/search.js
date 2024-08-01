const express = require('express');
const router = express.Router();
const { Client } = require('pg');
const mongoose = require('mongoose');
const dbConfig = require('../config/database');

router.get('/', (req, res) => {
  if (!req.session.user_id) {
    return res.redirect('/login');
  }
  res.render('search');
});

router.post('/', async (req, res) => {
  if (!req.session.user_id) {
    return res.redirect('/login');
  }

  const { query, dataSource } = req.body;
  let results = [];

  if (dataSource === 'postgres' || dataSource === 'both') {
    const pgClient = new Client(dbConfig.postgresURI);
    await pgClient.connect();
    const pgResults = await pgClient.query('SELECT * FROM your_table WHERE column LIKE $1', [`%${query}%`]);
    results = results.concat(pgResults.rows);
    await pgClient.end();
  }

  if (dataSource === 'mongo' || dataSource === 'both') {
    const mongoResults = await mongoose.connection.db.collection('your_collection').find({ field: { $regex: query, $options: 'i' } }).toArray();
    results = results.concat(mongoResults);
  }

  // Log the search
  console.log(`User ${req.session.user_id} searched for "${query}" in ${dataSource}`);

  res.render('results', { results });
});

module.exports = router;