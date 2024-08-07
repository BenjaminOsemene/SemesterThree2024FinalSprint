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
    type: Date
  },
  director: {
    type: String,
    trim: true
  },
  rating: [{
    type: Number,
    trim: true
  }]
});

// Create a text index on the title and description fields for efficient text search
movieSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Movie', movieSchema);