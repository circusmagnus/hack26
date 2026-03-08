// game.js - Recreated and adapted for SCRUM-122

// Game board representation
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let winCounter = parseInt(localStorage.getItem('humanWins')) || 0; // Initialize from localStorage

const statusDisplay = document.querySelector('.game--status'); // Assuming a status element in HTML
const winCounterDisplay = document.getElementById('human-wins'); // Assuming win counter element in HTML

// Win conditions
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Messages
const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

// Update win counter display
function updateWinCounterDisplay() {
    winCounterDisplay.textContent = winCounter;
    localStorage.setItem('humanWins', winCounter);
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

// Function to handle player moves
function handleCellPlayed(clickedCell, clickedCellIndex) {
    board[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer === 'X' ? 'x' : 'o'); // Add class for styling
}

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
            alert(`Player ${currentPlayer} has won!`); // Temporary alert
        } else { // 'O' is opponent
            decrementHumanWins();
            alert(`Player ${currentPlayer} has won!`); // Temporary alert
        }
        gameActive = false;
        return;
    }

    let roundDraw = !board.includes("");
    if (roundDraw) {
        alert(drawMessage()); // Temporary alert
        gameActive = false;
        return;
    }

    // If no win or draw, switch player
    handlePlayerChange();
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    // statusDisplay.innerHTML = currentPlayerTurn(); // Update status display if it exists
    if (currentPlayer === 'O' && gameActive) {
        setTimeout(handleOpponentMove, 700); // Opponent moves after a slight delay
    }
}


// Function to handle scripted opponent moves (simple AI for now)
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


function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.dataset.cellIndex);

    if (board[clickedCellIndex] !== '' || !gameActive || currentPlayer === 'O') {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = 'X';
    board = ['', '', '', '', '', '', '', '', ''];
    // statusDisplay.innerHTML = currentPlayerTurn(); // Update status display if it exists
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
}


// Initialize game
function initializeGame() {
    document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
    // document.querySelector('.game--restart').addEventListener('click', handleRestartGame); // Assuming a restart button
    // statusDisplay.innerHTML = currentPlayerTurn(); // Set initial status

    updateWinCounterDisplay(); // Display initial win counter
}

// Call to initialize the game when the script loads
document.addEventListener('DOMContentLoaded', initializeGame);
