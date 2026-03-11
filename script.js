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

// Ball properties
const ballSize = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;

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

draw(); // Initial draw to set up the game elements