const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Dynamic CORS origins from .env
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map(origin => origin.trim().replace(/\/$/, ""))
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    const cleanOrigin = origin?.replace(/\/$/, "");
    console.log("🌐 Express CORS origin:", cleanOrigin || "NO ORIGIN");
    if (!cleanOrigin || allowedOrigins.includes(cleanOrigin)) {
      callback(null, true);
    } else {
      console.warn("❌ Blocked by CORS:", cleanOrigin);
      callback(new Error("Not allowed by CORS: " + cleanOrigin));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// ✅ Serve uploaded media
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      const cleanOrigin = origin?.replace(/\/$/, "");
      console.log("🌐 Socket.IO CORS origin:", cleanOrigin || "NO ORIGIN");
      if (!cleanOrigin || allowedOrigins.includes(cleanOrigin)) {
        callback(null, true);
      } else {
        console.warn("❌ Socket.IO CORS blocked:", cleanOrigin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ✅ Socket events
const Message = require("./models/Message");

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`📥 Joined room: ${roomId}`);
  });

  socket.on("send-message", async ({ roomId, sender, text, time }) => {
    if (roomId && sender && text && time) {
      try {
        const newMsg = await Message.create({ roomId, sender, text, time });
        io.to(roomId).emit("receive-message", newMsg);
        console.log(`📨 Message sent to room: ${roomId}`);
      } catch (err) {
        console.error("❌ Message save failed:", err.message);
      }
    } else {
      console.warn("⚠️ Incomplete message payload");
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ✅ Media upload route
app.post("/api/messages/media", upload.single("file"), async (req, res) => {
  try {
    const { roomId, sender, time } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const mediaUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
    const mediaType = file.mimetype;

    const newMessage = new Message({
      roomId,
      sender,
      time,
      mediaUrl,
      mediaType,
      text: "",
    });

    await newMessage.save();
    io.to(roomId).emit("receive-message", newMessage);
    res.json(newMessage);
  } catch (err) {
    console.error("❌ Media upload failed:", err.message);
    res.status(500).json({ error: "Failed to upload media" });
  }
});

// ✅ Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/buyer", require("./routes/buyerRoutes"));
app.use("/api/seller", require("./routes/sellerRoutes"));
app.use("/api/conversations", require("./routes/conversationRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

// ✅ Fallback for unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});