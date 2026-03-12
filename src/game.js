export const board = [];
export const CELL_SIZE = 60;
export const BOARD_SIZE = 8;

// Initialize the board with empty cells
for (let row = 0; row < BOARD_SIZE; row++) {
    board.push(Array(BOARD_SIZE).fill(null));
}

// Place green pieces for the computer player
// Rows 6, 7, 8 for computer (0-indexed: 5, 6, 7)
for (let row = 5; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
        // Place pieces only on dark squares
        if ((row + col) % 2 !== 0) {
            board[row][col] = { player: 'green', isKing: false };
        }
    }
}
