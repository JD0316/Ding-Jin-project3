import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext.jsx';
import '../pokemon/GamePage.css'; // Reusing styles from GamePage.css

function GameWonModal() {
  const { game } = useGame();
  const navigate = useNavigate();

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Congratulations!</h2>
        <p>You have successfully completed this {game.difficulty.toLowerCase()} Sudoku puzzle.</p>
        <button onClick={() => navigate('/games')} style={{backgroundColor: '#3498db'}}>
          Return to Game Selection
        </button>
      </div>
    </div>
  );
}

export default GameWonModal;