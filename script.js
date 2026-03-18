// SCRUM-593: Implement Configurable Board Fields and Start/End Points
// SCRUM-595: Implement Card Drawing Mechanic

const gameBoard = document.getElementById('game-board');
const minFields = 20;
const maxFields = 30;
const numberOfFields = Math.floor(Math.random() * (maxFields - minFields + 1)) + minFields;

function createBoard() {
    const radius = gameBoard.offsetWidth / 2;
    const centerX = radius;
    const centerY = radius;

    for (let i = 0; i < numberOfFields; i++) {
        const angle = (i / numberOfFields) * 2 * Math.PI - Math.PI / 2; // Start from top
        const x = centerX + (radius - 50) * Math.cos(angle) - 30; // 30 is half of field width/height
        const y = centerY + (radius - 50) * Math.sin(angle) - 30; // 30 is half of field width/height

        const field = document.createElement('div');
        field.classList.add('board-field');
        field.style.left = `${x}px`;
        field.style.top = `${y}px`;
        field.textContent = i + 1;

        if (i === 0) {
            field.classList.add('start');
        }
        if (i === numberOfFields - 1) {
            field.classList.add('end');
        }

        // SCRUM-594: Integrate Card Slots on Each Board Field (blank for now)
        // This part is for SCRUM-594, but I'm putting it here as it's related to field creation.
        for (let j = 0; j < 3; j++) {
            const cardSlot = document.createElement('div');
            cardSlot.classList.add('card-slot');
            field.appendChild(cardSlot);
        }

        gameBoard.appendChild(field);
    }
}

createBoard();

// --- SCRUM-595: Implement Card Drawing Mechanic ---
// For now, I'll add a simple click listener to each field to simulate drawing a card.
// In a real game, this would be triggered by player landing on a field.

// Placeholder for cards on each field. Each sub-array represents a field's cards.
// 0: card not drawn, 1: card drawn
const fieldCards = Array.from({ length: numberOfFields }, () => [0, 0, 0]);

document.querySelectorAll('.board-field').forEach((field, index) => {
    field.addEventListener('click', () => {
        console.log(`Player entered field ${index + 1}`);
        drawCard(index);
    });
});

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
