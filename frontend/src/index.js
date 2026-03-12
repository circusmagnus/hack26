import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  const [humanWins, setHumanWins] = useState(0);
  const [computerWins, setComputerWins] = useState(0);

  return (
    <div>
      <h1>Tic Tac Toe Game</h1>
      <div>
        <p>Human Wins: {humanWins}</p>
        <p>Computer Wins: {computerWins}</p>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
