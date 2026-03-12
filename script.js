// Game constants
const CANVAS_SIZE = 400;
const GRID_SIZE = 20;
const TILE_COUNT = CANVAS_SIZE / GRID_SIZE;
const INITIAL_SNAKE_LENGTH = 3;
const GAME_SPEED = 150; // Milliseconds per frame
const OBSTACLE_THRESHOLD = 5; // Snake length to start generating obstacles
const MAX_OBSTACLES = 10; // Maximum number of obstacles

// Game variables
let snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
];
let food = {};
let obstacles = []; // New array for obstacles
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
    if (checkGameOver()) { // Check for game over conditions
        clearInterval(gameInterval);
        alert('Game Over! Score: ' + score);
        return;
    }
    clearCanvas();
    drawFood();
    generateObstacles(); // Regenerate obstacles based on snake length
    drawObstacles(); // Draw obstacles
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

// Draw obstacles
function drawObstacles() {
    obstacles.forEach(obstacle => drawSquare(obstacle.x, obstacle.y, 'gray')); // Draw obstacles in gray
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
    let newFood;
    let validFoodPosition = false;
    while (!validFoodPosition) {
        newFood = {
            x: Math.floor(Math.random() * TILE_COUNT),
            y: Math.floor(Math.random() * TILE_COUNT)
        };
        // Check if food is on snake or obstacles
        validFoodPosition = !snake.some(segment => segment.x === newFood.x && segment.y === newFood.y) &&
                            !obstacles.some(obs => obs.x === newFood.x && obs.y === newFood.y);
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

// Obstacle generation logic
function generateObstacles() {
    obstacles = []; // Clear existing obstacles
    if (snake.length > OBSTACLE_THRESHOLD) {
        const numObstacles = Math.min(MAX_OBSTACLES, Math.floor(snake.length / 2)); // Scale with snake length
        for (let i = 0; i < numObstacles; i++) {
            let obstaclePosition;
            let validPosition = false;
            while (!validPosition) {
                obstaclePosition = {
                    x: Math.floor(Math.random() * TILE_COUNT),
                    y: Math.floor(Math.random() * TILE_COUNT)
                };
                // Check if obstacle is on snake, food, or another obstacle
                validPosition = !snake.some(segment => segment.x === obstaclePosition.x && segment.y === obstaclePosition.y) &&
                                !(obstaclePosition.x === food.x && obstaclePosition.y === food.y) &&
                                !obstacles.some(obs => obs.x === obstaclePosition.x && obs.y === obstaclePosition.y);
            }
            obstacles.push(obstaclePosition);
        }
    }
}

// Check for game over conditions
function checkGameOver() {
    // Check if snake hits itself
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }

    // Check if snake hits wall
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > TILE_COUNT - 1;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > TILE_COUNT - 1;

    // Check if snake hits an obstacle
    const hitObstacle = obstacles.some(obstacle => obstacle.x === snake[0].x && obstacle.y === snake[0].y);

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall || hitObstacle;
}

// Start the game
main();
