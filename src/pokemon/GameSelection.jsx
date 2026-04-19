import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js'; // Import the configured axios instance
import './GameSelection.css';

function GameSelection() {
  const [games, setGames] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await api.get('/sudoku');
        setGames(response.data);
      } catch (err) {
        setError('Failed to fetch games. Please try again later.');
        console.error(err);
      }
    };
    fetchGames();
  }, []);

  const handleCreateGame = async (difficulty) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/sudoku', { difficulty });
      const { gameId } = response.data;
      navigate(`/game/${gameId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create game.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="selection-container">
      <h1>Select a Game</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="create-game-buttons">
        <button onClick={() => handleCreateGame('NORMAL')} disabled={loading}>
          {loading ? 'Creating...' : 'Create Normal Game'}
        </button>
        <button onClick={() => handleCreateGame('EASY')} disabled={loading}>
          {loading ? 'Creating...' : 'Create Easy Game'}
        </button>
      </div>
      <div className="game-list-container">
        <h2>Or Join an Existing Game</h2>
        <ul className="game-list">
          {games.length > 0 ? (
            games.map((game) => (
              <li key={game.id} onClick={() => navigate(`/game/${game.id}`)}>
                <div className="game-info">
                  <span className="game-name">{game.name}</span>
                  <span className={`game-difficulty ${game.difficulty.toLowerCase()}`}>{game.difficulty}</span>
                </div>
                <div className="game-meta">
                  <span>Created by: {game.creator}</span>
                  <span>{formatDate(game.createdAt)}</span>
                </div>
              </li>
            ))
          ) : (
            <p>No games available. Create one!</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default GameSelection;
