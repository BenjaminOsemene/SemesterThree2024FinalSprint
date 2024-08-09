//load environment variable,import modules and create instance of exppress app. 
require('dotenv').config();
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
const logSearch = require('./logger'); 

const app = express();

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));
app.use(flash());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
}));
app.use(morgan('dev'));

initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(csrf({ cookie: true }));

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.messages = req.flash();
  res.locals.user = req.user;
  next();
});

app.use('/', authRoutes);
app.use('/search', searchRoutes);

app.post('/search', ensureAuthenticated, async (req, res) => {
  console.log('Search request received'); 
  const { query, dataSource } = req.body;
  const userId = req.user ? req.user.id : 'unknown';

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

// Debugging line
  console.log(`Logging search for user: ${userId}, query: ${query}`); 
  logSearch(userId, query);

  if (dataSource === 'postgres') {
    try {
      const client = await db.getPgClient(); 
      const sqlQuery = `SELECT * FROM movies WHERE title ILIKE $1 OR director ILIKE $1 OR description ILIKE $1`;
      const values = [`%${query}%`];
      const result = await client.query(sqlQuery, values);

      console.log(`Search results: ${result.rows.length} documents found`);
      res.json(result.rows);
    } catch (err) {
      console.error('Error during PostgreSQL search:', err.message);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(400).json({ error: 'Unsupported data source' });
  }
});

app.get('/', (req, res) => {
  res.render('home', { 
    user: req.user,
    messages: req.flash()
  });
});

app.use((req, res, next) => {
  res.status(404).render('404', { user: req.user });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).send('Form tampered with');
  } else {
    res.status(500).render('error', { 
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  }
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await db.getMongo();
    await db.testPgConnection();

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to connect to databases:', err.message);
    process.exit(1);
  }
}
// Starting the server
startServer();

process.on('SIGINT', async () => {
  await db.closeConnections();
  process.exit(0);
});





















