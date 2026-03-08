// game.js - Final Integration for SCRUM-122

// Game board representation
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let winCounter = parseInt(localStorage.getItem('humanWins')) || 0; // Initialize from localStorage

const statusDisplay = document.querySelector('.game--status'); // Will be used if status element is added to HTML
const winCounterDisplay = document.getElementById('human-wins');
const restartButton = document.querySelector('.game--restart');

// Win conditions
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Messages - these can be displayed in a status element if implemented
const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

// Update win counter display
function updateWinCounterDisplay() {
    if (winCounterDisplay) {
        winCounterDisplay.textContent = winCounter;
        localStorage.setItem('humanWins', winCounter);
    }
}

// Increment human wins
function incrementHumanWins() {
    winCounter++;
    updateWinCounterDisplay();
}

// Decrement human wins
function decrementHumanWins() {
    winCounter--;
    updateWinCounterDisplay();
}

// Function to handle a cell being played
function handleCellPlayed(clickedCell, clickedCellIndex) {
    board[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer === 'X' ? 'x' : 'o');
}

// Function to check game result (win or draw)
function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winConditions.length; i++) {
        const winCondition = winConditions[i];
        let a = board[winCondition[0]];
        let b = board[winCondition[1]];
        let c = board[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && a === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        if (currentPlayer === 'X') { // Assuming 'X' is human
            incrementHumanWins();
            alert(winningMessage()); // Using alert for now
        } else { // 'O' is opponent
            decrementHumanWins(); // Human loses if opponent wins
            alert(winningMessage()); // Using alert for now
        }
        gameActive = false;
        return;
    }

    let roundDraw = !board.includes("");
    if (roundDraw) {
        alert(drawMessage()); // Using alert for now
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

// Function to switch players and trigger opponent move if applicable
function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    // If there was a status display, update it here
    if (statusDisplay) {
        statusDisplay.innerHTML = currentPlayerTurn();
    }
    if (currentPlayer === 'O' && gameActive) {
        setTimeout(handleOpponentMove, 700); // Opponent moves after a slight delay
    }
}

// Simple AI for opponent
function handleOpponentMove() {
    if (!gameActive) return;

    let availableCells = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            availableCells.push(i);
        }
    }

    if (availableCells.length > 0) {
        const randomCellIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        const clickedCell = document.querySelector(`[data-cell-index="${randomCellIndex}"]`);
        handleCellPlayed(clickedCell, randomCellIndex);
        handleResultValidation();
    }
}

// Handle click event on cells
function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.dataset.cellIndex);

    if (board[clickedCellIndex] !== '' || !gameActive || currentPlayer === 'O') {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

// Restart game function
function handleRestartGame() {
    gameActive = true;
    currentPlayer = 'X';
    board = ['', '', '', '', '', '', '', '', ''];
    // Clear visual board
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    // If there was a status display, update it here
    if (statusDisplay) {
        statusDisplay.innerHTML = currentPlayerTurn();
    }
    updateWinCounterDisplay(); // Re-display win counter on restart
}

// Initialize game: attach event listeners and set initial display
function initializeGame() {
    document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
    if (restartButton) {
        restartButton.addEventListener('click', handleRestartGame);
    }
    // If there was a status display, set initial message
    if (statusDisplay) {
        statusDisplay.innerHTML = currentPlayerTurn();
    }
    updateWinCounterDisplay(); // Display initial win counter
}

// Call to initialize the game when the script loads
document.addEventListener('DOMContentLoaded', initializeGame);
