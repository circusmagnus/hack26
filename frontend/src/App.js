import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import CategoryManager from './CategoryManager';

const NoteList = () => {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotes, setFilteredNotes] = useState([]);

  const fetchNotes = (query = '') => {
    const url = query ? `http://localhost:3001/notes?search_query=${query}` : 'http://localhost:3001/notes';
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setNotes(data);
        setFilteredNotes(data); // Initially, filtered notes are all notes
      })
      .catch(error => console.error('Error fetching notes:', error));
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    fetchNotes(e.target.value); // Fetch notes with the new search query
  };

  return (
    <div>
      <h1>My Notes</h1>
      <nav>
        <Link to="/manage-categories">Manage Categories</Link>
      </nav>
      <input
        type="text"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      {filteredNotes.length === 0 ? (
        <p>No notes found matching your search.</p>
      ) : (
        <ul>
          {filteredNotes.map(note => (
            <li key={note.id}>
              <Link to={`/notes/${note.id}`}>{note.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const NoteDetail = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/notes/${id}`)
      .then(response => response.json())
      .then(data => setNote(data))
      .catch(error => console.error('Error fetching note:', error));
  }, [id]);

  if (!note) {
    return <p>Loading note or Note not found...</p>;
  }

  return (
    <div>
      <Link to="/">Back to Notes</Link>
      <h1>{note.title}</h1>
      <p>{note.content}</p>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NoteList />} />
        <Route path="/notes/:id" element={<NoteDetail />} />
        <Route path="/manage-categories" element={<CategoryManager />} />
      </Routes>
    </Router>
  );
}

export default App;
