import './style.css'
import { drawBoard, drawPieces } from './rendering.js'
import { CELL_SIZE, BOARD_SIZE, handlePieceClick } from './game.js' // Import handlePieceClick

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions based on game constants
canvas.width = BOARD_SIZE * CELL_SIZE;
canvas.height = BOARD_SIZE * CELL_SIZE;

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);

    // Call handlePieceClick from game.js to manage selection and movement
    handlePieceClick(row, col);
});

function animate() {
    drawBoard(ctx);
    drawPieces(ctx);
    requestAnimationFrame(animate);
}

animate();
