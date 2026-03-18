// script.js

document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const rollDiceBtn = document.getElementById('roll-dice-btn');
    const diceResultElem = document.getElementById('dice-result');

    // SCRUM-593: Configurable Board Fields and Start/End Points
    const minFields = 20;
    const maxFields = 30;
    const numberOfFields = Math.floor(Math.random() * (maxFields - minFields + 1)) + minFields;

    let currentPlayerPosition = 0; // My implementation for player position

    // SCRUM-595: Placeholder for cards on each field. Each sub-array represents a field's cards.
    // 0: card not drawn, 1: card drawn
    const fieldCards = Array.from({ length: numberOfFields }, () => [0, 0, 0]);

    // Function to create board fields (Combined from HEAD and my commit)
    function createBoard() {
        const radius = gameBoard.offsetWidth / 2;
        const centerX = radius;
        const centerY = radius;
        const fieldSize = 60; // Size of each field (from my commit)

        for (let i = 0; i < numberOfFields; i++) {
            const field = document.createElement('div');
            field.classList.add('board-field');
            field.textContent = i + 1;

            // Calculate position for circular layout (combined logic)
            const angle = (i / numberOfFields) * 2 * Math.PI - Math.PI / 2; // Start at top
            const x = centerX + (radius - fieldSize / 2 - 10) * Math.cos(angle) - fieldSize / 2; // From my commit
            const y = centerY + (radius - fieldSize / 2 - 10) * Math.sin(angle) - fieldSize / 2; // From my commit

            field.style.left = `${x}px`;
            field.style.top = `${y}px`;

            if (i === 0) {
                field.classList.add('start');
            }
            if (i === numberOfFields - 1) {
                field.classList.add('end');
            }

            // SCRUM-594: Integrate Card Slots on Each Board Field (from HEAD)
            for (let j = 0; j < 3; j++) {
                const cardSlot = document.createElement('div');
                cardSlot.classList.add('card-slot');
                field.appendChild(cardSlot);
            }
            gameBoard.appendChild(field);
        }
    }

    // Create a player element (from my commit)
    const player = document.createElement('div');
    player.classList.add('player');
    player.textContent = 'P1';
    gameBoard.appendChild(player);

    // Function to place player on a field (from my commit)
    function placePlayerOnField(playerElem, fieldIndex) {
        const fields = document.querySelectorAll('.board-field');
        if (fields[fieldIndex]) {
            const fieldRect = fields[fieldIndex].getBoundingClientRect();
            const gameBoardRect = gameBoard.getBoundingClientRect();

            // Position player in the center of the field
            playerElem.style.left = `${fieldRect.left - gameBoardRect.left + (fieldRect.width / 2) - (playerElem.offsetWidth / 2)}px`;
            playerElem.style.top = `${fieldRect.top - gameBoardRect.top + (fieldRect.height / 2) - (playerElem.offsetHeight / 2)}px`;
        }
    }

    // --- SCRUM-595: Implement Card Drawing Mechanic (from HEAD, adapted) ---
    function drawCard(fieldIndex) {
        let cardDrawn = false;
        for (let i = 0; i < fieldCards[fieldIndex].length; i++) {
            if (fieldCards[fieldIndex][i] === 0) {
                fieldCards[fieldIndex][i] = 1; // Mark card as drawn
                cardDrawn = true;
                console.log(`Card ${i + 1} drawn from field ${fieldIndex + 1}`);

                // Visually update the card slot (e.g., change background)
                const fieldElement = document.querySelectorAll('.board-field')[fieldIndex];
                fieldElement.querySelectorAll('.card-slot')[i].style.backgroundColor = '#ccc';

                break; // Only draw one card
            }
        }

        if (!cardDrawn) {
            console.log(`No cards left to draw on field ${fieldIndex + 1}`);
        }
    }

    // Initial board and player setup
    createBoard();
    placePlayerOnField(player, currentPlayerPosition);

    // Dice roll functionality (from my commit)
    rollDiceBtn.addEventListener('click', () => {
        const roll = Math.floor(Math.random() * 6) + 1; // d6 dice
        diceResultElem.textContent = `You rolled a ${roll}`;

        if (roll === 5 || roll === 6) {
            // Move player
            currentPlayerPosition = (currentPlayerPosition + 1); // No modulo, game ends when reaching last field
            if (currentPlayerPosition >= numberOfFields) {
                currentPlayerPosition = numberOfFields - 1; // Cap at the last field
            }
            placePlayerOnField(player, currentPlayerPosition);

            // Draw a card after moving (integrating SCRUM-595)
            drawCard(currentPlayerPosition);

            if (currentPlayerPosition === numberOfFields - 1) {
                alert('Player 1 Wins!');
                rollDiceBtn.disabled = true; // End game
            }
        }
    });
});