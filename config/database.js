//Load environment variable
//Import required modules
require('dotenv').config();
const { Pool } = require('pg');
const mongoose = require('mongoose');

//Define configuration settings for PostgreSQL and MongoDB connections
const config = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/movie_search_engine',
  postgresURI: {
    user: process.env.PG_USER || 'postgres',
    host: process.env.PG_HOST || 'localhost',
    database: process.env.PG_DATABASE || 'movie_search_engine',
    password: process.env.PG_PASSWORD,
    port: parseInt(process.env.PG_PORT, 10) || 5432,
  }
};

//Error handling checks
['PG_HOST', 'PG_PORT', 'PG_DATABASE', 'PG_USER', 'PG_PASSWORD', 'MONGO_URI'].forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`${varName} environment variable is not set.`);
  }
});

if (typeof config.postgresURI.password !== 'string') {
  throw new Error('Invalid PostgreSQL password configuration');
}

const pgPool = new Pool(config.postgresURI);

//Functions to test PostgreSQL and MongoDB connections
async function testPgConnection() {
  try {
    await pgPool.query('SELECT NOW()');
    console.log('Connected to PostgreSQL');
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err);
    throw err;
  }
}

let mongoConnection;

async function connectMongo() {
  if (!mongoConnection) {
    try {
      await mongoose.connect(config.mongoURI);
      mongoConnection = mongoose.connection;
      console.log('Connected to MongoDB');

      //Creating text index
      const moviesCollection = mongoConnection.collection('movies');

      const indexes = await moviesCollection.indexes();
      for (let index of indexes) {
        if (index.key._fts === 'text' && index.name !== 'MovieTextIndex') {
          await moviesCollection.dropIndex(index.name);
        }
      }

      await moviesCollection.createIndex(
        { title: "text", director: "text", description: "text" },
        { name: "MovieTextIndex" }
      );
      console.log('Text index created successfully on movies collection');
    } catch (error) {
      console.error('Could not connect to MongoDB:', error);
      throw error;
    }
  }
  return mongoConnection;
}

module.exports = {
  getPgPool: () => pgPool,
  pgQuery: async (text, params) => await pgPool.query(text, params),
  testPgConnection,
  getMongo: connectMongo,
  closeConnections: async () => {
    try {
      await pgPool.end();
      console.log('PostgreSQL connection closed');
    } catch (error) {
      console.error('Error closing PostgreSQL connection:', error);
    }

    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    }
  }
};

