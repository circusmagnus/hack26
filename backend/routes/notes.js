const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');

router.post('/', notesController.createNote);
router.delete('/:id', notesController.deleteNote);
router.get('/', notesController.getNotes);

module.exports = router;