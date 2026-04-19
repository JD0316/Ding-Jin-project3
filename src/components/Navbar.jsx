import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import './Navbar.css';

function Navbar() {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-logo">Sudoku Master</NavLink>
      <ul className="nav-links">
        <li><NavLink to="/rules">Rules</NavLink></li>
        <li><NavLink to="/scores">High Scores</NavLink></li>
        <li><NavLink to="/games">Play</NavLink></li>
        {currentUser ? (
          <>
            <li className="nav-user">Welcome, {currentUser.username}!</li>
            <li><button onClick={handleLogout} className="nav-logout-btn">Logout</button></li>
          </>
        ) : (
          <>
            <li><NavLink to="/login">Login</NavLink></li>
            <li><NavLink to="/register">Register</NavLink></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;