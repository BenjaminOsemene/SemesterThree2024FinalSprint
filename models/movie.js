const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: String,
    trim: true
  },
  year: {
    type: Number, 
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    }
  },
  director: {
    type: String,
    trim: true
  },
  rating: [{
    type: Number,
    min: 0, 
    max: 10
  }]
});

// Create a text index on the title, description, genre, and director fields for efficient text search
movieSchema.index({ title: 'text', description: 'text', genre: 'text', director: 'text' });

module.exports = mongoose.model('Movie', movieSchema);
