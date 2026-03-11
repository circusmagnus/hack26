const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

// Paddle properties
const paddleWidth = 10;
const paddleHeight = 100;

const playerPaddle = {
    x: 0,
    y: (canvas.height - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'WHITE',
    score: 0,
    dy: 0 // delta y for movement
};

const aiPaddle = {
    x: canvas.width - paddleWidth,
    y: (canvas.height - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'WHITE',
    score: 0
};

// Ball properties
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 7,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: 'WHITE'
};

// Game speed for paddle movement
const gameSpeed = 6;

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

function drawText(text, x, y, color = 'WHITE', font = '40px Arial') {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(text, x, y);
}

function drawBackground() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 5; // Reset ball speed
    ball.velocityX = -ball.velocityX; // Serve to the other side
    ball.velocityY = 5; // Reset vertical direction
}

function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function update() {
    // Player paddle movement
    playerPaddle.y += playerPaddle.dy;

    // Prevent player paddle from going off-screen
    if (playerPaddle.y < 0) {
        playerPaddle.y = 0;
    }
    if (playerPaddle.y + playerPaddle.height > canvas.height) {
        playerPaddle.y = canvas.height - playerPaddle.height;
    }

    // Ball movement
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Ball collision with top and bottom walls
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
    }

    // Check for scoring
    if (ball.x - ball.radius < 0) {
        aiPaddle.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        playerPaddle.score++;
        resetBall();
    }

    // Determine which paddle the ball is moving towards
    let user = (ball.x < canvas.width / 2) ? playerPaddle : aiPaddle;

    if (collision(ball, user)) {
        // Calculate collision point relative to the paddle
        let collidePoint = ball.y - (user.y + user.height / 2);
        // Normalize the collidePoint
        collidePoint = collidePoint / (user.height / 2);

        // Calculate angle in radians
        let angleRad = (Math.PI / 4) * collidePoint;

        // Change X and Y velocity direction
        ball.velocityX = (user === playerPaddle ? 1 : -1) * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // Increase ball speed after collision, up to a limit
        if (ball.speed < 10) { // Cap max speed
            ball.speed += 0.5; // Small speed increase
        }
    }
}

function draw() {
    // Clear the canvas and draw background
    drawBackground();

    // Draw paddles
    drawRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height, playerPaddle.color);
    drawRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height, aiPaddle.color);

    // Draw ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);

    // Draw scores
    drawText(playerPaddle.score, canvas.width / 4, 50);
    drawText(aiPaddle.score, 3 * canvas.width / 4, 50);
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Event listeners for player paddle movement
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp') {
        playerPaddle.dy = -gameSpeed;
    } else if (e.key === 'ArrowDown') {
        playerPaddle.dy = gameSpeed;
    }
});

document.addEventListener('keyup', e => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        playerPaddle.dy = 0;
    }
});

// Start the game loop
gameLoop();
