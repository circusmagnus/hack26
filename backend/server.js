
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json()); // Middleware to parse JSON requests

let currentScore = 0; // In-memory score

app.get('/', (req, res) => {
  res.send('Tetris Backend is running!');
});

// Endpoint to get the current score
app.get('/score', (req, res) => {
  res.json({ score: currentScore });
});

// Endpoint to add points to the score (e.g., when a row is cleared)
app.post('/score/add', (req, res) => {
  const { points } = req.body;
  if (typeof points === 'number' && points > 0) {
    currentScore += points;
    res.status(200).json({ message: `Added ${points} points. New score: ${currentScore}` });
  } else {
    res.status(400).json({ error: 'Invalid points value. Must be a positive number.' });
  }
});

// Endpoint to reset the score (e.g., for a new game)
app.post('/score/reset', (req, res) => {
  currentScore = 0;
  res.status(200).json({ message: 'Score reset to 0.' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
