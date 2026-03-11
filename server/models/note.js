// This is a dummy model for demonstration.
// In a real application, this would interact with a PostgreSQL database.
let notes = [];
let currentId = 1;

class Note {
    constructor(title, content) {
        this.id = currentId++;
        this.title = title;
        this.content = content;
        this.created_at = new Date();
        this.updated_at = new Date();
    }

    static create(title, content) {
        const newNote = new Note(title, content);
        notes.push(newNote);
        return newNote;
    }

    static findById(id) {
        return notes.find(note => note.id === parseInt(id));
    }

    static update(id, title, content) {
        const note = this.findById(id);
        if (note) {
            note.title = title || note.title;
            note.content = content || note.content;
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
