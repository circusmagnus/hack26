// game.js

const boardElement = document.getElementById('game-board');
const gameStatusElement = document.getElementById('game-status');
const humanWinsElement = document.getElementById('human-wins');
const computerWinsElement = document.getElementById('computer-wins');
const newGameButton = document.getElementById('new-game-button');

const board = [];
const boardSize = 8;

let selectedPiece = null;
let humanWins = 0;
let computerWins = 0;
let gameOver = false;
let currentPlayer = 'red'; // 'red' for human, 'black' for computer

function initializeGame() {
    humanWins = parseInt(localStorage.getItem('humanWins')) || 0;
    computerWins = parseInt(localStorage.getItem('computerWins')) || 0;
    updateWinCountersDisplay();
    startNewRound();
}

function startNewRound() {
    createBoard();
    placeInitialPieces();
    renderBoard();
    gameOver = false;
    currentPlayer = 'red';
    gameStatusElement.textContent = "Red's Turn";
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
    if (gameOver) return;

    const row = parseInt(event.currentTarget.dataset.row);
    const col = parseInt(event.currentTarget.dataset.col);

    if (selectedPiece) {
        const fromRow = selectedPiece.row;
        const fromCol = selectedPiece.col;

        if (isValidMove(fromRow, fromCol, row, col)) {
            movePiece(fromRow, fromCol, row, col);
            selectedPiece = null;
            renderBoard();
            switchPlayer();
            checkGameEnd();
        } else {
            alert('Invalid move!');
            selectedPiece = null;
            renderBoard(); // Re-render to clear selection
        }
    } else {
        const piece = board[row][col];
        if (piece && piece.player === currentPlayer) {
            selectedPiece = { row, col, piece };
            event.currentTarget.classList.add('selected'); // Highlight selected piece
        } else if (piece && piece.player !== currentPlayer) {
            alert("That's not your piece or it's not your turn!");
        }
    }
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    if (!piece) return false;
    if (piece.player !== currentPlayer) return false; // Ensure current player's piece

    const rowDiff = toRow - fromRow;
    const colDiff = Math.abs(toCol - fromCol);

    // Check if destination is within board boundaries
    if (toRow < 0 || toRow >= boardSize || toCol < 0 || toCol >= boardSize) return false;

    // Check if destination is already occupied
    if (board[toRow][toCol] !== null) return false;

    // Basic diagonal move forward for non-king pieces
    if (!piece.isKing) {
        if (piece.player === 'red' && rowDiff === 1 && colDiff === 1) {
            return true;
        }
        if (piece.player === 'black' && rowDiff === -1 && colDiff === 1) {
            return true;
        }
    }

    // Basic capture for non-king pieces
    if (!piece.isKing) {
        if (piece.player === 'red' && rowDiff === 2 && colDiff === 2) {
            const jumpedRow = fromRow + 1;
            const jumpedCol = fromCol + (toCol > fromCol ? 1 : -1);
            const jumpedPiece = board[jumpedRow][jumpedCol];
            if (jumpedPiece && jumpedPiece.player === 'black') {
                return true;
            }
        }
        if (piece.player === 'black' && rowDiff === -2 && colDiff === 2) {
            const jumpedRow = fromRow - 1;
            const jumpedCol = fromCol + (toCol > fromCol ? 1 : -1);
            const jumpedPiece = board[jumpedRow][jumpedCol];
            if (jumpedPiece && jumpedPiece.player === 'red') {
                return true;
            }
        }
    }

    // TODO: Implement king moves, backward moves, and multiple jumps (for SCRUM-489)

    return false;
}

function movePiece(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = null;

    // Handle capture
    const rowDiff = toRow - fromRow;
    const colDiff = Math.abs(toCol - fromCol);
    if (colDiff === 2) { // A jump occurred
        const jumpedRow = fromRow + (rowDiff > 0 ? 1 : -1);
        const jumpedCol = fromCol + (toCol > fromCol ? 1 : -1);
        board[jumpedRow][jumpedCol] = null; // Remove jumped piece
    }

    // Check for king promotion
    if (piece.player === 'red' && toRow === boardSize - 1) {
        piece.isKing = true;
    }
    if (piece.player === 'black' && toRow === 0) {
        piece.isKing = true;
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'red' ? 'black' : 'red';
    gameStatusElement.textContent = ` ${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s Turn`;
    // TODO: Implement computer's turn logic here (for SCRUM-490)
}

function checkGameEnd() {
    const redPieces = countPieces('red');
    const blackPieces = countPieces('black');

    if (redPieces === 0) {
        declareWinner('black');
    } else if (blackPieces === 0) {
        declareWinner('red');
    } else if (!hasValidMoves('red')) {
        declareWinner('black');
    } else if (!hasValidMoves('black')) {
        declareWinner('red');
    }
}

function countPieces(player) {
    let count = 0;
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j] && board[i][j].player === player) {
                count++;
            }
        }
    }
    return count;
}

function hasValidMoves(player) {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const piece = board[i][j];
            if (piece && piece.player === player) {
                // Check all possible directions for moves and jumps
                const possibleMoves = getPossibleMoves(i, j);
                if (possibleMoves.length > 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

function getPossibleMoves(row, col) {
    const moves = [];
    const piece = board[row][col];
    const directions = [];

    if (piece.player === 'red' || piece.isKing) {
        directions.push({ r: 1, c: 1 });
        directions.push({ r: 1, c: -1 });
    }
    if (piece.player === 'black' || piece.isKing) {
        directions.push({ r: -1, c: 1 });
        directions.push({ r: -1, c: -1 });
    }

    for (const dir of directions) {
        const newRow = row + dir.r;
        const newCol = col + dir.c;
        const jumpRow = row + dir.r * 2;
        const jumpCol = col + dir.c * 2;

        // Check for simple move
        if (isValidMove(row, col, newRow, newCol)) {
            moves.push({ toRow: newRow, toCol: newCol });
        }

        // Check for jump move
        if (isValidMove(row, col, jumpRow, jumpCol)) {
            moves.push({ toRow: jumpRow, toCol: jumpCol });
        }
    }
    return moves;
}

function declareWinner(winner) {
    gameOver = true;
    gameStatusElement.textContent = `${winner.charAt(0).toUpperCase() + winner.slice(1)} Wins!`;
    if (winner === 'red') {
        humanWins++;
        localStorage.setItem('humanWins', humanWins);
    } else {
        computerWins++;
        localStorage.setItem('computerWins', computerWins);
    }
    updateWinCountersDisplay();
}

function updateWinCountersDisplay() {
    humanWinsElement.textContent = humanWins;
    computerWinsElement.textContent = computerWins;
}

newGameButton.addEventListener('click', startNewRound);
