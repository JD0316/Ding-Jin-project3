import axios from 'axios';

// Ensure cookies are sent with every request
axios.defaults.withCredentials = true;

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

export default api;
