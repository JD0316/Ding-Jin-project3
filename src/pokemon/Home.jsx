import React, { useContext } from 'react'; // Import useContext
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx'; // Import the context itself

function HomePage() {
  const { currentUser } = useContext(AuthContext); // Use the context directly

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to Sudoku Master</h1>
      <p>The ultimate full-stack Sudoku experience.</p>
      <br />
      {currentUser ? (
        <Link to="/games" style={buttonStyle}>Go to Games</Link>
      ) : (
        <Link to="/login" style={buttonStyle}>Login to Play</Link>
      )}
    </div>
  );
}

const buttonStyle = {
  display: 'inline-block',
  padding: '10px 20px',
  backgroundColor: '#3498db',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '5px',
  fontSize: '1.2rem',
};

export default HomePage;
