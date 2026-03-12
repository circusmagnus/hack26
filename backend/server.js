
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json()); // Middleware to parse JSON requests

// MongoDB Connection
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/tetris';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// HighScore Schema and Model
const HighScoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const HighScore = mongoose.model('HighScore', HighScoreSchema);

let currentScore = 0; // In-memory score for the current game

app.get('/', (req, res) => {
  res.send('Tetris Backend is running!');
});

// Scoring System Endpoints (from SCRUM-400)
app.get('/score', (req, res) => {
  res.json({ score: currentScore });
});

app.post('/score/add', (req, res) => {
  const { points } = req.body;
  if (typeof points === 'number' && points > 0) {
    currentScore += points;
    res.status(200).json({ message: `Added ${points} points. New score: ${currentScore}` });
  } else {
    res.status(400).json({ error: 'Invalid points value. Must be a positive number.' });
  }
});

app.post('/score/reset', (req, res) => {
  currentScore = 0;
  res.status(200).json({ message: 'Score reset to 0.' });
});

// High Score List Endpoints (for SCRUM-401)

// POST a new high score
app.post('/highscores', async (req, res) => {
  const { name, score } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required and must be a non-empty string.' });
  }
  if (typeof score !== 'number' || score < 0) {
    return res.status(400).json({ error: 'Score is required and must be a non-negative number.' });
  }

  try {
    const newHighScore = new HighScore({ name: name.trim(), score });
    await newHighScore.save();
    res.status(201).json(newHighScore);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save high score.' });
  }
});

// GET top 10 high scores
app.get('/highscores', async (req, res) => {
  try {
    const highScores = await HighScore.find().sort({ score: -1, date: 1 }).limit(10);
    res.status(200).json(highScores);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve high scores.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
