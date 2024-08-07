/*const { Pool } = require('pg');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const config = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/movie_search_engine',
    postgresURI: {
        host: process.env.PG_HOST || 'localhost',
        port: process.env.PG_PORT || 5432,
        database: process.env.PG_DATABASE || 'movie_search_engine',
        user: process.env.PG_USER || 'postgres',
        password: process.env.PG_PASSWORD
    }
};

// Ensure all required environment variables are set
if (!config.postgresURI.password) {
    throw new Error('PostgreSQL password not set. Please set PG_PASSWORD environment variable.');
}

// PostgreSQL setup
const pgPool = new Pool(config.postgresURI);

// MongoDB setup
const mongoClient = new MongoClient(config.mongoURI);

let mongoConnection;

async function connectMongo() {
    if (!mongoConnection) {
        try {
            await mongoClient.connect();
            mongoConnection = mongoClient.db();
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Could not connect to MongoDB:', error);
            throw error;
        }
    }
    return mongoConnection;
}

module.exports = {
    // PostgreSQL functions
    getPgPool: () => pgPool,
    pgQuery: (text, params) => pgPool.query(text, params),

    // MongoDB functions
    getMongo: connectMongo,

    // Close connections
    closeConnections: async () => {
        try {
            await pgPool.end();
            console.log('PostgreSQL connection closed');
        } catch (error) {
            console.error('Error closing PostgreSQL connection:', error);
        }

        try {
            await mongoClient.close();
            console.log('MongoDB connection closed');
        } catch (error) {
            console.error('Error closing MongoDB connection:', error);
        }
    }
};
*/

/*
const { Pool } = require('pg');
const mongoose = require('mongoose');
require('dotenv').config();

const config = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/movie_search_engine',
    postgresURI: {
        host: process.env.PG_HOST || 'localhost',
        port: process.env.PG_PORT || 5432,
        database: process.env.PG_DATABASE || 'movie_search_engine',
        user: process.env.PG_USER || 'postgres',
        password: process.env.PG_PASSWORD
    }
};

// Ensure all required environment variables are set
if (!config.postgresURI.password) {
    throw new Error('PostgreSQL password not set. Please set PG_PASSWORD environment variable.');
}

// PostgreSQL setup
const pgPool = new Pool(config.postgresURI);

// Test PostgreSQL connection
pgPool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to PostgreSQL:', err);
    } else {
        console.log('Connected to PostgreSQL');
    }
});

// MongoDB setup
let mongoConnection;

async function connectMongo() {
    if (!mongoConnection) {
        try {
            await mongoose.connect(config.mongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            mongoConnection = mongoose.connection;
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Could not connect to MongoDB:', error);
            throw error;
        }
    }
    return mongoConnection;
}

module.exports = {
    // PostgreSQL functions
    getPgPool: () => pgPool,
    pgQuery: async (text, params) => await pgPool.query(text, params),

    // MongoDB functions
    getMongo: connectMongo,

    // Close connections
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

*/


/*
const { Pool } = require('pg');
const mongoose = require('mongoose');
require('dotenv').config();

const config = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/movie_search_engine',
    postgresURI: {
        host: process.env.PG_HOST || 'localhost',
        port: process.env.PG_PORT || 5432,
        database: process.env.PG_DATABASE || 'movie_search_engine',
        user: process.env.PG_USER || 'postgres',
        password: process.env.PG_PASSWORD
    }
};

// Ensure all required environment variables are set
if (!config.postgresURI.password) {
    throw new Error('PostgreSQL password not set. Please set PG_PASSWORD environment variable.');
}

// PostgreSQL setup
const pgPool = new Pool(config.postgresURI);

// Test PostgreSQL connection
pgPool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to PostgreSQL:', err);
    } else {
        console.log('Connected to PostgreSQL');
    }
});

// MongoDB setup
let mongoConnection;

async function connectMongo() {
    if (!mongoConnection) {
        try {
            await mongoose.connect(config.mongoURI);
            mongoConnection = mongoose.connection;
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Could not connect to MongoDB:', error);
            throw error;
        }
    }
    return mongoConnection;
}

module.exports = {
    // PostgreSQL functions
    getPgPool: () => pgPool,
    pgQuery: async (text, params) => await pgPool.query(text, params),

    // MongoDB functions
    getMongo: connectMongo,

    // Close connections
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
*/


