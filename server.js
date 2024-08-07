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

['SESSION_SECRET', 'MONGO_URI', 'PG_PASSWORD'].forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`${varName} environment variable is not set.`);
  }
});

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
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
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
  res.locals.user = req.user;
  next();
});

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

// 404 handler
app.use((req, res, next) => {
  res.status(404).render('404', { user: req.user });
});

// Error handling middleware
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
mongoose.set('debug', true); // Enable Mongoose debugging

// Async function to start the server
async function startServer() {
  try {
    await db.getMongo();
    console.log('Connected to MongoDB');
    await db.getPgPool().connect();
    console.log('Connected to PostgreSQL');

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to connect to databases:', err);
    process.exit(1);
  }
}

// Start the server
startServer();

// Gracefully close connections on exit
process.on('SIGINT', async () => {
  await db.closeConnections();
  process.exit(0);
});












