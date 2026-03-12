
const gameBoard = document.getElementById('game-board');
const board = [];

// Piece types for better representation
const PIECE_TYPE = {
    EMPTY: 0,
    RED: 1,
    GREEN: 2,
    RED_KING: 3,
    GREEN_KING: 4
};

function createBoard() {
    for (let i = 0; i < 8; i++) {
        board[i] = [];
        for (let j = 0; j < 8; j++) {
            const square = document.createElement('div');
            square.classList.add('square');
            
            const isLight = (i + j) % 2 === 0;
            if (isLight) {
                square.classList.add('light');
            } else {
                square.classList.add('dark');
            }
            
            let pieceType = PIECE_TYPE.EMPTY;
            // Place pieces
            if (!isLight) { // Pieces only on dark squares
                if (i < 3) {
                    const piece = document.createElement('div');
                    piece.classList.add('piece', 'green-piece'); // Computer pieces
                    square.appendChild(piece);
                    pieceType = PIECE_TYPE.GREEN;
                } else if (i > 4) {
                    const piece = document.createElement('div');
                    piece.classList.add('piece', 'red-piece'); // Human pieces
                    square.appendChild(piece);
                    pieceType = PIECE_TYPE.RED;
                }
            }
            
            gameBoard.appendChild(square);
            board[i][j] = { 
                element: square, 
                piece: pieceType, 
                // Store a reference to the DOM piece element for easier manipulation
                pieceElement: square.querySelector('.piece') 
            }; 
        }
    }
}

// Very basic placeholder for computer AI - will be improved in future tasks
function computerMove() {
    console.log("Computer's turn to move...");
    let greenPieces = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c].piece === PIECE_TYPE.GREEN) {
                greenPieces.push({ r, c });
            }
        }
    }

    if (greenPieces.length === 0) {
        console.log("No green pieces left. Computer cannot move.");
        return;
    }

    // For now, let's just try to move a random green piece to an adjacent empty dark square
    // This is a dummy move, not checking actual checkers rules
    let moved = false;
    while (!moved && greenPieces.length > 0) {
        const randomIndex = Math.floor(Math.random() * greenPieces.length);
        const { r, c } = greenPieces[randomIndex];
        
        // Potential moves (diagonal forward for green pieces)
        const possibleMoves = [
            { dr: 1, dc: -1 }, // Down-left
            { dr: 1, dc: 1 }   // Down-right
        ];

        // Shuffle possible moves to try different directions
        possibleMoves.sort(() => Math.random() - 0.5);

        for (const move of possibleMoves) {
            const newR = r + move.dr;
            const newC = c + move.dc;

            // Check bounds and if the target square is empty and dark
            if (newR >= 0 && newR < 8 && newC >= 0 && newC < 8 && 
                board[newR][newC].piece === PIECE_TYPE.EMPTY &&
                (newR + newC) % 2 !== 0) { // Ensure it's a dark square
                
                // Perform the move (visual and logical)
                const oldPieceElement = board[r][c].pieceElement;
                if (oldPieceElement) {
                    board[newR][newC].element.appendChild(oldPieceElement);
                    board[newR][newC].piece = PIECE_TYPE.GREEN;
                    board[newR][newC].pieceElement = oldPieceElement;
                    
                    board[r][c].piece = PIECE_TYPE.EMPTY;
                    board[r][c].pieceElement = null;
                    moved = true;
                    console.log(`Computer moved piece from (${r},${c}) to (${newR},${newC})`);
                    break; 
                }
            }
        }
        
        if (!moved) {
            // Remove the piece from consideration if it couldn't move
            greenPieces.splice(randomIndex, 1);
        }
    }

    if (!moved) {
        console.log("Computer tried all green pieces but couldn't find a valid random move.");
    }
}

createBoard();

// For demonstration, let's make the computer move after a short delay
// In a real game, this would be triggered by turn management
setTimeout(computerMove, 2000); 
