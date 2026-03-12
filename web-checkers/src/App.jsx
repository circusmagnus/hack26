import {
  useState
} from 'react'
import './App.css'

function App() {
  const [board, setBoard] = useState(() => {
    const initialBoard = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        initialBoard.push({
          row: i,
          col: j,
          color: (i + j) % 2 === 0 ? 'white' : 'black',
          piece: null,
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
      <h1>Current Turn: {turn.toUpperCase()}</h1>
      <div id="checkerboard" className="checkerboard">
        {board.map((square, index) => (
          <div
            key={index}
            className={`square ${square.color}`}
            // onClick={() => handleMove(index, 'some_other_index')} // Placeholder for now
          >
            {/* Pieces will be rendered here later */}
          </div>
        ))}
      </div>
    </>
  )
}

export default App
