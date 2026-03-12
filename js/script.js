const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const gridSize = 20;
const canvasWidth = 400;
const canvasHeight = 400;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Snake object
let snake = [
    { x: 10 * gridSize, y: 10 * gridSize }, // Head of the snake
    { x: 9 * gridSize, y: 10 * gridSize },
    { x: 8 * gridSize, y: 10 * gridSize }
];

const drawSnake = () => {
    snake.forEach(segment => {
        ctx.fillStyle = 'green';
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
        ctx.strokeStyle = 'darkgreen';
        ctx.strokeRect(segment.x, segment.y, gridSize, gridSize);
    });
};

// Initial drawing
drawSnake();
