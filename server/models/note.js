const Category = require('./category'); // Added

// This is a dummy model for demonstration.
// In a real application, this would interact with a PostgreSQL database.
let notes = [];
let currentId = 1;

class Note {
    constructor(title, content, category_id) {
        this.id = currentId++;
        this.title = title;
        this.content = content;
        this.category_id = category_id || null; // Added
        this.created_at = new Date();
        this.updated_at = new Date();
    }

    static create(title, content, category_id) {
        // Validate category_id if provided
        if (category_id && !Category.findById(category_id)) {
            return null; // Indicate invalid category
        }
        const newNote = new Note(title, content, category_id);
        notes.push(newNote);
        return newNote;
    }

    static findById(id) {
        return notes.find(note => note.id === parseInt(id));
    }

    static update(id, title, content, category_id) {
        const note = this.findById(id);
        if (note) {
            // Validate category_id if provided
            if (category_id && !Category.findById(category_id)) {
                return null; // Indicate invalid category
            }
            note.title = title !== undefined ? title : note.title;
            note.content = content !== undefined ? content : note.content;
            note.category_id = category_id !== undefined ? category_id : note.category_id; // Added
            note.updated_at = new Date();
            return note;
        }
        return null;
    }

    static delete(id) {
        const initialLength = notes.length;
        notes = notes.filter(note => note.id !== parseInt(id));
        return notes.length < initialLength;
    }

    static findAll() {
        return notes;
    }
}

module.exports = Note;
