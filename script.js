const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const scoreDisplay = document.getElementById('scoreDisplay'); // Added from HEAD

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10 * gridSize, y: 10 * gridSize }];
let food = {};
let dx = gridSize;
let dy = 0;
let score = 0;
let gameOver = true; // Initialized to true to wait for start
let changingDirection = false;
let gameInterval; // To store the setTimeout reference for clearing

// --- Game Logic Functions ---
function generateFood() {
    let newFoodX, newFoodY;
    do {
        newFoodX = Math.floor(Math.random() * tileCount) * gridSize;
        newFoodY = Math.floor(Math.random() * tileCount) * gridSize;
    } while (snake.some(segment => segment.x === newFoodX && segment.y === newFoodY));
    food = { x: newFoodX, y: newFoodY };
}

function drawRect(x, y, color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = '#333'; // Darker stroke for contrast
    ctx.fillRect(x, y, gridSize, gridSize);
    ctx.strokeRect(x, y, gridSize, gridSize);
}

function drawSnake() {
    snake.forEach(segment => drawRect(segment.x, segment.y, '#00FF00')); // Bright green for snake
}

function drawFood() {
    drawRect(food.x, food.y, '#FFD700'); // Gold for food
}

function updateScoreDisplay() { // From HEAD
    scoreDisplay.textContent = `Score: ${score}`;
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Collision with Canvas borders
    if (head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height) {
        gameOver = true;
        return;
    }

    // Self-collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
            return;
        }
    }

    snake.unshift(head);

    const didEatFood = head.x === food.x && head.y === food.y;
    if (didEatFood) {
        score += 10;
        generateFood();
        updateScoreDisplay(); // Update score after eating food
    } else {
        snake.pop();
    }
}

// --- Event Listeners for Keyboard ---
document.addEventListener('keydown', e => {
    if (gameOver) return;
    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = e.keyCode;
    const goingUp = dy === -gridSize;
    const goingDown = dy === gridSize;
    const goingLeft = dx === -gridSize;
    const goingRight = dx === gridSize;

    if (keyPressed === 38 && !goingDown) {
        dx = 0;
        dy = -gridSize;
    }
    if (keyPressed === 40 && !goingUp) {
        dx = 0;
        dy = gridSize;
    }
    if (keyPressed === 37 && !goingRight) {
        dx = -gridSize;
        dy = 0;
    }
    if (keyPressed === 39 && !goingLeft) {
        dx = gridSize;
        dy = 0;
    }
});

// --- Game Control Functions ---
function startGame() {
    gameOver = false;
    score = 0;
    snake = [{ x: 10 * gridSize, y: 10 * gridSize }];
    dx = gridSize;
    dy = 0;
    changingDirection = false;

    startButton.style.display = 'none';
    restartButton.style.display = 'none';
    
    updateScoreDisplay(); // Reset score display
    generateFood();
    gameTick(); // Start the game loop
}

function gameTick() {
    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
        restartButton.style.display = 'block'; // Show restart button
        return;
    }

    changingDirection = false;

    gameInterval = setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawFood();
        moveSnake();
        drawSnake();
        updateScoreDisplay(); // Update score display in each frame (Porthos's feature)

        if (!gameOver) {
            gameTick();
        }
    }, 100);
}

// --- Initial Setup & Event Listeners ---
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

// Clear canvas and draw a start message initially
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = 'black';
ctx.font = '20px Arial';
ctx.textAlign = 'center';
ctx.fillText('Press "Start Game" to begin', canvas.width / 2, canvas.height / 2);
startButton.style.display = 'block'; // Ensure start button is visible initially
updateScoreDisplay(); // Display initial score (0)