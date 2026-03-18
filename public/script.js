// script.js

const gameBoard = document.getElementById('game-board');
const rollDiceButton = document.getElementById('roll-dice');
const messageParagraph = document.getElementById('message');

const numberOfFields = 24; // Configurable between 20-30

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
}

initializeBoard(numberOfFields);