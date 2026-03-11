const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;
const playerSpeed = 7;
const ballSpeed = 5; // Initial ball speed

let playerScore = 0;
let aiScore = 0;

let playerPaddle = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'white',
    dy: 0 // change in y position
};

let aiPaddle = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'white'
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: ballSize,
    color: 'white',
    dx: ballSpeed, // Ball x velocity
    dy: ballSpeed  // Ball y velocity
};

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color, fontSize = 40) {
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillText(text, x, y);
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx *= -1; // Serve in opposite direction
    ball.dy = Math.random() * ballSpeed * 2 - ballSpeed; // Randomize y direction
}

function update() {
    // Update player paddle position
    playerPaddle.y += playerPaddle.dy;

    // Keep player paddle within bounds
    if (playerPaddle.y < 0) {
        playerPaddle.y = 0;
    } else if (playerPaddle.y + playerPaddle.height > canvas.height) {
        playerPaddle.y = canvas.height - playerPaddle.height;
    }

    // Update ball position
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y - ball.size / 2 < 0 || ball.y + ball.size / 2 > canvas.height) {
        ball.dy *= -1; // Reverse y direction
    }

    // Ball scoring
    if (ball.x - ball.size / 2 < 0) {
        aiScore++;
        resetBall();
    } else if (ball.x + ball.size / 2 > canvas.width) {
        playerScore++;
        resetBall();
    }

    // Ball collision with player paddle
    if (ball.x - ball.size / 2 < playerPaddle.x + playerPaddle.width &&
        ball.x + ball.size / 2 > playerPaddle.x &&
        ball.y - ball.size / 2 < playerPaddle.y + playerPaddle.height &&
        ball.y + ball.size / 2 > playerPaddle.y) {
        ball.dx *= -1; // Reverse x direction
    }

    // Ball collision with AI paddle
    if (ball.x + ball.size / 2 > aiPaddle.x &&
        ball.x - ball.size / 2 < aiPaddle.x + aiPaddle.width &&
        ball.y - ball.size / 2 < aiPaddle.y + aiPaddle.height &&
        ball.y + ball.size / 2 > aiPaddle.y) {
        ball.dx *= -1; // Reverse x direction
    }
}

function draw() {
    // Draw background
    drawRect(0, 0, canvas.width, canvas.height, 'black');

    // Draw paddles
    drawRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height, playerPaddle.color);
    drawRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height, aiPaddle.color);

    // Draw ball
    drawCircle(ball.x, ball.y, ball.size / 2, ball.color);

    // Draw scores
    drawText(playerScore, canvas.width / 4, canvas.height / 5, 'white');
    drawText(aiScore, 3 * canvas.width / 4, canvas.height / 5, 'white');
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Event listeners for player paddle movement
document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
            playerPaddle.dy = -playerSpeed;
            break;
        case 'ArrowDown':
        case 's':
            playerPaddle.dy = playerSpeed;
            break;
    }
});

document.addEventListener('keyup', e => {
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'ArrowDown':
        case 's':
            playerPaddle.dy = 0;
            break;
    }
});

// Start the game loop
gameLoop();