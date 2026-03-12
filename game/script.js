const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let gameOver = false;

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? 'green' : 'lime';
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    }
}

function update() {
    if (gameOver) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }

    // Collision Detection (SCRUM-360)
    // Check collision with canvas boundaries
    if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
        gameOver = true;
    }

    // Check collision with self
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
        }
    }

    draw();
}

function handleKeyPress(event) {
    if (gameOver) return;

    switch (event.key) {
        case 'ArrowUp':
            if (dy === 1) break;
            dx = 0;
            dy = -1;
            break;
        case 'ArrowDown':
            if (dy === -1) break;
            dx = 0;
            dy = 1;
            break;
        case 'ArrowLeft':
            if (dx === 1) break;
            dx = -1;
            dy = 0;
            break;
        case 'ArrowRight':
            if (dx === -1) break;
            dx = 1;
            dy = 0;
            break;
    }
}

generateFood();
document.addEventListener('keydown', handleKeyPress);
setInterval(update, 100);
