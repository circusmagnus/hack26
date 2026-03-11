const express = require('express');
const router = express.Router();
const Note = require('../models/note');

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
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).send('Title and content are required');
    }
    const newNote = Note.create(title, content);
    res.status(201).json(newNote);
});

// Update an existing note (NMS-4 implementation)
router.put('/:id', (req, res) => {
    const { title, content } = req.body;
    const updatedNote = Note.update(req.params.id, title, content);

    if (!title || !content) {
        return res.status(400).send('Title and content are required');
    }

    if (updatedNote) {
        res.json(updatedNote);
    } else {
        res.status(404).send('Note not found');
    }
});

module.exports = router;
