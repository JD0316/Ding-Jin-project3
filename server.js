import express from 'express';
import mongoose from 'mongoose';
import session from "express-session";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

import userRoutes from './server/routes/userRoutes.js';
import sudokuRoutes from './server/routes/sudokuRoutes.js';
import highscoreRoutes from './server/routes/highscoreRoutes.js';

const app = express();

// --- Environment Variables ---
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sudoku-app-p3";
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// --- Middleware ---
app.use(cors({
    credentials: true,
    origin: FRONTEND_URL
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
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Required for cross-site cookies
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// --- MongoDB Connection ---
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- API Routes ---
app.use('/api/user', userRoutes);
app.use('/api/sudoku', sudokuRoutes);
app.use('/api/highscore', highscoreRoutes);

// --- Frontend Serving (for production) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontend_dir = path.join(__dirname, 'dist');

app.use(express.static(frontend_dir));
app.get('*', (req, res) => {
    res.sendFile(path.join(frontend_dir, "index.html"));
});

// --- Server Startup ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});
