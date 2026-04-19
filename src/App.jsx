import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import HomePage from './pokemon/Home.jsx';
import LoginPage from './pokemon/Login.jsx';
import RegisterPage from './pokemon/Register.jsx';
import GameSelection from './pokemon/GameSelection.jsx';
import GamePage from './pokemon/GamePage.jsx';
import HighScores from './pokemon/HighScores.jsx';
import Rules from './pokemon/Rules.jsx';

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/games" element={<GameSelection />} />
          <Route path="/game/:gameId" element={<GamePage />} />
          <Route path="/scores" element={<HighScores />} />
          <Route path="/rules" element={<Rules />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
