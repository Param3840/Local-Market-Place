const express = require("express");
const router = express.Router();
const Seller = require("../models/Seller");
const mongoose = require("mongoose");

// ✅ Get seller profile by userId
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  // 🔒 Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid seller ID format" });
  }

  try {
    const seller = await Seller.findById(userId).select("name email shopName createdAt image");
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    res.json({
      name: seller.name,
      email: seller.email,
      shopName: seller.shopName,
      joinedAt: seller.createdAt,
      avatar: seller.image || null,
    });
  } catch (err) {
    console.error("❌ Failed to fetch seller profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
