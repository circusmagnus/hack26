const express = require('express');
const router = express.Router();
const Note = require('../models/note');
const Category = require('../models/category'); // Added

// Get all notes
router.get('/', (req, res) => {
    res.json(Note.findAll());
});

// Get a single note by ID
router.get('/:id', (req, res) => {
    const note = Note.findById(req.params.id);
    if (note) {
        res.json(note);
    } else {
        res.status(404).send('Note not found');
    }
});

// Create a new note
router.post('/', (req, res) => {
    const { title, content, category_id } = req.body; // Added category_id
    if (!title || !content) {
        return res.status(400).send('Title and content are required');
    }

    // Validate category_id if provided
    if (category_id && !Category.findById(category_id)) {
        return res.status(400).send('Invalid category ID');
    }

    const newNote = Note.create(title, content, category_id); // Passed category_id
    res.status(201).json(newNote);
});

// Update an existing note (NMS-4 implementation)
router.put('/:id', (req, res) => {
    const { title, content, category_id } = req.body; // Added category_id
    
    // Validate category_id if provided
    if (category_id && !Category.findById(category_id)) {
        return res.status(400).send('Invalid category ID');
    }

    const updatedNote = Note.update(req.params.id, title, content, category_id); // Passed category_id

    if (!title || !content) { // This validation should be before Note.update if they are mandatory
        return res.status(400).send('Title and content are required');
    }

    if (updatedNote) {
        res.json(updatedNote);
    } else {
        res.status(404).send('Note not found');
    }
});

module.exports = router;
