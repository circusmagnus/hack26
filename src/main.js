
import './style.css';
import { drawPiece, drawBoard } from './rendering.js'; // Removed clearCanvas as it's not used here directly
import { gameBoard, initializeBoard, BOARD_SIZE, CELL_SIZE } from './game.js';

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Red vs Green Checkers</h1>
    <canvas id="gameCanvas"></canvas>
  </div>
`;

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  // Set canvas dimensions based on game constants
  canvas.width = BOARD_SIZE * CELL_SIZE;
  canvas.height = BOARD_SIZE * CELL_SIZE;

  function drawAllPieces() {
      for (let row = 0; row < BOARD_SIZE; row++) {
          for (let col = 0; col < BOARD_SIZE; col++) {
              const piece = gameBoard[row][col];
              const centerX = col * CELL_SIZE + CELL_SIZE / 2;
              const centerY = row * CELL_SIZE + CELL_SIZE / 2;
              if (piece === 1) { // Red piece
                  drawPiece(ctx, centerX, centerY, 'red');
              } else if (piece === 2) { // Green piece
                  drawPiece(ctx, centerX, centerY, 'green');
              }
          }
      }
  }

  initializeBoard();
  drawBoard(ctx);
  drawAllPieces();
});
