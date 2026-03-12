
export const BOARD_SIZE = 8;
export const CELL_SIZE = 60; // Assuming a cell size for now, will be dynamic based on canvas

export const gameBoard = []; // Represents the state of the board

export function initializeBoard() {
    // Initialize the 8x8 game board with empty, red, and green pieces
    // 0: empty, 1: red piece, 2: green piece
    for (let i = 0; i < BOARD_SIZE; i++) {
        gameBoard[i] = [];
        for (let j = 0; j < BOARD_SIZE; j++) {
            gameBoard[i][j] = 0; // All squares empty initially
        }
    }

    // Place red pieces (rows 0, 1, 2)
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if ((row + col) % 2 !== 0) {
                gameBoard[row][col] = 1; // Red piece
            }
        }
    }

    // Place green pieces (rows 5, 6, 7)
    for (let row = 5; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if ((row + col) % 2 !== 0) {
                gameBoard[row][col] = 2; // Green piece
            }
        }
    }
}
