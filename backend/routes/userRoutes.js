const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Buyer = require("../models/Buyer");
const Seller = require("../models/Seller");

// ✅ Get user (buyer or seller) by ID
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  try {
    // 🔍 Try finding in Buyer collection
    let user = await Buyer.findById(userId).select("name email image");
    if (user) {
      return res.json({
        name: user.name,
        email: user.email,
        avatar: user.image || null,
        role: "buyer",
      });
    }

    // 🔍 Try finding in Seller collection
    user = await Seller.findById(userId).select("name email image shopName");
    if (user) {
      return res.json({
        name: user.name,
        email: user.email,
        avatar: user.image || null,
        shopName: user.shopName,
        role: "seller",
      });
    }

    return res.status(404).json({ error: "User not found" });
  } catch (err) {
    console.error("❌ Failed to fetch user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;