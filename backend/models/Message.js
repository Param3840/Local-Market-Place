const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true },
    sender: { type: String, required: true },
    text: { type: String, required: false }, // ✅ Optional now
    time: { type: String, required: true },
    mediaUrl: { type: String, required: false }, // ✅ New
    mediaType: { type: String, required: false }, // ✅ New
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);