document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const board = [];

    function createBoard() {
        for (let i = 0; i < 8; i++) {
            board[i] = [];
            for (let j = 0; j < 8; j++) {
                const square = document.createElement('div');
                square.classList.add('square');
                if ((i + j) % 2 === 0) {
                    square.classList.add('white');
                } else {
                    square.classList.add('black');
                }
                gameBoard.appendChild(square);
                board[i][j] = null; // Initialize with no piece
            }
        }
    }

    function placePieces() {
        // Place red pieces (player)
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 8; j++) {
                if ((i + j) % 2 !== 0) {
                    const piece = document.createElement('div');
                    piece.classList.add('piece', 'red-piece');
                    // For now, just a visual representation
                    // Later: assign data for actual game logic
                    const squareIndex = i * 8 + j;
                    gameBoard.children[squareIndex].appendChild(piece);
                }
            }
        }

        // Place green pieces (computer)
        for (let i = 5; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if ((i + j) % 2 !== 0) {
                    const piece = document.createElement('div');
                    piece.classList.add('piece', 'green-piece');
                    // For now, just a visual representation
                    // Later: assign data for actual game logic
                    const squareIndex = i * 8 + j;
                    gameBoard.children[squareIndex].appendChild(piece);
                }
            }
        }
    }

    createBoard();
    placePieces();
});