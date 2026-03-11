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

let player = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'white',
    score: 0
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

function draw() {
    // Clear canvas (draw background)
    drawRect(0, 0, canvas.width, canvas.height, 'black');

    // Draw player paddle
    drawRect(player.x, player.y, player.width, player.height, player.color);

    // Draw AI paddle
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);

    // Draw ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// Game Loop (for now, just drawing)
function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
