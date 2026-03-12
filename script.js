// JavaScript for Checkers Game

document.addEventListener('DOMContentLoaded', () => {
    console.log('Checkers game loaded!');

    const gameBoard = document.getElementById('game-board');
    const boardSize = 8;

    // Function to render the checkerboard and pieces
    function renderBoard() {
        gameBoard.innerHTML = ''; // Clear existing board
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                const square = document.createElement('div');
                square.classList.add('square');
                // Alternate colors: (row + col) % 2 === 0 for light, 1 for dark
                if ((i + j) % 2 === 0) {
                    square.classList.add('light');
                } else {
                    square.classList.add('dark');
                }

                // Place pieces on dark squares in the first three and last three rows
                if ((i + j) % 2 !== 0) { // Only place pieces on dark squares
                    if (i < 3) { // First three rows for red pieces
                        const piece = document.createElement('div');
                        piece.classList.add('piece', 'red-piece');
                        square.appendChild(piece);
                    } else if (i >= boardSize - 3) { // Last three rows for black pieces
                        const piece = document.createElement('div');
                        piece.classList.add('piece', 'black-piece');
                        square.appendChild(piece);
                    }
                }
                gameBoard.appendChild(square);
            }
        }
    }

    renderBoard();

    // Placeholder for game initialization and logic
    const newGameButton = document.getElementById('new-game-button');
    newGameButton.addEventListener('click', () => {
        alert('Starting a new game!');
        // In future, implement game reset logic here
    });
});