const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Message = require("../models/Message");

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// GET /api/messages/:roomId → fetch all messages
router.get("/:roomId", async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error("❌ Error fetching messages:", err.message);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// POST /api/messages/media → upload image/video
router.post("/media", upload.single("file"), async (req, res) => {
  try {
    const { roomId, sender, time } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const mediaUrl = `/uploads/${file.filename}`;
    const mediaType = file.mimetype;

    const newMessage = new Message({
      roomId,
      sender,
      time,
      mediaUrl,
      mediaType,
      text: "", // No text for media-only message
    });

    await newMessage.save();

    res.json(newMessage);
  } catch (err) {
    console.error("❌ Media upload failed:", err.message);
    res.status(500).json({ error: "Failed to upload media" });
  }
});
// GET /api/messages/download/:filename → force download media file
router.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "../uploads", req.params.filename);
  res.download(filePath, (err) => {
    if (err) {
      console.error("❌ Download failed:", err.message);
      res.status(500).json({ error: "Failed to download file" });
    }
  });
});

module.exports = router;