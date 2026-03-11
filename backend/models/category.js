const pool = require('../config/db');

const Category = {
  findById: async (id) => {
    try {
      const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  },

  getAll: async () => {
    try {
      const result = await pool.query('SELECT * FROM categories ORDER BY name');
      return result.rows;
    } catch (err) {
      throw err;
    }
  },

  create: async (name) => {
    try {
      const result = await pool.query(
        'INSERT INTO categories (name) VALUES ($1) RETURNING *;',
        [name]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  },

  delete: async (id) => {
    try {
      const result = await pool.query(
        'DELETE FROM categories WHERE id = $1 RETURNING *;',
        [id]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  },
};

module.exports = Category;