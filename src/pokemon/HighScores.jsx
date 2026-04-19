import React, { useState, useEffect } from 'react';
import api from '../api.js';
import './HighScores.css';

function HighScores() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await api.get('/highscore');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch highscores. Please try again later.');
        console.error(err);
      }
    };
    fetchScores();
  }, []);

  return (
    <div className="container scores-container">
      <h1>High Scores</h1>
      {error && <p className="error-message">{error}</p>}
      <table className="scores-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Puzzles Completed</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.gamesWon}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No high scores recorded yet!</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default HighScores;