import express from 'express';
import sudoku from 'sudoku-gen';
import Game from '../models/Game.js';
import User from '../models/User.js'; // Import User model for DELETE logic
import { words } from '../utils/wordlist.js';

const router = express.Router();

// ... (other routes remain the same) ...

// POST /api/sudoku - Create a new game
router.post('/', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'You must be logged in to create a game.' });
  }
  const { difficulty } = req.body;
  if (difficulty !== 'EASY' && difficulty !== 'NORMAL') {
    return res.status(400).json({ message: 'Invalid difficulty specified.' });
  }
  try {
    let formattedBoard, solutionBoard;
    if (difficulty === 'EASY') {
      const result = generate6x6();
      formattedBoard = result.formattedBoard;
      solutionBoard = result.solutionBoard;
    } else {
      const rawBoard = sudoku.getSudoku('medium');
      const puzzle = rawBoard.puzzle.split('');
      const solutionRaw = rawBoard.solution.split('');
      formattedBoard = [];
      solutionBoard = [];
      for (let i = 0; i < 9; i++) {
        const row = [], solutionRow = [];
        for (let j = 0; j < 9; j++) {
          const index = i * 9 + j;
          let value = puzzle[index] === '-' ? 0 : parseInt(puzzle[index], 10);
          row.push({ value, isEditable: value === 0, isError: false });
          solutionRow.push(parseInt(solutionRaw[index], 10));
        }
        formattedBoard.push(row);
        solutionBoard.push(solutionRow);
      }
    }
    const newGame = new Game({
      name: generateUniqueName(),
      difficulty,
      board: formattedBoard,
      initialBoard: JSON.parse(JSON.stringify(formattedBoard)),
      solution: solutionBoard,
      creator: req.session.user.id,
    });
    await newGame.save();
    res.status(201).json({ message: 'Game created successfully', gameId: newGame._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating game.' });
  }
});

// GET /api/sudoku - Get list of all games
router.get('/', async (req, res) => {
  try {
    const games = await Game.find({}).populate('creator', 'username').sort({ createdAt: -1 });
    const gameList = games.map(game => ({
      id: game._id,
      name: game.name,
      difficulty: game.difficulty,
      creator: game.creator ? game.creator.username : 'Unknown',
      createdAt: game.createdAt,
    }));
    res.status(200).json(gameList);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching games.' });
  }
});

// GET /api/sudoku/:gameId - Get a specific game
router.get('/:gameId', async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId);
    if (!game) return res.status(404).json({ message: 'Game not found.' });
    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching game.' });
  }
});

// PUT /api/sudoku/:gameId - Update a game board
router.put('/:gameId', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'You must be logged in to play.' });
  try {
    const { board, timeTaken } = req.body;
    const game = await Game.findById(req.params.gameId);
    if (!game) return res.status(404).json({ message: 'Game not found.' });
    
    const wasCompleted = game.status === 'completed';
    game.board = board;
    const isNowCompleted = timeTaken > 0; // Assuming timeTaken is only sent on completion
    
    if (!wasCompleted && isNowCompleted) {
      game.status = 'completed';
      game.timeTaken = timeTaken;
      // Increment winner's score
      await User.findByIdAndUpdate(game.creator, { $inc: { gamesWon: 1 } });
    }
    
    await game.save();
    res.status(200).json({ message: 'Game updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating game.' });
  }
});

// DELETE /api/sudoku/:gameId - Delete a game
router.delete('/:gameId', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'You must be logged in.' });
    }
    try {
        const game = await Game.findById(req.params.gameId);
        if (!game) {
            return res.status(404).json({ message: 'Game not found.' });
        }
        // Optional: Check if the user is the creator
        if (game.creator.toString() !== req.session.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this game.' });
        }
        
        // If the game was completed, decrement the user's win count
        if (game.status === 'completed') {
            await User.findByIdAndUpdate(game.creator, { $inc: { gamesWon: -1 } });
        }

        await Game.findByIdAndDelete(req.params.gameId);
        
        res.status(200).json({ message: 'Game deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting game.' });
    }
});


// Helper functions for 6x6 generation
const generate6x6 = () => {
  let base = [[1,2,3,4,5,6],[4,5,6,1,2,3],[2,3,1,5,6,4],[5,6,4,2,3,1],[3,1,2,6,4,5],[6,4,5,3,1,2]];
  const nums = [1,2,3,4,5,6].sort(() => Math.random() - 0.5);
  const map = {1:nums[0],2:nums[1],3:nums[2],4:nums[3],5:nums[4],6:nums[5]};
  let board = base.map(row => row.map(val => map[val]));
  for(let band=0;band<3;band++){if(Math.random()>0.5){[board[band*2],board[band*2+1]]=[board[band*2+1],board[band*2]]}}
  for(let band=0;band<2;band++){const cols=[band*3,band*3+1,band*3+2].sort(()=>Math.random()-0.5);const old=board.map(r=>[...r]);for(let r=0;r<6;r++){board[r][band*3]=old[r][cols[0]];board[r][band*3+1]=old[r][cols[1]];board[r][band*3+2]=old[r][cols[2]]}}
  const solutionBoard=board.map(r=>[...r]);let removed=0;const formattedBoard=board.map(r=>r.map(v=>({value:v,isEditable:false,isError:false})));
  while(removed<18){const r=Math.floor(Math.random()*6),c=Math.floor(Math.random()*6);if(formattedBoard[r][c].value!==0){formattedBoard[r][c].value=0;formattedBoard[r][c].isEditable=true;removed++}}
  return {formattedBoard,solutionBoard};
};

function generateUniqueName() {
  const adj1 = words[Math.floor(Math.random() * words.length)];
  const adj2 = words[Math.floor(Math.random() * words.length)];
  const noun = words[Math.floor(Math.random() * words.length)];
  return `${adj1} ${adj2} ${noun}`;
}

export default router;
