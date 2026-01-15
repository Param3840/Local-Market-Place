// 📁 E:/LocalMarketPlace/backend/models/Conversation.js

const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    productId: { type: String, required: false }, // ✅ made optional
    buyerId: { type: String, required: true },
    sellerId: { type: String, required: true },
    roomId: { type: String, unique: true, required: true },
  },
  { timestamps: true } // ✅ adds createdAt and updatedAt
);

module.exports = mongoose.model("Conversation", conversationSchema);