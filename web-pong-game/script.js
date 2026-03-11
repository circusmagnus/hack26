const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;

let playerPaddle = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'white'
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
    color: 'white'
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

function draw() {
    // Draw background
    drawRect(0, 0, canvas.width, canvas.height, 'black');

    // Draw paddles
    drawRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height, playerPaddle.color);
    drawRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height, aiPaddle.color);

    // Draw ball
    drawCircle(ball.x, ball.y, ball.size / 2, ball.color);
}

draw();