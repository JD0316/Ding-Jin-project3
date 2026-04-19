import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  difficulty: {
    type: String,
    enum: ['EASY', 'NORMAL'],
    required: true,
  },
  board: {
    type: [[{ value: Number, isEditable: Boolean, isError: Boolean }]],
    required: true,
  },
  initialBoard: {
    type: [[{ value: Number, isEditable: Boolean, isError: Boolean }]],
    required: true,
  },
  solution: {
    type: [[Number]], // Storing the solution separately might be useful
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This creates a reference to the User model
    required: true,
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'in-progress',
  },
  timeTaken: {
    type: Number, // Time in seconds when completed
    default: 0,
  }
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

const Game = mongoose.model('Game', GameSchema);

export default Game;
