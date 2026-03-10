
const gameBoard = document.getElementById('game-board');
const statusDisplay = document.getElementById('status');
const humanWinsDisplay = document.getElementById('human-wins');
const computerWinsDisplay = document.getElementById('computer-wins');
const resetButton = document.getElementById('reset-button');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X'; // Human player
let gameActive = true;
let humanWins = 0;
let computerWins = 0;

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Function to update the status display
function updateStatus(message) {
    statusDisplay.textContent = message;
}

// Function to update win counters display
function updateWinCounters() {
    humanWinsDisplay.textContent = `Human Wins: ${humanWins}`;
    computerWinsDisplay.textContent = `Computer Wins: ${computerWins}`;
}

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

// Function to check for win
function checkWin(player) {
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

// Function to end the game
function endGame(message) {
    updateStatus(message);
    gameActive = false;
    // Optionally, remove event listeners or make cells unclickable
    gameBoard.querySelectorAll('.cell').forEach(cell => {
        cell.removeEventListener('click', handleCellClick);
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
        humanWins++;
        updateWinCounters();
        endGame(`${currentPlayer} Wins!`);
        return;
    }

    if (checkDraw()) {
        endGame("It's a Draw!");
        return;
    }

    currentPlayer = 'O'; // Switch to AI
    updateStatus(`Player ${currentPlayer}'s Turn`);

    // AI move
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
        computerWins++;
        updateWinCounters();
        endGame('Computer Wins!');
        return;
    }

    if (checkDraw()) {
        endGame("It's a Draw!");
        return;
    }

    currentPlayer = 'X'; // Switch back to human
    updateStatus(`Player ${currentPlayer}'s Turn`);
}

// Function to reset the game
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    updateStatus(`Player ${currentPlayer}'s Turn`);
    renderBoard(); // Re-render to clear marks and re-attach event listeners
}

// Event listener for reset button
resetButton.addEventListener('click', resetGame);

// Initialize game
updateStatus(`Player ${currentPlayer}'s Turn`);
updateWinCounters();
renderBoard();
