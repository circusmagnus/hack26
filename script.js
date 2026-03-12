const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');

const gridSize = 20;
let snake = [
    {x: 10 * gridSize, y: 10 * gridSize},
    {x: 9 * gridSize, y: 10 * gridSize},
    {x: 8 * gridSize, y: 10 * gridSize}
];
let direction = 'right';
let changingDirection = false;

function drawSnakePart(snakePart) {
    ctx.fillStyle = 'lightgreen';
    ctx.strokeStyle = 'darkgreen';
    ctx.fillRect(snakePart.x, snakePart.y, gridSize, gridSize);
    ctx.strokeRect(snakePart.x, snakePart.y, gridSize, gridSize);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function advanceSnake() {
    const head = {x: snake[0].x + (direction === 'right' ? gridSize : direction === 'left' ? -gridSize : 0),
                  y: snake[0].y + (direction === 'down' ? gridSize : direction === 'up' ? -gridSize : 0)};
    snake.unshift(head); // Add new head

    // For now, just remove tail. Collision and food logic will modify this later.
    snake.pop();
}

function changeDirection(event) {
    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const goingUp = direction === 'up';
    const goingDown = direction === 'down';
    const goingLeft = direction === 'left';
    const goingRight = direction === 'right';

    if (keyPressed === LEFT_KEY && !goingRight) {
        direction = 'left';
    }
    if (keyPressed === UP_KEY && !goingDown) {
        direction = 'up';
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        direction = 'right';
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        direction = 'down';
    }
}

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function main() {
    if (false) return; // Placeholder for game over condition

    changingDirection = false;
    setTimeout(function onTick() {
        clearCanvas();
        advanceSnake();
        drawSnake();

        main();
    }, 100); // Game speed
}

document.addEventListener('keydown', changeDirection);

// Start the game
main();
