import axios from "axios";

// ✅ Automatically switch between dev and prod
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://192.168.1.44:5000/api",
  withCredentials: true,
});

export default api;
