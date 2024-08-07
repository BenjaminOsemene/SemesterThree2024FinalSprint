/*const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        console.log('Authentication failed: No user with that email');
        // Use a generic message to prevent email enumeration
        return done(null, false, { message: 'Invalid email or password' });
      }

      const isMatch = await User.comparePassword(password, user.password);
      if (isMatch) {
        console.log('Authentication successful for user:', email);
        return done(null, user);
      } else {
        console.log('Authentication failed: Incorrect password for user');
        // Use a generic message to prevent password guessing
        return done(null, false, { message: 'Invalid email or password' });
      }
    } catch (e) {
      console.error('Error during authentication:', e);
      return done(e);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  passport.serializeUser((user, done) => {
    console.log('Serializing user:', user.id);
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      if (!user) {
        console.log('Deserialization failed: User not found');
        return done(null, false);
      }
      console.log('Deserializing user:', user.email);
      done(null, user);
    } catch (err) {
      console.error('Error during deserialization:', err);
      done(err);
    }
  });
}

module.exports = initialize;
*/


const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    try {
      const user = await User.findByEmail(email.toLowerCase());
      if (!user) {
        console.log('Authentication failed: No user with that email');
        return done(null, false, { message: 'Invalid email or password' });
      }

      const isMatch = await User.comparePassword(password, user.password);
      if (isMatch) {
        console.log('Authentication successful for user:', email);
        return done(null, user);
      } else {
        console.log('Authentication failed: Incorrect password for user');
        return done(null, false, { message: 'Invalid email or password' });
      }
    } catch (e) {
      console.error('Error during authentication:', e);
      return done(e);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  passport.serializeUser((user, done) => {
    console.log('Serializing user:', user.id);
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      if (!user) {
        console.log('Deserialization failed: User not found');
        return done(null, false);
      }
      console.log('Deserializing user:', user.email);
      done(null, user);
    } catch (err) {
      console.error('Error during deserialization:', err);
      done(err);
    }
  });
}

module.exports = initialize;
