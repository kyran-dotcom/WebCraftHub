import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getLocalStorage, setLocalStorage } from '../utils';

// Define piece types
type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
type PieceColor = 'white' | 'black';

// Define the chess piece
interface ChessPiece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}

// Define board position
interface Position {
  row: number;
  col: number;
}

// Define game state
type GameStatus = 'waiting' | 'playing' | 'check' | 'checkmate' | 'stalemate' | 'draw';

interface ChessGameState {
  board: (ChessPiece | null)[][];
  currentTurn: PieceColor;
  selectedPiece: Position | null;
  gameStatus: GameStatus;
  moveHistory: string[];
  capturedPieces: { white: ChessPiece[], black: ChessPiece[] };
  lastMove: { from: Position, to: Position } | null;

  // Game actions
  initializeGame: () => void;
  selectPiece: (position: Position) => void;
  movePiece: (from: Position, to: Position) => boolean;
  getValidMoves: (position: Position) => Position[];
  isInCheck: (color: PieceColor) => boolean;
  resetGame: () => void;
}

const initialBoard = (): (ChessPiece | null)[][] => {
  // Create an 8x8 empty board
  const board: (ChessPiece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));

  // Set up pawns
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: 'pawn', color: 'black' };
    board[6][col] = { type: 'pawn', color: 'white' };
  }

  // Set up rooks
  board[0][0] = { type: 'rook', color: 'black' };
  board[0][7] = { type: 'rook', color: 'black' };
  board[7][0] = { type: 'rook', color: 'white' };
  board[7][7] = { type: 'rook', color: 'white' };

  // Set up knights
  board[0][1] = { type: 'knight', color: 'black' };
  board[0][6] = { type: 'knight', color: 'black' };
  board[7][1] = { type: 'knight', color: 'white' };
  board[7][6] = { type: 'knight', color: 'white' };

  // Set up bishops
  board[0][2] = { type: 'bishop', color: 'black' };
  board[0][5] = { type: 'bishop', color: 'black' };
  board[7][2] = { type: 'bishop', color: 'white' };
  board[7][5] = { type: 'bishop', color: 'white' };

  // Set up queens
  board[0][3] = { type: 'queen', color: 'black' };
  board[7][3] = { type: 'queen', color: 'white' };

  // Set up kings
  board[0][4] = { type: 'king', color: 'black' };
  board[7][4] = { type: 'king', color: 'white' };

  return board;
};

// Helper to convert position to chess notation
const toChessNotation = (position: Position): string => {
  const file = String.fromCharCode(97 + position.col); // 'a' to 'h'
  const rank = 8 - position.row; // 1 to 8
  return `${file}${rank}`;
};

