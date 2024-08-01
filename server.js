const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const { Pool } = require('pg');
const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');
const db = require('./config/database'); 
require('dotenv').config();

const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_session_secret',
  resave: false,
  saveUninitialized: true
}));

// Database connections
db.getMongo()
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

db.getPgPool().connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Could not connect to PostgreSQL:', err));

// Routes
app.use('/', authRoutes);
app.use('/search', searchRoutes);

app.get('/', (req, res) => {
  res.render('home');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));