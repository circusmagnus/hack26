
import './style.css';
import { drawPiece, drawBoard, highlightSelectedPiece } from './rendering.js';
import { gameBoard, initializeBoard, BOARD_SIZE, CELL_SIZE, handlePieceClick, selectedPiece } from './game.js';

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

              // Highlight selected piece
              if (selectedPiece && selectedPiece.row === row && selectedPiece.col === col) {
                highlightSelectedPiece(ctx, row, col);
              }
          }
      }
  }

  function renderGame() {
    drawBoard(ctx);
    drawAllPieces();
  }

  initializeBoard();
  renderGame(); // Initial render

  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);

    if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
        handlePieceClick(row, col);
        renderGame(); // Re-render after a click
    }
  });
});
