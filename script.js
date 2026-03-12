// JavaScript for the checkers game
console.log("script.js loaded");

document.addEventListener('DOMContentLoaded', () => {
    const chessboard = document.getElementById('chessboard');
    const boardSize = 8;

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const square = document.createElement('div');
            square.classList.add('square');

            // Alternate colors for the squares
            if ((i + j) % 2 === 0) {
                square.classList.add('light');
            } else {
                square.classList.add('dark');
            }
            chessboard.appendChild(square);
        }
    }
});