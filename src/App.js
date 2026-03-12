import React, { useRef, useEffect, useState, useCallback } from 'react';
import './App.css';

const CANVAS_SIZE = [800, 800];
const SNAKE_START = [
  [8, 8],
  [8, 9],
];
const FOOD_START = [14, 10];
const SCALE = 40;
const SPEED = 100;
const DIRECTIONS = {
  38: [0, -1], // Up
  40: [0, 1], // Down
  37: [-1, 0], // Left
  39: [1, 0], // Right
};

function App() {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState(SNAKE_START);
  const [food, setFood] = useState(FOOD_START);
  const [direction, setDirection] = useState([0, -1]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const endGame = useCallback(() => {
    setGameOver(true);
  }, []);

  const createFood = useCallback(() => {
    let x = Math.floor(Math.random() * (CANVAS_SIZE[0] / SCALE));
    let y = Math.floor(Math.random() * (CANVAS_SIZE[1] / SCALE));
    return [x, y];
  }, []);

  const checkCollision = useCallback((piece, snk = snake) => {
    // Wall collision
    if (
      piece[0] * SCALE >= CANVAS_SIZE[0] ||
      piece[0] < 0 ||
      piece[1] * SCALE >= CANVAS_SIZE[1] ||
      piece[1] < 0
    ) {
      return true;
    }
    // Self collision
    for (const segment of snk) {
      if (piece[0] === segment[0] && piece[1] === segment[1]) {
        return true;
      }
    }
    return false;
  }, [snake]);

  const checkFoodCollision = useCallback((newSnake) => {
    if (newSnake[0][0] === food[0] && newSnake[0][1] === food[1]) {
      let newFood = createFood();
      while (checkCollision(newFood, newSnake)) {
        newFood = createFood();
      }
      setFood(newFood);
      setScore((prevScore) => prevScore + 1);
      return true;
    }
    return false;
  }, [food, createFood, checkCollision]);

  const moveSnake = useCallback(() => {
    const snakeCopy = JSON.parse(JSON.stringify(snake));
    const newSnakeHead = [snakeCopy[0][0] + direction[0], snakeCopy[0][1] + direction[1]];
    snakeCopy.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) {
      endGame();
      return;
    }
    if (!checkFoodCollision(snakeCopy)) {
      snakeCopy.pop();
    }
    setSnake(snakeCopy);
  }, [snake, direction, checkCollision, checkFoodCollision, endGame]);

  useEffect(() => {
    const context = canvasRef.current.getContext('2d');
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    context.clearRect(0, 0, CANVAS_SIZE[0], CANVAS_SIZE[1]);
    context.fillStyle = 'green';
    snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
    context.fillStyle = 'red';
    context.fillRect(food[0], food[1], 1, 1);
  }, [snake, food, gameOver]);

  const handleKeyDown = useCallback((event) => {
    if (DIRECTIONS[event.keyCode]) {
      const newDirection = DIRECTIONS[event.keyCode];
      // Prevent snake from reversing
      if (
        (newDirection[0] * -1 !== direction[0] || newDirection[1] * -1 !== direction[1]) ||
        snake.length === 1 // Allow reversal if snake is only one segment
      ) {
        setDirection(DIRECTIONS[event.keyCode]);
      }
    }
  }, [direction, snake]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (!gameOver) {
      const gameInterval = setInterval(moveSnake, SPEED);
      return () => clearInterval(gameInterval);
    }
  }, [snake, gameOver, moveSnake]);

  const startGame = () => {
    setSnake(SNAKE_START);
    setFood(FOOD_START);
    setDirection([0, -1]);
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Kids Snake Game</h1>
      </header>
      <div className="game-container">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE[0]}
          height={CANVAS_SIZE[1]}
        />
      </div>
      {gameOver && <div className="game-over">Game Over! Score: {score}</div>}
      <button onClick={startGame} className="control-button">Start Game</button>
      <div className="controls">
        {/* Placeholder buttons for on-screen controls, to be implemented in SCRUM-463 */}
        <button className="control-button" onClick={() => setDirection(DIRECTIONS[38])}>▲ Up</button>
        <button className="control-button" onClick={() => setDirection(DIRECTIONS[37])}>◀ Left</button>
        <button className="control-button" onClick={() => setDirection(DIRECTIONS[39])}>▶ Right</button>
        <button className="control-button" onClick={() => setDirection(DIRECTIONS[40])}>▼ Down</button>
      </div>
    </div>
  );
}

export default App;