/*
const { Pool } = require('pg');
const mongoose = require('mongoose');
require('dotenv').config();

const config = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/movie_search_engine',
    postgresURI: {
        host: process.env.PG_HOST || 'localhost',
        port: process.env.PG_PORT || 5432,
        database: process.env.PG_DATABASE || 'movie_search_engine',
        user: process.env.PG_USER || 'postgres',
        password: process.env.PG_PASSWORD
    }
};

// Ensure all required environment variables are set
['PG_PASSWORD', 'MONGO_URI'].forEach(varName => {
    if (!process.env[varName]) {
        throw new Error(`${varName} environment variable is not set.`);
    }
});

// Log PostgreSQL configuration for debugging purposes
console.log('PostgreSQL Configuration:', config.postgresURI);

// PostgreSQL setup
const pgPool = new Pool(config.postgresURI);

// Test PostgreSQL connection
pgPool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to PostgreSQL:', err);
    } else {
        console.log('Connected to PostgreSQL');
    }
});

// MongoDB setup
let mongoConnection;

async function connectMongo() {
    if (!mongoConnection) {
        try {
            await mongoose.connect(config.mongoURI);
            mongoConnection = mongoose.connection;
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Could not connect to MongoDB:', error);
            throw error;
        }
    }
    return mongoConnection;
}

module.exports = {
    // PostgreSQL functions
    getPgPool: () => pgPool,
    pgQuery: async (text, params) => await pgPool.query(text, params),

    // MongoDB functions
    getMongo: connectMongo,

    // Close connections
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
*/


/*
const { Pool } = require('pg');
const mongoose = require('mongoose');
require('dotenv').config();

const config = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/movie_search_engine',
    postgresURI: {
        host: process.env.PG_HOST || 'localhost',
        port: process.env.PG_PORT || 5432,
        database: process.env.PG_DATABASE || 'movie_search_engine',
        user: process.env.PG_USER || 'postgres',
        password: process.env.PG_PASSWORD
    }
};

// Ensure all required environment variables are set
['PG_PASSWORD', 'MONGO_URI'].forEach(varName => {
    if (!process.env[varName]) {
        throw new Error(`${varName} environment variable is not set.`);
    }
});

// PostgreSQL setup
const pgPool = new Pool(config.postgresURI);

// Test PostgreSQL connection
pgPool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to PostgreSQL:', err);
    } else {
        console.log('Connected to PostgreSQL');
    }
});

// MongoDB setup
let mongoConnection;

async function connectMongo() {
    if (!mongoConnection) {
        try {
            await mongoose.connect(config.mongoURI);
            mongoConnection = mongoose.connection;
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Could not connect to MongoDB:', error);
            throw error;
        }
    }
    return mongoConnection;
}

module.exports = {
    // PostgreSQL functions
    getPgPool: () => pgPool,
    pgQuery: async (text, params) => await pgPool.query(text, params),

    // MongoDB functions
    getMongo: connectMongo,

    // Close connections
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

*/

/*
const { Pool } = require('pg');
const mongoose = require('mongoose');
require('dotenv').config();

const config = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/movie_search_engine',
    postgresURI: {
        host: process.env.PG_HOST || 'localhost',
        port: parseInt(process.env.PG_PORT, 10) || 5432,
        database: process.env.PG_DATABASE || 'movie_search_engine',
        user: process.env.PG_USER || 'postgres',
        password: process.env.PG_PASSWORD
    }
};

// Ensure all required PostgreSQL environment variables are set
['PG_HOST', 'PG_PORT', 'PG_DATABASE', 'PG_USER', 'PG_PASSWORD', 'MONGO_URI'].forEach(varName => {
    if (!process.env[varName]) {
        throw new Error(`${varName} environment variable is not set.`);
    }
});

// Additional check for PG_PASSWORD
if (typeof process.env.PG_PASSWORD !== 'string' || process.env.PG_PASSWORD.length === 0) {
    throw new Error('PG_PASSWORD must be a non-empty string');
}

// PostgreSQL setup
const pgPool = new Pool(config.postgresURI);

// Test PostgreSQL connection
async function testPgConnection() {
    try {
        const res = await pgPool.query('SELECT NOW()');
        console.log('Connected to PostgreSQL');
    } catch (err) {
        console.error('Error connecting to PostgreSQL:', err);
        throw err; // Re-throw the error to be caught by the caller
    }
}

// MongoDB setup
let mongoConnection;

async function connectMongo() {
    if (!mongoConnection) {
        try {
            await mongoose.connect(config.mongoURI);
            mongoConnection = mongoose.connection;
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Could not connect to MongoDB:', error);
            throw error;
        }
    }
    return mongoConnection;
}

module.exports = {
    // PostgreSQL functions
    getPgPool: () => pgPool,
    pgQuery: async (text, params) => await pgPool.query(text, params),
    testPgConnection,

    // MongoDB functions
    getMongo: connectMongo,

    // Close connections
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
*/

