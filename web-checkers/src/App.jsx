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

  return (
    <>
      <div id="checkerboard" className="checkerboard">
        {board.map((square, index) => (
          <div
            key={index}
            className={`square ${square.color}`}
          >
            {/* Pieces will be rendered here later */}
          </div>
        ))}
      </div>
    </>
  )
}

export default App
