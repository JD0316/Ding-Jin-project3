import React, { useState, useContext } from 'react'; // Import useContext
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx'; // Import the context itself
import './Login.css';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext); // Use the context directly
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password || !verifyPassword) {
      setError('All fields are required.');
      return;
    }
    if (password !== verifyPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await register(username, password);
      navigate('/games');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration.');
    }
  };

  return (
    <div className="form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Register</h1>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="verify-password">Verify Password</label>
          <input
            type="password"
            id="verify-password"
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={!username || !password || !verifyPassword}>
          Register
        </button>
        <p className="form-footer">
          Already have an account? <Link to="/login">Login here</Link>.
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
