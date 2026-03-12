document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const board = [];
    let selectedPiece = null;
    let selectedPieceOriginalSquare = null; // To store the original position of the selected piece

    // Initialize board with piece data
    function initializeBoardData() {
        for (let i = 0; i < 8; i++) {
            board[i] = [];
            for (let j = 0; j < 8; j++) {
                // Determine initial piece placement
                if (i < 3 && (i + j) % 2 !== 0) {
                    board[i][j] = { color: 'red', king: false };
                } else if (i > 4 && (i + j) % 2 !== 0) {
                    board[i][j] = { color: 'green', king: false };
                } else {
                    board[i][j] = null;
                }
            }
        }
    }

    function createBoard() {
        gameBoard.innerHTML = ''; // Clear existing board
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const square = document.createElement('div');
                square.classList.add('square');
                if ((i + j) % 2 === 0) {
                    square.classList.add('white');
                } else {
                    square.classList.add('black');
                }
                square.dataset.row = i;
                square.dataset.col = j;
                square.addEventListener('click', handleSquareClick);

                // Place pieces if they exist in the board data
                const pieceData = board[i][j];
                if (pieceData) {
                    const piece = document.createElement('div');
                    piece.classList.add('piece', `${pieceData.color}-piece`);
                    if (pieceData.king) {
                        piece.textContent = 'K';
                    }
                    square.appendChild(piece);
                }
                gameBoard.appendChild(square);
            }
        }
    }

    function handleSquareClick(event) {
        const row = parseInt(event.currentTarget.dataset.row);
        const col = parseInt(event.currentTarget.dataset.col);

        const clickedPiece = board[row][col];

        // If a piece is currently selected
        if (selectedPiece) {
            // If the clicked square is the original square of the selected piece, deselect
            if (selectedPieceOriginalSquare.row === row && selectedPieceOriginalSquare.col === col) {
                deselectPiece();
                return;
            }

            // Check if it's a valid move
            if (isValidMove(selectedPieceOriginalSquare.row, selectedPieceOriginalSquare.col, row, col)) {
                movePiece(selectedPieceOriginalSquare.row, selectedPieceOriginalSquare.col, row, col);
                deselectPiece();
            } else {
                // If clicked on another piece of the same color, select that one
                if (clickedPiece && clickedPiece.color === selectedPiece.color) {
                    deselectPiece(); // Deselect previous
                    selectPiece(row, col); // Select new one
                } else {
                    // Invalid move or clicked on opponent's piece, deselect
                    deselectPiece();
                }
            }
        } else {
            // No piece selected, try to select one
            if (clickedPiece && clickedPiece.color === 'red') { // Only allow selecting red pieces
                selectPiece(row, col);
            }
        }
    }

    function selectPiece(row, col) {
        selectedPiece = board[row][col];
        selectedPieceOriginalSquare = { row, col };
        const squareElement = gameBoard.children[row * 8 + col];
        squareElement.classList.add('selected'); // Add visual highlight
        // TODO: Highlight valid moves
    }

    function deselectPiece() {
        if (selectedPieceOriginalSquare) {
            const squareElement = gameBoard.children[selectedPieceOriginalSquare.row * 8 + selectedPieceOriginalSquare.col];
            squareElement.classList.remove('selected');
        }
        selectedPiece = null;
        selectedPieceOriginalSquare = null;
    }

    function isValidMove(startRow, startCol, endRow, endCol) {
        const piece = board[startRow][startCol];
        if (!piece || piece.color !== 'red') return false; // Ensure it's a red piece

        // Check if destination is within bounds and empty
        if (endRow < 0 || endRow >= 8 || endCol < 0 || endCol >= 8 || board[endRow][endCol] !== null) {
            return false;
        }

        const rowDiff = endRow - startRow;
        const colDiff = Math.abs(endCol - startCol);

        // Standard move: one square diagonally forward
        if (piece.color === 'red' && rowDiff === -1 && colDiff === 1) { // Red moves upwards (decreasing row index)
            return true;
        }
        // TODO: Add king moves, captures in SCRUM-519

        return false;
    }

    function movePiece(startRow, startCol, endRow, endCol) {
        // Update board data
        board[endRow][endCol] = board[startRow][startCol];
        board[startRow][startCol] = null;

        // Update DOM
        const startSquare = gameBoard.children[startRow * 8 + startCol];
        const endSquare = gameBoard.children[endRow * 8 + endCol];

        const pieceElement = startSquare.querySelector('.piece');
        if (pieceElement) {
            endSquare.appendChild(pieceElement);
        }
        // Check for kinging
        if (board[endRow][endCol].color === 'red' && endRow === 0) {
            board[endRow][endCol].king = true;
            if (pieceElement) {
                pieceElement.textContent = 'K'; // Add 'K' for king
            }
        }
    }

    initializeBoardData();
    createBoard();
});
