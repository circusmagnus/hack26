// script.js

const gameBoard = document.getElementById('game-board');
const rollDiceButton = document.getElementById('roll-dice');
const messageParagraph = document.getElementById('message');

const numberOfFields = 24; // Configurable between 20-30

// Game state object
const game = {
    players: [{ id: 1, name: "Player 1", position: 0 }], // Placeholder player
    gameEnded: false,
    winner: null
};

function initializeBoard(numFields) {
    // Clear existing fields
    gameBoard.innerHTML = '';

    const radius = gameBoard.offsetWidth / 2 - 50; // Adjust for field size
    const centerX = gameBoard.offsetWidth / 2;
    const centerY = gameBoard.offsetHeight / 2;

    for (let i = 0; i < numFields; i++) {
        const field = document.createElement('div');
        field.classList.add('board-field');
        field.dataset.fieldIndex = i;

        const angle = (i / numFields) * 2 * Math.PI - Math.PI / 2; // Start at the top (-PI/2)
        const x = centerX + radius * Math.cos(angle) - field.offsetWidth / 2;
        const y = centerY + radius * Math.sin(angle) - field.offsetHeight / 2;

        field.style.left = `${x}px`;
        field.style.top = `${y}px`;

        if (i === 0) {
            field.classList.add('start-field');
            field.textContent = 'Start';
        } else if (i === numFields - 1) {
            field.classList.add('end-field');
            field.textContent = 'End';
        } else {
            field.textContent = i;
        }

        gameBoard.appendChild(field);
    }
    updatePlayerPositionUI(game.players[0]); // Place the placeholder player on the board
}

// Function to update player's visual position on the board
function updatePlayerPositionUI(player) {
    // Remove previous player representation
    const existingPlayerElem = document.querySelector(`.player[data-player-id="${player.id}"]`);
    if (existingPlayerElem) {
        existingPlayerElem.remove();
    }

    const currentField = document.querySelector(`.board-field[data-field-index="${player.position}"]`);
    if (currentField) {
        const playerElem = document.createElement('div');
        playerElem.classList.add('player');
        playerElem.dataset.playerId = player.id;
        playerElem.textContent = player.id; // Display player ID for now
        currentField.appendChild(playerElem);
    }
}


function checkWinCondition() {
    for (const player of game.players) {
        if (player.position >= numberOfFields - 1) {
            game.gameEnded = true;
            game.winner = player;
            messageParagraph.textContent = `${player.name} has reached the end and won the game!`;
            rollDiceButton.disabled = true; // Disable further actions
            console.log(`${player.name} wins!`);
            return;
        }
    }
}

// Temporary function for testing win condition - Porthos will implement actual dice roll and movement
function movePlayer(player, steps) {
    if (game.gameEnded) return;

    player.position += steps;
    if (player.position >= numberOfFields - 1) {
        player.position = numberOfFields - 1; // Ensure player stops at the last field
    }
    updatePlayerPositionUI(player);
    checkWinCondition();
}

// Attach a temporary event listener to the roll dice button for testing
rollDiceButton.addEventListener('click', () => {
    if (!game.gameEnded) {
        // Simulate a successful roll for testing the win condition
        movePlayer(game.players[0], 1);
        messageParagraph.textContent = `Player 1 moved to position ${game.players[0].position}.`;
    }
});


initializeBoard(numberOfFields);