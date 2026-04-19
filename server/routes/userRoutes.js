import express from 'express';
import bcrypt from 'bcrypt'; // Import bcrypt
import User from '../models/User.js';

const router = express.Router();
const saltRounds = 10; // The cost factor for hashing

// POST /api/user/register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ username, password: hashedPassword }); // Save the hashed password
    await newUser.save();

    req.session.user = { id: newUser._id, username: newUser.username };
    res.status(201).json({ message: 'User registered successfully.', user: { id: newUser._id, username: newUser.username } });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// POST /api/user/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    req.session.user = { id: user._id, username: user.username };
    res.status(200).json({ message: 'Login successful.', user: { id: user._id, username: user.username } });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// GET /api/user/isLoggedIn
router.get('/isLoggedIn', (req, res) => {
  if (req.session.user) {
    res.status(200).json({ isLoggedIn: true, user: req.session.user });
  } else {
    res.status(200).json({ isLoggedIn: false });
  }
});

// POST /api/user/logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out, please try again.' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logout successful.' });
  });
});

export default router;
