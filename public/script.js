
// Game logic will go here

const BOARD_SIZE = 8;
const EMPTY = 0;
const RED_PIECE = 1;
const GREEN_PIECE = 2;
const RED_KING = 3;
const GREEN_KING = 4;

const PLAYER_RED = 'RED';
const PLAYER_GREEN = 'GREEN';

let board = [];
let currentPlayer = PLAYER_RED; // Red player starts

function initializeBoard() {
    board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY));

    // Initialize red pieces (top of the board)
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if ((row + col) % 2 !== 0) { // Dark squares
                board[row][col] = RED_PIECE;
            }
        }
    }

    // Initialize green pieces (bottom of the board)
    for (let row = BOARD_SIZE - 3; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if ((row + col) % 2 !== 0) { // Dark squares
                board[row][col] = GREEN_PIECE;
            }
        }
    }
    currentPlayer = PLAYER_RED; // Ensure red starts every time board is initialized
}

function renderBoard() {
    const gameBoardElement = document.getElementById('game-board');
    gameBoardElement.innerHTML = ''; // Clear existing board

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((row + col) % 2 === 0 ? 'white' : 'black');
            square.dataset.row = row;
            square.dataset.col = col;

            const pieceType = board[row][col];
            if (pieceType !== EMPTY) {
                const piece = document.createElement('div');
                piece.classList.add('piece');
                if (pieceType === RED_PIECE || pieceType === RED_KING) {
                    piece.classList.add('red');
                } else if (pieceType === GREEN_PIECE || pieceType === GREEN_KING) {
                    piece.classList.add('green');
                }
                if (pieceType === RED_KING || pieceType === GREEN_KING) {
                    piece.classList.add('king');
                }
                square.appendChild(piece);
            }
            gameBoardElement.appendChild(square);
        }
    }
}

// Helper functions
function isRed(piece) {
    return piece === RED_PIECE || piece === RED_KING;
}

function isGreen(piece) {
    return piece === GREEN_PIECE || piece === GREEN_KING;
}

function isKing(piece) {
    return piece === RED_KING || piece === GREEN_KING;
}

function getPlayerPieces(player) {
    const pieces = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const piece = board[row][col];
            if (player === PLAYER_RED && isRed(piece)) {
                pieces.push({row, col, piece});
            } else if (player === PLAYER_GREEN && isGreen(piece)) {
                pieces.push({row, col, piece});
            }
        }
    }
    return pieces;
}

function getPossibleMoves(row, col) {
    const moves = [];
    const piece = board[row][col];
    if (piece === EMPTY) return moves;

    const directions = [];
    // Standard moves
    if (isRed(piece) && !isKing(piece)) {
        directions.push({dr: 1, dc: -1}); // Down-left
        directions.push({dr: 1, dc: 1});  // Down-right
    }
    if (isGreen(piece) && !isKing(piece)) {
        directions.push({dr: -1, dc: -1}); // Up-left
        directions.push({dr: -1, dc: 1});  // Up-right
    }
    // King moves
    if (isKing(piece)) {
        directions.push({dr: 1, dc: -1});
        directions.push({dr: 1, dc: 1});
        directions.push({dr: -1, dc: -1});
        directions.push({dr: -1, dc: 1});
    }

    for (const {dr, dc} of directions) {
        const newRow = row + dr;
        const newCol = col + dc;

        // Check for single step move
        if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE && board[newRow][newCol] === EMPTY) {
            moves.push({start: {row, col}, end: {row: newRow, col: newCol}, isJump: false});
        }

        // Check for jump move (2 steps in the same direction)
        const jumpedRow = row + dr;
        const jumpedCol = col + dc;
        const landingRow = row + 2 * dr;
        const landingCol = col + 2 * dc;

        if (landingRow >= 0 && landingRow < BOARD_SIZE && landingCol >= 0 && landingCol < BOARD_SIZE && board[landingRow][landingCol] === EMPTY) {
            const jumpedPiece = board[jumpedRow][jumpedCol];
            const isOpponentPiece = (isRed(piece) && isGreen(jumpedPiece)) || (isGreen(piece) && isRed(jumpedPiece));
            
            if (jumpedPiece !== EMPTY && isOpponentPiece) {
                moves.push({start: {row, col}, end: {row: landingRow, col: landingCol}, jumped: {row: jumpedRow, col: jumpedCol}, isJump: true});
            }
        }
    }

    return moves;
}

function getAllLegalMovesForPlayer(player) {
    let allMoves = [];
    const playerPieces = getPlayerPieces(player);
    for (const {row, col} of playerPieces) {
        allMoves = allMoves.concat(getPossibleMoves(row, col));
    }

    const mandatoryJumps = allMoves.filter(move => move.isJump);

    if (mandatoryJumps.length > 0) {
        return mandatoryJumps; // If jumps are available, they are mandatory
    } else {
        return allMoves; // Otherwise, all non-jump moves are legal
    }
}

function makeMove(startRow, startCol, endRow, endCol, jumpedPiecePos = null) {
    const piece = board[startRow][startCol];
    board[endRow][endCol] = piece;
    board[startRow][startCol] = EMPTY;

    // Handle kinging
    if (isRed(piece) && endRow === BOARD_SIZE - 1) {
        board[endRow][endCol] = RED_KING;
    } else if (isGreen(piece) && endRow === 0) {
        board[endRow][endCol] = GREEN_KING;
    }

    // Handle capturing
    if (jumpedPiecePos) {
        board[jumpedPiecePos.row][jumpedPiecePos.col] = EMPTY;
    }

    renderBoard(); // Re-render the board after the move
    switchTurn();
}

function switchTurn() {
    currentPlayer = (currentPlayer === PLAYER_RED) ? PLAYER_GREEN : PLAYER_RED;
    console.log('Current player:', currentPlayer);
    if (currentPlayer === PLAYER_GREEN) {
        setTimeout(makeComputerMove, 1000); // AI makes a move after a delay
    }
}

function makeComputerMove() {
    console.log('Computer making move...');
    const legalMoves = getAllLegalMovesForPlayer(PLAYER_GREEN);

    if (legalMoves.length > 0) {
        const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
        makeMove(randomMove.start.row, randomMove.start.col, randomMove.end.row, randomMove.end.col, randomMove.jumped);
    } else {
        console.log('Computer has no moves! Game over or stalemate.');
        // TODO: Implement win/loss condition checking
    }
}


// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    initializeBoard();
    renderBoard();
});
