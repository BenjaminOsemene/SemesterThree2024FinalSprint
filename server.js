const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
const { Pool } = require('pg');
const userRoutes = require('./routes/users');
const indexRoutes = require('./routes/index');
require('dotenv').config();

const app = express();
const expressLayouts = require('express-ejs-layouts');

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Check if all required environment variables are set
const requiredEnvVars = ['PG_HOST', 'PG_PORT', 'PG_DATABASE', 'PG_USER', 'PG_PASSWORD', 'SESSION_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Passport Config
require('./config/passport')(passport);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movie_search_engine')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// PostgreSQL Connection
console.log('Attempting to connect to PostgreSQL with the following config:');
console.log({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER
});

const pgPool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD
});

pgPool.connect()
  .then(() => console.log('PostgreSQL Connected'))
  .catch(err => {
    console.error('PostgreSQL connection error:', err);
    process.exit(1); // Exit the process if unable to connect to the database
  });

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Make pg pool accessible to our router
app.use((req, res, next) => {
  req.pgPool = pgPool;
  next();
});

// Routes
app.use('/', indexRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await pgPool.end();
  console.log('PostgreSQL pool has ended');
  process.exit(0);
});