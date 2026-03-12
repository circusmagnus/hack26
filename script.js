const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay'); // Get score display element
const gameStatusMessage = document.getElementById('game-status-message'); // From HEAD (Aramis's work)

const gridSize = 20; // Size of each snake segment and food item
const tileCount = canvas.width / gridSize; // Number of tiles in a row/column
let snake = [{ x: 10 * gridSize, y: 10 * gridSize }]; // Initial snake position (head)
let food = {}; // Food position, will be generated
let dx = gridSize; // Horizontal velocity
let dy = 0; // Vertical velocity
let score = 0;
let gameOver = false;
let changingDirection = false; // To prevent multiple direction changes per game tick

// Function to update the score display
function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
}

// Generate initial food position
function generateFood() {
    // Ensure food does not spawn on the snake
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
    ctx.strokeStyle = '#333'; // Darker stroke for contrast
    ctx.fillRect(x, y, gridSize, gridSize);
    ctx.strokeRect(x, y, gridSize, gridSize);
}

// Draw the snake
function drawSnake() {
    snake.forEach(segment => drawRect(segment.x, segment.y, '#00FF00')); // Bright green for snake
}

// Draw the food
function drawFood() {
    drawRect(food.x, food.y, '#FFD700'); // Gold for food
}

// Move the snake and handle collisions (Adopted Athos's approach)
function moveSnake() {
    // Create the new head
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Collision detection
    // 1. Canvas borders
    if (head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height) {
        gameOver = true;
        return; // Stop further movement logic if game is over
    }

    // 2. Self-collision (Athos's starting from i=1 is correct)
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
            return; // Stop further movement logic if game is over
        }
    }

    // Add the new head to the beginning of the snake array
    snake.unshift(head);

    // Check if snake ate food
    const didEatFood = head.x === food.x && head.y === food.y;
    if (didEatFood) {
        score += 10;
        generateFood(); // Generate new food
        updateScoreDisplay(); // Update score display when food is eaten
    } else {
        // Remove the tail if no food was eaten
        snake.pop();
    }
}

// Handle keyboard input
document.addEventListener('keydown', e => {
    if (gameOver) return;
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

// Main game loop (Renamed to gameTick from HEAD, kept my setTimeout logic with added gameTick call)
function gameTick() {
    if (gameOver) {
        gameStatusMessage.innerText = 'Game Over!'; // Using Aramis's element
        return; // Stop the game loop
    }

    changingDirection = false;

    setTimeout(function onTick() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        drawFood();
        moveSnake(); // This now includes collision detection
        drawSnake();
        updateScoreDisplay(); // Update score display in each frame

        // Call gameTick again if game is not over (Integrated Athos's if check)
        if (!gameOver) {
            gameTick();
        }
    }, 100); // Game speed
}

generateFood(); // Initial food generation
updateScoreDisplay(); // Initial display of score
gameTick(); // Start the game loop
