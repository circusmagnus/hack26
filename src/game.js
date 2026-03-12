
export const BOARD_SIZE = 8;
export const CELL_SIZE = 60;

export const gameBoard = []; // Represents the state of the board

export let selectedPiece = null; // Stores { row, col } of the selected piece

export function initializeBoard() {
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

export function isValidMove(startRow, startCol, endRow, endCol) {
    const piece = gameBoard[startRow][startCol];
    if (piece !== 1) return false; // Only red pieces (player 1) can move

    // Must move to an empty square
    if (gameBoard[endRow][endCol] !== 0) return false;

    // Must move to a dark square (for checkers, dark squares have (row+col) % 2 !== 0)
    if ((endRow + endCol) % 2 === 0) return false;

    const rowDiff = endRow - startRow;
    const colDiff = Math.abs(endCol - startCol);

    // Basic diagonal forward move (no jumps, no captures)
    // Red pieces move forward (row index increases for player 1)
    if (rowDiff === 1 && colDiff === 1) {
        return true;
    }

    return false;
}

export function handlePieceClick(row, col) {
    // If no piece is selected, and we click on a red piece, select it.
    if (selectedPiece === null && gameBoard[row][col] === 1) {
        selectedPiece = { row, col };
        return true; // Piece selected
    }

    // If a piece is selected
    if (selectedPiece !== null) {
        // If we click on the already selected piece, deselect it.
        if (selectedPiece.row === row && selectedPiece.col === col) {
            selectedPiece = null;
            return false; // Piece deselected
        }
        // If we click on another red piece, select the new one.
        if (gameBoard[row][col] === 1) {
             selectedPiece = { row, col };
             return true;
        }
        // If we click on an empty square, try to move.
        if (gameBoard[row][col] === 0) {
            if (isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
                // Move the piece
                gameBoard[row][col] = gameBoard[selectedPiece.row][selectedPiece.col];
                gameBoard[selectedPiece.row][selectedPiece.col] = 0; // Clear old position
                selectedPiece = null; // Deselect after move
                return true; // Piece moved
            }
        }
    }
    selectedPiece = null;
    return false;
}
