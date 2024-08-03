const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('express-flash');
const csrf = require('csurf');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');
const db = require('./config/database');
const initializePassport = require('./config/passport');
require('dotenv').config();

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));
app.use(flash());
app.use(helmet());
app.use(morgan('dev'));

// Passport configuration
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// CSRF protection
app.use(csrf({ cookie: true }));

// CSRF token and messages middleware
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.messages = req.flash();
  next();
});

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
  console.log('User:', req.user);
  console.log('Flash messages:', req.flash());
  res.render('home', { 
    user: req.user,
    messages: req.flash()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).send('Form tampered with');
  } else {
    res.status(500).send('Something broke!');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Gracefully close connections on exit
process.on('SIGINT', async () => {
  await db.closeConnections();
  process.exit(0);
});










