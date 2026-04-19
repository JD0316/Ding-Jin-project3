import React, { useContext } from 'react'; // Add useContext
import { useParams } from 'react-router-dom';
import { GameProvider, useGame } from '../context/GameContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx'; // Import Context
import SudokuGrid from '../components/SudokuGrid.jsx';
import GameWonModal from '../components/GameWonModal.jsx'; 
import './GamePage.css';

// Helper to format time
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

function GameView() {
  const { game, loading, error, resetGame, timer } = useGame();
  const { currentUser } = useContext(AuthContext); // Use useContext

  if (loading) return <div className="game-loading">Loading Game...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!game) return <div>Game not found.</div>;

  return (
    <div className="container game-container">
      {game.status === 'completed' && <GameWonModal />}
      
      <div className="game-header">
        <div>
          <h1>{game.name}</h1>
          <div className={`game-difficulty ${game.difficulty.toLowerCase()}`}>{game.difficulty}</div>
        </div>
        <div className="game-status-box">
            <div className="timer">Time: {formatTime(timer)}</div>
            <div className="game-status">
                {game.status === 'completed' ? 'Status: Completed' : 'Status: In Progress'}
            </div>
        </div>
      </div>
      
      {/* Show message to logged-out users */}
      {!currentUser && (
        <div className="logged-out-warning">
          <strong>View Only Mode:</strong> You must be logged in to play.
        </div>
      )}

      {/* Grid - it's read-only if not logged in due to selectCell logic in GameContext */}
      <SudokuGrid board={game.status === 'completed' ? game.solution.map(row => row.map(val => ({ value: val, isEditable: false, isError: false }))) : game.board} />

      {/* Only show controls if logged in AND game not completed */}
      {currentUser && game.status !== 'completed' && (
        <div className="game-controls">
          <button onClick={resetGame}>Reset Board</button>
          {/* Note: New Game button is removed as per requirements */}
        </div>
      )}
    </div>
  );
}

function GamePage() {
  const { gameId } = useParams();

  return (
    <GameProvider gameId={gameId}>
      <GameView />
    </GameProvider>
  );
}

export default GamePage;