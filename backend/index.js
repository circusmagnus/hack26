const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

// In-memory "database" for demonstration purposes
const notes = [
    { id: '1', title: 'My First Note', content: 'This is the content of my first note.' },
    { id: '2', title: 'Meeting Minutes', content: 'Discussed project timelines and budget.' },
    { id: '3', title: 'Ideas for new features', content: 'Implement user authentication and search.' }
];

// GET all notes
app.get('/notes', (req, res) => {
    res.json(notes);
});

// GET a single note by ID
app.get('/notes/:id', (req, res) => {
    const note = notes.find(n => n.id === req.params.id);
    if (note) {
        res.json(note);
    } else {
        res.status(404).json({ message: 'Note not found' });
    }
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
