import React, { useState } from 'react';
import './App.css';
import Game from './components/Game';
import GameOverScreen from './components/GameOverScreen';

function App() {
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const handleGameOver = (finalScore) => {
    setScore(finalScore);
    setIsGameOver(true);
  };

  const handleRestartGame = () => {
    setIsGameOver(false);
    setScore(0);
    // The Game component itself will handle re-initializing its state
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Kids Snake Game</h1>
      </header>
      <main>
        {isGameOver ? (
          <GameOverScreen score={score} onRestart={handleRestartGame} />
        ) : (
          <>
            <div className="game-container">
              {/* Game component will render the canvas and handle game logic */}
              <Game onGameOver={handleGameOver} onRestart={handleRestartGame} />
            </div>
            <div className="controls">
              {/* These control buttons are placeholders for on-screen controls (SCRUM-463) */}
              {/* Actual control logic will be handled within the Game component */}
              <button className="control-button">▲ Up</button>
              <button className="control-button">◀ Left</button>
              <button className="control-button">▶ Right</button>
              <button className="control-button">▼ Down</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;