const gameBoard = document.getElementById('game-board');
const board = [];

function createBoard() {
    for (let i = 0; i < 8; i++) {
        board[i] = [];
        for (let j = 0; j < 8; j++) {
            const square = document.createElement('div');
            square.classList.add('square');
            
            const isLight = (i + j) % 2 === 0;
            if (isLight) {
                square.classList.add('light');
            } else {
                square.classList.add('dark');
            }
            
            // Place pieces
            if (!isLight) { // Pieces only on dark squares
                if (i < 3) {
                    const piece = document.createElement('div');
                    piece.classList.add('piece', 'green-piece'); // Computer pieces
                    square.appendChild(piece);
                } else if (i > 4) {
                    const piece = document.createElement('div');
                    piece.classList.add('piece', 'red-piece'); // Human pieces
                    square.appendChild(piece);
                }
            }
            
            gameBoard.appendChild(square);
            board[i][j] = { element: square, piece: null }; // Store square element and piece info
        }
    }
}

createBoard();