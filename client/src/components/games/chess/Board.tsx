import { useChessGame } from '../../../lib/stores/useChessGame';
import Piece from './Piece';
import { useAudio } from '../../../lib/stores/useAudio';

const Board = () => {
  const { 
    board, 
    selectedPiece, 
    selectPiece, 
    getValidMoves,
    currentTurn,
    lastMove
  } = useChessGame();
  
  const { playHit } = useAudio();
  
  // Get valid moves for the selected piece
  const validMoves = selectedPiece ? getValidMoves(selectedPiece) : [];
  
  // Handle click on a square
  const handleSquareClick = (row: number, col: number) => {
    selectPiece({ row, col });
    playHit();
  };
  
  // Helper to determine if a square is a valid move
  const isValidMove = (row: number, col: number) => {
    return validMoves.some(move => move.row === row && move.col === col);
  };
  
  // Helper to determine if a square is the selected piece
  const isSelectedPiece = (row: number, col: number) => {
    return selectedPiece?.row === row && selectedPiece?.col === col;
  };
  
  // Helper to determine if a square was part of the last move
  const isLastMove = (row: number, col: number) => {
    if (!lastMove) return false;
    
    return (
      (lastMove.from.row === row && lastMove.from.col === col) ||
      (lastMove.to.row === row && lastMove.to.col === col)
    );
  };
  
  return (
    <div className="relative aspect-square w-full max-w-[600px] mx-auto border-2 border-accent shadow-lg">
      {/* File labels (a-h) */}
      <div className="absolute left-0 right-0 bottom-[-24px] flex justify-around">
        {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((file) => (
          <div key={file} className="w-6 h-6 flex items-center justify-center text-sm">
            {file}
          </div>
        ))}
      </div>
      
      {/* Rank labels (1-8) */}
      <div className="absolute top-0 bottom-0 left-[-24px] flex flex-col justify-around">
        {[8, 7, 6, 5, 4, 3, 2, 1].map((rank) => (
          <div key={rank} className="w-6 h-6 flex items-center justify-center text-sm">
            {rank}
          </div>
        ))}
      </div>
      
      {/* Turn indicator */}
      <div 
        className={`absolute top-[-30px] left-0 right-0 text-center font-bold ${
          currentTurn === 'white' ? 'text-white' : 'text-black'
        }`}
        style={{ textShadow: currentTurn === 'white' ? '0 0 2px black' : '0 0 2px white' }}
      >
        {currentTurn === 'white' ? 'White' : 'Black'}'s Turn
      </div>
      
      {/* Board squares */}
      <div className="grid grid-cols-8 h-full w-full">
        {board.map((row, rowIndex) => 
          row.map((piece, colIndex) => {
            const isWhiteSquare = (rowIndex + colIndex) % 2 === 0;
            const isSelected = isSelectedPiece(rowIndex, colIndex);
            const isValid = isValidMove(rowIndex, colIndex);
            const isLastMoveSquare = isLastMove(rowIndex, colIndex);
            
            return (
              <div 
                key={`${rowIndex}-${colIndex}`}
                className={`
                  relative flex items-center justify-center
                  ${isWhiteSquare ? 'bg-amber-200' : 'bg-amber-800'} 
                  ${isSelected ? 'ring-2 ring-blue-500' : ''}
                  ${isLastMoveSquare ? 'bg-opacity-70' : ''}
                `}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              >
                {/* Valid move indicator */}
                {isValid && (
                  <div className={`absolute w-3/5 h-3/5 rounded-full 
                    ${piece ? 'ring-2 ring-red-500' : 'bg-blue-500 bg-opacity-30'}`}
                  />
                )}
                
                {/* Piece */}
                {piece && <Piece piece={piece} />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Board;
