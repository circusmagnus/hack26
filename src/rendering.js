import { BOARD_SIZE, CELL_SIZE, board } from './game.js';

export function drawBoard(ctx) {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            ctx.fillStyle = (row + col) % 2 === 0 ? '#FAF0E6' : '#8B4513'; // Light and dark squares
            ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    }
}

export function drawPieces(ctx) {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const piece = board[row][col];
            if (piece) {
                const x = col * CELL_SIZE + CELL_SIZE / 2;
                const y = row * CELL_SIZE + CELL_SIZE / 2;
                const radius = CELL_SIZE / 3;

                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = piece.player === 'red' ? 'red' : 'green';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
