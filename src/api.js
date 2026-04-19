import axios from 'axios';

// Determine the base URL based on the environment
const isProduction = process.env.NODE_ENV === 'production';
const baseURL = isProduction 
  ? '/api' // In production, the server is at the same origin
  : 'http://localhost:4000/api'; // In development, it's on port 4000

// Ensure cookies are sent with every request
axios.defaults.withCredentials = true;

// Create an axios instance with the dynamic base URL
const api = axios.create({
  baseURL: baseURL,
});

console.log(`API running in ${isProduction ? 'production' : 'development'} mode. Base URL: ${baseURL}`);

export default api;
