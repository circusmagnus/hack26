const Note = require('../models/note');
const Category = require('../models/category');

const notesController = {
  createNote: async (req, res) => {
    try {
      const { title, content, category_id } = req.body;

      // Input validation
      if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title cannot be empty.' });
      }

      if (title.length > 255) {
        return res.status(400).json({ error: 'Title too long (max 255 characters).' });
      }
      if (content && content.length > 10000) {
        return res.status(400).json({ error: 'Content too long (max 10000 characters).' });
      }

      // Validate category_id if provided
      if (category_id) {
        const categoryExists = await Category.findById(category_id);
        if (!categoryExists) {
          return res.status(400).json({ error: 'Invalid category ID.' });
        }
      }

      const newNote = await Note.create(title, content, category_id);
      res.status(201).json(newNote);
    } catch (error) {
      console.error('Error creating note:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  deleteNote: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedNote = await Note.delete(id);

      if (!deletedNote) {
        return res.status(404).json({ error: 'Note not found.' });
      }

      res.status(200).json({ message: 'Note deleted successfully.', deletedNoteId: id });
    } catch (error) {
      console.error('Error deleting note:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getNotes: async (req, res) => {
    try {
      const { category_id } = req.query;

      // Validate category_id if provided
      if (category_id) {
        const categoryExists = await Category.findById(category_id);
        if (!categoryExists) {
          return res.status(400).json({ error: 'Invalid category ID.' });
        }
      }

      const notes = await Note.getAll(category_id);
      res.status(200).json(notes);
    } catch (error) {
      console.error('Error getting notes:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = notesController;