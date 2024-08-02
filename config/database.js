const { Pool } = require('pg');
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
        await mongoClient.connect();
        mongoConnection = mongoClient.db();
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
        await pgPool.end();
        await mongoClient.close();
    }
};