import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const Square = ({ value, onClick }) => (
  <button className="square" onClick={onClick}>
    {value}
  </button>
);

const Board = ({ squares, onClick }) => (
  <div className="board-grid">
    {squares.map((square, i) => (
      <Square key={i} value={square} onClick={() => onClick(i)} />
    ))}
  </div>
);

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const App = () => {
  const [humanWins, setHumanWins] = useState(0);
  const [computerWins, setComputerWins] = useState(0);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true); // Human is 'X', Computer is 'O'

  const currentSquares = history[stepNumber];
  const winner = calculateWinner(currentSquares);
  const isDraw = !winner && currentSquares.every(Boolean);

  useEffect(() => {
    if (!xIsNext && !winner && !isDraw) {
      const timer = setTimeout(() => computerMove(), 500); // Computer moves after 0.5 seconds
      return () => clearTimeout(timer);
    }
  }, [xIsNext, currentSquares, winner, isDraw]);

  useEffect(() => {
    if (winner === 'X') {
      setHumanWins(prev => prev + 1);
    } else if (winner === 'O') {
      setComputerWins(prev => prev + 1);
    }
  }, [winner]);

  const handleClick = (i) => {
    if (winner || currentSquares[i] || !xIsNext) { // Ignore if winner, square filled, or computer's turn
      return;
    }
    const newHistory = history.slice(0, stepNumber + 1);
    const squares = [...currentSquares];
    squares[i] = 'X';
    setHistory([...newHistory, squares]);
    setStepNumber(newHistory.length);
    setXIsNext(false); // Switch to computer's turn
  };

  const computerMove = () => {
    const availableMoves = currentSquares.map((sq, i) => sq === null ? i : null).filter(val => val !== null);
    if (availableMoves.length === 0) return; // No moves left

    // Simple AI: choose a random available move
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];

    const newHistory = history.slice(0, stepNumber + 1);
    const squares = [...currentSquares];
    squares[randomMove] = 'O';
    setHistory([...newHistory, squares]);
    setStepNumber(newHistory.length);
    setXIsNext(true); // Switch back to human's turn
  };

  const resetGame = () => {
    setHistory([Array(9).fill(null)]);
    setStepNumber(0);
    setXIsNext(true);
  };

  let status;
  if (winner) {
    status = 'Winner: ' + (winner === 'X' ? 'Human' : 'Computer');
  } else if (isDraw) {
    status = 'Draw!';
  } else {
    status = 'Next player: ' + (xIsNext ? 'Human (X)' : 'Computer (O)');
  }

  return (
    <div className="game">
      <h1>Tic Tac Toe Game</h1>
      <div className="game-info">
        <p>Human Wins: {humanWins}</p>
        <p>Computer Wins: {computerWins}</p>
        <button onClick={resetGame}>Reset Game</button>
      </div>
      <div className="game-board">
        <Board squares={currentSquares} onClick={handleClick} />
      </div>
      <div className="game-status">{status}</div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
