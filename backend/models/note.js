const pool = require('../config/db');

const Note = {
  create: async (title, content) => {
    try {
      const result = await pool.query(
        'INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *;',
        [title, content]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  },
};

module.exports = Note;