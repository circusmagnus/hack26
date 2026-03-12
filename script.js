// JavaScript for Checkers Game

document.addEventListener('DOMContentLoaded', () => {
    console.log('Checkers game loaded!');

    const gameBoardElement = document.getElementById('game-board');
    const humanWinsSpan = document.getElementById('human-wins');
    const computerWinsSpan = document.getElementById('computer-wins');
    const boardSize = 8;
    let board = []; // 2D array representing the board state
    let selectedPiece = null;
    let humanWins = 0;
    let computerWins = 0;
    let currentPlayer = 'red'; // 'red' for human, 'black' for computer

    const PIECE_RED = 'red';
    const PIECE_BLACK = 'black';
    const KING_RED = 'red-king';
    const KING_BLACK = 'black-king';

    // Initialize board with pieces
    function initializeBoard() {
        board = Array(boardSize).fill(0).map(() => Array(boardSize).fill(null));

        for (let r = 0; r < boardSize; r++) {
            for (let c = 0; c < boardSize; c++) {
                if ((r + c) % 2 !== 0) { // Dark squares
                    if (r < 3) {
                        board[r][c] = { type: PIECE_RED, isKing: false };
                    } else if (r >= boardSize - 3) {
                        board[r][c] = { type: PIECE_BLACK, isKing: false };
                    }
                }
            }
        }
        humanWins = 0;
        computerWins = 0;
        updateScoreDisplay();
        currentPlayer = 'red';
        renderBoard();
    }

    // Update score display
    function updateScoreDisplay() {
        humanWinsSpan.textContent = humanWins;
        computerWinsSpan.textContent = computerWins;
    }

    // Render the checkerboard and pieces based on the board array
    function renderBoard() {
        gameBoardElement.innerHTML = ''; // Clear existing board

        for (let r = 0; r < boardSize; r++) {
            for (let c = 0; c < boardSize; c++) {
                const squareElement = document.createElement('div');
                squareElement.classList.add('square');
                squareElement.dataset.row = r;
                squareElement.dataset.col = c;

                if ((r + c) % 2 === 0) {
                    squareElement.classList.add('light');
                } else {
                    squareElement.classList.add('dark');
                }

                const piece = board[r][c];
                if (piece) {
                    const pieceElement = document.createElement('div');
                    pieceElement.classList.add('piece');
                    pieceElement.classList.add(piece.type === PIECE_RED || piece.type === KING_RED ? 'red-piece' : 'black-piece');
                    if (piece.isKing) {
                        pieceElement.classList.add('king');
                        pieceElement.textContent = 'K';
                    }
                    pieceElement.dataset.row = r;
                    pieceElement.dataset.col = c;
                    squareElement.appendChild(pieceElement);
                }

                squareElement.addEventListener('click', handleSquareClick);
                gameBoardElement.appendChild(squareElement);
            }
        }
    }

    function handleSquareClick(event) {
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);

        if (isNaN(row) || isNaN(col)) { // Clicked on a piece, not the square directly
            const parentSquare = event.target.closest('.square');
            if (parentSquare) {
                const parentRow = parseInt(parentSquare.dataset.row);
                const parentCol = parseInt(parentSquare.dataset.col);
                if (board[parentRow][parentCol] && ((board[parentRow][parentCol].type === PIECE_RED || board[parentRow][parentCol].type === KING_RED) && currentPlayer === 'red')) {
                    selectPiece(parentRow, parentCol);
                } else if (selectedPiece) {
                    attemptMove(parentRow, parentCol);
                }
            }
        } else { // Clicked on an empty square or opponent's piece
            if (board[row][col] && ((board[row][col].type === PIECE_RED || board[row][col].type === KING_RED) && currentPlayer === 'red')) {
                selectPiece(row, col);
            } else if (selectedPiece) {
                attemptMove(row, col);
            }
        }
    }

    function selectPiece(row, col) {
        // Deselect previous piece if any
        if (selectedPiece) {
            const prevSelectedElement = gameBoardElement.querySelector(`[data-row="${selectedPiece.row}"][data-col="${selectedPiece.col}"]`);
            if (prevSelectedElement) {
                prevSelectedElement.classList.remove('selected');
                const prevPieceElement = prevSelectedElement.querySelector('.piece');
                if (prevPieceElement) prevPieceElement.classList.remove('selected-piece');
            }
        }

        selectedPiece = { row, col, piece: board[row][col] };
        const currentSelectedElement = gameBoardElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (currentSelectedElement) {
            currentSelectedElement.classList.add('selected');
            const currentPieceElement = currentSelectedElement.querySelector('.piece');
            if (currentPieceElement) currentPieceElement.classList.add('selected-piece');
        }
    }

    function attemptMove(targetRow, targetCol) {
        if (!selectedPiece) return;

        const { row: startRow, col: startCol, piece } = selectedPiece;
        const validMoves = getValidMoves(startRow, startCol);

        const move = validMoves.find(m => m.endRow === targetRow && m.endCol === targetCol);

        if (move) {
            makeMove(move);
            switchPlayer();
            checkWinCondition();
        } else {
            alert('Invalid move!');
        }
        selectedPiece = null; // Deselect after move attempt
        renderBoard(); // Re-render to clear selection and update board
    }

    function getValidMoves(row, col) {
        const piece = board[row][col];
        if (!piece) return [];

        const moves = [];
        const directions = piece.isKing ? [-1, 1] : (piece.type === PIECE_RED ? [1] : [-1]); // Red moves down (+1), Black moves up (-1)

        for (const dr of directions) {
            for (const dc of [-1, 1]) {
                const newRow = row + dr;
                const newCol = col + dc;

                // Check simple move
                if (isValidBoardPosition(newRow, newCol) && !board[newRow][newCol]) {
                    moves.push({ startRow: row, startCol: col, endRow: newRow, endCol: newCol, isJump: false });
                }

                // Check jump move
                const jumpedRow = row + 2 * dr;
                const jumpedCol = col + 2 * dc;
                if (isValidBoardPosition(jumpedRow, jumpedCol) && !board[jumpedRow][jumpedCol]) {
                    const jumpedPiece = board[newRow][newCol];
                    if (jumpedPiece && ((piece.type === PIECE_RED && (jumpedPiece.type === PIECE_BLACK || jumpedPiece.type === KING_BLACK)) ||
                                        (piece.type === PIECE_BLACK && (jumpedPiece.type === PIECE_RED || jumpedPiece.type === KING_RED)))) {
                        moves.push({ startRow: row, startCol: col, endRow: jumpedRow, endCol: jumpedCol, isJump: true, capturedPiece: { row: newRow, col: newCol } });
                    }
                }
            }
        }
        return moves;
    }

    function isValidBoardPosition(row, col) {
        return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
    }

    function makeMove(move) {
        const { startRow, startCol, endRow, endCol, isJump, capturedPiece } = move;
        const piece = board[startRow][startCol];

        board[endRow][endCol] = piece;
        board[startRow][startCol] = null;

        if (isJump) {
            board[capturedPiece.row][capturedPiece.col] = null;
        }

        // Promote to king
        if (piece.type === PIECE_RED && endRow === boardSize - 1) {
            piece.isKing = true;
            piece.type = KING_RED;
        } else if (piece.type === PIECE_BLACK && endRow === 0) {
            piece.isKing = true;
            piece.type = KING_BLACK;
        }
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 'red' ? 'black' : 'red';
        console.log(`Current Player: ${currentPlayer}`);
        if (currentPlayer === 'black') {
            // Placeholder for computer's turn logic
            setTimeout(computerMove, 1000); // Simulate computer thinking
        }
    }

    function computerMove() {
        // This is a very basic random move for now.
        // Will be replaced by more sophisticated AI in SCRUM-490.
        let availableMoves = [];
        for (let r = 0; r < boardSize; r++) {
            for (let c = 0; c < boardSize; c++) {
                const piece = board[r][c];
                if (piece && (piece.type === PIECE_BLACK || piece.type === KING_BLACK)) {
                    const pieceMoves = getValidMoves(r, c);
                    if (pieceMoves.length > 0) {
                        availableMoves.push(...pieceMoves);
                    }
                }
            }
        }

        if (availableMoves.length > 0) {
            const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            makeMove(randomMove);
            switchPlayer();
            checkWinCondition();
            renderBoard();
        } else {
            // No moves for computer, human wins
            humanWins++;
            updateScoreDisplay();
            alert('Human wins! Computer has no moves.');
            // Implement game over logic, New Game button should be available
        }
    }


    function checkWinCondition() {
        let redPieces = 0;
        let blackPieces = 0;

        for (let r = 0; r < boardSize; r++) {
            for (let c = 0; c < boardSize; c++) {
                const piece = board[r][c];
                if (piece) {
                    if (piece.type === PIECE_RED || piece.type === KING_RED) {
                        redPieces++;
                    } else if (piece.type === PIECE_BLACK || piece.type === KING_BLACK) {
                        blackPieces++;
                    }
                }
            }
        }

        if (redPieces === 0) {
            computerWins++;
            updateScoreDisplay();
            alert('Computer wins!');
            // Game over, maybe disable moves or show New Game button
        } else if (blackPieces === 0) {
            humanWins++;
            updateScoreDisplay();
            alert('Human wins!');
            // Game over
        }
    }

    // Event listener for New Game button
    const newGameButton = document.getElementById('new-game-button');
    newGameButton.addEventListener('click', initializeBoard);

    // Initial game setup
    initializeBoard();
});
