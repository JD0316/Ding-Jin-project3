const express = require("express");
const cors = require("cors");
const session = require("express-session");
const mongoose = require("mongoose");

// Import routes
const userRoutes = require('./routes/userRoutes');

const app = express();

// Basic middleware
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173' // Allow requests from our React client
}));
app.use(express.json()); // To parse JSON bodies

// Session configuration
app.use(
  session({
    secret: "your-secret-key", // Replace with a real secret in production
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// MongoDB Connection
const MONGO_URI = "mongodb://127.0.0.1:27017/sudoku-app"; // Local MongoDB URI
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("MongoDB connection error:", err));


// --- API Routes ---
app.use('/api/user', userRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});