import React from 'react';
import './Rules.css';

function Rules() {
  return (
    <div className="container rules-container">
      <h1>Game Rules</h1>
      <div className="rules-content">
        <h2>Objective</h2>
        <p>The objective of Sudoku is to fill a 9x9 grid with digits so that each column, each row, and each of the nine 3x3 subgrids that compose the grid contain all of the digits from 1 to 9.</p>

        <h2>How to Play</h2>
        <ol>
          <li>The puzzle starts with a partially completed grid.</li>
          <li>Your goal is to fill in the empty cells with numbers from 1 to 9.</li>
          <li>Each number must appear exactly once in each row.</li>
          <li>Each number must appear exactly once in each column.</li>
          <li>Each number must appear exactly once in each 3x3 subgrid.</li>
        </ol>

        <h2>Easy Mode</h2>
        <p>In the 6x6 version of the game, the same rules apply but with numbers from 1 to 6 and 2x3 subgrids.</p>
      </div>

      <div className="credits">
        <h2>Credits</h2>
        <p>Made by: Ding Jin</p>
        <ul>
          <li><a href="mailto:dingjin6324@gmail.com">Email</a></li>
          <li><a href="https://github.com/JD0316" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          <li><a href="https://www.linkedin.com/in/ding-jin-6498b3310/?locale=en_US" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
        </ul>
      </div>
    </div>
  );
}

export default Rules;