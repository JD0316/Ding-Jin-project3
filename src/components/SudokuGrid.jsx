import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext.jsx';
import './SudokuGrid.css'; // We will create this

function SudokuGrid({ board }) {
  const { selectedCell, selectCell, updateCellValue } = useGame();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedCell.row === null) return;

      const key = parseInt(e.key, 10);
      const size = board.length;

      if (key >= 1 && key <= size) {
        updateCellValue(key);
      } 
      else if (e.key === 'Backspace' || e.key === 'Delete') {
        updateCellValue(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, updateCellValue, board.length]);

  if (!board || board.length === 0) {
    return <div>Loading Grid...</div>;
  }

  const size = board.length;

  return (
    <div 
      className="sudoku-grid"
      style={{ '--grid-size': size }}
      tabIndex="0"
    >
      {board.map((row, rowIndex) => 
        row.map((cell, colIndex) => {
          const isSelected = selectedCell.row === rowIndex && selectedCell.col === colIndex;
          const cellClasses = [
            'sudoku-cell',
            !cell.isEditable ? 'sudoku-cell--locked' : '',
            isSelected ? 'sudoku-cell--selected' : '',
            cell.isError ? 'sudoku-cell--error' : '',
          ].join(' ');

          return (
            <div 
              key={`${rowIndex}-${colIndex}`} 
              className={cellClasses}
              onClick={() => selectCell(rowIndex, colIndex)}
            >
              {cell.value !== 0 ? cell.value : ''}
            </div>
          );
        })
      )}
    </div>
  );
}

export default SudokuGrid;
