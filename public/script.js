
let playerPosition = 0;
const boardSize = 25; // Example board size, will be configurable later

const rollDiceButton = document.getElementById('roll-dice');
const messageParagraph = document.getElementById('message');
const gameBoard = document.getElementById('game-board');

function initializeBoard() {
    gameBoard.innerHTML = ''; // Clear existing board
    for (let i = 0; i < boardSize; i++) {
        const field = document.createElement('div');
        field.classList.add('field');
        field.id = `field-${i}`;
        // Position fields in a circle (simplified for now, will be improved with circular board task)
        const angle = (i / boardSize) * 2 * Math.PI;
        const radius = 250; // Adjust as needed
        field.style.left = `${radius + radius * Math.cos(angle) - 25}px`;
        field.style.top = `${radius + radius * Math.sin(angle) - 25}px`;
        gameBoard.appendChild(field);
    }
    // Place player at start
    updatePlayerPositionUI();
}

function updatePlayerPositionUI() {
    // Clear previous player
    const existingPlayer = document.querySelector('.player');
    if (existingPlayer) {
        existingPlayer.remove();
    }

    const currentField = document.getElementById(`field-${playerPosition}`);
    if (currentField) {
        const player = document.createElement('div');
        player.classList.add('player');
        currentField.appendChild(player);
    }
}

rollDiceButton.addEventListener('click', () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    messageParagraph.textContent = `You rolled a ${roll}.`;

    if (roll === 5 || roll === 6) {
        playerPosition = (playerPosition + 1) % boardSize; // Move one step, wrap around if needed
        messageParagraph.textContent += ` You moved to position ${playerPosition}.`;
        updatePlayerPositionUI();
    } else {
        messageParagraph.textContent += ` No movement.`;
    }
});

initializeBoard();
