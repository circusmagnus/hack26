import {
  useState,
  useEffect,
  useCallback
} from 'react'
import './App.css'

function Piece({
  player,
  isSelected
}) {
  return <div className={`piece ${player} ${isSelected ? 'selected' : ''}`}></div>;
}

function App() {
  const [board, setBoard] = useState(() => {
    const initialBoard = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const color = (i + j) % 2 === 0 ? 'white' : 'black';
        let piece = null;

        if (color === 'black') {
          if (i < 3) {
            piece = {
              player: 'red',
              isKing: false
            };
          } else if (i > 4) {
            piece = {
              player: 'black',
              isKing: false
            };
          }
        }

        initialBoard.push({
          row: i,
          col: j,
          color: color,
          piece: piece,
        });
      }
    }
    return initialBoard;
  });

  const [turn, setTurn] = useState('human'); // 'human' or 'computer'
  const [selectedPieceIndex, setSelectedPieceIndex] = useState(null); // New state for selected piece

  const switchTurn = useCallback(() => {
    setTurn((prevTurn) => (prevTurn === 'human' ? 'computer' : 'human'));
  }, []);

  const isValidMove = useCallback((fromIndex, toIndex) => {
    const fromSquare = board[fromIndex];
    const toSquare = board[toIndex];

    if (!fromSquare.piece || toSquare.piece) return false; // Must select a piece and move to an empty square
    if (toSquare.color === 'white') return false; // Must move to a black square
\n    const rowDiff = Math.abs(board[toIndex].row - board[fromIndex].row);
    const colDiff = Math.abs(board[toIndex].col - board[fromIndex].col);

    if (rowDiff === 1 && colDiff === 1) {
      // Basic diagonal move
      return true;
    }

    return false; // No capture logic for now
  }, [board]);

  const handleMove = useCallback((fromIndex, toIndex) => {
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard];
      const pieceToMove = newBoard[fromIndex].piece;
      if (pieceToMove) {
        newBoard[fromIndex].piece = null;
        newBoard[toIndex].piece = pieceToMove;
      }
      return newBoard;
    });
  }, []);

  const handleSquareClick = useCallback((index) => {
    if (turn !== 'human') return; // Only human can click

    const clickedSquare = board[index];

    if (selectedPieceIndex !== null) {
      // A piece is already selected
      if (selectedPieceIndex === index) {
        // Clicked the same piece, deselect it
        setSelectedPieceIndex(null);
      } else if (isValidMove(selectedPieceIndex, index)) {
        // Clicked an empty valid square, move the piece
        handleMove(selectedPieceIndex, index);
        setSelectedPieceIndex(null);
        switchTurn(); // Switch turn after a valid move
      } else {
        // Invalid move, deselect
        setSelectedPieceIndex(null);
      }
    } else {
      // No piece is selected
      if (clickedSquare.piece && clickedSquare.piece.player === 'red') {
        // Select human player's piece
        setSelectedPieceIndex(index);
      }
    }
  }, [board, selectedPieceIndex, isValidMove, handleMove, switchTurn, turn]);

  const findValidComputerMoves = useCallback(() => {
    const computerMoves = [];
    board.forEach((square, index) => {
      if (square.piece && square.piece.player === 'black') {
        const currentRow = square.row;
        const currentCol = square.col;

        // Possible diagonal moves for 'black' pieces (moving upwards)
        const possibleMoves = [
          {
            row: currentRow - 1,
            col: currentCol - 1
          },
          {
            row: currentRow - 1,
            col: currentCol + 1
          },
        ];

        possibleMoves.forEach((move) => {
          const targetIndex = board.findIndex(
            (s) => s.row === move.row && s.col === move.col
          );

          if (
            targetIndex !== -1 &&
            board[targetIndex].color === 'black' && // Can only move to black squares
            !board[targetIndex].piece // Target square must be empty
          ) {
            computerMoves.push({
              from: index,
              to: targetIndex
            });
          }
        });
      }
    });
    return computerMoves;
  }, [board]);

  const makeComputerMove = useCallback(() => {
    const availableMoves = findValidComputerMoves();

    if (availableMoves.length > 0) {
      const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      handleMove(randomMove.from, randomMove.to);
    } else {
      console.log("Computer has no valid moves.");
      // In a real game, this would handle game over or more complex AI.
    }

    setTimeout(() => {
      switchTurn();
    }, 1000); // Simulate thinking time
  }, [findValidComputerMoves, handleMove, switchTurn]);

  useEffect(() => {
    if (turn === 'computer') {
      makeComputerMove();
    }
  }, [turn, makeComputerMove]);

  return (
    <>
      <h1>Checkers Game - Current Turn: {turn.toUpperCase()}</h1>
      <div id="checkerboard" className="checkerboard">
        {board.map((square, index) => (
          <div
            key={index}
            className={`square ${square.color}`}
            onClick={() => handleSquareClick(index)} // Add onClick handler
          >
            {square.piece && (
              <Piece player={square.piece.player} isSelected={selectedPieceIndex === index} />
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default App