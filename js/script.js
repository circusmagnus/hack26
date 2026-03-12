// SCRUM-468: Game Initialization & Canvas Setup (Assigned to Athos)
// Basic canvas setup for game rendering.
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20; // Size of each block in the game
let gameWidth = 400;
let gameHeight = 400;

canvas.width = gameWidth;
canvas.height = gameHeight;

// Set canvas background color
const CANVAS_BACKGROUND_COLOR = '#e0e0e0'; // Light grey
ctx.fillStyle = CANVAS_BACKGROUND_COLOR;
ctx.fillRect(0, 0, gameWidth, gameHeight);

// SCRUM-469: Snake Entity Creation (Assigned to Porthos)
let snake = [
    {x: 10 * gridSize, y: 10 * gridSize}, // Head of the snake
    {x: 9 * gridSize, y: 10 * gridSize},  // Body segment 1
    {x: 8 * gridSize, y: 10 * gridSize}   // Body segment 2
];
const snakeColor = 'green';
const snakeBorderColor = 'darkgreen';

function drawSnakePart(snakePart) {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorderColor;
    ctx.fillRect(snakePart.x, snakePart.y, gridSize, gridSize);
    ctx.strokeRect(snakePart.x, snakePart.y, gridSize, gridSize);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

// SCRUM-470: Food Entity Creation (Assigned to Aramis)
let food = {};
const foodColor = 'red';

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (gameWidth / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (gameHeight / gridSize)) * gridSize
    };
}

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Initialize food position
generateFood();

// --- SCRUM-471: Snake Movement (Assigned to Athos) ---
let dx = gridSize; // Horizontal velocity (right)
let dy = 0;        // Vertical velocity
let changingDirection = false; // To prevent rapid direction changes

// Draw everything for the first time
drawSnake();
drawFood();

// Main game loop
function main() {
    if (changingDirection) return;
    changingDirection = true;

    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();

        // Call main again to loop
        main();
    }, 100); // Game speed (lower is faster)
}

function clearCanvas() {
    ctx.fillStyle = CANVAS_BACKGROUND_COLOR;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function moveSnake() {
    // Create the new Snake's head
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    // Add the new head to the beginning of snake body
    snake.unshift(head);

    const didEatFood = snake[0].x === food.x && snake[0].y === food.y;
    if (didEatFood) {
        // Increase score
        // Generate new food location
        generateFood();
    } else {
        // Remove the tail end of the snake
        snake.pop();
    }
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;
    const goingUp = dy === -gridSize;
    const goingDown = dy === gridSize;
    const goingRight = dx === gridSize;
    const goingLeft = dx === -gridSize;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -gridSize;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -gridSize;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = gridSize;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = gridSize;
    }
}

document.addEventListener('keydown', changeDirection);

// Start the game
main();
