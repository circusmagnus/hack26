const pool = require('../config/db');

const Note = {
  create: async (title, content, category_id = null) => {
    try {
      const result = await pool.query(
        'INSERT INTO notes (title, content, category_id) VALUES ($1, $2, $3) RETURNING *;',
        [title, content, category_id]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  },

  delete: async (id) => {
    try {
      const result = await pool.query(
        'DELETE FROM notes WHERE id = $1 RETURNING *;',
        [id]
      );
      return result.rows[0]; // Returns the deleted note or undefined if not found
    } catch (err) {
      throw err;
    }
  },

  getAll: async (category_id = null) => {
    try {
      let query = 'SELECT n.id, n.title, n.content, n.created_at, n.updated_at, c.name as category_name, c.id as category_id FROM notes n LEFT JOIN categories c ON n.category_id = c.id';
      const params = [];

      if (category_id) {
        query += ' WHERE n.category_id = $1';
        params.push(category_id);
      }
      query += ' ORDER BY n.created_at DESC';

      const result = await pool.query(query, params);
      return result.rows;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = Note;