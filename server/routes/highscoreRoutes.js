import express from 'express';
import User from '../models/User.js';
import Game from '../models/Game.js';

const router = express.Router();

// GET /api/highscore - Returns list of sorted high score list for games for users
// "This will be a list of all the users in the system and the number of games that they’ve won. 
// The list should be ordered from most wins to least (ties based on username), 
// and any user with 0 wins should not be shown on the screen."
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ gamesWon: { $gt: 0 } })
      .sort({ gamesWon: -1, username: 1 })
      .select('username gamesWon');
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching highscores:', error);
    res.status(500).json({ message: 'Server error while fetching highscores.' });
  }
});

// POST /api/highscore - Update the high score for a specific game
// We will call this when a game is successfully completed by a user.
router.post('/', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'You must be logged in.' });
  }
  try {
    // Increment the user's gamesWon count
    await User.findByIdAndUpdate(req.session.user.id, { $inc: { gamesWon: 1 } });
    res.status(200).json({ message: 'Highscore updated successfully.' });
  } catch (error) {
    console.error('Error updating highscore:', error);
    res.status(500).json({ message: 'Server error while updating highscore.' });
  }
});

// GET /api/highscore/:gameId - Return high score for specific game
// (Placeholder if we needed time-based highscores per game, but rubric mostly focuses on total wins)
router.get('/:gameId', async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId).populate('creator', 'username');
    if (!game) {
      return res.status(404).json({ message: 'Game not found.' });
    }
    if (game.status === 'completed') {
      res.status(200).json({ timeTaken: game.timeTaken, winner: game.creator.username });
    } else {
      res.status(200).json({ message: 'Game not completed yet.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching game highscore.' });
  }
});

export default router;