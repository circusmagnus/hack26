const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');

router.post('/', notesController.createNote);

module.exports = router;