/*
const { Pool } = require('pg');
const mongoose = require('mongoose');
require('dotenv').config();

const config = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/movie_search_engine',
    postgresURI: {
        host: process.env.PG_HOST || 'localhost',
        port: parseInt(process.env.PG_PORT, 10) || 5432,
        database: process.env.PG_DATABASE || 'movie_search_engine',
        user: process.env.PG_USER || 'postgres',
        password: process.env.PG_PASSWORD
    }
};

// Ensure all required PostgreSQL environment variables are set
['PG_HOST', 'PG_PORT', 'PG_DATABASE', 'PG_USER', 'PG_PASSWORD', 'MONGO_URI'].forEach(varName => {
    if (!process.env[varName]) {
        throw new Error(`${varName} environment variable is not set.`);
    }
});

// Additional check for PG_PASSWORD
if (typeof process.env.PG_PASSWORD !== 'string' || process.env.PG_PASSWORD.length === 0) {
    throw new Error('PG_PASSWORD must be a non-empty string');
}

// PostgreSQL setup
const pgPool = new Pool(config.postgresURI);

// Test PostgreSQL connection
async function testPgConnection() {
    try {
        const res = await pgPool.query('SELECT NOW()');
        console.log('Connected to PostgreSQL');
    } catch (err) {
        console.error('Error connecting to PostgreSQL:', err);
        throw err; // Re-throw the error to be caught by the caller
    }
}

// MongoDB setup
let mongoConnection;

async function connectMongo() {
    if (!mongoConnection) {
        try {
            await mongoose.connect(config.mongoURI);
            mongoConnection = mongoose.connection;
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Could not connect to MongoDB:', error);
            throw error;
        }
    }
    return mongoConnection;
}

module.exports = {
    // PostgreSQL functions
    getPgPool: () => pgPool,
    pgQuery: async (text, params) => await pgPool.query(text, params),
    testPgConnection,

    // MongoDB functions
    getMongo: connectMongo,

    // Close connections
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
*/
/*require('dotenv').config();
const { Pool } = require('pg');
const mongoose = require('mongoose');

const config = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/movie_search_engine',
    postgresURI: {
        host: process.env.PG_HOST || 'localhost',
        port: parseInt(process.env.PG_PORT, 10) || 5432,
        database: process.env.PG_DATABASE || 'movie_search_engine',
        user: process.env.PG_USER || 'postgres',
        password: process.env.PG_PASSWORD, // Make sure this is correctly set
    }
};

// Ensure all required PostgreSQL environment variables are set
['PG_HOST', 'PG_PORT', 'PG_DATABASE', 'PG_USER', 'PG_PASSWORD', 'MONGO_URI'].forEach(varName => {
    if (!process.env[varName]) {
        throw new Error(`${varName} environment variable is not set.`);
    }
});

if (typeof config.postgresURI.password !== 'string') {
    console.error('PostgreSQL password is not a string:', config.postgresURI.password);
    throw new Error('Invalid PostgreSQL password configuration');
}

// PostgreSQL setup
const pgPool = new Pool(config.postgresURI);

// Test PostgreSQL connection
async function testPgConnection() {
    try {
        const res = await pgPool.query('SELECT NOW()');
        console.log('Connected to PostgreSQL');
    } catch (err) {
        console.error('Error connecting to PostgreSQL:', err);
        throw err; // Re-throw the error to be caught by the caller
    }
}

// MongoDB setup
let mongoConnection;

async function connectMongo() {
    if (!mongoConnection) {
        try {
            await mongoose.connect(config.mongoURI);
            mongoConnection = mongoose.connection;
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Could not connect to MongoDB:', error);
            throw error;
        }
    }
    return mongoConnection;
}

module.exports = {
    // PostgreSQL functions
    getPgPool: () => pgPool,
    pgQuery: async (text, params) => await pgPool.query(text, params),
    testPgConnection,

    // MongoDB functions
    getMongo: connectMongo,

    // Close connections
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
*/


/*require('dotenv').config();
const { Pool } = require('pg');
const mongoose = require('mongoose');

const config = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/movie_search_engine',
    postgresURI: {
        user: process.env.PG_USER || 'postgres',
        host: process.env.PG_HOST || 'localhost',
        database: process.env.PG_DATABASE || 'movie_search_engine',
        password: process.env.PG_PASSWORD, // Ensure this is correctly set
        port: parseInt(process.env.PG_PORT, 10) || 5432,
    }
};

// Ensure all required PostgreSQL environment variables are set
['PG_HOST', 'PG_PORT', 'PG_DATABASE', 'PG_USER', 'PG_PASSWORD', 'MONGO_URI'].forEach(varName => {
    if (!process.env[varName]) {
        throw new Error(`${varName} environment variable is not set.`);
    }
});

if (typeof config.postgresURI.password !== 'string') {
    console.error('PostgreSQL password is not a string:', config.postgresURI.password);
    throw new Error('Invalid PostgreSQL password configuration');
}

// PostgreSQL setup
const pgPool = new Pool(config.postgresURI);

// Test PostgreSQL connection
async function testPgConnection() {
    try {
        const res = await pgPool.query('SELECT NOW()');
        console.log('Connected to PostgreSQL:', res.rows[0].now);
    } catch (err) {
        console.error('Error connecting to PostgreSQL:', err);
        throw err; // Re-throw the error to be caught by the caller
    }
}

// MongoDB setup
let mongoConnection;

async function connectMongo() {
    if (!mongoConnection) {
        try {
            await mongoose.connect(config.mongoURI);
            mongoConnection = mongoose.connection;
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Could not connect to MongoDB:', error);
            throw error;
        }
    }
    return mongoConnection;
}

module.exports = {
    // PostgreSQL functions
    getPgPool: () => pgPool,
    pgQuery: async (text, params) => await pgPool.query(text, params),
    testPgConnection,

    // MongoDB functions
    getMongo: connectMongo,

    // Close connections
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
*/


