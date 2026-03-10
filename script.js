
const gameBoard = document.getElementById('game-board');
const winCounterDisplay = document.getElementById('win-counter');
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X'; // Human player
let gameActive = true;
let winCount = 0; // Initial win count

// Function to render the board
function renderBoard() {
    gameBoard.innerHTML = '';
    board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.textContent = cell;
        cellElement.dataset.index = index;
        cellElement.addEventListener('click', handleCellClick);
        gameBoard.appendChild(cellElement);
    });
}

// Function to handle cell clicks
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.dataset.index);

    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    // Human player move
    board[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    if (checkWin(currentPlayer)) {
        winCount++;
        winCounterDisplay.textContent = `Win Count: ${winCount}`;
        alert(`${currentPlayer} wins!`);
        gameActive = false;
        return;
    }

    if (checkDraw()) {
        alert('It's a draw!');
        gameActive = false;
        return;
    }

    currentPlayer = 'O'; // Switch to AI

    // AI move (simplified for now)
    setTimeout(handleAIMove, 500); // Simulate AI thinking
}

// Function for AI move
function handleAIMove() {
    let availableCells = [];
    board.forEach((cell, index) => {
        if (cell === '') {
            availableCells.push(index);
        }
    });

    if (availableCells.length === 0) {
        return; // Should be handled by checkDraw before this
    }

    const randomIndex = Math.floor(Math.random() * availableCells.length);
    const AIChoice = availableCells[randomIndex];

    board[AIChoice] = currentPlayer;
    document.querySelector(`[data-index="${AIChoice}"]`).textContent = currentPlayer;

    if (checkWin(currentPlayer)) {
        winCount--; // AI wins, human loses
        winCounterDisplay.textContent = `Win Count: ${winCount}`;
        alert('AI wins!');
        gameActive = false;
        return;
    }

    if (checkDraw()) {
        alert('It's a draw!');
        gameActive = false;
        return;
    }

    currentPlayer = 'X'; // Switch back to human
}


// Function to check for win
function checkWin(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    return winPatterns.some(pattern => {
        return pattern.every(index => {
            return board[index] === player;
        });
    });
}

// Function to check for draw
function checkDraw() {
    return board.every(cell => cell !== '');
}

// Initialize game
renderBoard();
