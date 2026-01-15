const express = require("express");
const router = express.Router();
const Buyer = require("../models/Buyer");

// ✅ Get buyer profile by userId
router.get("/:userId", async (req, res) => {
  try {
    const buyer = await Buyer.findById(req.params.userId);
    if (!buyer) return res.status(404).json({ error: "Buyer not found" });

    res.json({
      name: buyer.name,
      email: buyer.email,
      joinedAt: buyer.createdAt,
      image: buyer.image || null,
    });
  } catch (err) {
    console.error("❌ Failed to fetch buyer profile:", err.message);
    res.status(500).json({ error: "Failed to fetch buyer profile" });
  }
});

module.exports = router;
