require('dotenv').config();
const { Pool } = require('pg');

// Ensure all required PostgreSQL environment variables are set
['PG_USER', 'PG_HOST', 'PG_DATABASE', 'PG_PASSWORD', 'PG_PORT'].forEach(varName => {
    if (!process.env[varName]) {
        throw new Error(`${varName} environment variable is not set.`);
    }
});

// Log the password to verify it
//console.log('DB_PASSWORD:', process.env.PG_PASSWORD);

// Create a new Pool instance with the provided configuration
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT, 10) || 5432 
});

// Test PostgreSQL connection
async function testPgConnection() {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Connected to PostgreSQL:', res.rows[0].now);
    } catch (err) {
        console.error('Error connecting to PostgreSQL:', err);
        throw err; 
    }
}

// Export the Pool instance and test connection function
module.exports = {
    pool,
    testPgConnection
}