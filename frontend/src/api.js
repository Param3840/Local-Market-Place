// src/api.js

import axios from "axios";

// ✅ Create axios instance with dynamic base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE, // Set in .env file
  withCredentials: true, // Send cookies with requests
});

export default api;