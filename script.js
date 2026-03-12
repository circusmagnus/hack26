// JavaScript for Checkers Game

document.addEventListener('DOMContentLoaded', () => {
    console.log('Checkers game loaded!');

    const gameBoard = document.getElementById('game-board');
    const boardSize = 8;
    const squareElements = []; // Store references to square DOM elements

    // Board state: 0 = empty, 1 = red piece, 2 = black piece, 3 = red king, 4 = black king
    let board = [];
    let currentPlayer = 1; // 1 for red (human), 2 for black (computer)

    function initializeBoard() {
        board = Array(boardSize).fill(0).map(() => Array(boardSize).fill(0));

        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if ((i + j) % 2 !== 0) { // Only dark squares
                    if (i < 3) { // Red pieces in first 3 rows
                        board[i][j] = 1;
                    } else if (i >= boardSize - 3) { // Black pieces in last 3 rows
                        board[i][j] = 2;
                    }
                }
            }
        }
    }

    // Function to render the checkerboard and pieces based on the board state
    function renderBoard() {
        gameBoard.innerHTML = ''; // Clear existing board
        squareElements.length = 0; // Clear existing square references

        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.dataset.row = i;
                square.dataset.col = j;

                if ((i + j) % 2 === 0) {
                    square.classList.add('light');
                } else {
                    square.classList.add('dark');
                }

                const pieceType = board[i][j];
                if (pieceType !== 0) {
                    const piece = document.createElement('div');
                    piece.classList.add('piece');
                    if (pieceType === 1) {
                        piece.classList.add('red-piece');
                    } else if (pieceType === 2) {
                        piece.classList.add('black-piece');
                    }
                    // TODO: Add king styling when kings are implemented
                    square.appendChild(piece);
                }
                gameBoard.appendChild(square);
                squareElements.push(square); // Store reference
            }
        }
    }

    // --- AI Logic (for Black/Computer pieces) ---

    // Helper to check if a move is within board boundaries
    function isValidCoord(r, c) {
        return r >= 0 && r < boardSize && c >= 0 && c < boardSize;
    }

    // Function to find all valid moves for the computer (black pieces)
    function findComputerMoves() {
        let possibleMoves = [];
        for (let r = 0; r < boardSize; r++) {
            for (let c = 0; c < boardSize; c++) {
                if (board[r][c] === 2) { // If it's a black piece
                    // Check for regular moves (diagonal forward for black)
                    // Black moves "up" the board (decreasing row index)
                    const potentialMoves = [
                        { dr: -1, dc: -1 }, // Up-left
                        { dr: -1, dc: 1 }  // Up-right
                    ];

                    potentialMoves.forEach(moveDir => {
                        const newR = r + moveDir.dr;
                        const newC = c + moveDir.dc;

                        if (isValidCoord(newR, newC) && board[newR][newC] === 0) {
                            possibleMoves.push({
                                from: { r, c },
                                to: { r: newR, c: newC },
                                isCapture: false
                            });
                        }
                    });

                    // Check for capture moves
                    const potentialCaptures = [
                        { dr: -1, dc: -1, jdr: -2, jdc: -2 }, // Jump over up-left
                        { dr: -1, dc: 1, jdr: -2, jdc: 2 }   // Jump over up-right
                    ];

                    potentialCaptures.forEach(captureDir => {
                        const jumpedR = r + captureDir.dr;
                        const jumpedC = c + captureDir.dc;
                        const landR = r + captureDir.jdr;
                        const landC = c + captureDir.jdc;

                        if (isValidCoord(landR, landC) && board[landR][landC] === 0 &&
                            isValidCoord(jumpedR, jumpedC) && board[jumpedR][jumpedC] === 1) { // Opponent's red piece
                            possibleMoves.push({
                                from: { r, c },
                                to: { r: landR, c: landC },
                                captured: { r: jumpedR, c: jumpedC },
                                isCapture: true
                            });
                        }
                    });
                }
            }
        }
        return possibleMoves;
    }

    // Function for the computer to make a move (basic AI: random valid move)
    function makeComputerMove() {
        const moves = findComputerMoves();
        if (moves.length === 0) {
            console.log("Computer has no moves!");
            // TODO: Handle game over
            return;
        }

        // Prioritize capture moves if available
        const captureMoves = moves.filter(move => move.isCapture);
        const chosenMoves = captureMoves.length > 0 ? captureMoves : moves;

        const randomMove = chosenMoves[Math.floor(Math.random() * chosenMoves.length)];

        // Execute the move
        board[randomMove.to.r][randomMove.to.c] = board[randomMove.from.r][randomMove.from.c];
        board[randomMove.from.r][randomMove.from.c] = 0;
        if (randomMove.isCapture) {
            board[randomMove.captured.r][randomMove.captured.c] = 0; // Remove captured piece
        }

        console.log("Computer made a move:", randomMove);
        renderBoard(); // Update the display
        // TODO: Switch turn back to human
    }

    // --- Game Flow ---
    initializeBoard();
    renderBoard();

    // Placeholder for game initialization and logic
    const newGameButton = document.getElementById('new-game-button');
    newGameButton.addEventListener('click', () => {
        alert('Starting a new game!');
        initializeBoard();
        renderBoard();
        currentPlayer = 1; // Reset to human turn
        // In future, implement game reset logic here
    });

    // For testing: Make computer move after 2 seconds
    setTimeout(() => {
        if (currentPlayer === 2) {
            makeComputerMove();
            currentPlayer = 1; // Switch turn back to human for testing
        }
    }, 2000);
});
