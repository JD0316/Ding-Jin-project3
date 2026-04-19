import React, { createContext, useState, useContext, useCallback, useEffect, useRef } from 'react';
import api from '../api.js';
import { AuthContext } from './AuthContext.jsx'; // Import the context itself

const GameContext = createContext();

export const useGame = () => {
  return useContext(GameContext);
};

// --- FINAL, BRUTE-FORCE, BUT CORRECT CONFLICT DETECTION ---
const findConflicts = (board) => {
  const conflicts = new Set();
  const size = board.length;
  if (size === 0) return conflicts;

  const subgridRows = size === 9 ? 3 : 2;
  const subgridCols = size === 9 ? 3 : 3;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const val = board[r][c].value;
      if (val === 0) continue;

      // Check row for conflicts
      for (let i = 0; i < size; i++) {
        if (i !== c && board[r][i].value === val) {
          conflicts.add(`${r}-${c}`);
          conflicts.add(`${r}-${i}`);
        }
      }

      // Check column for conflicts
      for (let i = 0; i < size; i++) {
        if (i !== r && board[i][c].value === val) {
          conflicts.add(`${r}-${c}`);
          conflicts.add(`${i}-${c}`);
        }
      }

      // Check subgrid for conflicts
      const startRow = Math.floor(r / subgridRows) * subgridRows;
      const startCol = Math.floor(c / subgridCols) * subgridCols;
      for (let i = startRow; i < startRow + subgridRows; i++) {
        for (let j = startCol; j < startCol + subgridCols; j++) {
          if (i === r && j === c) continue; // Skip self
          if (board[i][j].value === val) {
            conflicts.add(`${r}-${c}`);
            conflicts.add(`${i}-${j}`);
          }
        }
      }
    }
  }
  return conflicts;
};


export const GameProvider = ({ gameId, children }) => {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const { currentUser } = useContext(AuthContext); // Use useContext

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/sudoku/${gameId}`);
        setGame(response.data);
        if (response.data.status === 'completed') {
             setTimer(response.data.timeTaken || 0);
        } else {
             setTimer(0); // Start from 0 for in-progress games, since backend doesn't store intermediate time for now
        }
      } catch (err) {
        setError('Failed to load game.');
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [gameId]);

  useEffect(() => {
    if (game && game.status === 'in-progress') {
      timerRef.current = setInterval(() => setTimer(prev => prev + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [game?.status]);

  const updateCellValue = async (value) => {
    if (!currentUser || selectedCell.row === null || game.status === 'completed') return;
    
    const newBoard = game.board.map(row => row.map(cell => ({ ...cell })));
    const { row, col } = selectedCell;
    newBoard[row][col].value = value;

    const conflicts = findConflicts(newBoard);
    let isBoardFull = true;
    for (let r = 0; r < newBoard.length; r++) {
      for (let c = 0; c < newBoard.length; c++) {
        newBoard[r][c].isError = conflicts.has(`${r}-${c}`);
        if (newBoard[r][c].value === 0) isBoardFull = false;
      }
    }

    const isGameWon = isBoardFull && conflicts.size === 0;
    
    setGame(prevGame => ({ ...prevGame, board: newBoard, status: isGameWon ? 'completed' : 'in-progress' }));

    try {
      await api.put(`/sudoku/${gameId}`, { board: newBoard, timeTaken: isGameWon ? timer : 0 });
      if (isGameWon) {
        await api.post(`/highscore`); 
      }
    } catch (err) {
      console.error("Failed to save game state or highscore", err);
    }
  };

  const selectCell = (row, col) => {
    if (currentUser && game?.board[row]?.[col]?.isEditable && game.status !== 'completed') {
      setSelectedCell({ row, col });
    }
  };

  const resetGame = async () => {
     if (!currentUser || game.status === 'completed') return;
     try {
         const resetBoard = JSON.parse(JSON.stringify(game.initialBoard));
         setGame(prev => ({...prev, board: resetBoard}));
         setSelectedCell({ row: null, col: null });
         setTimer(0);
         await api.put(`/sudoku/${gameId}`, { board: resetBoard, timeTaken: 0 });
     } catch (err) {
         console.error("Failed to reset game", err);
     }
  };

  const value = {
    game,
    loading,
    error,
    selectedCell,
    timer,
    selectCell,
    updateCellValue,
    resetGame
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
