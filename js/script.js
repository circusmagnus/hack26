// Get the canvas element
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Define canvas dimensions
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;

// Set canvas dimensions
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// Set canvas background color
const CANVAS_BACKGROUND_COLOR = '#ADD8E6'; // Light blue
ctx.fillStyle = CANVAS_BACKGROUND_COLOR;
ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

console.log('Canvas initialized and background set.');