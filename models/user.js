//import required modules
const bcrypt = require('bcrypt');
const { pool } = require('../dbConfig');

//Define various asynchronous methods
//SQL quries to insert and find a new user, values in the SQL query
const User = {
  async create(name, email, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = `
        INSERT INTO users (name, email, password, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING id, name, email, created_at
      `;
      const values = [name, email, hashedPassword];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async comparePassword(candidatePassword, hashedPassword) {
    try {
      return await bcrypt.compare(candidatePassword, hashedPassword);
    } catch (error) {
      throw error;
    }
  },

  async updateLastLogin(userId) {
    try {
      const query = 'UPDATE users SET last_login = NOW() WHERE id = $1';
      await pool.query(query, [userId]);
    } catch (error) {
      throw error;
    }
  },

  async findById(id) {
    try {
      const query = 'SELECT * FROM users WHERE id = $1';
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
};

module.exports = User;




