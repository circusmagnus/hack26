import React from 'react';
import './GameOverScreen.css'; // We'll create this

const GameOverScreen = ({ score, onRestart }) => {
  return (
    <div className="game-over-container">
      <h2>Game Over!</h2>
      <p className="final-score">Your Score: {score}</p>
      <button className="restart-button" onClick={onRestart}>Play Again</button>
    </div>
  );
};

export default GameOverScreen;