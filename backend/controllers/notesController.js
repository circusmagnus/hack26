const Note = require('../models/note');

const notesController = {
  createNote: async (req, res) => {
    try {
      const { title, content } = req.body;

      // Input validation
      if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title cannot be empty.' });
      }
      // Assuming content can be optional based on test case 3, otherwise add check for content
      // if (!content || content.trim() === '') {
      //   return res.status(400).json({ error: 'Content cannot be empty.' });
      // }

      // Basic length validation (example, adjust as needed)
      if (title.length > 255) {
        return res.status(400).json({ error: 'Title too long (max 255 characters).' });
      }
      if (content && content.length > 10000) { // Assuming a max content length
        return res.status(400).json({ error: 'Content too long (max 10000 characters).' });
      }

      const newNote = await Note.create(title, content);
      res.status(201).json(newNote);
    } catch (error) {
      console.error('Error creating note:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = notesController;