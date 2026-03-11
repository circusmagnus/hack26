const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

// In-memory "database" for demonstration purposes
let notes = [
    { id: '1', title: 'My First Note', content: 'This is the content of my first note.', category_id: null },
    { id: '2', title: 'Meeting Minutes', content: 'Discussed project timelines and budget.', category_id: null },
    { id: '3', title: 'Ideas for new features', content: 'Implement user authentication and search.', category_id: null }
];

let categories = [
    { id: 'cat1', name: 'Personal' },
    { id: 'cat2', name: 'Work' }
];
let nextCategoryId = 3;

// Notes Endpoints (from NMS-3)
app.get('/notes', (req, res) => {
    res.json(notes);
});

app.get('/notes/:id', (req, res) => {
    const note = notes.find(n => n.id === req.params.id);
    if (note) {
        res.json(note);
    } else {
        res.status(404).json({ message: 'Note not found' });
    }
});

// Categories Endpoints (for NMS-6)

// GET all categories
app.get('/categories', (req, res) => {
    res.json(categories);
});

// POST a new category
app.post('/categories', (req, res) => {
    const { name } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Category name cannot be empty.' });
    }

    if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
        return res.status(409).json({ message: 'Category with this name already exists.' });
    }

    const newCategory = { id: `cat${nextCategoryId++}`, name: name.trim() };
    categories.push(newCategory);
    res.status(201).json(newCategory);
});

// DELETE a category by ID
app.delete('/categories/:id', (req, res) => {
    const { id } = req.params;

    // TODO: Implement check for associated notes when NMS-7 is done.
    // For now, assuming no notes are linked or always allowing deletion.
    const hasAssociatedNotes = notes.some(note => note.category_id === id);
    if (hasAssociatedNotes) {
        return res.status(400).json({ message: 'Cannot delete category with assigned notes.' });
    }

    const initialLength = categories.length;
    categories = categories.filter(cat => cat.id !== id);

    if (categories.length < initialLength) {
        res.status(204).send(); // No Content
    } else {
        res.status(404).json({ message: 'Category not found' });
    }
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
