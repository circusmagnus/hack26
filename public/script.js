
let players = [];
let currentPlayerIndex = 0;
const boardSize = 25; // Configurable board size

const rollDiceButton = document.getElementById('roll-dice');
const addPlayerButton = document.getElementById('add-player');
const messageParagraph = document.getElementById('message');
const gameBoard = document.getElementById('game-board');
const playersContainer = document.getElementById('players-container');

function initializeBoard() {
    gameBoard.innerHTML = ''; // Clear existing board
    for (let i = 0; i < boardSize; i++) {
        const field = document.createElement('div');
        field.classList.add('field');
        field.id = `field-${i}`;
        // Position fields in a circle
        const angle = (i / boardSize) * 2 * Math.PI - Math.PI / 2; // Start at the top
        const radius = 250; 
        const centerX = gameBoard.offsetWidth / 2;
        const centerY = gameBoard.offsetHeight / 2;

        field.style.left = `${centerX + radius * Math.cos(angle) - 25}px`;
        field.style.top = `${centerY + radius * Math.sin(angle) - 25}px`;

        if (i === 0) {
            field.classList.add('start-field');
            field.textContent = 'Start';
        } else if (i === boardSize - 1) {
            field.classList.add('end-field');
            field.textContent = 'End';
        } else {
            field.textContent = i;
        }

        gameBoard.appendChild(field);
    }
    updatePlayersUI();
}

function updatePlayersUI() {
    // Clear existing player markers
    document.querySelectorAll('.player').forEach(playerDiv => playerDiv.remove());
    playersContainer.innerHTML = '';

    players.forEach((player) => {
        const currentField = document.getElementById(`field-${player.position}`);
        if (currentField) {
            const playerDiv = document.createElement('div');
            playerDiv.classList.add('player');
            playerDiv.style.backgroundColor = player.color;
            playerDiv.textContent = player.id;
            // Adjust player position on the field if multiple players are on the same field
            const playersOnField = currentField.querySelectorAll('.player').length;
            playerDiv.style.left = `${playersOnField * 5}px`;
            playerDiv.style.top = `${playersOnField * 5}px`;
            currentField.appendChild(playerDiv);
        }

        const playerStatus = document.createElement('p');
        playerStatus.id = `player-status-${player.id}`;
        playerStatus.textContent = `Player ${player.id} (${player.color}): Position ${player.position}`;
        playersContainer.appendChild(playerStatus);
    });
}

addPlayerButton.addEventListener('click', () => {
    const playerColors = ['red', 'green', 'purple', 'orange', 'black'];
    const newPlayerId = players.length + 1;
    const newPlayer = {
        id: newPlayerId,
        position: 0,
        color: playerColors[newPlayerId - 1] || 'gray' // Assign a color, default to gray
    };
    players.push(newPlayer);
    updatePlayersUI();
    messageParagraph.textContent = `Player ${newPlayerId} added.`;
});

rollDiceButton.addEventListener('click', () => {
    if (players.length === 0) {
        messageParagraph.textContent = "Please add at least one player to start the game.";
        return;
    }

    const currentPlayer = players[currentPlayerIndex];
    const roll = Math.floor(Math.random() * 6) + 1;
    messageParagraph.textContent = `Player ${currentPlayer.id} rolled a ${roll}.`;

    if (roll === 5 || roll === 6) {
        currentPlayer.position = (currentPlayer.position + 1) % boardSize;
        messageParagraph.textContent += ` Player ${currentPlayer.id} moved to position ${currentPlayer.position}.`;
        updatePlayersUI();
    } else {
        messageParagraph.textContent += ` Player ${currentPlayer.id} no movement.`;
    }

    // Move to the next player's turn
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
});

initializeBoard();
