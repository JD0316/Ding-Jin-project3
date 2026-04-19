# Full-Stack Sudoku - Project 3

This project builds a full-stack MERN (MongoDB, Express, React, Node.js) application for the classic puzzle game, Sudoku. It transforms the previous single-player version into a complete web service with user authentication, persistent game states, and a global high-score leaderboard.

---

## Project Information

- **GitHub Repo:** https://github.com/JD0316/Ding-Jin-project3.git


---

## Writeup

### What were some challenges you faced while making this app?

The most significant challenge was architecting the full-stack data flow, especially for the core gameplay loop. Unlike the previous project where all state was managed on the client, this version required constant communication between the React frontend and the Express backend. Designing the RESTful APIs to be efficient and secure, particularly the `PUT /api/sudoku/:gameId` endpoint that saves the board state after every move, was a complex task. Another major challenge was correctly implementing the 6x6 "Easy Mode" logic on the backend, as third-party libraries only support standard 9x9 generation, which required writing a custom Sudoku generator from scratch to ensure valid and solvable puzzles.

### Given more time, what additional features, functional or design changes would you make?

Given more time, I would implement the "Delete Game" bonus feature, allowing a game's creator to remove it from the system and correctly adjusting all associated user win counts. On the frontend, I would enhance the user experience by adding a real-time timer that persists across sessions and more sophisticated visual feedback, such as highlighting related cells or numbers when a user selects a square. Finally, I would containerize the application with Docker to streamline the development and deployment process further.

### What assumptions did you make while working on this assignment?

I assumed that for the core functionality, a stateless RESTful API design was the most appropriate architecture, with the client responsible for fetching and sending state while the server handles validation and persistence. I also assumed that for the high-score system, a simple count of total wins per user was sufficient, rather than a more complex time-based or per-puzzle leaderboard. Lastly, I assumed that the provided `sudoku-gen` library was reliable for generating standard 9x9 puzzles, but as discovered, I had to assume it was unsuitable for non-standard sizes, leading to the development of a custom generator.

### How long did this assignment take to complete?

This assignment took approximately 15 hours to complete.

### What bonus points did you accomplish?

- **Password Encryption (2 Bonus Points):** Accomplished. User passwords are never stored in plaintext. When a user registers, their password is first salted and then hashed using the `bcrypt` library. During login, the same process is applied to the submitted password, and the resulting hash is securely compared against the one stored in the database. This entire process is handled on the backend within `server/routes/userRoutes.js` to ensure maximum security.

---

## Getting Started Locally

To run this project on your local machine:

1.  **Prerequisites:** Ensure you have Node.js and MongoDB installed and running on your system.
2.  Clone the repository.
3.  Install dependencies:
    ```sh
    npm install
    ```
4.  Start the development server (this runs both client and server concurrently):
    ```sh
    npm start
    ```
- The backend server will run on `http://localhost:4000`.
- The frontend client will open automatically at `http://localhost:5173`.
