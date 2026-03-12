// Get the canvas element and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Define game board dimensions
const TILE_SIZE = 20; // Size of each cell in pixels
const GRID_SIZE = canvas.width / TILE_SIZE; // Number of cells in width/height

// Function to draw the game board grid
function drawGrid() {
    ctx.strokeStyle = '#AAAAAA'; // Color of the grid lines
    for (let i = 0; i < GRID_SIZE; i++) {
        // Draw horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, i * TILE_SIZE);
        ctx.lineTo(canvas.width, i * TILE_SIZE);
        ctx.stroke();

        // Draw vertical lines
        ctx.beginPath();
        ctx.moveTo(i * TILE_SIZE, 0);
        ctx.lineTo(i * TILE_SIZE, canvas.height);
        ctx.stroke();
    }
}

// Initialize the game board by drawing the grid
drawGrid();
