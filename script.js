
// script.js

// Card Definitions
// Each card has an event description and an effect.
// Effects can be:
//   - move: player moves extra steps
//   - wait: player waits for a number of turns
//   - skipTurn: player skips their next turn
const cardEffects = {
    COFFEE_BREAK: {
        description: "Coffee Break! Feeling refreshed, move 1 extra step.",
        type: "move",
        value: 1
    },
    TRAFFIC_JAM: {
        description: "Traffic Jam! Stuck in traffic, wait 1 turn.",
        type: "wait",
        value: 1
    },
    FOUND_MONEY: {
        description: "Found some money on the street! Good karma, move 2 extra steps.",
        type: "move",
        value: 2
    },
    RAINY_WEATHER: {
        description: "Sudden downpour! Lost an umbrella, skip next turn.",
        type: "skipTurn",
        value: 1
    },
    HELPE_A_FRIEND: {
        description: "Helped a friend in need. Feeling good, move 1 extra step.",
        type: "move",
        value: 1
    },
    LOST_KEYS: {
        description: "Oh no, lost your keys! Search for them, wait 1 turn.",
        type: "wait",
        value: 1
    },
    GOOD_MEAL: {
        description: "Enjoyed a delicious meal. Energized, move 1 extra step.",
        type: "move",
        value: 1
    },
    LONG_MEETING: {
        description: "Endless meeting! Feeling drained, skip next turn.",
        type: "skipTurn",
        value: 1
    },
    SURPRISE_GIFT: {
        description: "Received a surprise gift! What a day, move 2 extra steps.",
        type: "move",
        value: 2
    },
    FLAT_TIRE: {
        description: "Flat tire on the way! What a hassle, wait 2 turns.",
        type: "wait",
        value: 2
    }
};

// Function to create a card object
function createCard(effectKey) {
    const effect = cardEffects[effectKey];
    if (!effect) {
        console.error("Invalid card effect key:", effectKey);
        return null;
    }
    return {
        event: effect.description,
        effect: {
            type: effect.type,
            value: effect.value
        },
        id: Math.random().toString(36).substr(2, 9) // Simple unique ID
    };
}

// Example: Generate a full deck of cards
function generateDeck() {
    const deck = [];
    for (const key in cardEffects) {
        // Add multiple copies of each card type to make the deck larger and more random
        for (let i = 0; i < 2; i++) { // Add 2 copies of each card for now
            deck.push(createCard(key));
        }
    }
    // Shuffle the deck
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

const gameDeck = generateDeck();
console.log("Generated Deck:", gameDeck);

// Placeholder for board fields - this will be properly integrated with board mechanics later
// For now, we'll simulate distributing cards to fields.
const NUMBER_OF_BOARD_FIELDS = 25; // Example, will be configurable
const MAX_CARDS_PER_FIELD = 3;

let boardFields = [];

function initializeBoardFieldsWithCards(deck) {
    boardFields = [];
    let deckIndex = 0;
    for (let i = 0; i < NUMBER_OF_BOARD_FIELDS; i++) {
        const fieldCards = [];
        const numCardsToDistribute = Math.floor(Math.random() * (MAX_CARDS_PER_FIELD + 1)); // 0 to MAX_CARDS_PER_FIELD cards
        for (let j = 0; j < numCardsToDistribute; j++) {
            if (deckIndex < deck.length) {
                fieldCards.push(deck[deckIndex]);
                deckIndex++;
            } else {
                console.warn("Ran out of cards in the deck to distribute to fields.");
                break;
            }
        }
        boardFields.push({
            id: `field-${i}`,
            cards: fieldCards,
            players: [] // Placeholder for players on this field
        });
    }
    console.log("Board fields initialized with cards:", boardFields);
}

initializeBoardFieldsWithCards(gameDeck);

// Function to simulate drawing a card when a player enters a field
function drawCard(fieldId) {
    const field = boardFields.find(f => f.id === fieldId);
    if (field && field.cards.length > 0) {
        const drawnCard = field.cards.shift(); // Remove the first card from the field
        console.log(`Player drew a card from ${fieldId}:`, drawnCard);
        // Here, the card's effect would be applied to the player
        return drawnCard;
    } else {
        console.log(`No cards to draw from ${fieldId}.`);
        return null;
    }
}

// Example usage:
// Simulate a player entering field-5 and drawing a card
// drawCard('field-5');
// drawCard('field-5'); // Try drawing another card from the same field
