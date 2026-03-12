import React from 'react';
import './App.css'; // Import the CSS file

function App() {
  return (
    <div className="App">
      <h1>Kids Snake Game</h1>
      <div className="game-container">
        {/* The game canvas will be rendered here by Athos's task (SCRUM-462) */}
        <canvas id="gameCanvas" width="400" height="400"></canvas>
      </div>
      <div className="controls">
        {/* Placeholder buttons for on-screen controls */}
        <button className="control-button">▲ Up</button>
        <button className="control-button">◀ Left</button>
        <button className="control-button">▶ Right</button>
        <button className="control-button">▼ Down</button>
      </div>
    </div>
  );
}

export default App;