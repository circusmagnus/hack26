export const board = [];
export const CELL_SIZE = 60;
export const BOARD_SIZE = 8;

export let selectedPiece = null; // { row, col, player, isKing }

export function setSelectedPiece(row, col) {
    if (row === null && col === null) {
        selectedPiece = null;
    } else {
        selectedPiece = { row, col, ...board[row][col] };
    }
}

export function getPiece(row, col) {
    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
        return null;
    }
    return board[row][col];
}

// Initialize the board with empty cells
for (let row = 0; row < BOARD_SIZE; row++) {
    board.push(Array(BOARD_SIZE).fill(null));
}

// Place red pieces for the player
// Rows 1, 2, 3 for player (0-indexed: 0, 1, 2)
for (let row = 0; row < 3; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
        // Place pieces only on dark squares
        if ((row + col) % 2 !== 0) {
            board[row][col] = { player: 'red', isKing: false };
        }
    }
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

export function isValidMove(startRow, startCol, endRow, endCol) {
    const piece = board[startRow][startCol];
    if (!piece || piece.player !== 'red') return false; // Only red pieces can move

    // Must move to an empty square
    if (board[endRow][endCol] !== null) return false;

    // Must move to a dark square
    if ((endRow + endCol) % 2 === 0) return false;

    const rowDiff = endRow - startRow;
    const colDiff = Math.abs(endCol - startCol);

    // Basic diagonal forward move (no jumps, no captures)
    // Red pieces move forward (row index increases for player)
    if (rowDiff === 1 && colDiff === 1) {
        return true;
    }

    return false;
}

export function handlePieceClick(row, col) {
    const clickedPiece = getPiece(row, col);

    // If no piece is selected, and we click on a red piece, select it.
    if (selectedPiece === null && clickedPiece && clickedPiece.player === 'red') {
        setSelectedPiece(row, col);
        return true; // Piece selected
    }

    // If a piece is selected
    if (selectedPiece !== null) {
        // If we click on the already selected piece, deselect it.
        if (selectedPiece.row === row && selectedPiece.col === col) {
            setSelectedPiece(null, null);
            return false; // Piece deselected
        }
        // If we click on another red piece, select the new one.
        if (clickedPiece && clickedPiece.player === 'red') {
             setSelectedPiece(row, col);
             return true;
        }
        // If we click on an empty square, try to move.
        if (clickedPiece === null) {
            if (isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
                // Move the piece
                board[row][col] = board[selectedPiece.row][selectedPiece.col];
                board[selectedPiece.row][selectedPiece.col] = null; // Clear old position
                setSelectedPiece(null, null); // Deselect after move
                return true; // Piece moved
            }
        }
    }
    setSelectedPiece(null, null); // Deselect if no valid action
    return false;
}
