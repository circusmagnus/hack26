// game.js

const boardElement = document.getElementById('game-board');
const board = [];
const boardSize = 8;

let selectedPiece = null;

function initializeGame() {
    createBoard();
    placeInitialPieces();
    renderBoard();
}

function createBoard() {
    for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
            board[i][j] = null; // null for empty square
        }
    }
}

function placeInitialPieces() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < boardSize; j++) {
            if ((i + j) % 2 !== 0) {
                board[i][j] = { player: 'red', isKing: false };
            }
        }
    }
    for (let i = boardSize - 3; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if ((i + j) % 2 !== 0) {
                board[i][j] = { player: 'black', isKing: false };
            }
        }
    }
}

function renderBoard() {
    boardElement.innerHTML = ''; // Clear existing board
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((i + j) % 2 === 0 ? 'light' : 'dark');
            square.dataset.row = i;
            square.dataset.col = j;

            const piece = board[i][j];
            if (piece) {
                const pieceElement = document.createElement('div');
                pieceElement.classList.add('piece', piece.player);
                if (piece.isKing) {
                    pieceElement.textContent = 'K';
                }
                square.appendChild(pieceElement);
            }
            square.addEventListener('click', handleSquareClick);
            boardElement.appendChild(square);
        }
    }
}

function handleSquareClick(event) {
    const row = parseInt(event.currentTarget.dataset.row);
    const col = parseInt(event.currentTarget.dataset.col);

    if (selectedPiece) {
        // A piece is already selected, attempt to move it
        const fromRow = selectedPiece.row;
        const fromCol = selectedPiece.col;

        if (isValidMove(fromRow, fromCol, row, col)) {
            movePiece(fromRow, fromCol, row, col);
            selectedPiece = null;
            renderBoard();
        } else {
            alert('Invalid move!');
            selectedPiece = null;
            renderBoard(); // Re-render to clear selection
        }
    } else {
        // No piece selected, try to select one
        const piece = board[row][col];
        if (piece && piece.player === 'red') { // Assuming human is 'red'
            selectedPiece = { row, col, piece };
            event.currentTarget.classList.add('selected'); // Highlight selected piece
        } else if (piece && piece.player !== 'red') {
            alert('That's not your piece!');
        }
    }
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    if (!piece) return false;

    const rowDiff = toRow - fromRow;
    const colDiff = Math.abs(toCol - fromCol);

    // Basic diagonal move forward for non-king pieces
    if (!piece.isKing && piece.player === 'red' && rowDiff > 0 && colDiff === 1 && !board[toRow][toCol]) {
        return true;
    }

    // Basic capture for non-king pieces
    if (!piece.isKing && piece.player === 'red' && rowDiff === 2 && colDiff === 2) {
        const jumpedRow = fromRow + 1;
        const jumpedCol = fromCol + (toCol > fromCol ? 1 : -1);
        const jumpedPiece = board[jumpedRow][jumpedCol];

        if (jumpedPiece && jumpedPiece.player === 'black' && !board[toRow][toCol]) {
            return true;
        }
    }

    // TODO: Implement king moves, backward moves, and multiple jumps.

    return false;
}

function movePiece(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = null;

    // Handle capture
    const rowDiff = toRow - fromRow;
    const colDiff = Math.abs(toCol - fromCol);
    if (rowDiff === 2 && colDiff === 2) {
        const jumpedRow = fromRow + 1;
        const jumpedCol = fromCol + (toCol > fromCol ? 1 : -1);
        board[jumpedRow][jumpedCol] = null; // Remove jumped piece
    }

    // TODO: Handle king promotion.
}
