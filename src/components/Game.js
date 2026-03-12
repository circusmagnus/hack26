import React, { useRef, useEffect, useState, useCallback } from 'react';

const CANVAS_SIZE = [400, 400]; // Adjusted for smaller initial canvas in App.css max-width
const SNAKE_START = [
  [8, 8],
  [8, 9],
];
const FOOD_START = [14, 10];
const SCALE = 20; // Adjusted for smaller canvas
const SPEED = 150; // Slightly slower for kids
const DIRECTIONS = {
  38: [0, -1], // Up
  40: [0, 1],  // Down
  37: [-1, 0], // Left
  39: [1, 0],  // Right
  // W, S, A, D for alternative controls
  87: [0, -1], // W
  83: [0, 1],  // S
  65: [-1, 0], // A
  68: [1, 0],  // D
};

const Game = ({ onGameOver, onRestart }) => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState(SNAKE_START);
  const [food, setFood] = useState(FOOD_START);
  const [direction, setDirection] = useState([0, -1]);
  const [isGameRunning, setIsGameRunning] = useState(false); // To control game start/stop
  const [score, setScore] = useState(0);

  // Game over logic moved here
  const endGame = useCallback(() => {
    setIsGameRunning(false);
    onGameOver(score); // Notify App.js that game is over with final score
  }, [onGameOver, score]);

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
      // Ensure new food doesn't spawn on the snake
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

    if (checkCollision(newSnakeHead, snakeCopy)) { // Pass snakeCopy for self-collision check
      endGame();
      return;
    }

    if (!checkFoodCollision(snakeCopy)) {
      snakeCopy.pop(); // Remove tail only if no food was eaten
    }
    setSnake(snakeCopy);
  }, [snake, direction, checkCollision, checkFoodCollision, endGame]);

  const startGame = useCallback(() => {
    setSnake(SNAKE_START);
    setFood(FOOD_START);
    setDirection([0, -1]);
    setScore(0);
    setIsGameRunning(true);
    // onRestart is called from App.js to reset game over screen state
    // We don't need to call it here directly, but the state change here will trigger a new game render.
  }, []);

  // Effect for handling game restart from App.js (e.g., "Play Again" button)
  useEffect(() => {
    if (!isGameRunning && !onGameOver && onRestart) { // Check if App.js is trying to restart
      startGame();
    }
  }, [isGameRunning, onGameOver, onRestart, startGame]);


  useEffect(() => {
    const context = canvasRef.current.getContext('2d');
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    context.clearRect(0, 0, CANVAS_SIZE[0], CANVAS_SIZE[1]);

    // Draw grid for kid-friendly visuals
    context.strokeStyle = '#e0e0e0'; // Light grey for grid lines
    for (let x = 0; x < CANVAS_SIZE[0] / SCALE; x++) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, CANVAS_SIZE[1] / SCALE);
      context.stroke();
    }
    for (let y = 0; y < CANVAS_SIZE[1] / SCALE; y++) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(CANVAS_SIZE[0] / SCALE, y);
      context.stroke();
    }


    context.fillStyle = '#a7d940'; // Kid-friendly green for snake
    snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));

    context.fillStyle = '#ff6347'; // Tomato red for food
    context.beginPath();
    context.arc(food[0] + 0.5, food[1] + 0.5, 0.5, 0, 2 * Math.PI); // Draw food as a circle
    context.fill();
  }, [snake, food, isGameRunning]); // Redraw when snake, food, or game running state changes

  // Game loop
  useEffect(() => {
    if (isGameRunning) {
      const gameInterval = setInterval(moveSnake, SPEED);
      return () => clearInterval(gameInterval);
    }
  }, [isGameRunning, moveSnake]);

  // Keyboard input handler
  const handleKeyDown = useCallback((event) => {
    if (DIRECTIONS[event.keyCode]) {
      const newDirection = DIRECTIONS[event.keyCode];
      // Prevent snake from immediately reversing direction
      // Allow reversal if snake is only one segment (head)
      if (
        (newDirection[0] * -1 !== direction[0] || newDirection[1] * -1 !== direction[1]) ||
        snake.length === 1
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

  return (
    <>
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE[0]}
        height={CANVAS_SIZE[1]}
      />
      {!isGameRunning && (
        <button className="control-button" onClick={startGame}>
          Start Game
        </button>
      )}
      {isGameRunning && (
        <div style={{ marginTop: '10px', fontSize: '1.2em', color: '#333' }}>
          Score: {score}
        </div>
      )}
    </>
  );
};

export default Game;