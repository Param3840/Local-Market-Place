import { io } from "socket.io-client";

// ✅ Use environment variable for flexibility
const BACKEND_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// ✅ Create socket connection
const socket = io(BACKEND_URL, {
  withCredentials: true,
});

export default socket;