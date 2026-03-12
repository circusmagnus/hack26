import './style.css'
import { drawBoard, drawPieces } from './rendering.js';
import { CELL_SIZE, BOARD_SIZE } from './game.js'; // Import from game.js for canvas sizing

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  // Set canvas size dynamically based on board and cell size
  canvas.width = CELL_SIZE * BOARD_SIZE;
  canvas.height = CELL_SIZE * BOARD_SIZE;

  function animate() {
    drawBoard(ctx);
    drawPieces(ctx); // This part comes from remote, likely for SCRUM-510/511
    requestAnimationFrame(animate);
  }

  animate(); // Start the animation loop
});
