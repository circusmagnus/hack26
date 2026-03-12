const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameStatusMessage = document.getElementById('game-status-message');

const gridSize = 20; // Size of each snake segment and food item
const tileCount = canvas.width / gridSize; // Number of tiles in a row/column

let snake = [{ x: 10 * gridSize, y: 10 * gridSize }]; // Initial snake position (head)
let food = {}; // Food position, will be generated
let dx = gridSize; // Horizontal velocity (remote's approach)
let dy = 0; // Vertical velocity (remote's approach)
let score = 0;
let gameOver = false;
let changingDirection = false; // To prevent multiple direction changes per game tick

// Generate initial food position
function generateFood() {
    let newFoodX, newFoodY;
    do {
        newFoodX = Math.floor(Math.random() * tileCount) * gridSize;
        newFoodY = Math.floor(Math.random() * tileCount) * gridSize;
    } while (snake.some(segment => segment.x === newFoodX && segment.y === newFoodY));
    food = { x: newFoodX, y: newFoodY };
}

// Draw a single snake segment or food item
function drawRect(x, y, color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = 'darkgreen';
    ctx.fillRect(x, y, gridSize, gridSize);
    ctx.strokeRect(x, y, gridSize, gridSize);
}

// Draw the snake
function drawSnake() {
    snake.forEach(segment => drawRect(segment.x, segment.y, 'lightgreen'));
}

// Draw the food
function drawFood() {
    drawRect(food.x, food.y, 'red');
}

// Move the snake and handle collisions
function moveSnake() {
    // Create the new head
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Collision detection
    // 1. Canvas borders
    if (head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height) {
        gameOver = true;
        return;
    }

    // 2. Self-collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
            return;
        }
    }

    // Add the new head to the beginning of the snake array
    snake.unshift(head);

    // Check if snake ate food
    const didEatFood = head.x === food.x && head.y === food.y;
    if (didEatFood) {
        score += 10;
        generateFood(); // Generate new food
    } else {
        // Remove the tail if no food was eaten
        snake.pop();
    }
}

// Handle keyboard input
document.addEventListener('keydown', e => {
    if (gameOver) return; // Prevent changing direction after game over
    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = e.keyCode;
    const goingUp = dy === -gridSize;
    const goingDown = dy === gridSize;
    const goingLeft = dx === -gridSize;
    const goingRight = dx === gridSize;

    // Up arrow
    if (keyPressed === 38 && !goingDown) {
        dx = 0;
        dy = -gridSize;
    }
    // Down arrow
    if (keyPressed === 40 && !goingUp) {
        dx = 0;
        dy = gridSize;
    }
    // Left arrow
    if (keyPressed === 37 && !goingRight) {
        dx = -gridSize;
        dy = 0;
    }
    // Right arrow
    if (keyPressed === 39 && !goingLeft) {
        dx = gridSize;
        dy = 0;
    }
});

// Main game loop
function gameTick() { // Renamed from main to gameTick for clarity
    if (gameOver) {
        gameStatusMessage.innerText = 'Game Over!';
        return; // Stop the game loop
    }

    changingDirection = false; // Reset for next game tick

    setTimeout(function onTick() { 
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        drawFood();
        moveSnake(); // This now includes collision detection
        drawSnake();

        // Check if game is over after moveSnake, before the next tick
        if (!gameOver) {
            gameTick(); // Call gameTick again if game is not over
        }
    }, 100); // Game speed
}

generateFood(); // Initial food generation
gameTick(); // Start the game loop