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
let ballSpeedX = 5;
let ballSpeedY = 5;

// Scores
let playerScore = 0;
let aiScore = 0;

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

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX *= -1; // Serve the ball to the other player
}

function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top/bottom walls
    if (ballY + ballSize / 2 > canvas.height || ballY - ballSize / 2 < 0) {
        ballSpeedY *= -1;
    }

    // Ball collision with paddles
    if (ballX - ballSize / 2 < playerPaddleX + paddleWidth && 
        ballY + ballSize / 2 > playerPaddleY && 
        ballY - ballSize / 2 < playerPaddleY + paddleHeight && 
        ballSpeedX < 0 
    ) {
        ballSpeedX *= -1; 
    }

    if (ballX + ballSize / 2 > aiPaddleX && 
        ballY + ballSize / 2 > aiPaddleY && 
        ballY - ballSize / 2 < aiPaddleY + paddleHeight && 
        ballSpeedX > 0 
    ) {
        ballSpeedX *= -1; 
    }

    // Scoring
    if (ballX - ballSize / 2 < 0) {
        aiScore++;
        resetBall();
    } else if (ballX + ballSize / 2 > canvas.width) {
        playerScore++;
        resetBall();
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

function drawText(text, x, y, color = '#FFF', fontSize = 40) {
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillText(text, x, y);
}

function draw() {
    // Draw background
    drawRect(0, 0, canvas.width, canvas.height, '#000');

    // Draw paddles
    drawRect(playerPaddleX, playerPaddleY, paddleWidth, paddleHeight, '#FFF');
    drawRect(aiPaddleX, aiPaddleY, paddleWidth, paddleHeight, '#FFF');

    // Draw ball
    drawCircle(ballX, ballY, ballSize / 2, '#FFF');

    // Draw scores
    drawText(playerScore, canvas.width / 4, 50);
    drawText(aiScore, 3 * canvas.width / 4 - 20, 50);
}

function gameLoop() {
    movePlayerPaddle();
    moveBall();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();