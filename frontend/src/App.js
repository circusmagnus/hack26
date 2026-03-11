import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';

const NoteList = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/notes')
      .then(response => response.json())
      .then(data => setNotes(data))
      .catch(error => console.error('Error fetching notes:', error));
  }, []);

  return (
    <div>
      <h1>My Notes</h1>
      {notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        <ul>
          {notes.map(note => (
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
      </Routes>
    </Router>
  );
}

export default App;
