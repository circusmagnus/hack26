// script.js
console.log("Game script loaded!");

const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Game entities
const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 10;
const paddleSpeed = 8; // Speed of the paddles
const WINNING_SCORE = 5; // Define winning score

let player = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'white',
    score: 0,
    dy: 0 // Player paddle movement direction
};

let ai = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'white',
    score: 0
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    color: 'white',
    speed: 5,
    dx: 5, // direction x
    dy: 5  // direction y
};

let gameOver = false;

// Draw functions
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

function drawText(text, x, y, color, fontSize = "30px", font = "Press Start 2P") {
    ctx.fillStyle = color;
    ctx.font = `${fontSize} ${font}`;
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
}

function draw() {
    // Clear canvas (draw background)
    drawRect(0, 0, canvas.width, canvas.height, 'black');

    // Draw player paddle
    drawRect(player.x, player.y, player.width, player.height, player.color);

    // Draw AI paddle
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);

    // Draw ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);

    // Draw scores
    drawText(player.score, canvas.width / 4, canvas.height / 5, 'white');
    drawText(ai.score, 3 * canvas.width / 4, canvas.height / 5, 'white');

    // Draw center line
    for (let i = 0; i < canvas.height; i += 20) {
        drawRect(canvas.width / 2 - 1, i, 2, 10, 'white');
    }

    if (gameOver) {
        let winner = player.score === WINNING_SCORE ? "Player" : "AI";
        drawText("Game Over!", canvas.width / 2, canvas.height / 2 - 30, 'white', "50px");
        drawText(`${winner} Wins!`, canvas.width / 2, canvas.height / 2 + 20, 'white', "40px");
        drawText("Press SPACE to Restart", canvas.width / 2, canvas.height / 2 + 70, 'white', "20px");
    }
}

// Reset ball position and direction
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx; // Serve to the other side
    ball.speed = 5;
    player.y = canvas.height / 2 - paddleHeight / 2;
    ai.y = canvas.height / 2 - paddleHeight / 2;
}

// Update game logic
function update() {
    if (gameOver) return;

    // Move player paddle
    player.y += player.dy;

    // Player paddle boundary check
    if (player.y < 0) {
        player.y = 0;
    } else if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }

    // AI paddle movement (simple AI)
    // AI tries to follow the ball
    const aiCenter = ai.y + ai.height / 2;
    if (aiCenter < ball.y - 35) { // Add some offset to make it less perfect
        ai.y += paddleSpeed * 0.7; // AI moves a bit slower
    } else if (aiCenter > ball.y + 35) {
        ai.y -= paddleSpeed * 0.7;
    }

    // AI paddle boundary check
    if (ai.y < 0) {
        ai.y = 0;
    } else if (ai.y + ai.height > canvas.height) {
        ai.y = canvas.height - ai.height;
    }

    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top/bottom walls
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
    }

    // Ball collision with paddles
    // Player paddle collision
    if (ball.x - ball.radius < player.x + player.width &&
        ball.x + ball.radius > player.x &&
        ball.y - ball.radius < player.y + player.height &&
        ball.y + ball.radius > player.y) {
        
        // If ball is moving towards the player
        if (ball.dx < 0) {
            let collidePoint = ball.y - (player.y + player.height / 2);
            collidePoint = collidePoint / (player.height / 2); // Normalize
            const angleRad = collidePoint * Math.PI / 4; // Max angle 45 degrees
            ball.dx = -ball.dx;
            ball.dy = ball.speed * Math.sin(angleRad);
            ball.dx = ball.speed * Math.cos(angleRad);
            ball.speed += 0.5; // Increase ball speed after hit
        }
    }

    // AI paddle collision
    if (ball.x + ball.radius > ai.x &&
        ball.x - ball.radius < ai.x + ai.width &&
        ball.y - ball.radius < ai.y + ai.height &&
        ball.y + ball.radius > ai.y) {
        
        // If ball is moving towards the AI
        if (ball.dx > 0) {
            let collidePoint = ball.y - (ai.y + ai.height / 2);
            collidePoint = collidePoint / (ai.height / 2); // Normalize
            const angleRad = collidePoint * Math.PI / 4; // Max angle 45 degrees
            ball.dx = -ball.dx;
            ball.dy = ball.speed * Math.sin(angleRad);
            ball.dx = -ball.speed * Math.cos(angleRad); // Go left
            ball.speed += 0.5; // Increase ball speed after hit
        }
    }

    // Score update
    if (ball.x - ball.radius < 0) { // AI scores
        ai.score++;
        checkGameOver();
        if (!gameOver) resetBall();
    } else if (ball.x + ball.radius > canvas.width) { // Player scores
        player.score++;
        checkGameOver();
        if (!gameOver) resetBall();
    }
}

// Game Over check
function checkGameOver() {
    if (player.score === WINNING_SCORE || ai.score === WINNING_SCORE) {
        gameOver = true;
    }
}

// Game Loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Keyboard input for player paddle
document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'w':
        case 'ArrowUp':
            player.dy = -paddleSpeed;
            break;
        case 's':
        case 'ArrowDown':
            player.dy = paddleSpeed;
            break;
        case ' ': // Spacebar to restart
            if (gameOver) {
                resetGame();
            }
            break;
    }
});

document.addEventListener('keyup', e => {
    switch (e.key) {
        case 'w':
        case 'ArrowUp':
        case 's':
        case 'ArrowDown':
            player.dy = 0;
            break;
    }
});

function resetGame() {
    player.score = 0;
    ai.score = 0;
    gameOver = false;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 5; // Initial serve direction
    ball.dy = 5;
    ball.speed = 5;
    player.y = canvas.height / 2 - paddleHeight / 2;
    ai.y = canvas.height / 2 - paddleHeight / 2;
    gameLoop(); // Restart the game loop
}

// Start the game loop
gameLoop();
