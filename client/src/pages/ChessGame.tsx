import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useChessGame } from '../lib/stores/useChessGame';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import Board from '../components/games/chess/Board';
import { useAudio } from '../lib/stores/useAudio';
import { toast } from 'sonner';

const ChessGame = () => {
  const {
    board,
    currentTurn,
    gameStatus,
    moveHistory,
    capturedPieces,
    initializeGame,
    resetGame
  } = useChessGame();
  
  const { playHit, playSuccess } = useAudio();
  
  // Load sound effects
  useEffect(() => {
    const hitSound = new Audio('/sounds/hit.mp3');
    const successSound = new Audio('/sounds/success.mp3');
    
    useAudio.setState({
      hitSound,
      successSound,
      isMuted: false
    });
    
    return () => {
      hitSound.pause();
      successSound.pause();
    };
  }, []);
  
  // Start a game if not already playing
  useEffect(() => {
    if (gameStatus === 'waiting') {
      initializeGame();
    }
  }, [gameStatus, initializeGame]);
  
  // Play sound when in check or checkmate
  useEffect(() => {
    if (gameStatus === 'check') {
      playHit();
      toast.warning(`${currentTurn === 'white' ? 'White' : 'Black'} is in check!`);
    } else if (gameStatus === 'checkmate') {
      playSuccess();
      const winner = currentTurn === 'white' ? 'Black' : 'White';
      toast.success(`Checkmate! ${winner} wins!`);
    }
  }, [gameStatus, currentTurn, playHit, playSuccess]);
  
  const handleResetGame = () => {
    if (confirm("Are you sure you want to reset the game?")) {
      resetGame();
      initializeGame();
      toast.info("Game has been reset");
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Chess Game | maths.k.com</title>
      </Helmet>
      
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Chess Game</h1>
          <p className="text-muted-foreground mb-4">
            Play a game of chess against a friend
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Board />
          </div>
          
          <div className="md:col-span-1">
            <div className="space-y-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="flex items-center justify-between">
                    <span>Game Status</span>
                    <div className={`h-3 w-3 rounded-full ${gameStatus === 'check' || gameStatus === 'checkmate' 
                      ? 'bg-red-500 animate-pulse' 
                      : 'bg-green-500'}`} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2"><span className="font-semibold">Current Turn:</span> {currentTurn === 'white' ? 'White' : 'Black'}</p>
                  <p><span className="font-semibold">Status:</span> {gameStatus.charAt(0).toUpperCase() + gameStatus.slice(1)}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle>Captured Pieces</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <p className="font-semibold">White Captured:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {capturedPieces.white.map((piece, index) => (
                          <div key={index} className="w-6 h-6 flex items-center justify-center bg-gray-200 text-black rounded">
                            {getPieceSymbol(piece.type)}
                          </div>
                        ))}
                        {capturedPieces.white.length === 0 && <span className="text-sm text-muted-foreground">None</span>}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold">Black Captured:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {capturedPieces.black.map((piece, index) => (
                          <div key={index} className="w-6 h-6 flex items-center justify-center bg-gray-800 text-white rounded">
                            {getPieceSymbol(piece.type)}
                          </div>
                        ))}
                        {capturedPieces.black.length === 0 && <span className="text-sm text-muted-foreground">None</span>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle>Move History</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[200px] overflow-y-auto">
                  {moveHistory.length > 0 ? (
                    <ol className="list-decimal list-inside space-y-1">
                      {moveHistory.map((move, index) => (
                        <li key={index} className="text-sm">
                          {index % 2 === 0 ? (
                            <span className="font-medium">{Math.floor(index/2) + 1}. {move}</span>
                          ) : (
                            <span>{move}</span>
                          )}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-sm text-muted-foreground">No moves yet</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle>Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Click on a piece to select it</li>
                    <li>Click on a valid square to move the piece</li>
                    <li>Capture enemy pieces by moving onto their square</li>
                    <li>Try to checkmate your opponent's king to win</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Button onClick={handleResetGame} variant="outline" className="w-full">
                Reset Game
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Helper function to get piece symbols
const getPieceSymbol = (type: string): string => {
  switch(type) {
    case 'pawn': return '♟';
    case 'rook': return '♜';
    case 'knight': return '♞';
    case 'bishop': return '♝';
    case 'queen': return '♛';
    case 'king': return '♚';
    default: return '';
  }
};

export default ChessGame;
