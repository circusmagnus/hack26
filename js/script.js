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
ctx.fillStyle = '#e0e0e0';
ctx.fillRect(0, 0, gameWidth, gameHeight);


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
drawFood();

// Game loop (will be expanded in SCRUM-471 and other tasks)
function gameLoop() {
    // This will be filled in later with game logic
    requestAnimationFrame(gameLoop);
}

// Start the game loop
// requestAnimationFrame(gameLoop); // Commented out for now as other parts are not yet implemented