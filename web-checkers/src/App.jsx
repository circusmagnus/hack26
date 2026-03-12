import {
  useState
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

  const switchTurn = () => {
    setTurn((prevTurn) => (prevTurn === 'human' ? 'computer' : 'human'));
  };

  // Placeholder for a move function that would call switchTurn after a valid move
  const handleMove = (startPos, endPos) => {
    // In a real game, this would involve validating the move, updating the board, etc.
    console.log(`Move from ${startPos} to ${endPos}`);
    switchTurn();
  };

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
