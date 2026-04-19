import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  gamesWon: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model('User', UserSchema);

export default User; // Use ES module export