/*
require('dotenv').config();
const { Pool } = require('pg');
const mongoose = require('mongoose');

const config = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/movie_search_engine',
  postgresURI: {
    user: process.env.PG_USER || 'postgres',
    host: process.env.PG_HOST || 'localhost',
    database: process.env.PG_DATABASE || 'movie_search_engine',
    password: process.env.PG_PASSWORD, // Ensure this is correctly set
    port: parseInt(process.env.PG_PORT, 10) || 5432,
  }
};

// Ensure all required PostgreSQL environment variables are set
['PG_HOST', 'PG_PORT', 'PG_DATABASE', 'PG_USER', 'PG_PASSWORD', 'MONGO_URI'].forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`${varName} environment variable is not set.`);
  }
});

if (typeof config.postgresURI.password !== 'string') {
  console.error('PostgreSQL password is not a string:', config.postgresURI.password);
  throw new Error('Invalid PostgreSQL password configuration');
}

// PostgreSQL setup
const pgPool = new Pool(config.postgresURI);

// Test PostgreSQL connection
async function testPgConnection() {
  try {
    const res = await pgPool.query('SELECT NOW()');
    console.log('Connected to PostgreSQL:', res.rows[0].now);
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err);
    throw err; // Re-throw the error to be caught by the caller
  }
}

// MongoDB setup
let mongoConnection;

async function connectMongo() {
  if (!mongoConnection) {
    try {
      await mongoose.connect(config.mongoURI);
      mongoConnection = mongoose.connection;
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Could not connect to MongoDB:', error);
      throw error;
    }
  }
  return mongoConnection;
}

module.exports = {
  // PostgreSQL functions
  getPgPool: () => pgPool,
  pgQuery: async (text, params) => await pgPool.query(text, params),
  testPgConnection,
  postgresURI: config.postgresURI,  // Add this line

  // MongoDB functions
  getMongo: connectMongo,

  // Close connections
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
*/




require('dotenv').config();
const { Pool } = require('pg');
const mongoose = require('mongoose');

const config = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/movie_search_engine',
  postgresURI: {
    user: process.env.PG_USER || 'postgres',
    host: process.env.PG_HOST || 'localhost',
    database: process.env.PG_DATABASE || 'movie_search_engine',
    password: process.env.PG_PASSWORD, // Ensure this is correctly set
    port: parseInt(process.env.PG_PORT, 10) || 5432,
  }
};

// Ensure all required PostgreSQL environment variables are set
['PG_HOST', 'PG_PORT', 'PG_DATABASE', 'PG_USER', 'PG_PASSWORD', 'MONGO_URI'].forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`${varName} environment variable is not set.`);
  }
});

if (typeof config.postgresURI.password !== 'string') {
  console.error('PostgreSQL password is not a string:', config.postgresURI.password);
  throw new Error('Invalid PostgreSQL password configuration');
}

// PostgreSQL setup
const pgPool = new Pool(config.postgresURI);

// Test PostgreSQL connection
async function testPgConnection() {
  try {
    const res = await pgPool.query('SELECT NOW()');
    console.log('Connected to PostgreSQL:', res.rows[0].now);
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err);
    throw err; // Re-throw the error to be caught by the caller
  }
}

// MongoDB setup
let mongoConnection;

async function connectMongo() {
  if (!mongoConnection) {
    try {
      await mongoose.connect(config.mongoURI);
      mongoConnection = mongoose.connection;
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Could not connect to MongoDB:', error);
      throw error;
    }
  }
  return mongoConnection;
}

module.exports = {
  // PostgreSQL functions
  getPgPool: () => pgPool,
  pgQuery: async (text, params) => await pgPool.query(text, params),
  testPgConnection,
  postgresURI: config.postgresURI,  // Add this line

  // MongoDB functions
  getMongo: connectMongo,

  // Close connections
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