// Create the store
export const useChessGame = create<ChessGameState>()(
  persist(
    (set, get) => ({
      board: initialBoard(),
      currentTurn: 'white',
      selectedPiece: null,
      gameStatus: 'waiting',
      moveHistory: [],
      capturedPieces: { white: [], black: [] },
      lastMove: null,

      initializeGame: () => {
        set({
          board: initialBoard(),
          currentTurn: 'white',
          selectedPiece: null,
          gameStatus: 'playing',
          moveHistory: [],
          capturedPieces: { white: [], black: [] },
          lastMove: null
        });
      },

      selectPiece: (position: Position) => {
        const { board, currentTurn, selectedPiece } = get();
        const piece = board[position.row][position.col];

        // If no piece is currently selected
        if (!selectedPiece) {
          // Only allow selecting pieces of current turn's color
          if (piece && piece.color === currentTurn) {
            set({ selectedPiece: position });
          }
        } else {
          // If a piece is already selected
          const selectedPos = selectedPiece;
          const selectedPieceObj = board[selectedPos.row][selectedPos.col];

          // If clicking on a piece of the same color, select it instead
          if (piece && piece.color === currentTurn) {
            set({ selectedPiece: position });
          } else {
            // Try to move the selected piece to the new position
            const success = get().movePiece(selectedPos, position);
            if (success) {
              set({ selectedPiece: null });
            } else {
              // Invalid move, unselect
              set({ selectedPiece: null });
            }
          }
        }
      },

      movePiece: (from: Position, to: Position) => {
        const { board, currentTurn, getValidMoves } = get();
        const piece = board[from.row][from.col];

        if (!piece || piece.color !== currentTurn) {
          return false;
        }

        // Check if the move is valid
        const validMoves = getValidMoves(from);
        const isValidMove = validMoves.some(move => move.row === to.row && move.col === to.col);

        if (!isValidMove) {
          return false;
        }

        // Create a new board with the move applied
        const newBoard = board.map(row => [...row]);
        
        // Check if there's a piece at the destination (capture)
        const capturedPiece = newBoard[to.row][to.col];
        
        // Update the captured pieces array if a piece was captured
        let newCapturedPieces = { ...get().capturedPieces };
        if (capturedPiece) {
          if (capturedPiece.color === 'white') {
            newCapturedPieces.white = [...newCapturedPieces.white, capturedPiece];
          } else {
            newCapturedPieces.black = [...newCapturedPieces.black, capturedPiece];
          }
        }

        // Move the piece
        newBoard[to.row][to.col] = { ...piece, hasMoved: true };
        newBoard[from.row][from.col] = null;

        // Update move history
        const moveNotation = `${piece.type.charAt(0).toUpperCase()}${toChessNotation(from)}-${toChessNotation(to)}`;
        const newMoveHistory = [...get().moveHistory, moveNotation];

        // Change turn
        const nextTurn = currentTurn === 'white' ? 'black' : 'white';

        // Update state
        set({
          board: newBoard,
          currentTurn: nextTurn,
          lastMove: { from, to },
          moveHistory: newMoveHistory,
          capturedPieces: newCapturedPieces
        });

        // Check if the next player is in check or checkmate
        if (get().isInCheck(nextTurn)) {
          // Check if it's checkmate
          let isCheckmate = true;
          
          // Simplified checkmate check:
          // For each piece of the next player, if any piece has valid moves, it's not checkmate
          for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
              const piece = newBoard[row][col];
              if (piece && piece.color === nextTurn) {
                const moves = get().getValidMoves({ row, col });
                if (moves.length > 0) {
                  isCheckmate = false;
                  break;
                }
              }
            }
            if (!isCheckmate) break;
          }

          if (isCheckmate) {
            set({ gameStatus: 'checkmate' });
          } else {
            set({ gameStatus: 'check' });
          }
        } else {
          set({ gameStatus: 'playing' });
        }

        return true;
      },

      getValidMoves: (position: Position) => {
        const { board, currentTurn } = get();
        const piece = board[position.row][position.col];
        
        if (!piece || piece.color !== currentTurn) {
          return [];
        }

        const validMoves: Position[] = [];
        
        // Get potential moves based on piece type
        switch (piece.type) {
          case 'pawn':
            // Pawns move differently based on color
            const direction = piece.color === 'white' ? -1 : 1;
            const startRow = piece.color === 'white' ? 6 : 1;
            
            // Move forward one square
            if (
              position.row + direction >= 0 && 
              position.row + direction < 8 &&
              !board[position.row + direction][position.col]
            ) {
              validMoves.push({ row: position.row + direction, col: position.col });
              
              // Move forward two squares from starting position
              if (
                position.row === startRow && 
                !board[position.row + 2 * direction][position.col]
              ) {
                validMoves.push({ row: position.row + 2 * direction, col: position.col });
              }
            }
            
            // Capture diagonally
            for (const dc of [-1, 1]) {
              if (
                position.row + direction >= 0 && 
                position.row + direction < 8 &&
                position.col + dc >= 0 &&
                position.col + dc < 8
              ) {
                const targetPiece = board[position.row + direction][position.col + dc];
                if (targetPiece && targetPiece.color !== piece.color) {
                  validMoves.push({ row: position.row + direction, col: position.col + dc });
                }
              }
            }
            break;

          case 'rook':
            // Rooks move horizontally and vertically
            // Check all four directions
            const rookDirections = [
              { dr: -1, dc: 0 }, // up
              { dr: 1, dc: 0 },  // down
              { dr: 0, dc: -1 }, // left
              { dr: 0, dc: 1 }   // right
            ];
            
            for (const { dr, dc } of rookDirections) {
              let r = position.row + dr;
              let c = position.col + dc;
              
              while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                const targetPiece = board[r][c];
                
                if (!targetPiece) {
                  // Empty square, can move here
                  validMoves.push({ row: r, col: c });
                } else if (targetPiece.color !== piece.color) {
                  // Enemy piece, can capture and then stop
                  validMoves.push({ row: r, col: c });
                  break;
                } else {
                  // Friendly piece, can't move here
                  break;
                }
                
                r += dr;
                c += dc;
              }
            }
            break;

          case 'knight':
            // Knights move in an L shape
            const knightMoves = [
              { dr: -2, dc: -1 }, { dr: -2, dc: 1 },
              { dr: -1, dc: -2 }, { dr: -1, dc: 2 },
              { dr: 1, dc: -2 }, { dr: 1, dc: 2 },
              { dr: 2, dc: -1 }, { dr: 2, dc: 1 }
            ];
            
            for (const { dr, dc } of knightMoves) {
              const r = position.row + dr;
              const c = position.col + dc;
              
              if (r >= 0 && r < 8 && c >= 0 && c < 8) {
                const targetPiece = board[r][c];
                
                if (!targetPiece || targetPiece.color !== piece.color) {
                  validMoves.push({ row: r, col: c });
                }
              }
            }
            break;

          case 'bishop':
            // Bishops move diagonally
            const bishopDirections = [
              { dr: -1, dc: -1 }, // up-left
              { dr: -1, dc: 1 },  // up-right
              { dr: 1, dc: -1 },  // down-left
              { dr: 1, dc: 1 }    // down-right
            ];
            
            for (const { dr, dc } of bishopDirections) {
              let r = position.row + dr;
              let c = position.col + dc;
              
              while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                const targetPiece = board[r][c];
                
                if (!targetPiece) {
                  validMoves.push({ row: r, col: c });
                } else if (targetPiece.color !== piece.color) {
                  validMoves.push({ row: r, col: c });
                  break;
                } else {
                  break;
                }
                
                r += dr;
                c += dc;
              }
            }
            break;

          case 'queen':
            // Queens move like rooks and bishops combined
            const queenDirections = [
              { dr: -1, dc: 0 }, { dr: 1, dc: 0 }, { dr: 0, dc: -1 }, { dr: 0, dc: 1 }, // rook moves
              { dr: -1, dc: -1 }, { dr: -1, dc: 1 }, { dr: 1, dc: -1 }, { dr: 1, dc: 1 } // bishop moves
            ];
            
            for (const { dr, dc } of queenDirections) {
              let r = position.row + dr;
              let c = position.col + dc;
              
              while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                const targetPiece = board[r][c];
                
                if (!targetPiece) {
                  validMoves.push({ row: r, col: c });
                } else if (targetPiece.color !== piece.color) {
                  validMoves.push({ row: r, col: c });
                  break;
                } else {
                  break;
                }
                
                r += dr;
                c += dc;
              }
            }
            break;

          case 'king':
            // Kings move one square in any direction
            const kingMoves = [
              { dr: -1, dc: -1 }, { dr: -1, dc: 0 }, { dr: -1, dc: 1 },
              { dr: 0, dc: -1 }, { dr: 0, dc: 1 },
              { dr: 1, dc: -1 }, { dr: 1, dc: 0 }, { dr: 1, dc: 1 }
            ];
            
            for (const { dr, dc } of kingMoves) {
              const r = position.row + dr;
              const c = position.col + dc;
              
              if (r >= 0 && r < 8 && c >= 0 && c < 8) {
                const targetPiece = board[r][c];
                
                if (!targetPiece || targetPiece.color !== piece.color) {
                  validMoves.push({ row: r, col: c });
                }
              }
            }
            break;
        }
        
        return validMoves;
      },

      isInCheck: (color: PieceColor) => {
        const { board } = get();
        
        // Find the king
        let kingPosition: Position | null = null;
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.type === 'king' && piece.color === color) {
              kingPosition = { row, col };
              break;
            }
          }
          if (kingPosition) break;
        }
        
        if (!kingPosition) return false; // Shouldn't happen in a valid game
        
        // Check if any enemy piece can attack the king
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.color !== color) {
              // Temporarily set current turn to the opponent to check their moves
              const originalTurn = get().currentTurn;
              set({ currentTurn: piece.color });
              
              const moves = get().getValidMoves({ row, col });
              
              // Restore original turn
              set({ currentTurn: originalTurn });
              
              // Check if any move can attack the king
              if (moves.some(move => move.row === kingPosition?.row && move.col === kingPosition?.col)) {
                return true;
              }
            }
          }
        }
        
        return false;
      },

      resetGame: () => {
        set({
          board: initialBoard(),
          currentTurn: 'white',
          selectedPiece: null,
          gameStatus: 'waiting',
          moveHistory: [],
          capturedPieces: { white: [], black: [] },
          lastMove: null
        });
      }
    }),
    {
      name: 'chess-game',
      storage: {
        getItem: getLocalStorage,
        setItem: setLocalStorage,
      },
    }
  )
);
