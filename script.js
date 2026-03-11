const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

// Paddle properties
const paddleWidth = 10;
const paddleHeight = 100;
const playerPaddleX = 0;
const aiPaddleX = canvas.width - paddleWidth;
let playerPaddleY = (canvas.height - paddleHeight) / 2;
let aiPaddleY = (canvas.height - paddleHeight) / 2;
const paddleSpeed = 7;

// Ball properties
const ballSize = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;

// Player movement
let upPressed = false;
let downPressed = false;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
    if (e.key === 'Up' || e.key === 'ArrowUp') {
        upPressed = true;
    } else if (e.key === 'Down' || e.key === 'ArrowDown') {
        downPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === 'Up' || e.key === 'ArrowUp') {
        upPressed = false;
    } else if (e.key === 'Down' || e.key === 'ArrowDown') {
        downPressed = false;
    }
}

function movePlayerPaddle() {
    if (upPressed && playerPaddleY > 0) {
        playerPaddleY -= paddleSpeed;
    } else if (downPressed && playerPaddleY < canvas.height - paddleHeight) {
        playerPaddleY += paddleSpeed;
    }
}

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.fill();
}

function draw() {
    // Draw background
    drawRect(0, 0, canvas.width, canvas.height, '#000');

    // Draw paddles
    drawRect(playerPaddleX, playerPaddleY, paddleWidth, paddleHeight, '#FFF');
    drawRect(aiPaddleX, aiPaddleY, paddleWidth, paddleHeight, '#FFF');

    // Draw ball
    drawCircle(ballX, ballY, ballSize / 2, '#FFF');
}

function gameLoop() {
    movePlayerPaddle();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();