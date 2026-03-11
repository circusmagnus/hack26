const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const notesRouter = require('./routes/notes'); // Import notes router

app.use(express.json());

// Use the notes router for all /notes endpoints
app.use('/notes', notesRouter);

app.get('/', (req, res) => {
  res.send('Note Management Backend API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});