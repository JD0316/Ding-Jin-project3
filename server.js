import express from 'express';
import mongoose from 'mongoose';
import session from "express-session";
import cors from "cors";
import path from 'path';

import userRoutes from './server/routes/userRoutes.js';
import sudokuRoutes from './server/routes/sudokuRoutes.js';
import highscoreRoutes from './server/routes/highscoreRoutes.js'; // Import new routes

const app = express();

// --- Middleware ---
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173' 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "cs5610-project3-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// --- MongoDB Connection ---
const MONGO_URI = "mongodb://127.0.0.1:27017/sudoku-app-p3";
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- API Routes ---
app.use('/api/user', userRoutes);
app.use('/api/sudoku', sudokuRoutes);
app.use('/api/highscore', highscoreRoutes); // Mount highscore routes

// --- Server Startup ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});