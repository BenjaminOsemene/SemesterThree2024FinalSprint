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

const app = express();

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Define a schema
const movieSchema = new mongoose.Schema({
  title: String,
  director: String,
  description: String,
  // Add other fields as necessary
});

// Create a compound text index
movieSchema.index({ title: 'text', director: 'text', description: 'text' });

// Check if the model already exists
const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);

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

// Place the search endpoint here
app.get('/search', ensureAuthenticated, async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  console.log(`Performing search with query: ${query}`);

  try {
    const results = await Movie.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    console.log(`Search results: ${results.length} documents found`);
    if (results.length === 0) {
      console.log('No documents matched the search criteria.');
    } else {
      console.log('Search results:', JSON.stringify(results, null, 2));
    }

    res.json(results);
  } catch (err) {
    console.error('Error during search:', err.message);
    res.status(500).json({ error: err.message });
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
mongoose.set('debug', false); 

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

startServer();

process.on('SIGINT', async () => {
  await db.closeConnections();
  process.exit(0);
});





















