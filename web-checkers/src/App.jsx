import {
  useState,
  useEffect,
  useCallback
} from 'react'
import './App.css'

function Piece({
  player
}) {
  return <div className={`piece ${player}`}></div>;
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

  const switchTurn = useCallback(() => {
    setTurn((prevTurn) => (prevTurn === 'human' ? 'computer' : 'human'));
  }, []);

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
            // onClick={() => handleMove(index, 'some_other_index')} // Placeholder for now
          >
            {square.piece && <Piece player={square.piece.player} />}
          </div>
        ))}
      </div>
    </>
  )
}

export default App
