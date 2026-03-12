// Game constants
const CANVAS_SIZE = 400;
const GRID_SIZE = 20;
const TILE_COUNT = CANVAS_SIZE / GRID_SIZE;
const INITIAL_SNAKE_LENGTH = 3;
const GAME_SPEED = 150; // Milliseconds per frame

// Game variables
let snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
];
let food = {};
let dx = 1; // Initial direction x (right)
let dy = 0; // Initial direction y (no vertical movement)
let changingDirection = false;
let score = 0;
let gameInterval;

// Get canvas and context
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');

// Set canvas size
gameCanvas.width = CANVAS_SIZE;
gameCanvas.height = CANVAS_SIZE;

// Event listener for keyboard input
document.addEventListener('keydown', changeDirection);

// Main game loop
function main() {
    generateFood(); // Generate initial food
    gameInterval = setInterval(gameTick, GAME_SPEED);
}

// Game tick function - updates game state
function gameTick() {
    changingDirection = false;
    clearCanvas();
    drawFood(); // Draw food
    moveSnake();
    drawSnake();
}

// Draw a square
function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = 'darkgreen';
    ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    ctx.strokeRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
}

// Draw the snake
function drawSnake() {
    snake.forEach(segment => drawSquare(segment.x, segment.y, 'lightgreen'));
}

// Clear the canvas
function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

// Move the snake
function moveSnake() {
    // Create the new head
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    // Add the new head to the beginning of the snake array
    snake.unshift(head);

    const didEat = didEatFood();
    if (didEat) {
        score += 10;
        generateFood();
    } else {
        snake.pop(); // Remove the tail only if no food was eaten
    }
}

// Change snake direction based on keyboard input
function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

// Food generation and consumption logic
function generateFood() {
    let newFood = {
        x: Math.floor(Math.random() * TILE_COUNT),
        y: Math.floor(Math.random() * TILE_COUNT)
    };
    // Check if food is on snake
    for (let i = 0; i < snake.length; i++) {
        if (newFood.x === snake[i].x && newFood.y === snake[i].y) {
            generateFood(); // Regenerate food if it's on the snake
            return;
        }
    }
    food = newFood;
}

function drawFood() {
    drawSquare(food.x, food.y, 'red');
}

function didEatFood() {
    const head = { x: snake[0].x, y: snake[0].y };
    return head.x === food.x && head.y === food.y;
}

// Start the game
main();
