const express = require('express');
const router = express.Router();
const Category = require('../models/category');

// Get all categories
router.get('/', (req, res) => {
    res.json(Category.findAll());
});

// Create a new category
router.post('/', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).send('Category name is required');
    }
    if (Category.findByName(name)) {
        return res.status(409).send('Category with this name already exists');
    }
    const newCategory = Category.create(name);
    res.status(201).json(newCategory);
});

// Delete a category
router.delete('/:id', (req, res) => {
    // In a real scenario, check if notes are associated before deleting
    if (Category.delete(req.params.id)) {
        res.status(204).send(); // No content
    } else {
        res.status(404).send('Category not found');
    }
});

module.exports = router;
